export default {
  grade: 3,
  topics: {
    'maths-1': {
      subject: 'maths',
      title: { hi: 'संख्याएँ और स्थानीय मान', en: 'Numbers and place value' },
      questions: [
        {
          text: { hi: 'संख्या 4,572 में सैकड़ों के स्थान पर कौन सा अंक है?', en: 'In 4,572, which digit is in the hundreds place?' },
          options: [
            { hi: '4', en: '4' },
            { hi: '5', en: '5' },
            { hi: '7', en: '7' },
            { hi: '2', en: '2' }
          ],
          answer: 1,
          hint: { hi: 'सबसे दाईं ओर से गिनिए: इकाई, दहाई, फिर सैकड़ा।', en: 'Count from the right: ones, tens, then hundreds.' },
          explain: { hi: 'इकाई 2, दहाई 7, सैकड़ा 5 और हज़ार 4 है। इसलिए सैकड़ों का अंक 5 है।', en: 'Ones is 2, tens is 7, hundreds is 5 and thousands is 4. So the hundreds digit is 5.' }
        },
        {
          text: { hi: 'सात हज़ार दो सौ पैंतीस को अंकों में कैसे लिखेंगे?', en: 'How do you write seven thousand two hundred thirty-five in digits?' },
          options: [
            { hi: '7,253', en: '7,253' },
            { hi: '2,735', en: '2,735' },
            { hi: '7,235', en: '7,235' },
            { hi: '7,325', en: '7,325' }
          ],
          answer: 2,
          hint: { hi: 'हज़ार, सौ, दहाई और इकाई को एक-एक करके देखिए।', en: 'Look at thousands, hundreds, tens and ones one by one.' },
          explain: { hi: '7 हज़ार, 2 सौ, 3 दहाई और 5 इकाई मिलकर 7,235 होते हैं।', en: 'Seven thousands, 2 hundreds, 3 tens and 5 ones make 7,235.' }
        },
        {
          text: { hi: '8,046 में अंक 4 का स्थानीय मान क्या है?', en: 'In 8,046, what is the place value of the digit 4?' },
          options: [
            { hi: '4', en: '4' },
            { hi: '400', en: '400' },
            { hi: '4000', en: '4000' },
            { hi: '40', en: '40' }
          ],
          answer: 3,
          hint: { hi: 'देखिए कि 4 किस स्थान पर लिखा है।', en: 'Check which place the digit 4 is written in.' },
          explain: { hi: '4 दहाई के स्थान पर है, इसलिए उसका स्थानीय मान 4 दहाई यानी 40 है।', en: 'The digit 4 is in the tens place, so its value is 4 tens, which is 40.' }
        }
      ]
    },
    'maths-2': {
      subject: 'maths',
      title: { hi: 'जोड़ और घटाव (हासिल व उधार के साथ)', en: 'Addition and subtraction with carry and borrow' },
      questions: [
        {
          text: { hi: '367 + 485 कितना होगा?', en: 'What is 367 + 485?' },
          options: [
            { hi: '852', en: '852' },
            { hi: '842', en: '842' },
            { hi: '762', en: '762' },
            { hi: '952', en: '952' }
          ],
          answer: 0,
          hint: { hi: 'इकाई से शुरू कीजिए और 10 या उससे ऊपर होने पर अगले स्थान पर एक जोड़िए।', en: 'Start from the ones and carry 1 to the next place when the total is 10 or more.' },
          explain: { hi: '7+5=12, 2 लिखिए और 1 आगे ले जाइए। फिर 6+8+1=15, 5 लिखिए और 1 आगे। 3+4+1=8। उत्तर 852।', en: '7 + 5 is 12, write 2 and carry 1. Then 6 + 8 + 1 is 15, write 5 and carry 1. Then 3 + 4 + 1 is 8. Answer 852.' }
        },
        {
          text: { hi: '500 में से 278 घटाने पर कितना बचेगा?', en: 'What is 500 minus 278?' },
          options: [
            { hi: '322', en: '322' },
            { hi: '212', en: '212' },
            { hi: '232', en: '232' },
            { hi: '222', en: '222' }
          ],
          answer: 3,
          hint: { hi: 'सैकड़े से उधार लेकर दहाई में 10 जोड़िए।', en: 'Borrow from the hundreds to make the tens bigger by 10.' },
          explain: { hi: '500 में से 278 घटाने पर 222 बचते हैं। जाँच: 222 + 278 = 500।', en: '500 minus 278 leaves 222. Check: 222 + 278 = 500.' }
        },
        {
          text: { hi: '813 − 459 कितना होगा?', en: 'What is 813 minus 459?' },
          options: [
            { hi: '364', en: '364' },
            { hi: '344', en: '344' },
            { hi: '354', en: '354' },
            { hi: '446', en: '446' }
          ],
          answer: 2,
          hint: { hi: 'इकाई और दहाई में उधार लेने की ज़रूरत पड़ सकती है।', en: 'You may need to borrow in the ones and tens places.' },
          explain: { hi: '813 में से 459 घटाने पर 354 आता है। जाँच: 354 + 459 = 813।', en: '813 minus 459 gives 354. Check: 354 + 459 = 813.' }
        }
      ]
    },
    'maths-3': {
      subject: 'maths',
      title: { hi: 'गुणा का पहाड़ा और सवाल', en: 'Multiplication tables and word problems' },
      questions: [
        {
          text: { hi: '7 × 8 कितना होता है?', en: 'What is 7 × 8?' },
          options: [
            { hi: '54', en: '54' },
            { hi: '56', en: '56' },
            { hi: '64', en: '64' },
            { hi: '48', en: '48' }
          ],
          answer: 1,
          hint: { hi: '7 को 8 बार जोड़कर देखिए।', en: 'Add 7 to itself 8 times.' },
          explain: { hi: '7 के पहाड़े में आठवीं संख्या 56 है।', en: 'In the 7 times table, the 8th number is 56.' }
        },
        {
          text: { hi: 'रवि के पास 6 पैकेट बिस्किट हैं। हर पैकेट में 9 बिस्किट हैं। कुल कितने बिस्किट हैं?', en: 'Ravi has 6 packets of biscuits. Each packet has 9 biscuits. How many biscuits in all?' },
          options: [
            { hi: '45', en: '45' },
            { hi: '56', en: '56' },
            { hi: '54', en: '54' },
            { hi: '63', en: '63' }
          ],
          answer: 2,
          hint: { hi: '6 को 9 से गुणा कीजिए।', en: 'Multiply 6 by 9 to find the total.' },
          explain: { hi: '6 पैकेट × 9 बिस्किट = 54 बिस्किट।', en: '6 packets times 9 biscuits each is 54 biscuits.' }
        },
        {
          text: { hi: 'मीना हर टोकरी में 8 आम रखती है। उसके पास 5 टोकरियाँ हैं। कुल कितने आम होंगे?', en: 'Meena puts 8 mangoes in each basket. She has 5 baskets. How many mangoes in all?' },
          options: [
            { hi: '40', en: '40' },
            { hi: '35', en: '35' },
            { hi: '48', en: '48' },
            { hi: '45', en: '45' }
          ],
          answer: 0,
          hint: { hi: '5 को 8 से गुणा कीजिए।', en: 'Multiply 5 by 8.' },
          explain: { hi: '5 टोकरियों में से हर एक में 8 आम हैं, यानी 5 × 8 = 40 आम।', en: 'Five baskets with 8 mangoes each give 5 times 8, which is 40 mangoes.' }
        }
      ]
    },
    'maths-4': {
      subject: 'maths',
      title: { hi: 'लंबाई और समय', en: 'Length and time' },
      questions: [
        {
          text: { hi: 'किसी कक्षा की लंबाई नापने के लिए कौन सी इकाई सबसे ठीक है?', en: 'Which unit is best to measure the length of a classroom?' },
          options: [
            { hi: 'सेंटीमीटर', en: 'Centimetre' },
            { hi: 'मीटर', en: 'Metre' },
            { hi: 'ग्राम', en: 'Gram' },
            { hi: 'लीटर', en: 'Litre' }
          ],
          answer: 1,
          hint: { hi: 'कमरा बड़ा होता है, इसलिए बड़ी इकाई चुनिए।', en: 'A classroom is big, so pick a bigger unit.' },
          explain: { hi: 'मीटर लंबाई की इकाई है और कमरे जैसी बड़ी चीज़ों को नापने के लिए ठीक है।', en: 'Metre is a unit of length and is good for measuring big things like a room.' }
        },
        {
          text: { hi: '1 मीटर में कितने सेंटीमीटर होते हैं?', en: 'How many centimetres are in 1 metre?' },
          options: [
            { hi: '10', en: '10' },
            { hi: '50', en: '50' },
            { hi: '1000', en: '1000' },
            { hi: '100', en: '100' }
          ],
          answer: 3,
          hint: { hi: 'सेंटीमीटर छोटी इकाई है, इसलिए संख्या बड़ी होगी।', en: 'A centimetre is smaller, so the number will be bigger.' },
          explain: { hi: '1 मीटर = 100 सेंटीमीटर।', en: '1 metre is equal to 100 centimetres.' }
        },
        {
          text: { hi: 'ट्रेन 6 बजे छूटती है। आधे घंटे बाद कितने बजे होंगे?', en: 'The train leaves at 6 o clock. What time is it half an hour later?' },
          options: [
            { hi: '6:15', en: '6:15' },
            { hi: '6:50', en: '6:50' },
            { hi: '6:30', en: '6:30' },
            { hi: '7:00', en: '7:00' }
          ],
          answer: 2,
          hint: { hi: 'आधा घंटा यानी 30 मिनट।', en: 'Half an hour means 30 minutes.' },
          explain: { hi: '6 बजे से 30 मिनट बाद 6:30 होगा।', en: '30 minutes after 6 o clock is 6:30.' }
        }
      ]
    },
    'science-1': {
      subject: 'science',
      title: { hi: 'भोजन कहाँ से आता है', en: 'Where our food comes from' },
      questions: [
        {
          text: { hi: 'इनमें से कौन सा भोजन पौधे से मिलता है?', en: 'Which of these food comes from a plant?' },
          options: [
            { hi: 'दूध', en: 'Milk' },
            { hi: 'अंडा', en: 'Egg' },
            { hi: 'चावल', en: 'Rice' },
            { hi: 'दही', en: 'Curd' }
          ],
          answer: 2,
          hint: { hi: 'धान के खेत के बारे में सोचिए।', en: 'Think about a paddy field.' },
          explain: { hi: 'चावल धान नाम के पौधे के दानों से बनता है।', en: 'Rice comes from the grains of the paddy plant.' }
        },
        {
          text: { hi: 'इनमें से कौन सी चीज़ जानवर से मिलती है?', en: 'Which of these comes from an animal?' },
          options: [
            { hi: 'आम', en: 'Mango' },
            { hi: 'दूध', en: 'Milk' },
            { hi: 'मूँगफली', en: 'Peanut' },
            { hi: 'प्याज़', en: 'Onion' }
          ],
          answer: 1,
          hint: { hi: 'गाय या भैंस के बारे में सोचिए।', en: 'Think about a cow or a buffalo.' },
          explain: { hi: 'दूध गाय और भैंस जैसे जानवरों से मिलता है।', en: 'Milk comes from animals like cows and buffaloes.' }
        },
        {
          text: { hi: 'गेहूँ का आटा किससे मिलता है?', en: 'Where does wheat flour come from?' },
          options: [
            { hi: 'गेहूँ के पौधे से', en: 'From the wheat plant' },
            { hi: 'मुर्गी से', en: 'From a hen' },
            { hi: 'मछली से', en: 'From a fish' },
            { hi: 'गाय से', en: 'From a cow' }
          ],
          answer: 0,
          hint: { hi: 'गेहूँ के दाने खेत में उगते हैं।', en: 'Wheat grains grow in fields.' },
          explain: { hi: 'गेहूँ के दानों को पीसकर आटा बनता है, और गेहूँ एक पौधा है।', en: 'Wheat grains are ground into flour, and wheat is a plant.' }
        }
      ]
    },
    'science-2': {
      subject: 'science',
      title: { hi: 'हवा, पानी और हमारी ज़रूरतें', en: 'Air, water and what we need' },
      questions: [
        {
          text: { hi: 'जीने के लिए इनमें से क्या ज़रूरी है?', en: 'Which of these do we need to stay alive?' },
          options: [
            { hi: 'पत्थर', en: 'Stone' },
            { hi: 'प्लास्टिक', en: 'Plastic' },
            { hi: 'काँच', en: 'Glass' },
            { hi: 'हवा', en: 'Air' }
          ],
          answer: 3,
          hint: { hi: 'हम हर पल सांस लेते हैं।', en: 'We breathe every moment.' },
          explain: { hi: 'हम सांस लेने के लिए हवा का उपयोग करते हैं।', en: 'We breathe air to stay alive.' }
        },
        {
          text: { hi: 'मछली कहाँ रहती है?', en: 'Where do fish live?' },
          options: [
            { hi: 'पेड़ पर', en: 'In a tree' },
            { hi: 'पानी में', en: 'In water' },
            { hi: 'छत पर', en: 'On a roof' },
            { hi: 'डिब्बे में', en: 'In a box' }
          ],
          answer: 1,
          hint: { hi: 'तालाब और नदी को याद कीजिए।', en: 'Think about a pond or a river.' },
          explain: { hi: 'मछलियाँ पानी में ही रहती और चलती हैं, इसलिए उन्हें पानी की ज़रूरत होती है।', en: 'Fish live and move in water, so they need water to live.' }
        },
        {
          text: { hi: 'घर पर पानी बचाने का अच्छा तरीका कौन सा है?', en: 'Which is a good way to save water at home?' },
          options: [
            { hi: 'ब्रश करते समय नल खुला छोड़ना', en: 'Leaving the tap open while brushing' },
            { hi: 'सड़क पर पानी फेंकना', en: 'Throwing water on the road' },
            { hi: 'काम न हो तो नल बंद करना', en: 'Closing the tap when not in use' },
            { hi: 'रोज़ गाड़ी को पाइप से धोना', en: 'Washing a car with a pipe every day' }
          ],
          answer: 2,
          hint: { hi: 'बिना ज़रूरत के बहता पानी बर्बाद होता है।', en: 'Water that runs without need gets wasted.' },
          explain: { hi: 'काम न होने पर नल बंद रखने से पानी की बचत होती है।', en: 'Closing the tap when not in use saves water.' }
        }
      ]
    },
    'science-3': {
      subject: 'science',
      title: { hi: 'हमारा परिवार और मिल-जुलकर रहना', en: 'Our families and living together' },
      questions: [
        {
          text: { hi: 'घर में मदद करने का अच्छा तरीका कौन सा है?', en: 'Which is a good way to help at home?' },
          options: [
            { hi: 'घर के काम में हाथ बँटाना, जैसे झाड़ू लगाना', en: 'Sharing chores like sweeping' },
            { hi: 'बर्तन तोड़ना', en: 'Breaking things' },
            { hi: 'चीखना-चिल्लाना', en: 'Shouting loudly' },
            { hi: 'होमवर्क छिपाना', en: 'Hiding homework' }
          ],
          answer: 0,
          hint: { hi: 'सब मिलकर काम करें तो घर अच्छा चलता है।', en: 'A home runs well when everyone works together.' },
          explain: { hi: 'घर के काम मिल-जुलकर करने से सबकी मेहनत बँटती है।', en: 'When everyone shares chores, the work and effort are shared.' }
        },
        {
          text: { hi: 'परिवार क्या है?', en: 'What is a family?' },
          options: [
            { hi: 'स्कूल की एक कक्षा', en: 'A school class' },
            { hi: 'जानवरों का झुंड', en: 'A herd of animals' },
            { hi: 'दुकान', en: 'A shop' },
            { hi: 'लोगों का एक समूह जो एक-दूसरे की देखभाल करता है', en: 'A group of people who care for each other' }
          ],
          answer: 3,
          hint: { hi: 'परिवार के लोग एक-दूसरे का ध्यान रखते हैं।', en: 'Family members look after each other.' },
          explain: { hi: 'परिवार में लोग साथ रहते हैं और एक-दूसरे की देखभाल करते हैं।', en: 'In a family, people live together and care for one another.' }
        },
        {
          text: { hi: 'पड़ोसियों के साथ मिल-जुलकर रहने का अच्छा तरीका कौन सा है?', en: 'Which is a good way to live with neighbours?' },
          options: [
            { hi: 'उनके दरवाज़े पर कचरा फेंकना', en: 'Throwing garbage at their door' },
            { hi: 'ज़रूरत पर एक-दूसरे की मदद करना', en: 'Helping each other when needed' },
            { hi: 'छोटी बातों पर लड़ना', en: 'Fighting over small things' },
            { hi: 'उन पर चिल्लाना', en: 'Shouting at them' }
          ],
          answer: 1,
          hint: { hi: 'अच्छे पड़ोसी एक-दूसरे का साथ देते हैं।', en: 'Good neighbours support each other.' },
          explain: { hi: 'मदद और आदर से रहने पर पूरा मोहल्ला अच्छा रहता है।', en: 'When neighbours help and respect each other, the whole locality stays good.' }
        }
      ]
    },
    'science-4': {
      subject: 'science',
      title: { hi: 'यातायात और सुरक्षित सफ़र', en: 'Transport and safe travel' },
      questions: [
        {
          text: { hi: 'सड़क पार करने का सुरक्षित तरीका कौन सा है?', en: 'Which is a safe way to cross the road?' },
          options: [
            { hi: 'चलती गाड़ियों के बीच से भागना', en: 'Run between moving cars' },
            { hi: 'खड़ी बस के पीछे से अचानक निकलना', en: 'Step out suddenly from behind a parked bus' },
            { hi: 'फ़ोन देखते हुए पार करना', en: 'Cross while looking at a phone' },
            { hi: 'ज़ेबरा क्रॉसिंग पर दोनों ओर देखकर पार करना', en: 'Use the zebra crossing and look both ways' }
          ],
          answer: 3,
          hint: { hi: 'सड़क पर हमेशा दोनों तरफ़ देखिए।', en: 'Always look both ways on the road.' },
          explain: { hi: 'ज़ेबरा क्रॉसिंग और दोनों ओर देखने से दुर्घटना का खतरा कम होता है।', en: 'A zebra crossing and looking both ways lower the risk of an accident.' }
        },
        {
          text: { hi: 'कौन सा वाहन पटरी पर चलता है?', en: 'Which vehicle runs on rails?' },
          options: [
            { hi: 'रेलगाड़ी', en: 'Train' },
            { hi: 'नाव', en: 'Boat' },
            { hi: 'साइकिल', en: 'Cycle' },
            { hi: 'बैलगाड़ी', en: 'Bullock cart' }
          ],
          answer: 0,
          hint: { hi: 'लोहे की पटरी पर चलने वाली गाड़ी सोचिए।', en: 'Think of a vehicle that moves on iron tracks.' },
          explain: { hi: 'रेलगाड़ी लोहे की पटरियों पर चलती है।', en: 'A train moves on iron tracks.' }
        },
        {
          text: { hi: 'बस में सुरक्षित तरीके से सफ़र करने का सही तरीका कौन सा है?', en: 'Which is the safe way to travel in a bus?' },
          options: [
            { hi: 'खिड़की से हाथ बाहर निकालना', en: 'Putting your hand out of the window' },
            { hi: 'बस चलते समय दरवाज़े से लटकना', en: 'Hanging out of the door while the bus moves' },
            { hi: 'खड़े होने पर हैंडल पकड़ना', en: 'Holding the handle when standing' },
            { hi: 'बस रुकने से पहले कूदना', en: 'Jumping out before the bus stops' }
          ],
          answer: 2,
          hint: { hi: 'गिरने से बचने के लिए कुछ मज़बूत पकड़िए।', en: 'Hold something firm so you do not fall.' },
          explain: { hi: 'हैंडल पकड़ने से झटके लगने पर गिरने का खतरा कम होता है।', en: 'Holding the handle keeps you steady when the bus jerks.' }
        }
      ]
    }
  }
};
