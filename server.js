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