async function checkScam() {
  console.log("BUTTON CLICKED");

  const message = document.getElementById("input").value.trim();

  if (!message) {
    alert("Please enter a message");
    return;
  }

  try {
    const res = await fetch("/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    // ✅ FIX 1: response check
    if (!res.ok) {
      throw new Error("Server error");
    }

    // ✅ FIX 2: safe JSON parse
    const data = await res.json();

    document.getElementById("result").innerText = `
==============================

${data.finalMessage || ""}

------------------------------

🧠 AI Explanation:
${data.humanMessage || "No explanation available"}

------------------------------

🔥 Manipulation Insight:
Level: ${data.manipulationLevel || "N/A"}
Score: ${data.manipulationScore || 0}

Signals:
- ${(data.signals && data.signals.length > 0)
        ? data.signals.join("\n- ")
        : "No strong signals detected"}

------------------------------

👉 Aap kya karein:
- ${(data.advice && data.advice.length > 0)
        ? data.advice.join("\n- ")
        : "Basic caution rakhein"}

🧠 Smart Advice:
- ${(data.manipulationAdvice && data.manipulationAdvice.length > 0)
        ? data.manipulationAdvice.join("\n- ")
        : "Calm rehkar verify karein"}

------------------------------

🛡️ Safety Status:
${data.safetyStatus || ""}

📌 Reminder:
${data.reminder || ""}

${data.emergency || ""}

------------------------------

📢 General Safety Tips:
- Jaldi decision na lein
- OTP / personal info share na karein
- Sirf official source verify karein

==============================
`;

  } catch (error) {
    console.error("Fetch Error:", error);

    document.getElementById("result").innerText =
      "❌ Server error ya response nahi mila. Page refresh karke dobara try karein.";
  }
}
