let apiEndpointURL = "https://word-guesser-api.vercel.app/api/word";

let wordToGuess = [];
let wordsGuessedCorrectly = 0;

let roundDuration = 10;
let currentTime;

let countdownTimer;

const wordInputElement = document.getElementById("current__guessword");

function startTimer() {
  if (!countdownTimer) {
    countdownTimer = setInterval(() => {
      if (currentTime > 0) {
        currentTime--;
        console.log(
          "timer is currently",
          currentTime,
          "timer interval is",
          countdownTimer
        );
        updateUITimerDisplay();
      }
    }, 1000);
  }
}

function stopTimer() {
  clearInterval(countdownTimer);
  countdownTimer = null;
}

function updateWordsGuessedCorrectly(updatedValue) {
  wordsGuessedCorrectly = updatedValue;
  console.log("correct words now", wordsGuessedCorrectly);
  document.getElementById("correct__guess__counter").textContent =
    wordsGuessedCorrectly;
}

function updateUITimerDisplay() {
  document.getElementById("timer__display").textContent = currentTime;
  if (currentTime === 0) endGameRound();
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

function promptToRestart() {
  let summaryStr = `Nice work, you correctly guessed 
  ${wordsGuessedCorrectly} words in ${roundDuration} seconds! You wanna play again?`;
  displayPrompt(summaryStr);
}

async function beginGameRound() {
  currentTime = roundDuration;
  updateWordsGuessedCorrectly(0);

  // wordInputElement.setAttribute("disabled", false);
  wordInputElement.removeAttribute("disabled");
  // wordInputElement.disabled = "false";
  await resetGuessWord();
  if (!countdownTimer) startTimer();
  wordInputElement.focus();
  // startTimer();
}

function endGameRound() {
  stopTimer();
  console.log("countdown timer state", countdownTimer);
  wordInputElement.setAttribute("disabled", null);
  promptToRestart();
}

function displayPrompt(message) {
  applyBackgroundBlur();

  let promptElement = document.createElement("div");
  promptElement.classList.add("ui__prompt", "active");

  let promptMsgDiv = document.createElement("div");
  promptMsgDiv.textContent = message;

  let promptBtnDiv = document.createElement("div");
  let confirmBtn = document.createElement("button");
  confirmBtn.id = "btn__continue";
  confirmBtn.textContent = "Run it back!";

  let cancelBtn = document.createElement("button");
  cancelBtn.id = "btn__cancel";
  cancelBtn.textContent = "Nah, I'm good.";

  promptElement.appendChild(promptMsgDiv);
  promptBtnDiv.appendChild(confirmBtn);
  promptBtnDiv.appendChild(cancelBtn);
  promptElement.appendChild(promptBtnDiv);

  confirmBtn.addEventListener("click", async (e) => {
    applyBackgroundBlur();
    promptElement.classList.remove("active");
    await beginGameRound();
  });

  cancelBtn.addEventListener("click", (e) => {
    applyBackgroundBlur();
    promptElement.classList.remove("active");
    return;
  });

  document.querySelector("body").appendChild(promptElement);
}

function applyBackgroundBlur() {
  document.querySelector("body").classList.toggle("blurred");
}

function checkIfWordIsCorrect(input) {
  return sanitizeWord(input) === wordToGuess;
}

async function guessWasSuccessful() {
  wordsGuessedCorrectly += 1;
  updateWordsGuessedCorrectly(wordsGuessedCorrectly);
  wordInputElement.value = "";

  console.log("Yeah! You guessed it!");
  await resetGuessWord();
}

async function resetGuessWord() {
  // wordInputElement.focus();
  await fetchNewWord();
  if (!countdownTimer) startTimer();
}

wordInputElement.addEventListener("input", async (e) => {
  if (checkIfWordIsCorrect(e.target.value) === true) {
    setTimeout(async () => {
      await guessWasSuccessful();
    }, 500);
  }
});

window.addEventListener("DOMContentLoaded", async (e) => {
  beginGameRound();
  // displayPrompt("Test message for the lulz.");
});
