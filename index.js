document.addEventListener("DOMContentLoaded", () => {
    const resetButton = document.getElementById("reset-btn");
    const revealButton = document.getElementById("reveal-btn");
    const minutesElem = document.getElementById("minutes");
    const secondsElem = document.getElementById("seconds");
  
    let totalSeconds = 0;
    let timerInterval;
    let lastClickedCell = null;
    let isRowHighlight = true; // Start with row highlighting
  
    function updateDisplay() {
      const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
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
  
    function resetGrid() {
      const inputs = document.querySelectorAll(".grid-container input");
      inputs.forEach((input) => {
        input.value = "";
      });
      resetTimer();
    }
  
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
  
    function isHighlighted(input) {
      return input.closest('.grid-item').classList.contains('highlight');
    }
  
    function handleCellClick() {
      // Remove previous highlights and selected cell
      document.querySelectorAll('.highlight').forEach(el => el.classList.remove('highlight'));
      document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
  
      if (lastClickedCell === this) {
        isRowHighlight = !isRowHighlight;
      }
  
      const rowNumber = this.getAttribute('data-row');
      const colNumber = this.getAttribute('data-col');
  
      if (isRowHighlight) {
        const rowItems = document.querySelectorAll(`.grid-item[data-row="${rowNumber}"]`);
        rowItems.forEach(cell => cell.classList.add('highlight'));
      } else {
        const colItems = document.querySelectorAll(`.grid-item[data-col="${colNumber}"]`);
        colItems.forEach(cell => cell.classList.add('highlight'));
      }
  
      // Add 'selected' class to the clicked cell
      this.classList.add('selected');
      lastClickedCell = this;
    }
  
    document.querySelectorAll(".grid-item input").forEach((input) => {
      input.addEventListener("input", function (event) {
        if (event.target.value.length === 1) {
          const inputs = Array.from(document.querySelectorAll(".grid-item input"));
          const currentIndex = inputs.indexOf(event.target);
  
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
          const inputs = Array.from(document.querySelectorAll(".grid-item input"));
          const currentIndex = inputs.indexOf(activeElement);
  
          if (isHighlighted(activeElement)) {
            activeElement.value = event.key;
  
            // Move focus to the next cell based on the highlight mode
            const rowNumber = activeElement.closest('.grid-item').getAttribute('data-row');
            const colNumber = activeElement.closest('.grid-item').getAttribute('data-col');
  
            if (isRowHighlight) {
              const rowItems = Array.from(document.querySelectorAll(`.grid-item[data-row="${rowNumber}"] input`));
              const nextIndex = rowItems.indexOf(activeElement) + 1;
              if (nextIndex < rowItems.length) {
                rowItems[nextIndex].focus();
              }
            } else {
              const colItems = Array.from(document.querySelectorAll(`.grid-item[data-col="${colNumber}"] input`));
              const currentColIndex = colItems.indexOf(activeElement);
              const nextIndex = currentColIndex + 1;
              if (nextIndex < colItems.length) {
                colItems[nextIndex].focus();
              }
            }
  
            event.preventDefault();
          } else {
            event.preventDefault(); // Prevent typing in non-highlighted cells
          }
        }
      }
    });
  
    document.querySelectorAll('.grid-item').forEach(item => {
      item.addEventListener('click', handleCellClick);
    });
  
    startTimer();
  
    resetButton.addEventListener("click", () => {
      resetGrid();
    });
  
    revealButton.addEventListener("click", () => {
      revealAnswers();
    });
  });
  