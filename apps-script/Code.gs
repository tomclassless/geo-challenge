/**
 * 地理大挑戰 — Google Apps Script 後端
 *
 * 部署方式:
 * 1. 打開你的 Google 試算表 → 擴充功能 → Apps Script。
 * 2. 把這整個檔案內容貼進去,存檔。
 * 3. 右上「部署」→「新增部署作業」→ 類型選「網頁應用程式」。
 *    - 執行身分:我(你自己)
 *    - 誰可以存取:「任何人」
 * 4. 複製產生的網址(/exec 結尾),貼到 App 首頁「老師設定」的「後端網址」。
 *
 * ⚠️ 圖片上傳功能(老師模式)需要 Google 雲端硬碟權限:
 *    第一次部署或更新此程式後,Apps Script 會跳出「需要授權」,請按授權並
 *    允許存取雲端硬碟。上傳的圖會放進一個叫「geo-challenge-media」的資料夾。
 *
 * 試算表分頁約定:
 * - 每個「地區」一個分頁(分頁名即地區名,如「桃園」),第一列為標題:
 *     id | type | question | media | optA | optB | optC | optD | answer | explain
 *     type: text / image / video    answer: 正解選項字母(A/B/C/D)
 *     media / type 欄可留空:在 App「題目圖片影片管理」選題目上傳圖片或貼
 *     YouTube 連結,App 會自動把檔名/連結與 type 寫回這兩欄。也可手動填
 *     完整網址(http 開頭)或自填檔名。
 * - Players 分頁:第一列標題 name,之後每列一位小孩。
 * - Config 分頁:第一列標題 key | value,資料列例如:
 *     teacherPin   | 1234
 *     timerSeconds | 30
 * - Results 分頁:成績會自動寫入(沒有會自動建立)。
 * - Media 分頁:圖片對應表(name | fileId | mimeType | updatedAt),會自動建立。
 */

var RESERVED = { 'Results': true, 'Players': true, 'Config': true, 'Regions': true, 'Media': true };

/** 統一檔名 key:去空白、轉小寫(前後端必須一致)。 */
function normName_(s) { return String(s == null ? '' : s).trim().toLowerCase(); }

function doGet(e) {
  // 媒體下載:?media=檔名 → 回 base64(Drive 直連會踩 CORS,所以一律中轉)。
  if (e && e.parameter && e.parameter.media) {
    return getMedia_(normName_(e.parameter.media));
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var regions = [];

  ss.getSheets().forEach(function (sh) {
    var name = sh.getName();
    if (RESERVED[name]) return;
    var data = sh.getDataRange().getValues();
    if (data.length < 2) return;

    var idx = {};
    data[0].forEach(function (h, i) { idx[String(h).trim().toLowerCase()] = i; });
    if (idx['id'] == null) return; // not a question sheet

    var questions = [];
    for (var r = 1; r < data.length; r++) {
      var row = data[r];
      var qid = row[idx['id']];
      if (qid === '' || qid == null) continue;

      var options = ['a', 'b', 'c', 'd']
        .map(function (L) { return idx['opt' + L] != null ? row[idx['opt' + L]] : ''; })
        .filter(function (v) { return v !== '' && v != null; })
        .map(String);

      var ansLetter = String(idx['answer'] != null ? row[idx['answer']] : 'A').trim().toUpperCase();
      var answerIndex = ansLetter ? ansLetter.charCodeAt(0) - 65 : 0;
      if (answerIndex < 0 || answerIndex >= options.length) answerIndex = 0;

      questions.push({
        id: String(qid),
        type: String(idx['type'] != null ? row[idx['type']] : 'text').trim().toLowerCase() || 'text',
        question: String(idx['question'] != null ? row[idx['question']] : ''),
        media: String(idx['media'] != null ? row[idx['media']] : ''),
        options: options,
        answerIndex: answerIndex,
        explain: String(idx['explain'] != null ? row[idx['explain']] : '')
      });
    }
    if (questions.length) regions.push({ name: name, questions: questions });
  });

  var players = [];
  var ps = ss.getSheetByName('Players');
  if (ps) {
    var pv = ps.getDataRange().getValues();
    for (var i = 1; i < pv.length; i++) {
      var n = pv[i][0];
      if (n !== '' && n != null) players.push(String(n));
    }
  }

  var config = { teacherPin: '', timerSeconds: 30 };
  var cs = ss.getSheetByName('Config');
  if (cs) {
    var cv = cs.getDataRange().getValues();
    for (var j = 1; j < cv.length; j++) {
      var k = String(cv[j][0] || '').trim();
      var val = cv[j][1];
      if (k === 'teacherPin') config.teacherPin = String(val);
      if (k === 'timerSeconds') config.timerSeconds = Number(val) || 30;
    }
  }

  return json({ regions: regions, players: players, config: config, mediaIndex: readMediaIndex_(ss) });
}

/** 讀 Media 分頁回 [{name, mimeType, updatedAt}](不含 bytes),供前端判斷雲端有哪些圖。 */
function readMediaIndex_(ss) {
  var sh = ss.getSheetByName('Media');
  if (!sh) return [];
  var data = sh.getDataRange().getValues();
  var out = [];
  for (var i = 1; i < data.length; i++) {
    var name = normName_(data[i][0]);
    if (!name) continue;
    out.push({ name: name, mimeType: String(data[i][2] || ''), updatedAt: String(data[i][3] || '') });
  }
  return out;
}

function doPost(e) {
  var body = {};
  try {
    body = JSON.parse(e.postData.contents) || {};
  } catch (err) {
    return json({ ok: false, error: 'bad json' });
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // --- media upload: saves an image to Drive (and writes the filename back to
  //     the question row when region+id are given). ---
  //     new:    { upload: { region, id, mimeType, dataBase64 } }  → auto name + write-back
  //     legacy: { upload: { name,   mimeType, dataBase64 } }      → store only
  if (body.upload && body.upload.dataBase64) {
    return saveMedia_(ss, body.upload);
  }

  // --- set media on a question: { setMedia: { region, id, media, type } } ---
  //     used for YouTube links / clearing — write-back only, no Drive file.
  if (body.setMedia && body.setMedia.region != null && body.setMedia.id != null) {
    var sm = body.setMedia;
    return writeBackMedia_(ss, String(sm.region), String(sm.id), String(sm.media || ''), String(sm.type || ''));
  }

  // --- roster update: { players: [...] } overwrites the Players sheet ---
  if (body.players && Object.prototype.toString.call(body.players) === '[object Array]') {
    var ps = ss.getSheetByName('Players');
    if (!ps) ps = ss.insertSheet('Players');
    ps.clearContents();
    ps.appendRow(['name']);
    body.players.forEach(function (n) {
      if (n !== '' && n != null) ps.appendRow([String(n)]);
    });
    return json({ ok: true, players: body.players.length });
  }

  // --- results upload: { results: [...] } appends to the Results sheet ---
  var rows = body.results || [];
  var sh = ss.getSheetByName('Results');
  if (!sh) {
    sh = ss.insertSheet('Results');
    sh.appendRow(['timestamp', 'region', 'sessionId', 'playerName', 'questionId', 'chosen', 'correct']);
  }
  rows.forEach(function (r) {
    sh.appendRow([r.timestamp, r.region, r.sessionId, r.playerName, r.questionId, r.chosen, r.correct]);
  });

  return json({ ok: true, added: rows.length });
}

// ---- 媒體(圖片)上傳 / 下載:存進 Google 雲端硬碟,對應表寫在 Media 分頁 ----

/** 取得(或建立)專用 Drive 資料夾;folderId 快取在 Config 分頁的 mediaFolderId。 */
function getMediaFolder_(ss) {
  var cs = ss.getSheetByName('Config');
  if (!cs) cs = ss.insertSheet('Config'), cs.appendRow(['key', 'value']);
  var cv = cs.getDataRange().getValues();
  for (var i = 1; i < cv.length; i++) {
    if (String(cv[i][0] || '').trim() === 'mediaFolderId') {
      var id = String(cv[i][1] || '').trim();
      if (id) {
        try { return DriveApp.getFolderById(id); } catch (err) { /* 失效 → 重建 */ }
      }
    }
  }
  var folder = DriveApp.createFolder('geo-challenge-media');
  cs.appendRow(['mediaFolderId', folder.getId()]);
  return folder;
}

/** 取得 Media 分頁(沒有就建)。 */
function getMediaSheet_(ss) {
  var sh = ss.getSheetByName('Media');
  if (!sh) {
    sh = ss.insertSheet('Media');
    sh.appendRow(['name', 'fileId', 'mimeType', 'updatedAt']);
  }
  return sh;
}

/** 由 mimeType 推副檔名(圖片用)。 */
function extFromMime_(mimeType) {
  var m = String(mimeType || '').toLowerCase();
  if (m.indexOf('png') >= 0) return 'png';
  if (m.indexOf('gif') >= 0) return 'gif';
  if (m.indexOf('webp') >= 0) return 'webp';
  return 'jpg';
}

/** 存一張圖:寫進 Drive,並在 Media 分頁新增/覆寫該檔名那列。
 *  - 新流程:upload 帶 region+id → 自動產生檔名,存檔後把 media/type 寫回題目那列。
 *  - 舊流程:upload 帶 name → 只存檔。 */
function saveMedia_(ss, upload) {
  try {
    var mimeType = String(upload.mimeType || 'application/octet-stream');
    var hasQ = upload.region != null && upload.id != null;
    var name = hasQ
      ? normName_(String(upload.region) + '-' + String(upload.id) + '.' + extFromMime_(mimeType))
      : normName_(upload.name);
    if (!name) return json({ ok: false, error: 'no name' });

    var bytes = Utilities.base64Decode(upload.dataBase64);
    var blob = Utilities.newBlob(bytes, mimeType, name);
    var folder = getMediaFolder_(ss);
    var file = folder.createFile(blob);
    var fileId = file.getId();

    var sh = getMediaSheet_(ss);
    var data = sh.getDataRange().getValues();
    var when = new Date().toISOString();
    var found = false;
    for (var r = 1; r < data.length; r++) {
      if (normName_(data[r][0]) === name) {
        var oldId = String(data[r][1] || '').trim();
        if (oldId && oldId !== fileId) {
          try { DriveApp.getFileById(oldId).setTrashed(true); } catch (err) { /* 舊檔已不在 */ }
        }
        sh.getRange(r + 1, 1, 1, 4).setValues([[name, fileId, mimeType, when]]);
        found = true;
        break;
      }
    }
    if (!found) sh.appendRow([name, fileId, mimeType, when]);

    // 新流程:把檔名與 type=image 寫回題目那一列。
    if (hasQ) {
      var wb = writeBackMediaInternal_(ss, String(upload.region), String(upload.id), name, 'image');
      if (!wb.ok) return json({ ok: false, error: '已存檔但寫回試算表失敗:' + wb.error });
    }

    return json({ ok: true, name: name, type: 'image', fileId: fileId, mimeType: mimeType, updatedAt: when });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

/** 依「地區(分頁名)+題目id」找到那一列,寫入 media 與 type 兩個儲存格。回 {ok, error}。 */
function writeBackMediaInternal_(ss, region, id, media, type) {
  var sh = ss.getSheetByName(region);
  if (!sh) return { ok: false, error: '找不到地區分頁:' + region };
  var data = sh.getDataRange().getValues();
  if (data.length < 2) return { ok: false, error: '分頁沒有資料:' + region };

  var idx = {};
  data[0].forEach(function (h, i) { idx[normName_(h)] = i; });
  if (idx['id'] == null) return { ok: false, error: '分頁缺 id 欄:' + region };
  if (idx['media'] == null) return { ok: false, error: '分頁缺 media 欄:' + region };

  for (var r = 1; r < data.length; r++) {
    if (String(data[r][idx['id']]) === String(id)) {
      sh.getRange(r + 1, idx['media'] + 1).setValue(media);
      if (idx['type'] != null && type) sh.getRange(r + 1, idx['type'] + 1).setValue(type);
      return { ok: true };
    }
  }
  return { ok: false, error: '找不到題目 id:' + id + '(地區 ' + region + ')' };
}

/** setMedia 分支用:寫回後回 json。 */
function writeBackMedia_(ss, region, id, media, type) {
  var wb = writeBackMediaInternal_(ss, region, id, media, type);
  return json(wb.ok ? { ok: true } : { ok: false, error: wb.error });
}

/** 回傳一張圖的 base64(?media=檔名)。 */
function getMedia_(name) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName('Media');
    if (!sh) return json({ ok: false, error: 'not found' });
    var data = sh.getDataRange().getValues();
    for (var r = 1; r < data.length; r++) {
      if (normName_(data[r][0]) === name) {
        var blob = DriveApp.getFileById(String(data[r][1])).getBlob();
        return json({
          ok: true,
          name: name,
          mimeType: String(data[r][2] || blob.getContentType() || ''),
          dataBase64: Utilities.base64Encode(blob.getBytes())
        });
      }
    }
    return json({ ok: false, error: 'not found' });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
