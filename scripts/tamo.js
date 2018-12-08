const currentStory = new Story(intro, "messageContainer");

const SPRITESHEET = new TiledSpritesheet("data/assets/spritesheet.png", 1, 16, 16, 31, 57) //Kenny Spritesheet see data/maps/Kenney RPG Tiles.tsx
//TODO Parse this information automatixally from tsx file

let mapParser;


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


renderMap();

function renderMap() {
  let mapContainer = new PIXI.Container();
  mapParser = new TiledMapParser(mapContainer, SPRITESHEET, "data/maps/map1.json");
  let s = new PIXI.Sprite(mapParser.getTexture(5));
  s.scale = new PIXI.Point(10, 10);

  app.stage.addChild(mapContainer);
}
