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

    advice.push("VERIFY_FIRST");
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

    advice.push("DO_NOT_RUSH");
  }

  // 👑 AUTHORITY
  if (
    text.includes("bank") ||
    text.includes("government") ||
    text.includes("official") ||
    text.includes("rbi") ||
    text.includes("income tax")
  ) {
    signals.push("Authority");
    score += 20;

    advice.push("USE_OFFICAL_SOURCE");
  }

  // 💰 GREED
  if (
    text.includes("win") ||
    text.includes("reward") ||
    text.includes("prize") ||
    text.includes("free") ||
    text.includes("lakh") ||
    text.includes("rupees") ||
    text.includes("money") ||
    text.includes("profit") ||
    text.includes("double")
  ) {
    signals.push("Greed");
    score += 25;

    advice.push("IGNORE_TOO_GOOD_OFFERS");
  }

  // 🎯 PRESSURE / ISOLATION
  if (
    text.includes("don't tell") ||
    text.includes("secret") ||
    text.includes("limited time")
  ) {
    signals.push("Pressure");
    score += 20;

    advice.push("TAKE_TIME");
  }

  // 🔗 LINK
  if (text.includes("http") || text.includes("www")) {
    signals.push("Link");
    score += 20;

     advice.push("CHECK_LINK_FIRST");
  }

  // 🧠 NO SIGNAL (SAFE CASE)
  if (signals.length === 0){
    return {
      manipulationScore: 0,
      manipulationLevel: "LOW",
      signals: [],
      manipulationAdvice: []
    };
  }

  // 🎯 LEVEL CALCULATION
  let level = "LOW";
  if (score >= 60) level = "HIGH";
  else if (score >= 30) level = "MEDIUM";

  return {
    manipulationScore: score,
    manipulationLevel: level,
    signals: [...new Set(signals)],
    manipulationMessage: "",
    manipulationAdvice: [...new Set(advice)]
  };
}

module.exports = { detectManipulation };
