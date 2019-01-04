class TetrisContainer extends PIXI.Container {

    static TILE_WIDTH: any = 32;
    static TILE_HEIGHT: any = 32;
    tiles_v: number;
    tiles_h: any;
    tilesArray: TetrisTile[][];



    constructor(tiles_h, tiles_v) {
        super();

        this.tiles_v = tiles_v;
        this.tiles_h = tiles_h;

        //Generate Backgroundshape
        let bg = new PIXI.Graphics;
        bg.beginFill(0x8c3424);
        bg.drawRect(0, 0, this.tiles_h * TetrisContainer.TILE_WIDTH, this.tiles_v * TetrisContainer.TILE_HEIGHT);
        bg.endFill();
        this.addChild(bg);

        //Prepare Tilesarray
        this.tilesArray = [];
        for (let i = 0; i < this.tiles_v; i++) {
            this.tilesArray[i] = [];
        }
    }


    addTetrisTileAt(tile: TetrisTile, x: number, y: number) {

        if (tile.dimensions[0] == undefined) {
            throw "Cant add emtpy TetrisTile";
        }

        for (let rows = 0; rows < tile.dimensions.length; rows++) {
            for (let columns = 0; columns < tile.dimensions[0].length; columns++) {
                if (tile.dimensions[rows][columns] == 1) {
                    this.tilesArray[rows + y][columns + x];
                }
            }
        }


        tile.x = x * TetrisContainer.TILE_WIDTH;
        tile.y = y * TetrisContainer.TILE_HEIGHT;
        this.addChild(tile);
    }

}