/**
 * Budding Mariners — IMU-CET 2026 registration collector
 * ------------------------------------------------------
 * This script receives registrations from the website form and
 * appends them as rows in this Google Sheet.
 *
 * SETUP (one time, ~3 minutes):
 *
 * 1. Create a new Google Sheet (sheets.new).
 * 2. Extensions → Apps Script.
 * 3. Delete any sample code, paste THIS entire file, click 💾 Save.
 * 4. Click "Deploy" → "New deployment".
 *      • Type:            Web app  (click the gear ⚙ → Web app)
 *      • Description:      BM registrations
 *      • Execute as:      Me
 *      • Who has access:  Anyone
 *    → Deploy → Authorize access → choose your account → Allow.
 * 5. Copy the "Web app URL" (ends with /exec).
 * 6. In your website project, set this in .env  AND  in Vercel/Netlify
 *    environment variables, then redeploy:
 *
 *      VITE_SHEETS_URL=https://script.google.com/macros/s/XXXX/exec
 *
 * Submissions now appear instantly in the "Registrations" tab. Done!
 *
 * To change the script later you must "Deploy → Manage deployments →
 * edit (pencil) → Version: New version → Deploy" (same URL stays valid).
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(30000); // avoid two submissions writing the same row

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Registrations');
    if (!sheet) {
      sheet = ss.insertSheet('Registrations');
    }
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Full Name', 'Mobile', 'Roll Number']);
      sheet.getRange(1, 1, 1, 4).setFontWeight('bold');
    }

    var p = (e && e.parameter) || {};
    sheet.appendRow([
      new Date(),
      p.fullName || '',
      p.mobile || '',
      p.rollNumber || '',
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

// Lets you open the /exec URL in a browser to confirm it's live.
function doGet() {
  return ContentService
    .createTextOutput('Budding Mariners registration endpoint is running ✅')
    .setMimeType(ContentService.MimeType.TEXT);
}
