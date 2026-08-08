const { getLanguage } = require("./languageEngine");
const { analyzeURL } = require("./urlAnalyzer");

function detectScam(input, lang = "en") {

  const L = getLanguage(lang);
  const text = input.toLowerCase();
  const urlAnalysis = analyzeURL(input);

  let riskScore = urlAnalysis.risk;

  let signals = [];
  let reasons = [];
  let advice = [];
  let scamTypes = [];
  let evidence = [];
  let matchedPatterns = [];

  signals.push(...urlAnalysis.signals);

  reasons.push(
    ...urlAnalysis.reasons.map(r => L.reasons[r] || r)
  );

  advice.push(...urlAnalysis.advice);
  evidence.push(...urlAnalysis.evidence);

  // ========================
  // CONTEXT FLAGS
  // ========================

  const hasLink = urlAnalysis.found;

  const hasOTP = text.includes("otp");

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

  // ==========================
  // TYPE DETECTION
  // ==========================

  if (hasJob) {
    scamTypes.push("Job Scam");
  }

  if (
    text.includes("invest") ||
    text.includes("profit") ||
    text.includes("double")
  ) {
    scamTypes.push("Investment Scam");
  }

  if (hasBank) {
    scamTypes.push("Banking Scam");
  }

  // =========================
  // SIGNAL DETECTION
  // =========================

  if (hasUrgency) {
    riskScore += 20;
    signals.push("URGENCY");
  }

  if (hasGreed || hasMoney) {
    riskScore += 20;
    signals.push("GREED");

    advice.push(L.actions.VERIFY_OFFER);
  }

  if (hasOTP && hasBank) {

    riskScore += 40;

    signals.push("OTP_REQUEST");

    scamTypes.push("OTP Scam");

    advice.push(L.actions.DONT_SHARE_OTP);

    evidence.push({
      id: "OTP_REQUEST",
      title: "OTP Request Detected",
      severity: "critical",
      confidence: 98,
      icon: "🚨",
      summary: "This message asks for your OTP.",
      why: "Legitimate banks and companies never ask for your OTP through messages.",
      detected: "OTP"
    });

    matchedPatterns.push("OTP_REQUEST");
  }

  if (hasLink) {

    riskScore += 5;

    signals.push("EXTERNAL_LINK");

    advice.push(L.actions.VERIFY_LINK);

    evidence.push({
      id: "EXTERNAL_LINK",
      title: "External Link Found",
      severity: "low",
      confidence: 100,
      icon: "🔗",
      summary: "This message contains a website link.",
      why: "Links should always be verified before opening, especially if received unexpectedly.",
      detected: urlAnalysis.url
    });

    matchedPatterns.push("EXTERNAL_LINK");
  }

  if (hasFear) {
    riskScore += 20;
    signals.push("FEAR");
    advice.push(L.actions.VERIFY_FIRST);
  }

  // =========================
  // PAYMENT / JOB DETECTION
  // =========================

  if (hasFee) {
    riskScore += 35;
    signals.push("UPFRONT_PAYMENT");
    advice.push(L.actions.DONT_SEND_MONEY);
  }

  if (hasNoExperience) {
    riskScore += 15;
    signals.push("TOO_EASY_JOB");
  }

  if (hasJob && hasMoney) {
    riskScore += 25;
    signals.push("JOB_COMBO");
  }

  if (hasJob && hasFee) {

    riskScore += 40;

    signals.push("JOB_FEE");

    evidence.push({
      id: "ADVANCE_FEE",
      title: "Advance Payment Requested",
      severity: "critical",
      confidence: 99,
      icon: "💰",
      summary: "The sender asks you to pay money before receiving the service.",
      why: "Advance-fee requests are one of the most common scam techniques.",
      detected: "Registration fee"
    });

    matchedPatterns.push("ADVANCE_FEE");
  }

  // =========================
  // COMBO INTELLIGENCE
  // =========================

  if (hasUrgency && hasLink) {
    riskScore += 20;
  }

  if (hasOTP && hasLink) {
    riskScore += 25;
  }

  if (hasMoney && hasUrgency) {
    riskScore += 20;
  }

  if (hasFear && hasLink) {
    riskScore += 20;
  }

  // =========================
  // FINAL DECISION
  // =========================

  riskScore = Math.min(riskScore, 100);

  let result = "SAFE";

  if (riskScore >= 60) {
    result = "DANGEROUS";
  } else if (riskScore >= 25) {
    result = "SUSPICIOUS";
  }

  // =========================
  // RETURN
  // =========================

  return {

    result,

    riskScore,

    scamCategory:
      scamTypes.join(", ") || "General",

    evidence,

    matchedPatterns,

    reasons,

    advice: [...new Set(advice)],

    signals: [...new Set(signals)]

  };
}

module.exports = detectScam;
