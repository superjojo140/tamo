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
            error: function (xhr, status, error) { throw "Can't find data/gameRessources.json " + error; },
            success: function (ressources) {
                GameManager.ressources = ressources;
            }
        });
        //TODO Show Menu
        GameManager.menu = new PIXI.Container();
        var menu = GameManager.menu;
        //Generate Backgroundshape
        var bg = new PIXI.Graphics;
        bg.beginFill(0x123456, 1);
        bg.drawRect(0, 0, APP_WIDTH, APP_HEIGHT);
        bg.endFill();
        menu.addChild(bg);
        //Generate Buttons
        var newGameButton = PIXI.Sprite.fromImage("data/assets/ui/button_new-game.png");
        newGameButton.x = 200;
        newGameButton.y = 150;
        newGameButton.interactive = true;
        newGameButton.buttonMode = true;
        newGameButton.on('pointerdown', function () { GameManager.loadGame(); });
        menu.addChild(newGameButton);
        var resumeGameButton = PIXI.Sprite.fromImage("data/assets/ui/button_resume-game.png");
        resumeGameButton.x = 200;
        resumeGameButton.y = 270;
        resumeGameButton.interactive = true;
        resumeGameButton.buttonMode = true;
        resumeGameButton.on('pointerdown', function () { GameManager.loadGame(GameManager.getGameState("data/saveGame.json")); });
        menu.addChild(resumeGameButton);
        var customGameButton = PIXI.Sprite.fromImage("data/assets/ui/button_custom-game.png");
        customGameButton.x = 200;
        customGameButton.y = 400;
        customGameButton.interactive = true;
        customGameButton.buttonMode = true;
        customGameButton.on('pointerdown', function () { GameManager.showCustomGameWindow(); });
        menu.addChild(customGameButton);
        var storyBuilderButton = PIXI.Sprite.fromImage("data/assets/ui/button_story-builder.png");
        storyBuilderButton.x = 510;
        storyBuilderButton.y = 400;
        storyBuilderButton.interactive = true;
        storyBuilderButton.buttonMode = true;
        storyBuilderButton.on('pointerdown', function () { window.location.href = "story_editor/"; });
        menu.addChild(storyBuilderButton);
        GameManager.pixiApp.stage.addChild(menu);
    };
    GameManager.showCustomGameWindow = function () {
        throw new Error("Method not implemented.");
    };
    GameManager.triggerMapStep = function (delta) {
        if (GameManager.map) {
            GameManager.map.doStep(delta);
        }
    };
    GameManager.triggerBattleStep = function (delta) {
        if (GameManager.battle) {
            GameManager.battle.doStep(delta);
        }
    };
    GameManager.battleKeyDown = function (event) {
        if (GameManager.battle) {
            GameManager.battle.keyDown(event);
        }
        console.log("Battle Key Down");
    };
    GameManager.battleKeyUp = function (event) {
        if (GameManager.battle) {
            GameManager.battle.keyUp(event);
        }
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
            GameManager.pixiApp.stage.removeChild(GameManager.menu);
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
        //Register keyEvents for map
        $(document).on("keydown.battle", GameManager.battleKeyDown);
        $(document).on("keyup.battle", GameManager.battleKeyUp);
        GameManager.pixiApp.ticker.add(GameManager.triggerBattleStep);
    };
    GameManager.stopBattle = function () {
        GameManager.pixiApp.ticker.remove(GameManager.triggerMapStep);
        $(document).off("keyup.battle");
        $(document).off("keydown.battle");
    };
    GameManager.myCanvas = $("#pixiCanvas")[0];
    return GameManager;
}());
