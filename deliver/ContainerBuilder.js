var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ContainerBuilder = /** @class */ (function (_super) {
    __extends(ContainerBuilder, _super);
    function ContainerBuilder(tetrisTilesNames, callback) {
        var _this = _super.call(this) || this;
        _this.callback = callback;
        //Generate Backgroundshape
        var bg = new PIXI.Graphics;
        bg.beginFill(0x604020);
        bg.drawRect(0, 0, APP_WIDTH, APP_HEIGHT);
        bg.endFill();
        _this.addChild(bg);
        _this.tetrisTiles = [];
        for (var i in tetrisTilesNames) {
            var tileName = tetrisTilesNames[i];
            _this.tetrisTiles.push(TetrisTile.loadTileByName(tileName));
        }
        _this.scaleFactor = new PIXI.Point(2, 2);
        //prepare Tetris Container
        _this.tetrisContainer = new TetrisContainer(TetrisContainer.TILES_H, TetrisContainer.TILES_V);
        _this.tetrisContainer.scale = _this.scaleFactor;
        _this.tetrisContainer.x = (APP_WIDTH - _this.tetrisContainer.width) / 2;
        _this.tetrisContainer.y = APP_HEIGHT - _this.tetrisContainer.height - 100;
        _this.tetrisContainer.showGrid();
        _this.addChild(_this.tetrisContainer);
        //prepare Tile Shelf
        _this.shelf = new PIXI.Container();
        _this.shelf.x = (APP_WIDTH - ContainerBuilder.SHELF_WIDTH) / 2;
        _this.shelf.y = 50;
        bg = new PIXI.Graphics;
        bg.beginFill(0xb3b3ff);
        bg.drawRect(0, 0, ContainerBuilder.SHELF_WIDTH / _this.scaleFactor.x, ContainerBuilder.SHELF_HEIGHT / _this.scaleFactor.y);
        bg.endFill();
        _this.shelf.addChild(bg);
        _this.shelf.scale = _this.scaleFactor;
        _this.addChild(_this.shelf);
        var xSpace = ContainerBuilder.SHELF_MARGIN;
        for (var i in _this.tetrisTiles) {
            var element = _this.tetrisTiles[i];
            element.isShelfTile(_this);
            element.x = xSpace;
            xSpace += element.width + ContainerBuilder.SHELF_MARGIN;
            _this.shelf.addChild(element);
        }
        var startButton = PIXI.Sprite.fromImage("data/assets/startButton.png");
        startButton.interactive = true;
        startButton.buttonMode = true;
        startButton.on('pointerdown', function () { _this.callback(_this.tetrisContainer); });
        startButton.x = 700;
        startButton.y = 630;
        startButton.scale.x = 0.7;
        startButton.scale.y = 0.7;
        _this.addChild(startButton);
        return _this;
    }
    ContainerBuilder.SHELF_WIDTH = 800;
    ContainerBuilder.SHELF_HEIGHT = 200;
    ContainerBuilder.SHELF_MARGIN = 10;
    return ContainerBuilder;
}(PIXI.Container));
