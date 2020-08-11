const express = require("express");
const bodyParser = require("body-parser");

let app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    req.sendFile(__dirname+"/public/index.html");
})

app.get("/startCharacterList", function(req,res) {
    let characterList = getCharList();
    let strJSON= JSON.stringify(characterList);

    res.json(strJSON);
})

app.get("/monsterSearchResults", function(req, res) {
    let nameInput = req.query.name;
    let typeChoice = req.query.type;
    let alignmentChoice = req.query.alignment;
    let challengeChoice = req.query.challenge;

    let byTypes = sortInputAndReturnByTypes(nameInput, typeChoice, alignmentChoice, challengeChoice);

    let monsterSearchResults = searchMonster(byTypes);
    console.log(byTypes)
    // let monsterSearchResultJSON = JSON.stringify(monsterSearchResults);
    res.json(monsterSearchResults)
})



app.listen(3000, function() {
    console.log("Server running on port 3000.");
})


function sortInputAndReturnByTypes(nameInput, typeChoice, alignmentChoice, challengeChoice) {
    let byTypes = {};

    if (nameInput) {
        byTypes["name"] = nameInput;
    }
    if (typeChoice != "Choose...") {
        byTypes["type"] = typeNumSwitchCase(typeChoice);
        console.log(typeof(typeChoice))
    }
    if (alignmentChoice != "Choose...") {
        byTypes["alignment"] = alignmentNumSwitchCase(alignmentChoice);
    }
    if (challengeChoice != "Choose...") {
        byTypes["challenge"] = challengeChoice;
    }

    return byTypes;
}

function getCharList() {
    let characterList = [];
    let kezil = new Player("Kezil", 17);
    let selryn = new Player("Selryn", 15);
    let goblin = new NPC("Goblin", 12, 16, 7);

    characterList.push(kezil);
    characterList.push(selryn);
    characterList.push(goblin);
    return characterList;
}

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

function lowerAllInList(listToLower) {
    for (let i = 0; i < listToLower.length; i++){
        listToLower[i] = listToLower[i].toLowerCase();
    }
    return listToLower;
}


function searchMonster(byTypes) {
    /* takes 1 param, a dictionary (object), with at least 1 key:value
    name
    meta: size type, alignment (medium undead, neutral evil)
    Challenge
    byTypes: {
    name: stringName
    type: stringType (in meta)
    alignment: stringAlignment (in meta)
    challenge: stringChallenge
    }
    */
    let monsterSearchReturnList = [];

    let json = require(__dirname+"/monsters.json");
    for (let i = 0; i < json.length; i++) {
        let addAndTracker = 0; //adds up each time a value is met, if the tracker is equal to the length of the byTypes, its successful and adds the monster
        let metaList = json[i].meta.split(/[\s,]+/);
        metaList = lowerAllInList(metaList);
        let challengeList = json[i].Challenge.split(" ");
        let nameList = json[i].name.split(" ");
        nameList = lowerAllInList(nameList);



        for (let key in byTypes){
            //sort through all keys in byTypes and compare with the value of
            //the current monster, if all are true, add monster to returned list
            if (key == "name"){
                let nameInputList = byTypes[key].split(" ");
                nameInputList = lowerAllInList(nameInputList);
                let nameMatch = 0;
                //Implement namesearch by multiple fields
                for (let input = 0; input < nameInputList.length; input++) {
                    if (nameList.includes(nameInputList[input])) {
                        nameMatch++;
                    }
                }
                if (nameMatch == nameInputList.length) {
                    addAndTracker++;
                }

                // if (byTypes[key].toLowerCase() == json[i].name.toLowerCase()) {
                //     addAndTracker++;
                // }
            } else if (key == "type") {
                if (metaList.includes(byTypes[key])) {
                    addAndTracker++;
                }
            } else if (key == "alignment") {
                if (metaList.includes(byTypes[key])) {
                    addAndTracker++;
                }
            } else if (key == "challenge") {
                if (byTypes[key] == challengeList[0]) {
                    addAndTracker++;
                }
            }
        }


        if (addAndTracker == Object.keys(byTypes).length){
            monsterSearchReturnList.push(json[i]);
        }


    }

    return monsterSearchReturnList;
}
function typeNumSwitchCase(typeNum) {//Type Reference Switch Case
    typeNum = parseInt(typeNum)

    switch (typeNum) {
        //Switch case for the type number value reference to string type
        //takes a number (from option value on index.html) and returns a string for that number reference to type
        case 1: 
            //Aberration
            return "aberration"
        case 2:
            //Beast
            return "beast"
        case 3:
            //Celestial
            return "celestial";
        case 4:
            //Construct
            return "construct";
        case 5:
            //Dragon
            return "dragon";
        case 6:
            //Elemental
            return "elemental";
        case 7:
            //Fey
            return "fey";
        case 8:
            //Fiend
            return "fiend";
        case 9:
            //Giant
            return "giant";
        case 10:
            //Humanoid
            return "humanoid";
        case 11:
            //Monstrosity
            return "monstrosity";
        case 12:
            //Ooze
            return "ooze";
        case 13:
            //Plant
            return "plant";
        case 14:
            //Undead
            return "undead";
    }
}

function alignmentNumSwitchCase(alignmentNum) {//alignment reference switch case
    alignmentNum = parseInt(alignmentNum);

    switch (alignmentNum) { 
        case 1: //Lawful Good
            return "lawful good";
        case 2: //Lawful Neutral
            return "lawful neutral";
        case 3: //Lawful Evil
            return "lawful evil";
        case 4: //Neutral Good
            return "neutral good";
        case 5: //Neutral
            return "neutral";
        case 6: //Neutral Evil
            return "neutral evil";
        case 7: //Chaotic Good
            return "chaotic good";
        case 8: //Chaotic Neutral
            return "chaotic neutral";
        case 9: //Chaotic Evil
            return "chaotic evil";
        case 10: //Unaligned
            return "unaligned";
    }
}
