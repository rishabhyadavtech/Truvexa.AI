require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");
const express = require("express");
const app = express();

const buildExplanation = require("./logic/buildExplanation");

const { getLanguage } =
require("./logic/languageEngine");

const detectScam = require("./logic/scamDetector");

const { detectManipulation } = require("./logic/manipulationDetector");

const { calculateConfidence } = require("./logic/confidenceEngine");

const { decideAction } = require("./logic/decisionHelper");

const { analyzeUrlReputation } = require("./logic/urlReputation");

const { analyzeURL } = require("./logic/urlAnalyzer");

const {
  checkDomainAge,
  buildDomainSummary,
  buildDomainExplanation
} = require("./logic/domainAge");

const {
  checkSafeBrowsing,
  buildSafeBrowsingSummary,
  buildSafeBrowsingExplanation
} = require("./logic/safeBrowsing");

const {
  checkVirusTotal,
  buildVirusTotalSummary,
  buildVirusTotalExplanation
} = require("./logic/virusTotal");

const {
  checkSSL,
  buildSSLSummary,
  buildSSLExplanation
} = require("./logic/sslChecker");

const {
  checkDNS,
  buildDNSSummary,
  buildDNSExplanation
} = require("./logic/dnsChecker");

app.use(express.json());
app.use(express.static("public"));

app.get("/", async (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// 🎯 FINAL TYPE ENGINE (SMART 🔥)
function getFinalResultType(
  scam,
  manipulation,
  safeBrowsing,
  virusTotal,
  domainInfo,
  dnsInfo,
  sslInfo
) {

  // HIGH RISK
  if (
    scam.result === "DANGEROUS" ||
    manipulation.manipulationLevel === "HIGH" ||
    !safeBrowsing.safe ||
    virusTotal.malicious > 0 ||
    virusTotal.suspicious > 0 ||
    domainInfo.risk === "HIGH" ||
    dnsInfo.risk === "HIGH" ||
    sslInfo.risk === "HIGH"
  ) {
    return "DANGEROUS";
  }

  // MEDIUM RISK
  if (
    scam.riskScore >= 35 ||
    domainInfo.risk === "MEDIUM" ||
    dnsInfo.risk === "MEDIUM"
  ) {
    return "SUSPICIOUS";
  }

  // SAFE
  return "SAFE";
}

// 🎯 Merge Signals
function mergeSignals(scamSignals = [], manipulationSignals = []) {
  return [...new Set([
    ...scamSignals,
    ...manipulationSignals
  ])];
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

let sslInfo = {
  success: false,
  risk: "Unknown",
  message: "No URL detected."
};

if (urlAnalysis.found) {
  sslInfo = await checkSSL(urlAnalysis.url);
}

let domainInfo = {
  success: false,
  message: "No URL detected."
};

if (urlAnalysis.found) {
  domainInfo = await checkDomainAge(urlAnalysis.url);
}

let dnsInfo = {
  success: false,
  message: "No URL detected."
};

if (urlAnalysis.found) {
  dnsInfo = await checkDNS(urlAnalysis.url);
}

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
  undetected: 0,
  message: "No URL detected."
};

if (urlAnalysis.found) {
  safeBrowsing = await checkSafeBrowsing(urlAnalysis.url);

  virusTotal = await checkVirusTotal(urlAnalysis.url);

}

// ==========================
// 🎯 Better Risk Calibration
// ==========================

// Strong trust signals
if (
    urlAnalysis.found &&
    safeBrowsing.success &&
    safeBrowsing.safe &&
    virusTotal.success &&
    virusTotal.malicious === 0 &&
    virusTotal.suspicious === 0 &&
    domainInfo.success &&
    domainInfo.risk === "LOW" &&
    dnsInfo.success &&
    dnsInfo.risk === "LOW" &&
    sslInfo.success &&
    sslInfo.risk === "LOW"
) {

    scamResult.riskScore = Math.max(
        scamResult.riskScore - 25,
        5
    );

    scamResult.result = "SAFE";
    scamResult.scamCategory = "Safe Website";
}

// Plain text + no suspicious signals
if (
    !urlAnalysis.found &&
    scamResult.signals.length === 0
) {

    scamResult.riskScore = 5;

}

// Medium trust website
if (
    urlAnalysis.found &&
    domainInfo.success &&
    domainInfo.risk === "MEDIUM"
) {

    scamResult.riskScore += 5;

}

// Extremely dangerous website
if (
    safeBrowsing.success &&
    !safeBrowsing.safe &&
    virusTotal.success &&
    virusTotal.malicious >= 5
) {

    scamResult.riskScore = Math.max(
        scamResult.riskScore,
        90
    );

}

scamResult.riskScore = Math.min(
    Math.max(scamResult.riskScore, 5),
    100
);
    
    // 🎯 FINAL TYPE
    const finalType = getFinalResultType(scamResult, manipulationResult,
safeBrowsing,
  virusTotal,
  domainInfo,
  dnsInfo,
  sslInfo
);
   const confidence = calculateConfidence(
  scamResult,
  manipulationResult,
  urlAnalysis,
  safeBrowsing,
  virusTotal,
  domainInfo,
  dnsInfo,
  sslInfo
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

 safeBrowsingSummary:
buildSafeBrowsingSummary(safeBrowsing),

safeBrowsingExplanation:
buildSafeBrowsingExplanation(safeBrowsing),

virusTotalSummary:
buildVirusTotalSummary(virusTotal),

virusTotalExplanation:
buildVirusTotalExplanation(virusTotal),

domainSummary:
buildDomainSummary(domainInfo),

domainExplanation:
buildDomainExplanation(domainInfo),

sslSummary:
buildSSLSummary(sslInfo),

sslExplanation:
buildSSLExplanation(sslInfo),

dnsSummary:
buildDNSSummary(dnsInfo),

dnsExplanation:
buildDNSExplanation(dnsInfo),

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
  dnsInfo,
  sslInfo,

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

        response.explanation = buildExplanation(
  "SAFE",
  scamResult,
  manipulationResult,
  urlAnalysis,
  safeBrowsing,
  virusTotal,
  domainInfo,
  dnsInfo,
  sslInfo,
  confidence,
  t
);

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
  dnsInfo,
  sslInfo,
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
  dnsInfo,
  sslInfo,
  confidence,
  t
);

}

  response.safeBrowsingExplanation = `
Status : ${safeBrowsing.safe ? "Safe" : "Unsafe"}

${safeBrowsing.message}

Threats:
${safeBrowsing.threats?.length ? safeBrowsing.threats.join("\n") : "No threats detected."}
`;

response.virusTotalExplanation = `
Malicious : ${virusTotal.malicious}

Suspicious : ${virusTotal.suspicious}

Harmless : ${virusTotal.harmless}

Undetected : ${virusTotal.undetected}

${virusTotal.message}
`;

response.domainExplanation = `
Domain : ${domainInfo.domain || "Unknown"}

Age : ${domainInfo.age || "Unknown"}

Registrar : ${domainInfo.registrar || "Unknown"}

Risk : ${domainInfo.risk || "Unknown"}

${domainInfo.message || ""}
`;

response.sslExplanation = `
Status : ${sslInfo.valid ? "Valid" : "Invalid"}

Issuer : ${sslInfo.issuer || "Unknown"}

Valid Until : ${sslInfo.validTo || "Unknown"}

Risk : ${sslInfo.risk || "Unknown"}
`;

response.dnsExplanation = `
A Record : ${dnsInfo.hasA ? "Yes" : "No"}

MX Record : ${dnsInfo.hasMX ? "Yes" : "No"}

NS Record : ${dnsInfo.hasNS ? "Yes" : "No"}

SPF : ${dnsInfo.hasSPF ? "Yes" : "No"}

DMARC : ${dnsInfo.hasDMARC ? "Yes" : "No"}

Risk : ${dnsInfo.risk || "Unknown"}
`;

    // ✅ SEND FINAL
    res.json(response);

  } catch (error) {
  console.error("❌ SERVER CRASH ❌");
  console.error(error);
  console.error(error.stack);  

  res.status(500).json({
    error: error.message,
    stack: error.stack
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
