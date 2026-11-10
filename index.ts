let attemptsLeft: number = 3;
let selectedCards: HTMLDivElement[] = [];
let matchedPairsCount: number = 0;
let isInputLocked: boolean = false;

const cardTypes: string[] = ["card-A", "card-B", "card-C"];
let shuffledDeck: string[] = [];

function initGame(): void {
  attemptsLeft = 3;
  matchedPairsCount = 0;
  selectedCards = [];
  isInputLocked = false;

  const attemptsCountDisplay = document.getElementById(
    "lives",
  ) as HTMLSpanElement;
  const outcomeModal = document.getElementById("modal") as HTMLDivElement;

  if (attemptsCountDisplay) {
    attemptsCountDisplay.textContent = attemptsLeft.toString();
  }
  if (outcomeModal) {
    outcomeModal.classList.add("hidden");
  }

  shuffledDeck = [...cardTypes, ...cardTypes];

  for (let i = shuffledDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffledDeck[i];
    shuffledDeck[i] = shuffledDeck[j];
    shuffledDeck[j] = temp;
  }

  generateCardDOMElements();
}

function generateCardDOMElements(): void {
  const gridContainer = document.getElementById("grid") as HTMLDivElement;
  if (!gridContainer) return;

  gridContainer.innerHTML = "";

  shuffledDeck.forEach((cardValue) => {
    const cardWrapper = document.createElement("div");
    cardWrapper.classList.add("card-item");
    cardWrapper.dataset.value = cardValue;

    cardWrapper.innerHTML = `
      <div class="inner-card">
        <div class="face front-view"></div>
        <div class="face back-view ${cardValue}"></div>
      </div>
    `;

    cardWrapper.addEventListener("click", () =>
      executeCardFlipAction(cardWrapper),
    );
    gridContainer.appendChild(cardWrapper);
  });
}

function executeCardFlipAction(clickedCard: HTMLDivElement): void {
  if (isInputLocked) return;
  if (
    clickedCard.classList.contains("is-flipped") ||
    clickedCard.classList.contains("is-matched")
  )
    return;

  clickedCard.classList.add("is-flipped");
  selectedCards.push(clickedCard);

  if (selectedCards.length === 2) {
    evaluateCardMatch();
  }
}

function evaluateCardMatch(): void {
  isInputLocked = true;

  const cardElement1 = selectedCards[0];
  const cardElement2 = selectedCards[1];

  const tagsAreIdentical =
    cardElement1.dataset.value === cardElement2.dataset.value;

  if (tagsAreIdentical) {
    cardElement1.classList.add("is-matched");
    cardElement2.classList.add("is-matched");
    matchedPairsCount++;
    selectedCards = [];
    isInputLocked = false;

    if (matchedPairsCount === cardTypes.length) {
      triggerGameFinishedOverlay(true);
    }
  } else {
    attemptsLeft--;
    const attemptsCountDisplay = document.getElementById(
      "lives",
    ) as HTMLSpanElement;
    if (attemptsCountDisplay) {
      attemptsCountDisplay.textContent = attemptsLeft.toString();
    }

    setTimeout(() => {
      cardElement1.classList.remove("is-flipped");
      cardElement2.classList.remove("is-flipped");
      selectedCards = [];
      isInputLocked = false;

      if (attemptsLeft === 0) {
        triggerGameFinishedOverlay(false);
      }
    }, 1000);
  }
}

function triggerGameFinishedOverlay(playerWon: boolean): void {
  const outcomeModal = document.getElementById("modal") as HTMLDivElement;
  const outcomeText = document.getElementById(
    "modal-text",
  ) as HTMLHeadingElement;

  if (!outcomeText || !outcomeModal) return;

  if (playerWon) {
    outcomeText.textContent = "🎉 Victory! All sets matched!";
  } else {
    outcomeText.textContent = "❌ Defeat! Out of attempts.";
  }

  outcomeModal.classList.remove("hidden");
}

window.addEventListener("DOMContentLoaded", () => {
  initGame();

  const playAgainButton = document.getElementById(
    "reset-btn",
  ) as HTMLButtonElement;
  if (playAgainButton) {
    playAgainButton.addEventListener("click", initGame);
  }
});
