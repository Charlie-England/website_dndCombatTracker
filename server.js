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

app.post("/searchMonster", function(req, res) {

    let nameInput = req.body.nameInput;
    let typeChoice = req.body.typeChoice;
    let alignmentChoice = req.body.alignmentChoice;
    let challengeChoice = req.body.challengeChoice;
    let byTypes = sortInputAndReturnByTypes(nameInput, typeChoice, alignmentChoice, challengeChoice);

    let returnMonsterList = searchMonster(byTypes);

    console.log(returnMonsterList);

    res.send(JSON.stringify(returnMonsterList))

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
        byTypes["type"] = typeChoice;
    }
    if (alignmentChoice != "Choose...") {
        byTypes["alignment"] = alignmentChoice;
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
        for (let b = 0; b < metaList.length; b++){
            metaList[b] = metaList[b].toLowerCase();
        }
        let challengeList = json[i].Challenge.split(" ");


        for (let key in byTypes){
            //sort through all keys in byTypes and compare with the value of
            //the current monster, if all are true, add monster to returned list
            if (key == "name"){
                if (byTypes[key].toLowerCase() == json[i].name.toLowerCase()) {
                    addAndTracker++;
                }
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

searchMonster({name:"goblin", type:"humanoid", challenge:"1/4"});