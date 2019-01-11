/// <reference path="./TiledSpritesheet.ts" />
/// <reference path="./TiledMapParser.ts" />

const SPRITESHEET = new TiledSpritesheet("data/assets/spritesheet.png", 1, 16, 16, 31, 57) //Kenny Spritesheet see data/maps/Kenney RPG Tiles.tsx
//TODO Parse this information automatixally from tsx file

let myMap: Map;
let myCanvas = $("#pixiCanvas")[0];


/*
PIXI STUFF
*/


let type = "WebGL"
if (!PIXI.utils.isWebGLSupported()) {
  type = "canvas"
}

//Create a Pixi Application
let app = new PIXI.Application({
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
let myStory: Story;

function loadStory() {
  let storyPath = `data/storyData/${$("#storyNameInput").val()}.json`;
  if (myStory) {
    myStory.destroy();
  }
  myStory = new Story(storyPath, "messageContainer");
}

app.ticker.add(delta => gameLoop(delta));

function loadMapFromFile() {
  if (myMap) myMap.destroy();
  if (myStory) {
    myStory.destroy();
  }

  let mapPath = `data/maps/${$("#mapNameInput").val()}.json`;
  let storyPath = `data/storyData/${$("#storyNameInput").val()}.json`;

  TiledMapParser.loadMap(mapPath, SPRITESHEET, storyPath, {}, function (map) {
    myMap = map;
    app.ticker.start();
    app.stage.addChild(map.pixiContainer);
  });
}

let tt = new TetrisTile([[1, 0], [1, 1]], 0xaabbcc, 0);
let tc = new TetrisContainer(10, 3);
tc.addTetrisTileAt(tt, 0, 0);

let tt2 = new TetrisTile([[1, 0, 1], [1, 1, 1],[1, 0 ,1]], 0xaabbcc, 1);
let tc2 = new TetrisContainer(10, 3);
tc2.addTetrisTileAt(tt2, 0, 0);

let tt3 = new TetrisTile([[1, 1], [1, 1]], 0xaabbcc, 0);
tc2.addTetrisTileAt(tt3, 5, 0);
let tt4 = new TetrisTile([[1, 0], [1, 1]], 0xaabbcc, 0);
tc2.addTetrisTileAt(tt4, 8, 0);

let myBattle = new Battle(600, 600, tc, tc2);
app.stage.addChild(myBattle.pixiContainer);
myBattle.isPaused = true;







