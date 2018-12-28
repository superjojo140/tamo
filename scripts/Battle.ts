class Battle {

    width: number;
    height: number;

    ball: MovingSprite;
    ownPaddle: MovingSprite;
    otherPaddle: MovingSprite;
    state: Object;


    pixiContainer: PIXI.Container;

    constructor(width, height, callback) {
        this.pixiContainer = new PIXI.Container();
        this.width = width;
        this.height = height;
        let bt = PIXI.Texture.fromImage("data/assets/battle/ball.png");
        let pt = PIXI.Texture.fromImage("data/assets/battle/paddle.png");
        this.ball = new MovingSprite(bt);
        this.ownPaddle = new MovingSprite(pt);
        this.otherPaddle = new MovingSprite(pt);

        this.pixiContainer.addChild(this.ball, this.ownPaddle, this.otherPaddle);

        this.ownPaddle.x = this.width / 2 - (this.ownPaddle.width / 2);
        this.ownPaddle.y = this.height - 50;
        this.ownPaddle.vx = 0;
        this.ownPaddle.speed = 3;

        this.otherPaddle.x = this.width / 2 - (this.otherPaddle.width / 2);
        this.otherPaddle.y = 50;
        this.otherPaddle.vx = 0;

        this.ball.x = this.width / 2;
        this.ball.y = this.height / 2;
        this.ball.vx = 0;
        this.ball.vy = 2;

        callback(this.pixiContainer);
    }

    doStep(delta: number) {
        //Horizontal wall
        let newX = this.ball.x + this.ball.vx * delta;
        if (newX < 0 || newX > this.width) {
            this.ball.vx *= -1;
        }

        //Vertical wall
        let newY = this.ball.y + this.ball.vy * delta;
        if (newY < 0 || newY > this.height) {
            this.ball.vy *= -1;
        }

        //Own Paddle
        if ((newY > this.ownPaddle.y) && (newY < this.ownPaddle.y + this.ownPaddle.height) && (newX < this.ownPaddle.x + this.ownPaddle.width) && (newX > this.ownPaddle.x)) {
            this.ball.vy *= -1;
        }

        //Other Paddle
        if (newY > this.otherPaddle.y && newY < this.otherPaddle.y + this.otherPaddle.height && newX < this.otherPaddle.x + this.otherPaddle.width && newX > this.otherPaddle.x) {
            this.ball.vy *= -1;
        }

        //Move ball
        this.ball.x += this.ball.vx * delta;;
        this.ball.y += this.ball.vy * delta;

        //Move own paddle
        let newOwnPaddleX = this.ownPaddle.x + this.ownPaddle.vx * delta;
        if (newOwnPaddleX > 0 && newOwnPaddleX < this.width) {
            this.ownPaddle.x += this.ownPaddle.vx * delta;
        }

        //Move other paddle
        let newotherPaddleX = this.otherPaddle.x + this.otherPaddle.vx * delta;
        if (newotherPaddleX > 0 && newotherPaddleX < this.width) {
            this.otherPaddle.x += this.otherPaddle.vx * delta;
        }
    }

    keydown(event) {

        switch (event.key) {
            case "ArrowLeft":
                this.ownPaddle.vx = -1 * this.ownPaddle.speed;
                break;
            case "ArrowRight":
                this.ownPaddle.vx = 1 * this.ownPaddle.speed;
                break;
        }
    }

    keyup(event) {
        switch (event.key) {
            case "ArrowLeft":
            case "ArrowRight":
                this.ownPaddle.vx = 0;
                break;
        }
    }


}