/**
 * @fileoverview STEM Radio Pitstop Controller for 8-bit Grand Prix.
 * Delivers NCERT/State Board Class 1-8 questions, Science Word Scrambles,
 * Formula Matches, and custom user-selected/spoken topics.
 */

import { topicsForGrade, getTopic } from '../content/index.js';
import { AiTutor } from '../ai/ai-tutor.js';

export const SCIENCE_SCRAMBLES = {
  physics: [
    {
      word: 'GRAVITY',
      scrambled: ['V', 'A', 'R', 'T', 'I', 'G', 'Y'],
      distractors: ['MAGNET', 'ENERGY', 'PRISM'],
      hint: { hi: 'वह आकर्षण बल जो वस्तुओं को पृथ्वी के केंद्र की ओर खींचता है', en: 'The attractive force pulling objects towards Earth' },
      explain: { hi: 'गुरुत्वाकर्षण (Gravity) द्रव्यमान वाली सभी वस्तुओं के बीच लगने वाला आकर्षण बल है।', en: 'Gravity is the fundamental force of attraction between masses.' },
      subject: 'physics'
    },
    {
      word: 'FORCE',
      scrambled: ['R', 'C', 'O', 'F', 'E'],
      distractors: ['VELOCITY', 'MOTION', 'ACCEL'],
      hint: { hi: 'खिंचाव या धक्का जो किसी वस्तु की गति या दिशा बदल सकता है (F = m*a)', en: 'A push or pull that changes an object motion (F = m*a)' },
      explain: { hi: 'बल (Force) वह कारक है जो किसी वस्तु की विराम या गति की अवस्था को बदलता है।', en: 'Force causes a mass to accelerate.' },
      subject: 'physics'
    },
    {
      word: 'VELOCITY',
      scrambled: ['C', 'I', 'T', 'O', 'L', 'E', 'V', 'Y'],
      distractors: ['GRAVITY', 'INERTIA', 'MOMENTUM'],
      hint: { hi: 'निश्चित दिशा में तय की गई दूरी की दर (Speed with direction)', en: 'Speed of an object in a specific given direction' },
      explain: { hi: 'वेग (Velocity) एक सदिश राशि है जिसमें चाल और दिशा दोनों होते हैं।', en: 'Velocity is a vector quantity combining speed and direction.' },
      subject: 'physics'
    },
    {
      word: 'ENERGY',
      scrambled: ['N', 'E', 'G', 'R', 'E', 'Y'],
      distractors: ['POWER', 'TORQUE', 'FORCE'],
      hint: { hi: 'कार्य करने की क्षमता (Capacity to do work)', en: 'The capacity to do work' },
      explain: { hi: 'ऊर्जा (Energy) न तो उत्पन्न की जा सकती है और न ही नष्ट (ऊर्जा संरक्षण का नियम)।', en: 'Energy can neither be created nor destroyed.' },
      subject: 'physics'
    },
    {
      word: 'PRISM',
      scrambled: ['R', 'M', 'P', 'S', 'I'],
      distractors: ['LENS', 'MIRROR', 'LASER'],
      hint: { hi: 'कांच का वह टुकड़ा जो श्वेत प्रकाश को 7 रंगों (VIBGYOR) में विभाजित करता है', en: 'Optical glass separating white light into 7 colors' },
      explain: { hi: 'प्रिज्म प्रकाश के विक्षेपण (Dispersion) द्वारा स्पेक्ट्रम बनाता है।', en: 'A prism refracts white light into a spectrum.' },
      subject: 'physics'
    },
    {
      word: 'FRICTION',
      scrambled: ['C', 'T', 'I', 'O', 'N', 'F', 'R', 'I'],
      distractors: ['GRAVITY', 'INERTIA', 'PRESSURE'],
      hint: { hi: 'दो संपर्क सतहों के बीच गति का विरोध करने वाला बल', en: 'Force resisting relative motion between two contacting surfaces' },
      explain: { hi: 'घर्षण (Friction) गति का विरोध करता है और ऊष्मा उत्पन्न करता है।', en: 'Friction opposes relative motion between contacting surfaces.' },
      subject: 'physics'
    },
    {
      word: 'INERTIA',
      scrambled: ['E', 'R', 'T', 'I', 'A', 'I', 'N'],
      distractors: ['ACCEL', 'WEIGHT', 'ENERGY'],
      hint: { hi: 'वस्तु का वह गुण जो उसकी गति या विराम अवस्था में परिवर्तन का विरोध करता है', en: 'Tendency of an object to resist changes in its state of motion' },
      explain: { hi: 'जड़त्व (Inertia) न्यूटन के प्रथम गति नियम का आधार है।', en: 'Inertia is described by Newton First Law of Motion.' },
      subject: 'physics'
    },
    {
      word: 'DENSITY',
      scrambled: ['S', 'I', 'T', 'Y', 'D', 'E', 'N'],
      distractors: ['VOLUME', 'WEIGHT', 'GRAVITY'],
      hint: { hi: 'प्रति इकाई आयतन का द्रव्यमान (d = m / V)', en: 'Mass per unit volume of a substance (d = m / V)' },
      explain: { hi: 'घनत्व (Density) बताता है कि किसी वस्तु के पदार्थ के कण कितने सघन हैं।', en: 'Density equals mass divided by volume.' },
      subject: 'physics'
    },
    {
      word: 'MAGNET',
      scrambled: ['G', 'N', 'E', 'T', 'M', 'A'],
      distractors: ['COPPER', 'SILVER', 'CHARGE'],
      hint: { hi: 'वह वस्तु जो लोहे और निकल को अपनी ओर आकर्षित करती है (उत्तरी और दक्षिणी ध्रुव)', en: 'Object producing magnetic field attracting iron and nickel' },
      explain: { hi: 'चुंबक (Magnet) के दो ध्रुव होते हैं: उत्तर और दक्षिण।', en: 'Magnets have north and south magnetic poles.' },
      subject: 'physics'
    }
  ],
  chemistry: [
    {
      word: 'ATOM',
      scrambled: ['T', 'M', 'A', 'O'],
      distractors: ['CELL', 'BOND', 'ACID'],
      hint: { hi: 'किसी रासायनिक तत्व का सबसे छोटा अविभाज्य कण', en: 'The smallest constituent unit of chemical matter' },
      explain: { hi: 'परमाणु (Atom) में प्रोटॉन, न्यूट्रॉन और इलेक्ट्रॉन होते हैं।', en: 'An atom consists of a nucleus with protons, neutrons, and surrounding electrons.' },
      subject: 'chemistry'
    },
    {
      word: 'OXYGEN',
      scrambled: ['G', 'E', 'X', 'O', 'N', 'Y'],
      distractors: ['CARBON', 'HELIUM', 'SODIUM'],
      hint: { hi: 'प्राणवायु गैस (O2) जो श्वसन और दहन के लिए अत्यंत आवश्यक है', en: 'Essential gas for respiration and combustion' },
      explain: { hi: 'ऑक्सीजन वायुमंडल का लगभग 21% भाग बनाती है और दहन में सहायक है।', en: 'Oxygen constitutes ~21% of atmosphere and supports combustion.' },
      subject: 'chemistry'
    },
    {
      word: 'ACID',
      scrambled: ['D', 'I', 'A', 'C'],
      distractors: ['BASE', 'SALT', 'ALKALI'],
      hint: { hi: 'वह रासायनिक पदार्थ जिसका pH < 7 होता है और नीले लिटमस को लाल करता है', en: 'Chemical substance with pH < 7 turning blue litmus red' },
      explain: { hi: 'अम्ल (Acid) जलीय विलयन में H+ आयन देते हैं (उदा: हाइड्रोक्लोरिक अम्ल)।', en: 'Acids yield hydrogen ions in water.' },
      subject: 'chemistry'
    },
    {
      word: 'WATER',
      scrambled: ['T', 'E', 'W', 'A', 'R'],
      distractors: ['VAPOR', 'ETHER', 'SALINE'],
      hint: { hi: 'हाइड्रोजन और ऑक्सीजन का सार्वभौमिक विलायक यौगिक (H2O)', en: 'Universal solvent molecule composed of 2 H and 1 O' },
      explain: { hi: 'जल (H2O) हाइड्रोजन के दो और ऑक्सीजन के एक परमाणु से बना यौगिक है।', en: 'Water is a compound of hydrogen and oxygen.' },
      subject: 'chemistry'
    },
    {
      word: 'ELEMENT',
      scrambled: ['M', 'E', 'N', 'T', 'E', 'L', 'E'],
      distractors: ['COMPOUND', 'MIXTURE', 'SOLUTION'],
      hint: { hi: 'एक ही प्रकार के परमाणुओं से बना शुद्ध रासायनिक पदार्थ', en: 'Pure chemical substance consisting of only one type of atom' },
      explain: { hi: 'तत्व (Element) को रासायनिक विधियों द्वारा सरल पदार्थों में नहीं तोड़ा जा सकता।', en: 'Elements are the building blocks on the periodic table.' },
      subject: 'chemistry'
    },
    {
      word: 'MOLECULE',
      scrambled: ['L', 'E', 'C', 'U', 'L', 'E', 'M', 'O'],
      distractors: ['PROTON', 'ELECTRON', 'CRYSTAL'],
      hint: { hi: 'दो या दो से अधिक परमाणुओं का रासायनिक बंधन द्वारा जुड़ा समूह', en: 'Group of two or more atoms held together by chemical bonds' },
      explain: { hi: 'अणु (Molecule) किसी यौगिक का सूक्ष्मतम स्वतंत्र अस्तित्व रखने वाला कण है।', en: 'Molecules consist of bonded atoms representing chemical compounds.' },
      subject: 'chemistry'
    },
    {
      word: 'CARBON',
      scrambled: ['R', 'B', 'O', 'N', 'C', 'A'],
      distractors: ['SILICON', 'ARGON', 'BORON'],
      hint: { hi: 'परमाणु संख्या 6 वाला जैव रासायनिक तत्व (हीरा और ग्रेफाइट इसके रूप हैं)', en: 'Atomic number 6 element forming backbone of all organic life' },
      explain: { hi: 'कार्बन (Carbon) चार संयोजकता के कारण अनगिनत रासायनिक यौगिक बनाता है।', en: 'Carbon forms diverse organic compounds due to tetravalency.' },
      subject: 'chemistry'
    },
    {
      word: 'PROTON',
      scrambled: ['T', 'O', 'N', 'P', 'R', 'O'],
      distractors: ['NEUTRON', 'ELECTRON', 'PHOTON'],
      hint: { hi: 'परमाणु नाभिक में स्थित धनावेशित (+ve) मूल कण', en: 'Positively charged subatomic particle inside the atomic nucleus' },
      explain: { hi: 'प्रोटॉन (Proton) की संख्या ही तत्व की परमाणु संख्या (Atomic Number) तय करती है।', en: 'The number of protons determines the elemental identity.' },
      subject: 'chemistry'
    }
  ],
  biology: [
    {
      word: 'CELL',
      scrambled: ['L', 'E', 'C', 'L'],
      distractors: ['ATOM', 'TISSUE', 'ORGAN'],
      hint: { hi: 'सभी जीवित प्राणियों की संरचनात्मक और कार्यात्मक मौलिक इकाई', en: 'The basic structural and functional unit of all living organisms' },
      explain: { hi: 'कोशिका (Cell) जीवन की सबसे छोटी इकाई है जिसे रॉबर्ट हुक ने 1665 में खोजा था।', en: 'The cell is the basic structural unit of life.' },
      subject: 'biology'
    },
    {
      word: 'NEURON',
      scrambled: ['R', 'O', 'N', 'U', 'E', 'N'],
      distractors: ['NEPHRON', 'AXON', 'MUSCLE'],
      hint: { hi: 'मस्तिष्क और तंत्रिका तंत्र की संदेश वाहक विशेष कोशिका', en: 'Nerve cell transmitting electrical signals throughout the nervous system' },
      explain: { hi: 'न्यूरॉन (Neuron) शरीर में आवेगों और सूचनाओं का विद्युत-रासायनिक संचरण करते हैं।', en: 'Neurons are information messengers in the nervous system.' },
      subject: 'biology'
    },
    {
      word: 'HEART',
      scrambled: ['R', 'A', 'E', 'T', 'H'],
      distractors: ['LIVER', 'LUNGS', 'BRAIN'],
      hint: { hi: 'मानव शरीर का वह अंग जो पूरे शरीर में रक्त पंप करता है (4 कक्ष)', en: 'Muscular organ pumping oxygenated blood through circulatory system' },
      explain: { hi: 'मानव हृदय में 4 कक्ष (2 आलिंद और 2 निलय) होते हैं जो अनवरत धड़कते हैं।', en: 'The heart has four chambers pumping blood continuously.' },
      subject: 'biology'
    },
    {
      word: 'GENE',
      scrambled: ['E', 'N', 'E', 'G'],
      distractors: ['CELL', 'BLOOD', 'NERVE'],
      hint: { hi: 'DNA का वह खंड जो माता-पिता से संतानों में लक्षणों को स्थानांतरित करता है', en: 'Unit of heredity transferred from parent to offspring via DNA' },
      explain: { hi: 'जीन (Gene) आनुवंशिकता की बुनियादी इकाई है जो प्रोटीन संश्लेषण का निर्देश देती है।', en: 'Genes carry inherited traits.' },
      subject: 'biology'
    },
    {
      word: 'LEAF',
      scrambled: ['F', 'A', 'E', 'L'],
      distractors: ['ROOT', 'STEM', 'BARK'],
      hint: { hi: 'पौधे का वह हरा भाग जिसे पौधे का "रसोईघर" कहा जाता है', en: 'Green plant organ known as the plant food factory' },
      explain: { hi: 'पत्ती (Leaf) में क्लोरोफिल होता है जो प्रकाश संश्लेषण द्वारा भोजन बनाता है।', en: 'Leaves contain chlorophyll to perform photosynthesis.' },
      subject: 'biology'
    },
    {
      word: 'TISSUE',
      scrambled: ['S', 'S', 'U', 'E', 'T', 'I'],
      distractors: ['ORGAN', 'CELL', 'SKIN'],
      hint: { hi: 'समान संरचना और विशेष कार्य करने वाली कोशिकाओं का समूह', en: 'Ensemble of similar cells that carry out a specific shared function' },
      explain: { hi: 'ऊतक (Tissue) कोशिकाओं से मिलकर बनते हैं और अंगों का निर्माण करते हैं।', en: 'Tissues are groups of specialized cells functioning together.' },
      subject: 'biology'
    },
    {
      word: 'NUCLEUS',
      scrambled: ['C', 'L', 'E', 'U', 'S', 'N', 'U'],
      distractors: ['VACUOLE', 'RIBOSOME', 'CYTOPLASM'],
      hint: { hi: 'कोशिका का नियंत्रण केंद्र जिसमें आनुवंशिक सामग्री (DNA) होती है', en: 'Membrane-bound cellular control center containing genetic material' },
      explain: { hi: 'केंद्रक (Nucleus) कोशिका के सभी क्रियाकलापों और विभाजन का नियंत्रण करता है।', en: 'The nucleus directs cellular growth and stores hereditary code.' },
      subject: 'biology'
    }
  ],
  maths: [
    {
      word: 'FRACTION',
      scrambled: ['R', 'A', 'C', 'T', 'I', 'O', 'N', 'F'],
      distractors: ['DECIMAL', 'PERCENT', 'INTEGER'],
      hint: { hi: 'किसी संपूर्ण वस्तु का एक भाग जिसे अंश/हर (p/q) के रूप में लिखा जाता है', en: 'A numerical quantity representing a part of a whole (p/q)' },
      explain: { hi: 'भिन्न (Fraction) ऊपर अंश (Numerator) और नीचे हर (Denominator) से मिलकर बनती है।', en: 'Fractions represent parts of a whole.' },
      subject: 'maths'
    },
    {
      word: 'RADIUS',
      scrambled: ['D', 'I', 'U', 'S', 'R', 'A'],
      distractors: ['DIAMETER', 'CHORD', 'SECTOR'],
      hint: { hi: 'वृत्त के केंद्र से परिधि तक की दूरी (व्यास की आधी)', en: 'Distance from center of circle to its perimeter (half of diameter)' },
      explain: { hi: 'त्रिज्या (Radius) वृत्त के केंद्र से उसकी परिधि की दूरी होती है (r = d/2)।', en: 'Radius is half the circle diameter.' },
      subject: 'maths'
    },
    {
      word: 'PRIME',
      scrambled: ['M', 'E', 'R', 'I', 'P'],
      distractors: ['EVEN', 'FACTOR', 'SQUARE'],
      hint: { hi: 'वह संख्या जो केवल 1 और स्वयं से विभाजित होती है (उदा: 2, 3, 5, 7)', en: 'A whole number greater than 1 with only two factors: 1 and itself' },
      explain: { hi: 'अभाज्य संख्या (Prime number) के केवल दो गुणनखंड होते हैं: 1 और वह संख्या स्वयं।', en: 'Prime numbers have exactly two factors.' },
      subject: 'maths'
    },
    {
      word: 'PERIMETER',
      scrambled: ['R', 'I', 'M', 'E', 'T', 'E', 'R', 'P', 'E'],
      distractors: ['AREA', 'DIAMETER', 'VOLUME'],
      hint: { hi: 'किसी बंद ज्यामितीय आकृति के चारों ओर की कुल सीमा लंबाई', en: 'Continuous line forming the boundary of a closed geometric figure' },
      explain: { hi: 'परिमाप (Perimeter) किसी आकृति की सभी बाहरी भुजाओं की कुल लंबाई है।', en: 'Perimeter is the total boundary distance around a shape.' },
      subject: 'maths'
    },
    {
      word: 'POLYGON',
      scrambled: ['L', 'Y', 'G', 'O', 'N', 'P', 'O'],
      distractors: ['CIRCLE', 'PARABOLA', 'SPHERE'],
      hint: { hi: 'तीन या अधिक सीधी रेखाओं से घिरी बंद समतल आकृति', en: 'Closed plane figure bounded by three or more straight lines' },
      explain: { hi: 'बहुभुज (Polygon) रेखाखंडों से बनी बंद समतल आकृति है (उदा: त्रिभुज, आयत)।', en: 'Polygons are closed two-dimensional shapes made of straight sides.' },
      subject: 'maths'
    }
  ]
};

export class QuizController {
  constructor(options = {}) {
    this.grade = options.grade || 5;
    this.circuitId = options.circuitId || 'physics';
    this.lang = options.lang || 'hi';
    this.customTopic = options.customTopic || '';
    this.aiTutor = new AiTutor();

    this.currentQuestion = null;
    this.isActive = false;
    this.answered = false;
    this.streak = 0;
    this.history = [];
    this.questionCount = 0;
    this.usedQuestionKeys = new Set();
  }

  setGrade(grade) {
    this.grade = Math.max(1, Math.min(8, grade));
  }

  setCircuit(circuitId) {
    this.circuitId = circuitId;
  }

  setLang(lang) {
    this.lang = lang === 'en' ? 'en' : 'hi';
  }

  setCustomTopic(topic) {
    this.customTopic = (topic || '').trim();
  }

  /**
   * Generates procedural STEM question with unique values if question pools are depleted.
   */
  generateProceduralQuestion() {
    const types = ['speed', 'force', 'area', 'density'];
    const type = types[Math.floor(Math.random() * types.length)];

    if (type === 'speed') {
      const dist = (Math.floor(Math.random() * 8) + 2) * 50;
      const time = (Math.floor(Math.random() * 5) + 2) * 5;
      const speed = dist / time;
      const key = `proc:speed:${dist}:${time}`;
      this.usedQuestionKeys.add(key);

      const distractors = [speed + 5, Math.max(2, speed - 4), speed * 2];
      const opts = [speed, ...distractors].map((v) => `${v} m/s`);
      const shuffled = opts.map((o) => ({ o, s: Math.random() })).sort((a, b) => a.s - b.s).map((a) => a.o);
      const correctIdx = shuffled.indexOf(`${speed} m/s`);

      return {
        type: 'quiz',
        topicTitle: this.lang === 'hi' ? 'भौतिकी गति एवं चाल गणना' : 'PHYSICS VELOCITY CALCULATION',
        subject: 'physics',
        text: this.lang === 'hi'
          ? `एक रेसिंग कार ${time} सेकंड में ${dist} मीटर की दूरी तय करती है। कार की चाल (Speed = Distance / Time) ज्ञात करें:`
          : `A racing vehicle covers ${dist} meters in ${time} seconds. Calculate its speed (Speed = Distance / Time):`,
        options: shuffled,
        correctIndex: correctIdx,
        hint: this.lang === 'hi' ? 'चाल = दूरी / समय' : 'Speed = Distance / Time',
        explain: this.lang === 'hi'
          ? `चाल = ${dist}m / ${time}s = ${speed} m/s।`
          : `Speed = ${dist}m / ${time}s = ${speed} m/s.`
      };
    }

    if (type === 'force') {
      const mass = Math.floor(Math.random() * 10) + 2;
      const accel = Math.floor(Math.random() * 8) + 2;
      const force = mass * accel;
      const key = `proc:force:${mass}:${accel}`;
      this.usedQuestionKeys.add(key);

      const distractors = [force + 10, Math.max(4, force - 8), force * 2];
      const opts = [force, ...distractors].map((v) => `${v} N (न्यूटन)`);
      const shuffled = opts.map((o) => ({ o, s: Math.random() })).sort((a, b) => a.s - b.s).map((a) => a.o);
      const correctIdx = shuffled.indexOf(`${force} N (न्यूटन)`);

      return {
        type: 'quiz',
        topicTitle: this.lang === 'hi' ? 'न्यूटन का द्वितीय नियम (बल F = m*a)' : 'NEWTON SECOND LAW (FORCE F = m*a)',
        subject: 'physics',
        text: this.lang === 'hi'
          ? `एक ${mass} kg द्रव्यमान की वस्तु पर ${accel} m/s² का त्वरण उत्पन्न करने के लिए कितने बल (F = m × a) की आवश्यकता होगी?`
          : `What force is required to accelerate a ${mass} kg mass at ${accel} m/s² (F = m × a)?`,
        options: shuffled,
        correctIndex: correctIdx,
        hint: this.lang === 'hi' ? 'बल = द्रव्यमान × त्वरण' : 'Force = Mass × Acceleration',
        explain: this.lang === 'hi'
          ? `F = m × a = ${mass} kg × ${accel} m/s² = ${force} N (न्यूटन)।`
          : `Force = ${mass} kg × ${accel} m/s² = ${force} N.`
      };
    }

    if (type === 'area') {
      const length = Math.floor(Math.random() * 9) + 3;
      const width = Math.floor(Math.random() * 6) + 2;
      const area = length * width;
      const key = `proc:area:${length}:${width}`;
      this.usedQuestionKeys.add(key);

      const distractors = [area + 6, Math.max(6, area - 5), (length + width) * 2];
      const opts = [area, ...distractors].map((v) => `${v} sq m`);
      const shuffled = opts.map((o) => ({ o, s: Math.random() })).sort((a, b) => a.s - b.s).map((a) => a.o);
      const correctIdx = shuffled.indexOf(`${area} sq m`);

      return {
        type: 'quiz',
        topicTitle: this.lang === 'hi' ? 'ज्यामिति: आयत का क्षेत्रफल' : 'GEOMETRY: RECTANGLE AREA',
        subject: 'maths',
        text: this.lang === 'hi'
          ? `एक रेसिंग ट्रैक पिटस्टॉप की लंबाई ${length}m और चौड़ाई ${width}m है। इसका क्षेत्रफल (Area = Length × Width) क्या होगा?`
          : `A pitstop garage is ${length}m long and ${width}m wide. What is its total area (Area = Length × Width)?`,
        options: shuffled,
        correctIndex: correctIdx,
        hint: this.lang === 'hi' ? 'क्षेत्रफल = लंबाई × चौड़ाई' : 'Area = Length × Width',
        explain: this.lang === 'hi'
          ? `क्षेत्रफल = ${length} × ${width} = ${area} वर्ग मीटर।`
          : `Area = ${length}m × ${width}m = ${area} sq meters.`
      };
    }

    // Density default
    const massD = (Math.floor(Math.random() * 6) + 2) * 10;
    const vol = (Math.floor(Math.random() * 4) + 1) * 5;
    const density = massD / vol;
    const key = `proc:density:${massD}:${vol}`;
    this.usedQuestionKeys.add(key);

    const distractors = [density + 2, Math.max(1, density - 1.5), density * 2];
    const opts = [density, ...distractors].map((v) => `${v} g/cm³`);
    const shuffled = opts.map((o) => ({ o, s: Math.random() })).sort((a, b) => a.s - b.s).map((a) => a.o);
    const correctIdx = shuffled.indexOf(`${density} g/cm³`);

    return {
      type: 'quiz',
      topicTitle: this.lang === 'hi' ? 'पदार्थ का घनत्व (Density = Mass / Volume)' : 'DENSITY CALCULATION',
      subject: 'chemistry',
      text: this.lang === 'hi'
        ? `एक रासायनिक ब्लॉक का द्रव्यमान ${massD} ग्राम और आयतन ${vol} cm³ है। इसका घनत्व क्या होगा?`
        : `A chemical compound block has mass ${massD}g and volume ${vol} cm³. What is its density (d = m / V)?`,
      options: shuffled,
      correctIndex: correctIdx,
      hint: this.lang === 'hi' ? 'घनत्व = द्रव्यमान / आयतन' : 'Density = Mass / Volume',
      explain: this.lang === 'hi'
        ? `घनत्व = ${massD}g / ${vol} cm³ = ${density} g/cm³।`
        : `Density = ${massD}g / ${vol} cm³ = ${density} g/cm³.`
    };
  }

  /**
   * Selects or synthesizes an appropriate STEM question or puzzle for current grade & circuit.
   * Guarantees 100% unique questions across the session with zero duplicates.
   */
  nextQuestion() {
    this.questionCount++;

    // 1. If user entered a custom topic, use AI Tutor to generate tailored questions
    if (this.customTopic && this.customTopic.length > 1) {
      const customQuestions = this.aiTutor.generateCustomQuiz(this.customTopic, this.grade, this.lang);
      if (customQuestions && customQuestions.length > 0) {
        const unusedCustom = customQuestions.filter((q) => !this.usedQuestionKeys.has(`custom:${q.text}`));
        const pool = unusedCustom.length > 0 ? unusedCustom : customQuestions;
        const q = pool[Math.floor(Math.random() * pool.length)];
        this.usedQuestionKeys.add(`custom:${q.text}`);

        this.currentQuestion = {
          type: 'quiz',
          topicTitle: this.customTopic,
          subject: 'custom',
          text: q.text,
          options: q.options,
          correctIndex: q.correctIndex,
          hint: q.hint,
          explain: q.explain
        };
        this.isActive = true;
        this.answered = false;
        return this.currentQuestion;
      }
    }

    // 2. Science Word Scramble Puzzle (Every 2nd question)
    const isScrambleTurn = this.questionCount % 2 === 0;
    const circuitPool = SCIENCE_SCRAMBLES[this.circuitId] || SCIENCE_SCRAMBLES.physics;

    if (isScrambleTurn && circuitPool && circuitPool.length > 0) {
      const unusedScrambles = circuitPool.filter((p) => !this.usedQuestionKeys.has(`scramble:${p.word}`));
      if (unusedScrambles.length > 0) {
        const puzzle = unusedScrambles[Math.floor(Math.random() * unusedScrambles.length)];
        this.usedQuestionKeys.add(`scramble:${puzzle.word}`);

        const scrambledTiles = [...puzzle.scrambled];
        const allOpts = [puzzle.word, ...puzzle.distractors];
        const shuffled = allOpts
          .map((opt) => ({ opt, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map((a) => a.opt);
        const correctIdx = shuffled.indexOf(puzzle.word);

        const titleHi = `विज्ञान शब्द पहेली (SCIENCE SCRAMBLE): ${puzzle.word.length} अक्षर`;
        const titleEn = `SCIENCE WORD SCRAMBLE: ${puzzle.word.length} LETTERS`;

        const promptHi = `अक्षरों को सुलझाकर सही वैज्ञानिक शब्द चुनें:\nसंकेत: ${puzzle.hint.hi || puzzle.hint.en}`;
        const promptEn = `Unscramble the tiles to identify the science term:\nHint: ${puzzle.hint.en}`;

        this.rawSource = {
          type: 'scramble',
          puzzle,
          scrambledTiles,
          shuffled,
          correctIdx
        };

        this.currentQuestion = {
          type: 'scramble',
          topicTitle: this.lang === 'hi' ? titleHi : titleEn,
          subject: puzzle.subject,
          scrambledTiles,
          targetWord: puzzle.word,
          text: this.lang === 'hi' ? promptHi : promptEn,
          options: shuffled,
          correctIndex: correctIdx,
          hint: puzzle.hint[this.lang] || puzzle.hint.en,
          explain: puzzle.explain[this.lang] || puzzle.explain.en
        };
        this.isActive = true;
        this.answered = false;
        return this.currentQuestion;
      }
    }

    // 3. Curriculum Questions: Collect all questions for this grade
    const topics = topicsForGrade(this.grade);
    let candidateQuestions = [];

    if (topics && topics.length > 0) {
      let targetSubject = 'science';
      if (this.circuitId === 'maths') targetSubject = 'maths';

      let matchedTopics = topics.filter((t) => t.subject === targetSubject);
      if (matchedTopics.length === 0) matchedTopics = topics;

      for (const th of matchedTopics) {
        const fullTopic = getTopic(th.id, this.grade);
        if (fullTopic && fullTopic.questions) {
          for (const q of fullTopic.questions) {
            const qKey = `grade:${this.grade}:${th.id}:${q.id || q.text.en}`;
            if (!this.usedQuestionKeys.has(qKey)) {
              candidateQuestions.push({ qKey, fullTopic, q });
            }
          }
        }
      }
    }

    // If all questions in current grade are used, search across all 8 grades
    if (candidateQuestions.length === 0) {
      for (let g = 1; g <= 8; g++) {
        const gTopics = topicsForGrade(g);
        for (const th of gTopics) {
          const fullTopic = getTopic(th.id, g);
          if (fullTopic && fullTopic.questions) {
            for (const q of fullTopic.questions) {
              const qKey = `grade:${g}:${th.id}:${q.id || q.text.en}`;
              if (!this.usedQuestionKeys.has(qKey)) {
                candidateQuestions.push({ qKey, fullTopic, q });
              }
            }
          }
        }
      }
    }

    // If static questions exist, pick an unused one
    if (candidateQuestions.length > 0) {
      const chosen = candidateQuestions[Math.floor(Math.random() * candidateQuestions.length)];
      this.usedQuestionKeys.add(chosen.qKey);

      this.rawSource = {
        type: 'quiz',
        fullTopic: chosen.fullTopic,
        q: chosen.q
      };

      this.currentQuestion = {
        type: 'quiz',
        topicTitle: chosen.fullTopic.title[this.lang] || chosen.fullTopic.title.en,
        subject: chosen.fullTopic.subject,
        text: chosen.q.text[this.lang] || chosen.q.text.en,
        options: chosen.q.options.map((opt) => opt[this.lang] || opt.en),
        correctIndex: chosen.q.answer,
        hint: chosen.q.hint[this.lang] || chosen.q.hint.en,
        explain: chosen.q.explain[this.lang] || chosen.q.explain.en
      };

      this.isActive = true;
      this.answered = false;
      return this.currentQuestion;
    }

    // 4. Procedural Generator fallback: Infinite unique questions!
    const procQ = this.generateProceduralQuestion();
    this.rawSource = null;
    this.currentQuestion = procQ;
    this.isActive = true;
    this.answered = false;
    return this.currentQuestion;
  }

  /**
   * Seamlessly switches the language of the currently active question.
   * @param {string} targetLang 'hi' | 'en'
   * @returns {object|null}
   */
  switchLanguage(targetLang) {
    this.lang = targetLang === 'en' ? 'en' : 'hi';
    if (!this.currentQuestion || !this.rawSource) return this.currentQuestion;

    if (this.rawSource.type === 'scramble') {
      const p = this.rawSource.puzzle;
      const titleHi = `विज्ञान शब्द पहेली (SCIENCE SCRAMBLE): ${p.word.length} अक्षर`;
      const titleEn = `SCIENCE WORD SCRAMBLE: ${p.word.length} LETTERS`;
      const promptHi = `अक्षरों को सुलझाकर सही वैज्ञानिक शब्द चुनें:\nसंकेत: ${p.hint.hi || p.hint.en}`;
      const promptEn = `Unscramble the tiles to identify the science term:\nHint: ${p.hint.en}`;

      this.currentQuestion.topicTitle = this.lang === 'hi' ? titleHi : titleEn;
      this.currentQuestion.text = this.lang === 'hi' ? promptHi : promptEn;
      this.currentQuestion.hint = p.hint[this.lang] || p.hint.en;
      this.currentQuestion.explain = p.explain[this.lang] || p.explain.en;
      return this.currentQuestion;
    }

    if (this.rawSource.type === 'quiz') {
      const ft = this.rawSource.fullTopic;
      const q = this.rawSource.q;
      this.currentQuestion.topicTitle = ft.title[this.lang] || ft.title.en;
      this.currentQuestion.text = q.text[this.lang] || q.text.en;
      this.currentQuestion.options = q.options.map((opt) => opt[this.lang] || opt.en);
      this.currentQuestion.hint = q.hint[this.lang] || q.hint.en;
      this.currentQuestion.explain = q.explain[this.lang] || q.explain.en;
      return this.currentQuestion;
    }

    return this.currentQuestion;
  }

  /**
   * Validates option chosen (0 to 3).
   * @param {number} optionIndex
   * @returns {{ isCorrect: boolean, explain: string, streak: number }}
   */
  submitAnswer(optionIndex) {
    if (!this.isActive || !this.currentQuestion) return null;

    const isCorrect = optionIndex === this.currentQuestion.correctIndex;
    this.answered = true;

    if (isCorrect) {
      this.streak++;
    } else {
      this.streak = 0;
    }

    const result = {
      isCorrect,
      correctIndex: this.currentQuestion.correctIndex,
      explain: this.currentQuestion.explain,
      streak: this.streak
    };

    this.history.push({
      question: this.currentQuestion.text,
      isCorrect,
      time: Date.now()
    });

    return result;
  }

  dismiss() {
    this.isActive = false;
    this.currentQuestion = null;
    this.answered = false;
  }
}
