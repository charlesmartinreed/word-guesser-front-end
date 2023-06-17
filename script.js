let apiEndpointURL = "/words";

let wordsToGuess = [];
let wordsGuessedCorrectly = [];

let currentTime = 60;
let countdownTimer;

function startTimer() {
  countdownTimer = setInterval(() => {
    if (currentTime > 0) {
      currentTime--;
      console.log("timer is currently", currentTime);
      updateUITimerDisplay();
    } else return;
  }, 1000);
}

function stopTimer() {
  clearInterval(countdownTimer);
}

function updateTimer() {
  // if the word is correctly guessed, add more time to the clock
  // if ALL words are guesed correctly, add EVEN MORE time to the clock

  if (wordsToGuess.length > 0) currentTime += 10;
  if (wordsToGuess.length === 0) currentTime += 30;
  startTimer();
}

function updateUITimerDisplay() {
  document.getElementById("timer__display").textContent = currentTime;
}

function updateUIWordList() {
  console.log("updating ui with words", wordsToGuess);

  document.querySelectorAll(".word__definition").forEach((definitionDiv) => {
    let wordAndDef = wordsToGuess[definitionDiv.getAttribute("data-index")];
    let [word, definition] = wordAndDef;
    definitionDiv.textContent = `${word.length} letter word meaning ${definition}`;
  });
}

async function fetchWords(URL, wordCount) {
  // will return an array of arrays
  // where each item looks like: { word: word, definition: {definition} }

  let res = JSON.stringify([
    [
      {
        word: "first",
        defintions: ["definition 1", "definition 2"],
      },
    ],
    [
      {
        word: "second",
        defintions: ["definition 1", "definition 2", "definition 3"],
      },
    ],
    [
      {
        word: "third",
        defintions: ["definition 1"],
      },
    ],
    [
      {
        word: "four",
        defintions: [
          "definition 1",
          "definition 2",
          "definition 3",
          "definition 4",
          "definition 5",
          "definition 6",
        ],
      },
    ],
  ]);
  res = JSON.parse(res);

  try {
    // let res = await fetch(`${URL}/${wordCount}`);
    if (res) {
      parseFetchResults(res);
    }
  } catch {
    console.error(e);
  }
}

function parseFetchResults(results) {
  for (const [wordObj, _] of results) {
    let { word, defintions } = wordObj;
    let definition =
      defintions.length === 1
        ? defintions[0]
        : defintions[Math.floor(Math.random() * (defintions.length - 0) + 0)];
    wordsToGuess = [...wordsToGuess, [word, definition]];
  }

  updateUIWordList();
}

window.addEventListener("DOMContentLoaded", async (e) => {
  await fetchWords(apiEndpointURL, 10);
  updateUIWordList();
  startTimer();
});
