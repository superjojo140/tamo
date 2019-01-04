var Battle = /** @class */ (function () {
    function Battle(width, height, ownTetrisContainer, otherTetrisContainer) {
        this.isPaused = false;
        this.width = width;
        this.height = height;
        this.ownTetrisContainer = ownTetrisContainer;
        this.otherTetrisContainer = otherTetrisContainer;
        this.soundOn = false;
        this.musicOn = true;
        //Create Pixi Container for displaying the Battle and its components
        this.pixiContainer = new PIXI.Container();
        //Load Sounds
        this.sounds = [];
        this.sounds["blob1"] = PIXI.sound.Sound.from("data/assets/sound/blob1.mp3");
        this.sounds["blob2"] = PIXI.sound.Sound.from("data/assets/sound/blob2.mp3");
        this.sounds["blob3"] = PIXI.sound.Sound.from("data/assets/sound/blob3.mp3");
        this.sounds["blob4"] = PIXI.sound.Sound.from("data/assets/sound/blob4.mp3");
        this.sounds["mu1"] = PIXI.sound.Sound.from("data/assets/music/mu2.mp3");
        //Generate Backgroundshape
        var bg = new PIXI.Graphics;
        bg.beginFill(0x293138);
        bg.drawRect(0, 0, width, height);
        bg.endFill();
        this.pixiContainer.addChild(bg);
        //Display TetrisContainers     
        this.ownTetrisContainer.x = (this.width - this.ownTetrisContainer.width) / 2;
        this.ownTetrisContainer.y = this.pixiContainer.height - this.ownTetrisContainer.height - Battle.TETRIS_CONTAINER_MARGIN;
        this.pixiContainer.addChild(this.ownTetrisContainer);
        this.otherTetrisContainer.x = (this.width - this.otherTetrisContainer.width) / 2;
        this.otherTetrisContainer.y = Battle.TETRIS_CONTAINER_MARGIN;
        this.pixiContainer.addChild(this.otherTetrisContainer);
        //Create Ball
        var bt = PIXI.Texture.fromImage("data/assets/battle/ball.png");
        this.ball = new MovingSprite(bt);
        this.ball.x = this.width / 2;
        this.ball.y = this.height / 2;
        this.ball.vx = 0;
        this.ball.vy = 4;
        this.pixiContainer.addChild(this.ball);
        //Create Paddles
        var pt = PIXI.Texture.fromImage("data/assets/battle/paddle.png");
        this.ownPaddle = new MovingSprite(pt);
        this.otherPaddle = new MovingSprite(pt);
        var paddleMargin = Battle.TETRIS_CONTAINER_MARGIN + this.ownTetrisContainer.height + Battle.PADDLE_MARGIN;
        this.ownPaddle.x = this.width / 2 - (this.ownPaddle.width / 2);
        this.ownPaddle.y = this.height - paddleMargin;
        this.ownPaddle.vx = 0;
        this.ownPaddle.speed = 4;
        this.otherPaddle.x = this.width / 2 - (this.otherPaddle.width / 2);
        this.otherPaddle.y = paddleMargin;
        this.otherPaddle.vx = 0;
        this.otherPaddle.speed = 4;
        this.pixiContainer.addChild(this.ownPaddle, this.otherPaddle);
    }
    Battle.prototype.doStep = function (delta) {
        if (!this.isPaused) {
            this.calculatePanelMovement(delta);
            var newX = this.ball.x + this.ball.vx * delta;
            var newY = this.ball.y + this.ball.vy * delta;
            //Collision with Horizontal wall      
            if (newX < 0 || newX + this.ball.width > this.width) {
                this.ball.vx *= -1;
            }
            //Collision with Vertical wall            
            if (newY < 0 || newY + this.ball.height > this.height) {
                this.ball.vy *= -1;
            }
            //Collision with Own Paddle
            if ((newY + this.ball.height > this.ownPaddle.y) && (newY < this.ownPaddle.y + this.ownPaddle.height) && (newX < this.ownPaddle.x + this.ownPaddle.width) && (newX + this.ball.width > this.ownPaddle.x)) {
                this.ball.vy *= -1;
                this.playSound("blob3");
                //Calculate balls new vx
                var xDiff = Math.max(this.ball.x - this.ownPaddle.x, 0.1);
                xDiff /= this.ownPaddle.width;
                xDiff -= 0.5;
                this.ball.vx += xDiff * Battle.PADDLE_ANGLE_FACTOR;
            }
            //Collision with Other Paddle
            if ((newY + this.ball.height > this.otherPaddle.y) && (newY < this.otherPaddle.y + this.otherPaddle.height) && (newX < this.otherPaddle.x + this.otherPaddle.width) && (newX + this.ball.width > this.otherPaddle.x)) {
                this.ball.vy *= -1;
                this.playSound("blob2");
                //Calculate balls new vx
                var xDiff = Math.max(this.ball.x - this.otherPaddle.x, 0.1);
                xDiff /= this.otherPaddle.width;
                xDiff -= 0.5;
                this.ball.vx += xDiff * Battle.PADDLE_ANGLE_FACTOR;
            }
            //Collision with TetrisContainer
            if ((newY + this.ball.height > this.ownTetrisContainer.y) && (newY < this.ownTetrisContainer.y + this.ownTetrisContainer.height) && (newX < this.ownTetrisContainer.x + this.ownTetrisContainer.width) && (newX + this.ball.width > this.ownTetrisContainer.x)) {
                this.ownTetrisContainer.onBounce(this.ball);
            }
            if ((newY + this.ball.height > this.otherTetrisContainer.y) && (newY < this.otherTetrisContainer.y + this.otherTetrisContainer.height) && (newX < this.otherTetrisContainer.x + this.otherTetrisContainer.width) && (newX + this.ball.width > this.otherTetrisContainer.x)) {
                this.otherTetrisContainer.onBounce(this.ball);
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
    Battle.prototype.playSound = function (soundName) {
        if (this.soundOn == true) {
            this.sounds[soundName].play();
        }
    };
    Battle.prototype.playMusic = function (soundName) {
        if (this.musicOn == true) {
            this.sounds[soundName].play();
            this.sounds[soundName].volume = 0.05;
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
    Battle.TETRIS_CONTAINER_MARGIN = 32;
    Battle.PADDLE_MARGIN = 15;
    return Battle;
}());
