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

    const type = data.type;
    const decision = data.decision || {};

    resultBox.className = "result-box";

    // 🟢 SAFE MODE
    if (type === "SAFE") {
      resultBox.classList.add("safe");

      resultBox.innerText = `
✅ Yeh message safe lag raha hai.

Koi strong scam ya manipulation signal detect nahi hua.
Aap bina tension ke is message ko normal treat kar sakte hain.
      `;

      return;
    }

    // 🔴 / 🟡 COLOR
    if (type === "DANGEROUS") {
      resultBox.classList.add("danger");
    } else {
      resultBox.classList.add("warning");
    }

    let explanation = data.explanation || "";

    resultBox.innerText = `
${data.finalMessage || "⚠️ Yeh message suspicious lag raha hai."}

🧠 Samajh kya aa raha hai:

${explanation}

----------------------------

🧠 Final Decision:

👉 ${decision.decision || ""}

📌 Kya karein:
👉 ${decision.action || ""}

💡 Kyun:
${decision.reason || ""}

----------------------------

⚠️ Risk Signals:
- ${(data.signals || []).join("\n- ")}

👉 Aap kya karein:
- ${(data.advice || []).join("\n- ")}
    `;

  } catch (error) {
    console.error("Fetch Error:", error);

    resultBox.className = "result-box danger";
    resultBox.innerText =
      "❌ Server error. Please refresh and try again.";
  }
}
