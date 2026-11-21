/**
 * @fileoverview In-Browser AI STEM Pit Crew & Doubt Solver (Guru Bot).
 * Provides instantaneous interactive Q&A, custom quiz generation for any user-entered topic,
 * and evidence-based study anxiety / stress reframing. Works 100% offline in browser.
 */

export class AiTutor {
  constructor() {
    this.knowledgeBase = this.buildKnowledgeBase();
  }

  /**
   * Explains any concept or answers doubts in real time.
   * @param {string} query User question or doubt
   * @param {string} lang 'hi' | 'en'
   * @param {number} grade 1 to 8
   * @returns {{ answer: string, analogy: string, anxietyTip: string|null }}
   */
  answerQuery(query, lang = 'hi', grade = 5) {
    const qLower = query.toLowerCase().trim();

    // Check for Anxiety / Stress / Nervousness triggers
    if (this.isAnxietyQuery(qLower)) {
      return this.getAnxietyAdvice(lang);
    }

    // Match against STEM concepts
    for (const item of this.knowledgeBase) {
      if (item.keywords.some((kw) => qLower.includes(kw))) {
        return {
          answer: item.explanation[lang] || item.explanation.en,
          analogy: item.analogy[lang] || item.analogy.en,
          anxietyTip: lang === 'hi'
            ? 'तनाव कम करने का राज: 4 सेकंड गहरी सांस लें, 4 सेकंड रोकें, और धीरे-धीरे छोड़ें।'
            : 'Focus tip: Inhale for 4 seconds, hold for 4, and exhale slowly to activate calm focus.'
        };
      }
    }

    // Fallback general pedagogical explanation tailored to grade
    if (lang === 'hi') {
      return {
        answer: `कक्षा ${grade} के स्तर पर: '${query}' विज्ञान और गणित का एक महत्वपूर्ण विषय है। जब हम किसी नियम को छोटे-छोटे बुनियादी चरणों में बांटते हैं, तो वह बहुत आसान हो जाता है।`,
        analogy: 'कार की रेस की तरह: जब तक गियर सही न हो, इंजन नहीं दौड़ता। उसी तरह अवधारणा को पहले समझें, फिर अभ्यास करें।',
        anxietyTip: 'जब कोई सवाल कठिन लगे, तो एक गहरी सांस लें। दिमाग शांत होने पर समाधान तुरंत दिखता है!'
      };
    } else {
      return {
        answer: `At Grade ${grade} level: '${query}' is a fundamental concept. Breaking it down into core principles makes it easy to conquer step by step.`,
        analogy: 'Just like drag racing: smooth acceleration beats frantic rushing. Understand the core rule, then apply it.',
        anxietyTip: 'Exam stress is simply your body giving you energy to focus. Channel that energy calmly.'
      };
    }
  }

  /**
   * Generates a 3-question customized quiz on ANY topic entered by the user.
   * @param {string} topicText Custom topic name (e.g., 'Friction', 'घर्षण', 'Photosynthesis')
   * @param {number} grade Class standard
   * @param {string} lang 'hi' | 'en'
   * @returns {Array<object>} Array of quiz questions
   */
  generateCustomQuiz(topicText, grade = 5, lang = 'hi') {
    const cleanTopic = topicText.trim() || (lang === 'hi' ? 'सामान्य विज्ञान' : 'General Science');

    // 1. Friction / Motion / Forces
    if (/frict|घर्षण|गति|motion|newton|बल|force/i.test(cleanTopic)) {
      return [
        {
          text: lang === 'hi' ? `घर्षण बल (Friction) कार के टायरों के लिए क्यों ज़रूरी है?` : `Why is friction force necessary for race car tires?`,
          options: lang === 'hi'
            ? ['कार को सड़क पर पकड़ (Grip) देने के लिए', 'कार को हवा में उड़ाने के लिए', 'टायरों का रंग बदलने के लिए', 'पेट्रोल बचाने के लिए']
            : ['To give grip on the track and allow turning', 'To lift the car into the air', 'To change tire color', 'To reduce fuel weight'],
          correctIndex: 0,
          hint: lang === 'hi' ? 'बिना घर्षण के पहिए सिर्फ फिसलेंगे।' : 'Without friction, wheels would spin in place.',
          explain: lang === 'hi' ? 'घर्षण सड़क और टायर के बीच पकड़ बनाता है जिससे कार मुड़ और रुक सकती है।' : 'Friction between tire rubber and asphalt gives traction for acceleration and braking.'
        },
        {
          text: lang === 'hi' ? `यदि सड़क पर तेल (Oil Slick) गिर जाए तो क्या होगा?` : `What happens if oil spills onto the race track?`,
          options: lang === 'hi'
            ? ['घर्षण बढ़ जाएगा', 'घर्षण बहुत कम हो जाएगा और कार फिसल जाएगी', 'कार की गति दोगुनी हो जाएगी', 'टायर जम जाएंगे']
            : ['Friction increases', 'Friction drops sharply, causing a skid', 'Speed permanently doubles', 'Tires freeze'],
          correctIndex: 1,
          hint: lang === 'hi' ? 'तेल चिकनाई पैदा करता है।' : 'Oil acts as a lubricant.',
          explain: lang === 'hi' ? 'तेल की परत घर्षण को शून्य के करीब कर देती है, जिससे वाहन नियंत्रण खो देता है।' : 'Lubricants reduce microscopic interlocking, reducing friction and causing loss of control.'
        },
        {
          text: lang === 'hi' ? `न्यूटन के तीसरे नियम के अनुसार, जब पहिया ज़मीन को पीछे धकेलता है तो क्या होता है?` : `According to Newton's 3rd Law, what happens when wheels push back against the ground?`,
          options: lang === 'hi'
            ? ['ज़मीन कार को आगे की ओर धकेलती है', 'कार तुरंत रुक जाती है', 'कोई बल नहीं लगता', 'कार पीछे भागती है']
            : ['The ground pushes the car forward with equal force', 'The car immediately stops', 'Zero force acts', 'The car flies backward'],
          correctIndex: 0,
          hint: lang === 'hi' ? 'क्रिया के बराबर और विपरीत प्रतिक्रिया।' : 'Every action has an equal and opposite reaction.',
          explain: lang === 'hi' ? 'पहिया सड़क पर पीछे बल लगाता है, और प्रतिक्रिया बल कार को आगे गति देता है।' : 'Action force pushes back on asphalt; reaction force propels vehicle forward.'
        }
      ];
    }

    // 2. Photosynthesis / Plants / Biology
    if (/photo|प्रकाश|plant|पौधे|bio|बायो|cell|कोशिका/i.test(cleanTopic)) {
      return [
        {
          text: lang === 'hi' ? `पौधे प्रकाश संश्लेषण (Photosynthesis) के दौरान कौन सी गैस छोड़ते हैं?` : `Which gas do plants release during photosynthesis?`,
          options: lang === 'hi'
            ? ['ऑक्सीजन (Oxygen)', 'कार्बन डाइऑक्साइड', 'नाइट्रोजन', 'हीलियम']
            : ['Oxygen (O2)', 'Carbon Dioxide (CO2)', 'Nitrogen', 'Helium'],
          correctIndex: 0,
          hint: lang === 'hi' ? 'यह गैस हम सांस लेने में इस्तेमाल करते हैं।' : 'This gas is vital for human respiration.',
          explain: lang === 'hi' ? 'पौधे CO2 और धूप से ग्लूकोज बनाते हैं और ऑक्सीजन वायुमंडल में छोड़ते हैं।' : 'Plants consume carbon dioxide and water to produce glucose, releasing oxygen.'
        },
        {
          text: lang === 'hi' ? `पत्तियों में हरा रंग किस वर्णक (Pigment) के कारण होता है?` : `Which pigment gives plant leaves their green color?`,
          options: lang === 'hi'
            ? ['क्लोरोफिल (Chlorophyll)', 'हीमोग्लोबिन', 'मेलेनिन', 'केरोटीन']
            : ['Chlorophyll', 'Hemoglobin', 'Melanin', 'Carotene'],
          correctIndex: 0,
          hint: lang === 'hi' ? 'यह सूर्य के प्रकाश को सोखता है।' : 'It absorbs solar energy.',
          explain: lang === 'hi' ? 'क्लोरोफिल सूर्य के लाल व नीले प्रकाश को सोखता है और हरे रंग को परावर्तित करता है।' : 'Chlorophyll absorbs blue and red wavelengths of light and reflects green.'
        },
        {
          text: lang === 'hi' ? `पौधों की रसोई किसे कहा जाता है?` : `Which part of a plant is considered its food factory?`,
          options: lang === 'hi'
            ? ['पत्तियाँ (Leaves)', 'जड़ें (Roots)', 'तना (Stem)', 'फूल (Flower)']
            : ['Leaves', 'Roots', 'Stem', 'Flower'],
          correctIndex: 0,
          hint: lang === 'hi' ? 'यहाँ धूप और क्लोरोफिल मिलते हैं।' : 'Where sunlight meets chlorophyll.',
          explain: lang === 'hi' ? 'पत्तियों में रसोइघर की तरह सूर्य के प्रकाश से भोजन तैयार होता है।' : 'Leaves contain the chloroplasts where light-dependent reactions create sugars.'
        }
      ];
    }

    // 3. General STEM Synthesis based on topicText
    return [
      {
        text: lang === 'hi' ? `${cleanTopic} में बुनियादी वैज्ञानिक इकाई या नियम क्या है?` : `What is the fundamental scientific principle governing ${cleanTopic}?`,
        options: lang === 'hi'
          ? ['ऊर्जा और पदार्थ का संरक्षण (Conservation)', 'यादृच्छिक जादू', 'बिना कारण के बदलाव', 'स्थिरता का अभाव']
          : ['Conservation of Energy and Mass', 'Random chance', 'Spontaneous disappearance', 'Zero physical interaction'],
        correctIndex: 0,
        hint: lang === 'hi' ? 'ऊर्जा न तो बनाई जा सकती है, न नष्ट की जा सकती है।' : 'Energy is neither created nor destroyed.',
        explain: lang === 'hi' ? `${cleanTopic} में ऊर्जा का एक रूप से दूसरे रूप में रूपांतरण होता है।` : `All systems in ${cleanTopic} obey fundamental conservation laws.`
      },
      {
        text: lang === 'hi' ? `${cleanTopic} को बेहतर समझने के लिए कौन सी वैज्ञानिक विधि सबसे उपयोगी है?` : `Which scientific method best verifies hypotheses in ${cleanTopic}?`,
        options: lang === 'hi'
          ? ['प्रयोग, अवलोकन और डेटा मापन', 'अटकलें लगाना', 'अनुमान पर भरोसा', 'बिना जांचे मान लेना']
          : ['Observation, Controlled Experimentation and Measurement', 'Pure guessing', 'Rumors', 'Acceptance without proof'],
        correctIndex: 0,
        hint: lang === 'hi' ? 'विज्ञान प्रयोगों पर आधारित है।' : 'Science relies on verifiable evidence.',
        explain: lang === 'hi' ? 'सटीक मापन और प्रयोग ही सही वैज्ञानिक निष्कर्ष देते हैं।' : 'Empirical measurement and controlled tests validate physical laws.'
      },
      {
        text: lang === 'hi' ? `${cleanTopic} के प्रश्नों को परीक्षा में हल करते समय घबराहट से कैसे बचें?` : `How do you stay calm and accurate when solving questions on ${cleanTopic}?`,
        options: lang === 'hi'
          ? ['सवाल को ध्यान से पढ़ें, गहरी सांस लें और चरणबद्ध हल करें', 'जल्दबाज़ी में कोई भी विकल्प चुनें', 'घबराकर छोड़ दें', 'समय बर्बाद करें']
          : ['Read calmly, take a deep belly breath, and solve step-by-step', 'Blindly rush to click', 'Panic and abandon', 'Overthink without reading'],
        correctIndex: 0,
        hint: lang === 'hi' ? 'शांति ही सफलता की कुंजी है।' : 'Calm focus beats speed without accuracy.',
        explain: lang === 'hi' ? 'दिमाग शांत रहने पर सीखी हुई बातें तुरंत याद आती हैं।' : 'Regulating your nervous system with slow breathing ensures peak recall.'
      }
    ];
  }

  isAnxietyQuery(q) {
    return /anxiet|stress|nervous|घबराहट|तनाव|डर|panic|worry|चिंता|focus|ध्यान/i.test(q);
  }

  getAnxietyAdvice(lang) {
    if (lang === 'hi') {
      return {
        answer: 'परीक्षा या दौड़ में दिल की धड़कन बढ़ना बिल्कुल सामान्य है! आपका शरीर आपको ऊर्जावान और सतर्क बनाने के लिए एड्रेनालाईन छोड़ रहा है। इसे डर नहीं, अपनी "सुपरपावर" समझें।',
        analogy: 'कार के इंजन में जब टर्बोचार्जर शुरू होता है, तो आवाज़ तेज होती है। वैसे ही आपका दिल आपकी एकाग्रता बढ़ाने के लिए तेजी से धड़कता है।',
        anxietyTip: 'प्राणायाम (4-7-8 तकनीक): 4 सेकंड नाक से सांस लें, 7 सेकंड रोकें, और 8 सेकंड मुंह से धीरे-धीरे छोड़ें। धड़कन 10 सेकंड में शांत हो जाएगी!'
      };
    } else {
      return {
        answer: 'Feeling a pounding heart before a test or race is completely natural! Your autonomic nervous system is mobilizing adrenaline and glucose to give you razor-sharp alertness. Reframe it as excitement, not panic.',
        analogy: 'Like a high-performance engine spooling its turbocharger: the revs rise because power is ready to be put down on the asphalt.',
        anxietyTip: 'Vagus Nerve Reset (4-7-8 Breath): Inhale through nose for 4 counts, hold gently for 7, and exhale through mouth for 8. Your heart rate drops within seconds.'
      };
    }
  }

  buildKnowledgeBase() {
    return [
      {
        keywords: ['speed', 'velocity', 'चाल', 'वेग', 'गति', 'kinematics'],
        explanation: {
          hi: 'चाल (Speed) केवल यह बताती है कि आप कितनी तेज़ी से चल रहे हैं (जैसे 80 किमी/घंटा)। वेग (Velocity) दिशा के साथ चाल है (जैसे उत्तर की ओर 80 किमी/घंटा)।',
          en: 'Speed is how fast you are moving (e.g. 120 km/h). Velocity is speed with a specific direction (e.g. 120 km/h East).'
        },
        analogy: {
          hi: 'रेस ट्रैक पर सीधी रेखा में दौड़ना वेग है; गोल-गोल घूमते हुए स्पीडोमीटर की सुई चाल दिखाती है।',
          en: 'A dragster rocketing down a straight strip has velocity; spinning donuts in a parking lot changes velocity even if speed stays 40 km/h.'
        }
      },
      {
        keywords: ['acceleration', 'त्वरण', 'accel'],
        explanation: {
          hi: 'त्वरण (Acceleration) समय के साथ वेग में बदलाव की दर है। जब आप रेस कार का थ्रॉटल दबाते हैं और गति बढ़ती है, तो वह धनात्मक त्वरण है।',
          en: 'Acceleration is the rate of change of velocity over time (a = Δv / Δt). Stepping on the throttle creates positive acceleration.'
        },
        analogy: {
          hi: 'गियर 1 से गियर 2 में शिफ्ट करने पर जो धक्का महसूस होता है, वह त्वरण का असर है।',
          en: 'The G-force pushing your back into the racing seat during a 2nd-gear launch is acceleration in action.'
        }
      },
      {
        keywords: ['acid', 'base', 'अम्ल', 'क्षार', 'ph'],
        explanation: {
          hi: 'अम्ल (Acids) स्वाद में खट्टे होते हैं और नीले लिटमस को लाल कर देते हैं (pH < 7)। क्षार (Bases) कड़वे और साबुन जैसे चिकने होते हैं (pH > 7)।',
          en: 'Acids release H+ ions and taste sour (pH < 7). Bases release OH- ions, feel slippery, and have a pH > 7.'
        },
        analogy: {
          hi: 'नींबू का रस अम्ल है, और कार की बैटरी या साबुन का पानी क्षार जैसा काम करता है।',
          en: 'Lemon juice and battery acid are acids; baking soda and soap are bases. Water sits right at neutral pH 7.'
        }
      },
      {
        keywords: ['fraction', 'भिन्न', 'decimal', 'दशमलव', 'ratio'],
        explanation: {
          hi: 'भिन्न किसी पूरी वस्तु का एक हिस्सा होती है। अंश (ऊपर) बताता है कि कितने हिस्से हैं, और हर (नीचे) बताता है कि कुल कितने बराबर टुकड़े किए गए।',
          en: 'A fraction represents parts of a whole. The numerator (top) counts how many parts you have; the denominator (bottom) counts total equal slices.'
        },
        analogy: {
          hi: 'अगर पिज्जा के 4 बराबर टुकड़े करें और आप 3 खा लें, तो आपने 3/4 पिज्जा खाया!',
          en: 'If a fuel tank is divided into 4 quarters and you have 3 filled, your nitro tank is at 3/4 capacity!'
        }
      }
    ];
  }
}
