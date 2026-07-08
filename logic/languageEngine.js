const LANG = {

  en: {

    safe: "This message appears safe.",

    suspicious: "This message looks suspicious.",

    dangerous: "This message may be a scam.",

dangerExplanation:
"This message uses fear, urgency or greed to pressure you into acting quickly.",

    noSignal: "No strong scam indicators were detected.",

    verify: "Verify before taking any action.",

    dontClick: "Do not click unknown links.",

    dontShare: "Do not share OTP, passwords or bank details.",

reasons: {

  SHORTENED_URL:
    "The message contains a shortened URL that hides the real destination.",

  UNUSUAL_TLD:
    "The website uses an uncommon top-level domain frequently abused in scams.",

  BRAND_IMPERSONATION:
    "The domain appears to imitate a well-known brand.",

  LONG_URL:
    "The URL is unusually long, which is common in phishing attacks.",

  MULTIPLE_SUBDOMAINS:
    "The domain contains multiple subdomains, a common phishing technique.",

  INVALID_URL:
    "The URL format appears to be invalid.",

  HIGH_RISK:
    "Multiple independent security signals indicate high risk.",

  MEDIUM_RISK:
    "Several suspicious indicators were detected.",

  SAFE:
    "No significant security risks were detected."
},

 actions: {

  DONT_SHARE_OTP:
    "Never share your OTP, passwords or banking details.",

  DONT_CLICK_LINK:
    "Do not click the link. Visit the official website manually.",

  DONT_SEND_MONEY:
    "Do not send money until the offer has been independently verified.",

  VERIFY_OFFICIAL_SOURCE:
    "Verify the information using the official website or customer support.",

  IGNORE_MESSAGE:
    "Ignore this message and block the sender if necessary.",

  VERIFY_LINK:
    "Check the destination of the link before opening it.",

  VERIFY_OFFER:
    "Confirm the offer from the company's official website.",

  VERIFY_FIRST:
    "Verify the information before taking any action.",

  SAFE_TO_PROCEED:
    "No major warning signs were detected."
},

decisions: {

  SAFE:
    "No major risk detected.",

  MEDIUM:
    "Verify before taking any action.",

  HIGH:
    "Avoid interacting with this message."
},

}

  hi: {

    safe: "✅ Yeh message safe lag raha hai.",

    suspicious: "⚠️ Yeh message suspicious lag raha hai.",

    dangerous: "🚨 Yeh message scam ho sakta hai.",
 
dangerExplanation:
"👉 Yeh combination (fear, urgency, ya lalach) usually scam messages me use hota hai taaki aap bina soche react karein.",


    noSignal: "Koi strong scam signal detect nahi hua.",

    verify: "Action lene se pehle verify karein.",

    dontClick: "Unknown link par click mat karein.",

    dontShare: "OTP, password aur bank details share mat karein.",

reasons: {

SHORTENED_URL:
"Shortened link asli destination ko chhupa sakta hai.",

UNUSUAL_TLD:
"Domain unusual extension use kar raha hai jo scams me common hai.",

BRAND_IMPERSONATION:
"Domain kisi popular brand ki nakal karta hua lag raha hai.",

LONG_URL:
"Bahut lambi URL phishing ka signal ho sakti hai.",

MULTIPLE_SUBDOMAINS:
"Bahut saare subdomains phishing me common hote hain.",

INVALID_URL:
"URL valid format me nahi hai.",

HIGH_RISK:
"Kai independent security signals high risk dikha rahe hain.",

MEDIUM_RISK:
"Kuch suspicious indicators detect hue hain.",

SAFE:
"Koi major security risk detect nahi hua."

},

actions: {

DONT_SHARE_OTP:
"OTP, password ya bank details kabhi share mat karein.",

DONT_CLICK_LINK:
"Link par click mat karein. Official website manually kholen.",

DONT_SEND_MONEY:
"Verify kiye bina paise mat bhejein.",

VERIFY_OFFICIAL_SOURCE:
"Official website ya customer support se verify karein.",

IGNORE_MESSAGE:
"Message ignore karein aur zarurat ho to sender ko block karein.",

VERIFY_LINK:
"Link kholne se pehle verify karein.",

VERIFY_OFFER:
"Offer ko official website se confirm karein.",

VERIFY_FIRST:
"Koi bhi action lene se pehle verify karein.",

SAFE_TO_PROCEED:
"Koi major warning sign detect nahi hua."

},

decisions: {

SAFE:
"Koi major risk detect nahi hua.",

MEDIUM:
"Action lene se pehle verify karein.",

HIGH:
"Is message se interact na karein."

}

}

};

function getLanguage(lang = "hi") {

  return LANG[lang] || LANG.hi;

}

module.exports = {
  getLanguage
};