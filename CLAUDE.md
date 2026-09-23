# 課堂應答器 — 專案設定（給 AI agent 讀）

## 工作筆記(cockpit): 工作筆記_課堂應答器.md
- Obsidian vault：`D:\我的雲端硬碟\Obsidian_第二大腦\claude專案\`
- 本專案 cockpit：`工作筆記_課堂應答器.md`（開工讀、收工寫，三 agent 一致）

## 專案簡介
- 教室即時作答系統（類似 Kahoot/Plickers 的教室版）：老師發布一大題（可拆多個小題，可含文字/圖片），四選一 A-D；學生掃 QR code、輸入班級代碼 + 座號登入作答。
- 大題限時，小題不單獨限時，逾時未答自動算 timeout。
- 同科別的題庫可以跨班級共用，但各班的作答資料、點名紀錄嚴格隔離，班級之間互不可見。
- 學生登入作答的動作本身兼作點名（座號 + 加入時間戳），不另外做點名介面。
- 課後統計答對數與作答耗時排名。

## 技術路線
- 比照 `kj-affinity-board`（另一個班級工具，見 `D:\我的雲端硬碟\2026-KJ分類法\tools\kj-affinity-board\`）的做法：純前端 HTML/CSS/JS（vanilla JS，不用建置工具）+ Firebase（Firestore 即時同步 + Google 登入白名單）。
- QR code 用 `qrcodejs`（cdnjs），房間/場次代碼用隨機 6 碼（排除易混淆字元）。
- Firebase 專案：計畫另外開一個新專案，不共用 `kj-affinity-board` 的 `kj-affinity-board` 專案。
- 部署：GitHub Pages，repo `classroom-responder`（獨立新 repo，不跟 `claude-projects` 共用，避免重蹈同一 repo 多本機複本互相不同步的問題）。

## 資料模型（設計定案，尚未實作）
- `teachers/{email}`：白名單 + 科別授權（`subjects: []`），比照 kj 的 `allowedEmails` 但多一個科別欄位。
- `questionBanks/{bankId}`：一大題，含 `subject`、`timeLimitSeconds`、`subQuestions[]`（文字/圖片、A-D 選項、正解）。依科別共用（讀權限看 `teachers.subjects` 是否包含該題庫科別）。
- `classes/{classId}`：`teacherId`（uid）、`subject`、`roster`（座號名單，沿用 kj 的 `1-45` 範圍語法）。嚴格歸屬單一老師。
- `sessions/{sessionId}`：某堂課，QR 碼指到這裡。子集合 `joined/{seatNo}`（點名，含 `joinedAt`）、`runs/{bankId}`（計時狀態，含 `startedAt`+`timeLimitSeconds`）、`responses/{seatNo_subQ}`（作答紀錄，含是否正確、耗時、是否 timeout）。

## 規矩
- 進度只寫進 cockpit（`工作筆記_課堂應答器.md`），不要混進共用的 `工作筆記.md`。
- 隱私：學生資料一律去識別化，只用座號 + 班級代號，不存真實姓名/學號；不把 Firebase config 以外的 secrets 進 repo。
