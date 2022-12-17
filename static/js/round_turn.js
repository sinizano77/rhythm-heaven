var reloadButton = document.getElementById('reload_button');
var gameName = document.getElementById('game_name').textContent;
var gameCategory = document.getElementById('category_text').textContent;
var gamePlatform = document.getElementById('game_console').textContent;

const value_buttons = document.querySelectorAll(".value_button");


var value = 0;
// maybe add boolean later to make sure that a value button got clicked / input

var submitButton = document.getElementById('player_footer_button');


reloadButton.addEventListener("click", () => {
    var data = gameName + ":" + gameCategory + ":" + gamePlatform;
    functionPromise(data, null).then( response => {
        console.log(response);
        window.location.href= '/round_turn';
    }
        
    );
});

function functionPromise(data, pointValue){

    // returns a promise that can be used later. 

    return $.post( "/round_turn", {
        'skipped_game_identifiers': JSON.stringify(data),
        'point_value': pointValue
    });
}

submitButton.addEventListener("click", () => {
    functionPromise(null, value).then( response => {
        window.location.href= '/round_turn';
    });
    
});

value_buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
        value = parseInt(button.firstElementChild.lastElementChild.textContent.split(" ")[0]);
    })
});