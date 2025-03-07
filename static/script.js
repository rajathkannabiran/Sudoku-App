function checkSolution() {
    const solution = [];
    for (let row = 0; row < 9; row++) {
        let rowValues = [];
        for (let col = 0; col < 9; col++) {
            const cell = document.getElementById(`cell-${row}-${col}`);
            rowValues.push(cell.value ? parseInt(cell.value) : 0);
        }
        solution.push(rowValues);
    }

    // Send the solution to the Flask backend for validation
    fetch('/validate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ solution }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.is_valid) {
            document.getElementById('status').textContent = 'Congratulations! You solved the puzzle!';
            document.getElementById('status').style.color = 'green';
        } else {
            document.getElementById('status').textContent = 'Oops! Try again!';
            document.getElementById('status').style.color = 'red';
        }
    });
}

function resetBoard() {
    const inputs = document.querySelectorAll('.cell');
    inputs.forEach(input => {
        if (!input.disabled) {
            input.value = '';
        }
    });
    document.getElementById('status').textContent = '';
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

