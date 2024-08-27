document.addEventListener("DOMContentLoaded", () => {
    const resetButton = document.getElementById("reset-btn");
    const revealButton = document.getElementById("reveal-btn");
    const checkButton = document.getElementById("check-btn");
    const minutesElem = document.getElementById("minutes");
    const secondsElem = document.getElementById("seconds");
    const inputs = document.querySelectorAll(".grid-container input");
    const statusMessage = document.getElementById('status-message');

    let totalSeconds = 0;
    let timerInterval;
    let lastClickedCell = null;
    let isRowHighlight = true; // Start with row highlighting

    // Add an event listener to each list item
document.querySelectorAll('#question-list li').forEach(item => {
    item.addEventListener('click', function() {
        // Remove previous highlights and selections
        document.querySelectorAll('.highlight').forEach(el => el.classList.remove('highlight'));
        document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));

        // Determine the list type (Across or Down) and get the cell number
        const listId = this.closest('ul').id; // Get the ID of the parent <ul>
        const cellNumber = this.getAttribute('data-cell'); // Get the data-cell value

        let firstInputToFocus = null;

        if (listId === 'across') {
            // Highlight the entire row
            const rowItems = document.querySelectorAll(`.grid-item[data-row="${cellNumber}"]`);
            rowItems.forEach(cell => {
                cell.classList.add('highlight');
                const input = cell.querySelector('input');
                if (input && !firstInputToFocus) {
                    firstInputToFocus = input;
                }
            });
        } else if (listId === 'down') {
            // Highlight the entire column
            const colItems = document.querySelectorAll(`.grid-item[data-col="${cellNumber}"]`);
            colItems.forEach(cell => {
                cell.classList.add('highlight');
                const input = cell.querySelector('input');
                if (input && !firstInputToFocus) {
                    firstInputToFocus = input;
                }
            });
        }

        // Set selected cell style
        this.classList.add('selected');

        // Focus the first input field in the highlighted area
        if (firstInputToFocus) {
            firstInputToFocus.focus();
        }
    });
});

    
    
    

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
        statusMessage.textContent = "";
        inputs.forEach((input) => {
            input.value = "";
            input.style.color = 'black'; //Reset text color
        });
        resetTimer();
        
    }


    function revealAnswers() {
        //const inputs = document.querySelectorAll(".grid-container input");
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
        // Remove previous highlights and selections
        document.querySelectorAll('.highlight').forEach(el => el.classList.remove('highlight'));
        document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));

        if (lastClickedCell === this) {
            isRowHighlight = !isRowHighlight;
        }

        const rowNumber = this.getAttribute('data-row');
        const colNumber = this.getAttribute('data-col');

        if (isRowHighlight) {
            // Highlight the entire row
            const rowItems = document.querySelectorAll(`.grid-item[data-row="${rowNumber}"]`);
            rowItems.forEach(cell => cell.classList.add('highlight'));
        } else {
            // Highlight the entire column
            const colItems = document.querySelectorAll(`.grid-item[data-col="${colNumber}"]`);
            colItems.forEach(cell => cell.classList.add('highlight'));
        }

        //Set selected cell style
        this.classList.add('selected');
        this.querySelector('input').style.color = 'black';

        lastClickedCell = this;
    }

    document.querySelectorAll('.grid-item').forEach(item => {
        item.addEventListener('click', handleCellClick);
    });
    
    function setTextColorToBlack(input) {
        input.style.color = 'black';
    }// Function to set text color to black
function setTextColorToBlack(input) {
    input.style.color = 'black';
}

// Function to handle backspace for highlighted cells
function backspaceHighlightedCells() {
    // Get all highlighted cells
    const highlightedCells = Array.from(document.querySelectorAll('.highlight'));

    if (highlightedCells.length === 0) return; // No highlighted cells

    // Get the currently focused cell (if any)
    const currentFocusedCell = highlightedCells.find(cell => cell.querySelector('input') === document.activeElement);

    if (currentFocusedCell) {
        const input = currentFocusedCell.querySelector('input');

        // Remove the last character from the input's value
        input.value = input.value.slice(0, -1);

        // Move to the next highlighted cell, looping back to the first if at the end
        const currentIndex = highlightedCells.indexOf(currentFocusedCell);
        const nextIndex = (currentIndex + 1) % highlightedCells.length;
        const nextCell = highlightedCells[nextIndex];

        // Focus on the next highlighted cell
        if (nextCell) {
            nextCell.querySelector('input').focus();
        }
    }
}

// Event listener for input fields
document.querySelectorAll(".grid-item input").forEach((input) => {
    // Handle typing
    input.addEventListener("input", function (event) {
        if (isHighlighted(event.target)) {
            setTextColorToBlack(event.target);
        }

        // Automatically move focus to the next cell if a single character is input
        if (event.target.value.length === 1) {
            const inputs = Array.from(document.querySelectorAll(".grid-item input"));
            const currentIndex = inputs.indexOf(event.target);

            if (currentIndex < inputs.length - 1) {
                inputs[currentIndex - 1].focus();
            }
        }
    });

    // Handle focus
    input.addEventListener("focus", function (event) {
        if (isHighlighted(event.target)) {
            setTextColorToBlack(event.target);
        }
    });
});

// Event listener for backspace key
document.addEventListener('keydown', function (event) {
    if (event.key === 'Backspace') {
        backspaceHighlightedCells();
        event.preventDefault(); // Prevent default backspace behavior
    }
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
                    event.preventDefault();
                }
            }
        }
    });

    startTimer();

    resetButton.addEventListener("click", () => {
        resetGrid();
    });

    revealButton.addEventListener("click", () => {
        revealAnswers();
    });

    checkButton.addEventListener("click", () => {
        const highlightedCells = document.querySelectorAll('.highlight');

        highlightedCells.forEach(cell => {
            const input = cell.querySelector('input');

            if (input) {
                const correctAnswer = input.getAttribute('data-answer').toUpperCase().trim();
                const userAnswer = input.value.toUpperCase();

                if (userAnswer === correctAnswer) {
           

                    input.style.color = 'black'; // Correct answer
                    
                } else {
                    
                    input.style.color = 'red'; // Incorrect answer
                }
            }
        });
    });
    
    function checkAllCells() {
        let allCorrect = true; // Flag to track if all answers are correct

        document.querySelectorAll('.grid-item').forEach(cell => {
            const input = cell.querySelector('input');

            if (input) {
                const correctAnswer = input.getAttribute('data-answer').toUpperCase().trim();
                const userAnswer = input.value.toUpperCase().trim();

                console.log(correctAnswer)
                console.log(userAnswer)
                if (correctAnswer != userAnswer) {
                    allCorrect = false; // Set the flag to false if any answer is incorrect
                }
            }
        });


        if (allCorrect) {
            console.log("YOU WON!");
           
    
            if (allCorrect) {
                statusMessage.textContent = "YOU WON!";
                const audio = document.getElementById('audio');
                audio.play();
            

            return;
            } else {
                statusMessage.textContent = "";
            }
        }
    }

    function updateFunction() {
        checkAllCells()
    }
    

    const intervalId = setInterval(updateFunction, 1000);

    })
