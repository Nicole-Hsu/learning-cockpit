# Learning Cockpit — 專案設定（給 AI agent 讀）

## 這是什麼
「Learning Cockpit」是計畫中的**課堂互動工具套件**（repo：`learning-cockpit`），目前第一個工具正在開發中：**今日小挑戰**（教室即時作答系統，資料夾/Firebase 專案代號仍是 `classroom-responder`）。之後陸續會把其他課堂工具（例如 KJ 便利貼牆）一起收進這個套件，統一視覺風格、統一 repo。

- **共用設計語言**：沿用 `kj-affinity-board`（KJ 便利貼牆）的橘色系、圓角卡片（card）、彈跳動畫視覺風格——之後每個新工具都比照這套風格，可用不同主色區分工具，但版型/元件邏輯一致。
- **每個工具放 `tools/<工具名>/`**，各自獨立運作、獨立資料（Firebase 專案、Firestore 等都不共用），只共用視覺風格與這個 repo。

## 目前的工具

### 今日小挑戰（開發中，見 `工作筆記(cockpit): 工作筆記_今日小挑戰.md`；資料夾/Firebase 代號 `classroom-responder`）
- 教室即時作答系統（類似 Kahoot/Plickers 教室版）：老師發布一大題（可拆多個小題，可含文字/圖片），四選一 A-D；學生掃 QR code、輸入班級代碼 + 座號登入作答。
- 大題限時，小題不單獨限時；**一個大題開始後，底下所有小題一次全部顯示給學生**，可任意順序作答，不是老師一題題往下推進。
- 逾時未答自動算 timeout——**不寫額外的 `timedOut` 欄位**，統計時用算的：`responses` 裡沒有這筆記錄、且 `runs.startedAt + timeLimitSeconds` 已過，即視為 timeout。
- 同科別的題庫可以跨班級共用，但各班的作答資料、點名紀錄嚴格隔離，班級之間互不可見。
- 學生登入作答的動作本身兼作點名（座號 + 加入時間戳），不另外做點名介面。
- 課後統計答對數與作答耗時排名，且支援「當天全部 session 加總」（見下方 `sessions` 的 `date` 欄位）。
- **老師端即時投影「全班作答分佈」**（像 Kahoot 的長條圖，每個小題各選項被選次數即時更新）——用 `responses` 的 `onSnapshot` 監聽在前端算票數即可，不用額外的 collection，跟 kj 老師端即時渲染便利貼牆同一種做法。
- **視覺主色**：Tiffany 藍 `#0ABAB5`（跟 KJ 便利貼牆的橘色區分，其餘 card／圓角／排版風格沿用）。
- **Firebase 專案**：`classroom-responder`（獨立專案，Firestore + Google 登入白名單已啟用）。Web app SDK config：
  ```js
  const firebaseConfig = {
    apiKey: "AIzaSyCQ5a6CGci369p6s8ES90-duPXZlj6oSXM",
    authDomain: "classroom-responder.firebaseapp.com",
    projectId: "classroom-responder",
    storageBucket: "classroom-responder.firebasestorage.app",
    messagingSenderId: "648909917784",
    appId: "1:648909917784:web:29281a92dd32c34656c42d"
  };
  ```
  - **不用 Firebase Storage**：Storage 需要升級 Blaze 方案綁帳單才能用，這個工具用不到——小題圖片欄位改成**存圖片網址（URL）**。因為題庫是多老師共用（見下方權限說明），統一建議所有老師用免註冊圖床（ImgBB / Postimages，擇一）上傳圖片、複製「直接連結」（.jpg/.png 結尾）貼進表單，表單裡「圖片網址」欄位下方已經寫好操作步驟。（原本推薦 Imgur，但實測匿名上傳會出現 CREATE_ALBUM_FAIL，不穩，已改掉。）管理者自己另外也能把圖片放進這個 repo 的 `tools/classroom-responder/images/` 用 GitHub Pages 網址引用，但這個方式要透過 git 操作，其他老師沒辦法自己用，不適合當通用做法。
- **技術路線**：純前端 HTML/CSS/JS（vanilla JS，不用建置工具）+ Firebase（Firestore 即時同步 + Google 登入白名單，**不用 Storage**）。QR code 用 `qrcodejs`（cdnjs），房間/場次代碼用隨機 6 碼（排除易混淆字元）。Firebase 專案另開一個新的，不共用 `kj-affinity-board`。GitHub Pages 已開通，網址：`https://nicole-hsu.github.io/learning-cockpit/tools/classroom-responder/`。
- **資料模型（設計定案，尚未實作）**：
  - `teachers/{email}`：白名單 + 科別授權（`subjects: []`），比照 kj 的 `allowedEmails` 但多一個科別欄位。
  - `questionBanks/{bankId}`：一大題，含 `subject`、`timeLimitSeconds`、`subQuestions[]`（文字/圖片 URL、A-D 選項、正解）。依科別共用（讀權限看 `teachers.subjects` 是否包含該題庫科別）。
  - `classes/{classId}`：`teacherId`（uid）、`subject`、`roster`（座號名單，沿用 kj 的 `1-45` 範圍語法）。嚴格歸屬單一老師。
  - `sessions/{sessionId}`：某堂課，QR 碼指到這裡。含 `classId`、`date`（YYYY-MM-DD，用來跨 session 當日彙總排行榜）。子集合 `joined/{seatNo}`（點名，含 `joinedAt`）、`runs/{bankId}`（計時狀態，含 `startedAt`+`timeLimitSeconds`）、`responses/{seatNo_subQ}`（作答紀錄：選了什麼、是否正確、耗時；**不存 timedOut，缺記錄+已過期＝timeout**）。

### KJ 便利貼牆（規劃中，尚未搬入）
- 目前仍獨立運作在 `D:\我的雲端硬碟\2026-KJ分類法\tools\kj-affinity-board\`（已上線、有其他老師在用）。
- **等今日小挑戰做完、驗證過之後，再一起規劃怎麼安全搬進這個套件**（要處理舊網址失效、重新部署等風險，不能倉促做）。

## 規矩
- 每個工具的進度寫進該工具自己的 cockpit（例如今日小挑戰寫 `工作筆記_今日小挑戰.md`），不要混進共用的 `工作筆記.md`。
- 隱私：學生資料一律去識別化，只用座號 + 班級代號，不存真實姓名/學號；不把 Firebase config 以外的 secrets 進 repo。
