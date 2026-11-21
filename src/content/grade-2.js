export default {
  grade: 2,
  topics: {
    'maths-1': {
      subject: 'maths',
      title: { hi: 'सौ तक की संख्याएँ और स्थानीय मान', en: 'Numbers up to 100 and place value' },
      questions: [
        {
          text: {
            hi: '45 में दहाई का अंक कितना है?',
            en: 'In 45, what is the tens digit?'
          },
          options: [
            { hi: '4', en: '4' },
            { hi: '5', en: '5' },
            { hi: '9', en: '9' },
            { hi: '45', en: '45' }
          ],
          answer: 0,
          hint: {
            hi: 'दहाई वाला अंक बाईं ओर होता है।',
            en: 'The tens digit is the one on the left.'
          },
          explain: {
            hi: '45 में 4 दहाई और 5 इकाई हैं, इसलिए दहाई का अंक 4 है।',
            en: '45 has 4 tens and 5 ones, so the tens digit is 4.'
          }
        },
        {
          text: {
            hi: 'मीना के पास 7 डिब्बे हैं, हर डिब्बे में 10 कंचे हैं और 3 अलग कंचे हैं। कुल कितने कंचे हुए?',
            en: 'Meena has 7 boxes with 10 marbles each and 3 loose marbles. How many marbles in all?'
          },
          options: [
            { hi: '37', en: '37' },
            { hi: '73', en: '73' },
            { hi: '10', en: '10' },
            { hi: '703', en: '703' }
          ],
          answer: 1,
          hint: {
            hi: 'पहले डिब्बों के कंचे गिनो, फिर अलग कंचे जोड़ो।',
            en: 'Count the boxes first, then add the loose marbles.'
          },
          explain: {
            hi: '7 दहाई यानी 70, और 3 इकाई जोड़ने पर 73 होता है।',
            en: '7 tens are 70, and adding 3 ones gives 73.'
          }
        },
        {
          text: {
            hi: 'किस संख्या में 8 दहाई और 0 इकाई है?',
            en: 'Which number has 8 tens and 0 ones?'
          },
          options: [
            { hi: '8', en: '8' },
            { hi: '80', en: '80' },
            { hi: '808', en: '808' },
            { hi: '18', en: '18' }
          ],
          answer: 1,
          hint: {
            hi: 'दहाई को दस-दस के समूह समझो।',
            en: 'Think of tens as groups of ten.'
          },
          explain: {
            hi: '8 दहाई का मतलब 8 गुणा 10, यानी 80 होता है।',
            en: '8 tens means 8 groups of ten, which is 80.'
          }
        }
      ]
    },
    'maths-2': {
      subject: 'maths',
      title: { hi: 'सौ तक का जोड़ और घटाना', en: 'Addition and subtraction up to 100' },
      questions: [
        {
          text: {
            hi: 'रवि के पास 23 पेंसिल थीं। उसे 14 और पेंसिल मिलीं। अब उसके पास कितनी पेंसिल हैं?',
            en: 'Ravi had 23 pencils. He got 14 more. How many pencils does he have now?'
          },
          options: [
            { hi: '37', en: '37' },
            { hi: '36', en: '36' },
            { hi: '47', en: '47' },
            { hi: '9', en: '9' }
          ],
          answer: 0,
          hint: {
            hi: 'दहाई में दहाई और इकाई में इकाई जोड़ो।',
            en: 'Add tens to tens and ones to ones.'
          },
          explain: {
            hi: '20 और 10 मिलकर 30 होते हैं, और 3 और 4 मिलकर 7, तो कुल 37।',
            en: 'Tens: 20 + 10 = 30. Ones: 3 + 4 = 7. Total 37.'
          }
        },
        {
          text: {
            hi: 'एक दुकान में 58 आम थे। 25 आम बिक गए। कितने आम बचे?',
            en: 'A shop had 58 mangoes. 25 were sold. How many are left?'
          },
          options: [
            { hi: '33', en: '33' },
            { hi: '83', en: '83' },
            { hi: '23', en: '23' },
            { hi: '34', en: '34' }
          ],
          answer: 0,
          hint: {
            hi: 'बचे हुए आम गिनने के लिए बड़ी संख्या से छोटी घटाओ।',
            en: 'To find what is left, subtract the sold mangoes from the total.'
          },
          explain: {
            hi: '58 में से 25 घटाने पर 33 बचते हैं: 50 - 20 = 30 और 8 - 5 = 3।',
            en: '58 minus 25: 50 - 20 = 30 and 8 - 5 = 3, so 33 are left.'
          }
        },
        {
          text: {
            hi: 'सीता ने 40 गुब्बारे खरीदे थे। उसने 12 गुब्बारे फोड़ दिए। अब कितने गुब्बारे बचे?',
            en: 'Sita bought 40 balloons. 12 burst. How many balloons are left?'
          },
          options: [
            { hi: '28', en: '28' },
            { hi: '52', en: '52' },
            { hi: '38', en: '38' },
            { hi: '22', en: '22' }
          ],
          answer: 0,
          hint: {
            hi: 'पहले दहाई घटाओ, फिर इकाई।',
            en: 'Subtract the tens first, then the ones.'
          },
          explain: {
            hi: '40 - 10 = 30, और 30 - 2 = 28। इसलिए 28 गुब्बारे बचे।',
            en: '40 - 10 = 30, then 30 - 2 = 28. So 28 balloons are left.'
          }
        }
      ]
    },
    'maths-3': {
      subject: 'maths',
      title: { hi: 'पैटर्न और छलांग में गिनती (2, 5, 10)', en: 'Patterns and skip counting (2s, 5s, 10s)' },
      questions: [
        {
          text: {
            hi: 'पैटर्न पूरा करो: 2, 4, 6, __, 10',
            en: 'Complete the pattern: 2, 4, 6, __, 10'
          },
          options: [
            { hi: '7', en: '7' },
            { hi: '9', en: '9' },
            { hi: '8', en: '8' },
            { hi: '5', en: '5' }
          ],
          answer: 2,
          hint: {
            hi: 'हर बार कितने जुड़ रहे हैं, यह देखो।',
            en: 'Check how much is added each time.'
          },
          explain: {
            hi: 'हर बार 2 जुड़ रहे हैं, इसलिए 6 के बाद 8 आएगा।',
            en: 'Each step adds 2, so after 6 comes 8.'
          }
        },
        {
          text: {
            hi: 'अगर 5 रुपये के सिक्के गिने जाएँ, तो 5, 10, 15, __ में अगला अंक क्या होगा?',
            en: 'Counting in 5s: 5, 10, 15, __. What comes next?'
          },
          options: [
            { hi: '16', en: '16' },
            { hi: '25', en: '25' },
            { hi: '20', en: '20' },
            { hi: '18', en: '18' }
          ],
          answer: 2,
          hint: {
            hi: 'हर बार 5 जोड़ो।',
            en: 'Add 5 each time.'
          },
          explain: {
            hi: '15 में 5 जोड़ने पर 20 आता है।',
            en: 'Adding 5 to 15 gives 20.'
          }
        },
        {
          text: {
            hi: 'एक थाली में 10 लड्डू हैं। 3 थाली में कुल कितने लड्डू होंगे?',
            en: 'One plate has 10 laddoos. How many laddoos are on 3 plates?'
          },
          options: [
            { hi: '13', en: '13' },
            { hi: '3', en: '3' },
            { hi: '30', en: '30' },
            { hi: '300', en: '300' }
          ],
          answer: 2,
          hint: {
            hi: '10, 20, 30 की तरह दस-दस गिनो।',
            en: 'Count in tens: 10, 20, 30.'
          },
          explain: {
            hi: '10 की छलांग में तीन बार गिनने पर 30 आता है।',
            en: 'Counting in tens three times gives 30.'
          }
        }
      ]
    },
    'maths-4': {
      subject: 'maths',
      title: { hi: 'पैसे: रुपये, पैसे और सरल खरीदारी', en: 'Money: rupees, paise and simple shopping' },
      questions: [
        {
          text: {
            hi: 'एक 10 रुपये का नोट और एक 5 रुपये का सिक्का हो, तो कुल कितने रुपये हुए?',
            en: 'You have one 10 rupee note and one 5 rupee coin. How much money is that?'
          },
          options: [
            { hi: '10 रुपये', en: '10 rupees' },
            { hi: '15 रुपये', en: '15 rupees' },
            { hi: '5 रुपये', en: '5 rupees' },
            { hi: '105 रुपये', en: '105 rupees' }
          ],
          answer: 1,
          hint: {
            hi: 'नोट और सिक्के की रकम जोड़ो।',
            en: 'Add the value of the note and the coin.'
          },
          explain: {
            hi: '10 और 5 मिलकर 15 रुपये होते हैं।',
            en: '10 and 5 together make 15 rupees.'
          }
        },
        {
          text: {
            hi: 'गीता के पास 20 रुपये हैं। उसे एक पेंसिल 8 रुपये की लेनी है। उसके पास कितने रुपये बचेंगे?',
            en: 'Geeta has 20 rupees. A pencil costs 8 rupees. How much will she have left?'
          },
          options: [
            { hi: '12 रुपये', en: '12 rupees' },
            { hi: '28 रुपये', en: '28 rupees' },
            { hi: '10 रुपये', en: '10 rupees' },
            { hi: '8 रुपये', en: '8 rupees' }
          ],
          answer: 0,
          hint: {
            hi: 'कुल रकम में से पेंसिल की कीमत घटाओ।',
            en: 'Subtract the pencil price from the money she has.'
          },
          explain: {
            hi: '20 में से 8 घटाने पर 12 रुपये बचते हैं।',
            en: '20 minus 8 leaves 12 rupees.'
          }
        },
        {
          text: {
            hi: 'एक रुपये में कितने पैसे होते हैं?',
            en: 'How many paise make one rupee?'
          },
          options: [
            { hi: '10 पैसे', en: '10 paise' },
            { hi: '50 पैसे', en: '50 paise' },
            { hi: '100 पैसे', en: '100 paise' },
            { hi: '25 पैसे', en: '25 paise' }
          ],
          answer: 2,
          hint: {
            hi: 'सौ पैसे को एक रुपया मानो।',
            en: 'Think of one rupee as one hundred paise.'
          },
          explain: {
            hi: 'एक रुपया बराबर होता है सौ पैसे के।',
            en: 'One rupee is equal to one hundred paise.'
          }
        }
      ]
    },
    'science-1': {
      subject: 'science',
      title: { hi: 'पौधे: भाग और बढ़ने के लिए ज़रूरी चीज़ें', en: 'Plants: parts and what they need to grow' },
      questions: [
        {
          text: {
            hi: 'पौधे की जड़ का मुख्य काम क्या है?',
            en: 'What is the main job of a plant root?'
          },
          options: [
            { hi: 'फूल बनाना', en: 'Making flowers' },
            { hi: 'पानी और खनिज लेना', en: 'Taking in water and minerals' },
            { hi: 'रंग बदलना', en: 'Changing colour' },
            { hi: 'हवा में उड़ना', en: 'Flying in the air' }
          ],
          answer: 1,
          hint: {
            hi: 'जड़ मिट्टी के अंदर रहती है।',
            en: 'The root stays inside the soil.'
          },
          explain: {
            hi: 'जड़ मिट्टी से पानी और खनिज सोखती है और पौधे को सहारा देती है।',
            en: 'Roots soak up water and minerals from the soil and hold the plant firmly.'
          }
        },
        {
          text: {
            hi: 'पौधों को बढ़ने के लिए इनमें से कौन सी चीज़ सबसे ज़रूरी नहीं है?',
            en: 'Which of these is NOT needed by a plant to grow?'
          },
          options: [
            { hi: 'धूप', en: 'Sunlight' },
            { hi: 'पानी', en: 'Water' },
            { hi: 'हवा', en: 'Air' },
            { hi: 'प्लास्टिक की थैली', en: 'A plastic bag' }
          ],
          answer: 3,
          hint: {
            hi: 'वह चीज़ चुनो जो प्रकृति से नहीं आती।',
            en: 'Pick the thing that does not come from nature.'
          },
          explain: {
            hi: 'पौधों को धूप, पानी और हवा चाहिए, प्लास्टिक नहीं।',
            en: 'Plants need sunlight, water and air, not plastic.'
          }
        },
        {
          text: {
            hi: 'पत्तियाँ पौधे के लिए क्या बनाती हैं?',
            en: 'What do leaves make for the plant?'
          },
          options: [
            { hi: 'मिट्टी', en: 'Soil' },
            { hi: 'भोजन', en: 'Food' },
            { hi: 'पत्थर', en: 'Stones' },
            { hi: 'बर्फ', en: 'Ice' }
          ],
          answer: 1,
          hint: {
            hi: 'धूप में पत्तियाँ हरी रहती हैं और कुछ बनाती हैं।',
            en: 'Leaves use sunlight to prepare something the plant eats.'
          },
          explain: {
            hi: 'पत्तियाँ धूप की मदद से पौधे का भोजन बनाती हैं।',
            en: 'Leaves use sunlight to make food for the plant.'
          }
        }
      ]
    },
    'science-2': {
      subject: 'science',
      title: { hi: 'जानवर: घर और भोजन', en: 'Animals: homes and what they eat' },
      questions: [
        {
          text: {
            hi: 'गाय किस तरह का भोजन खाती है?',
            en: 'What kind of food does a cow eat?'
          },
          options: [
            { hi: 'घास और चारा', en: 'Grass and fodder' },
            { hi: 'मछली', en: 'Fish' },
            { hi: 'मांस', en: 'Meat' },
            { hi: 'चॉकलेट', en: 'Chocolate' }
          ],
          answer: 0,
          hint: {
            hi: 'गाय खेत में चरती है।',
            en: 'A cow grazes in the field.'
          },
          explain: {
            hi: 'गाय पौधों को खाती है, जैसे घास और चारा।',
            en: 'A cow eats plants such as grass and fodder.'
          }
        },
        {
          text: {
            hi: 'चिड़िया अपना घर किससे बनाती है?',
            en: 'What does a bird use to build its nest?'
          },
          options: [
            { hi: 'तिनके और सूखी टहनियों से', en: 'Twigs and dry grass' },
            { hi: 'लोहे की चादर से', en: 'Iron sheets' },
            { hi: 'ईंट से', en: 'Bricks' },
            { hi: 'कांच से', en: 'Glass' }
          ],
          answer: 0,
          hint: {
            hi: 'पेड़ पर मिलने वाली चीज़ें सोचो।',
            en: 'Think of things found on trees.'
          },
          explain: {
            hi: 'चिड़िया तिनके और टहनियाँ जोड़कर घोंसला बनाती है।',
            en: 'Birds weave twigs and grass together to make a nest.'
          }
        },
        {
          text: {
            hi: 'शेर कैसे भोजन करता है?',
            en: 'What does a lion eat?'
          },
          options: [
            { hi: 'पत्ते', en: 'Leaves' },
            { hi: 'दूसरे जानवरों का मांस', en: 'Meat from other animals' },
            { hi: 'फल', en: 'Fruits' },
            { hi: 'अनाज', en: 'Grains' }
          ],
          answer: 1,
          hint: {
            hi: 'शेर मांसाहारी जानवर है।',
            en: 'A lion is a meat eating animal.'
          },
          explain: {
            hi: 'शेर दूसरे जानवरों को खाता है, इसलिए वह मांसाहारी है।',
            en: 'A lion hunts other animals, so it is a meat eater.'
          }
        }
      ]
    },
    'science-3': {
      subject: 'science',
      title: { hi: 'साफ़ पानी और अच्छी आदतें', en: 'Clean water and healthy habits' },
      questions: [
        {
          text: {
            hi: 'पीने के लिए कौन सा पानी सबसे अच्छा है?',
            en: 'Which water is best for drinking?'
          },
          options: [
            { hi: 'गंदे नाले का पानी', en: 'Dirty drain water' },
            { hi: 'उबला या साफ़ किया हुआ पानी', en: 'Boiled or filtered water' },
            { hi: 'तालाब में जमा कीचड़ वाला पानी', en: 'Muddy pond water' },
            { hi: 'बाल्टी में रखा पुराना पानी', en: 'Old water left in a bucket' }
          ],
          answer: 1,
          hint: {
            hi: 'साफ़ करने के बाद पानी पीना सुरक्षित होता है।',
            en: 'Water becomes safe after it is cleaned or boiled.'
          },
          explain: {
            hi: 'उबालने या छानने से पानी के कीटाणु कम हो जाते हैं।',
            en: 'Boiling or filtering removes germs from water.'
          }
        },
        {
          text: {
            hi: 'खाना खाने से पहले हाथ धोना क्यों ज़रूरी है?',
            en: 'Why is it important to wash hands before eating?'
          },
          options: [
            { hi: 'हाथ चमकदार रहें', en: 'So hands look shiny' },
            { hi: 'हाथों के कीटाणु हटें', en: 'To remove germs from hands' },
            { hi: 'खाना मीठा हो जाए', en: 'So food tastes sweet' },
            { hi: 'हाथ ठंडे रहें', en: 'So hands stay cold' }
          ],
          answer: 1,
          hint: {
            hi: 'हाथ धोने से बीमारी फैलने का खतरा कम होता है।',
            en: 'Washing lowers the chance of catching illness.'
          },
          explain: {
            hi: 'साबुन से हाथ धोने पर गंदगी और कीटाणु निकल जाते हैं।',
            en: 'Soap and water remove dirt and germs from our hands.'
          }
        },
        {
          text: {
            hi: 'बाहर से आने के बाद हमें क्या करना चाहिए?',
            en: 'What should we do after coming home from outside?'
          },
          options: [
            { hi: 'बिना हाथ धोए खाना खा लेना', en: 'Eat without washing hands' },
            { hi: 'साबुन से हाथ-पैर धोना', en: 'Wash hands and feet with soap' },
            { hi: 'कपड़े न बदलना', en: 'Not change clothes' },
            { hi: 'पानी पीने से मना करना', en: 'Refuse to drink water' }
          ],
          answer: 1,
          hint: {
            hi: 'सफ़ाई हमारी सेहत का ध्यान रखती है।',
            en: 'Cleanliness keeps us healthy.'
          },
          explain: {
            hi: 'बाहर की धूल और कीटाणु हटाने के लिए हाथ-पैर धोना अच्छा है।',
            en: 'Washing hands and feet removes dust and germs picked up outside.'
          }
        }
      ]
    },
    'science-4': {
      subject: 'science',
      title: { hi: 'त्योहार, समुदाय के सहायक और एक-दूसरे की मदद', en: 'Festivals, community helpers and helping each other' },
      questions: [
        {
          text: {
            hi: 'दीपावली को किस चीज़ का त्योहार माना जाता है?',
            en: 'Diwali is known as the festival of what?'
          },
          options: [
            { hi: 'रंगों का', en: 'Colours' },
            { hi: 'दीयों और रोशनी का', en: 'Lamps and light' },
            { hi: 'बर्फ़ का', en: 'Snow' },
            { hi: 'पतंग उड़ाने का', en: 'Kite flying' }
          ],
          answer: 1,
          hint: {
            hi: 'घरों में दीये जलाए जाते हैं।',
            en: 'Families light lamps in their homes.'
          },
          explain: {
            hi: 'दीपावली पर घरों और आँगन में दीये जलाकर रोशनी की जाती है।',
            en: 'On Diwali, homes are decorated with lamps and lights.'
          }
        },
        {
          text: {
            hi: 'बीमार होने पर हमारी मदद के लिए कौन जाता है?',
            en: 'Who helps us when we are sick?'
          },
          options: [
            { hi: 'डॉक्टर', en: 'Doctor' },
            { hi: 'धोबी', en: 'Washerman' },
            { hi: 'बढ़ई', en: 'Carpenter' },
            { hi: 'मोची', en: 'Cobbler' }
          ],
          answer: 0,
          hint: {
            hi: 'जो इलाज करता है, उसे सोचो।',
            en: 'Think of the person who treats illness.'
          },
          explain: {
            hi: 'डॉक्टर बीमारी का इलाज करते हैं और सेहत का ध्यान रखते हैं।',
            en: 'A doctor treats illness and helps us stay healthy.'
          }
        },
        {
          text: {
            hi: 'पड़ोसी संकट में हो तो हम क्या कर सकते हैं?',
            en: 'What can we do when a neighbour is in trouble?'
          },
          options: [
            { hi: 'मुँह फेर लेना', en: 'Turn away' },
            { hi: 'अनदेखा करके चले जाना', en: 'Ignore them and walk away' },
            { hi: 'मदद के लिए आगे आना', en: 'Come forward to help' },
            { hi: 'मज़ाक उड़ाना', en: 'Make fun of them' }
          ],
          answer: 2,
          hint: {
            hi: 'एक-दूसरे की मदद करना अच्छा है।',
            en: 'Helping each other is a good habit.'
          },
          explain: {
            hi: 'मुसीबत में साथ देना सबसे अच्छा व्यवहार है।',
            en: 'Standing by someone in need is the kind thing to do.'
          }
        }
      ]
    }
  }
};
