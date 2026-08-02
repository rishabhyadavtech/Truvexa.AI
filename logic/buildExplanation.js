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

✅ This message looks safe.

I analyzed the message for common scam patterns, manipulation techniques, urgency, impersonation, and suspicious language.

I didn't find any strong warning signs.

Based on the content alone, this message appears legitimate.

`);

    return parts.join("\n\n");

}

    // Small evidence summary
    let evidence = [];

    if (safeBrowsing.safe)
      evidence.push("✔ Google Safe Browsing");

    if (
      virusTotal.malicious === 0 &&
      virusTotal.suspicious === 0
    )
      evidence.push("✔ VirusTotal");

    if (domainInfo.risk === "LOW")
      evidence.push("✔ Trusted Domain");

    if (sslInfo.risk === "LOW")
      evidence.push("✔ Valid SSL");

    if (dnsInfo.risk === "LOW")
      evidence.push("✔ Healthy DNS");


    parts.push(`
✅ Everything looks legitimate.

I checked this website using multiple independent security signals before making this decision.

Evidence used:

${evidence.join("\n")}

Overall summary:
`);

    // Human style transition

    parts.push(`
I didn't find any strong signs of phishing, malware, impersonation, or deceptive behaviour.

Instead of relying on a single security check, this result is based on multiple independent sources working together.

You can tap "View Details" under each security check if you'd like to see the technical analysis behind this result.
`);

  }

// =====================================
// ⚠ SUSPICIOUS (Natural GPT Style)
// =====================================

if (type === "SUSPICIOUS") {

}

// =======================================
// 🚨 DANGEROUS (Natural GPT Style)
// =======================================

if (type === "DANGEROUS") {

}

// =======================================
// 🧠 Manipulation Detection
// =======================================

if (
manipulation.manipulationLevel !== "LOW" &&
manipulation.manipulationMessage
){

}

// =======================================
// 🧠 Smart Recommendation Engine
// =======================================

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

// =======================================
// 💡 Final Recommendation
// =======================================

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

}

return parts
  .filter(Boolean)
  .join("\n\n")
  .replace(/\n{3,}/g, "\n\n")
  .trim();

}

module.exports = buildExplanation;