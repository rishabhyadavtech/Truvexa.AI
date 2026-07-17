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

Here's what I found:
`);

    // Human style transition

    parts.push(`
I didn't find any strong signs of phishing, malware, impersonation, or deceptive behaviour.

Instead of relying on a single security check, this result is based on multiple independent sources working together.

I'll explain each security check below so you can understand *why* this website appears safe.
`);

  }

// ======================
// 🛡 Google Safe Browsing
// ======================

if (safeBrowsing.success) {

if (safeBrowsing.safe) {

parts.push(`

🛡 Google Safe Browsing

Google's Safe Browsing database did not flag this website.

No known phishing, malware, or deceptive content was detected.

[[SAFE_BROWSING_DETAILS]]
`);

} else {

parts.push(`

🛡 Google Safe Browsing

⚠ Google has flagged this website as unsafe.

This usually means the website has previously been associated with phishing, malware, or other harmful activity.

Avoid visiting this website unless you completely trust the source.

`);

}

}


// ======================
// 🦠 VirusTotal
// ======================

if (virusTotal.success) {

if (
virusTotal.malicious > 0 ||
virusTotal.suspicious > 0
) {

parts.push(`

🦠 VirusTotal

VirusTotal scanned this website using dozens of security engines.

Malicious detections : ${virusTotal.malicious}

Suspicious detections : ${virusTotal.suspicious}

Harmless detections : ${virusTotal.harmless}

Undetected : ${virusTotal.undetected}

Because multiple security vendors detected problems, this website should be treated as potentially unsafe.

[[VT_DETAILS]]
`);

} else {

parts.push(`

🦠 VirusTotal

No security vendor reported this website as malicious.

Harmless detections : ${virusTotal.harmless}

Malicious detections : ${virusTotal.malicious}

Suspicious detections : ${virusTotal.suspicious}

This is a positive trust signal.

`);

}

}


// ======================
// 🌍 Domain Information
// ======================

if (domainInfo.success) {

parts.push(`

🌍 Domain Information

Age : ${domainInfo.age}

Registrar : ${domainInfo.registrar}

`);

if (domainInfo.risk === "HIGH") {

parts.push(`

The domain appears to be newly registered.

Recently created domains are commonly used in phishing and scam campaigns because attackers can easily abandon them after being reported.

[[DOMAIN_DETAILS]]
`);

}

else if (domainInfo.risk === "MEDIUM") {

parts.push(`

The domain is relatively new.

This doesn't automatically mean it is dangerous, but newer domains deserve extra caution.

`);

}

else {

parts.push(`

This is a well-established domain.

Older domains generally have a stronger trust history than newly registered websites.

`);

}

}


// ======================
// 🔒 SSL Certificate
// ======================

if (sslInfo.success) {

parts.push(`

🔒 SSL Certificate

Status : ${sslInfo.valid ? "Valid" : "Invalid"}

Issuer : ${sslInfo.issuer}

Valid Until : ${sslInfo.validTo}

Expires In : ${sslInfo.expiresInDays} days

[[SSL_DETAILS]]
`);

if (sslInfo.risk === "HIGH") {

parts.push(`

The SSL certificate is invalid or expired.

A trusted website should always maintain a valid HTTPS certificate.

Proceed carefully.

`);

}

else {

parts.push(`

The website is protected with a valid HTTPS certificate.

This helps encrypt communication between your browser and the website.

`);

}

}


// ======================
// 🌐 DNS Security
// ======================

if (dnsInfo.success) {

parts.push(`

🌐 DNS Security

A Record : ${dnsInfo.hasA ? "Found" : "Missing"}

MX Record : ${dnsInfo.hasMX ? "Found" : "Missing"}

NS Record : ${dnsInfo.hasNS ? "Found" : "Missing"}

SPF : ${dnsInfo.hasSPF ? "Enabled" : "Missing"}

DMARC : ${dnsInfo.hasDMARC ? "Enabled" : "Missing"}

 [[DNS_DETAILS]]
`);

if (dnsInfo.risk === "HIGH") {

parts.push(`

Some important DNS security records are missing.

While this does not always indicate a scam, properly configured websites usually have stronger DNS protection.

`);

}

else {

parts.push(`

The DNS configuration looks healthy.

Important security records are present and properly configured.

`);

}

}


// ======================
// 📋 Overall Assessment
// ======================

parts.push(`

📋 Overall Assessment

This result combines multiple independent security checks including:

• Scam pattern analysis

• Message analysis

• URL analysis

• Google Safe Browsing

• VirusTotal

• Domain history

• DNS security

• SSL certificate validation

The final verdict is based on all of these signals together rather than any single check.

`);

// =========================================
// ⚠ SUSPICIOUS (Natural GPT Style)
// =========================================

if (type === "SUSPICIOUS") {

parts.push(`

⚠ This website deserves some caution.

I found a few warning signs that increase the risk, but I don't have enough evidence to confidently classify it as malicious.

This doesn't necessarily mean the website is dangerous.

However, I recommend verifying it carefully before trusting it with sensitive information.

`);

}


// =========================================
// 🚨 DANGEROUS (Natural GPT Style)
// =========================================

if (type === "DANGEROUS") {

parts.push(`

🚨 This website appears to be unsafe.

Multiple independent security checks reported serious risk signals.

Based on the available evidence, I do not recommend visiting or interacting with this website.

`);

}


// =========================================
// 🧠 Manipulation Detection
// =========================================

if (
manipulation.manipulationLevel !== "LOW" &&
manipulation.manipulationMessage
){

parts.push(`

🧠 Social Engineering Analysis

${manipulation.manipulationMessage}

This message appears to use psychological pressure or emotional manipulation to influence your decision.

Always pause and verify before taking action.

`);

}


// =========================================
// 🔗 URL Analysis
// =========================================

if (
urlAnalysis.found &&
urlAnalysis.reasons &&
urlAnalysis.reasons.length
){

parts.push(`

🔗 URL Analysis

I also inspected the website address itself.

Possible observations:

${urlAnalysis.reasons.map(r=>"• "+r).join("\n")}

`);

}

// =========================================
// 🧠 Smart Recommendation Engine
// =========================================

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
// =========================================
// 💡 Final Recommendation
// =========================================

if(type==="SAFE"){

parts.push(`

💡 Recommended Actions

✅ You can continue if you trust the sender.

Before entering any password or payment details:

• Verify the website address carefully.
• Make sure HTTPS is enabled.
• Check that the domain name is spelled correctly.

Even safe websites can be impersonated through fake links.

`);

}

else if(type==="SUSPICIOUS"){

parts.push(`

💡 Recommended Actions

⚠ Do not rush.

Before continuing:

• Verify the sender independently.
• Visit the company's official website manually.
• Avoid entering passwords or payment details.
• Avoid downloading unknown files.

If you are unsure, leave the website until it is verified.

`);

}

else{

parts.push(`

🚨 Recommended Actions

❌ Do NOT continue.

Immediately:

• Close the website.
• Do not enter passwords.
• Do not share OTPs.
• Do not make any payment.

If you already entered sensitive information:

• Change your password immediately.
• Contact your bank if payment information was shared.
• Monitor your accounts for suspicious activity.

`);

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

function buildSafeBrowsingExplanation(safeBrowsing) {

  if (!safeBrowsing.success) {
    return "No Google Safe Browsing data available.";
  }

  if (safeBrowsing.safe) {

    return `
Google Safe Browsing did not flag this website.

No phishing, malware, or deceptive content was detected.
`.trim();

  }

  return `
Google Safe Browsing has flagged this website.

This usually indicates phishing, malware, or another security threat.

Avoid visiting this website unless you completely trust it.
`.trim();

}

module.exports = buildExplanation;