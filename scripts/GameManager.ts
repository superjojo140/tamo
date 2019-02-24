const SPRITESHEET = new TiledSpritesheet("data/assets/spritesheet.png", 1, 16, 16, 31, 57) //Kenny Spritesheet see data/maps/Kenney RPG Tiles.tsx
//TODO Parse this information automatixally from tsx file

const APP_WIDTH = 1000;
const APP_HEIGHT = 700;

class GameManager {


    static map: Map;
    static story: Story;
    static containerBuilder: ContainerBuilder;
    static battle: Battle;

    static ressources: any;
    static gameState: GameState;



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

        //TODO Show Menu
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

            GameManager.map = map;
            GameManager.pixiApp.ticker.start();
            GameManager.pixiApp.stage.addChild(map.pixiContainer);
        });


    }




    static getGameState(path: string): GameState {
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

    static loadGameWithCustomOptions(map: string, story: string, gameStatePath?: string) {
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

    static startBattle() {
        /*
        let tcn = myContainerBuilder.tetrisContainer;
        tcn.scale = new PIXI.Point(1,1);
        myContainerBuilder.removeChild(tcn);
        myBattle = new Battle(600,600,tcn,tc);
        app.stage.addChild(myBattle.pixiContainer);
        app.stage.removeChild(myContainerBuilder);
        
        */

         //Register keyEvents for map
         $(document).on("keydown.battle",GameManager.battleKeyDown);
         $(document).on("keyup.battle",GameManager.battleKeyUp);
        GameManager.pixiApp.ticker.add(GameManager.triggerBattleStep);

    }

    static stopBattle() {
        GameManager.pixiApp.ticker.remove(GameManager.triggerMapStep);
        $(document).off("keyup.battle");
        $(document).off("keydown.battle");
    }



}


interface GameState {
    currentMap: string;
    currentStory: string;
    accessableTiles: string[];
}