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
  return [...new Set([
    ...scamSignals,
    ...manipulationSignals
  ])];
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
  confidence,
  t
) {

  let parts = [];

  // ======================
// Evidence Based Explanation
// ======================

if (scam.evidence && scam.evidence.length) {

let explain = "Why was this flagged?\n";

scam.evidence.forEach(item => {

explain += `

--------------------------------

✓ ${item.title}

Detected:
${item.detected || "Matched pattern"}


Severity:
${item.severity}

Confidence:
${item.confidence}%

Why:

${t.evidence?.[item.id] || item.description}

`;

});

parts.push(explain);

}
  // ======================
  // Manipulation
  // ======================

 if (
    manipulation.manipulationLevel !== "LOW" &&
    manipulation.manipulationMessage
){
    parts.push(manipulation.manipulationMessage);

}

  // ======================  
  // URL  
  // ======================  
  
  if (  
    urlAnalysis.found &&  
    urlAnalysis.reasons.length  
  ) {  
  
    parts.push(
  
      urlAnalysis.reasons  
        .map(r => "• " + r)  
        .join("\n")  
  
    );  
  
  }

  // ======================
  // Safe Browsing
  // ======================

  if (
    safeBrowsing.success &&
    !safeBrowsing.safe
  ) {

    parts.push(

`Google Safe Browsing identified this website as unsafe.

This means Google's security systems have previously detected malicious or deceptive activity associated with this link.`

);

}

  // ======================
  // VirusTotal
  // ======================

  if (
    virusTotal.success &&
    (
      virusTotal.malicious > 0 ||
      virusTotal.suspicious > 0
    )
  ) {

    parts.push(

`VirusTotal checked this website using multiple security vendors.

${virusTotal.malicious} vendors marked it as malicious.

${virusTotal.suspicious} vendors reported suspicious behaviour.`

);

}
  // ======================
  // Domain
  // ======================

  if (
    domainInfo.success &&
    domainInfo.age !== "Unknown"
  ) {

    parts.push(

`🌍 Domain Information

Domain Age : ${domainInfo.age}

Registrar : ${domainInfo.registrar}`

    );

  }
if(domainInfo.success){

if(domainInfo.risk==="HIGH"){

parts.push(

`The website appears to be recently registered.

Newly created domains are commonly used in phishing campaigns because attackers frequently abandon them after being reported.`

);

}


      parts.push(

`Overall Assessment

This result is based on message content, detected scam patterns, link analysis and external security checks.`

);

}
  // ======================
  // Final Recommendation
  // ======================

  if (type === "SAFE") {

    parts.push(

"✅ No strong warning signs were found.\n\nEven then, always stay cautious before sharing personal information."

    );

  }

  else if (type === "SUSPICIOUS") {

    parts.push(

"⚠ Some warning signs were detected.\n\nVerify the sender before clicking links or replying."

    );

  }

  else {

    parts.push(

"🚨 Multiple security checks agree this message is risky.\n\nAvoid clicking links, sharing OTPs, passwords or bank information."

    );

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

  virusTotal = await checkVirusTotal(urlAnalysis.url);

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
  scamCategory: scamResult.scamCategory || "General"
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
  t);
  }
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
