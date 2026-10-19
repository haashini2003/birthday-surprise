 
const memories = [
  {
    question: "Which kind of moment makes me smile the most?",
    options: [
      "Our silly talks",
      "When we eat",
      "When we take photos",
      "All our little moments"
    ],
    answer: 3,
    date: "MY HAPPY PLACE",
    caption: "It's not always the big things. It's the little moments with you. 💗",
    image: "assets/img1.jpg"
  }
];

const memoryImages = [
  {
    date: "OUR SILLY TALKS 💗",
    caption: "Your silly talks always bring a smile to my face. ❤️",
    image: "assets/img1.jpg"
  },
  {
    date: "OUR FOOD MOMENTS 🍰",
    caption: "Even eating together becomes a special memory with you. ❤️",
    image: "assets/img2.jpg"
  },
  {
    date: "OUR PHOTO MOMENTS 📸",
    caption: "Every picture holds a little piece of our story. ❤️",
    image: "assets/img3.jpg"
  },
  {
    date: "OUR LITTLE MOMENTS 💞",
    caption: "Every little moment with you means so much to me. ❤️",
    image: "assets/img4.jpg"
  }
];

const reasons = [
  "The way you make me smile without even trying. ♡",
  "The comfort I feel when I talk to you.",
  "Your silly little habits that are so you.",
  "The way you care about the people you love.",
  "Because even an ordinary day can feel special with you.",
  "Because I can be myself with you.",
  "Your smile is one of my favourite sights.",
  "Because you are you — and that is more than enough. ❤️",
  "The memories we've made and the ones still waiting for us.",
  "Because loving you has given me so many little things to be grateful for."
];

const $ = (id) => document.getElementById(id);

let currentQuestion = 0;
let viewedMemories = [];
let selectedMemoryIndex = null;
let reasonsShown = 0;
let lastReason = -1;
let musicEnabled = false;
let activeSection = "home";

// Music files for each section
const songTracks = {
  home: "assets/our-song.mp3",
  "memory-game": "assets/memory-song.mp3",
  "our-story": "assets/story-song.mp3",
  "love-letter": "assets/letter-song.mp3",
  reasons: "assets/reasons-song.mp3",
  "birthday-wish": "assets/birthday-song.mp3"
};

const song = $("ourSong");
const musicButton = $("musicToggle");

// Prevent old song requests from taking over
let songRequestId = 0;

function updateMusicButton(playing) {
  if (!musicButton) return;

  musicButton.classList.toggle("playing", playing);

  const label = musicButton.querySelector("span");

  if (label) {
    label.textContent = playing
      ? "Pause our song"
      : "Play our song";
  }
}

function showSection(id) {
  const next = $(id);
  if (!next) return;

  document.querySelectorAll("main > section").forEach((section) => {
    section.hidden = section.id !== id;
    section.classList.remove("screen-active");
  });

  next.hidden = false;
  void next.offsetWidth;
  next.classList.add("screen-active");
  activeSection = id;

  window.scrollTo({ top: 0, behavior: "smooth" });

  // Change music when moving to another section
  if (musicEnabled) {
    playSectionMusic(id);
  }
}

async function playSectionMusic(sectionId) {
  const file = songTracks[sectionId];

  if (!file || !song) return;

  const requestId = ++songRequestId;

  // Remember which section's song should play
  if (song.dataset.track !== file) {
    song.pause();
    song.currentTime = 0;
    song.src = file;
    song.dataset.track = file;
    song.load();
  }

  try {
    await song.play();

    // Ignore an outdated play request
    if (requestId !== songRequestId) return;

    musicEnabled = true;
    updateMusicButton(true);
  } catch (error) {
    if (requestId !== songRequestId) return;

    // Browser may block autoplay until the user interacts
    updateMusicButton(false);
  }
}

// When one song ends, continue with the next section's song
function playNextSong() {
  if (!musicEnabled || !song) return;

  const sectionOrder = [
    "home",
    "memory-game",
    "our-story",
    "love-letter",
    "reasons",
    "birthday-wish"
  ];

  const currentIndex = sectionOrder.indexOf(activeSection);

  if (currentIndex === -1) return;

  // Repeat the current section's song if the user is still there
  playSectionMusic(sectionOrder[currentIndex]);
}

if (song) {
  song.addEventListener("ended", playNextSong);

  song.addEventListener("play", () => {
    updateMusicButton(true);
  });

  song.addEventListener("pause", () => {
    if (!song.ended) {
      updateMusicButton(false);
    }
  });
}

function renderQuestion() {
  const item = memories[0];

  $("quizCount").textContent =
    `MEMORY ${viewedMemories.length + 1} / 4`;

  $("questionText").textContent = item.question;
  $("answerOptions").innerHTML = "";
  $("quizFeedback").textContent = "";
  $("memoryReveal").hidden = true;
  $("showMemory").hidden = false;

  selectedMemoryIndex = null;

  item.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-option";
    button.textContent = option;

    if (viewedMemories.includes(index)) {
      button.disabled = true;
      button.classList.add("selected");
    } else {
      button.addEventListener("click", () => chooseAnswer(index, button));
    }

    $("answerOptions").appendChild(button);
  });

  $("nextQuestion").textContent =
    viewedMemories.length === 4
      ? "Our Love Story →"
      : "Next memory →";

  $("nextQuestion").hidden = true;
}

function revealImage(memory) {
  const img = $("memoryImage");
  const placeholder = img.nextElementSibling;

  img.onload = function () {
    this.style.display = "block";
    placeholder.style.display = "none";
  };

  img.onerror = function () {
    this.style.display = "none";
    placeholder.style.display = "grid";
  };

  img.style.display = "block";
  placeholder.style.display = "none";
  img.src = memory.image;

  $("memoryDate").textContent = memory.date;
  $("memoryCaption").textContent = memory.caption;
  $("memoryReveal").hidden = false;
  $("showMemory").hidden = true;
}

function chooseAnswer(index, button) {
  if (viewedMemories.includes(index)) return;

  selectedMemoryIndex = index;
  viewedMemories.push(index);

  document.querySelectorAll(".answer-option").forEach((b) => {
    b.disabled = true;
  });

  button.classList.add("selected");

  $("quizFeedback").textContent =
    index === 3
      ? "You remembered! 🥹❤️"
      : "Aww, let's unlock this memory! 💗";

  revealImage(memoryImages[index]);

  $("quizCount").textContent =
    `MEMORY ${viewedMemories.length} / 4`;

  $("nextQuestion").textContent =
    viewedMemories.length === 4
      ? "Our Love Story →"
      : "Next memory →";

  $("nextQuestion").hidden = false;
}

$("openSurprise").addEventListener("click", async () => {
  // User interaction allows browsers to start music
  musicEnabled = true;

  await playSectionMusic("home");
  showSection("memory-game");
});

$("showMemory").addEventListener("click", () => {
  $("quizFeedback").textContent =
    "Surprise! Here's one more special memory. 💗";

  revealImage({
    date: "A LITTLE EXTRA SURPRISE ♡",
    caption: "One more little memory, made special just for you. ❤️",
    image: "assets/ask.png"
  });
});

$("nextQuestion").addEventListener("click", () => {
  if (viewedMemories.length < 4) {
    renderQuestion();
  } else {
    showSection("our-story");
  }
});

document.querySelectorAll("[data-go]").forEach((button) => {
  button.addEventListener("click", () => {
    const destination = button.dataset.go;

    if (
      destination === "our-story" &&
      viewedMemories.length < 4
    ) {
      $("quizFeedback").textContent =
        "First, unlock all 4 little memories with me! 💗";
      return;
    }

    showSection(destination);
  });
});

$("openLetter").addEventListener("click", () => {
  const opening = $("letterPaper").hidden;
  $("letterPaper").hidden = !opening;

  $("openLetter").setAttribute("aria-expanded", String(opening));

  $("openLetter").querySelector("span:nth-child(2)").textContent =
    opening ? "Close my heart" : "Open my heart";

  $("openLetter").querySelector("small").textContent =
    opening ? "tap to close" : "tap to open";

  if (opening) {
    $("letterPaper").scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }
});

$("reasonButton").addEventListener("click", () => {
  let index = Math.floor(Math.random() * reasons.length);

  if (reasons.length > 1 && index === lastReason) {
    index = (index + 1) % reasons.length;
  }

  lastReason = index;
  reasonsShown++;

  $("reasonPaper").textContent = reasons[index];

  $("reasonCount").textContent =
    `Love note ${reasonsShown} · ${reasons.length} little reasons in this jar`;

  $("reasonPaper").classList.remove("note-pop");
  void $("reasonPaper").offsetWidth;
  $("reasonPaper").classList.add("note-pop");
});

$("finalButton").addEventListener("click", () => {
  $("finalMessage").hidden = false;
  $("finalButton").textContent = "A little reminder, always ♡";

  $("finalMessage").scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
});

const restartButton = $("restartSurprise");

if (restartButton) {
  restartButton.addEventListener("click", () => {
    currentQuestion = 0;
    viewedMemories = [];
    selectedMemoryIndex = null;

    renderQuestion();

    $("letterPaper").hidden = true;

    $("openLetter").setAttribute("aria-expanded", "false");
    $("openLetter").querySelector("span:nth-child(2)").textContent =
      "Open my heart";
    $("openLetter").querySelector("small").textContent = "tap to open";

    $("finalMessage").hidden = true;

    musicEnabled = false;
    songRequestId++;

    song.pause();
    song.currentTime = 0;

    updateMusicButton(false);

    showSection("home");
  });
}

musicButton.addEventListener("click", async () => {
  if (!song) return;

  if (!song.paused && musicEnabled) {
    musicEnabled = false;
    songRequestId++;
    song.pause();
    updateMusicButton(false);
    return;
  }

  musicEnabled = true;
  await playSectionMusic(activeSection);
});

const heartLayer = document.querySelector(".floating-hearts");

function addHeart() {
  if (!heartLayer) return;

  const heart = document.createElement("span");
  heart.className = "floating-heart";
  heart.textContent = Math.random() > 0.5 ? "♡" : "♥";
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.fontSize = `${12 + Math.random() * 16}px`;
  heart.style.animationDuration = `${9 + Math.random() * 8}s`;

  heartLayer.appendChild(heart);

  setTimeout(() => heart.remove(), 18000);
}

setInterval(addHeart, 1300);

renderQuestion();
showSection("home");

// Try to autoplay when the webpage opens.
// Browsers may require the visitor to tap once before sound can play.
musicEnabled = true;
playSectionMusic("home");
