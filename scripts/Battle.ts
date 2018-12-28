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

        this.otherPaddle.x = this.width / 2 - (this.otherPaddle.width / 2);
        this.otherPaddle.y = 50;
        this.otherPaddle.vx = 0;

        this.ball.x = this.width / 2;
        this.ball.y = this.height / 2;
        this.ball.vx = 0;
        this.ball.vy = 2;

        callback(this.pixiContainer);
    }

    doStep(delta:number){
        //Horizontal direction
        let dx = this.ball.vx * delta;
        if(this.ball.x + dx < 0 || this.ball.x + dx > this.width){
            this.ball.vx *= -1;
            dx = this.ball.vx * delta;
        }
        this.ball.x += dx;

        //Vertical Direction
        let dy = this.ball.vy * delta;
        if(this.ball.y + dy < 0 || this.ball.y + dy > this.height){
            this.ball.vy *= -1;
            dy = this.ball.vy * delta;
        }
        this.ball.y += this.ball.vy * delta;

        this.ownPaddle.x += this.ownPaddle.vx * delta;
        this.otherPaddle.x += this.otherPaddle.vx * delta;
    }


}