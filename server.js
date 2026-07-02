require("dotenv").config();

const express = require("express");
const app = express();

const { getLanguage } =
require("./logic/languageEngine");
const detectScam = require("./logic/scamDetector");
const { detectManipulation } = require("./logic/manipulationDetector");
const { calculateConfidence } = require("./logic/confidenceEngine");
const { decideAction } = require("./logic/decisionHelper");
const { analyzeUrlReputation } = require("./logic/urlReputation");
const { analyzeURL } = require("./logic/urlAnalyzer");
const { checkDomainAge } = require("./logic/domainAge");
const { checkSafeBrowsing } = require("./logic/safeBrowsing");
const { checkVirusTotal } =
require("./logic/virusTotal");

app.use(express.json());
app.use(express.static("public"));

app.get("/", async (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// 🎯 FINAL TYPE ENGINE (SMART 🔥)
function getFinalResultType(scam, manipulation) {

  // HARD SAFE (no signal at all)
  if (
    scam.result === "SAFE" &&
    manipulation.manipulationLevel === "LOW" &&
    (!scam.signals || scam.signals.length === 0)
  ) {
    return "SAFE";
  }

  // HIGH RISK
  if (
    scam.result === "DANGEROUS" ||
    manipulation.manipulationLevel === "HIGH" ||
    (scam.riskScore >= 60)
  ) {
    return "DANGEROUS";
  }

  // DEFAULT
  return "SUSPICIOUS";
}

// 🎯 Merge Signals
function mergeSignals(scamSignals = [], manipulationSignals = []) {
  return [...new Set([...scamSignals, ...manipulationSignals])];
}

// 🎯 Merge Advice
function mergeAdvice(scamAdvice = [], manipulationAdvice = []) {
  return [...new Set([...scamAdvice, ...manipulationAdvice])];
}

// 🎯 AI EXPLANATION BUILDER
function buildExplanation(
  type,
  scam,
  manipulation,
  urlAnalysis,
  safeBrowsing,
  virusTotal,
  domainInfo,
  confidence
  t
) {

  let parts = [];

  // Scam explanation
  if (scam.humanMessage) {
    parts.push(scam.humanMessage);
  }

  // Manipulation explanation
  if (
    manipulation.manipulationLevel !== "LOW" &&
    manipulation.manipulationMessage
  ) {
    parts.push(manipulation.manipulationMessage);
  }

  // URL Analysis
  if (urlAnalysis.found && urlAnalysis.reasons.length) {

    parts.push(
      "🌐 URL Analysis:\n- " +
      urlAnalysis.reasons.join("\n- ")
    );

  }

  // Safe Browsing
  if (safeBrowsing.success && !safeBrowsing.safe) {

    parts.push(
      "🛡 Google Safe Browsing detected:\n- " +
      safeBrowsing.threats.join(", ")
    );

  }

  // VirusTotal
  if (
    virusTotal.success &&
    (virusTotal.malicious > 0 ||
     virusTotal.suspicious > 0)
  ) {

    parts.push(
`🦠 VirusTotal Report

Malicious: ${virusTotal.malicious}

Suspicious: ${virusTotal.suspicious}`
    );

  }

  // Domain
  if (
    domainInfo.success &&
    domainInfo.age !== "Unknown"
  ) {

    parts.push(
      `🌍 Domain Age: ${domainInfo.age}`
    );

  }

  // Confidence
  parts.push(
    `🎯 Confidence: ${confidence}%`
  );

  if (type === "DANGEROUS") {

    parts.push(
      "👉 Multiple independent security checks indicate this message is risky."
    );

  }
if (type === "DANGEROUS") {
  parts.push(t.dangerExplanation);
}

  return parts.join("\n\n");

}

// API route
app.post("/check", async (req, res) => {
  try {
    const {
  message,
  language = "hi"
} = req.body;

const t = getLanguage(language);

    if (!message || message.trim() === "") {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    // 🔍 Run engines
    const scamResult = detectScam(message);
    const manipulationResult = detectManipulation(message);
    const decision = decideAction(scamResult, manipulationResult);
    const reputationResult = analyzeUrlReputation(message);
const urlAnalysis = analyzeURL(message);
    const domainInfo = await checkDomainAge(message);
    let safeBrowsing = {
  success: false,
  safe: true,
  threats: [],
  message: "No URL detected."
};
  let virusTotal = {
  success: false,
  safe: true,
  malicious: 0,
  suspicious: 0,
  harmless: 0,
  message: "No URL detected."
};

if (urlAnalysis.found) {

  safeBrowsing = await checkSafeBrowsing(urlAnalysis.url);

if (urlAnalysis.found) {

  virusTotal =
    await checkVirusTotal(urlAnalysis.url);

}
    
    // 🎯 FINAL TYPE
    const finalType = getFinalResultType(scamResult, manipulationResult);
   const confidence = calculateConfidence(
  scamResult,
  manipulationResult,
  urlAnalysis,
  safeBrowsing,
  virusTotal,
  domainInfo
);

    // 🎯 CLEAN DATA
    const signals = mergeSignals(
  [...(scamResult.signals || []), ...(urlAnalysis.signals || []), ...(reputationResult.signals || [])],
  manipulationResult.signals || []
);


const advice = [
  ...new Set([
    ...(scamResult.advice || []),
    ...(manipulationResult.manipulationAdvice || []),
    ...(urlAnalysis.advice || [])
  ])
];

    // 🎯 RESPONSE OBJECT
  let response = {
  type: finalType,
  finalMessage: "",
  explanation: "",

  // Existing
  signals,
  advice,
  decision,
  confidence,
  domainInfo,
  urlAnalysis,
reputationResult,
  safeBrowsing,
  virusTotal,
  language,

  // NEW
  riskScore: scamResult.riskScore,
  evidence: scamResult.evidence || [],
  matchedPatterns: scamResult.matchedPatterns || [],
  scamCategory: scamResult.scamType || "General"
};

    // =========================
    // 🟢 SAFE
    // =========================
    if (finalType === "SAFE") {

      response.finalMessage = t.safe;

        response.explanation = t.noSignal;
    }

    // =========================
    // 🟡 SUSPICIOUS
    // =========================
    else if (finalType === "SUSPICIOUS") {

      response.finalMessage = t.suspicious;

      response.explanation = buildExplanation(
  "SUSPICIOUS",
  scamResult,
  manipulationResult,
  urlAnalysis,
  safeBrowsing,
  virusTotal,
  domainInfo,
  confidence,
  t
);

    // =========================
    // 🔴 DANGEROUS
    // =========================
    else {

      response.finalMessage = t.dangerous;

      response.explanation = buildExplanation(
  "DANGEROUS",
  scamResult,
  manipulationResult,
  urlAnalysis,
  safeBrowsing,
  virusTotal,
  domainInfo,
  confidence,
  t
);

if (urlAnalysis.found) {
  response.explanation += "\n\n🌐 URL Analysis\n";

  if (urlAnalysis.reasons.length > 0) {
    response.explanation +=
      "\n- " + urlAnalysis.reasons.join("\n- ");
  }
}

 }
    // ✅ SEND FINAL
    res.json(response);

  } catch (error) {
    console.error("❌ Server Error:", error);

    res.status(500).json({
      error: "Server error. Please try again."
    });
  }
});

// =========================
// 🧠 DEBUG ROUTE (OPTIONAL ADD)
// =========================
app.post("/debug", (req, res) => {
  try {
    const { message } = req.body;

    const scamResult = detectScam(message);
    const manipulationResult = detectManipulation(message);

    console.log("🧠 DEBUG DATA:");
    console.log("Message:", message);
    console.log("Scam:", scamResult);
    console.log("Manipulation:", manipulationResult);
    console.log("------------------------");

    res.json({
      scam: scamResult,
      manipulation: manipulationResult
    });

  } catch (error) {
    console.error("❌ Debug Error:", error);
    res.status(500).json({ error: "Debug failed" });
  }
});


// PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Truvexa running on port " + PORT);
});
