export default {
  grade: 8,
  topics: {
    'maths-1': {
      subject: 'maths',
      title: { hi: 'अनुपात और प्रतिशत', en: 'Ratio and Percentage' },
      questions: [
        {
          text: {
            hi: '4 पेन की कीमत 60 रुपये है। उसी भाव पर 7 पेन की कीमत कितनी होगी?',
            en: 'Four pens cost 60 rupees. At the same price, how much do 7 pens cost?'
          },
          options: [
            { hi: '90 रुपये', en: '90 rupees' },
            { hi: '105 रुपये', en: '105 rupees' },
            { hi: '100 रुपये', en: '100 rupees' },
            { hi: '120 रुपये', en: '120 rupees' }
          ],
          answer: 1,
          hint: { hi: 'पहले एक पेन की कीमत निकालें।', en: 'First find the price of one pen.' },
          explain: {
            hi: 'एक पेन की कीमत 60 भाग 4, यानी 15 रुपये है। 7 पेन की कीमत 7 गुणा 15, यानी 105 रुपये होगी। यह सीधा अनुपात है।',
            en: 'One pen costs 60 divided by 4, which is 15 rupees. So 7 pens cost 7 times 15, which is 105 rupees. This is direct proportion.'
          }
        },
        {
          text: {
            hi: 'छह मज़दूर एक दीवार 10 दिन में बनाते हैं। उतनी ही गति से काम करते हुए 15 मज़दूर उसे कितने दिन में बनाएँगे?',
            en: 'Six workers build a wall in 10 days. Working at the same speed, how many days will 15 workers take?'
          },
          options: [
            { hi: '4 दिन', en: '4 days' },
            { hi: '6 दिन', en: '6 days' },
            { hi: '15 दिन', en: '15 days' },
            { hi: '25 दिन', en: '25 days' }
          ],
          answer: 0,
          hint: { hi: 'मज़दूर बढ़ेंगे तो दिन घटेंगे।', en: 'More workers means fewer days.' },
          explain: {
            hi: 'यह व्युत्क्रम अनुपात है। कुल काम 6 गुणा 10, यानी 60 मज़दूर-दिन है। 60 को 15 से भाग दें तो 4 दिन आते हैं।',
            en: 'This is inverse proportion. Total work is 6 times 10, which is 60 worker-days. Dividing 60 by 15 gives 4 days.'
          }
        },
        {
          text: {
            hi: 'एक कक्षा में 40 बच्चे हैं और उनमें से 20 प्रतिशत बच्चे खेल में भाग लेते हैं। कितने बच्चे भाग लेते हैं?',
            en: 'A class has 40 students and 20 percent of them take part in a game. How many students take part?'
          },
          options: [
            { hi: '12 बच्चे', en: '12 students' },
            { hi: '4 बच्चे', en: '4 students' },
            { hi: '8 बच्चे', en: '8 students' },
            { hi: '20 बच्चे', en: '20 students' }
          ],
          answer: 2,
          hint: { hi: 'प्रतिशत का मतलब है सौ में से कितने।', en: 'Percent means out of every hundred.' },
          explain: {
            hi: '20 प्रतिशत का मतलब 20 बटा 100 है। 40 का 20 प्रतिशत, यानी 40 गुणा 20 भाग 100, 8 बच्चे होता है।',
            en: 'Twenty percent means 20 out of 100. So 20 percent of 40 is 40 times 20 divided by 100, which is 8 students.'
          }
        }
      ]
    },
    'maths-2': {
      subject: 'maths',
      title: { hi: 'बीजगणितीय व्यंजक', en: 'Algebraic Expressions' },
      questions: [
        {
          text: {
            hi: 'यदि x = 5 है, तो 3x + 4 का मान क्या होगा?',
            en: 'If x = 5, what is the value of 3x + 4?'
          },
          options: [
            { hi: '17', en: '17' },
            { hi: '19', en: '19' },
            { hi: '23', en: '23' },
            { hi: '34', en: '34' }
          ],
          answer: 1,
          hint: { hi: 'x की जगह 5 रखकर पहले गुणा करें।', en: 'Put 5 in place of x and multiply first.' },
          explain: {
            hi: 'x की जगह 5 रखें तो 3 गुणा 5 = 15 होता है। फिर 15 में 4 जोड़ने पर 19 मिलता है।',
            en: '3 times 5 is 15. Then adding 4 gives 19.'
          }
        },
        {
          text: {
            hi: '(x + 3) का वर्ग खोलने पर क्या आता है?',
            en: 'What do we get when we expand the square of (x + 3)?'
          },
          options: [
            { hi: 'x^2 + 9', en: 'x^2 + 9' },
            { hi: 'x^2 + 3x + 9', en: 'x^2 + 3x + 9' },
            { hi: '2x^2 + 6', en: '2x^2 + 6' },
            { hi: 'x^2 + 6x + 9', en: 'x^2 + 6x + 9' }
          ],
          answer: 3,
          hint: { hi: 'योग के वर्ग में पहले का वर्ग, दोगुना गुणनफल और दूसरे का वर्ग आता है।', en: 'For a sum squared, take the first square, twice the product and the last square.' },
          explain: {
            hi: '(x + 3) का वर्ग = x^2 + 2 गुणा x गुणा 3 + 3^2 = x^2 + 6x + 9।',
            en: 'The square of a sum is first square plus twice the product plus last square, so it is x^2 + 6x + 9.'
          }
        },
        {
          text: {
            hi: 'x^2 - 9 का गुणनखंड क्या है?',
            en: 'Factorise x^2 - 9.'
          },
          options: [
            { hi: '(x - 3)(x - 3)', en: '(x - 3)(x - 3)' },
            { hi: '(x + 3)(x + 3)', en: '(x + 3)(x + 3)' },
            { hi: '(x - 3)(x + 3)', en: '(x - 3)(x + 3)' },
            { hi: '(x - 9)(x + 1)', en: '(x - 9)(x + 1)' }
          ],
          answer: 2,
          hint: { hi: 'यह दो वर्गों का अंतर है।', en: 'This is a difference of two squares.' },
          explain: {
            hi: 'a^2 - b^2 = (a - b)(a + b) होता है। यहाँ a की जगह x और b की जगह 3 है।',
            en: 'a squared minus b squared equals (a minus b) times (a plus b). Here a is x and b is 3.'
          }
        }
      ]
    },
    'maths-3': {
      subject: 'maths',
      title: { hi: 'मापन: घन, घनाभ और बेलन', en: 'Mensuration: Cube, Cuboid and Cylinder' },
      questions: [
        {
          text: {
            hi: '4 सेमी भुजा वाले घन का कुल पृष्ठीय क्षेत्रफल कितना है?',
            en: 'What is the total surface area of a cube with side 4 cm?'
          },
          options: [
            { hi: '16 वर्ग सेमी', en: '16 square cm' },
            { hi: '64 वर्ग सेमी', en: '64 square cm' },
            { hi: '96 वर्ग सेमी', en: '96 square cm' },
            { hi: '48 वर्ग सेमी', en: '48 square cm' }
          ],
          answer: 2,
          hint: { hi: 'घन की छह फलकें होती हैं और हर फलक एक वर्ग है।', en: 'A cube has 6 faces, and each face is a square.' },
          explain: {
            hi: 'एक फलक का क्षेत्रफल 4 गुणा 4, यानी 16 है। छह फलकों का क्षेत्रफल 6 गुणा 16, यानी 96 वर्ग सेमी है।',
            en: 'One face is 4 times 4, which is 16. Six faces give 6 times 16, which is 96 square cm.'
          }
        },
        {
          text: {
            hi: '5 सेमी लंबे, 3 सेमी चौड़े और 2 सेमी ऊँचे घनाभ का आयतन कितना है?',
            en: 'What is the volume of a cuboid that is 5 cm long, 3 cm wide and 2 cm high?'
          },
          options: [
            { hi: '30 घन सेमी', en: '30 cubic cm' },
            { hi: '10 घन सेमी', en: '10 cubic cm' },
            { hi: '31 घन सेमी', en: '31 cubic cm' },
            { hi: '15 घन सेमी', en: '15 cubic cm' }
          ],
          answer: 0,
          hint: { hi: 'आयतन = लंबाई गुणा चौड़ाई गुणा ऊँचाई।', en: 'Volume equals length times width times height.' },
          explain: {
            hi: '5 गुणा 3 गुणा 2 = 30 घन सेमी।',
            en: '5 times 3 times 2 equals 30 cubic cm.'
          }
        },
        {
          text: {
            hi: 'त्रिज्या 7 सेमी और ऊँचाई 10 सेमी वाले बेलन का आयतन कितना है? पाई का मान 22 बटा 7 लें।',
            en: 'What is the volume of a cylinder with radius 7 cm and height 10 cm? Take pi as 22 by 7.'
          },
          options: [
            { hi: '220 घन सेमी', en: '220 cubic cm' },
            { hi: '770 घन सेमी', en: '770 cubic cm' },
            { hi: '440 घन सेमी', en: '440 cubic cm' },
            { hi: '1540 घन सेमी', en: '1540 cubic cm' }
          ],
          answer: 3,
          hint: { hi: 'बेलन का आयतन = पाई गुणा त्रिज्या का वर्ग गुणा ऊँचाई।', en: 'Cylinder volume is pi times radius squared times height.' },
          explain: {
            hi: 'पाई गुणा 7 का वर्ग गुणा 10 = 22 बटा 7 गुणा 49 गुणा 10 = 1540 घन सेमी।',
            en: 'Pi times 7 squared times 10 is 22 by 7 times 49 times 10, which equals 1540 cubic cm.'
          }
        }
      ]
    },
    'maths-4': {
      subject: 'maths',
      title: { hi: 'एक चर वाले रैखिक समीकरण', en: 'Linear Equations in One Variable' },
      questions: [
        {
          text: {
            hi: '2x + 5 = 17 में x का मान क्या है?',
            en: 'In 2x + 5 = 17, what is the value of x?'
          },
          options: [
            { hi: '4', en: '4' },
            { hi: '6', en: '6' },
            { hi: '8', en: '8' },
            { hi: '11', en: '11' }
          ],
          answer: 1,
          hint: { hi: 'पहले दोनों तरफ से 5 घटाएँ।', en: 'First subtract 5 from both sides.' },
          explain: {
            hi: '2x = 17 में से 5 घटाने पर 12 बचता है, इसलिए x = 6 है।',
            en: 'After subtracting 5 from both sides, 2x equals 12, so x equals 6.'
          }
        },
        {
          text: {
            hi: 'एक संख्या में 7 जोड़ने पर 20 मिलता है। वह संख्या क्या है?',
            en: 'When 7 is added to a number, the result is 20. What is the number?'
          },
          options: [
            { hi: '11', en: '11' },
            { hi: '27', en: '27' },
            { hi: '13', en: '13' },
            { hi: '14', en: '14' }
          ],
          answer: 2,
          hint: { hi: 'उल्टा सोचें: 20 में से 7 घटाएँ।', en: 'Work backwards: subtract 7 from 20.' },
          explain: {
            hi: 'मान लें संख्या x है। तब x + 7 = 20, इसलिए x = 13 है।',
            en: 'Let the number be x. Then x + 7 = 20, so x = 13.'
          }
        },
        {
          text: {
            hi: 'राम की उम्र x वर्ष है। उसकी बहन की उम्र राम से 4 वर्ष कम है। दोनों की कुल उम्र 26 वर्ष है। राम की उम्र कितनी है?',
            en: 'Ram is x years old. His sister is 4 years younger. Their total age is 26 years. How old is Ram?'
          },
          options: [
            { hi: '22 वर्ष', en: '22 years' },
            { hi: '13 वर्ष', en: '13 years' },
            { hi: '11 वर्ष', en: '11 years' },
            { hi: '15 वर्ष', en: '15 years' }
          ],
          answer: 3,
          hint: { hi: 'बहन की उम्र को x - 4 लिखें।', en: 'Write the sister age as x minus 4.' },
          explain: {
            hi: 'x + (x - 4) = 26, यानी 2x = 30, इसलिए x = 15 है।',
            en: 'x plus (x minus 4) equals 26, so 2x equals 30 and x equals 15.'
          }
        }
      ]
    },
    'science-1': {
      subject: 'science',
      title: { hi: 'बल और दाब', en: 'Force and Pressure' },
      questions: [
        {
          text: {
            hi: 'बल की SI इकाई कौन-सी है?',
            en: 'Which is the SI unit of force?'
          },
          options: [
            { hi: 'जूल', en: 'joule' },
            { hi: 'न्यूटन', en: 'newton' },
            { hi: 'वाट', en: 'watt' },
            { hi: 'पास्कल', en: 'pascal' }
          ],
          answer: 1,
          hint: { hi: 'इस इकाई का नाम एक वैज्ञानिक के नाम पर है।', en: 'This unit is named after a scientist.' },
          explain: {
            hi: 'बल को न्यूटन में मापते हैं, जिसका संकेत N है। जूल ऊर्जा का मात्रक है।',
            en: 'Force is measured in newtons, written as N. Joule is the unit of energy.'
          }
        },
        {
          text: {
            hi: '100 न्यूटन का बल 0.5 वर्ग मीटर क्षेत्रफल पर लगता है। दाब कितना होगा?',
            en: 'A force of 100 newtons acts on an area of 0.5 square metre. What is the pressure?'
          },
          options: [
            { hi: '200 पास्कल', en: '200 pascal' },
            { hi: '50 पास्कल', en: '50 pascal' },
            { hi: '100 पास्कल', en: '100 pascal' },
            { hi: '0.005 पास्कल', en: '0.005 pascal' }
          ],
          answer: 0,
          hint: { hi: 'दाब = बल भाग क्षेत्रफल।', en: 'Pressure equals force divided by area.' },
          explain: {
            hi: 'दाब = 100 भाग 0.5 = 200 पास्कल। क्षेत्रफल कम हो तो दाब बढ़ता है।',
            en: 'Pressure equals 100 divided by 0.5, which is 200 pascal. A smaller area gives greater pressure.'
          }
        },
        {
          text: {
            hi: 'जैसे-जैसे हम पहाड़ पर ऊपर जाते हैं, वायुमंडलीय दाब कैसे बदलता है?',
            en: 'As we climb a mountain, how does atmospheric pressure change?'
          },
          options: [
            { hi: 'बढ़ता है', en: 'increases' },
            { hi: 'वही रहता है', en: 'stays the same' },
            { hi: 'पूरी तरह समाप्त हो जाता है', en: 'disappears completely' },
            { hi: 'घटता है', en: 'decreases' }
          ],
          answer: 3,
          hint: { hi: 'ऊपर जाने पर हवा की परत पतली होती जाती है।', en: 'The air layer above us gets thinner as we go up.' },
          explain: {
            hi: 'ऊँचाई पर हमारे ऊपर हवा की मात्रा कम होती है, इसलिए दाब घटता है।',
            en: 'At higher places less air lies above us, so the pressure is lower.'
          }
        }
      ]
    },
    'science-2': {
      subject: 'science',
      title: { hi: 'अम्ल, क्षार और लवण', en: 'Acids, Bases and Salts' },
      questions: [
        {
          text: {
            hi: 'कौन-सा पदार्थ नीले लिटमस पेपर को लाल कर देता है?',
            en: 'Which substance turns blue litmus paper red?'
          },
          options: [
            { hi: 'क्षार', en: 'base' },
            { hi: 'चीनी का घोल', en: 'sugar solution' },
            { hi: 'अम्ल', en: 'acid' },
            { hi: 'साफ़ पानी', en: 'pure water' }
          ],
          answer: 2,
          hint: { hi: 'अम्ल का स्वाद अक्सर खट्टा होता है।', en: 'Acids often taste sour.' },
          explain: {
            hi: 'अम्ल नीले लिटमस को लाल करता है। क्षार लाल लिटमस को नीला करता है।',
            en: 'An acid turns blue litmus red. A base turns red litmus blue.'
          }
        },
        {
          text: {
            hi: 'हल्दी का पेपर किस घोल में लाल हो जाता है?',
            en: 'In which solution does turmeric paper turn red?'
          },
          options: [
            { hi: 'सिरका', en: 'vinegar' },
            { hi: 'नींबू का रस', en: 'lemon juice' },
            { hi: 'साफ़ पानी', en: 'water' },
            { hi: 'बेकिंग सोडा का घोल', en: 'baking soda solution' }
          ],
          answer: 3,
          hint: { hi: 'हल्दी क्षारीय घोल के साथ लाल होती है।', en: 'Turmeric turns red in a basic solution.' },
          explain: {
            hi: 'हल्दी एक प्राकृतिक सूचक है। क्षार के संपर्क में आने पर यह लाल हो जाती है।',
            en: 'Turmeric is a natural indicator. It turns red when it touches a base.'
          }
        },
        {
          text: {
            hi: 'चूने का पानी किस प्रकार का घोल है?',
            en: 'Lime water is what kind of solution?'
          },
          options: [
            { hi: 'अम्लीय', en: 'acidic' },
            { hi: 'क्षारीय', en: 'basic' },
            { hi: 'उदासीन', en: 'neutral' },
            { hi: 'मीठा', en: 'sweet' }
          ],
          answer: 1,
          hint: { hi: 'सोचें कि यह लाल लिटमस को नीला करता है या नहीं।', en: 'Think about whether it turns red litmus blue.' },
          explain: {
            hi: 'चूने का पानी क्षारीय है, इसलिए यह लाल लिटमस को नीला कर देता है।',
            en: 'Lime water is basic, so it turns red litmus blue.'
          }
        }
      ]
    },
    'science-3': {
      subject: 'science',
      title: { hi: 'प्रकाश', en: 'Light' },
      questions: [
        {
          text: {
            hi: 'यदि आपतन कोण 35 अंश हो, तो परावर्तन कोण कितना होगा?',
            en: 'If the angle of incidence is 35 degrees, what is the angle of reflection?'
          },
          options: [
            { hi: '55 अंश', en: '55 degrees' },
            { hi: '70 अंश', en: '70 degrees' },
            { hi: '35 अंश', en: '35 degrees' },
            { hi: '145 अंश', en: '145 degrees' }
          ],
          answer: 2,
          hint: { hi: 'परावर्तन में दोनों कोण बराबर होते हैं।', en: 'In reflection, the two angles are equal.' },
          explain: {
            hi: 'परावर्तन का नियम कहता है कि आपतन कोण परावर्तन कोण के बराबर होता है।',
            en: 'Law of reflection: angle of incidence equals angle of reflection.'
          }
        },
        {
          text: {
            hi: 'जब प्रकाश हवा से काँच में जाते समय मुड़ जाता है, तो इस घटना को क्या कहते हैं?',
            en: 'When light bends while going from air into glass, what is this called?'
          },
          options: [
            { hi: 'परावर्तन', en: 'reflection' },
            { hi: 'अपवर्तन', en: 'refraction' },
            { hi: 'अवशोषण', en: 'absorption' },
            { hi: 'छाया', en: 'shadow' }
          ],
          answer: 1,
          hint: { hi: 'प्रकाश की दिशा बदलती है, यह याद रखें।', en: 'Remember that light changes its direction.' },
          explain: {
            hi: 'दूसरे माध्यम में प्रकाश की चाल बदलती है, इसलिए वह मुड़ता है। इसे अपवर्तन कहते हैं।',
            en: 'Light changes speed in a different medium, so it bends. This bending is called refraction.'
          }
        },
        {
          text: {
            hi: 'कौन-सा दर्पण अंदर की ओर मुड़ा होता है और पास रखी वस्तु का बड़ा प्रतिबिंब बना सकता है?',
            en: 'Which mirror curves inward and can make a nearby object look larger?'
          },
          options: [
            { hi: 'अवतल दर्पण', en: 'concave mirror' },
            { hi: 'उत्तल दर्पण', en: 'convex mirror' },
            { hi: 'समतल दर्पण', en: 'plane mirror' },
            { hi: 'इनमें से कोई नहीं', en: 'none of these' }
          ],
          answer: 0,
          hint: { hi: 'शेविंग वाले छोटे दर्पण के बारे में सोचें।', en: 'Think of a shaving mirror.' },
          explain: {
            hi: 'अवतल दर्पण अंदर की ओर मुड़ा होता है। पास रखी वस्तु का बड़ा और सीधा प्रतिबिंब बनता है।',
            en: 'A concave mirror curves inward. An object placed close to it gives a larger, upright image.'
          }
        }
      ]
    },
    'science-4': {
      subject: 'science',
      title: { hi: 'कोशिका की संरचना', en: 'Cell Structure' },
      questions: [
        {
          text: {
            hi: 'जीवों की रचना की मूल इकाई क्या है?',
            en: 'What is the basic unit of structure of living things?'
          },
          options: [
            { hi: 'ऊतक', en: 'tissue' },
            { hi: 'कोशिका', en: 'cell' },
            { hi: 'अंग', en: 'organ' },
            { hi: 'परमाणु', en: 'atom' }
          ],
          answer: 1,
          hint: { hi: 'यह किसी भी जीव के शरीर का सबसे छोटा जीवित भाग है।', en: 'It is the smallest living part of any organism.' },
          explain: {
            hi: 'सभी जीव कोशिकाओं से बने होते हैं। कोशिका ही जीवन की मूल इकाई है।',
            en: 'All living things are made of cells. The cell is the basic unit of life.'
          }
        },
        {
          text: {
            hi: 'पादप कोशिका में मिलने वाली कौन-सी संरचना जंतु कोशिका में नहीं होती?',
            en: 'Which structure is found in a plant cell but not in an animal cell?'
          },
          options: [
            { hi: 'केंद्रक', en: 'nucleus' },
            { hi: 'कोशिका झिल्ली', en: 'cell membrane' },
            { hi: 'कोशिका भित्ति', en: 'cell wall' },
            { hi: 'कोशिका द्रव्य', en: 'cytoplasm' }
          ],
          answer: 2,
          hint: { hi: 'यह भाग पौधों को सहारा और मज़बूती देता है।', en: 'This part gives plants support and a firm shape.' },
          explain: {
            hi: 'कोशिका भित्ति एक मोटी और मज़बूत बाहरी परत है, जो केवल पौधों की कोशिकाओं में होती है।',
            en: 'The cell wall is a firm outer layer found only in plant cells.'
          }
        },
        {
          text: {
            hi: 'कोशिका में आने और बाहर जाने वाले पदार्थों को कौन-सी संरचना नियंत्रित करती है?',
            en: 'Which structure controls what enters and leaves a cell?'
          },
          options: [
            { hi: 'कोशिका झिल्ली', en: 'cell membrane' },
            { hi: 'केंद्रक', en: 'nucleus' },
            { hi: 'राइबोसोम', en: 'ribosome' },
            { hi: 'हरितलवक', en: 'chloroplast' }
          ],
          answer: 0,
          hint: { hi: 'यह कोशिका की सबसे बाहरी सीमा वाली परत है।', en: 'This is the outer boundary layer of the cell.' },
          explain: {
            hi: 'कोशिका झिल्ली चुनिंदा पदार्थों को ही अंदर-बाहर जाने देती है। केंद्रक कोशिका की गतिविधियों को नियंत्रित करता है।',
            en: 'The cell membrane lets only selected substances pass. The nucleus controls the activities of the cell.'
          }
        }
      ]
    }
  }
};
