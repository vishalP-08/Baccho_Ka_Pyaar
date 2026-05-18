/**
 * Budding Mariners — IMU-CET 2026 registration + timetable generator
 * ------------------------------------------------------------------
 * On each website registration this script:
 *   1. Appends the student to THIS Google Sheet
 *   2. Saves their passport photo to a Drive folder
 *   3. Generates a personalised, branded PDF TIMETABLE (logo, name,
 *      number, roll no, test dates/times and the DIRECT TEST LINKS)
 *   4. Emails the PDF to the student and returns its links so the
 *      website can auto-download it.
 *
 * Sheet columns (matches your headers):
 *   A Full Name | B Mobile Number | C IMU-CET Roll Number
 *   D Submitted At | E Photo | F Timetable | G Email
 *   (D/E/F/G auto-added)
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
    link: 'https://online-test.classplusapp.com/?testId=6a09b15bd20cb58564dff1e3&defaultLanguage=en',
  },
  {
    name: 'Mock Test 2',
    date: '22nd May 2026',
    time: '10:00 AM IST',
    link: 'https://online-test.classplusapp.com/?testId=6a09b15bd20cb58564dff1e3&defaultLanguage=en',
  },
];

// Optional: Drive folder IDs (from the folder URL after /folders/).
// Leave '' to auto-create folders.
var PHOTO_FOLDER_ID = '';
var TIMETABLE_FOLDER_ID = '';

// '' = first tab (gid=0). Set a tab name to override.
var SHEET_NAME = '';

// Logo shown on the PDF.
var BM_LOGO_URL =
  'https://storebybm.com/cdn/shop/files/66616e0050ff99708325d1d7.png?v=1740412439&width=140';

/**
 * ─────────────────────────────────────────────────────────────
 * SETUP (one time):
 *   1. Edit the TESTS links above. Save 💾.
 *   2. In your sheet: Extensions → Apps Script → paste this whole file.
 *   3. Deploy → New deployment → (⚙) Web app
 *        Execute as: Me   |   Who has access: Anyone   → Deploy
 *      Authorize → allow Sheets + Drive + Docs + Mail access.
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

/** Clears the default empty paragraph from a table cell. */
function clearCell_(cell) {
  while (cell.getNumChildren() > 0) {
    cell.removeChild(cell.getChild(0));
  }
}

/** Build a personalised timetable PDF and return the Drive file. */
function buildTimetablePdf_(p) {
  var BRAND_GOLD = '#C99A1F';
  var DARK = '#111111';
  var LIGHT_BG = '#F8F6F0';
  var BORDER = '#D8C58A';
  var BLUE = '#1155CC';

  var doc = DocumentApp.create('Timetable - ' + (p.fullName || 'Student'));
  var body = doc.getBody();

  body.setMarginTop(28).setMarginBottom(32).setMarginLeft(42).setMarginRight(42);

  /**************** HEADER WITH LOGO ****************/
  var headerTable = body.appendTable([['', '']]);
  headerTable.setBorderWidth(0);

  var leftCell = headerTable.getCell(0, 0);
  var rightCell = headerTable.getCell(0, 1);
  clearCell_(leftCell);
  clearCell_(rightCell);
  leftCell.setWidth(360);
  rightCell.setWidth(110);

  var title = leftCell.appendParagraph('BUDDING MARINERS');
  title.setHeading(DocumentApp.ParagraphHeading.HEADING1);
  title.editAsText().setForegroundColor(BRAND_GOLD).setBold(true).setFontSize(22);

  var sub = leftCell.appendParagraph('IMU-CET 2026 — Mock Test Timetable');
  sub.editAsText().setForegroundColor(DARK).setBold(true).setFontSize(13);

  var line = leftCell.appendParagraph(
    'Official mock test schedule for registered candidates',
  );
  line.editAsText().setForegroundColor('#555555').setFontSize(9);

  try {
    var logoBlob = UrlFetchApp.fetch(BM_LOGO_URL)
      .getBlob()
      .setName('BM_Logo.png');
    var logoPara = rightCell.appendParagraph('');
    logoPara.setAlignment(DocumentApp.HorizontalAlignment.RIGHT);
    var logo = logoPara.appendInlineImage(logoBlob);
    var ow = logo.getWidth();
    var oh = logo.getHeight();
    logo.setWidth(82);
    if (ow && oh) logo.setHeight(Math.round((82 * oh) / ow));
  } catch (err) {
    rightCell
      .appendParagraph('BM')
      .setAlignment(DocumentApp.HorizontalAlignment.RIGHT);
  }

  body.appendParagraph('');

  /**************** CANDIDATE DETAILS ****************/
  var cTitle = body.appendParagraph('Candidate Details');
  cTitle.setHeading(DocumentApp.ParagraphHeading.HEADING3);
  cTitle.editAsText().setForegroundColor(DARK).setBold(true);

  var detailsTable = body.appendTable([
    ['Name', p.fullName || ''],
    ['Mobile Number', p.mobile || ''],
    ['IMU-CET Roll Number', p.rollNumber || ''],
  ]);
  detailsTable.setBorderColor(BORDER);
  detailsTable.setBorderWidth(1);

  for (var i = 0; i < 3; i++) {
    var lc = detailsTable.getCell(i, 0);
    var vc = detailsTable.getCell(i, 1);
    lc.setBackgroundColor(LIGHT_BG);
    lc.setPaddingTop(6).setPaddingBottom(6).setPaddingLeft(8).setPaddingRight(8);
    vc.setPaddingTop(6).setPaddingBottom(6).setPaddingLeft(8).setPaddingRight(8);
    lc.editAsText().setBold(true).setForegroundColor(DARK).setFontSize(10);
    vc.editAsText().setForegroundColor(DARK).setFontSize(10);
  }

  body.appendParagraph('');

  /**************** TEST SCHEDULE ****************/
  var sTitle = body.appendParagraph('Your Test Schedule');
  sTitle.setHeading(DocumentApp.ParagraphHeading.HEADING3);
  sTitle.editAsText().setForegroundColor(DARK).setBold(true);

  var rows = [['Test', 'Date', 'Time', 'Direct Test Link']];
  TESTS.forEach(function (t) {
    rows.push([t.name, t.date, t.time, 'Open Test']);
  });

  var table = body.appendTable(rows);
  table.setBorderColor(BORDER);
  table.setBorderWidth(1);

  for (var c = 0; c < 4; c++) {
    var hc = table.getCell(0, c);
    hc.setBackgroundColor(BRAND_GOLD);
    hc.setPaddingTop(7).setPaddingBottom(7).setPaddingLeft(6).setPaddingRight(6);
    hc.editAsText().setBold(true).setForegroundColor('#FFFFFF').setFontSize(9);
  }

  for (var r = 1; r < rows.length; r++) {
    for (var col = 0; col < 4; col++) {
      var cell = table.getCell(r, col);
      cell.setPaddingTop(6).setPaddingBottom(6).setPaddingLeft(6).setPaddingRight(6);
      if (r % 2 === 0) cell.setBackgroundColor('#FBFAF6');
      cell.editAsText().setFontSize(9).setForegroundColor(DARK);
    }
    var linkCellText = table.getCell(r, 3).editAsText();
    var url = TESTS[r - 1].link;
    if (url && linkCellText.getText().length > 0) {
      linkCellText.setLinkUrl(0, linkCellText.getText().length - 1, url);
      linkCellText.setForegroundColor(BLUE).setBold(true).setUnderline(true);
    }
  }

  body.appendParagraph('');

  /**************** INSTRUCTIONS ****************/
  var iTitle = body.appendParagraph('Important Instructions');
  iTitle.setHeading(DocumentApp.ParagraphHeading.HEADING3);
  iTitle.editAsText().setForegroundColor(DARK).setBold(true);

  var instructionRows = [
    [
      '1.',
      'You need to give the test online using the direct link provided above in your timetable.',
    ],
    [
      '2.',
      'You need to provide your photo for verification of your identity at the time of Mock Test, as the exam is AI Proctored.',
    ],
    [
      '3.',
      'Join the test only during the allotted test window mentioned in the schedule.',
    ],
  ];

  var instructionTable = body.appendTable(instructionRows);
  instructionTable.setBorderColor(BORDER);
  instructionTable.setBorderWidth(1);

  for (var ir = 0; ir < instructionRows.length; ir++) {
    var numCell = instructionTable.getCell(ir, 0);
    var textCell = instructionTable.getCell(ir, 1);
    numCell.setWidth(32);
    numCell.setBackgroundColor(LIGHT_BG);
    numCell.setPaddingTop(6).setPaddingBottom(6).setPaddingLeft(6).setPaddingRight(6);
    textCell.setPaddingTop(6).setPaddingBottom(6).setPaddingLeft(6).setPaddingRight(6);
    numCell.editAsText().setBold(true).setForegroundColor(BRAND_GOLD).setFontSize(10);
    textCell.editAsText().setForegroundColor(DARK).setFontSize(9);
  }

  body.appendParagraph('');

  /**************** FOOTER ****************/
  var divider = body.appendParagraph(
    '────────────────────────────────────────',
  );
  divider.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  divider.editAsText().setForegroundColor('#DDDDDD');

  var foot = body.appendParagraph(
    'All the best, future mariner! — Budding Mariners',
  );
  foot.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  foot.editAsText().setItalic(true).setForegroundColor('#666666').setFontSize(10);

  doc.saveAndClose();

  /**************** EXPORT PDF ****************/
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
  docFile.setTrashed(true);

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
    if (!sheet.getRange('G1').getValue())
      sheet.getRange('G1').setValue('Email').setFontWeight('bold');

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

    // 3. Email the timetable to the student (best-effort)
    var email = String(p.email || '').trim();
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      try {
        var schedule = TESTS.map(function (t) {
          return (
            '<li><strong>' +
            t.name +
            '</strong> — ' +
            t.date +
            ', ' +
            t.time +
            ' — <a href="' +
            t.link +
            '">Test link</a></li>'
          );
        }).join('');

        MailApp.sendEmail({
          to: email,
          subject: 'Your IMU-CET 2026 Mock Test Timetable — Budding Mariners',
          htmlBody:
            '<p>Hi ' +
            (p.fullName || 'Future Mariner') +
            ',</p>' +
            '<p>Your registration is confirmed. Your personalised ' +
            'timetable is attached as a PDF.</p>' +
            '<p><strong>Your test schedule:</strong></p><ul>' +
            schedule +
            '</ul>' +
            '<p><strong>Instructions:</strong><br>' +
            '• Give the test online using the direct link in your ' +
            'timetable.<br>' +
            '• Keep your photo ready — the exam is AI Proctored and your ' +
            'identity will be verified.</p>' +
            '<p>All the best! — Budding Mariners ⚓</p>',
          attachments: [pdfFile.getBlob()],
          name: 'Budding Mariners',
        });
      } catch (mailErr) {
        // Mail quota/permission issue — registration still succeeds;
        // the student can still download the PDF from the website.
      }
    }

    // 4. Append the row
    sheet.appendRow([
      p.fullName || '',
      p.mobile || '',
      p.rollNumber || '',
      new Date(),
      photoUrl,
      viewUrl,
      email,
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
