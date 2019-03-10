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
        //Show Menu
        GameManager.menu = new PIXI.Container();
        var menu = GameManager.menu;
        //Generate Backgroundshape
        var bg = new PIXI.Graphics;
        bg.beginFill(0x123456, 1);
        bg.drawRect(0, 0, APP_WIDTH, APP_HEIGHT);
        bg.endFill();
        menu.addChild(bg);
        //generate Parallax background
        var parallaxScale = new PIXI.Point(4.9, 4.9);
        GameManager.parallaxLayer = [];
        var back0 = PIXI.Sprite.fromImage("data/assets/parallax/layer0.png", true, PIXI.SCALE_MODES.NEAREST);
        back0.scale = parallaxScale;
        menu.addChild(back0);
        GameManager.parallaxLayer.push(back0);
        var back1 = PIXI.Sprite.fromImage("data/assets/parallax/layer1.png", true, PIXI.SCALE_MODES.NEAREST);
        back1.scale = parallaxScale;
        menu.addChild(back1);
        GameManager.parallaxLayer.push(back1);
        var back2 = PIXI.Sprite.fromImage("data/assets/parallax/layer2.png", true, PIXI.SCALE_MODES.NEAREST);
        back2.scale = parallaxScale;
        menu.addChild(back2);
        GameManager.parallaxLayer.push(back2);
        var back3 = PIXI.Sprite.fromImage("data/assets/parallax/layer4.png", true, PIXI.SCALE_MODES.NEAREST);
        back3.scale = parallaxScale;
        menu.addChild(back3);
        GameManager.parallaxLayer.push(back3);
        $("#pixiCanvas").mousemove(GameManager.moveParallax);
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
        customGameButton.on('pointerdown', function () { GameManager.showCustomGameWindow(true); });
        menu.addChild(customGameButton);
        var storyBuilderButton = PIXI.Sprite.fromImage("data/assets/ui/button_story-builder.png");
        storyBuilderButton.x = 510;
        storyBuilderButton.y = 400;
        storyBuilderButton.interactive = true;
        storyBuilderButton.buttonMode = true;
        storyBuilderButton.on('pointerdown', function () { window.location.href = "story_editor/"; });
        menu.addChild(storyBuilderButton);
        GameManager.pixiApp.stage.addChild(menu);
        //Register custom game gui buttons
        $("#customGameLoadSaveGameButton").click(function () {
            var sgPath = $("#customGameSaveGame").val();
            var gs = GameManager.getGameState("data/" + sgPath + ".json");
            $("#customGameStory").val(gs.currentStory);
            $("#customGameMap").val(gs.currentMap);
        });
        $("#customGameStartButton").click(function () {
            var sgPath = $("#customGameSaveGame").val();
            sgPath = "data/" + sgPath + ".json";
            var storyPath = $("#customGameStory").val();
            var mapPath = $("#customGameMap").val();
            GameManager.loadGameWithCustomOptions(mapPath, storyPath, sgPath);
            GameManager.showCustomGameWindow(false);
        });
    };
    GameManager.showCustomGameWindow = function (show) {
        if (show) {
            $("#customGameGui").fadeIn();
        }
        else {
            $("#customGameGui").fadeOut();
        }
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
        GameManager.gameState = gameState;
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
            $("#pixiCanvas").off("mousemove");
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
    GameManager.prepareBattle = function (opponent, onWin, onLoose) {
        //start Containerbuilder with gameState.accesableTiles
        var opponentTetrisContainer = TetrisContainer.loadContainerByName(opponent);
        GameManager.containerBuilder = new ContainerBuilder(GameManager.gameState.accessableTiles, function (ownTetrisContainer) {
            GameManager.pixiApp.stage.removeChild(GameManager.containerBuilder);
            GameManager.containerBuilder.destroy();
            GameManager.startBattle(ownTetrisContainer, opponentTetrisContainer, onWin, onLoose);
        });
        GameManager.pixiApp.stage.addChild(GameManager.containerBuilder);
        GameManager.pixiApp.ticker.remove(GameManager.triggerMapStep);
    };
    GameManager.startBattle = function (ownContainer, opponentContainer, onWin, onLoose) {
        GameManager.battle = new Battle(APP_WIDTH, APP_HEIGHT, ownContainer, opponentContainer, function (winState) {
            GameManager.stopBattle();
            if (winState) {
                onWin();
            }
            else {
                onLoose();
            }
        });
        GameManager.pixiApp.stage.addChild(GameManager.battle.pixiContainer);
        //Register keyEvents for map
        $(document).on("keydown.battle", GameManager.battleKeyDown);
        $(document).on("keyup.battle", GameManager.battleKeyUp);
        GameManager.pixiApp.ticker.add(GameManager.triggerBattleStep);
    };
    GameManager.stopBattle = function () {
        GameManager.pixiApp.ticker.remove(GameManager.triggerBattleStep);
        $(document).off("keyup.battle");
        $(document).off("keydown.battle");
        GameManager.pixiApp.stage.removeChild(GameManager.battle.pixiContainer);
        GameManager.battle = undefined;
        GameManager.pixiApp.ticker.add(GameManager.triggerMapStep);
    };
    GameManager.moveParallax = function (event) {
        var x = event.offsetX;
        var percent = -x / APP_WIDTH;
        for (var i in GameManager.parallaxLayer) {
            var newPos = percent * (GameManager.parallaxLayer[i].width - APP_WIDTH);
            GameManager.parallaxLayer[i].x = Number(i) / 3 * newPos;
        }
    };
    GameManager.myCanvas = $("#pixiCanvas")[0];
    return GameManager;
}());
