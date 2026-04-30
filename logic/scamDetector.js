function detectScam(input) {
  let text = input.toLowerCase();

  let riskScore = 0;
  let reasons = [];
  let advice = [];
  let signals = [];
  let scamType = "General";
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

    reasons.push("Message jaldi decision lene ka pressure bana raha hai.");
    advice.push("Jaldi decision na lein, pehle verify karein.");
  }

  // 🔴 GREED / MONEY
  if (
    text.includes("money") ||
    text.includes("rupees") ||
    text.includes("lakh") ||
    text.includes("prize") ||
    text.includes("reward") ||
    text.includes("win") ||
    text.includes("congratulation") // 🔥 fix
  ) {
    riskScore += 25;
    signals.push("Greed");

    reasons.push("Message me paisa ya reward ka lalach diya gaya hai.");
    advice.push("Too good to be true offers par trust na karein.");
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

    scamType = "Banking Scam";

    reasons.push("Sensitive information (OTP ya account details) maangi ja rahi hai.");
    advice.push("Kabhi bhi OTP ya bank details share na karein.");
  }

  // 🔴 LINK
  if (text.includes("http") || text.includes("www") || text.includes(".com")) {
    riskScore += 30;
    signals.push("Link");

    scamType = "Phishing Link";

    reasons.push("Message me suspicious link diya gaya hai.");
    advice.push("Unknown links par click na karein.");
  }

  // 🔴 FEAR
  if (
    text.includes("blocked") ||
    text.includes("suspended") ||
    text.includes("legal action")
  ) {
    riskScore += 30;
    signals.push("Fear");

    reasons.push("Message dar create kar raha hai (account block ya legal threat).");
    advice.push("Panic na karein, calmly verify karein.");
  }

  // ✅ RESULT
  if (riskScore >= 70) result = "DANGEROUS ❌";
  else if (riskScore >= 30) result = "RISKY ⚠️";

  // 🧠 HUMAN MESSAGE (SHORT + CLEAR)
  let humanMessage = "";

  if (signals.includes("Urgency")) {
    humanMessage += "⚠️ Yeh message aapko jaldi decision lene par majboor kar raha hai.\n";
  }

  if (signals.includes("Greed")) {
    humanMessage += "💰 Yeh message aapko lalach de raha hai (reward ya paise ka promise).\n";
  }

  if (signals.includes("Sensitive Info")) {
    humanMessage += "🚨 Yeh message aapse sensitive information maang raha hai.\n";
  }

  if (signals.includes("Link")) {
    humanMessage += "🔗 Is message me suspicious link hai.\n";
  }

  if (signals.includes("Fear")) {
    humanMessage += "😨 Yeh message aapko darakar control karne ki koshish kar raha hai.\n";
  }

  // DEFAULT
  if (humanMessage === "") {
    humanMessage = "✅ Koi strong scam signal detect nahi hua.";
  }

  // 🎯 FINAL LINE (MOST IMPORTANT)
  let finalMessage = "";

  if (result.includes("SAFE")) {
    finalMessage = "👍 Yeh message normal lag raha hai.";
  } else if (result.includes("RISKY")) {
    finalMessage = "⚠️ Yeh message suspicious lag raha hai. Dhyaan se check karein.";
  } else {
    finalMessage = "🚨 Yeh message scam ho sakta hai. Is par trust na karein.";
  }

  return {
    riskScore,
    result,
    scamType,
    reasons,
    advice,
    humanMessage,
    finalMessage,
    signals
  };
}

module.exports = detectScam;
