class MovingSprite extends PIXI.Sprite {

    vx: number;
    vy: number;
    speed: number;

    constructor(texture: PIXI.Texture) {
        super(texture);
        this.vx = 0;
        this.vy = 0;
        this.speed = 0;
    }

}