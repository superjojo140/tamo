/// <reference path="./TiledSpritesheet.ts" />
/// <reference path="./TiledMapParser.ts" />
var SPRITESHEET = new TiledSpritesheet("data/assets/spritesheet.png", 1, 16, 16, 31, 57); //Kenny Spritesheet see data/maps/Kenney RPG Tiles.tsx
//TODO Parse this information automatixally from tsx file
var myMap;
var myCanvas = $("#pixiCanvas")[0];
/*
PIXI STUFF
*/
var type = "WebGL";
if (!PIXI.utils.isWebGLSupported()) {
    type = "canvas";
}
//Create a Pixi Application
var app = new PIXI.Application({
    width: 1000,
    height: 700,
    view: myCanvas
});
//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);
$(document).keydown(function (event) {
    if (myMap) {
        myMap.keyDown(event);
    }
    if (myBattle) {
        myBattle.keyDown(event);
    }
});
$(document).keyup(function (event) {
    if (myMap) {
        myMap.keyUp(event);
    }
    if (myBattle) {
        myBattle.keyUp(event);
    }
});
function gameLoop(delta) {
    if (myMap) {
        myMap.doStep(delta);
    }
    if (myBattle) {
        myBattle.doStep(delta);
    }
}
//Load Story
var myStory;
function loadStory() {
    var storyPath = "data/storyData/" + $("#storyNameInput").val() + ".json";
    if (myStory) {
        myStory.destroy();
    }
    myStory = new Story(storyPath, "messageContainer");
}
app.ticker.add(function (delta) { return gameLoop(delta); });
function loadMapFromFile() {
    if (myMap)
        myMap.destroy();
    if (myStory) {
        myStory.destroy();
    }
    var mapPath = "data/maps/" + $("#mapNameInput").val() + ".json";
    var storyPath = "data/storyData/" + $("#storyNameInput").val() + ".json";
    TiledMapParser.loadMap(mapPath, SPRITESHEET, storyPath, {}, function (map) {
        myMap = map;
        app.ticker.start();
        app.stage.addChild(map.pixiContainer);
    });
}
var tt = new TetrisTile([[1, 0], [1, 1]], 0xaabbcc, 0);
var tc = new TetrisContainer(10, 3);
tc.addTetrisTileAt(tt, 0, 0);
var tt2 = new TetrisTile([[1, 0, 1], [1, 1, 1], [1, 0, 1]], 0xaabbcc, 1);
var tc2 = new TetrisContainer(10, 3);
tc2.addTetrisTileAt(tt2, 0, 0);
var tt3 = new TetrisTile([[1, 1], [1, 1]], 0xaabbcc, 0);
tc2.addTetrisTileAt(tt3, 5, 0);
var tt4 = new TetrisTile([[1, 0], [1, 1]], 0xaabbcc, 0);
tc2.addTetrisTileAt(tt4, 8, 0);
var myBattle = new Battle(600, 600, tc, tc2);
app.stage.addChild(myBattle.pixiContainer);
myBattle.isPaused = true;
