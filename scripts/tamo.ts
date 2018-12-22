/// <reference path="./TiledSpritesheet.ts" />
/// <reference path="./TiledMapParser.ts" />

const SPRITESHEET = new TiledSpritesheet("data/assets/spritesheet.png", 1, 16, 16, 31, 57) //Kenny Spritesheet see data/maps/Kenney RPG Tiles.tsx
//TODO Parse this information automatixally from tsx file

let myMap:Map;
let player:Player;

const PLAYER_SPEED = 3;


/*
PIXI STUFF
*/


let type = "WebGL"
if (!PIXI.utils.isWebGLSupported()) {
  type = "canvas"
}

//Create a Pixi Application
let app = new PIXI.Application({
  width: 400,
  height: 400
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
    player.sprite.x += player.vx;
    player.sprite.y += player.vy;
  }
}




  TiledMapParser.loadMap("data/maps/map1.json",SPRITESHEET,"data/storyData/intro.json",{}, function (map) {
    myMap = map;
    player = map.player;
    app.ticker.add(delta => gameLoop(delta));
    app.stage.addChild(map.pixiContainer);
  });

  //Load Story
  let myStory = new Story("data/storyData/intro.json","messageContainer");


