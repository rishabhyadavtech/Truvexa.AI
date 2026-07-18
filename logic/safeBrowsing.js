const SAFE_BROWSING_API =
  "https://safebrowsing.googleapis.com/v4/threatMatches:find";

async function checkSafeBrowsing(url) {

  // URL hi nahi mila
  if (!url) {
    return {
      success: false,
      safe: true,
      source: "Google Safe Browsing",
      threats: [],
      message: "No URL detected."
    };
  }

  // API key abhi add nahi hui
  if (!process.env.GOOGLE_SAFE_BROWSING_API_KEY) {
    return {
      success: false,
      safe: true,
      source: "Google Safe Browsing",
      threats: [],
      message: "API key not configured."
    };
  }

  try {

    const body = {
      client: {
        clientId: "truvexa-ai",
        clientVersion: "1.0.0"
      },

      threatInfo: {

        threatTypes: [
          "MALWARE",
          "SOCIAL_ENGINEERING",
          "UNWANTED_SOFTWARE",
          "POTENTIALLY_HARMFUL_APPLICATION"
        ],

        platformTypes: [
          "ANY_PLATFORM"
        ],

        threatEntryTypes: [
          "URL"
        ],

        threatEntries: [
          {
            url
          }
        ]
      }
    };

    const response = await fetch(
      `${SAFE_BROWSING_API}?key=${process.env.GOOGLE_SAFE_BROWSING_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      }
    );

    const data = await response.json();

    if (data.matches && data.matches.length > 0) {

      return {

        success: true,

        safe: false,

        source: "Google Safe Browsing",

        threats: data.matches.map(x => x.threatType),

        message: "Unsafe URL detected."

      };

    }

    return {

      success: true,

      safe: true,

      source: "Google Safe Browsing",

      threats: [],

      message: "No known threats found."

    };

  } catch (err) {

    return {

      success: false,

      safe: true,

      source: "Google Safe Browsing",

      threats: [],

      message: "API unavailable."

    };

  }

}
function buildSafeBrowsingExplanation(result) {

if (!result.success) {

return result.message;

}

if (result.safe) {

return `

🛡 Google Safe Browsing

Status : Safe

Google's Safe Browsing database did not detect this website as phishing, malware, deceptive, or harmful.

Threats Found : None

This is a strong trust signal, although it should still be combined with other security checks.

`.trim();

}

return `

🛡 Google Safe Browsing

Status : Unsafe

Google has identified this website as potentially dangerous.

Threat Types:

${result.threats.map(t => "• " + t).join("\n")}

Avoid opening this website unless you completely trust the source.

`.trim();

}

module.exports = {
  checkSafeBrowsing,
  buildSafeBrowsingExplanation
};