function detectManipulation(input) {
  let text = input.toLowerCase();

  let signals = [];
  let score = 0;
  let manipulationMessage = "";
  let manipulationAdvice = [];

  // 😨 FEAR
  if (
    text.includes("blocked") ||
    text.includes("suspended") ||
    text.includes("legal action") ||
    text.includes("account will be closed") ||
    text.includes("warning")
  ) {
    signals.push("Fear");
    score += 25;

    manipulationMessage += "😨 Yeh message aapko darakar fasana chah raha hai (account block ya legal action ka darr). Scammers fear ka use karke aapko panic me decision lene par majboor karte hain.\n\n";

    manipulationAdvice.push("🧘 Panic me decision na lein, pehle calmly verify karein.");
  }

  // ⏰ URGENCY
  if (
    text.includes("urgent") ||
    text.includes("immediately") ||
    text.includes("now") ||
    text.includes("within 24 hours")
  ) {
    signals.push("Urgency");
    score += 20;

    manipulationMessage += "⚠️ Yeh message aapko jaldi decision lene par majboor kar raha hai. Yeh ek psychological trick hai jisse aap bina soche action le lo.\n\n";

    manipulationAdvice.push("⏳ Jaldi decision na lein, thoda time lekar check karein.");
  }

  // 👑 AUTHORITY
  if (
    text.includes("bank") ||
    text.includes("government") ||
    text.includes("official") ||
    text.includes("rbi")
  ) {
    signals.push("Authority");
    score += 20;

    manipulationMessage += "🏛️ Yeh message kisi authority (bank ya government) ka naam use kar raha hai. Yeh trust gain karne ki trick hoti hai.\n\n";

    manipulationAdvice.push("🏛️ Direct official website ya helpline se verify karein.");
  }

  // 💰 GREED
  if (
    text.includes("win") ||
    text.includes("reward") ||
    text.includes("prize") ||
    text.includes("free") ||
    text.includes("double money") ||
    text.includes("lakh") ||
    text.includes("rupees")
  ) {
    signals.push("Greed");
    score += 25;

    manipulationMessage += "💰 Yeh message aapko lalach de raha hai (reward ya paise ka promise). Scammers aksar greed ka use karke trap karte hain.\n\n";

    manipulationAdvice.push("💡 Too good to be true offers par turant trust na karein.");
  }

  // 🎯 PRESSURE (NEW 🔥)
  if (
    text.includes("don't tell anyone") ||
    text.includes("limited time") ||
    text.includes("act fast")
  ) {
    signals.push("Pressure");
    score += 20;

    manipulationMessage += "🎯 Yeh message aap par pressure bana raha hai (secret ya limited time bolkar). Yeh trick aapko confuse aur control karne ke liye hoti hai.\n\n";

    manipulationAdvice.push("🤫 Kisi se chupane wale messages par doubt karein aur kisi trusted person se baat karein.");
  }

  // ✅ DEFAULT MESSAGE
  if (manipulationMessage === "") {
    manipulationMessage = "✅ Is message me koi strong emotional manipulation detect nahi hua.";
    manipulationAdvice.push("👍 Phir bhi unknown messages ko lightly na lein, basic caution rakhein.");
  }

  // FINAL LEVEL
  let level = "LOW";
  if (score >= 60) level = "HIGH";
  else if (score >= 30) level = "MEDIUM";

  return {
    manipulationScore: score,
    manipulationLevel: level,
    signals,
    manipulationMessage,
    manipulationAdvice
  };
}

module.exports = { detectManipulation };
