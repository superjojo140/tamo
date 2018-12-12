class TiledSpritesheet{

	path: string;
	border: number;
	tileHeight: number;
	tileWidth: number;
	rows: number;
	columns: number;

	constructor(path,border,tileWidth,tileHeight,rows,columns){
		this.path = path;
		this.border = border;
		this.tileHeight = tileHeight;
		this.tileWidth = tileWidth;
		this.rows = rows;
		this.columns = columns;
	}
}