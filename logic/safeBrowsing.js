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

console.log("========== GOOGLE SAFE BROWSING ==========");
console.log("Checking URL:", url);

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
console.log("API Response:");
console.log(JSON.stringify(data, null, 2));

    if (data.matches && data.matches.length > 0) {

console.log("Google Safe Browsing Result: UNSAFE");
console.log(data.matches);

      return {
console.log("Google Safe Browsing Result: SAFE");

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
console.error("Google Safe Browsing Error:");
console.error(err);

    return {

      success: false,

      safe: true,

      source: "Google Safe Browsing",

      threats: [],

      message: "API unavailable."

    };

  }

}

module.exports = {
  checkSafeBrowsing
};
