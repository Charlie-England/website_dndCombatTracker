const express = require("express");

let app = express();
app.use(express.static("public"));

app.get("/", function(req, res) {
    req.sendFile(__dirname+"/public/index.html");
})

app.get("/startCharacterList", function(req,res) {
    let characterList = getCharList();
    let strJSON= JSON.stringify(characterList);

    res.json(strJSON);
})

app.listen(3000, function() {
    console.log("Server running on port 3000.");
})

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

    let json = require(__dirname+"/monsters.json");
    for (let i = 0; i < json.length; i++) {
        let addAndTracker = 0; //adds up each time a value is met, if the tracker is equal to the length of the byTypes, its successful and adds the monster
        let metaList = json[i].meta.split(/[\s,]+/);

        for (let key in byTypes){
            //sort through all keys in byTypes and compare with the value of
            //the current monster, if all are true, add monster to returned list
            if (key == "name"){
                if (byTypes[key].toLowerCase() == json[i].name.toLowerCase()) {
                    console.log(`${byTypes[key]} : ${json[i].name}`);
                    addAndTracker++;
                }
            } else if (key == "type") {

            } else if (key == "alignment") {
                console.log("alignment");
            } else if (key == "challenge") {
                console.log("challenge");
            }
        }
        if (addAndTracker == Object.keys(byTypes).length){
            console.log("successfully added")
        }
    }
    console.log("working")
}

searchMonster({name:"goblin", type:"humanoid"});