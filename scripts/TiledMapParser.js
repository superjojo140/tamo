class TiledMapParser {


	constructor(spritesheet, map) {
		this.spritesheet = spritesheet;
		this.map = map;

		this.bigTexture = PIXI.Texture.fromImage(this.spritesheet.path);
		this.textures = [];
	}

	getTexture(gid) {
		if (this.textures[gid]) {
			return this.textures[gid];
		} else {
			//Calculate row and column from gid
			let row = (gid-1) / this.spritesheet.columns;
			let column = (gid-1) % this.spritesheet.columns;
			
			var tileWidth = this.spritesheet.tileWidth;
			var tileHeight = this.spritesheet.tileHeight;
			
			let x = column * tileWidth + column * this.spritesheet.border;			
			let y = row * tileHeight + row * this.spritesheet.border;
			
			let t = new PIXI.Texture(this.bigTexture,x,y,tileWidth,tileHeight);
			//Save Texture in cache array
			this.textures[gid] = t;
			return t;
		}
	}






	
}
