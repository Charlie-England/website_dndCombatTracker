let characterList = [];
let sortedCharacterList = [];
let initiativeDict = {}; // 0:[player/npcClass, activeInitBool (true/false)]

let kezil = new Player("Kezil", 17);
let selryn = new Player("Selryn", 15);
let goblin = new NPC("Goblin", 12, 16, 7);


//test code
characterList.push(kezil);
characterList.push(selryn);
characterList.push(goblin);
sortClearAndUpdateInitiative();
grabCharacterListFromServer();


function Player(name, initiative=0, passivePerception=0, ac=0, hp=0) {
    this.type = "player";
    this.name = name;
    this.initiative = initiative;
    this.passivePerception = passivePerception;
    this.ac = ac;
    this.hp = hp;
}

function NPC(name, initiative=0, ac=0, hp=0) {
    this.type = "npc";
    this.name = name;
    this.initiative = initiative;
    this.ac = ac;
    this.hp = hp;
}

/*******************Add Buttons****************/

$(".update-init").prop("disabled", true);

$(".next-init").click(function() {
    moveInitiative();
})

$(".addCharacter").click(function() {
    console.log("add char clicked")
    if (checkAddCharModal()) {
        console.log("add Char Modal success")
    }

    createCharFromModal()
})

$(".update-init").click(function() {
    if (!$(".update-init").prop("disabled")) {
        // updateNewInitiative();
        sortClearAndUpdateInitiative();
    }
})



/*****************INITIATIVE LOGIC***********************/

function updateInitiativeClass(curClass, newInit) {
    curClass.initiative = newInit;
}

function updateInitFromChange(keyValue, classSearchWord) {
    let newInit = $(`.${classSearchWord}`).val();
    updateInitiativeClass(initiativeDict[keyValue][0], newInit);
    removeDisabledFromUpdateButton();
}

function removeDisabledFromUpdateButton() {
    //called when an initiative is changed
    //removes the disabled property from the update-init
    $(".update-init").prop("disabled", false);
}

function moveInitiative() {
    //finds the key to the currently active initiative
    //removes the active-char and active-init classes using this as a reference
    //changes the active initiative to false

    //adds these removed classes to the next key (key+1) and changes the active initiative to true
    let nextInit = 0;
    for (let char in initiativeDict) {
        if (initiativeDict[char][1]) {
            //remove active-char from init-order-[char]
            $(`.init-order-${char}`).removeClass("active-char");
            $(`.text-init-order-${char}`).removeClass("active-init");
            nextInit = parseInt(char)+1;
            initiativeDict[char][1] = false;
        }
    }
    //Add to nextInit and update dict
    if (nextInit > sortedCharacterList.length-1) {
        nextInit = 0;
    }
    initiativeDict[nextInit][1] = true;
    $(`.init-order-${nextInit}`).addClass("active-char");
    $(`.text-init-order-${nextInit}`).addClass("active-init");
}

function populateInitGroup() {
    //goes through characterList and creates both a button and textfield with initiative for each character
    sortCharList();

    for (let i = 0; i < sortedCharacterList.length; i++) {
        let selectedChar = sortedCharacterList[i];
        let textInputInitColorStart = `text-init align-top text-init-order-${i}`;
        let borderCharInfoDiv = `character-info init-order-${i}`;
        let health = "";

        if (i == 0) {
            textInputInitColorStart = `active-init text-init align-top text-init-order-${i}`
            borderCharInfoDiv = `character-info active-char init-order-${i}`;
        }

        if (selectedChar.type == "player") {
            health = `<p>Player</p>`;
        } else {
            health = `<p><span class="currentHP">0</span> / <span class="maxHP">6</span></p>`;
        }

        $(".row-3").append(`<div class="row character-row">
        <div class="col col-12 character-col">
          <input onchange="updateInitFromChange(${i},'text-init-order-${i}')" type="text" value="${selectedChar.initiative}" class="${textInputInitColorStart}">
          <div class="${borderCharInfoDiv}" onclick="openSide(${i})">
            <p>${selectedChar.name}</p>
            <p></p>
          </div>
          <div class="char-hp align-top">
            ${health}
          </div>
        </div>
      </div>`);
    }
}

function sortCharList() {
    sortedCharacterList = [];
    //Takes the characterList and sorts it by initiative
    for (let i = 0; i < characterList.length; i++) {
        let character = characterList[i];
        let charInit = character.initiative;
        sortInit(charInit, character);
    }
    updateInitiativeDictionary();
}

function sortInit(charInit, character) {
    //takes the characterinitiative and character class object
    //goes through the sortedCharList and compares the initiative recieved with each one
    //if the initiative is greater than, add at the current initiative
    //if the initiative is equal, randomly add it before or after
    //if the initiative is less than what is currently in the list, once iteration is done, pass will be false and it will add to sorted list
    let pass = false;
    let sortedCharLength = sortedCharacterList.length;
    for (let i = 0; i < sortedCharLength; i++) {
        pass = false;
        let compareInit = sortedCharacterList[i].initiative;
        if (charInit > compareInit) {
            pass = true;
            sortedCharacterList.splice(i,0,character);
            return ""
        } else if (charInit == compareInit) {
            pass = true;
            //random before or after **
            sortedCharacterList.splice(i,0,character);
            return ""
        }
    }
    if (!pass) {
        sortedCharacterList.push(character);
    }
}

function updateInitiativeDictionary() {
    //called after sortCharList()
    //takes the final sortedCharacterList and adds these to the dictionary with the keys
    for (let i = 0; i < sortedCharacterList.length; i++) {
        initiativeDict[i] = [sortedCharacterList[i], false];
    }
    initiativeDict[0][1] = true;
}

function clearInitiativeGroup() {
    //clears the button-group and initiative-group divs then adds the p tag elements back
    $(".row-3").empty();
}

function clearModal() {
    $("#name").val("");
    $("#newCharInit").val("");
    $("#newCharAC").val("");
    $("#newCharHP").val("");
}

function sortClearAndUpdateInitiative() {
    //control function to be used to clear out the initiative group and then
    //populates the initiative group
    /// REMOVE ACTIVE CHARS
    removeActive();

    clearInitiativeGroup();
    populateInitGroup();
}

function removeActive() {
    //finds the reference key for the active initiative
    let referenceKey = "";
    for (let i = 0; i < sortedCharacterList.length; i++) {
        if (initiativeDict[i][1]) {
            referenceKey = i;
        }
    }
    //uses reference key to find the specific classes
    //removes the active-init and active-char from these classes
    if (!referenceKey == "") {
        $(`.text-init-order-${referenceKey}`).removeClass("active-init");
        $(`.init-order-${referenceKey}`).removeClass("active-char");
        console.log("should remove active")
    }
}


function checkAddCharModal() {
    //checks to make sure the needed values in the modal are there and returns true
    let name = $("#name").val();
    if (name) {
        return true;
    } else {
        return false
    }
}

/******************MODAL LOGIC******************/

function createCharFromModal() {
    //Takes the current information in the modal
    //Creates either a player or npc with these inputted values
    //Only called when all information is added
    
    //Calls ClearModal which clears the information in the Modal

    //Calls sortClearAndUpdateInitiative which sends the information downstream
    if ($("#playerRadio").is(":checked")) {
        let playerName = $("#name").val();
        let newPlayerInit = $("#newCharInit").val();
        if (newPlayerInit == "") { //if the new char is blank, set to 0
            newPlayerInit = 0;
        }
        let newPlayerAC = $("#newCharAC").val();

        let newPlayer = new Player(playerName, newPlayerInit, newPlayerAC);
        characterList.push(newPlayer);
    } else {
        let charName = $("#name").val();
        let newCharInit = $("#newCharInit").val();
        if (newCharInit == "") { //if the new char is blank, set to 0
            newCharInit = 0;
        }
        let newCharAC = $("#newCharAC").val();
        let newCharHP = $("#newCharHP").val();

        let newNPC = new NPC(charName,newCharInit,newCharAC, newCharHP);
        characterList.push(newNPC);
    }

    //clear Modal
    clearModal();
    //close Modal ***

    sortClearAndUpdateInitiative();
}

/*****************Right Side Panel Code*****************/
function openSide(referenceKey) {
    let character = initiativeDict[referenceKey][0];

    //clear moreInfoDiv to get ready for addition of new one
    clearSidePanelDivs();

    //call functions to create divs
    if (character.type == "player") {
        //call player function
        $(".side-panel-character").append("<h3>Player Div</h3>")
    } else if (character.type == "npc") {
        //call npc moreInfo function
        $(".side-panel-character").append("<h3>NPC Div</h3>")
    }

    //remove more-info column hidden
    toggleMoreInfoHidden("show");
}

function toggleMoreInfoHidden(plan) {
    //takes string (show or hide) and changes the visibility of more info
    if (plan == "show") {
        $(".more-info").removeClass("hidden");
    } else if (plan == "hide") {
        $(".more-info").addClass("hidden");
    }
}

function clearSidePanelDivs() {
    //removes all the divs under the more-info class div
    $(".side-panel-character").empty();
}

function grabCharacterListFromServer() {
    //Grabs the character list from the server
    //gets returned character/player objects
    fetch("/startCharacterList", {method: "GET"})
    .then(res => res.json())
    .then(console.log)

}