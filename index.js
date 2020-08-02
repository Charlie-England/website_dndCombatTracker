let characterList = [];

let kezil = new Player("Kezil", 17);
let selryn = new Player("Selryn", 15);
let goblin = new NPC("Goblin", 12, 16, 7);

let sortedCharacterList = [];

//test code
characterList.push(kezil);
characterList.push(selryn);
characterList.push(goblin);
sortClearAndUpdateInitiative();


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

function moveInitiative() {
    
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

function createCharFromModal() {
    if ($("#playerRadio").is(":checked")) {
        let playerName = $("#name").val();
        let newPlayerInit = $("#newCharInit").val();
        let newPlayerAC = $("#newCharAC").val();

        let newPlayer = new Player(playerName, newPlayerInit, newPlayerAC);
        characterList.push(newPlayer);
    } else {
        let charName = $("#name").val();
        let newCharInit = $("#newCharInit").val();
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

function populateInitGroup() {
    //goes through characterList and creates both a button and textfield with initiative for each character
    sortCharList();

    for (let i = 0; i < sortedCharacterList.length; i++) {
        let selectedChar = sortedCharacterList[i];
        let textInputInitColorStart = "text-init align-top"
        let borderCharInfoDiv = "character-info"
        let health = "";

        if (i == 0) {
            textInputInitColorStart = "active-init text-init align-top";
            borderCharInfoDiv = "character-info active-char";
        }

        if (selectedChar.type == "player") {
            health = `Player`;
        } else {
            health = `<p><span class="currentHP">0</span> / <span class="maxHP">6</span></p>`;
        }

        $(".row-3").append(`<div class="row character-row">
        <div class="col col-12 character-col">
          <input type="text" value="${selectedChar.initiative}" class="${textInputInitColorStart}">
          <div class="${borderCharInfoDiv}">
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

function clearModal() {
    $("#name").val("");
    $("#newCharInit").val("");
    $("#newCharAC").val("");
    $("#newCharHP").val("");
}

function sortCharList() {
    //Takes the characterList and sorts it by initiative
    sortedCharacterList = [];
    for (let i = 0; i < characterList.length; i++) {
        let character = characterList[i];
        let charInit = character.initiative;
        sortInit(charInit, character);
    }
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

function clearInitiativeGroup() {
    //clears the button-group and initiative-group divs then adds the p tag elements back
    $(".row-3").empty();
}

function sortClearAndUpdateInitiative() {
    //populate initiative group
    clearInitiativeGroup();
    populateInitGroup();
}
