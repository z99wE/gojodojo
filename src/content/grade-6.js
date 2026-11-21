export default {
  grade: 6,
  topics: {
    'maths-1': {
      subject: 'maths',
      title: { hi: 'संख्याओं को जानना', en: 'Knowing our numbers' },
      questions: [
        {
          text: {
            hi: 'भारतीय संख्या पद्धति में 1 लाख कितने के बराबर है?',
            en: 'In the Indian system, how much is 1 lakh?'
          },
          options: [
            { hi: '10,000', en: '10,000' },
            { hi: '1,00,000', en: '1,00,000' },
            { hi: '1,000', en: '1,000' },
            { hi: '10,00,000', en: '10,00,000' }
          ],
          answer: 1,
          hint: {
            hi: 'दस हज़ार को दस बार लेने पर क्या आता है, सोचिए।',
            en: 'Think about how many ten thousands make one lakh.'
          },
          explain: {
            hi: 'एक लाख में सौ हज़ार होते हैं, यानी 1,00,000 लिखा जाता है।',
            en: 'One lakh is written as 1,00,000 in the Indian system. It has one hundred thousand.'
          }
        },
        {
          text: {
            hi: 'संख्या 47,820 में अंक 7 का स्थानीय मान क्या है?',
            en: 'In the number 47,820, what is the place value of the digit 7?'
          },
          options: [
            { hi: '700', en: '700' },
            { hi: '70', en: '70' },
            { hi: '70,000', en: '70,000' },
            { hi: '7,000', en: '7,000' }
          ],
          answer: 3,
          hint: {
            hi: 'गिनिए कि 7 किस स्थान पर लिखा है: इकाई, दहाई, सैकड़ा या हज़ार।',
            en: 'Count the position of 7 from the right: ones, tens, hundreds, thousands.'
          },
          explain: {
            hi: 'अंक 7 हज़ार के स्थान पर है, इसलिए उसका स्थानीय मान 7,000 है।',
            en: 'The digit 7 is in the thousands place, so its place value is 7,000.'
          }
        },
        {
          text: {
            hi: 'कितने दस हज़ार मिलकर एक लाख बनते हैं?',
            en: 'How many ten thousands make one lakh?'
          },
          options: [
            { hi: '100', en: '100' },
            { hi: '5', en: '5' },
            { hi: '10', en: '10' },
            { hi: '1,000', en: '1,000' }
          ],
          answer: 2,
          hint: {
            hi: 'एक लाख को दस हज़ार के समूहों में बाँटकर देखिए।',
            en: 'Split one lakh into equal groups of ten thousand.'
          },
          explain: {
            hi: 'दस दस हज़ार मिलकर एक लाख बनते हैं, यानी 10 गुना 10,000 = 1,00,000।',
            en: 'Ten groups of ten thousand make one lakh, because 10 x 10,000 = 1,00,000.'
          }
        }
      ]
    },
    'maths-2': {
      subject: 'maths',
      title: { hi: 'पूर्ण संख्याएँ और संख्या रेखा', en: 'Whole numbers and the number line' },
      questions: [
        {
          text: {
            hi: 'सबसे छोटी पूर्ण संख्या कौन-सी है?',
            en: 'Which is the smallest whole number?'
          },
          options: [
            { hi: '1', en: '1' },
            { hi: '0', en: '0' },
            { hi: '-1', en: '-1' },
            { hi: '10', en: '10' }
          ],
          answer: 1,
          hint: {
            hi: 'पूर्ण संख्याएँ 0 से शुरू होती हैं।',
            en: 'Whole numbers start from zero.'
          },
          explain: {
            hi: 'पूर्ण संख्याएँ 0, 1, 2, 3 और आगे तक जाती हैं, इसलिए सबसे छोटी 0 है।',
            en: 'Whole numbers are 0, 1, 2, 3 and so on, so the smallest is 0.'
          }
        },
        {
          text: {
            hi: 'इन संख्याओं में सबसे छोटा पूर्णांक कौन-सा है?',
            en: 'Which of these integers is the smallest?'
          },
          options: [
            { hi: '0', en: '0' },
            { hi: '4', en: '4' },
            { hi: '-7', en: '-7' },
            { hi: '2', en: '2' }
          ],
          answer: 2,
          hint: {
            hi: 'संख्या रेखा पर जो संख्या 0 से सबसे दूर बाईं ओर हो, वह सबसे छोटी होती है।',
            en: 'On the number line, the number farthest to the left is the smallest.'
          },
          explain: {
            hi: 'ऋणात्मक संख्याएँ 0 से छोटी होती हैं, और -7 सबसे बाईं ओर है।',
            en: 'Negative integers are smaller than zero, and -7 is the farthest left here.'
          }
        },
        {
          text: {
            hi: 'इनमें से कौन-सी ऋणात्मक पूर्णांक संख्या है?',
            en: 'Which of these is a negative integer?'
          },
          options: [
            { hi: '-4', en: '-4' },
            { hi: '6', en: '6' },
            { hi: '1', en: '1' },
            { hi: '9', en: '9' }
          ],
          answer: 0,
          hint: {
            hi: 'जिस संख्या से पहले माइनस का चिह्न हो, वह ऋणात्मक होती है।',
            en: 'A negative integer has a minus sign in front of it.'
          },
          explain: {
            hi: 'माइनस चिह्न वाली संख्या 0 से नीचे की ओर होती है, जैसे -4।',
            en: 'A number with a minus sign lies below zero on the number line, like -4.'
          }
        }
      ]
    },
    'maths-3': {
      subject: 'maths',
      title: { hi: 'मूल ज्यामिति: रेखाएँ, कोण और त्रिभुज', en: 'Basic geometry: lines, angles and triangles' },
      questions: [
        {
          text: {
            hi: 'रेखाखंड (line segment) के कितने अंत बिंदु होते हैं?',
            en: 'How many end points does a line segment have?'
          },
          options: [
            { hi: '0', en: '0' },
            { hi: '1', en: '1' },
            { hi: '2', en: '2' },
            { hi: 'असीमित', en: 'Unlimited' }
          ],
          answer: 2,
          hint: {
            hi: 'रेखाखंड की दोनों ओर सिरे देखिए।',
            en: 'Look at both ends of a line segment.'
          },
          explain: {
            hi: 'रेखाखंड की दो सीमाएँ होती हैं, इसलिए उसके दो अंत बिंदु होते हैं।',
            en: 'A line segment has a fixed length, so it has two end points. A line goes on forever in both directions.'
          }
        },
        {
          text: {
            hi: 'समकोण (right angle) का माप कितना होता है?',
            en: 'What is the measure of a right angle?'
          },
          options: [
            { hi: '45 डिग्री', en: '45 degrees' },
            { hi: '90 डिग्री', en: '90 degrees' },
            { hi: '180 डिग्री', en: '180 degrees' },
            { hi: '360 डिग्री', en: '360 degrees' }
          ],
          answer: 1,
          hint: {
            hi: 'किताब का कोना एक समकोण बनाता है।',
            en: 'The corner of a book makes a right angle.'
          },
          explain: {
            hi: 'समकोण का माप 90 डिग्री होता है, जो सीधी रेखा के आधे के बराबर है।',
            en: 'A right angle measures 90 degrees, which is half of a straight angle.'
          }
        },
        {
          text: {
            hi: 'जिस त्रिभुज की तीनों भुजाएँ बराबर हों, उसे क्या कहते हैं?',
            en: 'What do we call a triangle whose three sides are all equal?'
          },
          options: [
            { hi: 'समबाहु त्रिभुज', en: 'Equilateral triangle' },
            { hi: 'विषमबाहु त्रिभुज', en: 'Scalene triangle' },
            { hi: 'समद्विबाहु त्रिभुज', en: 'Isosceles triangle' },
            { hi: 'समकोण त्रिभुज', en: 'Right-angled triangle' }
          ],
          answer: 0,
          hint: {
            hi: 'यहाँ नाम में समान भुजाओं का संकेत है।',
            en: 'The name starts with a word meaning equal sides.'
          },
          explain: {
            hi: 'तीनों भुजाएँ बराबर हों तो वह समबाहु त्रिभुज होता है।',
            en: 'When all three sides are equal, the triangle is called equilateral.'
          }
        }
      ]
    },
    'maths-4': {
      subject: 'maths',
      title: { hi: 'भिन्न और दशमलव: तुलना और सरल क्रियाएँ', en: 'Fractions and decimals: comparing and simple operations' },
      questions: [
        {
          text: {
            hi: 'इनमें से कौन-सी भिन्न बड़ी है: 1/2 या 3/4?',
            en: 'Which is bigger: 1/2 or 3/4?'
          },
          options: [
            { hi: '1/2', en: '1/2' },
            { hi: '3/4', en: '3/4' },
            { hi: 'दोनों बराबर हैं', en: 'They are equal' },
            { hi: 'बताया नहीं जा सकता', en: 'Cannot say' }
          ],
          answer: 1,
          hint: {
            hi: 'दोनों को एक ही हर (4) वाली भिन्न में बदलकर देखिए।',
            en: 'Write 1/2 as a fraction with denominator 4.'
          },
          explain: {
            hi: '1/2 बराबर 2/4 है, और 3/4 उससे बड़ा है।',
            en: '1/2 equals 2/4, and 3/4 is bigger than 2/4.'
          }
        },
        {
          text: {
            hi: '1/2 + 1/4 का योग क्या होगा?',
            en: 'What is 1/2 + 1/4?'
          },
          options: [
            { hi: '1/3', en: '1/3' },
            { hi: '2/4', en: '2/4' },
            { hi: '3/4', en: '3/4' },
            { hi: '1/6', en: '1/6' }
          ],
          answer: 2,
          hint: {
            hi: 'पहले 1/2 को चौथाइयों में बदलिए।',
            en: 'First write 1/2 with denominator 4.'
          },
          explain: {
            hi: '1/2 बराबर 2/4 है, और 2/4 + 1/4 = 3/4 होता है।',
            en: '1/2 equals 2/4, so 2/4 + 1/4 = 3/4.'
          }
        },
        {
          text: {
            hi: 'दशमलव 0.5 को भिन्न के रूप में कैसे लिखेंगे?',
            en: 'How do you write the decimal 0.5 as a fraction?'
          },
          options: [
            { hi: '1/5', en: '1/5' },
            { hi: '5/100', en: '5/100' },
            { hi: '2/5', en: '2/5' },
            { hi: '1/2', en: '1/2' }
          ],
          answer: 3,
          hint: {
            hi: '0.5 में 5 दसवें भाग को दर्शाता है।',
            en: 'In 0.5, the digit 5 is in the tenths place.'
          },
          explain: {
            hi: '0.5 का अर्थ 5/10 है, जिसे सरल करने पर 1/2 मिलता है।',
            en: '0.5 means 5/10, which simplifies to 1/2.'
          }
        }
      ]
    },
    'science-1': {
      subject: 'science',
      title: { hi: 'भोजन के स्रोत: पौधे और जानवर', en: 'Food sources: plants and animals' },
      questions: [
        {
          text: {
            hi: 'गाजर का कौन-सा भाग हम खाते हैं?',
            en: 'Which part of the carrot plant do we eat?'
          },
          options: [
            { hi: 'पत्ती', en: 'Leaf' },
            { hi: 'जड़', en: 'Root' },
            { hi: 'फूल', en: 'Flower' },
            { hi: 'फल', en: 'Fruit' }
          ],
          answer: 1,
          hint: {
            hi: 'गाजर ज़मीन के नीचे उगती है।',
            en: 'The carrot grows under the soil.'
          },
          explain: {
            hi: 'गाजर पौधे की जड़ है, जिसमें भोजन जमा रहता है।',
            en: 'Carrot is a root, where the plant stores food.'
          }
        },
        {
          text: {
            hi: 'इनमें से कौन-सा भोजन जानवर से मिलता है?',
            en: 'Which of these foods comes from an animal?'
          },
          options: [
            { hi: 'गेहूँ', en: 'Wheat' },
            { hi: 'आम', en: 'Mango' },
            { hi: 'अंडा', en: 'Egg' },
            { hi: 'चावल', en: 'Rice' }
          ],
          answer: 2,
          hint: {
            hi: 'मुर्गी से मिलने वाली चीज़ सोचिए।',
            en: 'Think of a food that a hen gives us.'
          },
          explain: {
            hi: 'अंडा, दूध और मांस जानवरों से मिलने वाले भोजन के उदाहरण हैं।',
            en: 'Egg, milk and meat are examples of food from animals.'
          }
        },
        {
          text: {
            hi: 'फूलगोभी में हम पौधे का कौन-सा भाग खाते हैं?',
            en: 'In cauliflower, which part of the plant do we eat?'
          },
          options: [
            { hi: 'बीज', en: 'Seed' },
            { hi: 'जड़', en: 'Root' },
            { hi: 'पत्ती', en: 'Leaf' },
            { hi: 'फूल', en: 'Flower' }
          ],
          answer: 3,
          hint: {
            hi: 'फूलगोभी का नाम ही इसका संकेत देता है।',
            en: 'The name of the vegetable gives a clue.'
          },
          explain: {
            hi: 'फूलगोभी में खाने वाला भाग पौधे का फूल ही है।',
            en: 'The part we eat in cauliflower is the flower of the plant.'
          }
        }
      ]
    },
    'science-2': {
      subject: 'science',
      title: { hi: 'पदार्थों को अलग करना', en: 'Separation of substances' },
      questions: [
        {
          text: {
            hi: 'छलनी (sieve) से किन दो चीज़ों को अलग किया जा सकता है?',
            en: 'A sieve can separate which two things?'
          },
          options: [
            { hi: 'गेहूँ और पत्थर के कण', en: 'Wheat grains and stones' },
            { hi: 'नमक और पानी', en: 'Salt and water' },
            { hi: 'चीनी और पानी', en: 'Sugar and water' },
            { hi: 'तेल और पानी', en: 'Oil and water' }
          ],
          answer: 0,
          hint: {
            hi: 'छलनी में बड़े कण रुक जाते हैं और छोटे कण निकल जाते हैं।',
            en: 'A sieve holds back big pieces and lets small ones pass.'
          },
          explain: {
            hi: 'छलनी से बड़े और छोटे आकार के ठोस कणों को अलग किया जाता है।',
            en: 'Sieving separates solid particles of different sizes.'
          }
        },
        {
          text: {
            hi: 'मिट्टी वाले पानी को स्थिर रखने पर मिट्टी नीचे बैठ जाती है। इस विधि को क्या कहते हैं?',
            en: 'When muddy water is kept still, the mud settles at the bottom. What is this method called?'
          },
          options: [
            { hi: 'निस्पंदन (filtration)', en: 'Filtration' },
            { hi: 'वाष्पीकरण (evaporation)', en: 'Evaporation' },
            { hi: 'अवसादन (sedimentation)', en: 'Sedimentation' },
            { hi: 'छानना (sieving)', en: 'Sieving' }
          ],
          answer: 2,
          hint: {
            hi: 'भारी कण पानी के तल में जाकर बैठ जाते हैं।',
            en: 'Heavier particles sink and settle at the bottom.'
          },
          explain: {
            hi: 'भारी कण धीरे-धीरे नीचे बैठ जाते हैं, इसे अवसादन कहते हैं।',
            en: 'Heavy particles slowly settle down, and this process is called sedimentation.'
          }
        },
        {
          text: {
            hi: 'नमक वाले पानी से शुद्ध नमक कैसे प्राप्त किया जाता है?',
            en: 'How do we get pure salt from salt water?'
          },
          options: [
            { hi: 'छलनी से छानकर', en: 'By sieving' },
            { hi: 'वाष्पीकरण से', en: 'By evaporation' },
            { hi: 'अवसादन से', en: 'By sedimentation' },
            { hi: 'हाथ से चुनकर', en: 'By picking with hands' }
          ],
          answer: 1,
          hint: {
            hi: 'धूप में रखा पानी धीरे-धीरे भाप बनकर उड़ जाता है।',
            en: 'Water left in the sun slowly turns into vapour and goes away.'
          },
          explain: {
            hi: 'पानी भाप बनकर उड़ जाता है और नमक पीछे बचा रहता है।',
            en: 'The water evaporates and the salt is left behind as crystals.'
          }
        }
      ]
    },
    'science-3': {
      subject: 'science',
      title: { hi: 'सजीव जीव: विशेषताएँ और कोशिका का विचार', en: 'Living organisms: characteristics and the cell' },
      questions: [
        {
          text: {
            hi: 'जीवन की मूल इकाई (basic unit) कौन-सी है?',
            en: 'What is the basic unit of life?'
          },
          options: [
            { hi: 'परमाणु', en: 'Atom' },
            { hi: 'कोशिका', en: 'Cell' },
            { hi: 'अंग', en: 'Organ' },
            { hi: 'ऊतक', en: 'Tissue' }
          ],
          answer: 1,
          hint: {
            hi: 'सभी सजीवों का शरीर इसी छोटी इकाई से बनता है।',
            en: 'The body of every living thing is made of this small unit.'
          },
          explain: {
            hi: 'कोशिका जीवन की सबसे छोटी इकाई है जो स्वतंत्र रूप से जीवित रह सकती है।',
            en: 'The cell is the smallest unit of life, and some living things are a single cell.'
          }
        },
        {
          text: {
            hi: 'इनमें से कौन-सी सजीवों की विशेषता नहीं है?',
            en: 'Which of these is NOT a feature of living things?'
          },
          options: [
            { hi: 'वे बढ़ते हैं', en: 'They grow' },
            { hi: 'वे आसपास के बदलाव पर प्रतिक्रिया देते हैं', en: 'They respond to changes around them' },
            { hi: 'वे हमेशा एक जैसे रहते हैं', en: 'They stay the same forever' },
            { hi: 'वे अपने जैसे नए जीव बनाते हैं', en: 'They reproduce' }
          ],
          answer: 2,
          hint: {
            hi: 'सजीव समय के साथ बदलते और बढ़ते हैं।',
            en: 'Living things change and grow over time.'
          },
          explain: {
            hi: 'सजीव बढ़ते हैं, प्रतिक्रिया देते हैं और प्रजनन करते हैं, पर वे स्थिर नहीं रहते।',
            en: 'Living things grow, respond and reproduce, so they do not stay the same forever.'
          }
        },
        {
          text: {
            hi: 'इनमें से कौन-सी चीज़ निर्जीव है?',
            en: 'Which of these is non-living?'
          },
          options: [
            { hi: 'पत्थर', en: 'Stone' },
            { hi: 'पेड़', en: 'Tree' },
            { hi: 'गाय', en: 'Cow' },
            { hi: 'मछली', en: 'Fish' }
          ],
          answer: 0,
          hint: {
            hi: 'जिसमें साँस लेना, बढ़ना या प्रजनन न हो, वह निर्जीव होता है।',
            en: 'Something that does not breathe, grow or reproduce is non-living.'
          },
          explain: {
            hi: 'पत्थर न बढ़ता है, न साँस लेता है और न ही प्रजनन करता है, इसलिए वह निर्जीव है।',
            en: 'A stone does not grow, breathe or reproduce, so it is non-living.'
          }
        }
      ]
    },
    'science-4': {
      subject: 'science',
      title: { hi: 'गति और माप: दूरी, समय और चाल', en: 'Motion and measurement: distance, time and speed' },
      questions: [
        {
          text: {
            hi: 'एक बस 2 घंटे में 60 किलोमीटर चलती है। उसकी चाल कितनी है?',
            en: 'A bus travels 60 km in 2 hours. What is its speed?'
          },
          options: [
            { hi: '120 किमी/घंटा', en: '120 km/h' },
            { hi: '30 किमी/घंटा', en: '30 km/h' },
            { hi: '62 किमी/घंटा', en: '62 km/h' },
            { hi: '2 किमी/घंटा', en: '2 km/h' }
          ],
          answer: 1,
          hint: {
            hi: 'चाल निकालने के लिए दूरी को समय से भाग दीजिए।',
            en: 'Speed is found by dividing distance by time.'
          },
          explain: {
            hi: 'चाल = दूरी / समय, यानी 60 / 2 = 30 किमी/घंटा।',
            en: 'Speed = distance / time, so 60 / 2 = 30 km/h.'
          }
        },
        {
          text: {
            hi: 'दूरी मापने की SI इकाई कौन-सी है?',
            en: 'What is the SI unit of distance?'
          },
          options: [
            { hi: 'किलोग्राम', en: 'Kilogram' },
            { hi: 'लीटर', en: 'Litre' },
            { hi: 'मीटर', en: 'Metre' },
            { hi: 'सेकंड', en: 'Second' }
          ],
          answer: 2,
          hint: {
            hi: 'लंबाई और दूरी इसी इकाई में मापी जाती है।',
            en: 'Length and distance are measured in this unit.'
          },
          explain: {
            hi: 'दूरी की SI इकाई मीटर है, और सेकंड समय की इकाई है।',
            en: 'The SI unit of distance is the metre, while the second is a unit of time.'
          }
        },
        {
          text: {
            hi: 'इनमें से कौन-सी समय की इकाई है?',
            en: 'Which of these is a unit of time?'
          },
          options: [
            { hi: 'किलोमीटर', en: 'Kilometre' },
            { hi: 'सेकंड', en: 'Second' },
            { hi: 'ग्राम', en: 'Gram' },
            { hi: 'मीटर', en: 'Metre' }
          ],
          answer: 1,
          hint: {
            hi: 'घड़ी की सुई जिस इकाई में चलती है, वही समय है।',
            en: 'Think of the unit a clock uses to count the smallest steps of time.'
          },
          explain: {
            hi: 'सेकंड, मिनट और घंटा समय की इकाइयाँ हैं, जबकि किलोमीटर और मीटर दूरी की।',
            en: 'Second, minute and hour measure time, while kilometre and metre measure distance.'
          }
        }
      ]
    }
  }
};
