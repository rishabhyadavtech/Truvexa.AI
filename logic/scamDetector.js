const { getLanguage } = require("./languageEngine");
const { analyzeURL } = require("./urlAnalyzer");

function detectScam(input, lang = "en") {
const L = getLanguage(lang);
let text = input.toLowerCase();
const urlAnalysis = analyzeURL(input);

  let riskScore = 0;
riskScore += urlAnalysis.risk;

// Core analysis
let signals = [];
let reasons = [];
let advice = [];
let scamTypes = [];

// NEW: Evidence engine
let evidence = [];

// NEW: Pattern matches
let matchedPatterns = [];

signals.push(...urlAnalysis.signals);

reasons.push(
  ...urlAnalysis.reasons.map(r => L.reasons[r] || r)
);

advice.push(...urlAnalysis.advice);

evidence.push(...urlAnalysis.evidence);

// NEW: Context
let context = {
  hasMoney: false,
  hasUrgency: false,
  hasFear: false,
  hasLink: false,
  hasSensitiveInfo: false,
  hasGreed: false
};

  // 🎯 CONTEXT FLAGS

const hasLink = urlAnalysis.found;

const hasOTP =
text.includes("otp");

const hasBank =
text.includes("bank") ||
text.includes("account") ||
text.includes("rbi");

const hasMoney =
text.includes("rupees") ||
text.includes("rs") ||
text.includes("lakh") ||
text.includes("money") ||
text.includes("payment") ||
text.includes("salary") ||
text.includes("income");

const hasUrgency =
text.includes("urgent") ||
text.includes("immediately") ||
text.includes("now") ||
text.includes("within") ||
text.includes("expire") ||
text.includes("act fast") ||
text.includes("last chance");

const hasFear =
text.includes("blocked") ||
text.includes("suspended") ||
text.includes("legal action") ||
text.includes("warning") ||
text.includes("penalty");

const hasGreed =
  text.includes("win") ||
  text.includes("reward") ||
  text.includes("prize") ||
  text.includes("free") ||
  text.includes("offer");

const hasJob =
  text.includes("job") ||
  text.includes("work from home") ||
  text.includes("vacancy") ||
  text.includes("hiring") ||
  text.includes("recruitment") ||
  text.includes("part time") ||
  text.includes("full time") ||
  text.includes("salary") ||
  text.includes("earn money");

const hasFee =
  text.includes("fee") ||
  text.includes("registration fee") ||
  text.includes("processing fee") ||
  text.includes("security deposit") ||
  text.includes("advance payment") ||
  text.includes("pay first") ||
  text.includes("joining fee");

const hasNoExperience =
  text.includes("no experience") ||
  text.includes("without experience") ||
  text.includes("freshers") ||
  text.includes("experience not required");

const hasSensitiveInfo =
  hasOTP && hasBank;

// Context
context.hasMoney = hasMoney;
context.hasUrgency = hasUrgency;
context.hasFear = hasFear;
context.hasLink = hasLink;
context.hasSensitiveInfo = hasOTP && hasBank;

  // 🎯 TYPE DETECTION
  if (hasJob) scamTypes.push("Job Scam");

  if (text.includes("invest") || text.includes("profit") || text.includes("double")) {
    scamTypes.push("Investment Scam");
  }

  if (hasBank) scamTypes.push("Banking Scam");

  // =========================
  // 🔴 SIGNAL DETECTION
  // =========================

  if (hasUrgency) {
    riskScore += 20;
    signals.push("Urgency");
    reasons.push(L.reasons.URGENCY);
  }

  if (hasGreed || hasMoney) {
    riskScore += 20;
    signals.push("Greed");
    reasons.push(L.reasons.GREED);
    advice.push(L.actions.VERIFY_OFFER);
  }

 if (hasOTP && hasBank) {

riskScore += 40;

signals.push("Sensitive Info");

scamTypes.push("OTP Scam");

reasons.push(L.reasons.OTP_REQUEST);

advice.push(L.actions.DONT_SHARE_OTP);

evidence.push({

id:"OTP_REQUEST",

title:"Sensitive information requested",

severity:"critical",

confidence:98,

detected:"OTP",

description: L.evidence.OTP_REQUEST

});

matchedPatterns.push("OTP_REQUEST");

}


 if (hasLink) {

riskScore +=25;

signals.push("Link");

scamTypes.push("Phishing");

reasons.push(L.reasons.EXTERNAL_LINK);

advice.push(L.actions.DONT_CLICK_LINK);

evidence.push({

id:"EXTERNAL_LINK",

title:"External link detected",

severity:"medium",

confidence:80,

detected: urlAnalysis.url,

description: L.evidence.EXTERNAL_LINK

});

matchedPatterns.push("EXTERNAL_LINK");

}

  if (hasFear) {
    riskScore += 20;
    signals.push("Fear");
    reasons.push(L.reasons.FEAR);
    advice.push(L.actions.VERIFY_FIRST);
  }

  // =========================
  // 🔥 NEW POWERFUL DETECTION
  // =========================

  // 💸 UPFRONT PAYMENT SCAM
  if (hasFee) {
    riskScore += 35;
    signals.push("Upfront Payment");

    reasons.push(L.reasons.UPFRONT_PAYMENT);
    advice.push(L.actions.DONT_SEND_MONEY);
  }

  // 🎯 NO EXPERIENCE TRAP
  if (hasNoExperience) {
    riskScore += 15;
    signals.push("Too Easy Job");

   reasons.push(L.reasons.TOO_EASY_JOB);
  }

  // 🔴 JOB SCAM BOOST
  if (hasJob && hasMoney) {
    riskScore += 25;
    reasons.push(L.reasons.JOB_COMBO);
  }

  // 💥 ULTIMATE JOB FEE SCAM
 if(hasJob && hasFee){

riskScore +=40;

signals.push("Job Fee Scam");

reasons.push(L.reasons.JOB_FEE);

evidence.push({

id:"ADVANCE_FEE",

title:"Advance fee requested",

severity:"critical",

confidence:99,

detected:"Registration fee",

description: L.evidence.ADVANCE_FEE

});

matchedPatterns.push("ADVANCE_FEE");

}

  // =========================
  // 🔥 COMBO INTELLIGENCE
  // =========================

  if (hasUrgency && hasLink) {
    riskScore += 20;
    reasons.push(L.reasons.URGENT_LINK);
}

  if (hasOTP && hasLink) {
    riskScore += 25;
    reasons.push(L.reasons.OTP_LINK);
  }

  if (hasMoney && hasUrgency) {
    riskScore += 20;
    reasons.push(L.reasons.MONEY_URGENCY);
  }

  if (hasFear && hasLink) {
    riskScore += 20;
    reasons.push(L.reasons.FEAR_LINK);
  }

  // =========================
  // 🎯 FINAL RESULT (IMPROVED)
  // =========================

  let result = "SAFE";

  if (riskScore >= 60) result = "DANGEROUS";
  else if (riskScore >= 25) result = "SUSPICIOUS";

  // =========================
  // 🧠 HUMAN MESSAGE
  // =========================

  let humanMessage = "";

  if (signals.length === 0) {
    humanMessage = L.reasons.SAFE;
  } else {
    humanMessage = reasons.join("\n");
  }

  // =========================
  // 🛡️ SAFETY STATUS
  // =========================

  let safetyStatus = "";
let reminder = L.dontShare;
let emergency = "";

if (result === "DANGEROUS") {
  safetyStatus = L.dangerous;
  emergency = L.actions.VERIFY_OFFICIAL_SOURCE;
} else if (result === "SUSPICIOUS") {
  safetyStatus = L.suspicious;
} else {
  safetyStatus = L.safe;
}

  // =========================
  // 🎯 FINAL MESSAGE
  // =========================

  let finalMessage = "";

 if (result === "SAFE") {
  finalMessage = L.safe;
} else if (result === "SUSPICIOUS") {
  finalMessage = L.suspicious;
} else {
  finalMessage = L.dangerous;
}

 return {

result,

riskScore,

scamCategory:
scamTypes.join(", ") || "General",

evidence,

matchedPatterns,

reasons,

advice:[...new Set(advice)],

humanMessage,

finalMessage,

signals:[...new Set(signals)],

safetyStatus,

reminder,

emergency

};

}

module.exports = detectScam;
