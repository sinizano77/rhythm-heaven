const option_buttons = document.querySelectorAll(".option_button");
const category_info_div = document.querySelectorAll('.category_info');
const category_info_text = document.querySelectorAll('.category_name_and_amt');
const game_amt = document.querySelectorAll('.hidden_amt');
const probability_input = document.querySelectorAll('.name_field');
const percent_text = document.querySelectorAll('.percent_text');
var probabilitySubmitButton = document.getElementById('player_footer_button');
var spreadSheet = document.getElementById('spreadsheet_info')
var titleRow = document.getElementById('title_row');
var errorText = document.getElementById('error_message');
var totalAmtText = document.getElementById('total_amt');
var totalProbText = document.getElementById('total_probability');

var totalGames = getTotalGames();
totalAmtText.textContent = "Total Games: " + String(totalGames);

probabilitySubmitButton.addEventListener("click", () => {
    var probTotal = getProbabilityTotal();
    if (totalGames == 0) {
        console.log("no categories chosen");
        errorText.style.display = "block";
        errorText.textContent = "ERROR: At least one category must be enabled";
        titleRow.style.marginTop = '1%';
        spreadSheet.style.height = '45vh';
    }
    else if (probTotal != 100) {
        console.log("probabilities don't add up");
        errorText.style.display = "block";
        errorText.textContent = "ERROR: All percentages must add up to 100% (Current % total: " + String(probTotal) + "%)";
        titleRow.style.marginTop = '1%';
        spreadSheet.style.height = '45vh';
    }
    else {
        errorText.style.display = "none";
        titleRow.style.marginTop = '6%';
        spreadSheet.style.height = '55vh';
        sendData();
    }
})

addListeners();

function sendData() {
    var dataList = [];
    for (let i = 0; i < probability_input.length; i++) {
        var tempProbVal = '-1';
        if (probability_input[i].disabled == false) {
            tempProbVal = probability_input[i].value;
            if (tempProbVal.length == 0) {
                tempProbVal = probability_input[i].placeholder;
            }
        }
        dataList.push(category_info_text[i].textContent.split(" ").slice(0, -1).join(" ") + ":" + tempProbVal);
    }
    

   
    functionPromise(dataList, totalGames).then( response => {
        console.log('response from promise');
        window.location.href= '/game_settings'
    }
        
    );
}

function functionPromise(dataList, totalGames){

    // returns a promise that can be used later. 

    return $.post( "/probability_data", {
        body: JSON.stringify(dataList),
        total: JSON.stringify(totalGames)
    });
}

function addListeners() {
    option_buttons.forEach((button, index) => {
        button.addEventListener("click", () => {
            console.log("option turned on/off");
            var className = button.firstElementChild.className;
            if (className == 'remove_button_img') {
                // update total game count
                totalGames-= parseInt(game_amt[index].textContent);
                totalAmtText.textContent = "Total Games: " + String(totalGames);

                // make all item opacity 50%
                // change button icon
                button.firstElementChild.classList.remove('remove_button_img');
                button.firstElementChild.classList.add('add_button_img');
                button.firstElementChild.src = 'static/assets/add_button.png';

                category_info_div[index].classList.add('deactivated');

                probability_input[index].placeholder = '-';
                probability_input[index].value = '';
                probability_input[index].disabled = true;
                probability_input[index].classList.add('deactivated');

                percent_text[index].classList.remove('enabled');
                percent_text[index].classList.add('disabled');

                var probabilityTotal = getProbabilityTotal();
                totalProbText.textContent = "/Total Probability: " + String(probabilityTotal);
            }
            else {
                // update total game amount
                totalGames+= parseInt(game_amt[index].textContent);
                totalAmtText.textContent = "Total Games: " + String(totalGames);

                // make all item opacity 100%
                // change button icon
                button.firstElementChild.classList.remove('add_button_img');
                button.firstElementChild.classList.add('remove_button_img');
                button.firstElementChild.src = 'static/assets/remove_button.png';

                category_info_div[index].classList.remove('deactivated');

                probability_input[index].placeholder = '0';
                probability_input[index].value = '';
                probability_input[index].disabled = false;
                probability_input[index].classList.remove('deactivated');

                percent_text[index].classList.remove('disabled');
                percent_text[index].classList.add('enabled');

            }
            
        })
    });

    $(".name_field").on("input", function() {
        var probabilityTotal = getProbabilityTotal();
        totalProbText.textContent = "/Total Probability: " + String(probabilityTotal);
     });

}

function getProbabilityTotal() {
    var probabilityTotal = 0;
    for (let i = 0; i < probability_input.length; i++) {
        if (probability_input[i].disabled == false) {
            var tempProbVal = probability_input[i].value;
            if (tempProbVal.length == 0) {
                probabilityTotal += parseInt(probability_input[i].placeholder);
            }
            else {
                probabilityTotal += parseInt(tempProbVal);
            }
        }
    }
    return probabilityTotal;
}

function getTotalGames() {
    var total = 0;
    for (let i = 0; i < game_amt.length; i++) {
        total += parseInt(game_amt[i].textContent);
    }
    return total;
}

document.querySelector(".name_field").addEventListener("keypress", function (evt) {
    if (evt.which < 48 || evt.which > 57)
    {
        evt.preventDefault();
    }
});