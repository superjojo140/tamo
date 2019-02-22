class GameManager{
    

    map:Map;
    story:Story;
    containerBuilder:ContainerBuilder;
    battle:Battle;

    ressources:Object;
    gameState:Object;

    constructor(){
        //Check if a saved gameState can be found
        let manager = this;

        $.ajax({
            url: "/data/saveGame.json",
            async: false,
            dataType: "json",
            error: function (xhr, status, error) {  },//Load standard gameState from ressources
            success: function (savedGameState) {
                manager.loadGame(savedGameState);
            }
        });
    }

    loadGame(savedGameState: any): any {
        throw new Error("Method not implemented.");
    }
}