/// <reference path="./TiledSpritesheet.ts" />
/// <reference path="./TiledMapParser.ts" />
//const currentStory = new Story(intro, "messageContainer");
var SPRITESHEET = new TiledSpritesheet("data/assets/spritesheet.png", 1, 16, 16, 31, 57); //Kenny Spritesheet see data/maps/Kenney RPG Tiles.tsx
//TODO Parse this information automatixally from tsx file
var myMap;
var player;
var PLAYER_SPEED = 3;
/*
PIXI STUFF
*/
var type = "WebGL";
if (!PIXI.utils.isWebGLSupported()) {
    type = "canvas";
}
//Create a Pixi Application
var app = new PIXI.Application({
    width: 400,
    height: 400
});
//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);
renderMap();
$(document).keydown(function (event) {
    if (player) {
        switch (event.key) {
            case "ArrowUp":
                player.vy = -1 * PLAYER_SPEED;
                break;
            case "ArrowDown":
                player.vy = 1 * PLAYER_SPEED;
                break;
            case "ArrowLeft":
                player.vx = -1 * PLAYER_SPEED;
                break;
            case "ArrowRight":
                player.vx = 1 * PLAYER_SPEED;
                break;
        }
    }
});
$(document).keyup(function (event) {
    if (player) {
        switch (event.key) {
            case "ArrowUp":
                player.vy = 0;
                break;
            case "ArrowDown":
                player.vy = 0;
                break;
            case "ArrowLeft":
                player.vx = 0;
                break;
            case "ArrowRight":
                player.vx = 0;
                break;
        }
    }
});
function gameLoop(delta) {
    if (player) {
        player.sprite.x += player.vx;
        player.sprite.y += player.vy;
    }
}
function renderMap() {
    TiledMapParser.loadMap("data/maps/map1.json", SPRITESHEET, "data/storyData/intro.json", {}, function (map) {
        myMap = map;
        player = map.player;
        app.ticker.add(function (delta) { return gameLoop(delta); });
        app.stage.addChild(map.pixiContainer);
    });
}
