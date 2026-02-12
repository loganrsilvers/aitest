const questions = [
  {
    key: "color",
    text: "What is your favorite color?",
    options: ["Blue", "Pink", "Yellow", "Red"],
  },
  {
    key: "food",
    text: "What is your favorite food?",
    options: ["Bread", "Nuts", "Fruit", "Seeds"],
  },
  {
    key: "habitat",
    text: "What is your favorite habitat?",
    options: ["Swamp", "City", "Mountain", "Plains"],
  },
];

const outcomes = {
  swamp: {
    title: "Mossy Marsh Duck",
    description: "You are calm, observant, and quietly magical. You love peaceful waters and muddy adventures.",
    colors: ["#79b473", "#e5f5db", "#31572c"],
  },
  city: {
    title: "Streetwise City Duck",
    description: "You are bold, adaptable, and full of hustle. Nothing rattles your confident city strut.",
    colors: ["#6c63ff", "#d9d7ff", "#2d2a8c"],
  },
  mountain: {
    title: "Sky Peak Duck",
    description: "You are brave, curious, and always climbing to new heights with your wings spread wide.",
    colors: ["#8ecae6", "#edf9ff", "#1d3557"],
  },
  plains: {
    title: "Golden Prairie Duck",
    description: "You are sunny, social, and endlessly optimistic. You make every flock feel like home.",
    colors: ["#ffd166", "#fff5d6", "#c68b00"],
  },
};

let currentQuestion = 0;
const answers = {};

const quizCard = document.getElementById("quiz-card");
const resultCard = document.getElementById("result-card");
const duckTitle = document.getElementById("duck-title");
const duckImage = document.getElementById("duck-image");
const duckDescription = document.getElementById("duck-description");
const playAgainBtn = document.getElementById("play-again");
const confettiCanvas = document.getElementById("confetti-canvas");
const ctx = confettiCanvas.getContext("2d");

function renderQuestion() {
  const question = questions[currentQuestion];
  quizCard.innerHTML = `
    <h2 class="question-title">${question.text}</h2>
    <div class="options">
      ${question.options
        .map(
          (option) => `<button class="option-btn ${answers[question.key] === option ? "selected" : ""}" type="button" data-option="${option}">${option}</button>`
        )
        .join("")}
    </div>
    <button class="nav-btn" type="button" ${answers[question.key] ? "" : "disabled"}>
      ${currentQuestion < questions.length - 1 ? "Next" : "See My Duck"}
    </button>
  `;

  const optionButtons = quizCard.querySelectorAll(".option-btn");
  const navBtn = quizCard.querySelector(".nav-btn");

  optionButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      answers[question.key] = btn.dataset.option;
      renderQuestion();
    });
  });

  navBtn.addEventListener("click", () => {
    if (!answers[question.key]) return;

    if (currentQuestion < questions.length - 1) {
      currentQuestion += 1;
      renderQuestion();
      return;
    }

    showResult();
  });
}

function chooseDuckType() {
  const habitat = (answers.habitat || "plains").toLowerCase();
  return outcomes[habitat] || outcomes.plains;
}

function makeDuckSvg(type) {
  const [main, background, accent] = type.colors;
  const svg = `
  <svg xmlns='http://www.w3.org/2000/svg' width='640' height='420' viewBox='0 0 640 420'>
    <rect width='640' height='420' fill='${background}'/>
    <ellipse cx='320' cy='325' rx='205' ry='48' fill='rgba(0,0,0,.1)'/>
    <ellipse cx='312' cy='220' rx='145' ry='112' fill='${main}'/>
    <circle cx='427' cy='152' r='66' fill='${main}'/>
    <ellipse cx='486' cy='167' rx='50' ry='25' fill='${accent}'/>
    <circle cx='445' cy='144' r='9' fill='#1f1f1f'/>
    <ellipse cx='252' cy='238' rx='70' ry='50' fill='${accent}' opacity='.65'/>
    <path d='M350 283 L390 338 L325 309 Z' fill='${accent}'/>
    <text x='320' y='390' text-anchor='middle' fill='${accent}' font-size='32' font-family='Arial'>HUZZAH, ${type.title.toUpperCase()}!</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function showResult() {
  const duckType = chooseDuckType();
  duckTitle.textContent = `You got: ${duckType.title}!`;
  duckDescription.textContent = duckType.description;
  duckImage.src = makeDuckSvg(duckType);

  quizCard.classList.add("hidden");
  resultCard.classList.remove("hidden");
  launchConfetti();
}

function resetQuiz() {
  currentQuestion = 0;
  Object.keys(answers).forEach((key) => delete answers[key]);
  resultCard.classList.add("hidden");
  quizCard.classList.remove("hidden");
  renderQuestion();
}

function launchConfetti() {
  const confetti = Array.from({ length: 180 }, () => ({
    x: Math.random() * confettiCanvas.width,
    y: -20 - Math.random() * confettiCanvas.height,
    size: 5 + Math.random() * 8,
    speedY: 2 + Math.random() * 4,
    speedX: -2 + Math.random() * 4,
    color: ["#ff006e", "#ffbe0b", "#3a86ff", "#06d6a0", "#fb5607"][Math.floor(Math.random() * 5)],
    rot: Math.random() * Math.PI,
    rotSpeed: -0.2 + Math.random() * 0.4,
  }));

  let frames = 0;

  function tick() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confetti.forEach((piece) => {
      piece.x += piece.speedX;
      piece.y += piece.speedY;
      piece.rot += piece.rotSpeed;

      ctx.save();
      ctx.translate(piece.x, piece.y);
      ctx.rotate(piece.rot);
      ctx.fillStyle = piece.color;
      ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
      ctx.restore();
    });

    frames += 1;
    if (frames < 180) {
      requestAnimationFrame(tick);
    } else {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  tick();
}

function resizeCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
playAgainBtn.addEventListener("click", resetQuiz);

resizeCanvas();
renderQuestion();
