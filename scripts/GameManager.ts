const SPRITESHEET = new TiledSpritesheet("data/assets/spritesheet.png", 1, 16, 16, 31, 57) //Kenny Spritesheet see data/maps/Kenney RPG Tiles.tsx
//TODO Parse this information automatixally from tsx file

const APP_WIDTH = 1000;
const APP_HEIGHT = 700;

class GameManager {



    static map: Map;
    static story: Story;
    static containerBuilder: ContainerBuilder;
    static battle: Battle;
    static menu: PIXI.Container;

    static ressources: any;
    static gameState: GameState;

    static parallaxLayer:PIXI.Sprite[];



    static myCanvas = $("#pixiCanvas")[0];
    static pixiApp;


    static startGame() {
        //Create Pixi stuff
        //Create a Pixi Application
        GameManager.pixiApp = new PIXI.Application({
            width: APP_WIDTH,
            height: APP_HEIGHT,
            view: GameManager.myCanvas
        });

        //Add the canvas that Pixi automatically created for you to the HTML document
        document.body.appendChild(GameManager.pixiApp.view);

        //Register keyEvents for map
        $(document).keydown(function (event) {
            if (GameManager.map) {
                GameManager.map.keyDown(event);
            }
        });

        $(document).keyup(function (event) {
            if (GameManager.map) {
                GameManager.map.keyUp(event);
            }
        });

        //add map.doStep to ticker
        GameManager.pixiApp.ticker.add(GameManager.triggerMapStep);

        //Load ressources
        $.ajax({
            url: "data/gameRessources.json",
            async: false,
            dataType: "json",
            error: function (xhr, status, error) { throw "Can't find data/gameRessources.json " + error },
            success: function (ressources) {
                GameManager.ressources = ressources;
            }
        });

        //Show Menu
        GameManager.menu = new PIXI.Container();
        let menu = GameManager.menu;

        //Generate Backgroundshape
        let bg = new PIXI.Graphics;
        bg.beginFill(0x123456, 1);
        bg.drawRect(0, 0, APP_WIDTH, APP_HEIGHT);
        bg.endFill();
        menu.addChild(bg);

        //generate Parallax background
        let parallaxScale = new PIXI.Point(4.9, 4.9);
        GameManager.parallaxLayer = [];

        let back0 = PIXI.Sprite.fromImage("data/assets/parallax/layer0.png", true, PIXI.SCALE_MODES.NEAREST);
        back0.scale = parallaxScale;
        menu.addChild(back0);
        GameManager.parallaxLayer.push(back0);

        let back1 = PIXI.Sprite.fromImage("data/assets/parallax/layer1.png", true, PIXI.SCALE_MODES.NEAREST);
        back1.scale = parallaxScale;
        menu.addChild(back1);
        GameManager.parallaxLayer.push(back1);

        let back2 = PIXI.Sprite.fromImage("data/assets/parallax/layer2.png", true, PIXI.SCALE_MODES.NEAREST);
        back2.scale = parallaxScale;
        menu.addChild(back2);
        GameManager.parallaxLayer.push(back2);

        let back3 = PIXI.Sprite.fromImage("data/assets/parallax/layer4.png", true, PIXI.SCALE_MODES.NEAREST);
        back3.scale = parallaxScale;
        menu.addChild(back3);
        GameManager.parallaxLayer.push(back3);

        $("#pixiCanvas").mousemove(GameManager.moveParallax);






        //Generate Buttons
        let newGameButton = PIXI.Sprite.fromImage("data/assets/ui/button_new-game.png");
        newGameButton.x = 200;
        newGameButton.y = 150;
        newGameButton.interactive = true;
        newGameButton.buttonMode = true;
        newGameButton.on('pointerdown', () => { GameManager.loadGame(); });
        menu.addChild(newGameButton);

        let resumeGameButton = PIXI.Sprite.fromImage("data/assets/ui/button_resume-game.png");
        resumeGameButton.x = 200;
        resumeGameButton.y = 270;
        resumeGameButton.interactive = true;
        resumeGameButton.buttonMode = true;
        resumeGameButton.on('pointerdown', () => { GameManager.loadGame(GameManager.getGameState("data/saveGame.json")); });
        menu.addChild(resumeGameButton);

        let customGameButton = PIXI.Sprite.fromImage("data/assets/ui/button_custom-game.png");
        customGameButton.x = 200;
        customGameButton.y = 400;
        customGameButton.interactive = true;
        customGameButton.buttonMode = true;
        customGameButton.on('pointerdown', () => { GameManager.showCustomGameWindow(true) });
        menu.addChild(customGameButton);

        let storyBuilderButton = PIXI.Sprite.fromImage("data/assets/ui/button_story-builder.png");
        storyBuilderButton.x = 510;
        storyBuilderButton.y = 400;
        storyBuilderButton.interactive = true;
        storyBuilderButton.buttonMode = true;
        storyBuilderButton.on('pointerdown', () => { window.location.href = "story_editor/" });
        menu.addChild(storyBuilderButton);



        GameManager.pixiApp.stage.addChild(menu);


        //Register custom game gui buttons
        $("#customGameLoadSaveGameButton").click(function () {
            let sgPath = $("#customGameSaveGame").val();
            let gs = GameManager.getGameState("data/" + sgPath + ".json");
            $("#customGameStory").val(gs.currentStory);
            $("#customGameMap").val(gs.currentMap);
        });

        $("#customGameStartButton").click(function () {
            let sgPath = $("#customGameSaveGame").val();
            sgPath = "data/" + sgPath + ".json";
            let storyPath = $("#customGameStory").val();
            let mapPath = $("#customGameMap").val();
            GameManager.loadGameWithCustomOptions(mapPath, storyPath, sgPath);
            GameManager.showCustomGameWindow(false);
        });

    }


    static showCustomGameWindow(show: boolean) {
        if (show) {
            $("#customGameGui").fadeIn();
        }
        else {
            $("#customGameGui").fadeOut();
        }
    }

    static triggerMapStep(delta) {
        if (GameManager.map) {
            GameManager.map.doStep(delta);
        }
    }

    static triggerBattleStep(delta) {
        if (GameManager.battle) {
            GameManager.battle.doStep(delta);
        }
    }

    static battleKeyDown(event) {
        if (GameManager.battle) {
            GameManager.battle.keyDown(event);
        }
        console.log("Battle Key Down");
    }

    static battleKeyUp(event) {
        if (GameManager.battle) {
            GameManager.battle.keyUp(event);
        }
    }




    static loadGame(gameState?: GameState) {

        if (!gameState) {
            gameState = GameManager.ressources.gameState;
        }
        GameManager.gameState = gameState;

        //Load Story
        let storyPath = `data/storyData/${gameState.currentStory}.json`;
        if (GameManager.story) {
            GameManager.story.destroy();
        }
        GameManager.story = new Story(storyPath, "messageContainer");

        //Laod Map
        if (GameManager.map) {
            GameManager.map.destroy();
        }
        let mapPath = `data/maps/${gameState.currentMap}.json`;

        TiledMapParser.loadMap(mapPath, SPRITESHEET, storyPath, {}, function (map) { //TODO Remove story and GameState from Map
            //TODO Add Ticker and keyListener
            $("#pixiCanvas").off("mousemove");
            GameManager.map = map;
            GameManager.pixiApp.ticker.start();
            GameManager.pixiApp.stage.addChild(map.pixiContainer);
            GameManager.pixiApp.stage.removeChild(GameManager.menu);
        });


    }




    static getGameState(path): GameState {
        //Check if a saved gameState can be found
        let returnGameState;

        $.ajax({
            url: path,
            async: false,
            dataType: "json",
            error: function (xhr, status, error) {
                //Load standard gameState from ressources
                console.log("Cant find gameState at " + path + " Loading standard gameState");
                returnGameState = GameManager.ressources.gameState;
            },
            success: function (savedGameState) {
                returnGameState = savedGameState;
            }
        });

        return returnGameState;
    }

    static loadGameWithCustomOptions(map, story, gameStatePath?) {
        let gameState: GameState;
        if (!gameStatePath) {
            gameState = GameManager.ressources.gameState;
        }
        else {
            gameState = GameManager.getGameState(gameStatePath);
        }
        gameState.currentMap = map;
        gameState.currentStory = story;
        GameManager.loadGame(gameState);
    }

    static prepareBattle(opponent: string, onWin: () => void, onLoose: () => void) {
        //start Containerbuilder with gameState.accesableTiles
        let opponentTetrisContainer = TetrisContainer.loadContainerByName(opponent);
        let containerBuilder = new ContainerBuilder(GameManager.gameState.accessableTiles,(ownTetrisContainer:TetrisContainer)=>{
            GameManager.startBattle(ownTetrisContainer,opponentTetrisContainer,onWin,onLoose);
        });
        GameManager.pixiApp.stage.addChild(containerBuilder);
        GameManager.pixiApp.ticker.remove(GameManager.triggerMapStep);
    }

    static startBattle(ownContainer,opponentContainer,onWin,onLoose) {
        /*
        let tcn = myContainerBuilder.tetrisContainer;
        tcn.scale = new PIXI.Point(1,1);
        myContainerBuilder.removeChild(tcn);
        myBattle = new Battle(600,600,tcn,tc);
        app.stage.addChild(myBattle.pixiContainer);
        app.stage.removeChild(myContainerBuilder);
        
        */

        //Register keyEvents for map
        $(document).on("keydown.battle", GameManager.battleKeyDown);
        $(document).on("keyup.battle", GameManager.battleKeyUp);
        GameManager.pixiApp.ticker.add(GameManager.triggerBattleStep);

    }

    static stopBattle() {
        GameManager.pixiApp.ticker.remove(GameManager.triggerMapStep);
        $(document).off("keyup.battle");
        $(document).off("keydown.battle");
        GameManager.pixiApp.ticker.add(GameManager.triggerMapStep);
    }


    static moveParallax(event){
        let x = event.offsetX;
        let percent = - x / APP_WIDTH;
        

        for(let i in GameManager.parallaxLayer){
            let newPos = percent * (GameManager.parallaxLayer[i].width - APP_WIDTH);
            GameManager.parallaxLayer[i].x =  Number(i) / 3 * newPos;
        }

    }



}


interface GameState {
    currentMap: string;
    currentStory: string;
    accessableTiles: string[];
    flags: { [flagName: string]: boolean; };
}