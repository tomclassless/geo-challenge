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
 * 試算表分頁約定:
 * - 每個「地區」一個分頁(分頁名即地區名,如「桃園」),第一列為標題:
 *     id | type | question | media | optA | optB | optC | optD | answer | explain
 *     type: text / image / video    answer: 正解選項字母(A/B/C/D)
 * - Players 分頁:第一列標題 name,之後每列一位小孩。
 * - Config 分頁:第一列標題 key | value,資料列例如:
 *     teacherPin   | 1234
 *     timerSeconds | 30
 * - Results 分頁:成績會自動寫入(沒有會自動建立)。
 */

var RESERVED = { 'Results': true, 'Players': true, 'Config': true, 'Regions': true };

function doGet() {
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

  return json({ regions: regions, players: players, config: config });
}

function doPost(e) {
  var rows = [];
  try {
    rows = (JSON.parse(e.postData.contents) || {}).results || [];
  } catch (err) {
    return json({ ok: false, error: 'bad json' });
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
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

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
