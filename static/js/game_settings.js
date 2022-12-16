const game_mode_button_list = document.querySelectorAll(".game_mode");
const game_pool_button_list = document.querySelectorAll(".game_pool");
const point_mode_button_list = document.querySelectorAll(".point_mode");
const round_input = document.getElementById("round_field");
const round_max = parseInt(round_input.placeholder.split(" ")[1])

var probabilitySubmitButton = document.getElementById('player_footer_button');
var form = document.getElementById('form_info')
var errorText = document.getElementById('error_message');

probabilitySubmitButton.addEventListener("click", () => {
    if (round_input.value == '') {
        console.log("no round value inputted");
        errorText.style.display = "block";
        errorText.textContent = "ERROR: The round input cannot be blank";
        form.style.marginTop = '1%';
        form.style.height = '59vh';
    }
    else if (parseInt(round_input.value) > round_max) {
        console.log("too many rounds inputted");
        errorText.style.display = "block";
        errorText.textContent = "ERROR: Too many rounds have been inputted";
        form.style.marginTop = '1%';
        form.style.height = '59vh';
    }
    else {
        errorText.style.display = "none";
        form.style.marginTop = '8%';
        form.style.height = '65vh';
        sendData();
    }
})

addListeners(game_mode_button_list, "game_mode");
addListeners(game_pool_button_list, "game_pool");
addListeners(point_mode_button_list, "point_mode");

round_input.addEventListener("keypress", function (evt) {
    if (evt.which < 48 || evt.which > 57)
    {
        evt.preventDefault();
    }
});

function sendData() {
    var dataList = [];
    dataList.push(findSelectedButton(game_mode_button_list));
    dataList.push(findSelectedButton(game_pool_button_list));
    dataList.push(parseInt(round_input.value));
    dataList.push(findSelectedButton(point_mode_button_list));
    
    functionPromise(dataList).then( response => {
        window.location.href= '/show_player_info'
    }
        
    );
}

function functionPromise(dataList){

    // returns a promise that can be used later. 

    return $.post( "/settings_data", {
        body: JSON.stringify(dataList)
    });
}

function addListeners(element, className) {
    element.forEach((button, index) => {
        button.addEventListener("click", () => {
            if (button.firstElementChild.classList.contains("deselected")) {
                var otherIndex = index * -1 + 1;
                
                // deselect this button
                button.firstElementChild.classList.remove("deselected");

                // enable the other button
                element[otherIndex].firstElementChild.classList.add("deselected");

                // change text if needed
                if (className == 'game_mode') {
                    var text_element = document.getElementById('game_mode_text');
                    if (otherIndex == 0) {
                        text_element.innerHTML = '<b>Same Game:</b> Everyone plays the same game';
                    }
                    else {
                        text_element.innerHTML = '<b>Different Game:</b> Each person plays a different game';
                    }
                    
                }
                if (className == 'game_pool') {
                    var text_element = document.getElementById('game_pool_text');
                    if (otherIndex == 0) {
                        text_element.innerHTML = '<b>Progressive:</b> Sequels/Remixes are unlocked after completing predecessors';
                    }
                    else {
                        text_element.innerHTML = '<b>All Available:</b> Every rhythm game is immediately available';
                    }
                    
                }

            }
        })
    });
}

function findSelectedButton(elementList) {
    if (elementList[0].firstElementChild.classList.contains("deselected")) {
        return 1;
    }
    return 0;
}


