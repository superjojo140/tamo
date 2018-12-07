const currentStory = new Story(intro, "messageContainer");

const MAP_WIDTH = 8;
const MAP_HEIGHT = 8;
const SPRITE_SCALE = new PIXI.Point(1, 1);
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

PIXI.loader
	.add("mySpritesheet","data/assets/spritesheet.png")
	.load((loader,resources) => {renderMap(loader,resources)});


function renderMap(loader,resources) {
	/*mapParser = new TiledMapParser(SPRITESHEET,"data/maps/map1.json");
	let t = mapParser.getTexture(1);*/
	let x = new PIXI.BaseTexture(resources["mySpritesheet"].texture.baseTexture);
	let t = new PIXI.Texture(x,1,1,16,16);
	let s = new PIXI.Sprite(t);
	s.scale = SPRITE_SCALE;
	app.stage.addChild(s);
}
