# 課堂應答器 — 專案設定（給 Codex / 其他 agent 讀）

## Obsidian 設定（cockpit）
- Obsidian vault 絕對路徑：`D:\我的雲端硬碟\Obsidian_第二大腦\claude專案\`
- 本專案 cockpit（vault 相對路徑）：`工作筆記_課堂應答器.md`
- 開工讀它、收工寫它。進度不要混進共用 `工作筆記.md`。

## 專案簡介
- 教室即時作答系統（類似 Kahoot/Plickers 的教室版）：老師發布一大題（可拆多個小題，可含文字/圖片），四選一 A-D；學生掃 QR code、輸入班級代碼 + 座號登入作答。
- 大題限時，小題不單獨限時，逾時未答自動算 timeout。
- 同科別的題庫可以跨班級共用，但各班的作答資料、點名紀錄嚴格隔離。
- 學生登入作答的動作本身兼作點名，不另外做點名介面。
- 技術路線、資料模型細節見同資料夾的 `CLAUDE.md`。
- GitHub repo：`classroom-responder`（獨立新 repo）；Firebase 專案另開，不共用 `kj-affinity-board`。

## 開工/收工
- 開工用 `startup`（或相容的 startup-sync）、收工用 `shutdown`（或 shutdown-sync）；都會先讀本檔的 cockpit 宣告。
- 隱私：不存真實學生姓名，只用座號 + 班級代號；不把 secrets 進 repo。
