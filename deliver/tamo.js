/// <reference path="./TiledSpritesheet.ts" />
/// <reference path="./TiledMapParser.ts" />
var SPRITESHEET = new TiledSpritesheet("data/assets/spritesheet.png", 1, 16, 16, 31, 57); //Kenny Spritesheet see data/maps/Kenney RPG Tiles.tsx
//TODO Parse this information automatixally from tsx file
var myMap;
var player;
var PLAYER_SPEED = 3;
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
    if (player) {
        switch (event.key) {
            case "ArrowUp":
                player.vy = -1 * PLAYER_SPEED;
                player.changeDirection(Player.UP);
                break;
            case "ArrowDown":
                player.vy = 1 * PLAYER_SPEED;
                player.changeDirection(Player.DOWN);
                break;
            case "ArrowLeft":
                player.vx = -1 * PLAYER_SPEED;
                player.changeDirection(Player.LEFT);
                break;
            case "ArrowRight":
                player.vx = 1 * PLAYER_SPEED;
                player.changeDirection(Player.RIGHT);
                break;
        }
    }
});
$(document).keyup(function (event) {
    if (player) {
        switch (event.key) {
            case "ArrowUp":
                player.vy = 0;
                player.changeDirection(Player.STOP);
                break;
            case "ArrowDown":
                player.vy = 0;
                player.changeDirection(Player.STOP);
                break;
            case "ArrowLeft":
                player.vx = 0;
                player.changeDirection(Player.STOP);
                break;
            case "ArrowRight":
                player.vx = 0;
                player.changeDirection(Player.STOP);
                break;
        }
    }
});
function gameLoop(delta) {
    if (player) {
        player.sprite.x += player.vx * delta;
        player.sprite.y += player.vy * delta;
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
    var mapPath = "data/maps/" + $("#mapNameInput").val() + ".json";
    TiledMapParser.loadMap(mapPath, SPRITESHEET, "storyPathDummy", {}, function (map) {
        myMap = map;
        player = map.player;
        app.ticker.start();
        app.stage.addChild(map.pixiContainer);
    });
}
var myBattle = new Battle(400, 400, function (pixiContainer) {
    app.stage.addChild(pixiContainer);
});
$(document).keydown(function (event) { myBattle.keydown(event); });
$(document).keyup(function (event) { myBattle.keyup(event); });
