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
   * Selects or synthesizes an appropriate STEM question or puzzle for current grade & circuit.
   */
  nextQuestion() {
    this.questionCount++;

    // 1. If user entered a custom topic, use AI Tutor to generate tailored questions
    if (this.customTopic && this.customTopic.length > 1) {
      const customQuestions = this.aiTutor.generateCustomQuiz(this.customTopic, this.grade, this.lang);
      if (customQuestions && customQuestions.length > 0) {
        const q = customQuestions[Math.floor(Math.random() * customQuestions.length)];
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

    // 2. Science Word Scramble Puzzle (Every 2nd or 3rd question)
    const isScrambleTurn = this.questionCount % 2 === 0;
    const circuitPool = SCIENCE_SCRAMBLES[this.circuitId] || SCIENCE_SCRAMBLES.physics;

    if (isScrambleTurn && circuitPool && circuitPool.length > 0) {
      const puzzle = circuitPool[Math.floor(Math.random() * circuitPool.length)];
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

    // 3. Otherwise load from standard curriculum index
    const topics = topicsForGrade(this.grade);
    if (!topics || topics.length === 0) return null;

    let targetSubject = 'science';
    if (this.circuitId === 'maths') targetSubject = 'maths';

    let matchedTopics = topics.filter((t) => t.subject === targetSubject);
    if (matchedTopics.length === 0) matchedTopics = topics;

    const chosenTopicHeader = matchedTopics[Math.floor(Math.random() * matchedTopics.length)];
    const fullTopic = getTopic(chosenTopicHeader.id, this.grade);

    if (!fullTopic || !fullTopic.questions || fullTopic.questions.length === 0) {
      return null;
    }

    const q = fullTopic.questions[Math.floor(Math.random() * fullTopic.questions.length)];

    this.rawSource = {
      type: 'quiz',
      fullTopic,
      q
    };

    this.currentQuestion = {
      type: 'quiz',
      topicTitle: fullTopic.title[this.lang] || fullTopic.title.en,
      subject: fullTopic.subject,
      text: q.text[this.lang] || q.text.en,
      options: q.options.map((opt) => opt[this.lang] || opt.en),
      correctIndex: q.answer,
      hint: q.hint[this.lang] || q.hint.en,
      explain: q.explain[this.lang] || q.explain.en
    };

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
