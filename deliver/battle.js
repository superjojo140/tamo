var Battle = /** @class */ (function () {
    function Battle(width, height, callback) {
        this.isPaused = false;
        this.pixiContainer = new PIXI.Container();
        var bs = new PIXI.Graphics;
        bs.beginFill(0x293138);
        bs.drawRect(0, 0, width, height);
        bs.endFill();
        this.pixiContainer.addChild(bs);
        this.width = width;
        this.height = height;
        var bt = PIXI.Texture.fromImage("data/assets/battle/ball.png");
        var pt = PIXI.Texture.fromImage("data/assets/battle/paddle.png");
        this.ball = new MovingSprite(bt);
        this.ownPaddle = new MovingSprite(pt);
        this.otherPaddle = new MovingSprite(pt);
        this.pixiContainer.addChild(this.ball, this.ownPaddle, this.otherPaddle);
        this.ownPaddle.x = this.width / 2 - (this.ownPaddle.width / 2);
        this.ownPaddle.y = this.height - 50;
        this.ownPaddle.vx = 0;
        this.ownPaddle.speed = 4;
        this.otherPaddle.x = this.width / 2 - (this.otherPaddle.width / 2);
        this.otherPaddle.y = 50;
        this.otherPaddle.vx = 0;
        this.otherPaddle.speed = 4;
        this.ball.x = this.width / 2;
        this.ball.y = this.height / 2;
        this.ball.vx = 0;
        this.ball.vy = 4;
        callback(this.pixiContainer);
    }
    Battle.prototype.doStep = function (delta) {
        if (!this.isPaused) {
            this.calculatePanelMovement(delta);
            //Collision with Horizontal wall
            var newX = this.ball.x + this.ball.vx * delta;
            if (newX < 0 || newX + this.ball.width > this.width) {
                this.ball.vx *= -1;
            }
            //Collision with Vertical wall
            var newY = this.ball.y + this.ball.vy * delta;
            if (newY < 0 || newY + this.ball.height > this.height) {
                this.ball.vy *= -1;
            }
            //Collision with Own Paddle
            if ((newY + this.ball.height > this.ownPaddle.y) && (newY < this.ownPaddle.y + this.ownPaddle.height) && (newX < this.ownPaddle.x + this.ownPaddle.width) && (newX + this.ball.width > this.ownPaddle.x)) {
                this.ball.vy *= -1;
                //Calculate balls new vx
                var xDiff = Math.max(this.ball.x - this.ownPaddle.x, 0.1);
                xDiff /= this.ownPaddle.width;
                xDiff -= 0.5;
                this.ball.vx += xDiff * Battle.PADDLE_ANGLE_FACTOR;
            }
            //Collision with Other Paddle
            if ((newY + this.ball.height > this.otherPaddle.y) && (newY < this.otherPaddle.y + this.otherPaddle.height) && (newX < this.otherPaddle.x + this.otherPaddle.width) && (newX + this.ball.width > this.otherPaddle.x)) {
                this.ball.vy *= -1;
                //Calculate balls new vx
                var xDiff = Math.max(this.ball.x - this.otherPaddle.x, 0.1);
                xDiff /= this.otherPaddle.width;
                xDiff -= 0.5;
                this.ball.vx += xDiff * Battle.PADDLE_ANGLE_FACTOR;
            }
            //Move ball
            this.ball.x += this.ball.vx * delta;
            ;
            this.ball.y += this.ball.vy * delta;
            //Move own paddle
            var newOwnPaddleX = this.ownPaddle.x + this.ownPaddle.vx * delta;
            if (newOwnPaddleX > 0 && newOwnPaddleX + this.ownPaddle.width < this.width) {
                this.ownPaddle.x += this.ownPaddle.vx * delta;
            }
            //Move other paddle
            var newotherPaddleX = this.otherPaddle.x + this.otherPaddle.vx * delta;
            if (newotherPaddleX > 0 && newotherPaddleX + this.otherPaddle.width < this.width) {
                this.otherPaddle.x += this.otherPaddle.vx * delta;
            }
            //Let ball loose vx over time
        }
    };
    Battle.prototype.calculatePanelMovement = function (delta) {
        if (this.otherPaddle.x > this.ball.x + this.ball.width) {
            this.otherPaddle.vx = -this.otherPaddle.speed;
        }
        else if (this.otherPaddle.x + this.otherPaddle.width < this.ball.x) {
            this.otherPaddle.vx = this.otherPaddle.speed;
        }
        else {
            this.otherPaddle.vx = 0;
        }
    };
    Battle.prototype.keydown = function (event) {
        switch (event.key) {
            case "ArrowLeft":
                this.ownPaddle.vx = -1 * this.ownPaddle.speed;
                break;
            case "ArrowRight":
                this.ownPaddle.vx = 1 * this.ownPaddle.speed;
                break;
        }
    };
    Battle.prototype.keyup = function (event) {
        switch (event.key) {
            case "ArrowLeft":
            case "ArrowRight":
                this.ownPaddle.vx = 0;
                break;
        }
    };
    Battle.PADDLE_ANGLE_FACTOR = 2;
    return Battle;
}());
