function updateCell(event) {
    const input = event.target;
    const value = input.value;
    if (value && !/^[1-9]$/.test(value)) {
        // Ensure only numbers 1-9 are entered
        input.value = '';
    }
}

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
