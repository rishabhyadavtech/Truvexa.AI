function detectManipulation(input) {
  let text = input.toLowerCase();

  let signals = [];
  let score = 0;
  let manipulationMessage = [];
  let manipulationAdvice = [];

  // 😨 FEAR
  if (
    text.includes("blocked") ||
    text.includes("suspended") ||
    text.includes("legal action") ||
    text.includes("warning") ||
    text.includes("expire")
  ) {
    signals.push("Fear");
    score += 25;

    manipulationMessage.push("😨 Yeh message darr create kar raha hai (account ya legal threat).");
    manipulationAdvice.push("Panic me decision na lein, pehle verify karein.");
  }

  // ⏰ URGENCY
  if (
    text.includes("urgent") ||
    text.includes("immediately") ||
    text.includes("now") ||
    text.includes("within") ||
    text.includes("act fast")
  ) {
    signals.push("Urgency");
    score += 20;

    manipulationMessage.push("⚠️ Yeh message aapko jaldi decision lene par majboor kar raha hai.");
    manipulationAdvice.push("Jaldi decision na lein, thoda time lekar check karein.");
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

    manipulationMessage.push("🏛️ Yeh message authority ka naam use karke trust jeetne ki koshish kar raha hai.");
    manipulationAdvice.push("Direct official website ya helpline se verify karein.");
  }

  // 💰 GREED
  if (
    text.includes("win") ||
    text.includes("reward") ||
    text.includes("prize") ||
    text.includes("free") ||
    text.includes("lakh") ||
    text.includes("rupees") ||
    text.includes("money")
  ) {
    signals.push("Greed");
    score += 25;

    manipulationMessage.push("💰 Yeh message aapko lalach de raha hai (reward ya paise ka promise).");
    manipulationAdvice.push("Too good to be true offers par trust na karein.");
  }

  // 🎯 PRESSURE
  if (
    text.includes("don't tell") ||
    text.includes("secret") ||
    text.includes("limited time")
  ) {
    signals.push("Pressure");
    score += 20;

    manipulationMessage.push("🎯 Yeh message aap par pressure bana raha hai (secret ya limited time).");
    manipulationAdvice.push("Aise messages ko kisi trusted person ke saath discuss karein.");
  }

  // 🔗 LINK
  if (text.includes("http") || text.includes("www")) {
    signals.push("Link");
    score += 20;

    manipulationMessage.push("🔗 Message me suspicious link diya gaya hai.");
    manipulationAdvice.push("Link par click karne se pehle URL verify karein.");
  }

  // 🧠 DEFAULT
  if (manipulationMessage.length === 0) {
    manipulationMessage.push("✅ Koi strong emotional manipulation detect nahi hua.");
    manipulationAdvice.push("Phir bhi basic caution rakhein.");
  }

  // 🎯 LEVEL
  let level = "LOW";
  if (score >= 60) level = "HIGH";
  else if (score >= 30) level = "MEDIUM";

  return {
    manipulationScore: score,
    manipulationLevel: level,
    signals,
    manipulationMessage: manipulationMessage.join("\n"),
    manipulationAdvice
  };
}

module.exports = { detectManipulation };
