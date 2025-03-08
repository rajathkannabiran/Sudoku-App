console.log('script.js is loaded');

document.addEventListener("DOMContentLoaded", function () {
    // Add event listener to the submit button
    const submitButton = document.getElementById("submit-btn");

    if (submitButton) {
        submitButton.addEventListener("click", function (event) {
            console.log("Submit button clicked!");
            submitSolution(event); // Call submitSolution here
        });
    } else {
        console.log("Submit button not found!");
    }
});

document.addEventListener("DOMContentLoaded", function() {
    // Add event listener to the submit button
    const submitButton = document.getElementById("submit-btn");
    
    if (submitButton) {
        submitButton.addEventListener("click", submitSolution);
    }
});

function resetBoard() {
    const inputs = document.querySelectorAll('.cell');
    inputs.forEach(input => {
        if (!input.disabled) {
            input.value = '';
        }
    });
    document.getElementById('status').textContent = '';
}

function submitSolution(event) {
    // console.log('----> check soln')
    event.preventDefault(); // Prevent page reload on form submit
    console.log("submitSolution function called!");
    const gridMatrix = [];

    try {
        // Loop through the grid and extract values
        for (let row = 0; row < 9; row++) {
            const rowValues = [];
            for (let col = 0; col < 9; col++) {
                const cell = document.getElementById(`cell-${row}-${col}`);
                if (!cell) {
                    console.error(`Cell not found for row ${row}, col ${col}`);
                    continue;  // Skip if the cell doesn't exist
                }
        
                // Fetch the value from the cell
                let cellValue;

                // If the cell is disabled, fetch the value using 'value' attribute
                if (cell.disabled) {
                    // Get value from the 'value' attribute for disabled cells
                    cellValue = cell.getAttribute('value');
                } else {
                    // Get value from the normal input value
                    cellValue = cell.value;
                }

                // If the value is empty (for empty cells), set it to 0
                if (cellValue === "") {
                    cellValue = 0;
                } else {
                    // Otherwise, parse it as an integer
                    cellValue = parseInt(cellValue);
                }
        
                // console.log(`Cell (${row},${col}): ${cellValue}`);  // Log each cell's value
        
                // console.log("Extracted -----> ", cellValue);
                rowValues.push(cellValue);
            }
            gridMatrix.push(rowValues);

            console.log("-----> loop :");
        }

        // Log the grid matrix for debugging
        console.log("Extracted Grid Matrix:", gridMatrix);
    } catch (error) {
        console.error("Error in extracting grid matrix:", error);
    }


    // Send the grid data to the backend for validation
    fetch('/submit_sudoku', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ solution: gridMatrix }) // Send the solution to Flask
    })
    .then(response => response.json())
    .then(data => {
        if (data.is_valid) {
            // If solution is correct, redirect to success page
            window.location.href = "/success";
        } else {
            // If solution is incorrect, show error message
            const statusElement = document.getElementById('status');
            statusElement.textContent = 'Incorrect solution. Please try again!';
            statusElement.style.color = 'red'; // Highlight the error message
        }
    })
    .catch(error => {
        console.error('Error submitting the solution:', error);
    });
}

// Other functions like updateCell and any other logic
function updateCell(event) {
    const input = event.target;
    let value = input.value;

    // Logic for single digit input (1-9)
    if (value.length > 1) {
        input.value = value.substring(0, 1);
    }

    if (!/^[1-9]$/.test(value)) {
        input.value = ''; // Clear the input if not a valid digit
    }
}

// Handle paste event to ensure only valid digits (1-9) are pasted
function handlePaste(event) {
    event.preventDefault();  // Prevent the default paste action
    const pastedText = event.clipboardData.getData('text');

    // Only paste if it's a valid number between 1 and 9
    if (/^[1-9]$/.test(pastedText)) {
        event.target.value = pastedText; // Paste the valid number
    } else {
        event.target.value = ''; // Clear if pasted value is invalid
    }
}

// Block any non-numeric characters during keydown event
function blockNonDigitKeys(event) {
    const key = event.key;

    // Allow only digits 1-9, backspace, delete, and arrow keys
    if (!/^[1-9]$/.test(key) && key !== 'Backspace' && key !== 'Delete' && key !== 'ArrowLeft' && key !== 'ArrowRight') {
        event.preventDefault(); // Prevent the non-digit key press
    }
}



// Add event listeners after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // Add event listeners to all input fields
    document.querySelectorAll('.grid input').forEach(input => {
        // Block non-digit keys
        input.addEventListener('keydown', blockNonDigitKeys);
        // Validate input (only digits 1-9)
        input.addEventListener('input', updateCell);
        // Handle paste event to ensure valid data is pasted
        input.addEventListener('paste', handlePaste);
    });
});

