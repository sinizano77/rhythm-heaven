var formLeft = $('div.left');
var formRight = $('div.right');
var playerSubmitButton = document.getElementById('player_footer_button');
var errorText = document.getElementById('error_message');
var maxCount = 12;

var currActive = 1;

var handicapArr = [false, false, false, false, false, false, false, false, false, false, false, false];

const pfpArray = ['barista', 'choir_kid', 'donpan', 'frog_dancer', 'moai', 'nova', 'pink_monkey', 'pop_singer', 'reporter', 'tap_girl', 'tibby', 'trio_clapper']


var visualBreak = '<div class="better_break"></div>';
recreateTable()

playerSubmitButton.addEventListener("click", () => {
    if (currActive == 0) {
        errorText.style.display = "block";
    }
    else {
        errorText.style.display = "none";
        sendData();
    }
})

function sendData() {
    var dataList = [];
    const text_fields = document.querySelectorAll(".name_field");

    for (var i = 0; i < currActive; i++) {
        /*var elementData = new Map();
        elementData['pfp'] = pfpArray[i];*/
        var name = text_fields[i].value;
        if (name == '') {
            name = "Player " + String(i + 1);
        }
        /*elementData['name'] = name;
        elementData['handicapOn'] = handicapArr[i];*/

        var elementData = {
            'name': name,
            'pfp': pfpArray[i],
            'handicapOn': String(handicapArr[i])
        }
        console.log('name: ' + name);

        console.log('elementData: ' + JSON.stringify(elementData));


        dataList.push(elementData);
        console.log('dataList: ' + JSON.stringify(dataList));
    }

    var finalData = {
        'data': dataList
    }

    $.post( "/player_data", {
        body: JSON.stringify(dataList)
    });

    window.location.href = '/import_spreadsheet';


}



function recreateTable() {
    var currFilled = 6;
    if (currActive < 6) {
        currFilled = currActive;
    }
    // create active components on left side
    for(var i = 0; i < currFilled; i++) {
        formLeft.append(createPfpElement(true, handicapArr[i], i));
        formLeft.append(createTextElement(true, i + 1));
        formLeft.append(createPlayerElement(true, i+1 < currActive)); // deactivate '-' button for previous ones
        var state = 1;
        if (handicapArr[i] == true) {
            state = 2;
        }
        formLeft.append(createHandicapElement(state));
        if (i != 5) {
            formLeft.append(visualBreak);
        }
    }

    // IF active components don't fill up left side, create the next '+' on left side
    if (currActive < 6) {
        formLeft.append(createPfpElement(false, handicapArr[currActive], currActive));
        formLeft.append(createTextElement(false, currActive + 1));
        formLeft.append(createPlayerElement(false, false));
        formLeft.append(createHandicapElement(0));
        if (currActive != 5) {
            formLeft.append(visualBreak);
        }
    }
    // IF there is extra space after '+' on left column, just create empty spaces where they're all hidden 
    for (var i = currActive + 1; i < 6; i++) {
        formLeft.append(createPfpElement(false, handicapArr[i], i));
        formLeft.append(createTextElement(false, i + 1));
        formLeft.append(createPlayerElement(false, true));
        formLeft.append(createHandicapElement(0));
        if (i != 5) {
            formLeft.append(visualBreak);
        }
    }
    
    // IF all left column is filled and right column can be filled too
    for(var i = 6; i < currActive; i++) {
        formRight.append(createPfpElement(true, handicapArr[i], i));
        formRight.append(createTextElement(true, i + 1));
        formRight.append(createPlayerElement(true, i + 1 < currActive));
        var state = 1;
        if (handicapArr[i] == true) {
            state = 2;
        }
        formRight.append(createHandicapElement(state));
        if (i != 11) {
            formRight.append(visualBreak);
        }
    }

    // IF '+' icon is added to right column
    if (currActive > 5 && currActive != 12) {
        formRight.append(createPfpElement(false, handicapArr[currActive], currActive));
        formRight.append(createTextElement(false, currActive + 1));
        formRight.append(createPlayerElement(false, false));
        formRight.append(createHandicapElement(0));
        if (currActive != 11) {
            formRight.append(visualBreak);
        }
    }

    // IF extra space can be added to right column
    currFilled = 5;
    if (currActive > 5) {
        currFiled = currActive;
    }
    for (var i = currFilled + 1; i < 12; i++) {
        formRight.append(createPfpElement(false, handicapArr[i], i));
        formRight.append(createTextElement(false, i + 1));
        formRight.append(createPlayerElement(false, true));
        formRight.append(createHandicapElement(0));
        if (i != 11) {
            formRight.append(visualBreak);
        }
    }

    // add listeners
    const handicap_buttons = document.querySelectorAll(".handicap_player_button");
    const player_buttons = document.querySelectorAll(".player_button");
    const pfp_buttons = document.querySelectorAll(".pfp_image_button");
    const text_fields = document.querySelectorAll(".name_field");

    handicap_buttons.forEach((button, index) => {
        button.addEventListener("click", () => {
            console.log("handicap turned on/off");
            handicapArr[index] = !handicapArr[index];
            if (handicapArr[index] == true) {
                // turn on handicap
                button.firstElementChild.classList.remove("deactivated");
                text_fields[index].style.borderColor = '#F86818';
                pfp_buttons[index].firstElementChild.src = 'static/character_icons/pfp_' + pfpArray[index] + '_2.png';

                
            }
            else {
                // turn off handicap
                button.firstElementChild.classList.add("deactivated");
                text_fields[index].style.borderColor = '#85B6FF';
                pfp_buttons[index].firstElementChild.src = 'static/character_icons/pfp_' + pfpArray[index] + '_1.png';

            }
            
        })
    });

    player_buttons.forEach((button, index) => {
        button.addEventListener("click", () => {
           // check what type of button was clicked
           if (button.firstElementChild.className == 'remove_button_img') {
               console.log("remove row");
               currActive -= 1;
               // When deleting row, three things need to happen:
               // row before must have an enabled '-' button with 100% opacity
               if (index > 0) {
                player_buttons[index - 1].disabled = false;
                player_buttons[index - 1].firstElementChild.classList.remove("deactivated");
               }

               // current row must deactivate all items asides from player_button
               // player_button will now be replaced to a '+' icon
               // hide pfp
               pfp_buttons[index].disabled = true;
               pfp_buttons[index].firstElementChild.classList.add("hidden");
               pfp_buttons[index].firstElementChild.src = 'static/character_icons/pfp_' + pfpArray[index] + '_1.png';

               // disable text field
               text_fields[index].disabled = true;
               text_fields[index].classList.add("deactivated");
               text_fields[index].value = "";
               text_fields[index].style.borderColor = '#85B6FF';
               text_fields[index].placeholder = "";

               // turn the '-' icon into '+' icon
               button.firstElementChild.classList.remove("remove_button_img");
               button.firstElementChild.classList.add("add_button_img");
               button.firstElementChild.src = 'static/assets/add_button.png';
               
               // show the opaque handicap icon
               handicap_buttons[index].disabled = true;
               handicap_buttons[index].firstElementChild.classList.remove("deactivated");
               handicap_buttons[index].firstElementChild.classList.add("hidden");
               handicapArr[index] = false;
               

                // next row hides their '+' icon
                if (index < 11) {
                    player_buttons[index+1].disabled = true;
                    player_buttons[index+1].firstElementChild.classList.add("hidden");
                }
           }
           else {
               console.log("add row");
               currActive += 1;
               // when adding row, three things need to happen:
                // the row before must have a disabled '-' button with 50% opacity
                if (index > 0) {
                    player_buttons[index - 1].disabled = true;
                    player_buttons[index - 1].firstElementChild.classList.add("deactivated");
                }
                

               // the same row must be activated
               // show pfp
               pfp_buttons[index].disabled = false;
               pfp_buttons[index].firstElementChild.classList.remove("hidden");

               // show text field
               text_fields[index].disabled = false;
               text_fields[index].classList.remove("deactivated");
               text_fields[index].placeholder = "Player " + String(index + 1) + " Name";

               // turn the '+' icon into '-' icon
               button.firstElementChild.classList.remove("add_button_img");
               button.firstElementChild.classList.add("remove_button_img");
               button.firstElementChild.src = 'static/assets/remove_button.png';
               
               // show the opaque handicap icon
               handicap_buttons[index].disabled = false;
               handicap_buttons[index].firstElementChild.classList.remove("hidden");
               handicap_buttons[index].firstElementChild.classList.add("deactivated");
               
               // the next row should have the '+' icon shown
               if (index < 11) {
                    player_buttons[index+1].disabled = false;
                    player_buttons[index+1].firstElementChild.classList.remove("hidden");
               }
               
           }
            
        })
    });



    
}

// example: var activeElementPfp = '<button class="pfp_image_button"><img src="static/character_icons/pfp_barista_1.png" alt="barista img" class="pfp"></button>';
// isActive: Boolean, handicapOn: Boolean, indexNum: Int (index 0)
// returns the string of pfp element
function createPfpElement(isActive, handicapOn, indexNum) {
    var element = '<button type="button" class="pfp_image_button"';
    var imageName = pfpArray[indexNum]
    if (!isActive) {
        element += ' disabled';
    }
    element += '><img src="static/character_icons/pfp_';
    element+=imageName;
    element += '_';
    if (!handicapOn) {
        element += '1';
    }
    else {
        element += '2';
    }
    element+='.png" alt="';
    element+=imageName;
    element+='img" class="pfp';
    if (!isActive) {
        element += ' hidden';
    }
    element+='"></button>';
    return element;
}

// example: var activeTextElement = '<input class="name_field" type="text" name="name" placeholder="Player 1 Name" value="{{ request.form[\'name\'] }}"></input>';
// isActive: Boolean, indexNum: Int (Index 1)
// returns the text element in string
function createTextElement(isActive, indexNum) {
    var element = '<input class="name_field';
    if (!isActive) {
        element += ' deactivated';
    }
    element += '" type="text" name="name"';
    if (isActive) {
        element += ' placeholder="Player ';
        element += String(indexNum);
        element += ' Name"';
    }
    else {
        element += ' disabled';
    }
    
    element += '></input>';
    return element;
}

// example: var activePlayerButton = '<button class="delete_player_button"><img src="static/assets/remove_button.png" alt="remove button" class="remove_button_img"></button>';
// this function creates the '+' or '-' icon or hides it altogether 
// isActive: Boolean, shouldHide: Boolean
// if isActive = true, ,shouldHide = true, then show the '-' icon with 'deactivated' class
// if isActive = true, shouldHide = false, then show the '-' icon
// if isActive = false, shouldHide = false, then show the '+' icon
// if isActive = false, shouldHide = true, don't show anything
function createPlayerElement(isActive, shouldHide) {
    var element = '<button type="button" class="player_button"';
    
    // create img
    if (shouldHide) {
        element +=' disabled';
    }
    element +='><img src="static/assets/';
    if (isActive) {
        element += 'remove_button';
    }
    else {
        element += 'add_button';
    }
    element+= '.png" alt="'
    if (isActive) {
        element += 'remove';
    }
    else {
        element += 'add';
    }
    element+=' button" class="';
    
    if (isActive) {
        element += 'remove_button_img';
        if (shouldHide) {
            element += ' deactivated';
        }
    }
    else {
        if (!shouldHide) {
            element += 'add_button_img';
        }
        else {
            element += 'add_button_img hidden';
        }
    }
    element+='"></button>';
    return element;

}

//example: var handicapButton = '<button class="handicap_player_button"><img src="static/assets/handicap_button.png" alt="handicap button" class="handicap_button_img deactivated"></button>';
// states: Int (0, 1, 2)
// if state = 0 --> hide it
// if state = 1 --> 50% opacity
// if state = 2 --> 100% opacity
function createHandicapElement(state) {
    var element = '<button type="button" class="handicap_player_button"';
    if (state == 0) {
        element += ' disabled';
    }
    element += '><img src="static/assets/handicap_button.png" alt="handicap button" class="handicap_button_img';
    if (state == 0) {
        element += ' hidden';
    }
    else if (state == 1) {
        element += ' deactivated';
    }
    element += '"></button>';
    return element;
}

