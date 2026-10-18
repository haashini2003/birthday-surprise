// Personalise the questions, memories and love notes in the arrays below.
const memories = [
  { question: "Where did our story begin?", options: ["Our first chat", "Our first trip", "A random hello", "A funny little moment"], answer: 0, date: "THE BEGINNING", caption: "Every beautiful story starts somewhere. I'm so glad ours started. ♡", image: "assets/memory-1.jpg" },
  { question: "Which kind of moment makes me smile the most?", options: ["Our silly talks", "When we eat", "When we take photos", "All our little moments"], answer: 3, date: "MY HAPPY PLACE", caption: "It's not always the big things. It's the little moments with you. 💗", image: "assets/memory-2.jpg" },
  { question: "What do I want more of with you?", options: ["More memories", "More adventures", "More laughter", "All of these"], answer: 3, date: "MORE US, PLEASE", caption: "There's still so much life I want to experience by your side. ♡", image: "assets/memory-3.jpg" },
  { question: "What's my favourite thing about us?", options: ["Our inside jokes", "Our talks", "How we care", "The whole little world we share"], answer: 3, date: "US, ALWAYS", caption: "My favourite part is that it's our story — and we're still writing it. ❤️", image: "assets/memory-4.jpg" }
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
let reasonsShown = 0;
let lastReason = -1;
let musicEnabled = false;
let activeSection = "home";

// Add your own permitted audio files with these exact names inside assets/.
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

function showSection(id) {
  const next = $(id);
  if (!next) return;
  document.querySelectorAll("main > section").forEach((section) => {
    section.hidden = section.id !== id;
    section.classList.remove("screen-active");
  });
  next.hidden = false;
  // Restart the entry animation each time a chapter is opened.
  void next.offsetWidth;
  next.classList.add("screen-active");
  activeSection = id;
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (musicEnabled) playSectionMusic(id);
}

async function playSectionMusic(sectionId) {
  const file = songTracks[sectionId];
  if (!file || !musicEnabled) return;
  if (!song.src.endsWith(file)) {
    song.src = file;
    song.load();
  }
  try {
    await song.play();
    musicButton.classList.add("playing");
    musicButton.querySelector("span").textContent = "Pause our song";
  } catch (error) {
    musicButton.classList.remove("playing");
    musicButton.querySelector("span").textContent = "Tap to play music";
  }
}

function renderQuestion() {
  const item = memories[currentQuestion];
  $("quizCount").textContent = `MEMORY ${String(currentQuestion + 1).padStart(2, "0")} / ${String(memories.length).padStart(2, "0")}`;
  $("questionText").textContent = item.question;
  $("answerOptions").innerHTML = "";
  $("quizFeedback").textContent = "";
  $("memoryReveal").hidden = true;
  $("showMemory").hidden = false;
  item.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-option";
    button.textContent = option;
    button.addEventListener("click", () => chooseAnswer(index, button));
    $("answerOptions").appendChild(button);
  });
  $("nextQuestion").textContent = currentQuestion === memories.length - 1 ? "Finish memories →" : "Next memory →";
}

function revealMemory() {
  const item = memories[currentQuestion];
  $("memoryImage").src = item.image;
  $("memoryImage").style.display = "";
  $("memoryImage").nextElementSibling.style.display = "none";
  $("memoryImage").onerror = function () {
    this.style.display = "none";
    this.nextElementSibling.style.display = "grid";
  };
  $("memoryDate").textContent = item.date;
  $("memoryCaption").textContent = item.caption;
  $("memoryReveal").hidden = false;
  $("showMemory").hidden = true;
}

function chooseAnswer(index, button) {
  const item = memories[currentQuestion];
  document.querySelectorAll(".answer-option").forEach((b) => { b.disabled = true; });
  button.classList.add("selected");
  $("quizFeedback").textContent = index === item.answer
    ? "You remembered! 🥹❤️"
    : "Hehe, that's okay — let's unlock this memory anyway. 💗";
  revealMemory();
}

$("openSurprise").addEventListener("click", () => {
  // This click is the visitor's gesture, so the first song can begin here.
  musicEnabled = true;
  showSection("memory-game");
});

$("showMemory").addEventListener("click", () => {
  $("quizFeedback").textContent = "Here's our little memory. Keep it safe in your heart. ♡";
  document.querySelectorAll(".answer-option").forEach((b) => { b.disabled = true; });
  revealMemory();
});

$("nextQuestion").addEventListener("click", () => {
  if (currentQuestion === memories.length - 1) {
    currentQuestion = 0;
    renderQuestion();
    showSection("our-story");
  } else {
    currentQuestion++;
    renderQuestion();
  }
});

document.querySelectorAll("[data-go]").forEach((button) => {
  button.addEventListener("click", () => showSection(button.dataset.go));
});

// The letter itself stays hidden until the envelope is tapped.
$("openLetter").addEventListener("click", () => {
  const opening = $("letterPaper").hidden;
  $("letterPaper").hidden = !opening;
  $("openLetter").setAttribute("aria-expanded", String(opening));
  $("openLetter").querySelector("span:nth-child(2)").textContent = opening ? "Close my heart" : "Open my heart";
  $("openLetter").querySelector("small").textContent = opening ? "tap to close" : "tap to open";
  if (opening) {
    $("letterPaper").scrollIntoView({ behavior: "smooth", block: "center" });
  }
});

$("reasonButton").addEventListener("click", () => {
  let index = Math.floor(Math.random() * reasons.length);
  if (reasons.length > 1 && index === lastReason) index = (index + 1) % reasons.length;
  lastReason = index;
  reasonsShown++;
  $("reasonPaper").textContent = reasons[index];
  $("reasonCount").textContent = `Love note ${reasonsShown} · ${reasons.length} little reasons in this jar`;
  $("reasonPaper").classList.remove("note-pop");
  void $("reasonPaper").offsetWidth;
  $("reasonPaper").classList.add("note-pop");
});

$("finalButton").addEventListener("click", () => {
  $("finalMessage").hidden = false;
  $("finalButton").textContent = "A little reminder, always ♡";
  $("finalMessage").scrollIntoView({ behavior: "smooth", block: "center" });
});

const restartButton = $("restartSurprise");
if (restartButton) restartButton.addEventListener("click", () => {
  currentQuestion = 0;
  renderQuestion();
  $("letterPaper").hidden = true;
  $("openLetter").setAttribute("aria-expanded", "false");
  $("openLetter").querySelector("span:nth-child(2)").textContent = "Open my heart";
  $("openLetter").querySelector("small").textContent = "tap to open";
  $("finalMessage").hidden = true;
  showSection("home");
  musicEnabled = false;
  song.pause();
  song.currentTime = 0;
  musicButton.classList.remove("playing");
  musicButton.querySelector("span").textContent = "Play our song";
});

musicButton.addEventListener("click", async () => {
  if (!song.paused && musicEnabled) {
    song.pause();
    musicEnabled = false;
    musicButton.classList.remove("playing");
    musicButton.querySelector("span").textContent = "Play our song";
    return;
  }
  musicEnabled = true;
  await playSectionMusic(activeSection);
});

// Gentle floating hearts, kept subtle so text remains easy to read.
const heartLayer = document.querySelector(".floating-hearts");
function addHeart() {
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
