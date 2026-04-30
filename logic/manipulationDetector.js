function detectManipulation(input) {
  let text = input.toLowerCase();

  let signals = [];
  let score = 0;
  let messages = [];
  let advice = [];

  // 🎯 helper (random variation)
  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

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

    messages.push(pick([
      "😨 Yeh message tumhe darakar control karna chahta hai.",
      "😨 Yahan fear create kiya ja raha hai taaki tum panic me action lo.",
      "😨 Dar ka use karke tumhe jaldi react karne par majboor kiya ja raha hai."
    ]));

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

    messages.push(pick([
      "⚠️ Yeh message tumhe jaldi decision lene ke liye push kar raha hai.",
      "⚠️ Yahan urgency create ki gayi hai taaki tum bina soche react karo.",
      "⚠️ Jaldi karne ka pressure diya ja raha hai — yeh scam pattern hota hai."
    ]));

    advice.push("Jaldi decision mat lo — rukkar socho.");
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

    messages.push(pick([
      "🏛️ Yeh message authority ka naam use karke trust gain kar raha hai.",
      "🏛️ Bank ya government ka naam use karke tumhe manipulate kiya ja raha hai.",
      "🏛️ Yeh trust build karne ka trick hai — blindly believe mat karo."
    ]));

    advice.push("Official source se khud verify karo.");
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

    messages.push(pick([
      "💰 Yeh message tumhe lalach dekar fasana chah raha hai.",
      "💰 Easy money ka promise diya ja raha hai — yeh dangerous sign hai.",
      "💰 Yeh reward ya paisa ka trap ho sakta hai."
    ]));

    advice.push("Too good to be true offers ignore karo.");
  }

  // 🎯 PRESSURE
  if (
    text.includes("don't tell") ||
    text.includes("secret") ||
    text.includes("limited time")
  ) {
    signals.push("Pressure");
    score += 20;

    messages.push(pick([
      "🎯 Yeh message tumhe isolate kar raha hai (secret ya pressure).",
      "🎯 Tum par pressure banaya ja raha hai taaki tum soch na pao.",
      "🎯 Secret ya limited time ka use manipulation hota hai."
    ]));

    advice.push("Kisi trusted person se baat karo.");
  }

  // 🔗 LINK
  if (text.includes("http") || text.includes("www")) {
    signals.push("Link");
    score += 20;

    messages.push(pick([
      "🔗 Yeh link tumhe fake website par le ja sakta hai.",
      "🔗 Link ke through tumhara data chura ja sakta hai.",
      "🔗 Unknown link dangerous ho sakta hai — avoid karo."
    ]));

    advice.push("Link click karne se pehle check karo.");
  }

  // 🧠 DEFAULT SAFE
  if (messages.length === 0) {
    return {
      manipulationScore: 0,
      manipulationLevel: "LOW",
      signals: [],
      manipulationMessage: "👍 Koi strong manipulation detect nahi hua.",
      manipulationAdvice: ["Basic caution rakho."]
    };
  }

  // 🎯 LEVEL
  let level = "LOW";
  if (score >= 60) level = "HIGH";
  else if (score >= 30) level = "MEDIUM";

  // 🔥 FINAL AI MESSAGE (REAL FEEL)
  let summary = "";

  if (level === "HIGH") {
    summary = "🚨 Yeh message strong manipulation use kar raha hai.\n";
  } else {
    summary = "⚠️ Yeh message tumhe manipulate karne ki koshish kar raha hai.\n";
  }

  let finalText =
    summary +
    "\n👉 Is message me yeh patterns dikh rahe hain:\n\n" +
    messages.join("\n") +
    "\n\n👉 Isliye thoda careful rehna zaroori hai.";

  return {
    manipulationScore: score,
    manipulationLevel: level,
    signals,
    manipulationMessage: finalText,
    manipulationAdvice: [...new Set(advice)]
  };
}

module.exports = { detectManipulation };
