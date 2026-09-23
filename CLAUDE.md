# Learning Cockpit — 專案設定（給 AI agent 讀）

## 這是什麼
「Learning Cockpit」是計畫中的**課堂互動工具套件**（repo：`learning-cockpit`），目前第一個工具正在規劃/開發中：**課堂應答器**（教室即時作答系統）。之後陸續會把其他課堂工具（例如 KJ 便利貼牆）一起收進這個套件，統一視覺風格、統一 repo。

- **共用設計語言**：沿用 `kj-affinity-board`（KJ 便利貼牆）的橘色系、圓角卡片（card）、彈跳動畫視覺風格——之後每個新工具都比照這套風格，可用不同主色區分工具，但版型/元件邏輯一致。
- **每個工具放 `tools/<工具名>/`**，各自獨立運作、獨立資料（Firebase 專案、Firestore 等都不共用），只共用視覺風格與這個 repo。

## 目前的工具

### 課堂應答器（開發中，見 `工作筆記(cockpit): 工作筆記_課堂應答器.md`）
- 教室即時作答系統（類似 Kahoot/Plickers 教室版）：老師發布一大題（可拆多個小題，可含文字/圖片），四選一 A-D；學生掃 QR code、輸入班級代碼 + 座號登入作答。
- 大題限時，小題不單獨限時，逾時未答自動算 timeout。
- 同科別的題庫可以跨班級共用，但各班的作答資料、點名紀錄嚴格隔離，班級之間互不可見。
- 學生登入作答的動作本身兼作點名（座號 + 加入時間戳），不另外做點名介面。
- 課後統計答對數與作答耗時排名。
- **技術路線**：純前端 HTML/CSS/JS（vanilla JS，不用建置工具）+ Firebase（Firestore 即時同步 + Google 登入白名單）。QR code 用 `qrcodejs`（cdnjs），房間/場次代碼用隨機 6 碼（排除易混淆字元）。Firebase 專案另開一個新的，不共用 `kj-affinity-board`。
- **資料模型（設計定案，尚未實作）**：
  - `teachers/{email}`：白名單 + 科別授權（`subjects: []`），比照 kj 的 `allowedEmails` 但多一個科別欄位。
  - `questionBanks/{bankId}`：一大題，含 `subject`、`timeLimitSeconds`、`subQuestions[]`（文字/圖片、A-D 選項、正解）。依科別共用（讀權限看 `teachers.subjects` 是否包含該題庫科別）。
  - `classes/{classId}`：`teacherId`（uid）、`subject`、`roster`（座號名單，沿用 kj 的 `1-45` 範圍語法）。嚴格歸屬單一老師。
  - `sessions/{sessionId}`：某堂課，QR 碼指到這裡。子集合 `joined/{seatNo}`（點名，含 `joinedAt`）、`runs/{bankId}`（計時狀態，含 `startedAt`+`timeLimitSeconds`）、`responses/{seatNo_subQ}`（作答紀錄，含是否正確、耗時、是否 timeout）。

### KJ 便利貼牆（規劃中，尚未搬入）
- 目前仍獨立運作在 `D:\我的雲端硬碟\2026-KJ分類法\tools\kj-affinity-board\`（已上線、有其他老師在用）。
- **等課堂應答器做完、驗證過之後，再一起規劃怎麼安全搬進這個套件**（要處理舊網址失效、重新部署等風險，不能倉促做）。

## 規矩
- 每個工具的進度寫進該工具自己的 cockpit（例如課堂應答器寫 `工作筆記_課堂應答器.md`），不要混進共用的 `工作筆記.md`。
- 隱私：學生資料一律去識別化，只用座號 + 班級代號，不存真實姓名/學號；不把 Firebase config 以外的 secrets 進 repo。
