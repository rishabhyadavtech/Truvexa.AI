async function checkScam() {
  console.log("BUTTON CLICKED");

  const message = document.getElementById("input").value;

  if (!message) {
    alert("Please enter a message");
    return;
  }

  const res = await fetch("/check", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message })
  });

  const data = await res.json();

  document.getElementById("result").innerText =
`Result: ${data.result}
Risk Score: ${data.riskScore}
Scam Type: ${data.scamType}

🔥 Manipulation Analysis:
Level: ${data.manipulationLevel}
Score: ${data.manipulationScore}

Detected Signals:
- ${data.signals.join("\n- ")}

Explanation:
- ${data.reasons.join("\n- ")}

What to do:
- ${data.advice.join("\n- ")}

------------------------

Safety Status:
${data.safetyStatus}

Important Reminder:
${data.reminder}

${data.emergency || ""}

----------------------

General Safety Tips:
- Is message par turant react na karein
- OTP ya personal info kisi ke saath share na karein
- Sirf official source se verify karein
`;
}
