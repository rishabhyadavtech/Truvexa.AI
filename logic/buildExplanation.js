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
  let smartAdvice = [];

  // ===================================
  // SAFE MODE (Natural GPT Style)
  // ===================================

  if (type === "SAFE") {

if (!urlAnalysis.found) {

parts.push(`

✅ Safe

I carefully analyzed this message for phishing patterns, emotional manipulation, fake urgency, impersonation attempts, and suspicious language.

I didn't find any meaningful warning signs.

Based on the content, this message appears legitimate.

`);

return parts.join("\n\n");

}

let evidence=[];

if(safeBrowsing.safe)
evidence.push("✔ Google Safe Browsing: No unsafe website detected.");

if(
virusTotal.malicious===0 &&
virusTotal.suspicious===0
)
evidence.push("✔ VirusTotal: No malware reported.");

if(domainInfo.risk==="LOW")
evidence.push("✔ Domain: Domain appears trustworthy.");

if(sslInfo.risk==="LOW")
evidence.push("✔ SSL Certificate: Secure connection detected.");

if(dnsInfo.risk==="LOW")
evidence.push("✔ DNS Security: No abnormal DNS behaviour.");

parts.push(`

✅ Safe

This website successfully passed the major security checks performed by Truvexa.

I didn't find evidence of phishing, malware, impersonation or deceptive behaviour.

Evidence

${evidence.join("\n")}

What should I do?

• You can continue normally.

• Still avoid sharing OTPs, passwords or banking information unless you completely trust the website.

• If anything unusual happens later, verify it before proceeding.

`);

return parts.join("\n\n");

}

// =====================================
// ⚠ SUSPICIOUS (Natural GPT Style)
// =====================================

if (type === "SUSPICIOUS") {

}

// =====================================
// 🚨 DANGEROUS (Natural GPT Style)
// =====================================

if (type === "DANGEROUS") {

}

// =====================================
// 🧠 Manipulation Detection
// =====================================

if (
manipulation.manipulationLevel !== "LOW" &&
manipulation.manipulationMessage
){

}

// =====================================
// 🧠 Smart Recommendation Engine
// =====================================

if (scam.scamCategory?.includes("OTP")) {

smartAdvice.push("• Never share your OTP with anyone.");

}

if (scam.scamCategory?.includes("Banking")) {

smartAdvice.push("• Contact your bank through its official helpline if you suspect fraud.");

}

if (scam.scamCategory?.includes("Job")) {

smartAdvice.push("• Genuine employers never ask for registration or joining fees.");

}

if (scam.scamCategory?.includes("Investment")) {

smartAdvice.push("• Verify the investment company before sending money.");

}

if (urlAnalysis.found) {

smartAdvice.push("• Type the website address manually instead of clicking unknown links.");

}

if (safeBrowsing.success && !safeBrowsing.safe) {

smartAdvice.push("• Google Safe Browsing has flagged this website. Avoid visiting it.");

}

if (virusTotal.malicious > 0) {

smartAdvice.push("• Multiple security vendors detected this website as malicious.");

}

// ===================================
// 💡 Final Recommendation
// ===================================

if(type==="SAFE"){

}

else if(type==="SUSPICIOUS"){

}

if (smartAdvice.length > 0) {

parts.push(`

🔍 Personalized Advice

${smartAdvice.join("\n")}

`);

}

return parts
  .filter(Boolean)
  .join("\n\n")
  .replace(/\n{3,}/g, "\n\n")
  .trim();

}

module.exports = buildExplanation;