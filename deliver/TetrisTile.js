var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TetrisTile = /** @class */ (function (_super) {
    __extends(TetrisTile, _super);
    function TetrisTile(dimensions, tileColor, borderColor, tilecolorAlpha) {
        var _this = _super.call(this) || this;
        if (tilecolorAlpha === undefined) {
            tilecolorAlpha = 1;
        }
        ;
        _this.dimensions = dimensions;
        _this.tileColor = tileColor;
        _this.borderColor = borderColor;
        _this.tileColorAlpha = tilecolorAlpha;
        _this.dragging = false;
        if (!dimensions[0]) {
            throw "Cannot create empty TetrisTile";
        }
        //Draw itself
        for (var row = 0; row < dimensions.length; row++) {
            for (var column = 0; column < dimensions[0].length; column++) {
                if (_this.dimensions[row][column] == 1) {
                    _this.beginFill(_this.tileColor, tilecolorAlpha);
                    _this.lineStyle(2, _this.borderColor);
                    var tw = TetrisContainer.TILE_WIDTH;
                    var th = TetrisContainer.TILE_HEIGHT;
                    _this.drawRect(column * tw, row * th, tw, th);
                }
            }
        }
        return _this;
    }
    TetrisTile.prototype.onBounce = function (container, ball) {
        ball.vy *= -1;
        container.removeTetrisTile(this);
    };
    TetrisTile.prototype.getCopy = function () {
        return new TetrisTile(this.dimensions, this.tileColor, this.borderColor, this.tileColorAlpha);
    };
    TetrisTile.prototype.makeDraggable = function (cb) {
        this.containerBuilder = cb;
        // enable the TetrisTile to be interactive... this will allow it to respond to mouse and touch events
        this.interactive = true;
        // this button mode will mean the hand cursor appears when you roll over the bunny with your mouse
        this.buttonMode = true;
        // setup events for mouse + touch using
        // the pointer events
        this
            .on('pointerdown', this.onDragStart)
            .on('pointerup', this.onDragEnd)
            .on('pointerupoutside', this.onDragEnd)
            .on('pointermove', this.onDragMove);
    };
    TetrisTile.prototype.onDragStart = function (event) {
        // store a reference to the data
        // the reason for this is because of multitouch
        // we want to track the movement of this particular touch
        this.dragEventData = event.data;
        this.alpha = 0.8;
        this.dragging = true;
    };
    TetrisTile.prototype.onDragEnd = function () {
        this.alpha = 1;
        this.dragging = false;
        // set the interaction data to null
        this.dragEventData = null;
    };
    TetrisTile.prototype.onDragMove = function () {
        if (this.dragging) {
            var newPosition = this.dragEventData.getLocalPosition(this.parent);
            //Check wether tile is over Tetriscontainer
            var c = this.containerBuilder.tetrisContainer;
            if (newPosition.y < c.y + c.height && newPosition.y > c.y && newPosition.x < c.x + c.width && newPosition.x > c.x) {
                //Map to tiles
                var xTile = Math.round((newPosition.x - c.x) / (TetrisContainer.TILE_WIDTH * c.scale.x));
                var yTile = Math.round((newPosition.y - c.y) / (TetrisContainer.TILE_HEIGHT * c.scale.y));
                if (c.isFitting(this, xTile, yTile)) {
                    this.tint = 0x00FF00; //Green
                }
                else {
                    this.tint = 0xFF0000; //Red
                }
            }
            this.x = newPosition.x;
            this.y = newPosition.y;
        }
    };
    TetrisTile.prototype.isShelfTile = function (cb) {
        this.containerBuilder = cb;
        // enable the TetrisTile to be interactive... this will allow it to respond to mouse and touch events
        this.interactive = true;
        // this button mode will mean the hand cursor appears when you roll over the bunny with your mouse
        this.buttonMode = true;
        // setup events for mouse + touch using
        // the pointer events
        this.on('pointerdown', this.createDraggableCopy);
    };
    TetrisTile.prototype.createDraggableCopy = function (event) {
        var newTile = this.getCopy();
        newTile.makeDraggable(this.containerBuilder);
        newTile.scale = this.containerBuilder.scaleFactor;
        this.containerBuilder.addChild(newTile);
        newTile.onDragStart(event);
        newTile.onDragMove();
    };
    return TetrisTile;
}(PIXI.Graphics));
