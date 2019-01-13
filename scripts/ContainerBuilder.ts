class ContainerBuilder extends PIXI.Container {

    tetrisTiles: TetrisTile[];
    tetrisContainer: TetrisContainer;
    shelf: PIXI.Container;
    static SHELF_WIDTH: number = 800;
    static SHELF_HEIGHT: number = 200;
    static SHELF_MARGIN: number = 10;

    constructor(tetrisTiles: TetrisTile[]) {
        super();

        //Generate Backgroundshape
        let bg = new PIXI.Graphics;
        bg.beginFill(0x604020);
        bg.drawRect(0, 0, APP_WIDTH, APP_HEIGHT);
        bg.endFill();
        this.addChild(bg);

        this.tetrisTiles = tetrisTiles;

        let scaleFactor = new PIXI.Point(2, 2);

        //prepare Tetris Container
        this.tetrisContainer = new TetrisContainer(TetrisContainer.TILES_H, TetrisContainer.TILES_V);
        this.tetrisContainer.scale = scaleFactor;
        this.tetrisContainer.x = (APP_WIDTH - this.tetrisContainer.width) / 2;
        this.tetrisContainer.y = APP_HEIGHT - this.tetrisContainer.height - 100;
        this.tetrisContainer.showGrid();
        this.addChild(this.tetrisContainer);

        //prepare Tile Shelf
        this.shelf = new PIXI.Container();
        this.shelf.x = (APP_WIDTH - ContainerBuilder.SHELF_WIDTH) / 2;
        this.shelf.y = 50;
        bg = new PIXI.Graphics;
        bg.beginFill(0xb3b3ff);
        bg.drawRect(0,0, ContainerBuilder.SHELF_WIDTH, ContainerBuilder.SHELF_HEIGHT);
        bg.endFill();
        this.shelf.addChild(bg);
        this.addChild(this.shelf);

let xSpace = ContainerBuilder.SHELF_MARGIN;

        for (let i in this.tetrisTiles) {
            let element = this.tetrisTiles[i];
            element.scale = scaleFactor;
            element.x = xSpace;
            xSpace += element.width + ContainerBuilder.SHELF_MARGIN;
            this.shelf.addChild(element);
        }

    }

}