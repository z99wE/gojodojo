export default {
  grade: 4,
  topics: {
    'maths-1': {
      subject: 'maths',
      title: { hi: 'एक लाख तक की संख्याएँ और तुलना', en: 'Numbers up to 1,00,000 and comparing' },
      questions: [
        {
          text: { hi: '45,678 में अंक 5 का स्थानीय मान क्या है?', en: 'What is the place value of 5 in 45,678?' },
          options: [
            { hi: '5', en: '5' },
            { hi: '500', en: '500' },
            { hi: '5,000', en: '5,000' },
            { hi: '50,000', en: '50,000' }
          ],
          answer: 2,
          hint: { hi: 'गिनिए कि 5 हज़ार की जगह पर है या सैकड़े की जगह पर।', en: 'Count which place the 5 sits in, from the right.' },
          explain: { hi: '45,678 में 5 हज़ार की जगह पर है, इसलिए उसका मान 5,000 है।', en: 'The 5 is in the thousands place, so its value is 5,000.' }
        },
        {
          text: { hi: 'इन संख्याओं में सबसे बड़ी संख्या कौन-सी है?', en: 'Which number is the greatest?' },
          options: [
            { hi: '84,219', en: '84,219' },
            { hi: '84,912', en: '84,912' },
            { hi: '48,921', en: '48,921' },
            { hi: '84,192', en: '84,192' }
          ],
          answer: 1,
          hint: { hi: 'पहले लाख और हज़ार के अंक देखिए, फिर सैकड़े के।', en: 'Compare the leftmost digits first, then move right.' },
          explain: { hi: 'सब में 84 हज़ार है, फिर सैकड़े में 9 सबसे बड़ा है, इसलिए 84,912 सबसे बड़ी है।', en: 'All start with 84 thousand, and 9 in the hundreds place is the largest, so 84,912 is greatest.' }
        },
        {
          text: { hi: '99,999 के ठीक बाद कौन-सी संख्या आती है?', en: 'Which number comes just after 99,999?' },
          options: [
            { hi: '99,998', en: '99,998' },
            { hi: '90,000', en: '90,000' },
            { hi: '99,990', en: '99,990' },
            { hi: '1,00,000', en: '1,00,000' }
          ],
          answer: 3,
          hint: { hi: 'एक जोड़ने पर संख्या कहाँ तक पहुँचती है, सोचिए।', en: 'Think about what happens when you add 1 to 99,999.' },
          explain: { hi: '99,999 में 1 जोड़ने पर 1,00,000 बनता है, जो एक लाख है।', en: 'Adding 1 to 99,999 gives 1,00,000, which is one lakh.' }
        }
      ]
    },
    'maths-2': {
      subject: 'maths',
      title: { hi: 'गुणनखंड, गुणज और सरल विभाजन', en: 'Factors, multiples and simple divisibility' },
      questions: [
        {
          text: { hi: 'कौन-सी संख्या 5 से पूरी तरह विभाजित होती है?', en: 'Which number is divisible by 5?' },
          options: [
            { hi: '23', en: '23' },
            { hi: '34', en: '34' },
            { hi: '45', en: '45' },
            { hi: '58', en: '58' }
          ],
          answer: 2,
          hint: { hi: 'जिस संख्या का आखिरी अंक 0 या 5 हो, उसे याद कीजिए।', en: 'A number ending in 0 or 5 is special here.' },
          explain: { hi: '5 से विभाज्य संख्या का आखिरी अंक 0 या 5 होता है। 45 का आखिरी अंक 5 है।', en: 'Numbers ending in 0 or 5 are divisible by 5. 45 ends in 5.' }
        },
        {
          text: { hi: 'इनमें से कौन-सी संख्या 6 का गुणज है?', en: 'Which number is a multiple of 6?' },
          options: [
            { hi: '13', en: '13' },
            { hi: '21', en: '21' },
            { hi: '25', en: '25' },
            { hi: '24', en: '24' }
          ],
          answer: 3,
          hint: { hi: 'गुणज वह संख्या है जो 6 को किसी पूर्ण संख्या से गुणा करने पर मिले।', en: 'A multiple is what you get by multiplying 6 by a whole number.' },
          explain: { hi: '6 × 4 = 24, इसलिए 24 संख्या 6 का गुणज है।', en: '6 × 4 = 24, so 24 is a multiple of 6.' }
        },
        {
          text: { hi: 'इनमें से कौन-सी संख्या 20 का गुणनखंड है?', en: 'Which of these is a factor of 20?' },
          options: [
            { hi: '4', en: '4' },
            { hi: '6', en: '6' },
            { hi: '7', en: '7' },
            { hi: '9', en: '9' }
          ],
          answer: 0,
          hint: { hi: 'गुणनखंड वह संख्या है जो 20 को बिना शेष छोड़े भाग दे।', en: 'A factor divides 20 with nothing left over.' },
          explain: { hi: '20 ÷ 4 = 5 बिना शेष के, इसलिए 4 गुणनखंड है।', en: '20 ÷ 4 = 5 with no remainder, so 4 is a factor.' }
        }
      ]
    },
    'maths-3': {
      subject: 'maths',
      title: { hi: 'भिन्न: पूरे के हिस्से, समान भिन्न और तुलना', en: 'Fractions: parts, like fractions and comparing' },
      questions: [
        {
          text: { hi: 'एक रोटी को 4 बराबर भागों में काटा गया। आपने उसका 1 भाग खाया। आपने कितना हिस्सा खाया?', en: 'A roti is cut into 4 equal parts and you eat 1 part. What fraction did you eat?' },
          options: [
            { hi: '1/4', en: '1/4' },
            { hi: '1/2', en: '1/2' },
            { hi: '3/4', en: '3/4' },
            { hi: '4/1', en: '4/1' }
          ],
          answer: 0,
          hint: { hi: 'ऊपर का अंक कितना खाया, नीचे का अंक कुल कितने भाग।', en: 'The top number is the part you ate, the bottom is the total parts.' },
          explain: { hi: 'कुल 4 भाग हैं और आपने 1 भाग खाया, इसलिए हिस्सा 1/4 है।', en: 'There are 4 equal parts and you ate 1, so the fraction is 1/4.' }
        },
        {
          text: { hi: 'इनमें से सबसे बड़ा भिन्न कौन-सा है?', en: 'Which fraction is the largest?' },
          options: [
            { hi: '1/8', en: '1/8' },
            { hi: '1/4', en: '1/4' },
            { hi: '1/2', en: '1/2' },
            { hi: '1/6', en: '1/6' }
          ],
          answer: 2,
          hint: { hi: 'जितने कम भाग होंगे, हर भाग उतना बड़ा होगा।', en: 'The fewer the equal parts, the bigger each part is.' },
          explain: { hi: 'जब अंश समान हो, तो नीचे का अंक छोटा हो तो भिन्न बड़ा होता है। 1/2 सबसे बड़ा है।', en: 'With the same top number, a smaller bottom number means a bigger fraction. 1/2 is the largest.' }
        },
        {
          text: { hi: 'इनमें से कौन-सा जोड़ा समान भिन्न (like fractions) है?', en: 'Which pair is a pair of like fractions?' },
          options: [
            { hi: '1/3 और 2/5', en: '1/3 and 2/5' },
            { hi: '3/8 और 5/8', en: '3/8 and 5/8' },
            { hi: '1/2 और 1/4', en: '1/2 and 1/4' },
            { hi: '2/3 और 3/4', en: '2/3 and 3/4' }
          ],
          answer: 1,
          hint: { hi: 'समान भिन्न में नीचे का अंक एक ही होता है।', en: 'Like fractions have the same bottom number.' },
          explain: { hi: '3/8 और 5/8 दोनों में नीचे 8 है, इसलिए ये समान भिन्न हैं।', en: 'Both 3/8 and 5/8 have 8 at the bottom, so they are like fractions.' }
        }
      ]
    },
    'maths-4': {
      subject: 'maths',
      title: { hi: 'आयत और वर्ग का परिमाप, सरल पैसे और बिल', en: 'Perimeter of rectangles and squares, simple money and bills' },
      questions: [
        {
          text: { hi: 'एक आयत की लंबाई 8 सेमी और चौड़ाई 3 सेमी है। उसका परिमाप कितना है?', en: 'A rectangle is 8 cm long and 3 cm wide. What is its perimeter?' },
          options: [
            { hi: '11 सेमी', en: '11 cm' },
            { hi: '22 सेमी', en: '22 cm' },
            { hi: '24 सेमी', en: '24 cm' },
            { hi: '16 सेमी', en: '16 cm' }
          ],
          answer: 1,
          hint: { hi: 'परिमाप में चारों भुजाओं की लंबाई जोड़िए।', en: 'Add the lengths of all four sides.' },
          explain: { hi: 'परिमाप = 2 × (लंबाई + चौड़ाई) = 2 × (8 + 3) = 22 सेमी।', en: 'Perimeter = 2 × (length + width) = 2 × (8 + 3) = 22 cm.' }
        },
        {
          text: { hi: 'एक वर्ग की हर भुजा 5 मीटर है। उसका परिमाप कितना है?', en: 'Each side of a square is 5 m. What is its perimeter?' },
          options: [
            { hi: '10 मीटर', en: '10 m' },
            { hi: '15 मीटर', en: '15 m' },
            { hi: '20 मीटर', en: '20 m' },
            { hi: '25 मीटर', en: '25 m' }
          ],
          answer: 2,
          hint: { hi: 'वर्ग की चारों भुजाएँ बराबर होती हैं।', en: 'All four sides of a square are equal.' },
          explain: { hi: 'वर्ग का परिमाप = 4 × भुजा = 4 × 5 = 20 मीटर।', en: 'Perimeter of a square = 4 × side = 4 × 5 = 20 m.' }
        },
        {
          text: { hi: 'आपने 100 रुपये दिए। एक पेंसिल 25 रुपये की और एक रबर 40 रुपये का लिया। आपको कितने रुपये वापस मिलेंगे?', en: 'You pay Rs 100 for a pencil of Rs 25 and an eraser of Rs 40. How much change do you get?' },
          options: [
            { hi: '55 रुपये', en: 'Rs 55' },
            { hi: '65 रुपये', en: 'Rs 65' },
            { hi: '75 रुपये', en: 'Rs 75' },
            { hi: '35 रुपये', en: 'Rs 35' }
          ],
          answer: 3,
          hint: { hi: 'पहले दोनों चीज़ों का कुल दाम निकालिए, फिर उसे 100 में से घटाइए।', en: 'First add the two prices, then subtract from 100.' },
          explain: { hi: 'कुल दाम 25 + 40 = 65 रुपये है। 100 − 65 = 35 रुपये वापस मिलेंगे।', en: 'Total price is 25 + 40 = 65. Change is 100 − 65 = Rs 35.' }
        }
      ]
    },
    'science-1': {
      subject: 'science',
      title: { hi: 'पौधे: जड़, तना, पत्ती और फूल', en: 'Plants: roots, stems, leaves and flowers' },
      questions: [
        {
          text: { hi: 'पौधे की कौन-सी भाग मिट्टी से पानी लेता है?', en: 'Which part of a plant takes in water from the soil?' },
          options: [
            { hi: 'पत्ती', en: 'Leaf' },
            { hi: 'जड़', en: 'Root' },
            { hi: 'फूल', en: 'Flower' },
            { hi: 'फल', en: 'Fruit' }
          ],
          answer: 1,
          hint: { hi: 'यह भाग ज़मीन के अंदर रहता है।', en: 'This part stays under the ground.' },
          explain: { hi: 'जड़ें मिट्टी से पानी और खनिज लेकर पौधे को पकड़े रखती हैं।', en: 'Roots take in water and minerals from the soil and hold the plant firmly.' }
        },
        {
          text: { hi: 'पत्तियाँ धूप की मदद से अपना भोजन कैसे बनाती हैं?', en: 'Which part of the plant makes food using sunlight?' },
          options: [
            { hi: 'जड़', en: 'Root' },
            { hi: 'तना', en: 'Stem' },
            { hi: 'पत्ती', en: 'Leaf' },
            { hi: 'बीज', en: 'Seed' }
          ],
          answer: 2,
          hint: { hi: 'हरे रंग का यह भाग धूप को पकड़ता है।', en: 'This green part catches sunlight.' },
          explain: { hi: 'पत्तियाँ धूप, पानी और हवा की मदद से भोजन बनाती हैं।', en: 'Leaves make food using sunlight, water and air.' }
        },
        {
          text: { hi: 'जड़ से लिया गया पानी पत्तियों तक कौन-सा भाग ले जाता है?', en: 'Which part carries water from the roots up to the leaves?' },
          options: [
            { hi: 'तना', en: 'Stem' },
            { hi: 'पंखुड़ी', en: 'Petal' },
            { hi: 'बीज', en: 'Seed' },
            { hi: 'छाल', en: 'Bark' }
          ],
          answer: 0,
          hint: { hi: 'यह भाग जड़ और पत्तियों को जोड़ता है।', en: 'This part connects the roots and the leaves.' },
          explain: { hi: 'तना पानी को जड़ से ऊपर पत्तियों और फूलों तक पहुँचाता है।', en: 'The stem carries water upward from the roots to the leaves and flowers.' }
        }
      ]
    },
    'science-2': {
      subject: 'science',
      title: { hi: 'सजीव और निर्जीव वस्तुएँ और उनकी ज़रूरतें', en: 'Living and non-living things and their needs' },
      questions: [
        {
          text: { hi: 'इनमें से कौन-सी वस्तु निर्जीव है?', en: 'Which of these is non-living?' },
          options: [
            { hi: 'कुत्ता', en: 'Dog' },
            { hi: 'पेड़', en: 'Tree' },
            { hi: 'पत्थर', en: 'Stone' },
            { hi: 'मछली', en: 'Fish' }
          ],
          answer: 2,
          hint: { hi: 'जो बढ़ता नहीं और साँस नहीं लेता, वह निर्जीव है।', en: 'Something that does not grow or breathe is non-living.' },
          explain: { hi: 'पत्थर न बढ़ता है, न साँस लेता है और न उसे भोजन चाहिए।', en: 'A stone does not grow, breathe or need food.' }
        },
        {
          text: { hi: 'सभी सजीवों को किस चीज़ की ज़रूरत होती है?', en: 'Which thing do all living things need?' },
          options: [
            { hi: 'केवल धूप', en: 'Only sunlight' },
            { hi: 'पानी', en: 'Water' },
            { hi: 'टेलीविज़न', en: 'Television' },
            { hi: 'लोहे का चम्मच', en: 'Metal spoon' }
          ],
          answer: 1,
          hint: { hi: 'पौधे, जानवर और इंसान, सबको इसकी ज़रूरत होती है।', en: 'Plants, animals and people all need this.' },
          explain: { hi: 'सभी सजीवों को जीने के लिए पानी चाहिए।', en: 'All living things need water to survive.' }
        },
        {
          text: { hi: 'इनमें से कौन-सा सजीव है?', en: 'Which one is living?' },
          options: [
            { hi: 'एक चट्टान', en: 'A rock' },
            { hi: 'एक साइकिल', en: 'A bicycle' },
            { hi: 'एक मटका', en: 'A clay pot' },
            { hi: 'एक बकरी', en: 'A goat' }
          ],
          answer: 3,
          hint: { hi: 'जो बढ़ता है, भोजन लेता है और बच्चे पैदा करता है, वह सजीव है।', en: 'Something that grows, eats and has young ones is living.' },
          explain: { hi: 'बकरी बढ़ती है, भोजन खाती है, साँस लेती है और बच्चे पैदा करती है।', en: 'A goat grows, eats, breathes and can have young ones.' }
        }
      ]
    },
    'science-3': {
      subject: 'science',
      title: { hi: 'हमारा शरीर: दाँत, हड्डियाँ और स्वस्थ आहार', en: 'Our body: teeth, bones and healthy food habits' },
      questions: [
        {
          text: { hi: 'हड्डियों और दाँतों के लिए कौन-सा भोजन अच्छा है?', en: 'Which food is good for strong bones and teeth?' },
          options: [
            { hi: 'चिप्स', en: 'Chips' },
            { hi: 'दूध', en: 'Milk' },
            { hi: 'मिठाई', en: 'Sweets' },
            { hi: 'कोल्ड ड्रिंक', en: 'Cold drink' }
          ],
          answer: 1,
          hint: { hi: 'यह सफ़ेद और पौष्टिक पेय है जो बच्चों को रोज़ मिलता है।', en: 'This white, nutritious drink is good for growing children.' },
          explain: { hi: 'दूध में कैल्शियम होता है, जो हड्डियों और दाँतों को मज़बूत बनाता है।', en: 'Milk has calcium, which keeps bones and teeth strong.' }
        },
        {
          text: { hi: 'दाँतों को साफ़ करना कितनी बार ज़रूरी है?', en: 'How often should we brush our teeth?' },
          options: [
            { hi: 'महीने में एक बार', en: 'Once a month' },
            { hi: 'साल में एक बार', en: 'Once a year' },
            { hi: 'दिन में दो बार', en: 'Twice a day' },
            { hi: 'कभी नहीं', en: 'Never' }
          ],
          answer: 2,
          hint: { hi: 'सुबह और रात को यह आदत ज़रूरी है।', en: 'Brushing in the morning and at night is a good habit.' },
          explain: { hi: 'दिन में दो बार ब्रश करने से दाँतों में कीड़े नहीं लगते।', en: 'Brushing twice a day keeps teeth clean and free from decay.' }
        },
        {
          text: { hi: 'शरीर में कौन-सी हड्डी का ढाँचा दिमाग़ की रक्षा करता है?', en: 'Which bony box protects our brain?' },
          options: [
            { hi: 'खोपड़ी', en: 'Skull' },
            { hi: 'पेट', en: 'Stomach' },
            { hi: 'दिल', en: 'Heart' },
            { hi: 'फेफड़े', en: 'Lungs' }
          ],
          answer: 0,
          hint: { hi: 'सिर की हड्डी दिमाग़ को ढककर रखती है।', en: 'The bone of the head covers the brain.' },
          explain: { hi: 'खोपड़ी हमारे दिमाग़ को चोट से बचाती है।', en: 'The skull protects the brain from injury.' }
        }
      ]
    },
    'science-4': {
      subject: 'science',
      title: { hi: 'दिन-रात, सूरज, चाँद और मौसम', en: 'Day, night, the sun, the moon and seasons' },
      questions: [
        {
          text: { hi: 'दिन और रात किस वजह से होते हैं?', en: 'What causes day and night?' },
          options: [
            { hi: 'चाँद हमारे चारों ओर घूमता है', en: 'The moon moves around us' },
            { hi: 'धरती अपनी धुरी पर घूमती है', en: 'The earth spins on its own axis' },
            { hi: 'बादल सूरज को ढक लेते हैं', en: 'Clouds cover the sun' },
            { hi: 'हवा तेज़ चलती है', en: 'Wind blows strongly' }
          ],
          answer: 1,
          hint: { hi: 'धरती का घूमना दिन और रात का कारण है।', en: 'The turning of the earth causes day and night.' },
          explain: { hi: 'धरती अपनी धुरी पर घूमती है, इसलिए जो हिस्सा सूरज के सामने आता है वहाँ दिन होता है।', en: 'As the earth spins, the side facing the sun has day and the other side has night.' }
        },
        {
          text: { hi: 'भारत के अधिकतर हिस्सों में कौन-सा मौसम बहुत गर्म होता है?', en: 'Which season is usually very hot in most parts of India?' },
          options: [
            { hi: 'सर्दी', en: 'Winter' },
            { hi: 'वर्षा', en: 'Monsoon' },
            { hi: 'शरद', en: 'Autumn' },
            { hi: 'गर्मी', en: 'Summer' }
          ],
          answer: 3,
          hint: { hi: 'इस मौसम में दोपहर की धूप सबसे तेज़ होती है।', en: 'The afternoon sun is strongest in this season.' },
          explain: { hi: 'गर्मी में सूरज की धूप तेज़ होती है और दिन लंबे और गर्म होते हैं।', en: 'In summer the sun is strong and the days are long and hot.' }
        },
        {
          text: { hi: 'चाँद अपनी रोशनी खुद नहीं बनाता। वह किस तरह चमकता है?', en: 'The moon does not make its own light. How does it shine?' },
          options: [
            { hi: 'सूरज की रोशनी को परावर्तित करके', en: 'By reflecting sunlight' },
            { hi: 'आग जलाकर', en: 'By burning' },
            { hi: 'गर्मी बनाकर', en: 'By making heat' },
            { hi: 'हवा चलाकर', en: 'By blowing wind' }
          ],
          answer: 0,
          hint: { hi: 'चाँद सूरज की रोशनी को वापस भेजता है।', en: 'The moon sends back the light it gets from the sun.' },
          explain: { hi: 'चाँद सूरज की रोशनी को परावर्तित करता है, इसलिए वह हमें चमकता दिखता है।', en: 'The moon reflects sunlight, so it appears to shine at night.' }
        }
      ]
    }
  }
};
