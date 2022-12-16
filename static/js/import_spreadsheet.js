const option_buttons = document.querySelectorAll(".option_button");
const file_name_text = document.querySelectorAll('.file_name');
const file_game_count = document.querySelectorAll('.game_count');
var fileSubmitButton = document.getElementById('player_footer_button');
var spreadSheet = document.getElementById('spreadsheet_info')
var errorText = document.getElementById('error_message');


var gameCount = 0;

addListeners();
addCount();

fileSubmitButton.addEventListener("click", () => {
    if (gameCount == 0) {
        console.log("no text files with games chosen");
        errorText.style.display = "block";
        spreadSheet.style.marginTop = '1%';
    }
    else {
        errorText.style.display = "none";
        spreadSheet.style.marginTop = '6%';
        sendData();
    }
})

function sendData() {
    var dataList = [];

    for (var i = 0; i < option_buttons.length; i++) {        
        if (option_buttons[i].firstElementChild.className == 'remove_button_img') {
            dataList.push(file_name_text[i].textContent)
        }
    }

    functionPromise(dataList).then( response => 
        window.location.href= '/calculate_categories'
    );
}

function functionPromise(dataList){

    // returns a promise that can be used later. 
  
    return $.post( "/file_data", {
        body: JSON.stringify(dataList)
    });
  }

function addCount() {
    for (var i = 0; i < file_game_count.length; i++) {
        if (option_buttons[i].firstElementChild.className == 'remove_button_img') {
            gameCount += parseInt(file_game_count[i].textContent)
        }
        
    }
}


function addListeners() {
    option_buttons.forEach((button, index) => {
        button.addEventListener("click", () => {
            console.log("option turned on/off");
            var className = button.firstElementChild.className;
            if (className == 'remove_button_img') {
                gameCount-=parseInt(file_game_count[index].textContent);
                // make text tint lighter
                // turn '-' into '+' icon
                button.firstElementChild.classList.remove('remove_button_img')
                button.firstElementChild.classList.add('add_button_img')
                button.firstElementChild.src = 'static/assets/add_button.png';
                file_name_text[index].style.color = 'rgba(255, 255, 255, 0.5)';
            }
            else {
                gameCount+=parseInt(file_game_count[index].textContent);
                // make text tint darker
                // turn '+' icon into '-' icon
                button.firstElementChild.classList.remove('add_button_img')
                button.firstElementChild.classList.add('remove_button_img')
                button.firstElementChild.src = 'static/assets/remove_button.png';
                file_name_text[index].style.color = 'rgba(255, 255, 255, 1)';

            }
            
        })
    });

}