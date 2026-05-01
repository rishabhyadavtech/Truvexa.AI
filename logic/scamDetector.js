function detectScam(input) {
  let text = input.toLowerCase();

  let riskScore = 0;
  let signals = [];
  let reasons = [];
  let advice = [];
  let scamTypes = [];

  // 🎯 CONTEXT FLAGS
  const hasLink = text.includes("http") || text.includes("www");
  const hasOTP = text.includes("otp");
  const hasBank =
    text.includes("bank") || text.includes("account") || text.includes("rbi");

  const hasMoney =
    text.includes("rupees") ||
    text.includes("rs") ||
    text.includes("lakh") ||
    text.includes("money") ||
    text.includes("payment");

  const hasUrgency =
    text.includes("urgent") ||
    text.includes("immediately") ||
    text.includes("now") ||
    text.includes("within") ||
    text.includes("expire");

  const hasFear =
    text.includes("blocked") ||
    text.includes("suspended") ||
    text.includes("legal action") ||
    text.includes("warning");

  const hasGreed =
    text.includes("win") ||
    text.includes("reward") ||
    text.includes("prize") ||
    text.includes("free");

  // 🎯 TYPE DETECTION
  if (text.includes("job") || text.includes("work from home") || text.includes("earn")) {
    scamTypes.push("Job Scam");
  }

  if (text.includes("invest") || text.includes("profit") || text.includes("double")) {
    scamTypes.push("Investment Scam");
  }

  if (hasBank) {
    scamTypes.push("Banking Scam");
  }

  // =========================
  // 🔴 SIGNAL DETECTION
  // =========================

  if (hasUrgency) {
    riskScore += 20;
    signals.push("Urgency");
    reasons.push("Message jaldi decision lene ka pressure bana raha hai.");
    advice.push("Jaldi decision mat lo.");
  }

  if (hasGreed || hasMoney) {
    riskScore += 20;
    signals.push("Greed");
    reasons.push("Paise ya reward ka lalach diya ja raha hai.");
    advice.push("Too good to be true offers ignore karo.");
  }

  if (hasOTP && hasBank) {
    riskScore += 40;
    signals.push("Sensitive Info");
    scamTypes.push("OTP Scam");

    reasons.push("Aapse OTP ya sensitive details maangi ja rahi hain.");
    advice.push("OTP ya bank details kabhi share mat karo.");
  }

  if (hasLink) {
    riskScore += 25;
    signals.push("Link");
    scamTypes.push("Phishing");

    reasons.push("Message me ek external link diya gaya hai.");
    advice.push("Unknown link par click mat karo.");
  }

  if (hasFear) {
    riskScore += 20;
    signals.push("Fear");
    reasons.push("Dar create karke aapko control kiya ja raha hai.");
    advice.push("Panic mat karo, pehle verify karo.");
  }

  // =========================
  // 🔥 COMBO INTELLIGENCE (REAL AI PART)
  // =========================

  if (hasUrgency && hasLink) {
    riskScore += 15;
    reasons.push("Urgency + link ka combo scam me common hota hai.");
  }

  if (hasOTP && hasLink) {
    riskScore += 25;
    reasons.push("OTP + link = highly dangerous pattern.");
  }

  if (hasMoney && hasUrgency) {
    riskScore += 15;
    reasons.push("Paise + urgency ka combo manipulation strong banata hai.");
  }

  // =========================
  // 🎯 FINAL RESULT
  // =========================

  let result = "SAFE";

  if (riskScore >= 70) result = "DANGEROUS";
  else if (riskScore >= 35) result = "SUSPICIOUS";

  // =========================
  // 🧠 HUMAN STYLE MESSAGE (NON-TEMPLATE)
  // =========================

  let humanMessage = "";

  if (signals.length === 0) {
    humanMessage =
      "Message normal lag raha hai. Koi strong scam pattern detect nahi hua.";
  } else {
    humanMessage = reasons.join("\n");
  }

  // =========================
  // 🛡️ SAFETY STATUS
  // =========================

  let safetyStatus = "";
  let reminder = "👉 Kabhi bhi OTP ya personal details share mat karo.";
  let emergency = "";

  if (result === "DANGEROUS") {
    safetyStatus = "🚨 High risk — yeh scam ho sakta hai.";
    emergency =
      "⚠️ Agar aapne info share kiya hai to turant bank ya service provider se contact karo.";
  } else if (result === "SUSPICIOUS") {
    safetyStatus = "⚠️ Yeh message suspicious hai — verify karna zaroori hai.";
  } else {
    safetyStatus = "✅ Safe — koi strong risk detect nahi hua.";
  }

  // =========================
  // 🎯 FINAL MESSAGE (CLEAN)
  // =========================

  let finalMessage = "";

  if (result === "SAFE") {
    finalMessage = "✅ Yeh message safe lag raha hai.";
  } else if (result === "SUSPICIOUS") {
    finalMessage = "⚠️ Yeh message suspicious lag raha hai.";
  } else {
    finalMessage = "🚨 Yeh message scam ho sakta hai.";
  }

  return {
    riskScore,
    result,
    scamType: scamTypes.join(", ") || "General",
    reasons,
    advice: [...new Set(advice)],
    humanMessage,
    finalMessage,
    signals: [...new Set(signals)],
    safetyStatus,
    reminder,
    emergency
  };
}

module.exports = detectScam;
