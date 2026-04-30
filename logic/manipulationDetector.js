function detectManipulation(input) {
  let text = input.toLowerCase();

  let signals = [];
  let score = 0;
  let messages = [];
  let advice = [];

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

    messages.push("😨 Yeh message darr create kar raha hai (account ya legal threat).");
    advice.push("Panic me decision na lein.");
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

    messages.push("⚠️ Yeh message aapko jaldi decision lene par majboor kar raha hai.");
    advice.push("Jaldi decision na lein.");
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

    messages.push("🏛️ Yeh message authority ka naam use karke trust gain kar raha hai.");
    advice.push("Official source se verify karein.");
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

    messages.push("💰 Yeh message aapko lalach de raha hai (paise ya reward ka promise).");
    advice.push("Too good to be true offers ignore karein.");
  }

  // 🎯 PRESSURE
  if (
    text.includes("don't tell") ||
    text.includes("secret") ||
    text.includes("limited time")
  ) {
    signals.push("Pressure");
    score += 20;

    messages.push("🎯 Yeh message aap par pressure bana raha hai (secret ya limited time).");
    advice.push("Aise messages kisi trusted person se discuss karein.");
  }

  // 🔗 LINK
  if (text.includes("http") || text.includes("www")) {
    signals.push("Link");
    score += 20;

    messages.push("🔗 Message me suspicious link diya gaya hai.");
    advice.push("Link par click karne se pehle check karein.");
  }

  // 🧠 DEFAULT
  if (messages.length === 0) {
    messages.push("✅ Koi strong emotional manipulation detect nahi hua.");
    advice.push("Basic caution rakhein.");
  }

  // 🎯 LEVEL
  let level = "LOW";
  if (score >= 60) level = "HIGH";
  else if (score >= 30) level = "MEDIUM";

  // 🔥 FINAL SUMMARY (NEW 🔥)
  let summary = "";

  if (level === "HIGH") {
    summary = "🚨 Yeh message strong manipulation use kar raha hai.";
  } else if (level === "MEDIUM") {
    summary = "⚠️ Yeh message aapko manipulate karne ki koshish kar raha hai.";
  } else {
    summary = "👍 Koi strong manipulation nahi mila.";
  }

  // 🧠 HUMAN FRIENDLY MESSAGE (FLOW 🔥)
  let manipulationMessage =
    summary + "\n\n👉 Is message me yeh tactics use hui hain:\n" +
    messages.join("\n");

  return {
    manipulationScore: score,
    manipulationLevel: level,
    signals,
    manipulationMessage,
    manipulationAdvice: [...new Set(advice)] // 🔥 duplicate remove
  };
}

module.exports = { detectManipulation };
