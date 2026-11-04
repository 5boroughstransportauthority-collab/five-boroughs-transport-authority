/* FBTA form receiver. Original implementation; no WordPress code or credentials.
 * Deploy as a Web app: execute as owner; access Anyone.
 * Needs only the script.send_mail OAuth scope. Never log submitted data.
 */
var FBTA = Object.freeze({
  protocol: "fbta-contact-v1",
  recipient: "Info@fiveboroughstransportauthority.com",
  prefix: "fbta_request_v1_",
  retentionMs: 48 * 60 * 60 * 1000,
  dayMs: 24 * 60 * 60 * 1000,
  burstMs: 10 * 60 * 1000,
  dailyLimit: 100,
  burstLimit: 10,
  senderCooldownMs: 60 * 1000
});

// Run once in the editor to request the owner's permission. Sends no message.
function authorizeFBTA() {
  return MailApp.getRemainingDailyQuota();
}

// Health check only; never sends mail or returns owner information.
function doGet() {
  return fbtaOutput_({protocol: FBTA.protocol, ready: true});
}

function doPost(event) {
  var requestId = "", lock = null, locked = false;
  try {
    var data = fbtaValidate_(event);
    requestId = data.request_id;
    if (data._gotcha) return fbtaReply_(requestId, false, "blocked");
    lock = LockService.getScriptLock();
    locked = lock.tryLock(1000);
    if (!locked) return fbtaReply_(requestId, false, "busy");
    var store = PropertiesService.getScriptProperties();
    var now = Date.now();
    var fingerprint = fbtaHash_(JSON.stringify([
      data.source_form, data.name, data.email, data.phone,
      data.subject, data.message, data.page
    ]));
    var senderHash = fbtaHash_(data.email.toLowerCase());
    var key = FBTA.prefix + requestId;
    var records = fbtaRecords_(store, now);
    var previous = records.filter(function (entry) { return entry.key === key; })[0];
    if (previous) {
      if (previous.value.fingerprint !== fingerprint) return fbtaReply_(requestId, false, "conflict");
      // Pending/uncertain sends are never retried automatically.
      return fbtaReply_(requestId, previous.value.state === "accepted",
        previous.value.state === "accepted" ? "accepted" : "uncertain");
    }
    var daily = records.filter(function (entry) { return now - entry.value.time < FBTA.dayMs; });
    var burst = daily.filter(function (entry) { return now - entry.value.time < FBTA.burstMs; });
    var sameSender = daily.some(function (entry) {
      return entry.value.sender === senderHash && now - entry.value.time < FBTA.senderCooldownMs;
    });
    if (burst.length >= FBTA.burstLimit || sameSender) return fbtaReply_(requestId, false, "rate_limited");
    if (daily.length >= FBTA.dailyLimit || MailApp.getRemainingDailyQuota() < 1) {
      return fbtaReply_(requestId, false, "quota");
    }
    var record = {time: now, fingerprint: fingerprint, sender: senderHash, state: "pending"};
    // Persist before sending: a lost browser response must not cause a second email.
    store.setProperty(key, JSON.stringify(record));
    var label = data.source_form === "comment" ? "Comment for review" : "Contact message";
    var body = [
      "FBTA website: " + label,
      "Reference: " + requestId,
      "Name: " + data.name,
      "Email: " + data.email,
      "Phone: " + (data.phone || "Not supplied"),
      "Subject: " + (data.subject || "Not supplied"),
      "Page (visitor supplied): " + data.page,
      "", "Message:", data.message || "No message text supplied.", "",
      "Submitted text and the reply address are unverified visitor input.",
      data.source_form === "comment" ? "Review manually; this comment has not been posted publicly." : ""
    ].join("\n");
    try {
      MailApp.sendEmail({
        to: FBTA.recipient,
        subject: "FBTA website — " + label,
        body: body,
        replyTo: data.email,
        name: "FBTA website"
      });
      record.state = "accepted";
      store.setProperty(key, JSON.stringify(record));
    } catch (sendError) {
      // An exception can occur after delivery was accepted. Preserve the pending
      // record and return uncertainty instead of sending again or claiming success.
      return fbtaReply_(requestId, false, "uncertain");
    }
    return fbtaReply_(requestId, true, "accepted");
  } catch (error) {
    var safeId = event && event.parameter && event.parameter.request_id;
    requestId = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/.test(safeId || "") ? safeId : "";
    return fbtaReply_(requestId, false, error && error.message === "Invalid input" ? "invalid" : "unavailable");
  } finally {
    if (locked) lock.releaseLock();
  }
}

function fbtaValidate_(event) {
  var invalid = function () { throw new Error("Invalid input"); };
  if (!event || !event.postData || event.postData.length > 60000 ||
      !/^application\/x-www-form-urlencoded(?:;|$)/i.test(event.postData.type || "") ||
      !event.parameters) invalid();
  var limits = {protocol: 32, request_id: 36, source_form: 7, name: 100, email: 254,
    phone: 60, subject: 160, message: 5000, page: 2048, _gotcha: 200};
  var data = Object.create(null);
  Object.keys(event.parameters).forEach(function (key) {
    var values = event.parameters[key];
    if (!Object.prototype.hasOwnProperty.call(limits, key) || !Array.isArray(values) ||
        values.length !== 1 || typeof values[0] !== "string" || values[0].length > limits[key]) invalid();
    data[key] = values[0].trim();
    if (key === "message") {
      if (/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(values[0])) invalid();
    } else if (/[\x00-\x1f\x7f]/.test(values[0])) invalid();
  });
  Object.keys(limits).forEach(function (key) { if (data[key] === undefined) data[key] = ""; });
  if (data.protocol !== FBTA.protocol || !/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/.test(data.request_id) ||
      ["452", "668", "comment"].indexOf(data.source_form) === -1 || !data.name ||
      !/^[A-Za-z0-9.!#$%&'*+\/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?\.[A-Za-z]{2,63}$/.test(data.email) ||
      !/^https?:\/\/[A-Za-z0-9.-]+(?::[0-9]{1,5})?(?:\/[^?#\s]*)?$/.test(data.page) ||
      (data.source_form === "comment" && !data.message)) invalid();
  return data;
}

function fbtaRecords_(store, now) {
  var all = store.getProperties(), records = [];
  Object.keys(all).forEach(function (key) {
    if (key.indexOf(FBTA.prefix) !== 0) return;
    var value = JSON.parse(all[key]);
    if (!value || !Number.isFinite(value.time) || value.time > now + 60000 ||
        !/^[a-f0-9]{64}$/.test(value.fingerprint) || !/^[a-f0-9]{64}$/.test(value.sender) ||
        ["pending", "accepted"].indexOf(value.state) === -1) throw new Error("Invalid stored state");
    if (now - value.time >= FBTA.retentionMs) store.deleteProperty(key);
    else records.push({key: key, value: value});
  });
  return records;
}

function fbtaHash_(value) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value, Utilities.Charset.UTF_8)
    .map(function (byte) { return (byte & 255).toString(16).padStart(2, "0"); }).join("");
}

function fbtaReply_(requestId, ok, code) {
  return fbtaOutput_({protocol: FBTA.protocol, request_id: requestId, ok: ok, code: code});
}

function fbtaOutput_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
