async function checkScam() {

  const message = document.getElementById("input").value.trim();
  const resultBox = document.getElementById("result");

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

    if (!res.ok) throw new Error("Server error");

    const data = await res.json();

    const scam = data.scam || {};
    const manipulation = data.manipulation || {};

    // RESET STYLE
    resultBox.className = "result-box";

    const isSafe = scam.result && scam.result.includes("SAFE");

    // 🟢 SAFE MODE
    if (isSafe) {
      resultBox.classList.add("safe");

      resultBox.innerText = `
✅ Yeh message safe lag raha hai.

Koi strong scam ya manipulation signal detect nahi hua.
Aap bina tension ke is message ko normal treat kar sakte hain.
      `;

      return; // 🚨 STOP here (important fix)
    }

    // 🔴 SCAM / RISKY MODE
    if (scam.result.includes("DANGEROUS")) {
      resultBox.classList.add("danger");
    } else {
      resultBox.classList.add("warning");
    }

    // 🎯 Dynamic explanation (AI feel)
    let explanation = "";

    if (scam.humanMessage) {
      explanation += scam.humanMessage + "\n";
    }

    if (manipulation.manipulationMessage) {
      explanation += manipulation.manipulationMessage + "\n";
    }

    // 🎯 Unique advice combine (duplicate हटाओ)
    let allAdvice = [
      ...(scam.advice || []),
      ...(manipulation.manipulationAdvice || [])
    ];

    allAdvice = [...new Set(allAdvice)]; // remove duplicates

    resultBox.innerText = `
${scam.finalMessage || "⚠️ Yeh message suspicious lag raha hai."}

🧠 Samajh kya aa raha hai:
${explanation.trim()}

⚠️ Risk Signals:
- ${(scam.signals || []).join("\n- ")}

👉 Aap kya karein:
- ${allAdvice.join("\n- ")}
    `;

  } catch (error) {
    console.error("Fetch Error:", error);

    resultBox.className = "result-box danger";
    resultBox.innerText =
      "❌ Server error. Please refresh and try again.";
  }
}
