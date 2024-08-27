document.addEventListener("DOMContentLoaded", () => {
  const resetButton = document.getElementById("reset-btn");
  const gridItems = document.querySelectorAll(".grid-item");

  document.querySelectorAll(".grid-item input").forEach((input) => {
    input.addEventListener("input", function (event) {
      const inputs = Array.from(document.querySelectorAll(".grid-item input"));
      const currentIndex = inputs.indexOf(event.target);

      if (event.target.value.length === 1) {
        if (currentIndex < inputs.length - 1) {
          inputs[currentIndex + 1].focus();
        }
      }
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key.length === 1 && /^[a-zA-Z0-9]$/.test(event.key)) {
      const activeElement = document.activeElement;

      if (activeElement.tagName === "INPUT") {
        const inputs = Array.from(
          document.querySelectorAll(".grid-item input")
        );
        const currentIndex = inputs.indexOf(activeElement);

        if (currentIndex < inputs.length) {
          activeElement.value = event.key;

          if (currentIndex < inputs.length - 1) {
            inputs[currentIndex + 1].focus();
          }
          event.preventDefault();
        }
      }
    }
  });

  gridItems.forEach((item) => {
    item.addEventListener("click", () => {
      gridItems.forEach((cell) => cell.classList.remove("selected"));

      item.classList.add("selected");

      item.addEventListener("click", handleCellClick);
    });
  });

  let totalSeconds = 0;
  let timerInterval;
  const minutesElem = document.getElementById("minutes");
  const secondsElem = document.getElementById("seconds");

  function updateDisplay() {
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    minutesElem.textContent = minutes;
    secondsElem.textContent = seconds;
  }

  function startTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
    }

    timerInterval = setInterval(() => {
      totalSeconds++;
      updateDisplay();
    }, 1000);
  }

  function resetTimer() {
    clearInterval(timerInterval);

    totalSeconds = 0;
    updateDisplay();

    startTimer();
  }

  startTimer();

  resetButton.addEventListener("click", () => {
    const inputs = document.querySelectorAll(".grid-container input");
    inputs.forEach((input) => {
      input.value = "";
    });
    resetTimer();
  });

  function revealAnswers() {
    const inputs = document.querySelectorAll(".grid-container input");
    inputs.forEach((input) => {
      const answer = input.getAttribute("data-answer");
      if (answer) {
        input.value = answer;
        input.style.color = "blue";
        clearInterval(timerInterval);
      }
    });
  }

  const revealButton = document.getElementById("reveal-btn");
  revealButton.addEventListener("click", () => {
    revealAnswers();
  });
});
