function detectScam(input) {
  let text = input.toLowerCase();

  let riskScore = 0;
  let reasons = [];
  let advice = [];
  let signals = [];
  let scamTypes = []; // 🔥 FIX: multiple types
  let result = "SAFE ✅";

  // 🔴 URGENCY
  if (
    text.includes("urgent") ||
    text.includes("immediately") ||
    text.includes("now") ||
    text.includes("within") ||
    text.includes("expire")
  ) {
    riskScore += 30;
    signals.push("Urgency");

    reasons.push("Jaldi decision lene ka pressure diya ja raha hai.");
    advice.push("Jaldi decision na lein.");
  }

  // 🔴 GREED
  if (
    text.includes("money") ||
    text.includes("rupees") ||
    text.includes("lakh") ||
    text.includes("prize") ||
    text.includes("reward") ||
    text.includes("win") ||
    text.includes("congratulation")
  ) {
    riskScore += 25;
    signals.push("Greed");

    reasons.push("Paise ya reward ka lalach diya gaya hai.");
    advice.push("Too good to be true offers ignore karein.");
  }

  // 🔴 BANK / OTP
  if (
    text.includes("otp") ||
    text.includes("bank") ||
    text.includes("account") ||
    text.includes("verify")
  ) {
    riskScore += 40;
    signals.push("Sensitive Info");

    scamTypes.push("Banking Scam");

    reasons.push("Sensitive information maangi ja rahi hai.");
    advice.push("OTP ya bank details kabhi share na karein.");
  }

  // 🔴 LINK
  if (text.includes("http") || text.includes("www") || text.includes(".com")) {
    riskScore += 30;
    signals.push("Link");

    scamTypes.push("Phishing Link");

    reasons.push("Suspicious link diya gaya hai.");
    advice.push("Unknown link par click na karein.");
  }

  // 🔴 FEAR
  if (
    text.includes("blocked") ||
    text.includes("suspended") ||
    text.includes("legal action")
  ) {
    riskScore += 30;
    signals.push("Fear");

    reasons.push("Dar create kiya ja raha hai (account block ya legal threat).");
    advice.push("Panic na karein.");
  }

  // ✅ RESULT
  if (riskScore >= 70) result = "DANGEROUS ❌";
  else if (riskScore >= 30) result = "RISKY ⚠️";

  // 🧠 HUMAN MESSAGE (FLOW STYLE 🔥)
  let humanMessage = "";

  if (signals.length > 0) {
    humanMessage += "👉 Is message me kuch red flags mile:\n";

    if (signals.includes("Urgency")) {
      humanMessage += "⚠️ Jaldi decision lene ka pressure hai.\n";
    }
    if (signals.includes("Greed")) {
      humanMessage += "💰 Paise ka lalach diya gaya hai.\n";
    }
    if (signals.includes("Sensitive Info")) {
      humanMessage += "🚨 Sensitive info maangi ja rahi hai.\n";
    }
    if (signals.includes("Link")) {
      humanMessage += "🔗 Suspicious link diya gaya hai.\n";
    }
    if (signals.includes("Fear")) {
      humanMessage += "😨 Dar create kiya ja raha hai.\n";
    }
  } else {
    humanMessage = "✅ Koi strong scam signal detect nahi hua.";
  }

  // 🛡️ SAFETY STATUS (FIXED 🔥)
  let safetyStatus = "";
  let reminder = "👉 Kabhi bhi OTP ya personal details share na karein.";
  let emergency = "";

  if (riskScore >= 70) {
    safetyStatus = "🚨 High risk: Yeh scam ho sakta hai.";
    emergency = "⚠️ Agar aapne info share kiya hai to turant bank se contact karein.";
  } else if (riskScore >= 30) {
    safetyStatus = "⚠️ Medium risk: Suspicious hai.";
  } else {
    safetyStatus = "✅ Low risk: Koi strong danger nahi mila.";
  }

  // 🎯 FINAL MESSAGE
  let finalMessage = "";

  if (result.includes("SAFE")) {
    finalMessage = "👍 Yeh message normal lag raha hai.";
  } else if (result.includes("RISKY")) {
    finalMessage = "⚠️ Yeh message suspicious lag raha hai.";
  } else {
    finalMessage = "🚨 Yeh message scam ho sakta hai. Ignore karein.";
  }

  return {
    riskScore,
    result,
    scamType: scamTypes.join(", ") || "General", // 🔥 FIX
    reasons,
    advice: [...new Set(advice)], // 🔥 no duplicate
    humanMessage,
    finalMessage,
    signals,
    safetyStatus,
    reminder,
    emergency
  };
}

module.exports = detectScam;
