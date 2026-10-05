// src/data/journal314DensificationData.ts
import { GraphNode, GraphEdge } from '../types/graph';

export interface JournalThesis {
  code: 'T1' | 'T2' | 'T3' | 'T4';
  title: string;
  claim: string;
  argumentSummary: string;
}

export interface JournalThematicStep {
  step: string; // e.g. S1, S2...
  phase: 'Phase I: Diagnosis' | 'Phase II: Anthropology' | 'Phase III: Purgation' | 'Phase IV: Disclosure' | 'Phase V: Reconception';
  name: string;
  description: string;
}

export interface JournalFigure {
  id: string; // e.g. "fig-1"
  figureNumber: string; // e.g. "1", "41a"
  name: string;
  eraAndTradition: string;
  cluster: string;
  clusterName: string;
  quotes: {
    text: string;
    source: string;
    label: 'P' | 'J314' | 'P/J314' | 'DESC' | '≈';
  }[];
  thesesSupported: ('T1' | 'T2' | 'T3' | 'T4')[];
  stepsActivated: string[]; // e.g. ['S1', 'S4', 'S22']
}

export interface DisparityPairing {
  id: string;
  title: string;
  figureA: string;
  figureB: string;
  temporalDistance: string;
  culturalDistance: string;
  religiousDistance: string;
  sharedStructure: string;
  divergenceOrParadox: string;
}

export interface ParadoxAporia {
  id: string;
  title: string;
  figures: string[];
  formulation: string;
}

export const JOURNAL_THESES: JournalThesis[] = [
  {
    code: 'T1',
    title: 'Trans-Historical Universality',
    claim: 'Cultural and historical conditions are insufficient to fully account for the depth, structure, and recurrence of the nihilistic experience. The experience precedes and exceeds its historical containers.',
    argumentSummary: 'Appears across independent civilizations: Ecclesiastes (Ancient Near East) -> Socrates (Classical Greece) -> Nāgārjuna (India) -> Augustine (Rome) -> Eckhart (Medieval Rhineland) -> Tolstoy (Russia) -> Heidegger (20th c. Europe).'
  },
  {
    code: 'T2',
    title: 'Positive Ontological Status',
    claim: 'The Nothing encountered in nihilism is not merely a logical negation or psychological absence. It possesses positive ontological content: it acts, reveals, purifies, founds, and discloses.',
    argumentSummary: 'Phenomenological (Heidegger: Das Nichts selbst nichtet; Kierkegaard: dizziness of freedom), Mystical (Molinos, Eckhart, Dionysian divine darkness), and Eastern (Taoist empty hub, Buddhist śūnyatā as form itself).'
  },
  {
    code: 'T3',
    title: 'Fundamental Yet Rare',
    claim: 'The nihilistic experience belongs structurally to human existence as such — it is built into the dual nature of the human being — yet it is encountered in its full depth only rarely, because human beings are constitutively organized to avoid it.',
    argumentSummary: 'Pascal chamber avoidance, Zapffe suppression quartet (isolation, anchoring, distraction, sublimation), Becker denial of death, and Huxley sensory reducing valve filter out the abyss.'
  },
  {
    code: 'T4',
    title: 'Nihilism as Temporal Transcendence',
    claim: 'The experience of nihilism may be the very mode by which the Transcendent — what religious traditions call God, Brahman, Tao, Sunyata, the Ground of Being — manifests within temporal human consciousness. The Nothing and the All may be two names for the same disclosure.',
    argumentSummary: 'Tillich God above God, Eckhart pray God to rid me of God, Molinos nothingness as divine wonder, Thérèse night of nothingness, Schopenhauer world as nothing.'
  }
];

export const JOURNAL_PHASES: { name: JournalThematicStep['phase']; steps: string[]; description: string }[] = [
  {
    name: 'Phase I: Diagnosis',
    steps: ['S1', 'S2', 'S3'],
    description: 'The world is stripped of meaning, value, and purpose. Anxiety, boredom, and the Nothing emerge. Knowledge itself becomes suspect.'
  },
  {
    name: 'Phase II: Anthropology',
    steps: ['S4', 'S5', 'S6'],
    description: 'The dual nature of the human being is disclosed. The pull toward renunciation and the contemplative life is felt. The path proves difficult.'
  },
  {
    name: 'Phase III: Purgation',
    steps: ['S7', 'S8', 'S9', 'S10'],
    description: 'Recollection supersedes external practice. Sensory pleasures are abandoned. Distractions are cleared. Mystical, psychedelic, and nihilistic experiences converge.'
  },
  {
    name: 'Phase IV: Disclosure',
    steps: ['S11', 'S12', 'S13', 'S14', 'S15'],
    description: 'The Infinite Within is intuited. Inner turmoil yields philosophical insight. Terror and beauty converge in confrontation with Infinite Presence. Surrender and ego-dissolution occur.'
  },
  {
    name: 'Phase V: Reconception',
    steps: ['S16', 'S17', 'S18', 'S19', 'S20', 'S21', 'S22'],
    description: 'God is reconceived beyond conventional theism. Divine absence becomes a mode of presence. Language reaches its limit and yields to silence. Spiritual practice becomes symbolic. Nothingness is recognized as the temporal expression of the Transcendent.'
  }
];

export const JOURNAL_FIGURES: JournalFigure[] = [
  // Cluster A: Christian Mystical Tradition
  {
    id: 'fig-1',
    figureNumber: '1',
    name: 'St. Augustine',
    eraAndTradition: 'Late Antique / Latin Christian',
    cluster: 'A',
    clusterName: 'Christian Mystical Tradition',
    quotes: [
      { text: 'Our heart is restless, until it repose in Thee.', source: 'Confessions I.1', label: 'P/J314' },
      { text: 'I had become a great question to myself. (factus eram ipse mihi magna quaestio)', source: 'Confessions IV.4', label: 'P' },
      { text: 'Every vain hope at once became worthless to me; and I longed with an incredibly burning desire for an immortality of wisdom.', source: 'Confessions III.4', label: 'P' }
    ],
    thesesSupported: ['T1', 'T2', 'T3', 'T4'],
    stepsActivated: ['S1', 'S2', 'S4', 'S5', 'S12', 'S22']
  },
  {
    id: 'fig-2',
    figureNumber: '2',
    name: 'Miguel de Molinos',
    eraAndTradition: '17th c. / Spanish Quietist',
    cluster: 'A',
    clusterName: 'Christian Mystical Tradition',
    quotes: [
      { text: 'Thou art to know, that thy Soul is the Centre, Habitation, and the Kingdom of God.', source: 'Spiritual Guide III.1', label: 'P' },
      { text: 'Sink down into the Abyss of thy own Insufficiency and Nothingness.', source: 'Spiritual Guide', label: 'P/J314' },
      { text: 'This Nothing is the means by which the Lord works wonders in thy Soul.', source: 'Spiritual Guide', label: 'J314' }
    ],
    thesesSupported: ['T2', 'T4'],
    stepsActivated: ['S9', 'S11', 'S14', 'S22']
  },
  {
    id: 'fig-5',
    figureNumber: '5',
    name: 'St. John of the Cross',
    eraAndTradition: '16th c. / Carmelite',
    cluster: 'A',
    clusterName: 'Christian Mystical Tradition',
    quotes: [
      { text: 'To come to the knowledge of all, desire the knowledge of nothing. To come to possess all, desire the possession of nothing.', source: 'Ascent of Mount Carmel I.13', label: 'P/J314' },
      { text: 'The soul… feels itself to be perishing and melting away, in the face and sight of its miseries, in a cruel spiritual death.', source: 'Dark Night II.6', label: 'P' },
      { text: 'In order to arrive at having pleasure in everything, desire to have pleasure in nothing.', source: 'Ascent I.13', label: 'P' }
    ],
    thesesSupported: ['T2', 'T3', 'T4'],
    stepsActivated: ['S5', 'S6', 'S8', 'S9', 'S13', 'S14', 'S17', 'S22']
  },
  {
    id: 'fig-7',
    figureNumber: '7',
    name: 'Teresa of Ávila',
    eraAndTradition: '16th c. / Carmelite',
    cluster: 'A',
    clusterName: 'Christian Mystical Tradition',
    quotes: [
      { text: 'The soul is like a castle made of a single diamond… in which there are many rooms, just as in Heaven there are many mansions.', source: 'Interior Castle I.1', label: 'P' },
      { text: 'Let nothing disturb you, let nothing frighten you. All things are passing; God alone never changes.', source: 'Bookmark', label: 'P' }
    ],
    thesesSupported: ['T2', 'T4'],
    stepsActivated: ['S11', 'S14']
  },
  {
    id: 'fig-11',
    figureNumber: '11',
    name: 'Martin Luther',
    eraAndTradition: '16th c. / Reformation',
    cluster: 'A',
    clusterName: 'Christian Mystical Tradition',
    quotes: [
      { text: 'A theologian of the cross calls the thing what it actually is.', source: 'Heidelberg Disputation, Thesis 21', label: 'P' },
      { text: 'I knew a man who claimed to have often suffered these punishments… in so brief a time that no tongue could adequately express them, no pen could describe them... And so great were they that, if they had been sustained... he would have perished completely.', source: 'Explanations of the 95 Theses', label: 'P/J314' }
    ],
    thesesSupported: ['T2', 'T3'],
    stepsActivated: ['S13', 'S16', 'S17', 'S18']
  },
  {
    id: 'fig-12',
    figureNumber: '12',
    name: 'Thomas Merton',
    eraAndTradition: '20th c. / Trappist',
    cluster: 'A',
    clusterName: 'Christian Mystical Tradition',
    quotes: [
      { text: 'At the center of our being is a point of nothingness which is untouched by sin and by illusion, a point of pure truth, a point or spark which belongs entirely to God.', source: 'Conjectures of a Guilty Bystander', label: 'P/J314' },
      { text: 'Every one of us is shadowed by an illusory person: a false self.', source: 'New Seeds of Contemplation', label: 'P' }
    ],
    thesesSupported: ['T2', 'T3', 'T4'],
    stepsActivated: ['S11', 'S15', 'S22']
  },
  {
    id: 'fig-13',
    figureNumber: '13',
    name: 'Meister Eckhart',
    eraAndTradition: '14th c. / Dominican',
    cluster: 'A',
    clusterName: 'Christian Mystical Tradition',
    quotes: [
      { text: 'I pray God to rid me of God.', source: 'Sermon 52', label: 'P/J314' },
      { text: 'The eye with which I see God is the same eye with which God sees me.', source: 'Sermon 12', label: 'P' },
      { text: 'God is not found in the soul by adding anything but by a process of subtraction.', source: 'Sermons', label: 'P' }
    ],
    thesesSupported: ['T2', 'T4'],
    stepsActivated: ['S9', 'S11', 'S15', 'S16', 'S20', 'S22']
  },
  {
    id: 'fig-29',
    figureNumber: '29',
    name: 'Pseudo-Dionysius',
    eraAndTradition: 'c. 500 CE / Syrian',
    cluster: 'A',
    clusterName: 'Christian Mystical Tradition',
    quotes: [
      { text: 'Being neither oneself nor someone else, one is supremely united to the completely unknown, and through the inactivity of all knowing, one knows beyond the mind.', source: 'Mystical Theology I', label: 'P' },
      { text: 'The divine darkness is the unapproachable light in which God is said to live.', source: 'Letter 5', label: 'P' }
    ],
    thesesSupported: ['T2', 'T4'],
    stepsActivated: ['S13', 'S15', 'S18', 'S22']
  },
  {
    id: 'fig-30',
    figureNumber: '30',
    name: 'Thomas Aquinas',
    eraAndTradition: '13th c. / Scholastic',
    cluster: 'A',
    clusterName: 'Christian Mystical Tradition',
    quotes: [
      { text: 'All that I have written seems to me like straw compared to what has now been revealed to me.', source: 'Reported by Reginald of Piperno, December 1273', label: 'P' }
    ],
    thesesSupported: ['T2', 'T4'],
    stepsActivated: ['S18']
  },
  {
    id: 'fig-33',
    figureNumber: '33',
    name: 'John Bunyan',
    eraAndTradition: '17th c. / Puritan',
    cluster: 'A',
    clusterName: 'Christian Mystical Tradition',
    quotes: [
      { text: 'I was more loathsome in mine own eyes than was a toad, and I thought I was so in God\'s eyes too.', source: 'Grace Abounding to the Chief of Sinners', label: 'P' }
    ],
    thesesSupported: ['T1', 'T3'],
    stepsActivated: ['S12', 'S17']
  },
  {
    id: 'fig-44',
    figureNumber: '44',
    name: 'Angela of Foligno',
    eraAndTradition: '13th c. / Franciscan',
    cluster: 'A',
    clusterName: 'Christian Mystical Tradition',
    quotes: [
      { text: 'I saw all and I saw nothing.', source: 'Book of Visions and Instructions', label: 'P/J314' },
      { text: 'And then He said to me: "I want to show thee something of my power." And immediately the eyes of my soul were opened, and in a vision I beheld the fullness of God...', source: 'Book of Visions', label: 'P' }
    ],
    thesesSupported: ['T2', 'T4'],
    stepsActivated: ['S13', 'S18']
  },
  {
    id: 'fig-45',
    figureNumber: '45',
    name: 'Thomas Keating',
    eraAndTradition: '20th c. / Cistercian',
    cluster: 'A',
    clusterName: 'Christian Mystical Tradition',
    quotes: [
      { text: 'Silence is God\'s first language; everything else is a poor translation.', source: 'Attributed, Invitation to Love', label: '≈' }
    ],
    thesesSupported: ['T4'],
    stepsActivated: ['S19']
  },
  {
    id: 'fig-46',
    figureNumber: '46',
    name: 'Evelyn Underhill',
    eraAndTradition: '20th c. / Mysticism Scholar',
    cluster: 'A',
    clusterName: 'Christian Mystical Tradition',
    quotes: [
      { text: 'The mystic knows that his whole being is soaked in the Divine, that he is in God and God is in him.', source: 'Mysticism', label: 'P' },
      { text: 'Maps the mystic path as five stages: Awakening, Purgation, Illumination, Dark Night of the Soul, Union — establishing the void as a structural necessity.', source: 'Mysticism Analysis', label: 'DESC' }
    ],
    thesesSupported: ['T2', 'T3', 'T4'],
    stepsActivated: ['S6', 'S10', 'S15']
  },
  {
    id: 'fig-47',
    figureNumber: '47',
    name: 'Thomas à Kempis',
    eraAndTradition: '15th c. / Devotio Moderna',
    cluster: 'A',
    clusterName: 'Christian Mystical Tradition',
    quotes: [
      { text: 'Vanity of vanities, and all is vanity, except to love God and serve Him alone.', source: 'Imitation of Christ I.1', label: 'P/J314' },
      { text: 'What doth it profit thee to enter into deep discussion concerning the Holy Trinity, if thou lack humility?', source: 'Imitation I.1', label: 'P' }
    ],
    thesesSupported: ['T1', 'T3', 'T4'],
    stepsActivated: ['S1', 'S3', 'S5']
  },
  {
    id: 'fig-48',
    figureNumber: '48',
    name: 'Thérèse of Lisieux',
    eraAndTradition: '19th c. / Carmelite',
    cluster: 'A',
    clusterName: 'Christian Mystical Tradition',
    quotes: [
      { text: 'The darkness, borrowing the voice of sinners, says mockingly to me: "You dream of light, of a fragrant land... Advance, advance; rejoice in death which will give you not what you hope for but a night still more complete, the night of nothingness."', source: 'Story of a Soul, MS C', label: 'P/J314' }
    ],
    thesesSupported: ['T1', 'T2', 'T3', 'T4'],
    stepsActivated: ['S17', 'S22']
  },

  // Cluster B: Existentialist / Phenomenological Tradition
  {
    id: 'fig-9',
    figureNumber: '9',
    name: 'Søren Kierkegaard',
    eraAndTradition: '19th c. / Danish Lutheran',
    cluster: 'B',
    clusterName: 'Existentialist / Phenomenological',
    quotes: [
      { text: 'Anxiety is the dizziness of freedom.', source: 'The Concept of Anxiety', label: 'P/J314' },
      { text: 'Whoever has learned to be anxious in the right way has learned the ultimate.', source: 'Concept of Anxiety V', label: 'P/J314' },
      { text: 'The most common form of despair is not being who you are.', source: 'Sickness Unto Death', label: 'P' }
    ],
    thesesSupported: ['T2', 'T3'],
    stepsActivated: ['S2', 'S12', 'S15']
  },
  {
    id: 'fig-10',
    figureNumber: '10',
    name: 'Friedrich Nietzsche',
    eraAndTradition: '19th c. / Post-Christian',
    cluster: 'B',
    clusterName: 'Existentialist / Phenomenological',
    quotes: [
      { text: 'Are we not straying as through an infinite nothing? Do we not feel the breath of empty space? Has it not become colder? Is it not more and more night coming on?', source: 'The Gay Science §125', label: 'P/J314' },
      { text: 'What does nihilism mean? That the highest values devalue themselves. The aim is lacking; "why?" finds no answer.', source: 'Will to Power §2', label: 'P' },
      { text: 'Nihilism stands at the door: whence comes this uncanniest of all guests?', source: 'Will to Power §1', label: 'P/J314' }
    ],
    thesesSupported: ['T1', 'T2', 'T3'],
    stepsActivated: ['S1', 'S2', 'S17']
  },
  {
    id: 'fig-17',
    figureNumber: '17',
    name: 'Albert Camus',
    eraAndTradition: '20th c. / French Absurdist',
    cluster: 'B',
    clusterName: 'Existentialist / Phenomenological',
    quotes: [
      { text: 'There is but one truly serious philosophical problem, and that is suicide.', source: 'The Myth of Sisyphus', label: 'P/J314' },
      { text: 'The absurd is born of this confrontation between the human need and the unreasonable silence of the world.', source: 'Myth of Sisyphus', label: 'P' },
      { text: 'One must imagine Sisyphus happy.', source: 'Myth of Sisyphus', label: 'P' }
    ],
    thesesSupported: ['T1', 'T2', 'T3'],
    stepsActivated: ['S1', 'S19']
  },
  {
    id: 'fig-18',
    figureNumber: '18',
    name: 'Emil Cioran',
    eraAndTradition: '20th c. / Romanian-French',
    cluster: 'B',
    clusterName: 'Existentialist / Phenomenological',
    quotes: [
      { text: 'It is not worth the bother of killing yourself, since you always kill yourself too late.', source: 'The Trouble with Being Born', label: 'P' },
      { text: 'I live only because it is in my power to die whenever I choose: without the idea of suicide, I\'d have killed myself long ago.', source: 'On the Heights of Despair', label: 'P' },
      { text: 'Tormented by a sense of inner infinity, I found in the void the only space vast enough to contain it.', source: 'On the Heights of Despair', label: 'P/J314' }
    ],
    thesesSupported: ['T2', 'T3', 'T4'],
    stepsActivated: ['S2', 'S11', 'S12', 'S22']
  },
  {
    id: 'fig-52',
    figureNumber: '52',
    name: 'Martin Heidegger',
    eraAndTradition: '20th c. / German',
    cluster: 'B',
    clusterName: 'Existentialist / Phenomenological',
    quotes: [
      { text: 'Anxiety reveals the nothing.', source: 'What Is Metaphysics?', label: 'P/J314' },
      { text: 'The nothing itself nothings. (Das Nichts selbst nichtet.)', source: 'What Is Metaphysics?', label: 'P/J314' },
      { text: 'Dasein means: to be held out into the nothing.', source: 'What Is Metaphysics?', label: 'P' }
    ],
    thesesSupported: ['T2', 'T3'],
    stepsActivated: ['S2', 'S22']
  },

  // Cluster C: Pessimist / Anti-Natalist Tradition
  {
    id: 'fig-20',
    figureNumber: '20',
    name: 'Thomas Ligotti',
    eraAndTradition: 'Contemporary / Pessimist',
    cluster: 'C',
    clusterName: 'Pessimist / Anti-Natalist',
    quotes: [
      { text: 'Consciousness is the parent of all horrors.', source: 'The Conspiracy Against the Human Race', label: 'P' },
      { text: 'We are all just meat that thinks it matters.', source: 'Conspiracy Against the Human Race', label: 'P' },
      { text: 'Argues that the horror of consciousness is a structural feature of sentient existence rather than a cultural artifact.', source: 'Philosophical Horror Theory', label: 'DESC' }
    ],
    thesesSupported: ['T1', 'T3'],
    stepsActivated: ['S1', 'S2', 'S4']
  },
  {
    id: 'fig-21',
    figureNumber: '21',
    name: 'Arthur Schopenhauer',
    eraAndTradition: '19th c. / Pessimist',
    cluster: 'C',
    clusterName: 'Pessimist / Anti-Natalist',
    quotes: [
      { text: 'Life swings like a pendulum backwards and forwards between pain and boredom.', source: 'The World as Will and Representation I §57', label: 'P/J314' },
      { text: 'To those in whom the will has turned and denied itself, this our world, which is so very real, with all its suns and milky ways — is nothing.', source: 'WWR I §71', label: 'P/J314' },
      { text: 'The world is my representation.', source: 'WWR I §1', label: 'P' }
    ],
    thesesSupported: ['T1', 'T2', 'T3', 'T4'],
    stepsActivated: ['S2', 'S3', 'S15', 'S22']
  },
  {
    id: 'fig-36',
    figureNumber: '36',
    name: 'Peter Wessel Zapffe',
    eraAndTradition: '20th c. / Norwegian',
    cluster: 'C',
    clusterName: 'Pessimist / Anti-Natalist',
    quotes: [
      { text: 'Know yourselves — be infertile, and let the earth be silent after ye.', source: 'The Last Messiah', label: 'P' },
      { text: 'Formulates the 4 mechanisms of avoidance (isolation, anchoring, distraction, sublimation) whereby humanity suppresses tragic consciousness.', source: 'The Last Messiah Analysis', label: 'DESC' }
    ],
    thesesSupported: ['T1', 'T3'],
    stepsActivated: ['S9']
  },
  {
    id: 'fig-37',
    figureNumber: '37',
    name: 'Mitchell Heisman',
    eraAndTradition: '21st c. / Analytic Pessimist',
    cluster: 'C',
    clusterName: 'Pessimist / Anti-Natalist',
    quotes: [
      { text: 'His 1,905-page Suicide Note treats death as a formal philosophical experiment into whether nihilism can be lived to its logical conclusion.', source: 'Suicide Note', label: 'DESC' }
    ],
    thesesSupported: ['T3'],
    stepsActivated: ['S1', 'S12']
  },
  {
    id: 'fig-39',
    figureNumber: '39',
    name: 'Herman Tønnessen',
    eraAndTradition: '20th c. / Norwegian',
    cluster: 'C',
    clusterName: 'Pessimist / Anti-Natalist',
    quotes: [
      { text: 'Happiness Is for the Pigs: philosophical clarity about existence produces not happiness but lucid, dignified despair.', source: 'Happiness Is for the Pigs', label: 'DESC' }
    ],
    thesesSupported: ['T1', 'T3'],
    stepsActivated: ['S1', 'S9']
  },

  // Cluster D: Secular / Analytic Tradition
  {
    id: 'fig-15',
    figureNumber: '15',
    name: 'William Lane Craig',
    eraAndTradition: 'Contemporary / Evangelical Analytic',
    cluster: 'D',
    clusterName: 'Secular / Analytic / Apologetic',
    quotes: [
      { text: 'If there is no God, then man and the universe are doomed. Whatever else he may be, man is not what he thought: a being of infinite dignity, freedom, and significance.', source: 'The Absurdity of Life without God', label: 'P' }
    ],
    thesesSupported: ['T1', 'T3'],
    stepsActivated: ['S1']
  },
  {
    id: 'fig-16',
    figureNumber: '16',
    name: 'Bertrand Russell',
    eraAndTradition: '20th c. / British Analytic',
    cluster: 'D',
    clusterName: 'Secular / Analytic',
    quotes: [
      { text: 'That man is the product of causes which had no prevision of the end they were achieving; that his origin, his growth, his hopes and fears... are but the outcome of accidental collocations of atoms.', source: 'A Free Man\'s Worship', label: 'P/J314' },
      { text: 'Only on the firm foundation of unyielding despair, can the soul\'s habitation henceforth be safely built.', source: 'A Free Man\'s Worship', label: 'P/J314' }
    ],
    thesesSupported: ['T1', 'T2'],
    stepsActivated: ['S1', 'S12']
  },
  {
    id: 'fig-28',
    figureNumber: '28',
    name: 'Will Durant',
    eraAndTradition: '20th c. / American Historian',
    cluster: 'D',
    clusterName: 'Secular / Analytic',
    quotes: [
      { text: 'On the Meaning of Life (1932): finds widespread educated despair among 20th c. intellectuals, proving nihilistic crisis is not localized.', source: 'On the Meaning of Life', label: 'DESC' }
    ],
    thesesSupported: ['T1', 'T3'],
    stepsActivated: ['S1']
  },
  {
    id: 'fig-31',
    figureNumber: '31',
    name: 'W.K. Clifford',
    eraAndTradition: 'Victorian / Evidentialist',
    cluster: 'D',
    clusterName: 'Secular / Analytic',
    quotes: [
      { text: 'It is wrong always, everywhere, and for anyone, to believe anything upon insufficient evidence.', source: 'The Ethics of Belief', label: 'P' }
    ],
    thesesSupported: ['T1', 'T3'],
    stepsActivated: ['S3']
  },

  // Cluster E: Psychological / Empirical Tradition
  {
    id: 'fig-22',
    figureNumber: '22',
    name: 'William James',
    eraAndTradition: '19th–20th c. / American Pragmatist',
    cluster: 'E',
    clusterName: 'Psychological / Empirical',
    quotes: [
      { text: 'There fell upon me without any warning, just as if it came out of the darkness, a horrible fear of my own existence.', source: 'Varieties of Religious Experience, Lect. VI–VII', label: 'P/J314' },
      { text: 'Our normal waking consciousness… is but one special type of consciousness, whilst all about it, parted from it by the filmiest of screens, there lie potential forms of consciousness entirely different.', source: 'Varieties, Lect. XVI–XVII', label: 'P/J314' },
      { text: 'The greatest revolution of our generation is the discovery that human beings, by changing the inner attitudes of their minds, can change the outer aspects of their lives.', source: 'Attributed Writings', label: '≈' }
    ],
    thesesSupported: ['T1', 'T2', 'T3', 'T4'],
    stepsActivated: ['S2', 'S10', 'S11', 'S21']
  },
  {
    id: 'fig-32',
    figureNumber: '32',
    name: 'Aldous Huxley',
    eraAndTradition: '20th c. / Perennialist',
    cluster: 'E',
    clusterName: 'Psychological / Empirical',
    quotes: [
      { text: 'To make biological survival possible, Mind at Large has to be funneled through the reducing valve of the brain and nervous system. What comes out at the other end is a measly trickle of consciousness.', source: 'The Doors of Perception', label: 'P/J314' },
      { text: 'The function of the brain and nervous system is to protect us from being overwhelmed and confused by this mass of largely useless and irrelevant knowledge.', source: 'The Doors of Perception', label: 'P' }
    ],
    thesesSupported: ['T2', 'T3'],
    stepsActivated: ['S10', 'S11']
  },
  {
    id: 'fig-35',
    figureNumber: '35',
    name: 'Timothy Leary',
    eraAndTradition: '20th c. / Psychedelic',
    cluster: 'E',
    clusterName: 'Psychological / Empirical',
    quotes: [
      { text: 'The first thing you do when you turn on is to discover that everything you thought was real is not.', source: 'The Psychedelic Experience', label: 'P' },
      { text: 'Maps ego-dissolution based on the Bardo Thodol as the threshold to recognizing the Clear Light.', source: 'The Psychedelic Experience', label: 'DESC' }
    ],
    thesesSupported: ['T2', 'T3', 'T4'],
    stepsActivated: ['S10', 'S15']
  },
  {
    id: 'fig-40',
    figureNumber: '40',
    name: 'Huston Smith',
    eraAndTradition: '20th c. / Comparative Religion',
    cluster: 'E',
    clusterName: 'Psychological / Empirical',
    quotes: [
      { text: 'Good Friday Experiment (1962): establishes that psilocybin-induced mystical/nihilistic states are structurally identical to classical accounts.', source: 'Cleansing the Doors of Perception', label: 'DESC' }
    ],
    thesesSupported: ['T1', 'T2', 'T3'],
    stepsActivated: ['S10']
  },
  {
    id: 'fig-49',
    figureNumber: '49',
    name: 'Ernest Becker',
    eraAndTradition: '20th c. / Psychoanalytic Anthropology',
    cluster: 'E',
    clusterName: 'Psychological / Empirical',
    quotes: [
      { text: 'Man is literally split in two: he has an awareness of his own splendid uniqueness in that he sticks out of nature with a towering majesty, and yet he goes back into the ground a few feet in order to blindly and dumbly rot and disappear forever.', source: 'The Denial of Death', label: 'P/J314' },
      { text: 'The idea of death, the fear of it, haunts the human animal like nothing else; it is a mainspring of human activity — activity designed largely to avoid the fatality of death.', source: 'The Denial of Death', label: 'P' }
    ],
    thesesSupported: ['T1', 'T3'],
    stepsActivated: ['S4', 'S9']
  },

  // Cluster F: Eastern Traditions
  {
    id: 'fig-23',
    figureNumber: '23',
    name: 'Taoism (Laozi / Zhuangzi)',
    eraAndTradition: 'Classical China',
    cluster: 'F',
    clusterName: 'Eastern Traditions',
    quotes: [
      { text: 'The Tao that can be told is not the eternal Tao.', source: 'Tao Te Ching 1', label: 'P/J314' },
      { text: 'Thirty spokes share the wheel\'s hub; it is the center hole that makes it useful. Shape clay into a vessel; it is the space within that makes it useful.', source: 'Tao Te Ching 11', label: 'P' },
      { text: 'To the mind that is still, the whole universe surrenders.', source: 'Attributed to Zhuangzi', label: '≈' }
    ],
    thesesSupported: ['T1', 'T2', 'T4'],
    stepsActivated: ['S18', 'S19', 'S22']
  },
  {
    id: 'fig-24',
    figureNumber: '24',
    name: 'Buddhism (Nāgārjuna / Heart Sūtra)',
    eraAndTradition: 'Classical India',
    cluster: 'F',
    clusterName: 'Eastern Traditions',
    quotes: [
      { text: 'Form is emptiness, emptiness is form.', source: 'Heart Sūtra', label: 'P/J314' },
      { text: 'There is, monks, an unborn, unbecome, unmade, unconditioned. If there were not that unborn… no escape would be discerned from what is born...', source: 'Udāna 8.3', label: 'P' },
      { text: 'Whatever is dependently co-arisen, that is explained to be emptiness.', source: 'Mūlamadhyamakakārikā 24.18', label: 'P' }
    ],
    thesesSupported: ['T2', 'T4'],
    stepsActivated: ['S3', 'S15', 'S22']
  },
  {
    id: 'fig-25',
    figureNumber: '25',
    name: 'Hinduism (Upanishads / Śaṅkara)',
    eraAndTradition: 'Vedic / Upanishadic',
    cluster: 'F',
    clusterName: 'Eastern Traditions',
    quotes: [
      { text: 'Neti, neti. (Not this, not this.)', source: 'Bṛhadāraṇyaka Upaniṣad 2.3.6', label: 'P/J314' },
      { text: 'Tat tvam asi. (Thou art that.)', source: 'Chāndogya Upaniṣad 6.8.7', label: 'P' },
      { text: 'Brahman is real; the world is appearance; the individual self is not different from Brahman.', source: 'Vivekacūḍāmaṇi', label: 'P' }
    ],
    thesesSupported: ['T1', 'T2', 'T4'],
    stepsActivated: ['S15', 'S16', 'S18', 'S22']
  },
  {
    id: 'fig-51',
    figureNumber: '51',
    name: 'Swami Vivekananda',
    eraAndTradition: '19th c. / Vedanta',
    cluster: 'F',
    clusterName: 'Eastern Traditions',
    quotes: [
      { text: 'Stand up, be bold, be strong. Take the whole responsibility on your own shoulders, and know that you are the creator of your own destiny.', source: 'Lectures on Jnana Yoga', label: 'P' },
      { text: 'Māyā is not a theory for the explanation of the world; it is simply a statement of facts as they exist.', source: 'Jnana Yoga', label: 'P' }
    ],
    thesesSupported: ['T2', 'T4'],
    stepsActivated: ['S14', 'S15']
  },

  // Cluster G: Classical / Renaissance Tradition
  {
    id: 'fig-14',
    figureNumber: '14',
    name: 'Plato / Socrates',
    eraAndTradition: 'Classical Greek',
    cluster: 'G',
    clusterName: 'Classical / Renaissance',
    quotes: [
      { text: 'Those who rightly engage in philosophy are practicing for dying and being dead.', source: 'Phaedo 64a', label: 'P/J314' },
      { text: 'I know that I know nothing.', source: 'Paraphrase of Apology 21d', label: 'P' },
      { text: 'The unexamined life is not worth living.', source: 'Apology 38a', label: 'P' }
    ],
    thesesSupported: ['T1', 'T3'],
    stepsActivated: ['S3', 'S5', 'S12']
  },
  {
    id: 'fig-26',
    figureNumber: '26',
    name: 'Michel de Montaigne',
    eraAndTradition: '16th c. / French Skeptic',
    cluster: 'G',
    clusterName: 'Classical / Renaissance',
    quotes: [
      { text: 'To philosophize is to learn to die.', source: 'Essays I.20', label: 'P/J314' },
      { text: 'Que sais-je? (What do I know?)', source: 'Essays II.12', label: 'P' },
      { text: 'Every man carries the whole form of the human condition within him.', source: 'Essays III.2', label: 'P' }
    ],
    thesesSupported: ['T1', 'T3'],
    stepsActivated: ['S3', 'S4', 'S9']
  },
  {
    id: 'fig-27',
    figureNumber: '27',
    name: 'Ecclesiastes (Qoheleth)',
    eraAndTradition: 'Ancient Near East, ~3rd c. BCE',
    cluster: 'G',
    clusterName: 'Classical / Renaissance',
    quotes: [
      { text: 'Vanity of vanities, says the Preacher, vanity of vanities! All is vanity.', source: 'Ecclesiastes 1:2', label: 'P/J314' },
      { text: 'He has put eternity into man\'s heart, yet so that he cannot find out what God has done from the beginning to the end.', source: 'Ecclesiastes 3:11', label: 'P/J314' },
      { text: 'In much wisdom is much grief, and he who increases knowledge increases sorrow.', source: 'Ecclesiastes 1:18', label: 'P' }
    ],
    thesesSupported: ['T1', 'T3', 'T4'],
    stepsActivated: ['S1', 'S3', 'S4', 'S12', 'S22']
  },

  // Cluster H: Modern Theological / Philosophical Tradition
  {
    id: 'fig-3',
    figureNumber: '3',
    name: 'Leo Tolstoy',
    eraAndTradition: '19th c. / Russian',
    cluster: 'H',
    clusterName: 'Modern Theological / Philosophical',
    quotes: [
      { text: 'My life came to a standstill. I could breathe, eat, drink, and sleep… but there was no real life in me, because there were no wishes the fulfillment of which I could consider reasonable.', source: 'A Confession IV', label: 'P/J314' },
      { text: 'Is there any meaning in my life that the inevitable death awaiting me does not destroy?', source: 'A Confession V', label: 'P/J314' }
    ],
    thesesSupported: ['T1', 'T3'],
    stepsActivated: ['S1', 'S2', 'S12']
  },
  {
    id: 'fig-4',
    figureNumber: '4',
    name: 'G.K. Chesterton',
    eraAndTradition: '20th c. / Catholic Paradoxist',
    cluster: 'H',
    clusterName: 'Modern Theological / Philosophical',
    quotes: [
      { text: 'The madman is not the man who has lost his reason. The madman is the man who has lost everything except his reason.', source: 'Orthodoxy II', label: 'P/J314' },
      { text: 'Meaninglessness does not come from being weary of pain. Meaninglessness comes from being weary of pleasure.', source: 'Orthodoxy', label: 'P' }
    ],
    thesesSupported: ['T1', 'T2', 'T3'],
    stepsActivated: ['S1', 'S3', 'S8', 'S12']
  },
  {
    id: 'fig-8',
    figureNumber: '8',
    name: 'C.S. Lewis',
    eraAndTradition: '20th c. / Anglican',
    cluster: 'H',
    clusterName: 'Modern Theological / Philosophical',
    quotes: [
      { text: 'If I find in myself a desire which no experience in this world can satisfy, the most probable explanation is that I was made for another world.', source: 'Mere Christianity III.10', label: 'P/J314' },
      { text: 'Go to Him when your need is desperate... and what do you find? A door slammed in your face, and a sound of bolting and double bolting on the inside. After that, silence.', source: 'A Grief Observed I', label: 'P/J314' }
    ],
    thesesSupported: ['T1', 'T3', 'T4'],
    stepsActivated: ['S4', 'S17']
  },
  {
    id: 'fig-38',
    figureNumber: '38',
    name: 'John Shelby Spong',
    eraAndTradition: 'Contemporary / Episcopal',
    cluster: 'H',
    clusterName: 'Modern Theological / Philosophical',
    quotes: [
      { text: 'Argues theism is intellectually untenable and proposes God as the Ground of Being through the lens of nihilistic negation.', source: 'A New Christianity for a New World', label: 'DESC' }
    ],
    thesesSupported: ['T4'],
    stepsActivated: ['S16', 'S20', 'S21']
  },
  {
    id: 'fig-41a',
    figureNumber: '41a',
    name: 'Lev Shestov',
    eraAndTradition: '20th c. / Russian Existentialist',
    cluster: 'H',
    clusterName: 'Modern Theological / Philosophical',
    quotes: [
      { text: 'Philosophy does not begin in wonder, as Aristotle said, but in despair.', source: 'Kierkegaard and the Existential Philosophy', label: 'P/J314' },
      { text: 'The most terrible thing is not death but the meaninglessness of life.', source: 'Attributed', label: '≈' }
    ],
    thesesSupported: ['T1', 'T2', 'T3'],
    stepsActivated: ['S1', 'S3', 'S12']
  },
  {
    id: 'fig-41b',
    figureNumber: '41b',
    name: 'A.W. Tozer',
    eraAndTradition: '20th c. / Evangelical Mystic',
    cluster: 'H',
    clusterName: 'Modern Theological / Philosophical',
    quotes: [
      { text: 'What comes into our minds when we think about God is the most important thing about us.', source: 'The Knowledge of the Holy', label: 'P' },
      { text: 'The blessed ones who possess the Kingdom are they who have repudiated every external thing and have rooted from their hearts all sense of possessing.', source: 'The Pursuit of God ch. 2', label: 'P/J314' }
    ],
    thesesSupported: ['T4'],
    stepsActivated: ['S14', 'S16']
  },
  {
    id: 'fig-41c',
    figureNumber: '41c',
    name: 'Miguel de Unamuno',
    eraAndTradition: '20th c. / Spanish Tragicist',
    cluster: 'H',
    clusterName: 'Modern Theological / Philosophical',
    quotes: [
      { text: 'The man of flesh and bone; the man who is born, suffers, and dies — above all, who dies... the brother, the real brother.', source: 'Tragic Sense of Life I', label: 'P' },
      { text: 'Faith which does not doubt is dead faith.', source: 'Agony of Christianity', label: 'P/J314' }
    ],
    thesesSupported: ['T1', 'T3', 'T4'],
    stepsActivated: ['S4', 'S6', 'S16']
  },
  {
    id: 'fig-50',
    figureNumber: '50',
    name: 'Paul Tillich',
    eraAndTradition: '20th c. / Protestant Dialectical',
    cluster: 'H',
    clusterName: 'Modern Theological / Philosophical',
    quotes: [
      { text: 'The courage to be is rooted in the God who appears when God has disappeared in the anxiety of doubt.', source: 'The Courage to Be, final line', label: 'P/J314' },
      { text: 'Neurotic anxiety is the attempt to avoid non-being by avoiding being.', source: 'The Courage to Be', label: 'P' },
      { text: 'The anxiety of meaninglessness is anxiety about the loss of an ultimate concern, of a meaning which gives meaning to all meanings.', source: 'The Courage to Be', label: 'P' }
    ],
    thesesSupported: ['T1', 'T2', 'T3', 'T4'],
    stepsActivated: ['S1', 'S2', 'S16', 'S17', 'S22']
  },

  // Cluster I: Miscellaneous / Boundary Figures
  {
    id: 'fig-6',
    figureNumber: '6',
    name: 'Fr. Seraphim Rose',
    eraAndTradition: '20th c. / Orthodox Traditionalist',
    cluster: 'I',
    clusterName: 'Boundary / Miscellaneous',
    quotes: [
      { text: 'In Nihilism: The Root of the Revolution of the Modern Age, argues nihilism is a spiritual disease resulting from the rejection of absolute truth — a negative theology in reverse.', source: 'Nihilism: The Root of the Revolution', label: 'DESC' }
    ],
    thesesSupported: ['T1', 'T2'],
    stepsActivated: ['S1', 'S16']
  },
  {
    id: 'fig-19',
    figureNumber: '19',
    name: 'Blaise Pascal',
    eraAndTradition: '17th c. / Jansenist',
    cluster: 'I',
    clusterName: 'Boundary / Miscellaneous',
    quotes: [
      { text: 'The eternal silence of these infinite spaces frightens me.', source: 'Pensées §206', label: 'P/J314' },
      { text: 'All the unhappiness of men arises from one single fact, that they cannot stay quietly in their own chamber.', source: 'Pensées §139', label: 'P/J314' },
      { text: 'This infinite abyss can be filled only with an infinite and immutable object; that is to say, only by God Himself.', source: 'Pensées §425', label: 'P/J314' },
      { text: 'Man is but a reed, the most feeble thing in nature; but he is a thinking reed.', source: 'Pensées §347', label: 'P' }
    ],
    thesesSupported: ['T1', 'T2', 'T3', 'T4'],
    stepsActivated: ['S2', 'S4', 'S9', 'S13', 'S22']
  },
  {
    id: 'fig-34',
    figureNumber: '34',
    name: 'Edgar Saltus',
    eraAndTradition: '19th c. / American Aesthete',
    cluster: 'I',
    clusterName: 'Boundary / Miscellaneous',
    quotes: [
      { text: 'The Philosophy of Disenchantment (1885): introduced Schopenhauerian pessimism to American literature, demonstrating the aesthetic sublimation of nihilism.', source: 'The Philosophy of Disenchantment', label: 'DESC' }
    ],
    thesesSupported: ['T1'],
    stepsActivated: ['S1', 'S9']
  }
];

export const DISPARITY_PAIRINGS: DisparityPairing[] = [
  {
    id: 'pair-1',
    title: 'Ecclesiastes ↔ Heidegger',
    figureA: 'Ecclesiastes (~3rd c. BCE)',
    figureB: 'Martin Heidegger (20th c.)',
    temporalDistance: '~2,200 years',
    culturalDistance: 'Ancient Near Eastern Wisdom ↔ 20th c. German Phenomenology',
    religiousDistance: 'Hebrew Monotheism ↔ Post-Christian Atheism',
    sharedStructure: 'Both describe the collapse of worldly vanity/busyness as the disclosure of groundless Being ("All is vanity" ↔ "Anxiety reveals the nothing").',
    divergenceOrParadox: 'Ecclesiastes arrives at radical void within a theistic framework; Heidegger arrives at the same void outside theism, demonstrating the experience transcends doctrinal containers.'
  },
  {
    id: 'pair-2',
    title: 'John of the Cross ↔ Schopenhauer',
    figureA: 'St. John of the Cross (16th c.)',
    figureB: 'Arthur Schopenhauer (19th c.)',
    temporalDistance: '~300 years',
    culturalDistance: 'Spanish Carmelite Monasticism ↔ German Pessimism',
    religiousDistance: 'Catholic Mysticism ↔ Secular Pessimism / Buddhist Inflected',
    sharedStructure: 'Both formalize a systematic via negativa where total detachment from desire makes the world as representation dissolve into nothing ("Desire the knowledge of nothing" ↔ "Denial of the will: the world is nothing").',
    divergenceOrParadox: 'John of the Cross identifies this state as divine union; Schopenhauer leaves it as radical absence of will, yet both deem this purgation the supreme human attainment.'
  },
  {
    id: 'pair-3',
    title: 'Pascal ↔ Zapffe',
    figureA: 'Blaise Pascal (17th c.)',
    figureB: 'Peter Wessel Zapffe (20th c.)',
    temporalDistance: '~300 years',
    culturalDistance: 'French Jansenist Classical ↔ Norwegian Modern Biosophical',
    religiousDistance: 'Catholic Jansenism ↔ Secular Anti-Natalism',
    sharedStructure: 'Both diagnose human activity as a feverish, compulsive evasion of the silent void ("Cannot stay quietly in chamber" ↔ The 4 suppression mechanisms: isolation, anchoring, distraction, sublimation).',
    divergenceOrParadox: 'Pascal asserts the void can only be satisfied by God; Zapffe asserts the void cannot be satisfied at all and mandates reproductive cessation.'
  },
  {
    id: 'pair-4',
    title: 'Thérèse of Lisieux ↔ Ligotti',
    figureA: 'Thérèse of Lisieux (19th c.)',
    figureB: 'Thomas Ligotti (21st c.)',
    temporalDistance: '~100 years',
    culturalDistance: 'Normandy Carmelite Cloister ↔ Contemporary American Horror',
    religiousDistance: 'Catholic Saint ↔ Radical Secular Pessimist',
    sharedStructure: 'Both confront consciousness as an abyss of darkness and absolute mockery ("A night still more complete, the night of nothingness" ↔ "Consciousness is the parent of all horrors").',
    divergenceOrParadox: 'Thérèse experiences the darkness as the dark night of purification without abandoning love; Ligotti concludes existence is malignantly useless. The same abyss yields opposite interpretations.'
  },
  {
    id: 'pair-5',
    title: 'Merton ↔ Heidegger',
    figureA: 'Thomas Merton (20th c.)',
    figureB: 'Martin Heidegger (20th c.)',
    temporalDistance: 'Contemporaneous (20th c.)',
    culturalDistance: 'American Trappist Abbey ↔ Black Forest Phenomenology',
    religiousDistance: 'Catholic Contemplative ↔ Fundamental Ontologist',
    sharedStructure: 'Both situate a primordial Nothing at the exact epicenter of the self ("Point of nothingness at the center of our being" ↔ "Dasein means to be held out into the nothing").',
    divergenceOrParadox: 'Merton identifies this spark as belonging entirely to God; Heidegger identifies it as the ontological condition of Being itself. The experience is identical; the vocabulary is theological vs. ontological.'
  }
];

export const PARADOX_APORIA_MATRIX: ParadoxAporia[] = [
  {
    id: 'apo-1',
    title: 'The Productive Nothing',
    figures: ['Miguel de Molinos', 'Meister Eckhart', 'Laozi (Taoism)', 'Nāgārjuna (Buddhism)'],
    formulation: 'The Nothing is the most productive reality: not inert vacuum, but the dynamic condition of possibility for all genuine disclosure of Being and spiritual transformation.'
  },
  {
    id: 'apo-2',
    title: 'The Rare Universal',
    figures: ['Peter Wessel Zapffe', 'Ernest Becker', 'Blaise Pascal', 'Aldous Huxley'],
    formulation: 'The nihilistic experience is structurally universal to human consciousness, yet encountered in full depth only rarely because psychological and cultural architectures are engineered specifically to suppress it.'
  },
  {
    id: 'apo-3',
    title: 'The Negative Positive',
    figures: ['St. John of the Cross', 'Pseudo-Dionysius', 'Upanishadic Sages (Hinduism)'],
    formulation: 'The via negativa — the systematic subtraction and negation of all images, concepts, and desires — leads to the most affirmative and unmediated encounter with the Transcendent.'
  },
  {
    id: 'apo-4',
    title: 'The Atheist Mystic',
    figures: ['Arthur Schopenhauer', 'Emil Cioran', 'Martin Heidegger'],
    formulation: 'Thinkers who explicitly reject personal theism describe affective and cognitive states of ego-loss, serenity, and void that are structurally indistinguishable from classical theistic mystical union.'
  },
  {
    id: 'apo-5',
    title: 'The Faithful Nihilist',
    figures: ['Thérèse of Lisieux', 'Martin Luther', 'John Bunyan'],
    formulation: 'Figures of radical religious commitment undergo terrifying encounters with absolute nothingness and abandonment that mirror secular existential dread, revealing nihilism as the internal crucible of faith.'
  },
  {
    id: 'apo-6',
    title: 'The Transcendent Nothing',
    figures: ['Paul Tillich', 'Thomas Merton', 'Meister Eckhart'],
    formulation: 'The Nothing at the center of the self is the exact locus of contact between the finite and the infinite: God is not an object within the universe, but the unconditioned Void underlying all existence.'
  },
  {
    id: 'apo-7',
    title: 'The Useful Void',
    figures: ['Laozi (Tao Te Ching 11)', 'Buddhism (Heart Sūtra)'],
    formulation: 'Form functions only by virtue of emptiness: the empty hub turns the wheel, the hollow vessel holds the water, and empty awareness makes cognition possible.'
  },
  {
    id: 'apo-8',
    title: 'The Silencing of God',
    figures: ['Thomas Aquinas', 'Thomas Keating', 'Pseudo-Dionysius'],
    formulation: 'The highest development of philosophical or theological discourse culminates in radical aphasia: all words are recognized as straw, and language surrenders to absolute sacred silence.'
  }
];

/**
 * Transforms the Journal314 Densification Corpus into typed GraphNode and GraphEdge entities
 * with complete provenance and dialectical linkages.
 */
export function generateJournal314GraphEntities(): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const docId = 'doc_journal314_densification';
  const sourceFile = 'journal314_corpus.md';

  // 1. Root Thesis Nodes (L5 Ontological Claims)
  JOURNAL_THESES.forEach(t => {
    const nodeId = `thesis_${t.code.toLowerCase()}`;
    nodes.push({
      id: nodeId,
      label: `${t.code}: ${t.title}`,
      level: 1,
      type: 'theme',
      stratum: 'L5_ONTOLOGICAL_CLAIM',
      stance: 'Current',
      provenance: {
        documentId: docId,
        sourceFile,
        extractedAt: new Date().toISOString(),
        snippet: t.claim
      }
    });
  });

  // 2. Figure Nodes (Figures with quotes)
  JOURNAL_FIGURES.forEach(fig => {
    const nodeId = `figure_${fig.id}`;
    const primaryQuote = fig.quotes[0]?.text || fig.eraAndTradition;
    nodes.push({
      id: nodeId,
      label: `${fig.name} [Fig. ${fig.figureNumber}]`,
      level: 2,
      type: 'figure',
      stratum: 'L3_INTERPRETIVE_CLASSIFICATION',
      stance: 'Current',
      provenance: {
        documentId: docId,
        sourceFile,
        extractedAt: new Date().toISOString(),
        snippet: `[${fig.clusterName}] ${primaryQuote}`
      }
    });

    // Link Figure to supported Theses
    fig.thesesSupported.forEach(thCode => {
      const thesisId = `thesis_${thCode.toLowerCase()}`;
      edges.push({
        id: `edge_${fig.id}_${thCode.toLowerCase()}`,
        source: nodeId,
        target: thesisId,
        type: 'dialectical',
        dialecticalRelation: 'grounds',
        label: `grounds ${thCode}`,
        warrant: `${fig.name} provides primary textual warrant for Thesis ${thCode}`
      });
    });
  });

  // 3. Maximum Disparity Edge Pairings
  DISPARITY_PAIRINGS.forEach(pair => {
    // Find matching figures
    const figA = JOURNAL_FIGURES.find(f => pair.figureA.toLowerCase().includes(f.name.toLowerCase()));
    const figB = JOURNAL_FIGURES.find(f => pair.figureB.toLowerCase().includes(f.name.toLowerCase()));
    if (figA && figB) {
      edges.push({
        id: `edge_pair_${figA.id}_${figB.id}`,
        source: `figure_${figA.id}`,
        target: `figure_${figB.id}`,
        type: 'dialectical',
        dialecticalRelation: 'underdetermines',
        label: `disparity pairing: ${pair.title}`,
        warrant: pair.sharedStructure
      });
    }
  });

  // 4. Paradox / Aporia Nodes
  PARADOX_APORIA_MATRIX.forEach(apo => {
    const apoNodeId = `aporia_${apo.id}`;
    nodes.push({
      id: apoNodeId,
      label: `Aporia: ${apo.title}`,
      level: 2,
      type: 'aporia',
      stratum: 'L2_PHENOMENOLOGICAL_STRUCTURE',
      stance: 'Current',
      provenance: {
        documentId: docId,
        sourceFile,
        extractedAt: new Date().toISOString(),
        snippet: apo.formulation
      }
    });

    // Link to Thesis T2 or T4
    edges.push({
      id: `edge_apo_${apo.id}_t2`,
      source: apoNodeId,
      target: 'thesis_t2',
      type: 'dialectical',
      dialecticalRelation: 'qualifies',
      label: 'aporia qualification'
    });
  });

  return { nodes, edges };
}
