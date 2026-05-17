/**
 * Budding Mariners — IMU-CET 2026 registration collector
 * ------------------------------------------------------
 * Appends each website registration into THIS Google Sheet and saves
 * the uploaded passport photo into a Google Drive folder, writing the
 * photo link back into the sheet.
 *
 * Sheet columns (matches your existing headers):
 *   A: Full Name   B: Mobile Number   C: IMU-CET Roll Number
 *   D: Submitted At (auto)   E: Photo (auto — Drive link)
 *
 * IMPORTANT: create this script FROM the sheet so it is bound to it.
 * Open your sheet → Extensions → Apps Script → paste this file.
 *
 * SETUP (one time, ~3 minutes):
 *
 * 1. (Optional) Make a Drive folder for photos, open it, and copy the
 *    folder ID from its URL (the part after /folders/). Paste it into
 *    PHOTO_FOLDER_ID below. If you leave it blank, the script auto-
 *    creates a folder called "BM IMU-CET 2026 Photos".
 * 2. In your sheet: Extensions → Apps Script. Delete sample code,
 *    paste THIS entire file, click 💾 Save.
 * 3. Deploy → New deployment → (gear ⚙) Web app
 *      • Execute as:      Me
 *      • Who has access:  Anyone
 *    → Deploy → Authorize access → your account → Allow.
 *    (You'll be asked for Drive permission — that's for saving photos.)
 * 4. Copy the "Web app URL" (ends with /exec).
 * 5. Netlify → Site configuration → Environment variables, add:
 *      VITE_SHEETS_URL = https://script.google.com/macros/s/XXXX/exec
 *    Then Deploys → Trigger deploy → Deploy site. Add the same line
 *    to your local .env too.
 *
 * Test: open the /exec URL in a browser — it should say it's running.
 * Then submit the form; a row + a photo link appear instantly.
 *
 * After editing this script later: Deploy → Manage deployments →
 * edit (pencil) → Version: New version → Deploy (URL stays the same).
 *
 * Keep the sheet PRIVATE — the script runs as you.
 */

// Paste a Drive folder ID here to store photos in a specific folder,
// or leave '' to auto-create "BM IMU-CET 2026 Photos".
var PHOTO_FOLDER_ID = '';

// Which tab to write to. '' = first tab (gid=0). Set a name to override.
var SHEET_NAME = '';

function targetSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return SHEET_NAME ? ss.getSheetByName(SHEET_NAME) : ss.getSheets()[0];
}

function photoFolder_() {
  if (PHOTO_FOLDER_ID) return DriveApp.getFolderById(PHOTO_FOLDER_ID);
  var name = 'BM IMU-CET 2026 Photos';
  var existing = DriveApp.getFoldersByName(name);
  return existing.hasNext() ? existing.next() : DriveApp.createFolder(name);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(30000); // prevent two submissions clobbering one row

  try {
    var sheet = targetSheet_();
    var p = (e && e.parameter) || {};

    // Ensure optional headers exist (non-destructive).
    if (!sheet.getRange('D1').getValue()) {
      sheet.getRange('D1').setValue('Submitted At').setFontWeight('bold');
    }
    if (!sheet.getRange('E1').getValue()) {
      sheet.getRange('E1').setValue('Photo').setFontWeight('bold');
    }

    // Save the photo to Drive (if one was sent).
    var photoUrl = '';
    if (p.photoBase64) {
      var safeRoll = String(p.rollNumber || 'NA').replace(/[^\w-]/g, '_');
      var safeName = String(p.fullName || 'student').replace(/[^\w-]/g, '_');
      var ext = (p.photoType === 'image/png') ? 'png' : 'jpg';
      var fileName =
        safeRoll + '_' + safeName + '_' + new Date().getTime() + '.' + ext;

      var bytes = Utilities.base64Decode(p.photoBase64);
      var blob = Utilities.newBlob(
        bytes,
        p.photoType || 'image/jpeg',
        fileName,
      );
      var file = photoFolder_().createFile(blob);
      try {
        file.setSharing(
          DriveApp.Access.ANYONE_WITH_LINK,
          DriveApp.Permission.VIEW,
        );
      } catch (shareErr) {
        // Domain policy may block link-sharing; the file is still saved
        // in your folder and openable by you.
      }
      photoUrl = file.getUrl();
    }

    // Append in the exact column order:
    // A Full Name | B Mobile | C Roll No | D Submitted At | E Photo
    sheet.appendRow([
      p.fullName || '',
      p.mobile || '',
      p.rollNumber || '',
      new Date(),
      photoUrl,
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
