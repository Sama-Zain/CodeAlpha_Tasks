let input = document.querySelector(".input");
let buttons = document.querySelectorAll("button");
let realtime = document.getElementById("realtime");

input.focus();

// Play sounds (optional)
let clickSound = new Audio("sounds/Mouse-Click-00-c-FesliyanStudios.com.mp3");
let equalSound = new Audio("sounds/Splash-Cymbal-Hit-D-www.fesliyanstudios.com.mp3");
let delSound = new Audio("sounds/P226-9mm-Close-Single-Gunshot-C-www.fesliyanstudios.com.mp3");

function calculate(value) {
    if (!value) return "";
    try {
        // Replace % with /100
        let result = eval(value.replace(/%/g, "/100"));
        return result;
    } catch {
        return "";
    }
}

function isOperator(char) {
    return ["+", "-", "*", "/", "%"].includes(char);
}

// Update realtime result
function updateRealtime() {
    let val = input.value;
    let last = val[val.length - 1];
    if (isOperator(last)) val = val.slice(0, -1);
    realtime.textContent = calculate(val);
}

// Handle button click
buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
        let value = btn.getAttribute("data-value");
        if (value === "AC") input.value = "";
        else if (value === "DEL") input.value = input.value.slice(0, -1);
        else if (value === "=") {
            try {
                input.value = calculate(input.value);
            } catch { input.value = "Error"; }
        } else {
            // Prevent double operators
            let last = input.value[input.value.length - 1];
            if (isOperator(value) && isOperator(last)) return;
            input.value += value;
        }
        updateRealtime();
    });
});

// Keyboard support
document.addEventListener("keydown", (e) => {
    const key = e.key;
    if ((key >= "0" && key <= "9") || key === "." || isOperator(key)) {
        e.preventDefault(); // Prevent default to avoid unwanted input  
        let last = input.value[input.value.length - 1];
        if (isOperator(key) && isOperator(last)) return;
        input.value += key;
    } else if (key === "Enter") {
        e.preventDefault();
        input.value = calculate(input.value);
    } else if (key === "Backspace") {
        e.preventDefault();
        input.value = input.value.slice(0, -1);
    } else if (key === "Escape") {
        e.preventDefault();
        input.value = "";
    }
    updateRealtime();
});
input.addEventListener("input", updateRealtime);

// Initial update
updateRealtime();   