require("dotenv").config();

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
const { checkDomainAge } = require("./logic/domainAge");
const { checkSafeBrowsing } = require("./logic/safeBrowsing");
const { checkVirusTotal } = require("./logic/virusTotal");
const { checkDNS } = require("./logic/dnsChecker");
const { checkSSL } = require("./logic/sslChecker");

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

// 🎯 AI EXPLANATION BUILDER
function buildExplanation(
  type,
  scam,
  manipulation,
  urlAnalysis,
  safeBrowsing,
  virusTotal,
  domainInfo,
  dnsInfo,
  sslInfo,
  confidence,
  t
) {

  let parts = [];
// ======================
// Evidence
// ======================
if (type === "SAFE") {

parts.push(`

🟢 Website Analysis Complete

URL
${urlAnalysis.url}

Google Safe Browsing
${safeBrowsing.safe ? "✅ No threats detected" : "⚠ Threat detected"}

VirusTotal
${virusTotal.malicious} malicious
${virusTotal.suspicious} suspicious
${virusTotal.harmless} harmless

🌍 Domain

Age : ${domainInfo.age}

Registrar : ${domainInfo.registrar}

🔒 SSL

Status : ${sslInfo.valid ? "Valid" : "Invalid"}

Issuer : ${sslInfo.issuer}

Valid Until : ${sslInfo.validTo}

🌐 DNS

A Record : ${dnsInfo.hasA ? "Found" : "Missing"}

MX Record : ${dnsInfo.hasMX ? "Found" : "Missing"}

NS Record : ${dnsInfo.hasNS ? "Found" : "Missing"}

SPF : ${dnsInfo.hasSPF ? "Enabled" : "Missing"}

DMARC : ${dnsInfo.hasDMARC ? "Enabled" : "Missing"}

Final Assessment

✅ This website passed all security checks.

No phishing indicators were detected.

No malware detections were reported.

The domain is well established.

The SSL certificate is valid.

The DNS configuration looks healthy.

You can safely visit this website.

`);

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
 // Virus Total
// =======================

 if (
  virusTotal.success &&
  (
    virusTotal.malicious > 0 ||
    virusTotal.suspicious > 0
  )
) {

  parts.push(

`VirusTotal checked this website using multiple security vendors.

Malicious detections: ${virusTotal.malicious}

Suspicious detections: ${virusTotal.suspicious}

Harmless detections: ${virusTotal.harmless}

Undetected: ${virusTotal.undetected}`

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

if (dnsInfo.success) {

parts.push(

`🌐 DNS Security

A Record : ${dnsInfo.hasA ? "Found" : "Missing"}

MX Record : ${dnsInfo.hasMX ? "Found" : "Missing"}

NS Record : ${dnsInfo.hasNS ? "Found" : "Missing"}

SPF Protection : ${dnsInfo.hasSPF ? "Enabled" : "Missing"}

DMARC Protection : ${dnsInfo.hasDMARC ? "Enabled" : "Missing"}

DNS Risk : ${dnsInfo.risk}`

);

if (dnsInfo.risk === "HIGH") {

parts.push(

`The DNS configuration looks unusual.

Missing DNS records can indicate a misconfigured or suspicious website.`

);

}

}

if(domainInfo.risk==="HIGH"){

parts.push(

`The website appears to be recently registered.

Newly created domains are commonly used in phishing campaigns because attackers frequently abandon them after being reported.`

);

}

if (sslInfo.success) {

parts.push(

`🔒 SSL Certificate

Status : ${sslInfo.valid ? "Valid" : "Invalid"}

Issuer : ${sslInfo.issuer}

Valid Until : ${sslInfo.validTo}

Expires In : ${sslInfo.expiresInDays} days`

);

if (sslInfo.risk === "HIGH") {

parts.push(

`The SSL certificate is invalid or expired.

This increases the risk because trusted websites normally maintain valid HTTPS certificates.`

);

}

}


      parts.push(

`Overall Assessment

This result is based on message content, detected scam patterns, link analysis and external security checks.`

);

}
  // ======================
  // Final Recommendation
  // ======================

  if(type==="SAFE"){

if(urlAnalysis.found){

parts.push(`

Final Assessment

✅ This website appears to be legitimate.

Google Safe Browsing did not detect any malicious activity.

VirusTotal did not report this website as malicious.

The domain is well established.

The SSL certificate is valid.

DNS records look healthy.

You can safely visit this website.

Always verify the URL before entering passwords or personal information.

`);

}else{

parts.push("No suspicious indicators were detected.");

}

}

  else if (type === "SUSPICIOUS") {

    parts.push(

"⚠ Some warning signs were detected.\n\nVerify the sender before clicking links or replying."

    );

  }

  else if(type==="DANGEROUS"){

parts.push(`

Final Assessment

🚨 Multiple independent security checks indicate that this website is unsafe.

Do not open this website.

Do not enter passwords.

Do not enter OTP.

Do not make any payment.

Leave the page immediately.

`);

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

if (
  urlAnalysis.found &&
  safeBrowsing.safe &&
  virusTotal.malicious === 0 &&
  virusTotal.suspicious === 0 &&
  domainInfo.risk === "LOW" &&
  dnsInfo.risk === "LOW" &&
  sslInfo.risk === "LOW"
) {

  scamResult.riskScore = 0;
  scamResult.result = "SAFE";
  scamResult.scamCategory = "Safe Website";

}
    
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
