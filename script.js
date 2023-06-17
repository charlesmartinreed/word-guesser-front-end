let apiEndpointURL = "https://word-guesser-api.vercel.app/api/word";

let wordToGuess = [];
let wordsGuessedCorrectly = 0;

let roundDuration = 60;

let currentTime = roundDuration;
let countdownTimer;

const wordInputElement = document.getElementById("current__guessword");

function startTimer() {
  countdownTimer = setInterval(() => {
    if (currentTime > 0) {
      currentTime--;
      console.log("timer is currently", currentTime);
      updateUITimerDisplay();
    } else {
      endGameRound();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(countdownTimer);
}

function updateWordsGuessedCorrectly() {
  wordsGuessedCorrectly++;
}

function updateUITimerDisplay() {
  document.getElementById("timer__display").textContent = currentTime;
}

function updateUIWordList(word, definition) {
  // console.log("updating ui with words", wordToGuess);
  wordToGuess = sanitizeWord(word);

  document.querySelector(
    ".word__definition"
  ).innerHTML = `<span id="span__word__length">${word.length} letter word</span> that means <span id="span__word__definition">${definition}.</span>`;

  console.log("current word is", wordToGuess);
}

async function fetchNewWord() {
  parseFetchResult({
    word: "test!wor_d",
    definitions: "the definition of a word that definitely exists",
  });
  return;

  // try {
  //   let res = await fetch(apiEndpointURL);
  //   if (res.ok) {
  //     let data = await res.json();
  //     parseFetchResult(data);
  //   }
  // } catch (e) {
  //   console.error(e);
  // }
}

function parseFetchResult(result) {
  console.log("fetched result", result);
  let { word, definitions } = result;

  updateUIWordList(word, definitions);
}

function sanitizeWord(unsanitized) {
  return unsanitized
    .match(/[a-z|A-Z]+/gi)
    .join("")
    .toLowerCase();
}

function endGameRound() {
  stopTimer();
  wordInputElement.setAttribute("disabled", true);

  console.log(
    "Nice work, you correctly guessed",
    wordsGuessedCorrectly,
    "words in",
    roundDuration,
    "seconds!"
  );
}

function checkIfWordIsCorrect(input) {
  return sanitizeWord(input) === wordToGuess;
}

async function guessWasSuccessful() {
  wordsGuessedCorrectly++;

  document.getElementById("correct__guess__counter").textContent =
    wordsGuessedCorrectly;
  console.log("Yeah! You guessed it!");
  await resetGuessWord();
}

async function resetGuessWord() {
  wordInputElement.focus();
  await fetchNewWord();
  if (!countdownTimer) startTimer();
}

wordInputElement.addEventListener("input", async (e) => {
  if (checkIfWordIsCorrect(e.target.value) === true) {
    setTimeout(async () => {
      wordInputElement.value = "";
      await guessWasSuccessful();
    }, 500);
  }
});

window.addEventListener("DOMContentLoaded", async (e) => {
  await resetGuessWord();
});
