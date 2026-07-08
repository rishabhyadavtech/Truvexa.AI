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

    advice.push("Panic me decision mat lo — pehle verify karo.");
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

    advice.push("Jaldi decision mat lo — thoda rukkar socho.");
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

    advice.push("Official website ya helpline se verify karo.");
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

    advice.push("Too good to be true offers ignore karo.");
  }

  // 🎯 PRESSURE / ISOLATION
  if (
    text.includes("don't tell") ||
    text.includes("secret") ||
    text.includes("limited time")
  ) {
    signals.push("Pressure");
    score += 20;

    advice.push("Kisi trusted person se discuss karo.");
  }

  // 🔗 LINK
  if (text.includes("http") || text.includes("www")) {
    signals.push("Link");
    score += 20;

     advice.push("Link click karne se pehle URL verify karo.");
  }

  // 🧠 NO SIGNAL (SAFE CASE)
  if (messages.length === 0) {
    return {
      manipulationScore: 0,
      manipulationLevel: "LOW",
      signals: [],
      manipulationAdvice: ["Basic caution rakho."]
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
    manipulationMessage: finalMessage,
    manipulationAdvice: [...new Set(advice)]
  };
}

module.exports = { detectManipulation };
