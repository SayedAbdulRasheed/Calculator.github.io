// Global variables
let display = document.getElementById('display');
let currentInput = '0';
let shouldResetDisplay = false;

/**
 * Updates the calculator display with current input
 */
function updateDisplay() {
    display.textContent = currentInput;
}

/**
 * Appends a value (number or operator) to the current input
 * @param {string} value - The value to append
 */
function appendToDisplay(value) {
    if (shouldResetDisplay) {
        currentInput = '0';
        shouldResetDisplay = false;
    }

    if (currentInput === '0' && value !== '.') {
        currentInput = value;
    } else {
        // Prevent multiple decimal points in the same number
        if (value === '.') {
            let parts = currentInput.split(/[\+\-\*\/]/);
            let lastPart = parts[parts.length - 1];
            if (lastPart.includes('.')) {
                return;
            }
        }
        
        // Prevent multiple operators in a row
        if (['+', '-', '*', '/'].includes(value)) {
            let lastChar = currentInput.slice(-1);
            if (['+', '-', '*', '/'].includes(lastChar)) {
                currentInput = currentInput.slice(0, -1) + value;
            } else {
                currentInput += value;
            }
        } else {
            currentInput += value;
        }
    }
    
    updateDisplay();
}

/**
 * Clears the calculator display and resets input
 */
function clearDisplay() {
    currentInput = '0';
    shouldResetDisplay = false;
    updateDisplay();
}

/**
 * Deletes the last character from current input
 */
function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

/**
 * Performs the calculation and displays the result
 */
function calculate() {
    try {
        // Replace display multiplication symbol with JavaScript operator
        let expression = currentInput.replace(/×/g, '*');
        
        // Validate expression - only allow numbers, operators, and decimal points
        if (!/^[0-9+\-*/.() ]+$/.test(expression)) {
            throw new Error('Invalid characters');
        }
        
        // Check for division by zero
        if (expression.includes('/0')) {
            throw new Error('Division by zero');
        }
        
        let result = eval(expression);
        
        // Handle special cases
        if (!isFinite(result)) {
            throw new Error('Invalid result');
        }
        
        // Round to prevent floating point precision issues
        result = Math.round(result * 100000000) / 100000000;
        
        currentInput = result.toString();
        shouldResetDisplay = true;
        updateDisplay();
        
    } catch (error) {
        currentInput = 'Error';
        shouldResetDisplay = true;
        updateDisplay();
    }
}

/**
 * Handles keyboard input for calculator operations
 * @param {KeyboardEvent} event - The keyboard event object
 */
function handleKeyboard(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9') {
        appendToDisplay(key);
    } else if (key === '.') {
        appendToDisplay('.');
    } else if (key === '+') {
        appendToDisplay('+');
    } else if (key === '-') {
        appendToDisplay('-');
    } else if (key === '*') {
        appendToDisplay('*');
    } else if (key === '/') {
        event.preventDefault(); // Prevent browser search
        appendToDisplay('/');
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Escape' || key.toLowerCase() === 'c') {
        clearDisplay();
    } else if (key === 'Backspace') {
        deleteLast();
    }
}

// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get display element after DOM is loaded
    display = document.getElementById('display');
    
    // Add keyboard event listener
    document.addEventListener('keydown', handleKeyboard);
    
    // Initialize display
    updateDisplay();
});

// Fallback: Add keyboard listener immediately if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        display = document.getElementById('display');
        document.addEventListener('keydown', handleKeyboard);
        updateDisplay();
    });
} else {
    // DOM already loaded
    display = document.getElementById('display');
    document.addEventListener('keydown', handleKeyboard);
    updateDisplay();
}