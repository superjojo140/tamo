const currentStory = new Story(intro, "messageContainer");

const MAP_WIDTH = 8;
const MAP_HEIGHT = 8;


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



let backgroundContainer = new PIXI.Container();

let backgroundTiles = [];

for (let i=0; i< MAP_HEIGHT; i++){
	backgroundTiles[i] = [];
	for(let j=0; j < MAP_WIDTH; j++){
		let t = new PIXI.Sprite.fromImage("/assets/grass2.png");
		t.width = 64;
		t.height = 64;
		t.x = 64 * j;
		t.y = 64 * i;
		backgroundTiles[i,j] = t;
		backgroundContainer.addChild(t);
	}
}

app.stage.addChild(backgroundContainer);

