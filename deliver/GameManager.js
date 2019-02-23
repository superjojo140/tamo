var SPRITESHEET = new TiledSpritesheet("data/assets/spritesheet.png", 1, 16, 16, 31, 57); //Kenny Spritesheet see data/maps/Kenney RPG Tiles.tsx
//TODO Parse this information automatixally from tsx file
var APP_WIDTH = 1000;
var APP_HEIGHT = 700;
var GameManager = /** @class */ (function () {
    function GameManager() {
    }
    GameManager.startGame = function () {
        //Create Pixi stuff
        //Create a Pixi Application
        GameManager.pixiApp = new PIXI.Application({
            width: APP_WIDTH,
            height: APP_HEIGHT,
            view: GameManager.myCanvas
        });
        //Add the canvas that Pixi automatically created for you to the HTML document
        document.body.appendChild(GameManager.pixiApp.view);
        /* $(document).keydown(function (event) {
             if (myMap) {
                 myMap.keyDown(event);
             }
             if (myBattle) {
                 myBattle.keyDown(event);
             }
         });
     
         $(document).keyup(function (event) {
             if (myMap) {
                 myMap.keyUp(event);
             }
             if (myBattle) {
                 myBattle.keyUp(event);
             }
         });
     
         function gameLoop(delta) {
             if (myMap) {
                 myMap.doStep(delta);
             }
     
             if (myBattle) {
                 myBattle.doStep(delta);
             }
         }
     
         app.ticker.add(delta => gameLoop(delta));
     
         
     
         let tt = new TetrisTile([[1, 0], [1, 1]], 0xaabbcc, 0);
         let tc = new TetrisContainer(10, 3);
         tc.addTetrisTileAt(tt, 0, 0);
     
         let tt2 = new TetrisTile([[1, 0, 1], [1, 1, 1], [1, 0, 1]], 0xaabbcc, 1);
         let tc2 = new TetrisContainer(10, 3);
         tc2.addTetrisTileAt(tt2, 0, 0);
     
         let tt3 = new TetrisTile([[1, 1], [1, 1]], 0xaabbcc, 0);
         tc2.addTetrisTileAt(tt3, 5, 0);
         let tt4 = new TetrisTile([[1, 0], [1, 1]], 0xaabbcc, 0);
         tc2.addTetrisTileAt(tt4, 8, 0);
     
         */
        //Load ressources
        $.ajax({
            url: "/data/gameRessources.json",
            async: false,
            dataType: "json",
            error: function (xhr, status, error) { throw "Can't find /data/gameRessources.json " + error; },
            success: function (ressources) {
                GameManager.ressources = ressources;
            }
        });
        //TODO Show Menu
    };
    GameManager.loadGame = function (gameState) {
        if (!gameState) {
            gameState = GameManager.ressources.gameState;
        }
        //Load Story
        var storyPath = "data/storyData/" + gameState.currentStory + ".json";
        if (GameManager.story) {
            GameManager.story.destroy();
        }
        GameManager.story = new Story(storyPath, "messageContainer");
        //Laod Map
        if (GameManager.map) {
            GameManager.map.destroy();
        }
        var mapPath = "data/maps/" + gameState.currentMap + ".json";
        TiledMapParser.loadMap(mapPath, SPRITESHEET, storyPath, {}, function (map) {
            //TODO Add Ticker and keyListener
            GameManager.map = map;
            GameManager.pixiApp.ticker.start();
            GameManager.pixiApp.stage.addChild(map.pixiContainer);
        });
    };
    GameManager.getGameState = function (path) {
        //Check if a saved gameState can be found
        var returnGameState;
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
    };
    GameManager.loadGameWithCustomOptions = function (map, story, gameStatePath) {
        var gameState;
        if (!gameStatePath) {
            gameState = GameManager.ressources.gameState;
        }
        else {
            gameState = GameManager.getGameState(gameStatePath);
        }
        gameState.currentMap = map;
        gameState.currentStory = story;
        GameManager.loadGame(gameState);
    };
    GameManager.startBattle = function () {
        /*
        let tcn = myContainerBuilder.tetrisContainer;
        tcn.scale = new PIXI.Point(1,1);
        myContainerBuilder.removeChild(tcn);
        myBattle = new Battle(600,600,tcn,tc);
        app.stage.addChild(myBattle.pixiContainer);
        app.stage.removeChild(myContainerBuilder);
        */
    };
    GameManager.myCanvas = $("#pixiCanvas")[0];
    return GameManager;
}());
