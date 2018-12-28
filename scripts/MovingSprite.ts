class MovingSprite extends PIXI.Sprite{

vx:number;
vy:number;

    constructor(texture:PIXI.Texture){        
        super(texture);
        this.vx=0;
        this.vy=0;
    }

}