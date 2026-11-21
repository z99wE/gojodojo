export default {
  grade: 7,
  topics: {
    'maths-1': {
      subject: 'maths',
      title: { hi: 'पूर्णांक', en: 'Integers' },
      questions: [
        {
          text: { hi: '(-7) + 3 का मान क्या है?', en: 'What is (-7) + 3?' },
          options: [
            { hi: '-4', en: '-4' },
            { hi: '4', en: '4' },
            { hi: '-10', en: '-10' },
            { hi: '10', en: '10' }
          ],
          answer: 0,
          hint: { hi: 'ऋणात्मक संख्या से धनात्मक संख्या जोड़ते समय संख्या रेखा पर बाईं ओर से शुरू करें।', en: 'Start at -7 on the number line and move 3 steps right.' },
          explain: { hi: '-7 से 3 कदम दाईं ओर जाने पर -4 मिलता है। बड़ी संख्या का चिह्न परिणाम का चिह्न तय करता है।', en: 'Moving 3 steps right from -7 gives -4. The number with the bigger size decides the sign of the answer.' }
        },
        {
          text: { hi: '5 × (-4) का मान क्या है?', en: 'What is 5 × (-4)?' },
          options: [
            { hi: '20', en: '20' },
            { hi: '-20', en: '-20' },
            { hi: '-9', en: '-9' },
            { hi: '9', en: '9' }
          ],
          answer: 1,
          hint: { hi: 'धनात्मक और ऋणात्मक संख्या का गुणा करते समय चिह्न पर ध्यान दें।', en: 'Multiply the sizes first, then think about the sign.' },
          explain: { hi: '5 गुणा 4 बराबर 20 होता है। धन और ऋण का गुणा ऋणात्मक परिणाम देता है, इसलिए उत्तर -20 है।', en: 'Five times 4 is 20. A positive number times a negative number gives a negative answer, so the result is -20.' }
        },
        {
          text: { hi: '(-18) ÷ 3 का मान क्या है?', en: 'What is (-18) ÷ 3?' },
          options: [
            { hi: '-21', en: '-21' },
            { hi: '6', en: '6' },
            { hi: '15', en: '15' },
            { hi: '-6', en: '-6' }
          ],
          answer: 3,
          hint: { hi: 'पहले 18 को 3 से भाग दें, फिर चिह्न देखें।', en: 'Divide 18 by 3 first, then decide the sign.' },
          explain: { hi: '18 ÷ 3 बराबर 6 होता है। ऋणात्मक संख्या को धनात्मक से भाग देने पर परिणाम ऋणात्मक होता है।', en: 'Eighteen divided by 3 is 6. A negative number divided by a positive number is negative, so the answer is -6.' }
        }
      ]
    },
    'maths-2': {
      subject: 'maths',
      title: { hi: 'भिन्न और दशमलव: गुणा और भाग', en: 'Fractions and Decimals: Multiplication and Division' },
      questions: [
        {
          text: { hi: '1/2 × 3/4 का मान क्या है?', en: 'What is 1/2 × 3/4?' },
          options: [
            { hi: '2/3', en: '2/3' },
            { hi: '3/8', en: '3/8' },
            { hi: '1/4', en: '1/4' },
            { hi: '3/4', en: '3/4' }
          ],
          answer: 1,
          hint: { hi: 'भिन्नों का गुणा करते समय अंश को अंश से और हर को हर से गुणा करें।', en: 'Multiply the top numbers together and the bottom numbers together.' },
          explain: { hi: 'अंश 1 × 3 = 3 और हर 2 × 4 = 8 है, इसलिए परिणाम 3/8 है।', en: 'Top: 1 × 3 = 3. Bottom: 2 × 4 = 8. So the answer is 3/8.' }
        },
        {
          text: { hi: '2.5 × 4 का मान क्या है?', en: 'What is 2.5 × 4?' },
          options: [
            { hi: '6.5', en: '6.5' },
            { hi: '7.5', en: '7.5' },
            { hi: '10', en: '10' },
            { hi: '8', en: '8' }
          ],
          answer: 2,
          hint: { hi: 'दशमलव को अनदेखा करके पहले पूर्ण संख्याओं जैसा गुणा करें।', en: 'Ignore the dot for a moment and multiply 25 by 4.' },
          explain: { hi: '25 × 4 = 100 होता है। दशमलव को एक स्थान पीछे रखने पर परिणाम 10 मिलता है।', en: '25 times 4 is 100. Since 2.5 has one decimal place, move the dot one place left to get 10.' }
        },
        {
          text: { hi: '3/4 ÷ 3 का मान क्या है?', en: 'What is 3/4 ÷ 3?' },
          options: [
            { hi: '1/12', en: '1/12' },
            { hi: '4/3', en: '4/3' },
            { hi: '1/2', en: '1/2' },
            { hi: '1/4', en: '1/4' }
          ],
          answer: 3,
          hint: { hi: 'किसी संख्या से भाग देना उसके व्युत्क्रम से गुणा करने जैसा है।', en: 'Dividing by 3 is the same as multiplying by 1/3.' },
          explain: { hi: '3/4 × 1/3 = 3/12 होता है। 3/12 को सरल करने पर 1/4 मिलता है।', en: 'Three-fourths times 1/3 is 3/12. Simplifying 3/12 gives 1/4.' }
        }
      ]
    },
    'maths-3': {
      subject: 'maths',
      title: { hi: 'एक चर वाले सरल समीकरण', en: 'Simple Equations in One Unknown' },
      questions: [
        {
          text: { hi: 'यदि x + 5 = 12 है, तो x का मान क्या है?', en: 'If x + 5 = 12, what is x?' },
          options: [
            { hi: '7', en: '7' },
            { hi: '17', en: '17' },
            { hi: '5', en: '5' },
            { hi: '12', en: '12' }
          ],
          answer: 0,
          hint: { hi: 'दोनों पक्षों से 5 घटाएँ।', en: 'Subtract 5 from both sides.' },
          explain: { hi: '12 - 5 = 7 है, इसलिए x = 7 होगा। समीकरण के दोनों पक्षों पर एक ही क्रिया करनी होती है।', en: 'Subtracting 5 from both sides leaves x = 7. Whatever you do to one side, do to the other.' }
        },
        {
          text: { hi: 'यदि 3y = 18 है, तो y का मान क्या है?', en: 'If 3y = 18, what is y?' },
          options: [
            { hi: '3', en: '3' },
            { hi: '6', en: '6' },
            { hi: '15', en: '15' },
            { hi: '54', en: '54' }
          ],
          answer: 1,
          hint: { hi: 'दोनों पक्षों को 3 से भाग दें।', en: 'Divide both sides by 3.' },
          explain: { hi: '18 ÷ 3 = 6 है, इसलिए y = 6 है। गुणा को उलटने के लिए भाग का प्रयोग होता है।', en: 'Dividing 18 by 3 gives y = 6. Division undoes multiplication.' }
        },
        {
          text: { hi: 'एक संख्या को 2 से गुणा करके उसमें 3 जोड़ा गया, तो परिणाम 11 आया। वह संख्या क्या है?', en: 'A number is multiplied by 2 and then 3 is added. The result is 11. What is the number?' },
          options: [
            { hi: '7', en: '7' },
            { hi: '3', en: '3' },
            { hi: '4', en: '4' },
            { hi: '8', en: '8' }
          ],
          answer: 2,
          hint: { hi: 'पहले 3 घटाएँ, फिर 2 से भाग दें।', en: 'First subtract 3 from 11, then divide by 2.' },
          explain: { hi: 'समीकरण 2n + 3 = 11 है। 11 - 3 = 8 और 8 ÷ 2 = 4, इसलिए संख्या 4 है।', en: 'The equation is 2n + 3 = 11. Then 11 - 3 = 8 and 8 ÷ 2 = 4, so the number is 4.' }
        }
      ]
    },
    'maths-4': {
      subject: 'maths',
      title: { hi: 'रेखाएँ, कोण और त्रिभुज', en: 'Lines, Angles and Triangles' },
      questions: [
        {
          text: { hi: 'एक त्रिभुज के दो कोण 50 डिग्री और 60 डिग्री हैं। तीसरा कोण कितने डिग्री का है?', en: 'Two angles of a triangle are 50 degrees and 60 degrees. What is the third angle?' },
          options: [
            { hi: '60 डिग्री', en: '60 degrees' },
            { hi: '70 डिग्री', en: '70 degrees' },
            { hi: '80 डिग्री', en: '80 degrees' },
            { hi: '90 डिग्री', en: '90 degrees' }
          ],
          answer: 1,
          hint: { hi: 'त्रिभुज के तीनों कोणों का योग कितना होता है, यह याद करें।', en: 'Recall the total of all three angles in a triangle.' },
          explain: { hi: 'त्रिभुज के तीनों कोणों का योग 180 डिग्री होता है। 180 - 50 - 60 = 70 डिग्री।', en: 'The three angles of a triangle add up to 180 degrees. 180 - 50 - 60 = 70 degrees.' }
        },
        {
          text: { hi: 'एक त्रिभुज के दो अंतःकोण 40 डिग्री और 70 डिग्री हैं। इनसे सम्मुख बाहरी कोण कितने डिग्री का होगा?', en: 'Two interior angles of a triangle are 40 degrees and 70 degrees. What is the exterior angle opposite the third vertex?' },
          options: [
            { hi: '110 डिग्री', en: '110 degrees' },
            { hi: '30 डिग्री', en: '30 degrees' },
            { hi: '70 डिग्री', en: '70 degrees' },
            { hi: '140 डिग्री', en: '140 degrees' }
          ],
          answer: 0,
          hint: { hi: 'बाहरी कोण उसके दो दूर वाले अंतःकोणों के योग के बराबर होता है।', en: 'An exterior angle equals the sum of the two far interior angles.' },
          explain: { hi: '40 + 70 = 110 डिग्री। बाहरी कोण का गुण यही है कि वह दूर के दोनों अंतःकोणों के योग के बराबर होता है।', en: 'The exterior angle is 40 + 70 = 110 degrees. It always equals the sum of the two non-adjacent interior angles.' }
        },
        {
          text: { hi: 'एक समद्विबाहु त्रिभुज के दो बराबर कोण 65 डिग्री-65 डिग्री हैं। तीसरा कोण कितने डिग्री का है?', en: 'An isosceles triangle has two equal angles of 65 degrees each. What is the third angle?' },
          options: [
            { hi: '40 डिग्री', en: '40 degrees' },
            { hi: '45 डिग्री', en: '45 degrees' },
            { hi: '50 डिग्री', en: '50 degrees' },
            { hi: '60 डिग्री', en: '60 degrees' }
          ],
          answer: 2,
          hint: { hi: 'दो कोणों का योग घटाकर 180 डिग्री से बाकी निकालें।', en: 'Add the two known angles, then subtract the total from 180.' },
          explain: { hi: '65 + 65 = 130 है। 180 - 130 = 50 डिग्री, यही तीसरा कोण है।', en: '65 + 65 = 130. Then 180 - 130 = 50 degrees for the third angle.' }
        }
      ]
    },
    'science-1': {
      subject: 'science',
      title: { hi: 'पोषण: पौधों और जंतुओं में', en: 'Nutrition in Plants and Animals' },
      questions: [
        {
          text: { hi: 'पौधे अपना भोजन किस प्रक्रिया से बनाते हैं?', en: 'Which process do green plants use to make their own food?' },
          options: [
            { hi: 'प्रकाश-संश्लेषण', en: 'Photosynthesis' },
            { hi: 'पाचन', en: 'Digestion' },
            { hi: 'श्वसन', en: 'Respiration' },
            { hi: 'उत्सर्जन', en: 'Excretion' }
          ],
          answer: 0,
          hint: { hi: 'इस प्रक्रिया में सूरज की रोशनी की जरूरत होती है।', en: 'This process needs sunlight.' },
          explain: { hi: 'हरे पौधे सूरज की रोशनी, पानी और कार्बन डाइऑक्साइड से भोजन बनाते हैं। इसे प्रकाश-संश्लेषण कहते हैं।', en: 'Green plants use sunlight, water and carbon dioxide to make food. This is called photosynthesis.' }
        },
        {
          text: { hi: 'प्रकाश-संश्लेषण के समय पत्तियाँ कौन-सी गैस लेती हैं?', en: 'Which gas do leaves take in during photosynthesis?' },
          options: [
            { hi: 'ऑक्सीजन', en: 'Oxygen' },
            { hi: 'कार्बन डाइऑक्साइड', en: 'Carbon dioxide' },
            { hi: 'हीलियम', en: 'Helium' },
            { hi: 'हाइड्रोजन', en: 'Hydrogen' }
          ],
          answer: 1,
          hint: { hi: 'यह गैस हम साँस के साथ बाहर छोड़ते हैं।', en: 'We breathe out this gas.' },
          explain: { hi: 'पत्तियाँ हवा से कार्बन डाइऑक्साइड लेती हैं और ऑक्सीजन बाहर छोड़ती हैं।', en: 'Leaves take in carbon dioxide from air and release oxygen.' }
        },
        {
          text: { hi: 'मनुष्य के शरीर में भोजन का पाचन किस अंग से शुरू होता है?', en: 'In the human body, where does digestion of food begin?' },
          options: [
            { hi: 'आमाशय', en: 'Stomach' },
            { hi: 'बड़ी आंत', en: 'Large intestine' },
            { hi: 'यकृत', en: 'Liver' },
            { hi: 'मुँह', en: 'Mouth' }
          ],
          answer: 3,
          hint: { hi: 'भोजन सबसे पहले इसी अंग में जाता है और चबाया जाता है।', en: 'Food first enters this part and gets chewed here.' },
          explain: { hi: 'मुँह में दाँत भोजन को चबाते हैं और लार उसमें मिलती है। यहीं से पाचन शुरू होता है।', en: 'Teeth chew food in the mouth and saliva mixes in. Digestion starts here.' }
        }
      ]
    },
    'science-2': {
      subject: 'science',
      title: { hi: 'ऊष्मा और तापमान', en: 'Heat and Temperature' },
      questions: [
        {
          text: { hi: 'धातु के चम्मच में ऊष्मा एक सिरे से दूसरे सिरे तक किस विधि से पहुँचती है?', en: 'How does heat travel along a metal spoon from one end to the other?' },
          options: [
            { hi: 'विकिरण', en: 'Radiation' },
            { hi: 'संवहन', en: 'Convection' },
            { hi: 'चालन', en: 'Conduction' },
            { hi: 'वाष्पन', en: 'Evaporation' }
          ],
          answer: 2,
          hint: { hi: 'ठोस पदार्थों में ऊष्मा आसपास के कणों से होकर चलती है।', en: 'In solids, heat passes from particle to particle.' },
          explain: { hi: 'ठोस में ऊष्मा कणों के आपस में टकराने से आगे बढ़ती है। इसे चालन कहते हैं।', en: 'In solids, heat moves when particles pass energy to their neighbours. This is conduction.' }
        },
        {
          text: { hi: 'द्रव और गैसों में ऊष्मा मुख्य रूप से किस विधि से चलती है?', en: 'Heat mainly moves through liquids and gases by which method?' },
          options: [
            { hi: 'संवहन', en: 'Convection' },
            { hi: 'चालन', en: 'Conduction' },
            { hi: 'रोधन', en: 'Insulation' },
            { hi: 'परावर्तन', en: 'Reflection' }
          ],
          answer: 0,
          hint: { hi: 'गर्म पानी ऊपर उठता है और ठंडा पानी नीचे आता है, इस पर ध्यान दें।', en: 'Think about hot water rising and cold water sinking in a pot.' },
          explain: { hi: 'गर्म द्रव या गैस हल्की होकर ऊपर जाती है और ठंडी उसकी जगह लेती है। इस गति को संवहन कहते हैं।', en: 'Warm liquid or gas becomes lighter and rises, while cooler material sinks in. This movement is convection.' }
        },
        {
          text: { hi: 'सूरज की ऊष्मा हम तक किस विधि से पहुँचती है, जबकि बीच में हवा के अलावा कुछ नहीं होता?', en: 'Heat from the Sun reaches us through empty space. Which method does this?' },
          options: [
            { hi: 'चालन', en: 'Conduction' },
            { hi: 'विकिरण', en: 'Radiation' },
            { hi: 'संवहन', en: 'Convection' },
            { hi: 'घर्षण', en: 'Friction' }
          ],
          answer: 1,
          hint: { hi: 'यह विधि किसी माध्यम के बिना भी काम करती है।', en: 'This method does not need any material to carry heat.' },
          explain: { hi: 'विकिरण में ऊष्मा तरंगों के रूप में चलती है और इसे माध्यम की जरूरत नहीं होती। सूरज की ऊष्मा इसी से आती है।', en: 'Radiation carries heat as waves and needs no material. Sunlight heat reaches Earth this way.' }
        }
      ]
    },
    'science-3': {
      subject: 'science',
      title: { hi: 'श्वसन और साँस लेना', en: 'Respiration and Breathing' },
      questions: [
        {
          text: { hi: 'साँस अंदर लेने पर शरीर में मुख्य रूप से कौन-सी गैस जाती है?', en: 'Which gas mainly goes into the body when we breathe in?' },
          options: [
            { hi: 'जल वाष्प', en: 'Water vapour' },
            { hi: 'कार्बन डाइऑक्साइड', en: 'Carbon dioxide' },
            { hi: 'ऑक्सीजन', en: 'Oxygen' },
            { hi: 'मीथेन', en: 'Methane' }
          ],
          answer: 2,
          hint: { hi: 'शरीर की कोशिकाओं को ऊर्जा बनाने के लिए इस गैस की जरूरत होती है।', en: 'Cells need this gas to release energy from food.' },
          explain: { hi: 'साँस में ली गई ऑक्सीजन खून के द्वारा कोशिकाओं तक जाती है और भोजन से ऊर्जा निकालने में मदद करती है।', en: 'Oxygen from breathing reaches cells through blood and helps release energy from food.' }
        },
        {
          text: { hi: 'हवा को शरीर के अंदर लेने और बाहर छोड़ने का काम कौन-सा अंग करता है?', en: 'Which organ takes air into the body and lets it out?' },
          options: [
            { hi: 'हृदय', en: 'Heart' },
            { hi: 'गुर्दे', en: 'Kidneys' },
            { hi: 'यकृत', en: 'Liver' },
            { hi: 'फेफड़े', en: 'Lungs' }
          ],
          answer: 3,
          hint: { hi: 'यह छाती के अंदर स्थित होते हैं और साँस से फूलते-सिकुड़ते हैं।', en: 'These sit inside the chest and expand and shrink as we breathe.' },
          explain: { hi: 'फेफड़े साँस के द्वारा हवा अंदर लेते हैं और कार्बन डाइऑक्साइड युक्त हवा बाहर छोड़ते हैं।', en: 'Lungs take in air when we breathe in and send out air with carbon dioxide when we breathe out.' }
        },
        {
          text: { hi: 'साँस छोड़ते समय हवा में कौन-सी गैस अधिक मात्रा में होती है और शरीर से बाहर जाती है?', en: 'Which gas is present in greater amount in the breath we breathe out?' },
          options: [
            { hi: 'कार्बन डाइऑक्साइड', en: 'Carbon dioxide' },
            { hi: 'ऑक्सीजन', en: 'Oxygen' },
            { hi: 'नाइट्रोजन', en: 'Nitrogen' },
            { hi: 'आर्गन', en: 'Argon' }
          ],
          answer: 0,
          hint: { hi: 'यह गैस कोशिकाओं में ऊर्जा बनने के बाद बचे अपशिष्ट के रूप में बनती है।', en: 'This gas is a waste product of releasing energy in cells.' },
          explain: { hi: 'कोशिकाएँ ऊर्जा बनाते समय कार्बन डाइऑक्साइड छोड़ती हैं। साँस छोड़ते समय यह गैस बाहर निकलती है।', en: 'Cells produce carbon dioxide while releasing energy. We breathe it out.' }
        }
      ]
    },
    'science-4': {
      subject: 'science',
      title: { hi: 'जल चक्र, मौसम, जलवायु और वन', en: 'Water Cycle, Weather, Climate and Forests' },
      questions: [
        {
          text: { hi: 'सूरज की गर्मी से पानी का भाप बनकर उड़ना किस नाम से जाना जाता है?', en: 'What is the name of the process when water turns into vapour because of the Sun\'s heat?' },
          options: [
            { hi: 'संघनन', en: 'Condensation' },
            { hi: 'वाष्पन', en: 'Evaporation' },
            { hi: 'वर्षण', en: 'Precipitation' },
            { hi: 'हिमीकरण', en: 'Freezing' }
          ],
          answer: 1,
          hint: { hi: 'तालाब का पानी धूप में धीरे-धीरे कम होता है, यह इसी प्रक्रिया से होता है।', en: 'Puddles dry up in sunlight because of this process.' },
          explain: { hi: 'गर्मी से पानी द्रव से भाप बनता है, इसे वाष्पन कहते हैं। यह जल चक्र का पहला मुख्य चरण है।', en: 'Heat changes liquid water into vapour. This is evaporation, the first main step of the water cycle.' }
        },
        {
          text: { hi: 'वन वर्षा के लिए कैसे सहायक होते हैं?', en: 'How do forests help in rainfall?' },
          options: [
            { hi: 'पत्तियों से जल वाष्प छोड़कर नमी बढ़ाते हैं', en: 'They release water vapour through leaves and add moisture to air' },
            { hi: 'वर्षा को पूरी तरह रोक देते हैं', en: 'They stop all rain completely' },
            { hi: 'हवा को सूखा बना देते हैं', en: 'They make the air dry' },
            { hi: 'हमेशा बाढ़ लाते हैं', en: 'They always cause floods' }
          ],
          answer: 0,
          hint: { hi: 'पौधे पत्तियों के रास्ते पानी छोड़ते हैं।', en: 'Plants let water out through their leaves.' },
          explain: { hi: 'पेड़ों की पत्तियाँ जल वाष्प छोड़ती हैं, जिससे हवा में नमी बढ़ती है और बादल बनने में मदद मिलती है।', en: 'Tree leaves release water vapour, which adds moisture to the air and helps clouds form.' }
        },
        {
          text: { hi: 'मौसम और जलवायु में क्या अंतर है?', en: 'What is the difference between weather and climate?' },
          options: [
            { hi: 'मौसम एक दिन का हाल है, जलवायु केवल आज के तापमान को बताती है', en: 'Weather is one day only, climate is only today\'s temperature' },
            { hi: 'जलवायु केवल एक महीने की बारिश है', en: 'Climate is only one month of rainfall' },
            { hi: 'मौसम कई वर्षों का औसत है', en: 'Weather is the average over many years' },
            { hi: 'जलवायु किसी एक दिन का हाल है', en: 'Climate is the condition of one particular day' }
          ],
          answer: 0,
          hint: { hi: 'मौसम कम समय का होता है, जबकि जलवायु लंबे समय का औसत है।', en: 'Weather changes quickly, while climate is a long-term average.' },
          explain: { hi: 'मौसम किसी स्थान का थोड़े समय का हाल है। जलवायु कई वर्षों के औसत मौसम का वर्णन है।', en: 'Weather is the short-term condition of the air in a place. Climate is the average weather pattern over many years.' }
        }
      ]
    }
  }
};
