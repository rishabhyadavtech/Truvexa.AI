function detectScam(input) {
  let text = input.toLowerCase();

  let riskScore = 0;
  let reasons = [];
  let advice = [];
  let signals = [];
  let scamTypes = [];

  // 🎯 CONTEXT FLAGS
  const hasLink = text.includes("http") || text.includes("www");
  const hasOTP = text.includes("otp");
  const hasMoney =
    text.includes("rupees") ||
    text.includes("lakh") ||
    text.includes("rs") ||
    text.includes("money");
  const hasUrgency =
    text.includes("urgent") ||
    text.includes("immediately") ||
    text.includes("now") ||
    text.includes("within") ||
    text.includes("expire");
  const hasFear =
    text.includes("blocked") ||
    text.includes("suspended") ||
    text.includes("legal action");

  // 🎯 MESSAGE TYPE DETECTION
  if (text.includes("job") || text.includes("earn") || text.includes("work from home")) {
    scamTypes.push("Job Scam");
  }

  if (text.includes("invest") || text.includes("double") || text.includes("profit")) {
    scamTypes.push("Investment Scam");
  }

  if (text.includes("bank") || text.includes("account")) {
    scamTypes.push("Banking Related");
  }

  // 🔴 URGENCY
  if (hasUrgency) {
    riskScore += 20;
    signals.push("Urgency");
    reasons.push("Jaldi decision lene ka pressure diya ja raha hai.");
    advice.push("Jaldi decision na lein.");
  }

  // 🔴 GREED
  if (hasMoney || text.includes("prize") || text.includes("reward") || text.includes("win")) {
    riskScore += 20;
    signals.push("Greed");
    reasons.push("Paise ya reward ka lalach diya gaya hai.");
    advice.push("Too good to be true offers ignore karein.");
  }

  // 🔴 SENSITIVE (ONLY IF OTP + CONTEXT)
  if (hasOTP && (text.includes("verify") || text.includes("account"))) {
    riskScore += 40;
    signals.push("Sensitive Info");
    scamTypes.push("OTP Scam");

    reasons.push("Sensitive OTP maangi ja rahi hai.");
    advice.push("OTP kabhi kisi ke saath share na karein.");
  }

  // 🔴 LINK (SMART)
  if (hasLink) {
    riskScore += 25;
    signals.push("Link");
    scamTypes.push("Phishing Link");

    reasons.push("Message me link diya gaya hai, verify kiye bina click risky ho sakta hai.");
    advice.push("Unknown link par click na karein.");
  }

  // 🔴 FEAR
  if (hasFear) {
    riskScore += 20;
    signals.push("Fear");
    reasons.push("Dar create kiya ja raha hai.");
    advice.push("Panic na karein.");
  }

  // 🎯 BONUS LOGIC (POWERFUL 🔥)
  if (hasUrgency && hasMoney) {
    riskScore += 15;
    reasons.push("Urgency + paise ka combo = high manipulation.");
  }

  if (hasOTP && hasLink) {
    riskScore += 20;
    reasons.push("OTP + link combo bahut dangerous hota hai.");
  }

  // 🎯 FINAL RESULT
  let result = "SAFE";

  if (riskScore >= 70) result = "DANGEROUS";
  else if (riskScore >= 35) result = "SUSPICIOUS";

  // 🧠 HUMAN MESSAGE (SMART + NON-TEMPLATE)
  let humanMessage = "";

  if (signals.length === 0) {
    humanMessage = "Koi strong scam pattern detect nahi hua.";
  } else {
    humanMessage = reasons.join("\n");
  }

  // 🛡️ SAFETY STATUS
  let safetyStatus = "";
  let reminder = "👉 Kabhi bhi OTP ya personal details share na karein.";
  let emergency = "";

  if (result === "DANGEROUS") {
    safetyStatus = "🚨 High risk: Yeh scam ho sakta hai.";
    emergency = "⚠️ Agar aapne info share kiya hai to turant action lein (bank contact karein).";
  } else if (result === "SUSPICIOUS") {
    safetyStatus = "⚠️ Suspicious: Dhyaan se verify karein.";
  } else {
    safetyStatus = "✅ Safe: Koi strong danger detect nahi hua.";
  }

  // 🎯 FINAL MESSAGE
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
