// ============================================================
// Google Apps Script — 部署為 Web App
// ============================================================
// 使用方式：
// 1. 打開你的 Google Sheets: https://docs.google.com/spreadsheets/d/1JoqHxEhDiKkNRXZ2YxAFj4ujbnlWl-MUM-dhS9Yulcc/edit
// 2. 點選「擴充功能」>「Apps Script」
// 3. 將以下程式碼貼入 Apps Script 編輯器（取代預設的 myFunction）
// 4. 點選「部署」>「新增部署」
//    - 類型選「網頁應用程式」
//    - 執行身分選「我」
//    - 存取權限選「所有人」
// 5. 部署後複製 Web App URL
// 6. 將 URL 貼到專案的 .env.local 檔案中的 NEXT_PUBLIC_GOOGLE_SCRIPT_URL
// ============================================================

const SHEET_NAME = "工作表1"; // 如果你的工作表名稱不同，請修改這裡

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

    if (!sheet) {
      return ContentService.createTextOutput(
        JSON.stringify({ success: false, error: "Sheet not found" })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // 如果是第一次使用，自動建立表頭
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["項次", "提案人員", "提案問題", "期望得到的答覆", "提案日期"]);
    }

    // 自動計算項次 (最後一列行號 - 表頭行 = 目前筆數，+1 = 新項次)
    var itemNumber = sheet.getLastRow();

    sheet.appendRow([
      itemNumber,
      data.proposer,
      data.question,
      data.expectedResponse,
      data.date,
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ success: true })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

    if (!sheet || sheet.getLastRow() <= 1) {
      return ContentService.createTextOutput(
        JSON.stringify({ success: true, data: [] })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 5).getValues();
    const rows = data.map((row) => ({
      itemNumber: row[0],
      proposer: row[1],
      question: row[2],
      expectedResponse: row[3],
      date: row[4],
    }));

    return ContentService.createTextOutput(
      JSON.stringify({ success: true, data: rows })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
