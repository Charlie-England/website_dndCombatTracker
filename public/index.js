let characterList = [];
let sortedCharacterList = [];
let initiativeDict = {}; // 0:[player/npcClass, activeInitBool (true/false)]
let monsterSearchList = [];

let kezil = new Player("Kezil", 17);
let selryn = new Player("Selryn", 15);
let goblin = new NPC("Goblin", 12, 16, 7);


//test code (update with list of characters)
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
    moveInitiative("next");
})

$(".prev-init").click(function() {
    moveInitiative("prev");
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

$(".add-monster").click(function() {
    addMonsterPanel();
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

function moveInitiative(direction) {
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
            if (direction == "next") {
                nextInit = parseInt(char)+1;
            } else if (direction == "prev") {
                nextInit = parseInt(char)-1;
            }
  
            initiativeDict[char][1] = false; //remove activeplayer bool from initiativedict
        }
    }
    //Add to nextInit and update dict
    if (nextInit > sortedCharacterList.length-1) {
        nextInit = 0;
    } else if (nextInit < 0) {
        nextInit = sortedCharacterList.length-1;
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

        compareInit = parseInt(compareInit);
        charInit = parseInt(charInit);

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
    $(".update-init").prop("disabled", true);

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
    $(".more-info").empty();
}

function grabCharacterListFromServer() {
    //Grabs the character list from the server
    let rtrnCharData = [];
    //gets returned character/player objects
    fetch("/startCharacterList", {method: "GET"})
    .then(response => response.json())
    .then(function(data) {
        updateCharListFromServer(data);
    })
}


function updateCharListFromServer(listOfCharacters) {
    //called during grabCharacterListFromServer, takes the data (json)
    //that was retrieved via a fetch request to the server
    //converts this back and updates the characterList variable with this info
    characterList = JSON.parse(listOfCharacters);
    
    clearInitiativeGroup();
    populateInitGroup();
}


/**********************************ADD Monster*********************** */
function addMonsterPanel() {
    clearSidePanelDivs();
    $(".more-info").append(`<div class="row side-panel-character">

    <div class="col col-12 header-div">
      <h3 class="header">Quick Monster Add</h3>
    </div>
    <button class="btn btn-danger btn-sm close-button" onclick="closeSidePanelButton()">X</button>



    <div class="input-group mb-3" id="search-monster-first">
      <div class="input-group-prepend">
        <label class="input-group-text" for="monsterSearchName">Name</label>
      </div>
      <input type="text" class="form-control" id="monsterSearchName" name="nameInput">
    </div>

    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <label class="input-group-text" for="inputGroupSelect01">Type</label>
      </div>
      <select class="custom-select" id="inputGroupSelect01" name="typeChoice">
        <option selected>Choose...</option>
        <option value="1">Aberration</option>
        <option value="2">Beast</option>
        <option value="3">Celestial</option>
        <option value="4">Construct</option>
        <option value="5">Dragon</option>
        <option value="6">Elemental</option>
        <option value="7">Fey</option>
        <option value="8">Fiend (demon/devl/shapechanger)</option>
        <option value="9">Giant</option>
        <option value="10">Humanoid</option>
        <option value="11">Monstrosity</option>
        <option value="12">Ooze</option>
        <option value="13">Plant</option>
        <option value="14">Undead</option>
      </select>
    </div>


    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <label class="input-group-text" for="inputGroupSelect02">Alignment</label>
      </div>
      <select class="custom-select" id="inputGroupSelect02" name="alignmentChoice">
        <option selected>Choose...</option>
        <option value="1">lawful good</option>
        <option value="2">lawful neutral</option>
        <option value="3">lawful evil</option>
        <option value="4">neutral good</option>
        <option value="5">neutral</option>
        <option value="6">neutral evil</option>
        <option value="7">chaotic good</option>
        <option value="8">chaotic neutral</option>
        <option value="9">chaotic evil</option>
        <option value="10">unaligned</option>
      </select>
    </div>

    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <label class="input-group-text" for="inputGroupSelect03">Challenge</label>
      </div>
      <select class="custom-select" id="inputGroupSelect03" name="challengeChoice">
        <option selected>Choose...</option>
        <option value="26">0</option>
        <option value="27">1/8</option>
        <option value="28">1/4</option>
        <option value="29">1/2</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
        <option value="11">11</option>
        <option value="12">12</option>
        <option value="13">13</option>
        <option value="14">14</option>
        <option value="15">15</option>
        <option value="16">16</option>
        <option value="17">17</option>
        <option value="18">18</option>
        <option value="19">19</option>
        <option value="20">20</option>
        <option value="21">21</option>
        <option value="22">22</option>
        <option value="23">23</option>
        <option value="24">24</option>
        <option value="25">30</option>

      </select>
    </div>

    <button class="btn btn-primary" onclick="populateMonsterSearchResults()">Search</button>
    <button class="btn btn-secondary right-align" onclick="clearMonsterSearchFields()">Clear</button>
  </div>

  <div class="row side-panel-character search-results">
    <div class="col col-12">
      <p>Search Results:</p>
    </div>
    <!-- References -->
    <div class="col col-3 search-labels">
      <p>Name</p>
    </div>
    <div class="col col-2 search-label-color search-labels">
      <p>CR</p>
    </div>
    <div class="col col-3 search-labels">
      <p>Type</p>
    </div>
    <div class="col col-3 search-label-color search-labels">
      <p>Size</p>
    </div>

    <!-- name, CR, type, size, alignment -->

    <div class="col col-12 monster-search-result">

    </div>

  </div>`)

    toggleMoreInfoHidden("show");
}

function populateMonsterSearchResults() {
    //sends a get request with search information
    
    //gather search field information
    let nameInput = $("[name='nameInput']").val();
    let typeChoice = $("[name='typeChoice']").val();
    let alignmentChoice = $("[name='alignmentChoice']").val();
    let challengeChoice = $("[name='challengeChoice']").val();


    fetch("/monsterSearchResults?" + new URLSearchParams({
        name: nameInput,
        type: typeChoice,
        alignment: alignmentChoice,
        challenge: challengeChoice
    }), {method: "GET"})
    .then(response => response.json())
    .then(function(data) {
        updateSearchResults(data);
    })
}

function updateSearchResults(listOfMonsters) {
    //takes the json list of monsters from search results, called during populateMonsterSearchResult
    //creates divs with information as well as a button for each monster
    //if no monsters are returned, creates div asking user for clarifying input
    //append to the search results div
    monsterSearchList = listOfMonsters;
    clearMonsterSearchFields();
    let offColor = 0;

    for (let i = 0; i < monsterSearchList.length; i++) {
        let monsterName = monsterSearchList[i].name;
        let monsterCR = monsterSearchList[i].Challenge.split(" ")[0];
        let monsterType = monsterSearchList[i].meta.split(" ")[1];
        let monsterSize = monsterSearchList[i].meta.split(" ")[0];
        monsterSearchList[i].initiative = 0;
        monsterSearchList[i].type = "monster";
        $(".monster-search-result").append(`<div class="row search-row row-color-${offColor}">
        <div class="col col-3 col-search"><p class="search-name search-result">${monsterName}</p></div>
        <div class="col col-2 col-search"><p class="search-cr search-result">${monsterCR}</p></div>
        <div class="col col-2 col-search"><p class="search-type search-result">${monsterType}</p></div>
        <div class="col col-3 col-search"><p class="search-size search-result">${monsterSize}</p></div>
        <div class="col col-2"><button class="btn btn-secondary btn-sm add-search-monster" onclick="addSearchMonster(${i})">+</button></div>
        </div>`)
        
        if (offColor == 0) {
            offColor++;
        } else {
            offColor = 0;
        }
    }
}

function clearMonsterSearchFields() {
    //clears the search fields of all input
    //can be used with the clear button as well as the
    $(".monster-search-result").empty();
}

function addSearchMonster(monsterIndex) {
    characterList.push(monsterSearchList[monsterIndex]);

    sortClearAndUpdateInitiative();
}

function closeSidePanelButton() {
    clearSidePanelDivs();
    toggleMoreInfoHidden("hide");
}