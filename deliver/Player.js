var Player = /** @class */ (function () {
    function Player(x, y, map) {
        this.triggerInfoActive = false;
        this.map = map;
        this.animations = [];
        var baseTexture = PIXI.Texture.fromImage("data/assets/ranger_2.png").baseTexture;
        for (var row = 0; row < 4; row++) {
            var textureArray = [];
            for (var column = 0; column < 3; column++) {
                var t = new PIXI.Texture(baseTexture, new PIXI.Rectangle(column * Player.SPRITE_WIDTH, row * Player.SPRITE_HEIGHT, Player.SPRITE_WIDTH, Player.SPRITE_HEIGHT));
                textureArray.push(t);
            }
            this.animations.push(textureArray);
        }
        this.sprite = new PIXI.extras.AnimatedSprite(this.animations[Player.DOWN]);
        this.sprite.x = x;
        this.sprite.y = y;
        this.vx = 0;
        this.vy = 0;
        this.sprite.scale = Player.SPRITE_SCALE;
        this.sprite.animationSpeed = 0.13;
        this.sprite.loop = true;
        //Load attention sign
        this.triggerInfoSprite = PIXI.Sprite.fromImage("data/assets/attention.png");
    }
    Player.prototype.changeDirection = function (direction) {
        if (0 <= direction && direction <= 3) {
            this.sprite.textures = this.animations[direction];
            this.sprite.play();
        }
        else if (direction == Player.STOP) {
            this.sprite.stop();
        }
    };
    Player.prototype.keyDown = function (event) {
        switch (event.key) {
            case "ArrowUp":
                this.vy = -1 * Player.PLAYER_SPEED;
                this.changeDirection(Player.UP);
                break;
            case "ArrowDown":
                this.vy = 1 * Player.PLAYER_SPEED;
                this.changeDirection(Player.DOWN);
                break;
            case "ArrowLeft":
                this.vx = -1 * Player.PLAYER_SPEED;
                this.changeDirection(Player.LEFT);
                break;
            case "ArrowRight":
                this.vx = 1 * Player.PLAYER_SPEED;
                this.changeDirection(Player.RIGHT);
                break;
            case "x":
                this.checkTrigger();
                break;
        }
    };
    Player.prototype.keyUp = function (event) {
        switch (event.key) {
            case "ArrowUp":
                this.vy = 0;
                this.changeDirection(Player.STOP);
                break;
            case "ArrowDown":
                this.vy = 0;
                this.changeDirection(Player.STOP);
                break;
            case "ArrowLeft":
                this.vx = 0;
                this.changeDirection(Player.STOP);
                break;
            case "ArrowRight":
                this.vx = 0;
                this.changeDirection(Player.STOP);
                break;
        }
    };
    Player.prototype.doStep = function (delta) {
        var newX = this.sprite.x + this.vx * delta;
        var newY = this.sprite.y + this.vy * delta;
        var xRange = {
            from: Math.floor(newX / this.map.finalTileWidth),
            to: Math.floor((newX + this.sprite.width) / this.map.finalTileWidth)
        };
        var yRange = {
            from: Math.floor(newY / this.map.finalTileHeight),
            to: Math.floor((newY + this.sprite.height) / this.map.finalTileHeight)
        };
        var blocked = false;
        for (var x = xRange.from; x <= xRange.to; x++) {
            for (var y = yRange.from; y <= yRange.to; y++) {
                if (this.map.collisionBitMap[y] == undefined || this.map.collisionBitMap[y][x] == undefined || this.map.collisionBitMap[y][x] == true) {
                    blocked = true;
                }
            }
        }
        if (blocked == false) {
            this.sprite.x = newX;
            this.sprite.y = newY;
        }
        //Check for event
        var originalX = this.sprite.x;
        var xTiles = originalX / this.map.finalTileWidth;
        xTiles = Math.round(xTiles);
        var originalY = this.sprite.y;
        var yTiles = originalY / this.map.finalTileHeight;
        yTiles = Math.round(yTiles);
        if (!this.triggerInfoActive && this.map.eventTriggerMap[yTiles][xTiles]) {
            console.log("Heres a trigger");
            this.triggerInfoSprite.x = xTiles * this.map.finalTileWidth + 10;
            this.triggerInfoSprite.y = yTiles * this.map.finalTileHeight + 10 - this.triggerInfoSprite.height;
            this.map.pixiContainer.addChild(this.triggerInfoSprite);
            this.triggerInfoActive = true;
        }
        else if (this.triggerInfoActive && !this.map.eventTriggerMap[yTiles][xTiles]) {
            console.log("You leaved the trigger");
            this.map.pixiContainer.removeChild(this.triggerInfoSprite);
            this.triggerInfoActive = false;
        }
    };
    Player.prototype.checkTrigger = function () {
        //Get the nearest tile
        var originalX = this.sprite.x;
        var xTiles = originalX / this.map.finalTileWidth;
        xTiles = Math.round(xTiles);
        var originalY = this.sprite.y;
        var yTiles = originalY / this.map.finalTileHeight;
        yTiles = Math.round(yTiles);
        var eventId = this.map.eventTriggerMap[yTiles][xTiles];
        if (eventId) {
            this.map.pause();
            var map_1 = this.map;
            this.map.story.showEvent(eventId, function () { return map_1.isPaused = false; });
        }
    };
    Player.UP = 0;
    Player.RIGHT = 1;
    Player.DOWN = 2;
    Player.LEFT = 3;
    Player.STOP = 4;
    Player.SPRITE_WIDTH = 96 / 3;
    Player.SPRITE_HEIGHT = 144 / 4;
    Player.SPRITE_SCALE = new PIXI.Point(1.2, 1.2);
    Player.PLAYER_SPEED = 3;
    return Player;
}());
