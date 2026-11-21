export default {
  grade: 5,
  topics: {
    'maths-1': {
      subject: 'maths',
      title: { hi: 'भिन्न: जोड़ और घटाव', en: 'Fractions: addition and subtraction' },
      questions: [
        {
          text: { hi: '1/4 + 2/4 कितना होता है?', en: 'What is 1/4 + 2/4?' },
          options: [
            { hi: '2/8', en: '2/8' },
            { hi: '3/4', en: '3/4' },
            { hi: '3/8', en: '3/8' },
            { hi: '1/2', en: '1/2' }
          ],
          answer: 1,
          hint: { hi: 'जब नीचे की संख्या समान हो, तो केवल ऊपर की संख्याएँ जोड़ें।', en: 'When the bottom numbers are the same, add only the top numbers.' },
          explain: { hi: 'समान हर वाले भिन्नों में हर वही रहता है और अंश जुड़ते हैं। 1 + 2 = 3, इसलिए उत्तर 3/4 है।', en: 'With the same bottom number, the bottom stays the same and the top numbers add. 1 + 2 = 3, so the answer is 3/4.' }
        },
        {
          text: { hi: '5/6 में से 2/6 घटाने पर क्या बचेगा?', en: 'What is 5/6 minus 2/6?' },
          options: [
            { hi: '1/6', en: '1/6' },
            { hi: '7/6', en: '7/6' },
            { hi: '3/12', en: '3/12' },
            { hi: '3/6', en: '3/6' }
          ],
          answer: 3,
          hint: { hi: 'समान हर में केवल अंश घटाएँ।', en: 'With the same bottom number, subtract only the top numbers.' },
          explain: { hi: 'हर 6 ही रहता है। 5 - 2 = 3, इसलिए परिणाम 3/6 है।', en: 'The bottom stays 6. 5 - 2 = 3, so the result is 3/6.' }
        },
        {
          text: { hi: '1/2 + 1/4 कितना होता है?', en: 'What is 1/2 + 1/4?' },
          options: [
            { hi: '2/6', en: '2/6' },
            { hi: '1/3', en: '1/3' },
            { hi: '3/4', en: '3/4' },
            { hi: '2/4', en: '2/4' }
          ],
          answer: 2,
          hint: { hi: 'पहले 1/2 को चौथाई में बदलें।', en: 'First, change 1/2 into quarters.' },
          explain: { hi: '1/2 बराबर है 2/4। अब 2/4 + 1/4 = 3/4 होता है।', en: '1/2 is the same as 2/4. Now 2/4 + 1/4 = 3/4.' }
        }
      ]
    },
    'maths-2': {
      subject: 'maths',
      title: { hi: 'दशमलव: दसवाँ, सौवाँ और पैसे', en: 'Decimals: tenths, hundredths and money' },
      questions: [
        {
          text: { hi: '3 दसवें को दशमलव में कैसे लिखेंगे?', en: 'How do you write 3 tenths as a decimal?' },
          options: [
            { hi: '0.03', en: '0.03' },
            { hi: '3.0', en: '3.0' },
            { hi: '0.3', en: '0.3' },
            { hi: '30', en: '30' }
          ],
          answer: 2,
          hint: { hi: 'दसवें का स्थान दशमलव के ठीक बाद आता है।', en: 'The tenths place comes right after the decimal point.' },
          explain: { hi: 'दशमलव के बाद पहला अंक दसवें को दिखाता है। 3 दसवें यानी 0.3।', en: 'The first digit after the decimal point shows tenths. So 3 tenths is 0.3.' }
        },
        {
          text: { hi: '2 रुपये 50 पैसे को दशमलव में कैसे लिखेंगे?', en: 'How do you write 2 rupees 50 paise in decimal form?' },
          options: [
            { hi: '₹2.50', en: 'Rs 2.50' },
            { hi: '₹2.05', en: 'Rs 2.05' },
            { hi: '₹25.0', en: 'Rs 25.0' },
            { hi: '₹0.25', en: 'Rs 0.25' }
          ],
          answer: 0,
          hint: { hi: 'सौ पैसे का एक रुपया होता है।', en: 'One rupee is made of 100 paise.' },
          explain: { hi: 'पैसे रुपये के सौवें हिस्से हैं। 50 पैसे = 0.50 रुपये, इसलिए ₹2.50।', en: 'Paise are hundredths of a rupee. 50 paise = 0.50 rupee, so the answer is Rs 2.50.' }
        },
        {
          text: { hi: 'एक रुपया 75 पैसे को दशमलव में कैसे लिखेंगे?', en: 'How do you write 1 rupee 75 paise in decimal form?' },
          options: [
            { hi: '₹1.075', en: 'Rs 1.075' },
            { hi: '₹7.5', en: 'Rs 7.5' },
            { hi: '₹175', en: 'Rs 175' },
            { hi: '₹1.75', en: 'Rs 1.75' }
          ],
          answer: 3,
          hint: { hi: 'पैसे को सौवें के रूप में लिखें, दो अंक बाद में।', en: 'Write the paise as two digits after the decimal point.' },
          explain: { hi: '75 पैसे = 0.75 रुपये। एक रुपये के साथ जोड़ें तो ₹1.75 होता है।', en: '75 paise = 0.75 rupee. Add the 1 rupee and you get Rs 1.75.' }
        }
      ]
    },
    'maths-3': {
      subject: 'maths',
      title: { hi: 'क्षेत्रफल और परिमाप', en: 'Area and perimeter' },
      questions: [
        {
          text: { hi: '6 cm लंबाई और 4 cm चौड़ाई वाले आयत का परिमाप कितना है?', en: 'What is the perimeter of a rectangle that is 6 cm long and 4 cm wide?' },
          options: [
            { hi: '20 cm', en: '20 cm' },
            { hi: '24 cm', en: '24 cm' },
            { hi: '10 cm', en: '10 cm' },
            { hi: '24 वर्ग cm', en: '24 sq cm' }
          ],
          answer: 0,
          hint: { hi: 'परिमाप के लिए सभी चारों भुजाएँ जोड़ें।', en: 'For perimeter, add all four sides.' },
          explain: { hi: 'परिमाप = 2 × (लंबाई + चौड़ाई)। 2 × (6 + 4) = 20 cm।', en: 'Perimeter = 2 × (length + width). 2 × (6 + 4) = 20 cm.' }
        },
        {
          text: { hi: '5 cm भुजा वाले वर्ग का क्षेत्रफल कितना है?', en: 'What is the area of a square with side 5 cm?' },
          options: [
            { hi: '10 वर्ग cm', en: '10 sq cm' },
            { hi: '20 वर्ग cm', en: '20 sq cm' },
            { hi: '25 वर्ग cm', en: '25 sq cm' },
            { hi: '5 वर्ग cm', en: '5 sq cm' }
          ],
          answer: 2,
          hint: { hi: 'वर्ग का क्षेत्रफल भुजा को उसी से गुणा करके निकलता है।', en: 'The area of a square is found by multiplying the side by itself.' },
          explain: { hi: 'क्षेत्रफल = भुजा × भुजा। 5 × 5 = 25 वर्ग cm।', en: 'Area = side × side. 5 × 5 = 25 sq cm.' }
        },
        {
          text: { hi: '8 m लंबाई और 3 m चौड़ाई वाले आयताकार खेत का क्षेत्रफल कितना है?', en: 'What is the area of a rectangular field that is 8 m long and 3 m wide?' },
          options: [
            { hi: '22 वर्ग m', en: '22 sq m' },
            { hi: '24 वर्ग m', en: '24 sq m' },
            { hi: '11 m', en: '11 m' },
            { hi: '24 m', en: '24 m' }
          ],
          answer: 1,
          hint: { hi: 'क्षेत्रफल के लिए लंबाई को चौड़ाई से गुणा करें।', en: 'For area, multiply the length by the width.' },
          explain: { hi: 'क्षेत्रफल = लंबाई × चौड़ाई। 8 × 3 = 24 वर्ग m। इकाई वर्ग मीटर होती है।', en: 'Area = length × width. 8 × 3 = 24 sq m. The unit is square metres.' }
        }
      ]
    },
    'maths-4': {
      subject: 'maths',
      title: { hi: 'आँकड़े: तालिका और बार चार्ट', en: 'Data handling: tables and bar charts' },
      questions: [
        {
          text: {
            hi: 'एक तालिका में लिखा है: सोमवार 12 बच्चे, मंगलवार 15 बच्चे, बुधवार 9 बच्चे, गुरुवार 18 बच्चे। किस दिन सबसे ज़्यादा बच्चे आए?',
            en: 'A table shows: Monday 12 children, Tuesday 15 children, Wednesday 9 children, Thursday 18 children. On which day did the most children come?'
          },
          options: [
            { hi: 'बुधवार', en: 'Wednesday' },
            { hi: 'गुरुवार', en: 'Thursday' },
            { hi: 'मंगलवार', en: 'Tuesday' },
            { hi: 'सोमवार', en: 'Monday' }
          ],
          answer: 1,
          hint: { hi: 'तालिका में सबसे बड़ी संख्या देखें।', en: 'Look for the largest number in the table.' },
          explain: { hi: 'तालिका में 18 सबसे बड़ी संख्या है, जो गुरुवार की है। इसलिए गुरुवार को सबसे ज़्यादा बच्चे आए।', en: 'The largest number in the table is 18, and it is for Thursday. So the most children came on Thursday.' }
        },
        {
          text: {
            hi: 'बार चार्ट में एक बार 20 फल और दूसरी बार 14 फल दिखाती है। दोनों में कितना अंतर है?',
            en: 'A bar chart shows one bar for 20 fruits and another bar for 14 fruits. What is the difference?'
          },
          options: [
            { hi: '6', en: '6' },
            { hi: '34', en: '34' },
            { hi: '4', en: '4' },
            { hi: '8', en: '8' }
          ],
          answer: 0,
          hint: { hi: 'अंतर निकालने के लिए बड़ी संख्या से छोटी घटाएँ।', en: 'To find the difference, subtract the smaller number from the bigger one.' },
          explain: { hi: 'अंतर = बड़ी संख्या − छोटी संख्या। 20 − 14 = 6।', en: 'Difference = bigger number minus smaller number. 20 - 14 = 6.' }
        },
        {
          text: {
            hi: 'एक तालिका में लिखा है: लाल रंग 10 बच्चों को पसंद है, नीला रंग 6 को और हरा रंग 8 को। कुल कितने बच्चों ने रंग चुने?',
            en: 'A table shows: red is liked by 10 children, blue by 6 children, and green by 8 children. How many children chose a colour in total?'
          },
          options: [
            { hi: '22', en: '22' },
            { hi: '26', en: '26' },
            { hi: '24', en: '24' },
            { hi: '28', en: '28' }
          ],
          answer: 2,
          hint: { hi: 'सभी संख्याओं को जोड़ें।', en: 'Add all the numbers together.' },
          explain: { hi: 'कुल = 10 + 6 + 8 = 24 बच्चे।', en: 'Total = 10 + 6 + 8 = 24 children.' }
        }
      ]
    },
    'science-1': {
      subject: 'science',
      title: { hi: 'भोजन: पोषक तत्व और संतुलित आहार', en: 'Food: nutrients and balanced food' },
      questions: [
        {
          text: { hi: 'शरीर को सबसे ज़्यादा ऊर्जा किस पोषक तत्व से मिलती है?', en: 'Which nutrient gives the body most of its energy?' },
          options: [
            { hi: 'विटामिन', en: 'Vitamins' },
            { hi: 'नमक', en: 'Salt' },
            { hi: 'पानी', en: 'Water' },
            { hi: 'कार्बोहाइड्रेट', en: 'Carbohydrates' }
          ],
          answer: 3,
          hint: { hi: 'रोटी, चावल और आलू में यही पोषक तत्व ज़्यादा होता है।', en: 'Rice, bread and potato are rich in this nutrient.' },
          explain: { hi: 'कार्बोहाइड्रेट शरीर को ऊर्जा देते हैं, जैसे रोटी, चावल और आलू से।', en: 'Carbohydrates give the body energy, for example from rice, bread and potato.' }
        },
        {
          text: { hi: 'प्रोटीन शरीर के लिए किस काम आता है?', en: 'What is protein useful for in the body?' },
          options: [
            { hi: 'केवल गर्मी के लिए', en: 'Only for heat' },
            { hi: 'बढ़ने और टूट-फूट की मरम्मत के लिए', en: 'For growth and repair' },
            { hi: 'केवल पानी के लिए', en: 'Only for water' },
            { hi: 'केवल सोने के लिए', en: 'Only for sleeping' }
          ],
          answer: 1,
          hint: { hi: 'दाल, दूध और अंडे में प्रोटीन होता है।', en: 'Dal, milk and eggs contain protein.' },
          explain: { hi: 'प्रोटीन मांसपेशियों और शरीर के नए हिस्सों के बढ़ने और मरम्मत में मदद करता है।', en: 'Protein helps muscles and body parts grow and repair.' }
        },
        {
          text: { hi: 'इनमें से कौन-सा संतुलित आहार है?', en: 'Which of these is a balanced meal?' },
          options: [
            { hi: 'केवल मिठाई', en: 'Only sweets' },
            { hi: 'केवल चिप्स', en: 'Only chips' },
            { hi: 'दाल, रोटी, सब्ज़ी और दही', en: 'Dal, roti, vegetable and curd' },
            { hi: 'केवल कोल्ड ड्रिंक', en: 'Only cold drink' }
          ],
          answer: 2,
          hint: { hi: 'संतुलित आहार में कई तरह के पोषक तत्व साथ होते हैं।', en: 'A balanced meal has many kinds of nutrients together.' },
          explain: { hi: 'संतुलित आहार में अनाज, दाल, सब्ज़ी और दूध जैसी चीज़ें साथ होती हैं, जिससे शरीर को सभी पोषक तत्व मिलते हैं।', en: 'A balanced meal has grains, pulses, vegetables and milk together, so the body gets all nutrients.' }
        }
      ]
    },
    'science-2': {
      subject: 'science',
      title: { hi: 'प्रकाश, छाया और परावर्तन', en: 'Light, shadows and reflection' },
      questions: [
        {
          text: { hi: 'छाया तब बनती है जब...', en: 'A shadow is formed when...' },
          options: [
            { hi: 'प्रकाश किसी वस्तु से रुक जाता है', en: 'light is stopped by an object' },
            { hi: 'वस्तु पारदर्शी होती है', en: 'the object is transparent' },
            { hi: 'कमरे में अंधेरा होता है', en: 'the room is dark' },
            { hi: 'केवल रात में', en: 'only at night' }
          ],
          answer: 0,
          hint: { hi: 'सोचें कि प्रकाश के रास्ते में कोई चीज़ आ जाए तो क्या होता है।', en: 'Think about what happens when something blocks the path of light.' },
          explain: { hi: 'अपारदर्शी वस्तु प्रकाश को आगे जाने से रोकती है, और उसके पीछे छाया बनती है।', en: 'An opaque object blocks light from passing, and a shadow forms behind it.' }
        },
        {
          text: { hi: 'दर्पण (मिरर) पर पड़ने वाले प्रकाश का क्या होता है?', en: 'What does a mirror do with light falling on it?' },
          options: [
            { hi: 'उसे छिपा लेता है', en: 'It hides it' },
            { hi: 'उसका रंग बदल देता है', en: 'It changes its colour' },
            { hi: 'उसे वापस लौटा देता है', en: 'It sends it back' },
            { hi: 'उसे खत्म कर देता है', en: 'It destroys it' }
          ],
          answer: 2,
          hint: { hi: 'दर्पण में अपना चेहरा दिखता है, क्योंकि प्रकाश वापस आता है।', en: 'You see your face in a mirror because light comes back from it.' },
          explain: { hi: 'चिकनी सतह से प्रकाश वापस लौटता है, इसे परावर्तन कहते हैं।', en: 'A smooth shiny surface sends light back, and this is called reflection.' }
        },
        {
          text: { hi: 'जब प्रकाश का स्रोत वस्तु के बहुत पास हो, तो छाया कैसी होगी?', en: 'When the light source is very close to an object, how will the shadow look?' },
          options: [
            { hi: 'छोटी', en: 'Small' },
            { hi: 'पानी जैसी', en: 'Like water' },
            { hi: 'गायब', en: 'Missing' },
            { hi: 'बड़ी', en: 'Big' }
          ],
          answer: 3,
          hint: { hi: 'पास से रोशनी डालने पर छाया फैल जाती है।', en: 'When light comes from close by, the shadow spreads out more.' },
          explain: { hi: 'स्रोत पास हो तो छाया बड़ी और लंबी दिखती है। दूर हो तो छाया छोटी होती है।', en: 'When the source is close, the shadow looks bigger and longer. When it is far, the shadow is smaller.' }
        }
      ]
    },
    'science-3': {
      subject: 'science',
      title: { hi: 'पानी: स्रोत, सफ़ाई और बचत', en: 'Water: sources, cleaning and saving' },
      questions: [
        {
          text: { hi: 'पानी का एक प्राकृतिक स्रोत कौन-सा है?', en: 'Which is a natural source of water?' },
          options: [
            { hi: 'नल', en: 'Tap' },
            { hi: 'नदी', en: 'River' },
            { hi: 'बोतल', en: 'Bottle' },
            { hi: 'टंकी', en: 'Tank' }
          ],
          answer: 1,
          hint: { hi: 'जो पानी अपने आप बहता है, वह प्राकृतिक स्रोत है।', en: 'Water that flows by itself from nature comes from a natural source.' },
          explain: { hi: 'नदी, झील, तालाब और झरने पानी के प्राकृतिक स्रोत हैं। नल और टंकी इंसानों के बनाए होते हैं।', en: 'Rivers, lakes, ponds and springs are natural sources. Taps and tanks are made by people.' }
        },
        {
          text: { hi: 'पानी को पीने लायक साफ़ करने का एक आसान तरीका कौन-सा है?', en: 'Which is an easy way to make water safe to drink?' },
          options: [
            { hi: 'उसे उबालना', en: 'Boiling it' },
            { hi: 'उसमें नमक डालना', en: 'Adding salt to it' },
            { hi: 'उसमें रंग डालना', en: 'Adding colour to it' },
            { hi: 'उसे फ्रीज़र में रखना', en: 'Keeping it in the freezer' }
          ],
          answer: 0,
          hint: { hi: 'गर्म करने से पानी के कीटाणु मर जाते हैं।', en: 'Heating water kills germs in it.' },
          explain: { hi: 'पानी को उबालने से उसके कीटाणु मर जाते हैं और वह पीने लायक बनता है।', en: 'Boiling water kills germs, so it becomes safe to drink.' }
        },
        {
          text: { hi: 'पानी बचाने का सही तरीका कौन-सा है?', en: 'Which is a correct way to save water?' },
          options: [
            { hi: 'नल खुला छोड़ना', en: 'Leaving the tap open' },
            { hi: 'टपकते नल को अनदेखा करना', en: 'Ignoring a dripping tap' },
            { hi: 'ब्रश करते समय नल बंद रखना', en: 'Keeping the tap off while brushing' },
            { hi: 'पानी को बेकार बहने देना', en: 'Letting water flow waste' }
          ],
          answer: 2,
          hint: { hi: 'जो पानी बेकार बहे, उसे रोकना बचत है।', en: 'Stopping water from going to waste is saving water.' },
          explain: { hi: 'ब्रश करते समय नल बंद रखने से बहुत सारा पानी बचता है। टपकता नल भी ठीक कराना चाहिए।', en: 'Turning off the tap while brushing saves a lot of water. A dripping tap should also be fixed.' }
        }
      ]
    },
    'science-4': {
      subject: 'science',
      title: { hi: 'हमारा पर्यावरण: प्रदूषण, कचरा और पुनर्चक्रण', en: 'Our environment: pollution, waste and recycling' },
      questions: [
        {
          text: { hi: 'प्लास्टिक का कचरा कम करने का सबसे अच्छा तरीका कौन-सा है?', en: 'Which is the best way to reduce plastic waste?' },
          options: [
            { hi: 'पुनर्चक्रण और कम उपयोग', en: 'Recycling and using less' },
            { hi: 'उसे जलाना', en: 'Burning it' },
            { hi: 'नदी में फेंकना', en: 'Throwing it in a river' },
            { hi: 'खुले में छोड़ देना', en: 'Leaving it in the open' }
          ],
          answer: 0,
          hint: { hi: 'कचरे को दोबारा उपयोग में लाना और कम इस्तेमाल करना सबसे अच्छा है।', en: 'Reusing and using less is better than throwing things away.' },
          explain: { hi: 'पुनर्चक्रण में कचरे से नई चीज़ें बनती हैं। कम उपयोग करने से कचरा भी कम बनता है।', en: 'Recycling turns waste into new things. Using less also means less waste is made.' }
        },
        {
          text: { hi: 'गीला कचरा किसे कहते हैं?', en: 'What is wet waste?' },
          options: [
            { hi: 'प्लास्टिक की बोतल', en: 'Plastic bottle' },
            { hi: 'टिन का डिब्बा', en: 'Tin can' },
            { hi: 'सब्ज़ी और फलों के छिलके', en: 'Vegetable and fruit peels' },
            { hi: 'पुरानी बैटरी', en: 'Old battery' }
          ],
          answer: 2,
          hint: { hi: 'जो चीज़ें खाने से निकलती हैं और जल्दी सड़ती हैं, वे गीला कचरा हैं।', en: 'Things from food that rot quickly are wet waste.' },
          explain: { hi: 'गीला कचरा जल्दी सड़ता है और उससे खाद बनाई जा सकती है।', en: 'Wet waste rots quickly and can be used to make compost.' }
        },
        {
          text: { hi: 'इनमें से कौन-सा वायु प्रदूषण का स्रोत है?', en: 'Which of these is a source of air pollution?' },
          options: [
            { hi: 'पेड़ लगाना', en: 'Planting trees' },
            { hi: 'कचरे को अलग करना', en: 'Separating waste' },
            { hi: 'साइकिल चलाना', en: 'Riding a bicycle' },
            { hi: 'फैक्ट्री का ज़हरीला धुआँ', en: 'Poisonous smoke from a factory' }
          ],
          answer: 3,
          hint: { hi: 'जो चीज़ हवा को गंदा करती है, वही प्रदूषण का स्रोत है।', en: 'Something that makes the air dirty is a source of pollution.' },
          explain: { hi: 'फैक्ट्री और गाड़ियों का धुआँ हवा को गंदा करता है, जिससे सांस की बीमारियाँ हो सकती हैं।', en: 'Smoke from factories and vehicles makes the air dirty and can cause breathing problems.' }
        }
      ]
    }
  }
};
