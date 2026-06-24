/* ============================================================
   ENGLISH ЕГЭ · data.js — расширенный контент
   ============================================================ */

/* ============ LISTENING ============ */
const DATA_LISTENING = {
  tag:"Tasks 1–9", icon:"🎧",
  desc:"Hear short texts and match speakers to statements (Task 1), True/False/Not Stated (Tasks 2–8), and choose the correct answer (Task 9).",
  theory:[
    "Task 1: Read the statements A–G BEFORE listening. Match each speaker to one statement. There is ONE extra.",
    "Tasks 2–8: Decide True/False/Not Stated. 'Not Stated' means the information is NOT in the recording.",
    "Task 9: Multiple-choice comprehension. Listen for the EXACT answer — don't choose based on remembered keywords only.",
    "Strategy: underline key words in statements before listening. Expect paraphrasing.",
    "Common trap: the speaker may use the same word but in a different meaning — check the full context."
  ],
  practice:[
    { q:"The statement says 'The speaker finds hiking relaxing'. You hear: 'I enjoy walking in the mountains — it helps me unwind.' Is this True, False, or Not Stated?",
      type:"choice", opts:["True","False","Not Stated"], answer:0,
      explain:"'Helps me unwind' = finds it relaxing → TRUE." },
    { q:"The statement: 'The speaker has never been abroad.' You hear: 'I haven't had the chance to travel internationally yet.' True / False / Not Stated?",
      type:"choice", opts:["True","False","Not Stated"], answer:0,
      explain:"'Haven't had the chance to travel internationally' ≈ 'never been abroad' → TRUE." },
    { q:"The statement: 'The speaker prefers online shopping to going to stores.' You hear: 'Sometimes I buy things online, but I really enjoy browsing in physical shops.' True / False / Not Stated?",
      type:"choice", opts:["True","False","Not Stated"], answer:1,
      explain:"The speaker says they ENJOY physical shops more → FALSE." },
    { q:"Statement: 'The speaker's brother is a doctor.' You hear: 'My sister works in healthcare.' True / False / Not Stated?",
      type:"choice", opts:["True","False","Not Stated"], answer:2,
      explain:"A SISTER is mentioned, not a brother. 'Brother' is not confirmed or denied → NOT STATED." },
    { q:"In Task 1 (speaker matching), what should you do if you are unsure about one speaker?",
      type:"choice",
      opts:["Leave it blank","Choose the statement that's left after matching the others","Always choose statement A","Listen for the speaker's name"],
      answer:1, explain:"Use the process of elimination — if 6 speakers matched to statements, the 7th takes the remaining one (still check it makes sense)." }
  ]
};

/* ============ READING ============ */
const DATA_READING = {
  tag:"Tasks 10–11", icon:"📖",
  desc:"Task 10: match headings to paragraphs. Task 11: read a text and choose the correct sentence to fill in each gap.",
  theory:[
    "Task 10 (headings): read the FIRST and LAST sentence of each paragraph — they carry the main idea.",
    "Task 10: watch for synonyms and paraphrasing between heading words and paragraph content.",
    "Task 11 (sentence gaps): the sentence before and after the gap are the clues. Check pronouns, verb tenses, and logical connectors.",
    "Strategy for Task 11: insert each option and read the surrounding sentences aloud to check logical flow.",
    "Common mistake: choosing an option with a matching keyword but wrong logical connection."
  ],
  text:"Many people believe that learning a foreign language as an adult is almost impossible. However, recent research suggests that this idea (A)___. Adults actually have several advantages: they understand grammar rules consciously and (B)___ from their own experience to learn faster. The real obstacle is not age but motivation. People who study a language because they (C)___ tend to give up quickly. In contrast, learners with a clear personal goal — a job, an exam, or travel — (D)___ much faster.",
  gaps:[
    { id:"A", options:["is far from true","has been proven correct","makes people sad","stops all progress"], answer:0,
      explain:"'is far from true' — the idea is WRONG (However signals a contradiction). The research DISPROVES the belief." },
    { id:"B", options:["can benefit","cannot learn","forget grammar","stop reading"], answer:0,
      explain:"'can benefit from their own experience' — adults use life experience to learn. Continues listing advantages." },
    { id:"C", options:["have to rather than want to","love every minute","travel a lot","know the target culture"], answer:0,
      explain:"'have to rather than want to' — studying because of obligation → gives up quickly. Logical with 'tend to give up'." },
    { id:"D", options:["make progress","waste time","lose motivation","stop learning"], answer:0,
      explain:"'make progress much faster' — the result for motivated learners. Contrast with 'give up quickly'." }
  ],
  practice:[
    { q:"In Task 10, what is the best strategy when you find the same word in both a heading and a paragraph?",
      type:"choice",
      opts:["Always match them","Verify it's the main idea, not just a detail","Skip that paragraph","Always choose a different heading"],
      answer:1, explain:"Same word ≠ correct match. The heading must capture the MAIN IDEA of the paragraph, not just mention a word." },
    { q:"In Task 11 (sentence gaps), you notice the gap is followed by 'However, this approach had a downside.' What type of sentence fits before it?",
      type:"choice",
      opts:["A sentence describing a problem","A sentence describing a positive method","A question about the topic","A sentence with a similar negative idea"],
      answer:1, explain:"'However, this approach had a downside' — the word 'However' signals a CONTRAST, so the previous sentence should be POSITIVE about the approach." },
    { q:"A paragraph starts: 'This was not always the case. In the past, …' Which heading fits best?",
      type:"choice",
      opts:["A recent change in attitudes","The history of the issue","A future prediction","A list of problems"],
      answer:0, explain:"'This was not always the case' signals a CHANGE — so the heading about a recent change fits." },
    { q:"You are matching headings to paragraphs. There are 7 paragraphs and 8 headings. What should you do with the extra heading?",
      type:"choice", opts:["Use it for the longest paragraph","Leave it unused","Match it to two paragraphs","Add it as a sub-heading"],
      answer:1, explain:"In Task 10, one heading is always extra and should NOT be used. Each paragraph gets exactly one heading." }
  ]
};

/* ============ GRAMMAR (tasks 12–18) ============ */
const DATA_GRAMMAR = {
  tag:"Tasks 12–18", icon:"🧩",
  desc:"Change the word in brackets into the correct grammatical form.",
  theory:[
    "Past Simple: finished action in the past (yesterday, last year, in 2020). Irregular verbs: go→went, take→took, write→wrote.",
    "Present Perfect: result matters now (I have finished). Signal words: just, already, ever, never, yet, since, for.",
    "Past Perfect: happened BEFORE another past action (By the time X, Y had already …).",
    "Future: will + inf (prediction/decision now), going to + inf (plan/intention), Present Continuous (arranged).",
    "Passive: be + V3 (Past Simple Passive: was/were built; Present Passive: is/are built; Future Passive: will be built).",
    "Conditionals: Type 1 (if + Present, will); Type 2 (if + Past, would); Type 3 (if + Past Perfect, would have).",
    "Comparatives: more + adj / adj+er. Superlatives: the most + adj / the adj+est.",
    "Irregular plurals: man→men, woman→women, child→children, tooth→teeth, foot→feet."
  ],
  items:[
    {stem:"Last summer we ___ (GO) to Italy for two weeks.", answer:["went"],
     rule:"Past Simple — finished action in the past (last summer). Irregular: go→went."},
    {stem:"By the time the show started, the children ___ (FALL) already asleep.", answer:["had fallen","had already fallen"],
     rule:"Past Perfect — action completed BEFORE another past event (by the time). had + V3: fall→fallen."},
    {stem:"This is one of the ___ (GOOD) films I have ever seen.", answer:["best"],
     rule:"Superlative: good→better→the best (one of the + superlative + plural noun)."},
    {stem:"The new bridge ___ (BUILD) next year.", answer:["will be built"],
     rule:"Future Simple Passive — someone will build the bridge. will be + V3: build→built."},
    {stem:"Look! The kids ___ (PLAY) in the garden right now.", answer:["are playing"],
     rule:"Present Continuous — action happening NOW (Look!, right now). am/is/are + V-ing."},
    {stem:"She told me she ___ (WRITE) the letter the day before.", answer:["had written"],
     rule:"Reported speech + Past Perfect (the day before = sequence). had + written."},
    {stem:"There are three ___ (WOMAN) standing near the gate.", answer:["women"],
     rule:"Irregular plural: woman→women (not womans)."},
    {stem:"If I ___ (BE) you, I would accept the offer.", answer:["were"],
     rule:"Type 2 conditional — unreal present situation. If I were you (subjunctive)."},
    {stem:"The report ___ (CHECK) by the manager at the moment.", answer:["is being checked"],
     rule:"Present Continuous Passive (at the moment, work in progress). is being + V3."},
    {stem:"We ___ (LIVE) in this city since 2015.", answer:["have lived","have been living"],
     rule:"Present Perfect (since 2015 → up to now). have + V3."},
    {stem:"If they had left earlier, they ___ (CATCH) the train.", answer:["would have caught"],
     rule:"Type 3 conditional — unreal past. If + Past Perfect → would have + V3."},
    {stem:"By 2030, scientists ___ (FIND) a cure for many diseases.", answer:["will have found"],
     rule:"Future Perfect — action completed by a specific future time. will have + V3."},
    {stem:"He ___ (NOT/SEE) that film yet, so let's watch it tonight.", answer:["hasn't seen","has not seen"],
     rule:"Present Perfect + yet (negative). hasn't/hasn't + V3."},
    {stem:"The children ___ (TEACH) French by a native speaker last year.", answer:["were taught"],
     rule:"Past Simple Passive. were + V3: teach→taught."},
    {stem:"She speaks English much ___ (FLUENT) than her brother.", answer:["more fluently"],
     rule:"Comparative adverb: fluently→more fluently (adverb with -ly → more + adverb)."},
  ]
};

/* ============ WORD FORMATION (tasks 19–25) ============ */
const DATA_WORDFORM = {
  tag:"Tasks 19–25", icon:"🔤",
  desc:"Form a word from the one in capitals so that it fits the sentence grammatically and lexically.",
  theory:[
    "Noun suffixes: -tion/-sion (describe→description), -ment (achieve→achievement), -ness (happy→happiness), -ity (able→ability), -ance/-ence (important→importance).",
    "Adjective suffixes: -ful (hope→hopeful), -less (hope→hopeless), -ous (fame→famous), -al (nature→natural), -able/-ible (wash→washable).",
    "Adverb suffix: -ly (quick→quickly, careful→carefully).",
    "Negative prefixes: un- (happy→unhappy), im- (possible→impossible), in- (correct→incorrect), dis- (agree→disagree), ir- (regular→irregular).",
    "Agent nouns: -er/-or (teach→teacher), -ist (art→artist), -ian (music→musician).",
    "Always check: part of speech needed? Positive or negative meaning? Singular or plural?"
  ],
  items:[
    {stem:"The discovery was of great ___ (IMPORTANT) to medicine.", answer:["importance"],
     rule:"Noun needed. important → importance (-ance suffix)."},
    {stem:"He behaved in a very ___ (CHILD) way and everyone was shocked.", answer:["childish"],
     rule:"Adjective needed (modifies 'way'). child → childish (-ish = 'like a child', immature)."},
    {stem:"Unfortunately, the experiment was a complete ___ (FAIL).", answer:["failure"],
     rule:"Noun needed. fail → failure (-ure suffix)."},
    {stem:"The weather here is quite ___ (PREDICT) — you never know what to expect.", answer:["unpredictable"],
     rule:"Adjective with negative meaning (you never know). predict → predictable → unpredictable (un-)."},
    {stem:"She gave a ___ (DESCRIBE) of the new project to the board.", answer:["description"],
     rule:"Noun. describe → description (-ion, b→p)."},
    {stem:"Their ___ (WILLING) to help was greatly appreciated.", answer:["willingness"],
     rule:"Noun. willing → willingness (-ness)."},
    {stem:"It is ___ (LAW) to smoke inside the building.", answer:["unlawful","illegal"],
     rule:"Adjective with negative meaning. law → lawful → unlawful (un-+ful)."},
    {stem:"The town has grown ___ (RAPID) over the last decade.", answer:["rapidly"],
     rule:"Adverb (modifies 'grown'). rapid → rapidly (-ly)."},
    {stem:"There was a slight ___ (DIFFER) between the two reports.", answer:["difference"],
     rule:"Noun. differ → difference (-ence)."},
    {stem:"The ___ (SCIENCE) community welcomed the new findings.", answer:["scientific"],
     rule:"Adjective. science → scientific (-tific, common in academic contexts)."},
    {stem:"She is ___ (KNOWLEDGE) about art history.", answer:["knowledgeable"],
     rule:"Adjective. knowledge → knowledgeable (-able)."},
    {stem:"The company's ___ (EXPAND) into new markets surprised investors.", answer:["expansion"],
     rule:"Noun. expand → expansion (-sion)."},
    {stem:"He was ___ (APPOINT) as the new director last month.", answer:["appointed"],
     rule:"Past passive participle. appoint → appointed."},
    {stem:"The film received ___ (CRITIC) reviews from every major newspaper.", answer:["critical"],
     rule:"Adjective. critic → critical (-al). Critical reviews = reviews involving criticism."},
    {stem:"___ (GLOBE), the demand for renewable energy is increasing.", answer:["Globally"],
     rule:"Adverb (modifies the whole sentence). global → globally (-ly)."},
  ]
};

/* ============ VOCABULARY (tasks 26–31) ============ */
const DATA_VOCAB = {
  tag:"Tasks 26–31", icon:"🎯",
  desc:"Choose the word that fits the sentence in meaning and collocation.",
  theory:[
    "Collocations: make a decision / take a chance / do homework / have a rest / pay attention.",
    "Phrasal verbs: look after (care for), look up (search), look forward to (anticipate), give up (stop), put off (postpone).",
    "Fixed phrases: make up your mind, take part in, in spite of, as a result, on the other hand.",
    "False friends: actual (real, not 'актуальный'), sympathetic (understanding, not 'симпатичный').",
    "Prepositions: depend ON, interested IN, good AT, responsible FOR, afraid OF, similar TO."
  ],
  items:[
    {stem:"Scientists are trying to ___ a solution to the problem.", options:["find","make","do","get"], answer:0,
     rule:"find a solution — fixed collocation. make a decision, do homework, get a chance."},
    {stem:"You should ___ attention to the road signs.", options:["pay","give","make","take"], answer:0,
     rule:"pay attention — fixed expression."},
    {stem:"The plane ___ off exactly on time.", options:["took","got","made","went"], answer:0,
     rule:"take off — phrasal verb (plane lifts into the air)."},
    {stem:"I completely ___ with your point of view.", options:["agree","accept","approve","admit"], answer:0,
     rule:"agree WITH — agree with somebody's view. approve OF, accept (no preposition in this sense)."},
    {stem:"Could you ___ me a favour and close the window?", options:["do","make","give","take"], answer:0,
     rule:"do somebody a favour — fixed collocation."},
    {stem:"The company decided to ___ a new advertising campaign.", options:["launch","open","start up","raise"], answer:0,
     rule:"launch a campaign — fixed collocation (launch = start something big)."},
    {stem:"Please ___ in this form and sign at the bottom.", options:["fill","write","put","do"], answer:0,
     rule:"fill in a form — phrasal verb (complete a form)."},
    {stem:"The noise next door prevented me ___ sleeping.", options:["from","of","to","at"], answer:0,
     rule:"prevent somebody FROM doing something — fixed preposition."},
    {stem:"She has a real ___ for languages — she speaks five.", options:["talent","skill","ability","habit"], answer:0,
     rule:"talent FOR — a natural gift. skill AT, ability TO."},
    {stem:"He was ___ of stealing the money but later proved innocent.", options:["accused","blamed","charged","suspected"], answer:0,
     rule:"accused OF + noun/gerund. blamed FOR, charged WITH, suspected OF."},
    {stem:"The new policy will ___ effect from January.", options:["take","come","make","go"], answer:0,
     rule:"take effect — fixed collocation (begin to work/apply)."},
    {stem:"After years of practice, she finally ___ her goal.", options:["achieved","reached","gained","obtained"], answer:0,
     rule:"achieve a goal — fixed collocation. reach a destination, gain experience, obtain information."},
    {stem:"The report ___ attention to several important issues.", options:["drew","paid","gave","brought"], answer:0,
     rule:"draw attention to — fixed collocation (highlight)."},
    {stem:"I'm really looking ___ to the holidays.", options:["forward","ahead","up","out"], answer:0,
     rule:"look forward to — phrasal verb (anticipate with pleasure)."},
    {stem:"We need to ___ a decision before the deadline.", options:["make","do","take","give"], answer:0,
     rule:"make a decision — fixed collocation."},
  ]
};

/* ============ WRITING ============ */
const DATA_WRITING = {
  email:{
    tag:"Task 37",
    title:"Personal Letter (Email)",
    intro:"Write a reply to your English-speaking friend. Length: 100–140 words. Answer their 3 questions and ask 3 of your own on the topic they suggest.",
    checklist:[
      "Greeting: Dear + name,",
      "Opening: Thank them for the letter + reference to previous contact",
      "Answer all 3 of their questions",
      "Ask 3 questions on the suggested topic",
      "Closing phrase (Hope to hear from you soon)",
      "Sign off: Best wishes, / Your name"
    ],
    phrases:[
      "Thanks a lot for your letter","I was really glad to hear from you",
      "Sorry I haven't written for so long — I've been busy with…",
      "You asked me about… Well, …","As for…, I think…","Speaking of…, I usually…",
      "By the way, I'd love to know…","Anyway, I've got to go now",
      "Write back soon!","Best wishes, / Yours,"
    ],
    template:`Dear Mike,

Thanks a lot for your letter. I was really glad to hear from you again!
Sorry I haven't written for so long — I've been busy with my exams.

You asked me about [topic 1]. Well, [answer 1].
As for [topic 2], I think [answer 2].
Speaking of [topic 3], I usually [answer 3].

By the way, I'd love to know more about [their suggested topic].
[Question 1?] [Question 2?] [Question 3?]

Anyway, I've got to go now — [reason].
Hope to hear from you soon!

Best wishes,
Alex`
  },
  essay:{
    tag:"Task 38",
    title:"Opinion Essay",
    intro:"Write an essay giving your opinion on a statement. Length: 200–250 words. Use formal style. 5-paragraph structure.",
    checklist:[
      "§1 Introduction: paraphrase the topic + state there are different opinions",
      "§2 Your opinion + 2–3 arguments with examples",
      "§3 Opposing view + 1–2 counterarguments",
      "§4 Why you disagree with the opposing view",
      "§5 Conclusion: restate your opinion in different words"
    ],
    phrases:[
      "Nowadays many people argue whether…","In my opinion / From my point of view",
      "Firstly, … Secondly, … Moreover, … Furthermore, …",
      "For instance / For example / To illustrate",
      "However, some people think otherwise. They claim that…",
      "Nevertheless, I cannot agree with this because…",
      "To sum up / In conclusion","I firmly believe that…","It seems to me that…"
    ],
    template:`Nowadays many people argue whether [topic]. While some believe that [one view], others are convinced that [opposite view]. In this essay I will express my point of view.

In my opinion, [your position]. Firstly, [argument 1]. For example, [example]. Moreover, [argument 2]. Furthermore, [argument 3].

However, some people think otherwise. They claim that [opposing view]. They also argue that [opposing argument 2].

Nevertheless, I cannot agree with this opinion. [Refutation]. That is why their argument does not seem convincing to me.

To sum up, despite different views, I firmly believe that [restate position]. [Final thought about the importance of the issue].`
  }
};

/* ============ SPEAKING ============ */
const DATA_SPEAKING = {
  tag:"Tasks 1–4 (oral)", icon:"🎙️",
  tasks:[
    {
      num:"Task 1",
      title:"Read aloud",
      desc:"Read a short text (1 minute preparation, 1.5 minutes reading). Focus on correct stress, intonation, and pace.",
      tips:[
        "Pause at punctuation marks (commas, full stops).",
        "Stress content words (nouns, verbs, adjectives) — not function words (a, the, in).",
        "Don't read too fast — aim for natural speech pace.",
        "Mark difficult words beforehand during preparation time.",
        "Practice with tongue twisters: 'She sells seashells by the seashore.'"
      ]
    },
    {
      num:"Task 2",
      title:"Questions from an ad",
      desc:"Ask 5 questions about the ad in 1.5 minutes. You have 1.5 minutes to prepare.",
      tips:[
        "Ask about: price, location, time, people (who/how many), specific details from the ad.",
        "Use different question types: What…? Where…? How much…? How many…? When…? Who…?",
        "Do NOT ask Yes/No questions — use open-ended Wh- questions.",
        "Cover ALL the required points (usually 5 specific areas are given).",
        "Example: 'How much does it cost per day?'"
      ],
      phrases:["How much does it cost?","Where exactly is it located?","How long does it last?","How many people can attend?","What is included in the price?","When does it start/finish?","What should I bring with me?"]
    },
    {
      num:"Task 3",
      title:"Describe a photo",
      desc:"Describe a photo for 2 minutes (2 minutes preparation).",
      tips:[
        "Structure: introduction → what you see → describe details → guess context → personal comment.",
        "Start: 'I've chosen photo number … .'",
        "Describe: background, foreground, people, objects, atmosphere.",
        "Speculate: 'It looks like…', 'I think the people are…', 'It might be…'",
        "End with a personal comment: 'I find this photo interesting because…'"
      ],
      phrases:[
        "I've chosen photo number …",
        "In this photo I can see …",
        "In the foreground / background there is …",
        "The photo was probably taken in / at …",
        "It looks like … / It seems that …",
        "The atmosphere seems … (peaceful / busy / exciting)",
        "I find this photo interesting / impressive because …"
      ]
    },
    {
      num:"Task 4",
      title:"Compare two photos",
      desc:"Compare two photos and give a justified preference (2 minutes preparation, 2 minutes speaking).",
      tips:[
        "Structure: brief description of both → comparison → similarities → differences → preference with reason.",
        "Use comparison language: 'While photo 1 shows …, photo 2 depicts …'",
        "State your preference: 'I would rather … because …'",
        "Justify: give at least 2 reasons for your preference.",
        "Don't just describe — COMPARE and CONCLUDE."
      ],
      phrases:[
        "Both photos show …",
        "While in the first photo …, in the second one …",
        "The main difference between them is that …",
        "Another similarity/difference is …",
        "In my opinion, the first/second photo is more … because …",
        "I would choose the [first/second] option because …",
        "To sum up, I prefer … as it seems more …"
      ]
    }
  ]
};

/* ============ IRREGULAR VERBS ============ */
const IRREGULAR = [
  ["be","was / were","been"],["begin","began","begun"],["break","broke","broken"],
  ["bring","brought","brought"],["build","built","built"],["buy","bought","bought"],
  ["catch","caught","caught"],["choose","chose","chosen"],["come","came","come"],
  ["do","did","done"],["draw","drew","drawn"],["drink","drank","drunk"],
  ["drive","drove","driven"],["eat","ate","eaten"],["fall","fell","fallen"],
  ["feel","felt","felt"],["find","found","found"],["fly","flew","flown"],
  ["forget","forgot","forgotten"],["get","got","got / gotten"],["give","gave","given"],
  ["go","went","gone"],["grow","grew","grown"],["have","had","had"],
  ["hear","heard","heard"],["keep","kept","kept"],["know","knew","known"],
  ["leave","left","left"],["lose","lost","lost"],["make","made","made"],
  ["mean","meant","meant"],["meet","met","met"],["pay","paid","paid"],
  ["put","put","put"],["read","read","read"],["ride","rode","ridden"],
  ["run","ran","run"],["say","said","said"],["see","saw","seen"],
  ["sell","sold","sold"],["send","sent","sent"],["show","showed","shown"],
  ["sing","sang","sung"],["sit","sat","sat"],["sleep","slept","slept"],
  ["speak","spoke","spoken"],["spend","spent","spent"],["stand","stood","stood"],
  ["swim","swam","swum"],["take","took","taken"],["teach","taught","taught"],
  ["tell","told","told"],["think","thought","thought"],["throw","threw","thrown"],
  ["understand","understood","understood"],["wear","wore","worn"],
  ["win","won","won"],["write","wrote","written"]
];

/* ============ HOMEWORK ============ */
const EN_HOMEWORK = [
  {
    id:"hw_listen", title:"Listening (Tasks 1–9)",
    items:[
      "Watch 2 YouTube videos in English with subtitles (news/documentary)",
      "Practice True/False/Not Stated with 10 statements from FIPI bank",
      "Complete Task 1 (speaker matching) from one past exam paper",
      "Learn 20 new vocabulary items from the topic 'Society & Technology'",
      "Listen to one BBC podcast or radio show without subtitles",
    ]
  },
  {
    id:"hw_read", title:"Reading (Tasks 10–11)",
    items:[
      "Read one long English article (500+ words), identify main idea of each paragraph",
      "Complete Tasks 10–11 from 3 different past exam papers",
      "Practice the 'heading matching' technique with a news article",
      "Learn the strategy: underline topic sentence in each paragraph",
      "Complete 5 sentence-gap exercises from sdamgia.ru",
    ]
  },
  {
    id:"hw_grammar", title:"Grammar (Tasks 12–18)",
    items:[
      "Revise all 12 tense forms with time expressions",
      "Complete 15 grammar fill-in tasks (tasks 12–18 format)",
      "Write sentences using each of: Past Perfect, Future Perfect, all 3 conditionals",
      "Learn all irregular verbs (go through the full list)",
      "Complete 2 full sections of tasks 12–18 from FIPI bank",
    ]
  },
  {
    id:"hw_wordform", title:"Word Formation (Tasks 19–25)",
    items:[
      "Make flashcards for 50 words with their noun/verb/adjective/adverb forms",
      "Learn all common suffixes and prefixes (theory block)",
      "Complete 15 word formation exercises",
      "Practice negative prefixes: un-, im-, in-, dis-, ir-, il-",
      "Complete 2 full sets of tasks 19–25 from FIPI bank",
    ]
  },
  {
    id:"hw_vocab", title:"Vocabulary & Collocations (Tasks 26–31)",
    items:[
      "Learn 30 common collocations (make/do/take/have + noun)",
      "Learn 20 phrasal verbs for the exam",
      "Complete 15 vocabulary choice exercises",
      "Practice prepositions after adjectives: good AT, interested IN, etc.",
      "Complete 2 full sets of tasks 26–31",
    ]
  },
  {
    id:"hw_write", title:"Writing (Tasks 37–38)",
    items:[
      "Write one personal letter (email) following the template checklist",
      "Write one opinion essay on a given topic (200–250 words)",
      "Check your essay: paragraph structure, connectors, formal style",
      "Learn all the useful phrases for letters and essays",
      "Write another essay on a different topic without using a template",
    ]
  },
  {
    id:"hw_speak", title:"Speaking (Tasks 1–4)",
    items:[
      "Record yourself reading a text aloud — listen back and note errors",
      "Practise asking 5 Wh-questions about a real-world ad",
      "Describe 3 photos using the structure: intro → describe → speculate → comment",
      "Compare 2 photos on the same topic — practise giving a justified preference",
      "Do a full 15-minute speaking test simulation (all 4 tasks)",
    ]
  }
];
