var reloadButton = document.getElementById('reload_button');
var gameName = document.getElementById('game_name').textContent;
var gameCategory = document.getElementById('category_text').textContent;
var gamePlatform = document.getElementById('game_console').textContent;

var undoButton = document.getElementById('undo_button');
var playerText = document.getElementById('player_turn_text').textContent;
var confirmDiv = document.getElementById('confirm_div');
var confirmText = document.getElementById('confirm_text');

const value_buttons = document.querySelectorAll(".value_button");
const value_list = document.querySelectorAll(".value_div_text");


var value = "Try Again";
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
    toggleValueButtonVisibility();
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


value_buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
        value = button.firstElementChild.lastElementChild.textContent;
        console.log(value);
        confirmDiv.style.display = 'flex';
        console.log(document.getElementById('player_turn_text').innerHTML);
        confirmText.innerHTML = twoPlayerConfirmationText(value_list[index].textContent);
        toggleValueButtonVisibility();
        submitButton.disabled = false;
        submitDiv[0].style.opacity = '100%';
    })
});

// prob gonna be input like - 50.0 pts or - (37.5) 50.0 pts
function cleanUpValue(value) {
    value_arr = value.split(" ")
    if (value_arr.length == 3) {
        console.log(value_arr[1]);
        int_point = parseInt(value_arr[1]);
        return String(int_point) + " points";
    }
    else {
        handicap_point = parseInt(value_arr[1].replace("(", "").replace(")", ""));
        int_point = parseInt(value_arr[2]);
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

function toggleValueButtonVisibility() {
    console.log('toggling visibility');
    for (let i = 0; i < value_buttons.length; i++) {
        if (value_buttons[i].style.display != 'none') {
            value_buttons[i].style.display = 'none';
        }
        else {
            value_buttons[i].style.display = 'block';
        }
    }
}