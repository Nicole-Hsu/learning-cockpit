# Learning Cockpit — 專案設定（給 Codex / 其他 agent 讀）

## 這是什麼
「Learning Cockpit」是計畫中的課堂互動工具套件（repo：`learning-cockpit`），第一個工具是**課堂應答器**（教室即時作答系統，開發中）。之後會陸續把其他課堂工具（例如 KJ 便利貼牆）收進來，統一視覺風格、統一 repo。每個工具放 `tools/<工具名>/`，各自獨立運作與獨立資料，只共用視覺風格。

## 目前的工具
- **課堂應答器**：見同資料夾 `CLAUDE.md`；cockpit 是 `工作筆記_課堂應答器.md`。
- **KJ 便利貼牆**：仍獨立運作在 `D:\我的雲端硬碟\2026-KJ分類法\`，等課堂應答器做完再規劃安全搬入。

## Obsidian 設定（cockpit）
- Obsidian vault 絕對路徑：`D:\我的雲端硬碟\Obsidian_第二大腦\claude專案\`
- 課堂應答器的 cockpit（vault 相對路徑）：`工作筆記_課堂應答器.md`
- 開工讀它、收工寫它。進度不要混進共用 `工作筆記.md`。

## 開工/收工
- 開工用 `startup`（或相容的 startup-sync）、收工用 `shutdown`（或 shutdown-sync）；都會先讀本檔確認要用哪個工具的 cockpit。
- 隱私：不存真實學生姓名，只用座號 + 班級代號；不把 secrets 進 repo。
