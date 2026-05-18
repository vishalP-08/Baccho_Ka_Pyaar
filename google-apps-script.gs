/**
 * Budding Mariners — IMU-CET 2026 registration + timetable generator
 * ------------------------------------------------------------------
 * FAST version: builds the PDF directly from an HTML template
 * (Google's HTML→PDF converter) instead of creating/exporting a
 * Google Doc, and caches the logo + Drive folders. This cuts the
 * per-submission time from ~20s to a few seconds.
 *
 * On each registration it:
 *   1. Appends the student to THIS sheet (A–G)
 *   2. Saves the passport photo to a Drive folder
 *   3. Builds a branded personalised PDF timetable
 *   4. Emails the PDF and returns its links to the website
 *
 * Sheet: A Full Name | B Mobile | C Roll No | D Submitted At |
 *        E Photo | F Timetable | G Email   (D–G auto-added)
 *
 * ── PUT YOUR TEST LINKS HERE ──────────────────────────────────
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

// Optional fixed Drive folder IDs. Leave '' to auto-create + cache.
var PHOTO_FOLDER_ID = '';
var TIMETABLE_FOLDER_ID = '';
var SHEET_NAME = ''; // '' = first tab (gid=0)
var BM_LOGO_URL =
  'https://storebybm.com/cdn/shop/files/66616e0050ff99708325d1d7.png?v=1740412439&width=140';

/* ────────────────────────────────────────────────────────────
 * After editing: Deploy → Manage deployments → ✏️ →
 * Version: New version → Deploy. (URL stays the same.)
 * ──────────────────────────────────────────────────────────── */

function props_() {
  return PropertiesService.getScriptProperties();
}

function targetSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return SHEET_NAME ? ss.getSheetByName(SHEET_NAME) : ss.getSheets()[0];
}

/** Get (and cache) a Drive folder ID by name so we don't scan each time. */
function folderId_(fixedId, name, cacheKey) {
  if (fixedId) return fixedId;
  var cached = props_().getProperty(cacheKey);
  if (cached) {
    try {
      DriveApp.getFolderById(cached); // verify still exists
      return cached;
    } catch (e) {
      /* fall through and recreate */
    }
  }
  var it = DriveApp.getFoldersByName(name);
  var folder = it.hasNext() ? it.next() : DriveApp.createFolder(name);
  props_().setProperty(cacheKey, folder.getId());
  return folder.getId();
}

function makeAnyoneViewable_(file) {
  try {
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  } catch (e) {
    /* org policy may block link sharing; file still saved */
  }
}

/** Logo as a base64 data URI, fetched once then cached in properties. */
function logoDataUri_() {
  var cached = props_().getProperty('BM_LOGO_DATAURI');
  if (cached) return cached;
  try {
    var blob = UrlFetchApp.fetch(BM_LOGO_URL).getBlob();
    var uri =
      'data:' +
      blob.getContentType() +
      ';base64,' +
      Utilities.base64Encode(blob.getBytes());
    props_().setProperty('BM_LOGO_DATAURI', uri);
    return uri;
  } catch (e) {
    return '';
  }
}

function esc_(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Build the timetable HTML and convert straight to a PDF blob. */
function buildTimetablePdfBlob_(p) {
  var GOLD = '#C99A1F';
  var logo = logoDataUri_();

  var scheduleRows = TESTS.map(function (t, i) {
    var bg = i % 2 ? '#FBFAF6' : '#FFFFFF';
    return (
      '<tr style="background:' +
      bg +
      ';">' +
      '<td style="padding:8px;border:1px solid #D8C58A;font-size:11px;">' +
      esc_(t.name) +
      '</td>' +
      '<td style="padding:8px;border:1px solid #D8C58A;font-size:11px;">' +
      esc_(t.date) +
      '</td>' +
      '<td style="padding:8px;border:1px solid #D8C58A;font-size:11px;">' +
      esc_(t.time) +
      '</td>' +
      '<td style="padding:8px;border:1px solid #D8C58A;font-size:11px;">' +
      '<a href="' +
      esc_(t.link) +
      '" style="color:#1155CC;font-weight:bold;">Open Test</a></td>' +
      '</tr>'
    );
  }).join('');

  var html =
    '<html><body style="font-family:Arial,Helvetica,sans-serif;color:#111;margin:28px;">' +
    '<table style="width:100%;border:none;"><tr>' +
    '<td style="border:none;vertical-align:top;">' +
    '<div style="font-size:24px;font-weight:bold;color:' +
    GOLD +
    ';">BUDDING MARINERS</div>' +
    '<div style="font-size:14px;font-weight:bold;margin-top:4px;">IMU-CET 2026 — Mock Test Timetable</div>' +
    '<div style="font-size:10px;color:#555;margin-top:2px;">Official mock test schedule for registered candidates</div>' +
    '</td>' +
    '<td style="border:none;text-align:right;width:110px;vertical-align:top;">' +
    (logo ? '<img src="' + logo + '" style="width:84px;" />' : '') +
    '</td></tr></table>' +
    '<hr style="border:none;border-top:2px solid ' +
    GOLD +
    ';margin:14px 0;" />' +
    '<div style="font-size:14px;font-weight:bold;margin-bottom:6px;">Candidate Details</div>' +
    '<table style="border-collapse:collapse;width:100%;margin-bottom:18px;">' +
    '<tr><td style="padding:7px;border:1px solid #D8C58A;background:#F8F6F0;font-weight:bold;font-size:11px;width:200px;">Name</td>' +
    '<td style="padding:7px;border:1px solid #D8C58A;font-size:11px;">' +
    esc_(p.fullName) +
    '</td></tr>' +
    '<tr><td style="padding:7px;border:1px solid #D8C58A;background:#F8F6F0;font-weight:bold;font-size:11px;">Mobile Number</td>' +
    '<td style="padding:7px;border:1px solid #D8C58A;font-size:11px;">' +
    esc_(p.mobile) +
    '</td></tr>' +
    '<tr><td style="padding:7px;border:1px solid #D8C58A;background:#F8F6F0;font-weight:bold;font-size:11px;">IMU-CET Roll Number</td>' +
    '<td style="padding:7px;border:1px solid #D8C58A;font-size:11px;">' +
    esc_(p.rollNumber) +
    '</td></tr></table>' +
    '<div style="font-size:14px;font-weight:bold;margin-bottom:6px;">Your Test Schedule</div>' +
    '<table style="border-collapse:collapse;width:100%;margin-bottom:18px;">' +
    '<tr style="background:' +
    GOLD +
    ';color:#fff;">' +
    '<th style="padding:8px;border:1px solid #D8C58A;font-size:11px;text-align:left;">Test</th>' +
    '<th style="padding:8px;border:1px solid #D8C58A;font-size:11px;text-align:left;">Date</th>' +
    '<th style="padding:8px;border:1px solid #D8C58A;font-size:11px;text-align:left;">Time</th>' +
    '<th style="padding:8px;border:1px solid #D8C58A;font-size:11px;text-align:left;">Direct Test Link</th>' +
    '</tr>' +
    scheduleRows +
    '</table>' +
    '<div style="font-size:14px;font-weight:bold;margin-bottom:6px;">Important Instructions</div>' +
    '<ol style="font-size:11px;line-height:1.6;padding-left:18px;">' +
    '<li>You need to give the test online using the direct link provided above in your timetable.</li>' +
    '<li>You need to provide your photo for verification of your identity at the time of Mock Test, as the exam is <b style="color:' +
    GOLD +
    ';">AI Proctored</b>.</li>' +
    '<li>Join the test only during the allotted test window mentioned in the schedule.</li>' +
    '</ol>' +
    '<hr style="border:none;border-top:1px solid #DDD;margin:18px 0;" />' +
    '<div style="text-align:center;font-style:italic;color:#666;font-size:11px;">All the best, future mariner! — Budding Mariners</div>' +
    '</body></html>';

  var safeRoll = String(p.rollNumber || 'NA').replace(/[^\w-]/g, '_');
  var safeName = String(p.fullName || 'student').replace(/[^\w-]/g, '_');
  return Utilities.newBlob(html, 'text/html', 'tt.html')
    .getAs('application/pdf')
    .setName('Timetable_' + safeRoll + '_' + safeName + '.pdf');
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

    // 1. Photo → Drive
    var photoUrl = '';
    if (p.photoBase64) {
      var ext = p.photoType === 'image/png' ? 'png' : 'jpg';
      var pRoll = String(p.rollNumber || 'NA').replace(/[^\w-]/g, '_');
      var pName = String(p.fullName || 'student').replace(/[^\w-]/g, '_');
      var photoFolder = DriveApp.getFolderById(
        folderId_(PHOTO_FOLDER_ID, 'BM IMU-CET 2026 Photos', 'PHOTO_FOLDER'),
      );
      var photoFile = photoFolder.createFile(
        Utilities.newBlob(
          Utilities.base64Decode(p.photoBase64),
          p.photoType || 'image/jpeg',
          pRoll + '_' + pName + '_' + Date.now() + '.' + ext,
        ),
      );
      makeAnyoneViewable_(photoFile);
      photoUrl = photoFile.getUrl();
    }

    // 2. Build PDF (fast HTML→PDF)
    var pdfBlob = buildTimetablePdfBlob_(p);
    var ttFolder = DriveApp.getFolderById(
      folderId_(
        TIMETABLE_FOLDER_ID,
        'BM IMU-CET 2026 Timetables',
        'TT_FOLDER',
      ),
    );
    var pdfFile = ttFolder.createFile(pdfBlob);
    makeAnyoneViewable_(pdfFile);
    var pdfId = pdfFile.getId();
    var downloadUrl = 'https://drive.google.com/uc?export=download&id=' + pdfId;
    var viewUrl = pdfFile.getUrl();

    // 3. Email (best-effort, attach the in-memory blob — no extra read)
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
            ',</p><p>Your registration is confirmed. Your personalised ' +
            'timetable is attached as a PDF.</p>' +
            '<p><strong>Your test schedule:</strong></p><ul>' +
            schedule +
            '</ul><p><strong>Instructions:</strong><br>' +
            '• Give the test online using the direct link in your ' +
            'timetable.<br>• Keep your photo ready — the exam is AI ' +
            'Proctored and your identity will be verified.</p>' +
            '<p>All the best! — Budding Mariners ⚓</p>',
          attachments: [pdfBlob],
          name: 'Budding Mariners',
        });
      } catch (mailErr) {
        /* mail quota/permission — registration still succeeds */
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

function doGet() {
  return ContentService.createTextOutput(
    'Budding Mariners registration + timetable endpoint is running ✅',
  ).setMimeType(ContentService.MimeType.TEXT);
}
