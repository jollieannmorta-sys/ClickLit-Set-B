/* =========================================================
   CLICKLIT SET B – CONTENT
   Edit this file to change words, sentences, quizzes, stories.

   Activity types
   words     read-aloud word cards      items: {w, syl?}
   sentences read-aloud sentences       items: ["sentence", ...]
   picmatch  picture -> pick the word   items: {pic, options[], a}
   build     tap tiles to build a word  items: {w, parts?}  (syl "ro-cket" also works)
   spell     hear it, type it           items: {w}
   scramble  put words/lines in order   items: {s} or {tokens:[...]}
   cloze     fill the blank             items: {s with ___, options[], a}
   match     match pairs                items: {pairs:[[left,right],...]}
   quiz      multiple choice            items: {q, options[], a, say?}
   passage   story + questions          passage:"...", items like quiz
   ========================================================= */

const SITE = {
  owner: "Teacher Jollie",
  brand: "ClickLit",
  tagline: "Clicking Toward Literacy",
  title: "ClickLit Set B",
  corner: "ClickLit: Clicking Toward Literacy",
  school: "Froilan E. Lopez Elementary School",
  place: "Tayabas City",
  logo: "logo.png"
};

function splitSentences(text){
  return text.match(/[^.!?]+[.!?]+/g).map(s => s.trim());
}

const RANKS = [
  { at: 0,   emoji: "🐣", name: "Baby Bird" },
  { at: 0.1, emoji: "📘", name: "Page Turner" },
  { at: 0.3, emoji: "🌟", name: "Reading Star" },
  { at: 0.55, emoji: "🧙", name: "Word Wizard" },
  { at: 0.85, emoji: "🏆", name: "Reading Champion" }
];

const STORIES = {
  store: "Aling Rosa owns a small store near the school. Every morning, she wakes up at five o'clock to arrange the candies, biscuits, and bottles of juice. At recess, pupils line up to buy snacks. One day, a little boy named Ben counted his coins and found that he was short by two pesos. Aling Rosa smiled and said, \"You can pay me tomorrow.\" The next day, Ben came early and paid with a big thank-you. Aling Rosa learned that a little kindness can make a whole street happier.",
  rainy: "On Saturday, it rained all morning, so Lara could not play outside. She felt bored until she remembered the old cardboard box in the garage. She cut windows and a door in the box, then painted it blue. By afternoon, her box had become a little house for her dolls. When the sun came out, Lara invited her cousins to see it. They clapped and asked her to make another one.",
  bees: "Bees do more than make honey. When a bee visits a flower to drink nectar, tiny grains called pollen stick to its legs. The bee carries the pollen to the next flower. This helps plants make seeds and fruits, such as mangoes and watermelons. Without bees, many of the foods we enjoy would become rare. That is why farmers and scientists work together to protect bees.",
  terraces: "Ifugao farmers carved the rice terraces by hand into the mountainsides many generations ago. They built stone walls to hold the soil and made channels that bring water from the forests above. The system works without modern machines, and families still plant and harvest rice together. Today, the Rice Terraces of the Philippine Cordilleras are a UNESCO World Heritage Site. Visitors from around the world come to admire them, but the terraces need careful protection from erosion, neglect, and too many tourists."
};

const WORLDS = [
  /* ---------------- 1 ---------------- */
  { id: "w1", emoji: "🎪", color: "#e8505b", title: "Phonics Park",
    desc: "Short vowel words: ham, jet, pot, tub.",
    activities: [
      { id: "w1a", type: "words", title: "Read the words",
        items: [{w:"ham"},{w:"rat"},{w:"jet"},{w:"wig"},{w:"hen"},{w:"log"},{w:"pot"},{w:"rug"},{w:"tub"},{w:"gum"},{w:"fin"},{w:"lid"}] },
      { id: "w1b", type: "picmatch", title: "Pick the picture word",
        items: [
          {pic:"🐀", options:["rat","mat","rag"], a:0},
          {pic:"🐔", options:["pen","hen","ten"], a:1},
          {pic:"✈️", options:["jam","jet","net"], a:1},
          {pic:"🍲", options:["pit","pat","pot"], a:2},
          {pic:"🛁", options:["tub","tab","tip"], a:0},
          {pic:"🍖", options:["him","hum","ham"], a:2}
        ]},
      { id: "w1c", type: "build", title: "Build the word",
        items: [{w:"ham"},{w:"jet"},{w:"pot"},{w:"tub"},{w:"hen"},{w:"rat"},{w:"wig"},{w:"log"}] },
      { id: "w1d", type: "spell", title: "Listen and spell",
        items: [{w:"gum"},{w:"fin"},{w:"lid"},{w:"rug"},{w:"wig"},{w:"hen"},{w:"tub"},{w:"pot"}] },
      { id: "w1e", type: "sentences", title: "Tongue twisters",
        items: ["Ham and jam on a hot pan.","A rat sat on a red rug.","The hen has ten big eggs.","Jin put the pot in the tub."] }
    ]},

  /* ---------------- 2 ---------------- */
  { id: "w2", emoji: "🏖️", color: "#f08a00", title: "Blend Beach",
    desc: "Blends and digraphs: swim, crash, fresh, lunch.",
    activities: [
      { id: "w2a", type: "words", title: "Read the words",
        items: [{w:"grab"},{w:"clap"},{w:"drip"},{w:"flip"},{w:"skip"},{w:"snap"},{w:"swim"},{w:"trick"},{w:"crash"},{w:"fresh"},{w:"wish"},{w:"lunch"}] },
      { id: "w2b", type: "build", title: "Build the word",
        items: [
          {w:"swim"},{w:"clap"},{w:"grab"},{w:"drip"},
          {w:"fresh", parts:["f","r","e","sh"]},{w:"lunch", parts:["l","u","n","ch"]},
          {w:"wish", parts:["w","i","sh"]},{w:"trick", parts:["t","r","i","ck"]}
        ]},
      { id: "w2c", type: "cloze", title: "Fill the blank",
        items: [
          {s:"The kids ___ in the sea.", options:["swim","clap","drip"], a:0},
          {s:"Please ___ your hands for the winner.", options:["clap","grab","flip"], a:0},
          {s:"The tap will ___ all night.", options:["drip","skip","snap"], a:0},
          {s:"We eat ___ at noon.", options:["lunch","wish","crash"], a:0},
          {s:"Make a ___ when you blow out the candles.", options:["wish","drip","grab"], a:0},
          {s:"The magician did a funny ___.", options:["trick","clap","swim"], a:0},
          {s:"The mangoes are ___ and sweet.", options:["fresh","crash","skip"], a:0},
          {s:"The two cars had a ___ on the road.", options:["crash","fresh","trick"], a:0}
        ]},
      { id: "w2d", type: "spell", title: "Listen and spell",
        items: [{w:"swim"},{w:"snap"},{w:"skip"},{w:"flip"},{w:"grab"},{w:"drip"},{w:"trick"},{w:"wish"}] },
      { id: "w2e", type: "sentences", title: "Tongue twisters",
        items: ["Fresh fish and crisp chips for lunch.","Brave Brad brings brown bread.","The crab can clap and snap.","Three thin sticks sit in the sand."] }
    ]},

  /* ---------------- 3 ---------------- */
  { id: "w3", emoji: "🌄", color: "#c68a00", title: "Vowel Valley",
    desc: "Long vowels, vowel teams and bossy r: kite, soap, bird.",
    activities: [
      { id: "w3a", type: "words", title: "Read the words",
        items: [{w:"gate"},{w:"kite"},{w:"bone"},{w:"cube"},{w:"seat"},{w:"team"},{w:"soap"},{w:"mail"},{w:"bird"},{w:"farm"},{w:"corn"},{w:"storm"}] },
      { id: "w3b", type: "picmatch", title: "Pick the picture word",
        items: [
          {pic:"🪁", options:["kit","kite","kid"], a:1},
          {pic:"🦴", options:["bun","bone","boat"], a:1},
          {pic:"🧊", options:["cub","cute","cube"], a:2},
          {pic:"🧼", options:["soup","soap","sap"], a:1},
          {pic:"📬", options:["mall","mail","male"], a:1},
          {pic:"🐦", options:["bored","bird","barn"], a:1},
          {pic:"🌽", options:["core","corn","cone"], a:1},
          {pic:"🚜", options:["form","firm","farm"], a:2}
        ]},
      { id: "w3c", type: "build", title: "Build the word",
        items: [
          {w:"kite"},{w:"bone"},
          {w:"soap", parts:["s","oa","p"]},{w:"mail", parts:["m","ai","l"]},{w:"team", parts:["t","ea","m"]},
          {w:"bird", parts:["b","ir","d"]},{w:"farm", parts:["f","ar","m"]},{w:"corn", parts:["c","or","n"]}
        ]},
      { id: "w3d", type: "spell", title: "Listen and spell",
        items: [{w:"gate"},{w:"seat"},{w:"team"},{w:"storm"},{w:"farm"},{w:"corn"},{w:"mail"},{w:"bird"}] },
      { id: "w3e", type: "scramble", title: "Put the words in order",
        items: [
          {s:"The kite flies in the sky."},
          {s:"We sit on the green seat."},
          {s:"Mom buys soap at the store."},
          {s:"The bird sings on the farm."},
          {s:"A storm is coming to town."}
        ]}
    ]},

  /* ---------------- 4 ---------------- */
  { id: "w4", emoji: "🚀", color: "#17a398", title: "Syllable Spaceport",
    desc: "Break big words into beats: rock-et, but-ter-fly.",
    activities: [
      { id: "w4a", type: "words", title: "Read the big words",
        items: [
          {w:"rocket", syl:"rock-et"},{w:"planet", syl:"plan-et"},{w:"butterfly", syl:"but-ter-fly"},
          {w:"triangle", syl:"tri-an-gle"},{w:"calendar", syl:"cal-en-dar"},{w:"hospital", syl:"hos-pi-tal"},
          {w:"kangaroo", syl:"kan-ga-roo"},{w:"watermelon", syl:"wa-ter-mel-on"},{w:"dinosaur", syl:"di-no-saur"},
          {w:"telephone", syl:"tel-e-phone"},{w:"helicopter", syl:"hel-i-cop-ter"},{w:"invitation", syl:"in-vi-ta-tion"}
        ]},
      { id: "w4b", type: "build", title: "Build it with syllables",
        items: [
          {w:"rocket", syl:"rock-et"},{w:"planet", syl:"plan-et"},{w:"butterfly", syl:"but-ter-fly"},
          {w:"kangaroo", syl:"kan-ga-roo"},{w:"watermelon", syl:"wa-ter-mel-on"},{w:"dinosaur", syl:"di-no-saur"},
          {w:"telephone", syl:"tel-e-phone"},{w:"helicopter", syl:"hel-i-cop-ter"}
        ]},
      { id: "w4c", type: "quiz", title: "How many beats?",
        items: [
          {q:"How many syllables do you hear?", say:"rocket", options:["2","3","4"], a:0},
          {q:"How many syllables do you hear?", say:"butterfly", options:["2","3","4"], a:1},
          {q:"How many syllables do you hear?", say:"watermelon", options:["2","3","4"], a:2},
          {q:"How many syllables do you hear?", say:"dinosaur", options:["2","3","4"], a:1},
          {q:"How many syllables do you hear?", say:"helicopter", options:["2","3","4"], a:2},
          {q:"How many syllables do you hear?", say:"planet", options:["2","3","4"], a:0},
          {q:"How many syllables do you hear?", say:"calendar", options:["2","3","4"], a:1},
          {q:"How many syllables do you hear?", say:"hospital", options:["2","3","4"], a:1}
        ]},
      { id: "w4d", type: "spell", title: "Listen and spell",
        items: [{w:"rocket"},{w:"planet"},{w:"dinosaur"},{w:"kangaroo"},{w:"hospital"},{w:"calendar"}] },
      { id: "w4e", type: "sentences", title: "Read the sentences",
        items: ["The rocket zooms past the planet.","A butterfly lands on the watermelon.","The dinosaur has a telephone.","The helicopter flew over the hospital."] }
    ]},

  /* ---------------- 5 ---------------- */
  { id: "w5", emoji: "🦁", color: "#2f7de1", title: "Sight Word Safari",
    desc: "Tricky words you must know by heart.",
    activities: [
      { id: "w5a", type: "words", title: "Read the tricky words",
        items: [{w:"about"},{w:"above"},{w:"been"},{w:"both"},{w:"does"},{w:"great"},{w:"laugh"},{w:"thought"},{w:"together", syl:"to-geth-er"},{w:"always", syl:"al-ways"},{w:"before", syl:"be-fore"},{w:"around", syl:"a-round"}] },
      { id: "w5b", type: "cloze", title: "Fill the blank",
        items: [
          {s:"We ___ go to school on time.", options:["always","above","been"], a:0},
          {s:"The kite flew ___ the trees.", options:["above","both","does"], a:0},
          {s:"I have ___ here since morning.", options:["been","does","about"], a:0},
          {s:"___ of my friends came to the party.", options:["Both","Been","Above"], a:0},
          {s:"What time ___ the bell ring?", options:["does","been","about"], a:0},
          {s:"Wash your hands ___ you eat.", options:["before","above","around"], a:0},
          {s:"We walked ___ the park.", options:["around","always","laugh"], a:0},
          {s:"That was a ___ movie!", options:["great","both","been"], a:0},
          {s:"Let us read ___.", options:["together","laugh","above"], a:0}
        ]},
      { id: "w5c", type: "spell", title: "Listen and spell",
        items: [{w:"thought"},{w:"together"},{w:"laugh"},{w:"great"},{w:"before"},{w:"around"},{w:"always"},{w:"about"}] },
      { id: "w5d", type: "scramble", title: "Put the words in order",
        items: [
          {s:"We always read together."},
          {s:"Wash your hands before you eat."},
          {s:"I thought about the great story."},
          {s:"Both of them laugh around the table."},
          {s:"The bird flew above the green tree."}
        ]},
      { id: "w5e", type: "sentences", title: "Fluency: read smoothly",
        items: ["We always read together after lunch.","I thought about the great story all day.","Both friends laugh around the table.","Wash your hands before you eat."] }
    ]},

  /* ---------------- 6 ---------------- */
  { id: "w6", emoji: "🧙", color: "#7b3fe4", title: "Word Wizard Tower",
    desc: "Meanings, opposites, word parts and idioms.",
    activities: [
      { id: "w6a", type: "match", title: "Match the meaning",
        items: [
          {pairs:[["huge","very big"],["tiny","very small"],["rapid","very fast"],["silent","making no sound"]]},
          {pairs:[["brave","not afraid"],["cheerful","happy and bright"],["fragile","easy to break"],["ancient","very old"]]},
          {pairs:[["harvest","to gather crops"],["journey","a long trip"],["ruin","to destroy"],["gentle","soft and kind"]]}
        ]},
      { id: "w6b", type: "match", title: "Match the opposites",
        items: [
          {pairs:[["hot","cold"],["up","down"],["first","last"],["open","close"]]},
          {pairs:[["strong","weak"],["clean","dirty"],["noisy","quiet"],["wide","narrow"]]},
          {pairs:[["early","late"],["empty","full"],["asleep","awake"],["buy","sell"]]}
        ]},
      { id: "w6c", type: "quiz", title: "Word parts",
        items: [
          {q:"The prefix dis- means \"not\". What does dislike mean?", say:"dislike", options:["to like very much","to not like","to like again"], a:1},
          {q:"The prefix mis- means \"wrongly\". What does misspell mean?", say:"misspell", options:["to spell correctly","to spell wrongly","to spell twice"], a:1},
          {q:"The prefix over- means \"too much\". What does overcooked mean?", say:"overcooked", options:["cooked too much","not cooked","cooked again"], a:0},
          {q:"The suffix -able means \"can be\". What does readable mean?", say:"readable", options:["cannot be read","can be read","reads again"], a:1},
          {q:"The suffix -er can mean \"a person who\". What is a teacher?", say:"teacher", options:["a person who teaches","a place to teach","a thing to teach"], a:0},
          {q:"The prefix sub- means \"under\". A subway runs:", say:"subway", options:["under the ground","over a bridge","in the sky"], a:0}
        ]},
      { id: "w6d", type: "cloze", title: "Which word fits?",
        items: [
          {s:"The mouse is so ___ that I can hardly see it.", options:["tiny","huge","noisy"], a:0},
          {s:"Farmers ___ rice when it is ripe.", options:["harvest","ruin","borrow"], a:0},
          {s:"The ___ glass broke when it fell.", options:["fragile","strong","heavy"], a:0},
          {s:"We went on a long ___ to Baguio.", options:["journey","harvest","ruin"], a:0},
          {s:"The baby smiled with a ___ face.", options:["cheerful","angry","hungry"], a:0},
          {s:"The room was ___ when the teacher came in.", options:["silent","rapid","huge"], a:0}
        ]},
      { id: "w6e", type: "quiz", title: "Words with two meanings",
        items: [
          {q:"\"This bag is light, so I can carry it.\" Light means:", options:["not heavy","a lamp","a bright color"], a:0},
          {q:"\"A fly landed on my food.\" Fly means:", options:["to move in the air","a small insect","to run away"], a:1},
          {q:"\"The bell will ring at noon.\" Ring means:", options:["a piece of jewelry","to make a sound","a circle"], a:1},
          {q:"\"She wore a gold ring.\" Ring means:", options:["a piece of jewelry","to make a sound","to call someone"], a:0},
          {q:"\"The tree trunk is thick.\" Trunk means:", options:["a big box for clothes","the main stem of a tree","an elephant's nose"], a:1}
        ]},
      { id: "w6f", type: "quiz", title: "Idioms",
        items: [
          {q:"\"The test was a piece of cake.\" This means the test was:", options:["very easy","made of food","very long"], a:0},
          {q:"\"Please hit the books tonight.\" This means:", options:["hit them with a hand","throw the books","study"], a:2},
          {q:"\"Don't spill the beans!\" This means:", options:["drop your food","do not tell the secret","do not cook"], a:1},
          {q:"\"It's raining cats and dogs.\" This means it is raining:", options:["very hard","animals are falling","very lightly"], a:0},
          {q:"\"He has a heart of gold.\" This means he is:", options:["rich","very kind","very sick"], a:1}
        ]}
    ]},

  /* ---------------- 7 ---------------- */
  { id: "w7", emoji: "🏝️", color: "#d6368f", title: "Story Island",
    desc: "Read stories, find the details, put events in order.",
    activities: [
      { id: "w7a", type: "passage", title: "Story: Aling Rosa's Store", passage: STORIES.store,
        items: [
          {q:"What time does Aling Rosa wake up?", options:["Four o'clock","Five o'clock","Six o'clock"], a:1},
          {q:"How many pesos was Ben short?", options:["Two pesos","Five pesos","Ten pesos"], a:0},
          {q:"What did Aling Rosa tell Ben?", options:["Go home","Pay her tomorrow","Come back next week"], a:1},
          {q:"Which word best describes Aling Rosa?", options:["Kind","Angry","Lazy"], a:0},
          {q:"In this story, short by two pesos means:", options:["two pesos too tall","two pesos not enough","two pesos extra"], a:1},
          {q:"What is the lesson of the story?", options:["Kindness makes others happy","Never buy snacks","Wake up very early"], a:0}
        ]},
      { id: "w7b", type: "sentences", title: "Read aloud: Aling Rosa's Store", items: splitSentences(STORIES.store) },
      { id: "w7c", type: "passage", title: "Story: The Rainy Day Surprise", passage: STORIES.rainy,
        items: [
          {q:"Why could Lara not play outside?", options:["It was raining","She was sick","She had no friends"], a:0},
          {q:"What did Lara remember?", options:["An old cardboard box","A new toy","A birthday"], a:0},
          {q:"What color did Lara paint the box?", options:["Red","Blue","Green"], a:1},
          {q:"What did her cousins do?", options:["They laughed at it","They clapped and asked for another","They went home"], a:1},
          {q:"Which word describes Lara?", options:["Creative","Careless","Shy"], a:0},
          {q:"In this story, bored means:", options:["having nothing fun to do","very hungry","very happy"], a:0}
        ]},
      { id: "w7d", type: "scramble", title: "Put the story in order",
        items: [
          {tokens:["It rained all morning, so Lara stayed inside.","Lara remembered the old cardboard box.","She cut windows and a door in the box.","She painted the box blue.","Lara showed her cousins the little house."]},
          {tokens:["Ben counted his coins.","He was short by two pesos.","Aling Rosa said he could pay tomorrow.","Ben came early the next day.","He paid and said thank you."]}
        ]},
      { id: "w7e", type: "sentences", title: "Read aloud: The Rainy Day Surprise", items: splitSentences(STORIES.rainy) },
      { id: "w7f", type: "passage", title: "Read to learn: Why Bees Matter", passage: STORIES.bees,
        items: [
          {q:"What is the main idea of the passage?", options:["Bees are important for plants and food","Bees only make honey","Flowers are pretty"], a:0},
          {q:"What sticks to a bee's legs?", options:["Pollen","Honey","Water"], a:0},
          {q:"Which food is named in the passage?", options:["Mango","Rice","Bread"], a:0},
          {q:"What might happen without bees?", options:["Some foods would be harder to find","Flowers would grow faster","Farmers would have more work"], a:0},
          {q:"In this passage, rare means:", options:["hard to find","very big","very tasty"], a:0}
        ]},
      { id: "w7g", type: "sentences", title: "Read aloud: Why Bees Matter", items: splitSentences(STORIES.bees) }
    ]},

  /* ---------------- 8 ---------------- */
  { id: "w8", emoji: "🏔️", color: "#35507a", title: "Grade 6 Summit",
    desc: "Long words, fact or opinion, cause and effect, author's purpose.",
    activities: [
      { id: "w8a", type: "words", title: "Read the long words",
        items: [
          {w:"agriculture", syl:"ag-ri-cul-ture"},{w:"celebration", syl:"cel-e-bra-tion"},{w:"enthusiastic", syl:"en-thu-si-as-tic"},
          {w:"magnificent", syl:"mag-nif-i-cent"},{w:"perseverance", syl:"per-se-ver-ance"},{w:"community", syl:"com-mu-ni-ty"},
          {w:"competition", syl:"com-pe-ti-tion"},{w:"information", syl:"in-for-ma-tion"},{w:"determination", syl:"de-ter-mi-na-tion"},
          {w:"representative", syl:"rep-re-sen-ta-tive"},{w:"appreciation", syl:"ap-pre-ci-a-tion"},{w:"cooperation", syl:"co-op-er-a-tion"}
        ]},
      { id: "w8b", type: "build", title: "Build it with syllables",
        items: [
          {w:"agriculture", syl:"ag-ri-cul-ture"},{w:"celebration", syl:"cel-e-bra-tion"},{w:"magnificent", syl:"mag-nif-i-cent"},
          {w:"community", syl:"com-mu-ni-ty"},{w:"competition", syl:"com-pe-ti-tion"},{w:"information", syl:"in-for-ma-tion"}
        ]},
      { id: "w8c", type: "sentences", title: "Fluency: long sentences",
        items: [
          "The community held a celebration to thank the farmers for their hard work.",
          "With perseverance and determination, the team won the competition.",
          "Information about agriculture helps us understand where our food comes from.",
          "The magnificent view made everyone feel enthusiastic and thankful."
        ]},
      { id: "w8d", type: "quiz", title: "Fact or opinion?",
        items: [
          {q:"\"The Philippines has more than 7,000 islands.\" This is a:", options:["fact","opinion"], a:0},
          {q:"\"Mangoes are the tastiest fruit in the world.\" This is a:", options:["fact","opinion"], a:1},
          {q:"\"Water boils at 100 degrees Celsius.\" This is a:", options:["fact","opinion"], a:0},
          {q:"\"Math is the most boring subject.\" This is a:", options:["fact","opinion"], a:1},
          {q:"\"Typhoons usually form over warm ocean water.\" This is a:", options:["fact","opinion"], a:0},
          {q:"\"Everyone should wear blue on Fridays.\" This is an:", options:["fact","opinion"], a:1}
        ]},
      { id: "w8e", type: "quiz", title: "Cause and effect",
        items: [
          {q:"\"Because it rained heavily all night, the street was flooded.\" What is the EFFECT?", options:["It rained heavily","The street was flooded","The night was long"], a:1},
          {q:"\"Ana studied every day, so she passed the test.\" What is the CAUSE?", options:["She passed the test","Ana studied every day","The test was easy"], a:1},
          {q:"\"The plants died because nobody watered them.\" What is the CAUSE?", options:["Nobody watered them","The plants died","The sun was hot"], a:0},
          {q:"\"The power went out, so the class used flashlights.\" What is the EFFECT?", options:["The power went out","The class used flashlights","The room was dark"], a:1},
          {q:"\"He felt tired because he ran for an hour.\" What is the EFFECT?", options:["He ran for an hour","He felt tired","He drank water"], a:1}
        ]},
      { id: "w8f", type: "quiz", title: "Author's purpose",
        items: [
          {q:"\"Brush your teeth twice a day, eat fewer sweets, and visit the dentist.\" What is the author's purpose?", options:["to entertain","to inform or advise","to sell a toy"], a:1},
          {q:"\"Once upon a time, a clever turtle outsmarted a hungry crocodile.\" The author's purpose is mostly:", options:["to entertain","to give directions","to ask for money"], a:0},
          {q:"\"Everyone should join the Clean-Up Drive this Saturday. Our town needs us!\" The author's purpose is:", options:["to entertain","to persuade","to describe a place"], a:1},
          {q:"A recipe is written mainly:", options:["to explain how to make something","to scare the reader","to tell a joke"], a:0}
        ]},
      { id: "w8g", type: "passage", title: "Passage: The Rice Terraces", passage: STORIES.terraces,
        items: [
          {q:"What is the main idea of the passage?", options:["The rice terraces are an amazing human-made system that needs protection","Rice is the best food","Machines build mountains"], a:0},
          {q:"How does water reach the terraces?", options:["Through channels from the forests above","By big machines","From the sea"], a:0},
          {q:"Who built the terraces?", options:["Ifugao farmers","Visitors","Machines"], a:0},
          {q:"Why do the terraces need careful protection?", options:["They can be damaged by erosion, neglect and too many tourists","They are too small","They are new"], a:0},
          {q:"In this passage, generations means:", options:["groups of family members over many years","big machines","mountains"], a:0},
          {q:"Which word best describes the Ifugao farmers?", options:["Skilled and hardworking","Careless","Rich"], a:0}
        ]},
      { id: "w8h", type: "sentences", title: "Read aloud: The Rice Terraces", items: splitSentences(STORIES.terraces) }
    ]}
];

/* ---------- pictures shown on word cards ---------- */
const PICS = {
  ham:"🍖",rat:"🐀",jet:"✈️",wig:"💇",hen:"🐔",pot:"🍲",tub:"🛁",
  clap:"👏",drip:"💧",swim:"🏊",trick:"🎩",crash:"💥",fresh:"🥗",wish:"🌠",lunch:"🍱",flip:"🤸",
  kite:"🪁",bone:"🦴",cube:"🧊",seat:"💺",team:"👥",soap:"🧼",mail:"📬",bird:"🐦",farm:"🚜",corn:"🌽",storm:"⛈️",
  rocket:"🚀",planet:"🪐",butterfly:"🦋",triangle:"🔺",calendar:"📅",hospital:"🏥",kangaroo:"🦘",
  watermelon:"🍉",dinosaur:"🦖",telephone:"☎️",helicopter:"🚁",invitation:"💌",
  together:"🤝",
  agriculture:"🌾",celebration:"🎉",community:"🏘️",competition:"🏆",enthusiastic:"🤩",magnificent:"🏔️",
  appreciation:"🙏",determination:"💪",perseverance:"🧗",cooperation:"🤝",
  fish:"🐟",crab:"🦀",sun:"☀️",moon:"🌙",tree:"🌳",bees:"🐝",bee:"🐝",mango:"🥭",mangoes:"🥭",
  watermelons:"🍉",box:"📦",house:"🏠",rain:"🌧️"
};

/* ---------- picture banners for story activities ---------- */
const ART = {
  w7a:"🏪🍬🧒🪙", w7b:"🏪🍬🧒🪙",
  w7c:"🌧️📦🎨🏠", w7d:"🌧️📦🎨🏠", w7e:"🌧️📦🎨🏠",
  w7f:"🐝🌸🥭🍉", w7g:"🐝🌸🥭🍉",
  w8g:"⛰️🌾💧🧑‍🌾", w8h:"⛰️🌾💧🧑‍🌾"
};
