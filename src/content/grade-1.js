export default {
  grade: 1,
  topics: {
    'maths-1': {
      subject: 'maths',
      title: { hi: 'संख्याएँ और गिनती 1 से 50 तक', en: 'Numbers and counting 1 to 50' },
      questions: [
        {
          text: {
            hi: 'आम की टोकरी में आम एक लाइन में रखे हैं। उन्हें 1 से शुरू करके गिनो। अगर लाइन 20 पर खत्म होती है, तो कुल कितने आम हैं?',
            en: 'Mangoes are placed in a row in a basket. Count them starting from 1. If the row ends at 20, how many mangoes are there?'
          },
          options: [
            { hi: '18', en: '18' },
            { hi: '19', en: '19' },
            { hi: '20', en: '20' },
            { hi: '21', en: '21' }
          ],
          answer: 2,
          hint: { hi: 'एक-एक करके हर आम पर उँगली रखकर गिनो।', en: 'Touch each mango with your finger as you count.' },
          explain: { hi: 'गिनती 1, 2, 3 करते हुए 20 तक जाती है, इसलिए कुल 20 आम हैं।', en: 'Counting goes 1, 2, 3 up to 20, so there are 20 mangoes.' }
        },
        {
          text: {
            hi: 'संख्या 27 के ठीक बाद कौन-सी संख्या आती है?',
            en: 'Which number comes right after 27?'
          },
          options: [
            { hi: '26', en: '26' },
            { hi: '28', en: '28' },
            { hi: '29', en: '29' },
            { hi: '37', en: '37' }
          ],
          answer: 1,
          hint: { hi: 'गिनती में 27 से एक कदम आगे देखो।', en: 'Look one step ahead of 27 when counting.' },
          explain: { hi: 'किसी संख्या के बाद वाली संख्या उसमें 1 जोड़कर मिलती है। 27 + 1 = 28।', en: 'The number after another is one more. 27 + 1 = 28.' }
        },
        {
          text: {
            hi: 'किराने की दुकान पर 35 बिस्कुट के पैकेट हैं। दस-दस के गट्ठे बनाओ। कितने पूरे दहाई के गट्ठे बनेंगे?',
            en: 'A kirana shop has 35 biscuit packets. Make bundles of ten. How many full bundles of ten can you make?'
          },
          options: [
            { hi: '2', en: '2' },
            { hi: '3', en: '3' },
            { hi: '5', en: '5' },
            { hi: '35', en: '35' }
          ],
          answer: 1,
          hint: { hi: 'दस-दस गिनकर गट्ठे बनाओ।', en: 'Count in tens to make the bundles.' },
          explain: { hi: 'संख्या 35 में 3 दहाई और 5 इकाई हैं, यानी 3 पूरे गट्ठे।', en: 'In 35 there are 3 tens and 5 ones, so 3 full bundles.' }
        }
      ]
    },
    'maths-2': {
      subject: 'maths',
      title: { hi: '20 तक जोड़ (चित्र और वस्तुओं से)', en: 'Addition within 20 with pictures and objects' },
      questions: [
        {
          text: {
            hi: 'स्कूल बैग में 6 पेंसिल हैं। माँ 5 पेंसिल और रखती हैं। अब कुल कितनी पेंसिल हैं?',
            en: 'A school bag has 6 pencils. Mother adds 5 more pencils. How many pencils are there now?'
          },
          options: [
            { hi: '10', en: '10' },
            { hi: '11', en: '11' },
            { hi: '12', en: '12' },
            { hi: '13', en: '13' }
          ],
          answer: 1,
          hint: { hi: '6 से शुरू करो और आगे 5 गिनो।', en: 'Start at 6 and count 5 more.' },
          explain: { hi: 'जोड़ का मतलब है दो समूहों को मिलाना। 6 + 5 = 11।', en: 'Addition joins two groups. 6 + 5 = 11.' }
        },
        {
          text: {
            hi: 'क्रिकेट की गेंद के लिए 8 बच्चे लाइन में खड़े हैं। 7 बच्चे और आ गए। अब कुल कितने बच्चे हैं?',
            en: 'Eight children stand in a line to bowl. Seven more children join. How many children are there in all?'
          },
          options: [
            { hi: '14', en: '14' },
            { hi: '15', en: '15' },
            { hi: '16', en: '16' },
            { hi: '17', en: '17' }
          ],
          answer: 1,
          hint: { hi: 'दोनों समूहों के बच्चों को मिलाकर गिनो।', en: 'Put both groups together and count them.' },
          explain: { hi: '8 + 7 = 15। बड़ी संख्या से शुरू करके छोटी संख्या जोड़ना भी आसान होता है।', en: '8 + 7 = 15. Starting from the bigger number makes it easier.' }
        },
        {
          text: {
            hi: 'रमा के पास 9 चूड़ियाँ हैं। उसकी सहेली 4 चूड़ियाँ लाई। दोनों के पास मिलाकर कितनी चूड़ियाँ हैं?',
            en: 'Rama has 9 bangles. Her friend brings 4 more. How many bangles do they have together?'
          },
          options: [
            { hi: '11', en: '11' },
            { hi: '12', en: '12' },
            { hi: '13', en: '13' },
            { hi: '14', en: '14' }
          ],
          answer: 2,
          hint: { hi: '9 के बाद 4 कदम आगे गिनो।', en: 'After 9, count four steps forward.' },
          explain: { hi: '9 + 4 = 13। दस तक पहुँचने के लिए 9 में 1 जोड़ो, फिर बाकी 3 जोड़ो।', en: '9 + 4 = 13. Add 1 to reach 10, then add the remaining 3.' }
        }
      ]
    },
    'maths-3': {
      subject: 'maths',
      title: { hi: 'आसपास की आकृतियाँ', en: 'Shapes around us' },
      questions: [
        {
          text: {
            hi: 'घड़ी का चेहरा या गोल रोटी किस आकार जैसा दिखता है?',
            en: 'Which shape does a clock face or a round roti look like?'
          },
          options: [
            { hi: 'त्रिभुज', en: 'Triangle' },
            { hi: 'वृत्त (गोला)', en: 'Circle' },
            { hi: 'आयत', en: 'Rectangle' },
            { hi: 'वर्ग', en: 'Square' }
          ],
          answer: 1,
          hint: { hi: 'इस आकृति में कोई कोना नहीं होता।', en: 'This shape has no corners at all.' },
          explain: { hi: 'वृत्त गोल होता है और उसके कोने नहीं होते। घड़ी और रोटी अक्सर ऐसी ही दिखती हैं।', en: 'A circle is round with no corners. Clocks and rotis often look like this.' }
        },
        {
          text: {
            hi: 'किताब के ऊपर के हिस्से को देखो। उसके चार कोने हैं, चार सीधी भुजाएँ हैं, और सभी भुजाएँ बराबर हैं। यह कौन-सी आकृति है?',
            en: 'Look at the top of a small square tile. It has four corners and four straight sides, and all sides are equal. Which shape is it?'
          },
          options: [
            { hi: 'वर्ग', en: 'Square' },
            { hi: 'वृत्त', en: 'Circle' },
            { hi: 'त्रिभुज', en: 'Triangle' },
            { hi: 'आयत', en: 'Rectangle' }
          ],
          answer: 0,
          hint: { hi: 'चार बराबर भुजाओं वाली आकृति याद करो।', en: 'Think of a shape with four equal sides.' },
          explain: { hi: 'वर्ग की चारों भुजाएँ बराबर होती हैं। आयत की दो लंबी और दो छोटी भुजाएँ होती हैं।', en: 'A square has four equal sides. A rectangle has two long and two short sides.' }
        },
        {
          text: {
            hi: 'समोसे का तिकोना टुकड़ा किस आकृति जैसा दिखता है?',
            en: 'Which shape does a triangular samosa piece look like?'
          },
          options: [
            { hi: 'वृत्त', en: 'Circle' },
            { hi: 'वर्ग', en: 'Square' },
            { hi: 'आयत', en: 'Rectangle' },
            { hi: 'त्रिभुज', en: 'Triangle' }
          ],
          answer: 3,
          hint: { hi: 'इसके केवल तीन कोने होते हैं।', en: 'This shape has only three corners.' },
          explain: { hi: 'त्रिभुज में तीन भुजाएँ और तीन कोने होते हैं।', en: 'A triangle has three sides and three corners.' }
        }
      ]
    },
    'maths-4': {
      subject: 'maths',
      title: { hi: 'लंबा, छोटा, भारी, हल्का', en: 'Longer, shorter, heavier, lighter' },
      questions: [
        {
          text: {
            hi: 'रीना की पेंसिल 10 सेंटीमीटर की है और उसकी सहेली की पेंसिल 6 सेंटीमीटर की। किसकी पेंसिल छोटी है?',
            en: 'Reena has a pencil of 10 cm. Her friend has one of 6 cm. Whose pencil is shorter?'
          },
          options: [
            { hi: 'रीना की', en: 'Reena\'s' },
            { hi: 'सहेली की', en: 'Friend\'s' },
            { hi: 'दोनों बराबर', en: 'Both are equal' },
            { hi: 'बताया नहीं जा सकता', en: 'Cannot tell' }
          ],
          answer: 1,
          hint: { hi: 'कम संख्या वाली लंबाई छोटी होती है।', en: 'The smaller number means the shorter length.' },
          explain: { hi: '6 सेंटीमीटर, 10 सेंटीमीटर से छोटा है, इसलिए सहेली की पेंसिल छोटी है।', en: '6 cm is less than 10 cm, so the friend\'s pencil is shorter.' }
        },
        {
          text: {
            hi: 'तराज़ू के एक पलड़े में आम है और दूसरे में ईंट। ईंट वाला पलड़ा नीचे जाता है। कौन-सी चीज़ भारी है?',
            en: 'On a balance, one pan holds a mango and the other holds a brick. The brick pan goes down. Which object is heavier?'
          },
          options: [
            { hi: 'आम', en: 'Mango' },
            { hi: 'ईंट', en: 'Brick' },
            { hi: 'दोनों बराबर', en: 'Both are equal' },
            { hi: 'पता नहीं', en: 'Not known' }
          ],
          answer: 1,
          hint: { hi: 'जो पलड़ा नीचे जाता है, उसमें चीज़ भारी होती है।', en: 'The pan that goes down holds the heavier object.' },
          explain: { hi: 'जिस तरफ़ का पलड़ा नीचे जाता है, वहाँ की चीज़ भारी होती है। यहाँ ईंट भारी है।', en: 'The side that goes down is heavier. Here the brick is heavier.' }
        },
        {
          text: {
            hi: 'भरे हुए स्कूल बैग और खाली पानी की छोटी बोतल में से कौन-सी चीज़ हल्की है?',
            en: 'Between a full school bag and an empty small water bottle, which is lighter?'
          },
          options: [
            { hi: 'स्कूल बैग', en: 'School bag' },
            { hi: 'खाली बोतल', en: 'Empty bottle' },
            { hi: 'दोनों एक जैसे', en: 'Both are the same' },
            { hi: 'कुछ नहीं', en: 'Neither' }
          ],
          answer: 1,
          hint: { hi: 'जो चीज़ उठाने में आसान लगे, वह हल्की होती है।', en: 'The thing that is easier to lift is lighter.' },
          explain: { hi: 'भरा हुआ बैग भारी होता है और खाली बोतल हल्की होती है।', en: 'A full bag is heavy and an empty bottle is light.' }
        }
      ]
    },
    'science-1': {
      subject: 'science',
      title: { hi: 'आसपास के पौधे और जानवर', en: 'Plants and animals around us' },
      questions: [
        {
          text: {
            hi: 'इनमें से कौन-सा जीव है जो हमारे आसपास चलता-फिरता है?',
            en: 'Which of these is a living animal that moves around us?'
          },
          options: [
            { hi: 'आम का पेड़', en: 'Mango tree' },
            { hi: 'गाय', en: 'Cow' },
            { hi: 'गुलाब का फूल', en: 'Rose flower' },
            { hi: 'घास', en: 'Grass' }
          ],
          answer: 1,
          hint: { hi: 'जो चलता है और दूध देता है, उसे पहचानो।', en: 'Pick the one that walks around and gives milk.' },
          explain: { hi: 'जानवर चलते-फिरते हैं और खाना खाते हैं। गाय एक जानवर है, जबकि पेड़ और फूल पौधे हैं।', en: 'Animals move and eat food. A cow is an animal, while trees and flowers are plants.' }
        },
        {
          text: {
            hi: 'पौधों को जीने के लिए सबसे ज़्यादा किन दो चीज़ों की ज़रूरत होती है?',
            en: 'Which two things do plants need most to stay alive?'
          },
          options: [
            { hi: 'पानी और धूप', en: 'Water and sunlight' },
            { hi: 'चॉक और कागज़', en: 'Chalk and paper' },
            { hi: 'प्लास्टिक और रबर', en: 'Plastic and rubber' },
            { hi: 'कंकड़ और कपड़ा', en: 'Pebble and cloth' }
          ],
          answer: 0,
          hint: { hi: 'हरे पौधे को जड़ों से पानी और पत्तियों पर धूप चाहिए।', en: 'Green plants need water through roots and sunlight on leaves.' },
          explain: { hi: 'पौधे पानी और धूप से अपना भोजन बनाते हैं और बढ़ते हैं।', en: 'Plants use water and sunlight to make their own food and grow.' }
        },
        {
          text: {
            hi: 'कौन-सी छोटी चिड़िया पंखों से उड़ती है और घरों के आसपास चहचहाती है?',
            en: 'Which small bird flies with wings and chirps near our houses?'
          },
          options: [
            { hi: 'कुत्ता', en: 'Dog' },
            { hi: 'बकरी', en: 'Goat' },
            { hi: 'गौरैया', en: 'Sparrow' },
            { hi: 'मछली', en: 'Fish' }
          ],
          answer: 2,
          hint: { hi: 'यह छोटी चिड़िया घरों के आसपास अक्सर दिखती है।', en: 'This small bird is often seen near homes.' },
          explain: { hi: 'गौरैया एक छोटी चिड़िया है जो पंखों से उड़ती है। कुत्ता और बकरी चलते हैं और मछली पानी में तैरती है।', en: 'A sparrow is a small bird that flies with wings. Dogs and goats walk, and fish swim.' }
        }
      ]
    },
    'science-2': {
      subject: 'science',
      title: { hi: 'हमारा शरीर और पाँच इंद्रियाँ', en: 'Our body and five senses' },
      questions: [
        {
          text: {
            hi: 'फूल की खुशबू हम किस अंग से महसूस करते हैं?',
            en: 'Which body part helps us smell a flower?'
          },
          options: [
            { hi: 'आँख', en: 'Eyes' },
            { hi: 'नाक', en: 'Nose' },
            { hi: 'कान', en: 'Ears' },
            { hi: 'जीभ', en: 'Tongue' }
          ],
          answer: 1,
          hint: { hi: 'साँस लेते समय हवा के साथ खुशबू यही अंग लेता है।', en: 'This part takes in the smell of air when we breathe.' },
          explain: { hi: 'नाक से हम खुशबू और बदबू पहचानते हैं। यह सूँघने की इंद्रिय है।', en: 'The nose helps us smell. Smell is one of the five senses.' }
        },
        {
          text: {
            hi: 'मंदिर की घंटी बजी। हमने उसकी आवाज़ किस अंग से सुनी?',
            en: 'A temple bell rings. Which body part do we use to hear it?'
          },
          options: [
            { hi: 'हाथ', en: 'Hands' },
            { hi: 'पैर', en: 'Feet' },
            { hi: 'कान', en: 'Ears' },
            { hi: 'बाल', en: 'Hair' }
          ],
          answer: 2,
          hint: { hi: 'सुनने का काम इसी अंग का है।', en: 'This part is used for listening.' },
          explain: { hi: 'कान से हम आवाज़ सुनते हैं। सुनना भी पाँच इंद्रियों में से एक है।', en: 'We hear sounds with our ears. Hearing is one of the five senses.' }
        },
        {
          text: {
            hi: 'गुड़ या नींबू का स्वाद हम किस अंग से पहचानते हैं?',
            en: 'Which body part helps us taste jaggery or lemon?'
          },
          options: [
            { hi: 'जीभ', en: 'Tongue' },
            { hi: 'नाक', en: 'Nose' },
            { hi: 'आँख', en: 'Eyes' },
            { hi: 'कोहनी', en: 'Elbow' }
          ],
          answer: 0,
          hint: { hi: 'मीठा, खट्टा और नमकीन इसी से पता चलता है।', en: 'We know sweet, sour and salty with this part.' },
          explain: { hi: 'जीभ से हम स्वाद पहचानते हैं। मीठा, खट्टा और नमकीन स्वाद जीभ से महसूस होते हैं।', en: 'The tongue helps us taste. Sweet, sour and salty are known through the tongue.' }
        }
      ]
    },
    'science-3': {
      subject: 'science',
      title: { hi: 'हम जो खाते हैं और जो पानी पीते हैं', en: 'Food we eat and water we drink' },
      questions: [
        {
          text: {
            hi: 'गेहूँ के आटे से बनने वाली कौन-सी चीज़ हम रोज़ खाते हैं और जो शरीर को ऊर्जा देती है?',
            en: 'Which food made from wheat flour do we eat every day for energy?'
          },
          options: [
            { hi: 'रोटी', en: 'Roti' },
            { hi: 'पत्थर', en: 'Stone' },
            { hi: 'मिट्टी', en: 'Mud' },
            { hi: 'लकड़ी', en: 'Wood' }
          ],
          answer: 0,
          hint: { hi: 'यह गेहूँ के आटे से बनती है और गरम तवे पर पकती है।', en: 'It is made from wheat flour and cooked on a hot tawa.' },
          explain: { hi: 'रोटी अनाज से बनती है और शरीर को ऊर्जा देती है। पत्थर, मिट्टी और लकड़ी खाने की चीज़ें नहीं हैं।', en: 'Roti is made from grain and gives the body energy. Stone, mud and wood are not food.' }
        },
        {
          text: {
            hi: 'हमें साफ़ पानी क्यों पीना चाहिए?',
            en: 'Why should we drink clean water?'
          },
          options: [
            { hi: 'ताकि हम बीमार न हों', en: 'So that we do not get sick' },
            { hi: 'ताकि पानी रंगीन दिखे', en: 'So that water looks coloured' },
            { hi: 'ताकि पानी जल्दी खत्म हो', en: 'So that water finishes fast' },
            { hi: 'ताकि पानी गर्म हो', en: 'So that water becomes hot' }
          ],
          answer: 0,
          hint: { hi: 'गंदा पानी पेट में तकलीफ़ कर सकता है।', en: 'Dirty water can upset our stomach.' },
          explain: { hi: 'साफ़ पानी से कीटाणु नहीं फैलते और हम स्वस्थ रहते हैं।', en: 'Clean water keeps germs away, so we stay healthy.' }
        },
        {
          text: {
            hi: 'दूध को जमाकर कौन-सी खट्टी चीज़ बनती है, जिसे हम चावल या रोटी के साथ खाते हैं?',
            en: 'Which sour food is made by setting milk, and is eaten with rice or roti?'
          },
          options: [
            { hi: 'दही', en: 'Curd' },
            { hi: 'चावल', en: 'Rice' },
            { hi: 'कंकड़', en: 'Pebble' },
            { hi: 'कपड़ा', en: 'Cloth' }
          ],
          answer: 0,
          hint: { hi: 'जमाया हुआ दूध, जो हल्का खट्टा होता है।', en: 'It is set milk that tastes slightly sour.' },
          explain: { hi: 'दही दूध को जमाकर बनता है। दूध से मक्खन और पनीर भी बनते हैं।', en: 'Curd is made by setting milk. Butter and paneer are also made from milk.' }
        }
      ]
    },
    'science-4': {
      subject: 'science',
      title: { hi: 'हमारा घर, परिवार और आस-पड़ोस', en: 'Our home, family and neighbourhood' },
      questions: [
        {
          text: {
            hi: 'घर में खाना बनाने की जगह को क्या कहते हैं, जहाँ बर्तन भी धोए जाते हैं?',
            en: 'What do we call the place at home where food is cooked and utensils are washed?'
          },
          options: [
            { hi: 'रसोईघर', en: 'Kitchen' },
            { hi: 'छत', en: 'Roof' },
            { hi: 'कमरे की दीवार', en: 'Room wall' },
            { hi: 'दरवाज़ा', en: 'Door' }
          ],
          answer: 0,
          hint: { hi: 'यहीं चूल्हा या गैस होती है।', en: 'The stove or gas burner is found here.' },
          explain: { hi: 'रसोईघर में खाना बनता है और बर्तन भी वहीं धोए जाते हैं। यह घर का एक ज़रूरी हिस्सा है।', en: 'Food is cooked in the kitchen and utensils are washed there. It is an important part of the home.' }
        },
        {
          text: {
            hi: 'मोहल्ले में कौन-सी दुकान हमें रोज़ के सामान जैसे दाल, चीनी और तेल देती है?',
            en: 'Which shop in the neighbourhood gives us daily items like dal, sugar and oil?'
          },
          options: [
            { hi: 'किराना दुकान', en: 'Kirana shop' },
            { hi: 'तालाब', en: 'Pond' },
            { hi: 'पहाड़', en: 'Hill' },
            { hi: 'जंगल', en: 'Forest' }
          ],
          answer: 0,
          hint: { hi: 'वहाँ से हम घर के लिए राशन खरीदते हैं।', en: 'We buy household groceries from this place.' },
          explain: { hi: 'किराना दुकान में दाल, चीनी और तेल जैसी रोज़ की चीज़ें मिलती हैं।', en: 'A kirana shop sells daily items like dal, sugar and oil.' }
        },
        {
          text: {
            hi: 'परिवार के लोग एक-दूसरे की मदद करते हैं। यह किस बात का उदाहरण है?',
            en: 'Family members help each other. What is this an example of?'
          },
          options: [
            { hi: 'मिल-जुलकर रहना', en: 'Living together with care' },
            { hi: 'अकेले खेलना', en: 'Playing alone' },
            { hi: 'घर छोड़ना', en: 'Leaving home' },
            { hi: 'सामान तोड़ना', en: 'Breaking things' }
          ],
          answer: 0,
          hint: { hi: 'जब सब मिलकर काम करते हैं, तो घर अच्छा लगता है।', en: 'A home feels good when everyone works together.' },
          explain: { hi: 'परिवार में सब एक-दूसरे का साथ देते हैं। इसी को मिल-जुलकर रहना कहते हैं।', en: 'In a family everyone supports each other. This is called living together with care.' }
        }
      ]
    }
  }
};
