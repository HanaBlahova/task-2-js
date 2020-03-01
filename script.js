// DECLARATION OF VARIABLES
let grossWage;
let socialInsEmployerRate = 0.248;
let healthInsEmployerRate = 0.09;
let insTotalEmployerRate = (socialInsEmployerRate + healthInsEmployerRate);
let socialInsEmployeeRate= 0.065;
let healthInsEmployeeRate = 0.045;
let incomeTaxRate = 0.15;
let taxPayerDiscount = 2070;
let minWage = 14600;
let wagesArr = [];


// FUNCTIONS

// Calculation of super gross wage and its rounding
let roundedCalc = ((wage, insRate) => {
   return Math.ceil((wage * (1 + insRate))/100)*100;
});

// Calculation of tax
let taxCalc = ((basis, taxRate) => {
    return basis * taxRate;
});

// Calculation of gross tax (excluding discounts)
let netTaxCalc = ((taxAmount, taxDiscount) => {
    if(taxAmount > taxDiscount) {
        return taxAmount - taxDiscount;
    } else {
        return 0;
    }
});

// Calculation of social and health insurance paying by employee
let insEmployeeCalc = ((wage, insRate) => {
    return wage * insRate;
});

// Calculation of net wage
let netWage = (wage) => {

    let tax = netTaxCalc(taxCalc(roundedCalc(wage, insTotalEmployerRate), incomeTaxRate), taxPayerDiscount); 
    let socIns = insEmployeeCalc(wage, socialInsEmployeeRate); 
    let healthIns = insEmployeeCalc(wage, healthInsEmployeeRate);

    return wage - tax - socIns - healthIns;
};

// Results printing function
function printResults() {

    let el = document.getElementById("history");
    el.innerHTML = "";
    
    let i = 0;
    for (const cur of wagesArr) {
        document.getElementById("history").insertAdjacentHTML('afterbegin', '<div><p class="p">' + cur + '</p><button class="item-delete" onclick="deleteItem(' + i + ');">Delete</button></div>');
        i ++;
    }
}

// Onload function
window.onload = () => {
    
    let wages = JSON.parse(window.localStorage.getItem('result'));

    if (wages !== null) {
        let i = 0;
        for (const cur of wages) {
            document.getElementById("history").insertAdjacentHTML('afterbegin', '<div><p class="p">' + cur + '</p><button class="item-delete" onclick="deleteItem(' + i + ');">Delete</button></div>');
            i ++;
        }
        wagesArr = wages;
    }
}


// DOM MANIPULATION

// Calculation and printing results
function setCalcResult() {
    grossWage = document.getElementById("wageInput").value;
    grossWage = parseInt(grossWage);

    // Avoiding of falsy values
    if (grossWage === 0) {
        alert("Zadejte prosím částku hrubé mzdy!");

    } else if (grossWage < minWage){
        alert("Zadaná mzda je nižší než minimální mzda!");

    } else if (grossWage !== undefined && grossWage !== null && grossWage !== "" && !isNaN(grossWage)) {

        // Creating calc result and array of results
        let result = `Hrubá mzda: ${grossWage} - Čistá mzda: ${netWage(grossWage)}`;
        wagesArr.push(result);
        printResults();

        // Local Storage
        if (typeof(Storage) !== "undefined") {
            window.localStorage.setItem('result', JSON.stringify(wagesArr));

        } else {
            alert("No web storage support!")
        }

    } else {
        alert("Zadejte prosím částku hrubé mzdy!");
    }
    
};

// Deleting of all results function
function deleteHistory() {
    let el = document.getElementById("history");
    el.innerHTML = "";

    // Local Storage clear
    window.localStorage.clear();

    // Clear of array
    wagesArr = [];
};

// Deleting of one result function
function deleteItem(i) {

    if (i !== -1) {
        wagesArr.splice(i, 1); 
    }

    // DOM manipulation
    let parent = event.target.parentNode;
    parent.parentNode.removeChild(parent);

    // Local storage updating
    window.localStorage.clear();
    window.localStorage.setItem('result', JSON.stringify(wagesArr));
};







