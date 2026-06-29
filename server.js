const express = require("express");
const app = express();

const detectScam = require("./logic/scamDetector");
const { detectManipulation } = require("./logic/manipulationDetector");
const { decideAction } = require("./logic/decisionHelper");
const { checkUrlReputation } = require("./logic/urlReputation");
const { analyzeURL } = require("./logic/urlAnalyzer");
const { checkDomainAge } = require("./logic/domainAge");

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

// 🎯 AI EXPLANATION BUILDER (NO TEMPLATE 🔥)
function buildExplanation(type, scam, manipulation) {
if (urlResult.reasons.length > 0) {
  response.explanation +=
    "\n\n🌐 URL Analysis:\n\n- " +
    urlResult.reasons.join("\n- ");
}
  
  let parts = [];

  // SCAM SIDE
  if (scam.humanMessage && scam.humanMessage.trim() !== "") {
    parts.push(scam.humanMessage.trim());
  }

  // MANIPULATION SIDE
  if (
    manipulation.manipulationMessage &&
    manipulation.manipulationLevel !== "LOW"
  ) {
    parts.push(manipulation.manipulationMessage.trim());
  }

  // EXTRA INTELLIGENCE LINE
  if (type === "DANGEROUS") {
    parts.push(
      "👉 Yeh combination (fear, urgency, ya lalach) usually scam messages me use hota hai taaki aap bina soche react karein."
    );
  }

  return parts.join("\n\n");
}

// API route
app.post("/check", (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    // 🔍 Run engines
    const scamResult = detectScam(message);
    const manipulationResult = detectManipulation(message);
    const decision = decideAction(scamResult, manipulationResult);
    const urlResult = checkUrlReputation(message);
    const urlResult = analyzeURL(message);
    const domainInfo = checkDomainAge(message);
    
    // 🎯 FINAL TYPE
    const finalType = getFinalResultType(scamResult, manipulationResult);

    // 🎯 CLEAN DATA
    const signals = [
  ...new Set([
    ...(scamResult.signals || []),
    ...(manipulationResult.signals || []),
    ...(urlResult.signals || [])
  ])
];


const advice = [
  ...new Set([
    ...(scamResult.advice || []),
    ...(manipulationResult.manipulationAdvice || []),
    ...(urlResult.advice || [])
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
  urlReputation: urlResult

  // NEW
  riskScore: scamResult.riskScore,
  confidence: scamResult.confidence || 0,
  evidence: scamResult.evidence || [],
  matchedPatterns: scamResult.matchedPatterns || [],
  scamCategory: scamResult.scamType || "General"
};

    // =========================
    // 🟢 SAFE
    // =========================
    if (finalType === "SAFE") {

      response.finalMessage = "✅ Yeh message safe lag raha hai.";

      response.explanation =
        "Koi strong scam ya manipulation signal detect nahi hua.\n\n👉 Aap ise normal conversation ki tarah treat kar sakte hain.";
    }

    // =========================
    // 🟡 SUSPICIOUS
    // =========================
    else if (finalType === "SUSPICIOUS") {

      response.finalMessage = "⚠️ Yeh message suspicious lag raha hai.";

      response.explanation = buildExplanation(
        "SUSPICIOUS",
        scamResult,
        manipulationResult
      );
    }

    // =========================
    // 🔴 DANGEROUS
    // =========================
    else {

      response.finalMessage = "🚨 Yeh message risky / scam ho sakta hai.";

      response.explanation = buildExplanation(
        "DANGEROUS",
        if (urlResult.found) {
    response.explanation +=

`\n\n🌐 URL Analysis

Domain: ${urlResult.domain}

Age: ${urlResult.age}

Reputation: ${urlResult.reputation}

HTTPS: ${urlResult.https ? "Yes" : "No"}

Risk: ${urlResult.risk}`;
        }
        scamResult,
        manipulationResult
      );
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
