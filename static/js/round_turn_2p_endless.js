var reloadButton = document.getElementById('reload_button');
var gameName = document.getElementById('game_name').textContent;
var gameCategory = document.getElementById('category_text').textContent;
var gamePlatform = document.getElementById('game_console').textContent;

var undoButton = document.getElementById('undo_button');
var confirmDiv = document.getElementById('confirm_div');
var confirmText = document.getElementById('confirm_text');

const input_div = document.getElementById('input_info');
const multiplier_text = document.getElementById('multiplier');
const score_input = document.getElementById('score_field');
const enter_button_div = document.getElementById('enter_button_div');
const enterButton = document.getElementById('enter_button');


var value = "0";
// maybe add boolean later to make sure that a value button got clicked / input

var submitButton = document.getElementById('player_footer_button');
var submitDiv = document.getElementsByClassName('center_submit_button');


reloadButton.addEventListener("click", () => {
    var data = gameName + ":" + gameCategory + ":" + gamePlatform;
    functionPromise(data, null).then( response => {
        console.log(response);
        window.location.href= '/round_turn';
    }
        
    );
});

undoButton.addEventListener("click", () => {
    confirmDiv.style.display = 'none';
    submitButton.disabled = true;
    submitDiv[0].style.opacity = '50%';
    input_div.style.display = 'flex';
    enter_button_div.style.display = 'flex';
});

function functionPromise(data, pointValue){

    // returns a promise that can be used later. 

    return $.post( "/round_turn", {
        'skipped_game_identifiers': JSON.stringify(data),
        'point_value': pointValue
    });
}


if (document.getElementById('next_button_text').textContent == 'End Round') {
    console.log("end round")
    // dummy stuff
    submitButton.addEventListener("click", () => {
        functionPromise(null, value).then(response => {
            window.location.href= '/show_round_info';
        });
    })
    
}
else {
    console.log("get next turn")
    submitButton.addEventListener("click", () => {
        functionPromise(null, value).then( response => {
            window.location.href= '/round_turn';
        });
        
    });
}

$("#score_field").on("input", function() {
    var totalAmt = 0;
    var tempTextArr = multiplier_text.textContent.split(" ");
    var multiplierAmt = parseFloat(tempTextArr[1]);
    var tempVal = score_input.value;
    if (tempVal.length == 0) {
        tempVal = 0;
    }
    totalAmt = multiplierAmt * parseInt(tempVal);
    multiplier_text.textContent = tempTextArr.slice(0, -2).join(" ") + " " + String(totalAmt) + " pts";

 });

 document.querySelector("#score_field").addEventListener("keypress", function (evt) {
    if (evt.which < 48 || evt.which > 57)
    {
        evt.preventDefault();
    }
});

enterButton.addEventListener("click", () => {
    value = score_input.value;
    console.log(value);
    confirmDiv.style.display = 'flex';
    confirmText.innerHTML = twoPlayerConfirmationText(multiplier_text.textContent);
    input_div.style.display = 'none';
    enter_button_div.style.display = 'none';
    submitButton.disabled = false;
    submitDiv[0].style.opacity = '100%';
});

// prob gonna be input like x 2 = 6 pts or x 2 (x 0.75) = (4.5) 6 pts
function cleanUpValue(value) {
    value_arr = value.split(" ")
    console.log(value_arr);
    console.log(value_arr.length);
    if (value_arr.length == 5) {
        console.log(value_arr[3]);
        int_point = parseInt(value_arr[3]);
        return String(int_point) + " points";
    }
    else {
        console.log('value arr more than length of 5');
        handicap_point = parseInt(value_arr[6].replace("(", "").replace(")", ""));
        int_point = parseInt(value_arr[7]);
        return String(handicap_point) + " " + String(int_point);
    }
}

// deal with 2 player text
function twoPlayerConfirmationText(value) {
    var firstText = "Added ";
    var secondText = "Added ";
    var points = cleanUpValue(value);
    var nameHTML = document.getElementById('player_turn_text').innerHTML;
    var tempNameArr = nameHTML.split(" ").slice(0, -1);
    var indexAnd = tempNameArr.indexOf("and");
    var firstName = tempNameArr.slice(0, indexAnd).join(" ");
    var secondName = tempNameArr.slice(indexAnd + 1).join(" ");
    // no handicap
    if (points.includes("points")) {
        firstText += points + " to " + firstName + " score";
        secondText += points + " to " + secondName + " score";
        return firstText + "<br>" + secondText;
    }
   // at least one person has a handicap
    else {
        var orangeIndexExists = firstName.includes("#F86818");
        // first person is the handicap
        if (orangeIndexExists) {
            firstText += points.split(" ")[0] + " points to " + firstName + " score";
        }
        else {
            firstText += points.split(" ")[1] + " points to " + firstName + " score";
        }

        var orangeIndexExists = secondName.includes("#F86818");
        // second person is the handicap
        if (orangeIndexExists) {
            secondText += points.split(" ")[0] + " points to " + secondName + " score";
        }
        else {
            secondText += points.split(" ")[1] + " points to " + secondName + " score";
        }

        return firstText + "<br>" + secondText;

        
        
    }

}