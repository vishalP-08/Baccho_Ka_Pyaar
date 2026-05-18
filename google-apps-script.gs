/**
 * Budding Mariners — IMU-CET 2026 registration + timetable generator
 * ------------------------------------------------------------------
 * On each website registration this script:
 *   1. Appends the student to THIS Google Sheet
 *   2. Saves their passport photo to a Drive folder
 *   3. Generates a personalised PDF TIMETABLE (name, number, roll no,
 *      test dates/times and the DIRECT TEST LINKS you set below)
 *   4. Returns the PDF download + view links to the website, which
 *      auto-downloads the PDF for the student.
 *
 * Sheet columns (matches your headers):
 *   A Full Name | B Mobile Number | C IMU-CET Roll Number
 *   D Submitted At | E Photo | F Timetable   (D/E/F auto-added)
 *
 * ─────────────────────────────────────────────────────────────
 * STEP 1 — PUT YOUR TEST LINKS HERE  (edit the `link:` values)
 * ─────────────────────────────────────────────────────────────
 */
var TESTS = [
  {
    name: 'Mock Test 1',
    date: '20th May 2026',
    time: '10:00 AM IST',
    link: 'PASTE_TEST_1_DIRECT_LINK_HERE',
  },
  {
    name: 'Mock Test 2',
    date: '22nd May 2026',
    time: '10:00 AM IST',
    link: 'PASTE_TEST_2_DIRECT_LINK_HERE',
  },
];

// Optional: Drive folder IDs (from the folder URL after /folders/).
// Leave '' to auto-create folders.
var PHOTO_FOLDER_ID = '';
var TIMETABLE_FOLDER_ID = '';

// '' = first tab (gid=0). Set a tab name to override.
var SHEET_NAME = '';

/**
 * ─────────────────────────────────────────────────────────────
 * SETUP (one time):
 *   1. Edit the TESTS links above. Save 💾.
 *   2. In your sheet: Extensions → Apps Script → paste this whole file.
 *   3. Deploy → New deployment → (⚙) Web app
 *        Execute as: Me   |   Who has access: Anyone   → Deploy
 *      Authorize → allow Sheets + Drive + Docs access.
 *   4. Copy the Web app URL (ends /exec).
 *   5. Netlify → Environment variables → VITE_SHEETS_URL = that URL
 *      → Trigger deploy. Add same line to local .env.
 *
 * Edited the script later? Deploy → Manage deployments → ✏️ →
 * Version: New version → Deploy (URL stays the same).
 * ─────────────────────────────────────────────────────────────
 */

function targetSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return SHEET_NAME ? ss.getSheetByName(SHEET_NAME) : ss.getSheets()[0];
}

function folderByIdOrName_(id, name) {
  if (id) return DriveApp.getFolderById(id);
  var it = DriveApp.getFoldersByName(name);
  return it.hasNext() ? it.next() : DriveApp.createFolder(name);
}

function makeAnyoneViewable_(file) {
  try {
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  } catch (e) {
    // Org policy may block link sharing; file still saved & owner-readable.
  }
}

/** Build a personalised timetable PDF and return the Drive file. */
function buildTimetablePdf_(p) {
  var doc = DocumentApp.create('Timetable - ' + (p.fullName || 'Student'));
  var body = doc.getBody();
  body.setMarginTop(36).setMarginBottom(36).setMarginLeft(48).setMarginRight(48);

  var title = body.appendParagraph('BUDDING MARINERS');
  title.setHeading(DocumentApp.ParagraphHeading.TITLE);
  title.editAsText().setForegroundColor('#C99A1F');

  var sub = body.appendParagraph('IMU-CET 2026 — Mock Test Timetable');
  sub.setHeading(DocumentApp.ParagraphHeading.HEADING2);

  body.appendParagraph('');
  body.appendParagraph('Candidate Details').setHeading(
    DocumentApp.ParagraphHeading.HEADING3,
  );
  body.appendParagraph('Name:  ' + (p.fullName || ''));
  body.appendParagraph('Mobile Number:  ' + (p.mobile || ''));
  body.appendParagraph('IMU-CET Roll Number:  ' + (p.rollNumber || ''));

  body.appendParagraph('');
  body.appendParagraph('Your Test Schedule').setHeading(
    DocumentApp.ParagraphHeading.HEADING3,
  );

  var rows = [['Test', 'Date', 'Time', 'Direct Test Link']];
  TESTS.forEach(function (t) {
    rows.push([t.name, t.date, t.time, t.link]);
  });
  var table = body.appendTable(rows);

  // Style header row + make link cells clickable.
  for (var c = 0; c < 4; c++) {
    table.getCell(0, c).editAsText().setBold(true);
  }
  for (var r = 1; r < rows.length; r++) {
    var linkText = table.getCell(r, 3).editAsText();
    var url = TESTS[r - 1].link;
    if (linkText.getText().length > 0) {
      linkText.setLinkUrl(0, linkText.getText().length - 1, url);
      linkText.setForegroundColor('#1155CC');
    }
  }

  body.appendParagraph('');
  body.appendParagraph('Important Instructions').setHeading(
    DocumentApp.ParagraphHeading.HEADING3,
  );
  body
    .appendListItem(
      'You need to give the test online using the direct link provided ' +
        'above in your time table.',
    )
    .setGlyphType(DocumentApp.GlyphType.BULLET);
  body
    .appendListItem(
      'You need to provide your photo for verification of your identity ' +
        'at the time of exam, as the exam is AI proctored.',
    )
    .setGlyphType(DocumentApp.GlyphType.BULLET);

  body.appendParagraph('');
  var foot = body.appendParagraph(
    'All the best, future mariner! — Budding Mariners',
  );
  foot.editAsText().setItalic(true).setForegroundColor('#666666');

  doc.saveAndClose();

  // Export the Doc as a PDF into the timetable folder, then bin the Doc.
  var docFile = DriveApp.getFileById(doc.getId());
  var pdfBlob = docFile.getAs('application/pdf');
  var safeRoll = String(p.rollNumber || 'NA').replace(/[^\w-]/g, '_');
  var safeName = String(p.fullName || 'student').replace(/[^\w-]/g, '_');
  pdfBlob.setName('Timetable_' + safeRoll + '_' + safeName + '.pdf');

  var folder = folderByIdOrName_(
    TIMETABLE_FOLDER_ID,
    'BM IMU-CET 2026 Timetables',
  );
  var pdfFile = folder.createFile(pdfBlob);
  makeAnyoneViewable_(pdfFile);
  docFile.setTrashed(true); // remove the intermediate Google Doc

  return pdfFile;
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(30000);

  try {
    var sheet = targetSheet_();
    var p = (e && e.parameter) || {};

    if (!sheet.getRange('D1').getValue())
      sheet.getRange('D1').setValue('Submitted At').setFontWeight('bold');
    if (!sheet.getRange('E1').getValue())
      sheet.getRange('E1').setValue('Photo').setFontWeight('bold');
    if (!sheet.getRange('F1').getValue())
      sheet.getRange('F1').setValue('Timetable').setFontWeight('bold');

    // 1. Save photo to Drive
    var photoUrl = '';
    if (p.photoBase64) {
      var ext = p.photoType === 'image/png' ? 'png' : 'jpg';
      var pRoll = String(p.rollNumber || 'NA').replace(/[^\w-]/g, '_');
      var pName = String(p.fullName || 'student').replace(/[^\w-]/g, '_');
      var blob = Utilities.newBlob(
        Utilities.base64Decode(p.photoBase64),
        p.photoType || 'image/jpeg',
        pRoll + '_' + pName + '_' + new Date().getTime() + '.' + ext,
      );
      var photoFolder = folderByIdOrName_(
        PHOTO_FOLDER_ID,
        'BM IMU-CET 2026 Photos',
      );
      var photoFile = photoFolder.createFile(blob);
      makeAnyoneViewable_(photoFile);
      photoUrl = photoFile.getUrl();
    }

    // 2. Generate personalised timetable PDF
    var pdfFile = buildTimetablePdf_(p);
    var pdfId = pdfFile.getId();
    var downloadUrl = 'https://drive.google.com/uc?export=download&id=' + pdfId;
    var viewUrl = pdfFile.getUrl();

    // 3. Append the row
    sheet.appendRow([
      p.fullName || '',
      p.mobile || '',
      p.rollNumber || '',
      new Date(),
      photoUrl,
      viewUrl,
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({
        result: 'success',
        pdf: { downloadUrl: downloadUrl, viewUrl: viewUrl, fileId: pdfId },
      }),
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: 'error', message: String(err) }),
    ).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Open the /exec URL in a browser to confirm the endpoint is live.
function doGet() {
  return ContentService.createTextOutput(
    'Budding Mariners registration + timetable endpoint is running ✅',
  ).setMimeType(ContentService.MimeType.TEXT);
}
