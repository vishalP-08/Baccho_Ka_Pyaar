/**
 * Budding Mariners — IMU-CET 2026 registration collector
 * ------------------------------------------------------
 * Appends each website registration into THIS Google Sheet,
 * matching the existing header layout:
 *
 *   A1: Full Name   B1: Mobile Number   C1: IMU-CET Roll Number
 *   (D1: Submitted At — added automatically, optional/harmless)
 *
 * IMPORTANT: create this script FROM the sheet itself so it is
 * bound to it — open your sheet:
 * https://docs.google.com/spreadsheets/d/1BIkrIdCUXgjT3vXYhkZAtzf2gWg96IosIUQVsTQ5zM8/edit
 * → Extensions → Apps Script, then paste this file.
 *
 * SETUP (one time, ~2 minutes):
 *
 * 1. In that sheet: Extensions → Apps Script.
 * 2. Delete sample code, paste THIS entire file, click 💾 Save.
 * 3. Deploy → New deployment → (gear ⚙) Web app
 *      • Execute as:      Me
 *      • Who has access:  Anyone
 *    → Deploy → Authorize access → your account → Allow.
 * 4. Copy the "Web app URL" (ends with /exec).
 * 5. In Netlify → Site configuration → Environment variables, add:
 *      VITE_SHEETS_URL = https://script.google.com/macros/s/XXXX/exec
 *    Then Deploys → Trigger deploy → Deploy site (env changes need a
 *    fresh build). Add the same line to your local .env too.
 *
 * Test: open the /exec URL in a browser — it should say the endpoint
 * is running. Then submit the form; a row appears instantly.
 *
 * After changing this script later: Deploy → Manage deployments →
 * edit (pencil) → Version: New version → Deploy (URL stays the same).
 *
 * You can keep the sheet PRIVATE — the script writes as you.
 */

// Which tab to write to. gid=0 is the first sheet. Leave as-is unless
// you want a specific tab, then set SHEET_NAME = 'YourTabName'.
var SHEET_NAME = '';

function targetSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return SHEET_NAME ? ss.getSheetByName(SHEET_NAME) : ss.getSheets()[0];
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(30000); // prevent two submissions clobbering one row

  try {
    var sheet = targetSheet_();
    var p = (e && e.parameter) || {};

    // Ensure the optional timestamp header exists in D1 (non-destructive).
    if (!sheet.getRange('D1').getValue()) {
      sheet.getRange('D1').setValue('Submitted At').setFontWeight('bold');
    }

    // Append in the exact column order of your headers:
    // A = Full Name, B = Mobile Number, C = IMU-CET Roll Number, D = time
    sheet.appendRow([
      p.fullName || '',
      p.mobile || '',
      p.rollNumber || '',
      new Date(),
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Lets you open the /exec URL in a browser to confirm it is live.
function doGet() {
  return ContentService
    .createTextOutput('Budding Mariners registration endpoint is running ✅')
    .setMimeType(ContentService.MimeType.TEXT);
}
