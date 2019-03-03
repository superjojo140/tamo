var Story = /** @class */ (function () {
    function Story(storyPath, htmlContainerId) {
        var thisStory = this;
        $.ajax({
            url: storyPath,
            async: false,
            dataType: "json",
            error: function (xhr, status, error) { thisStory.parsingError("Could not find story file", -1); },
            success: function (storyData) {
                thisStory.actions = storyData.actions;
                thisStory.health = storyData.information.health;
                thisStory.parentContainer = $("#" + htmlContainerId);
                thisStory.parentContainer.hide();
                thisStory.parentContainer.html("");
                thisStory.parentContainer.append("<div class='col-md-2'> <img id='iconBox' width='100%'></div>");
                thisStory.iconBox = $("#iconBox");
                thisStory.messageBox = $("<div class='col-md-8' id='messageBox'></div>");
                thisStory.parentContainer.append(thisStory.messageBox);
                thisStory.buttonsBox = $("<div class='col-md-2' id='buttonsBox'></div>");
                thisStory.parentContainer.append(thisStory.buttonsBox);
                //If given, start with startEvent
                if (storyData.information.startEvent) {
                    thisStory.currentEventId = storyData.information.startEvent;
                    thisStory.currentAction = thisStory.actions[thisStory.currentEventId];
                    thisStory.executeCurrentAction();
                }
            }
        });
    }
    Story.prototype.nextAction = function () {
        if (this.currentAction.nextEvent) {
            this.showEvent(this.currentAction.nextEvent);
        }
        else {
            this.parsingError("Can't find nextEvent at this Storyitem");
        }
    };
    //Shows event with the given eventId. If eventId is "end" nothing happens except firing optional callback function
    Story.prototype.showEvent = function (eventId, callOnFinish) {
        if (callOnFinish) {
            this.callOnFinish = callOnFinish;
        }
        if (typeof eventId == "number") {
            //Numeric event id -> Load event
            this.currentEventId = eventId;
            this.currentAction = this.actions[this.currentEventId];
            this.executeCurrentAction();
        }
        else if (eventId == "end") {
            this.hideStoryElements();
            //Call Callback function
            if (this.callOnFinish) {
                this.callOnFinish();
            }
        }
        else {
            this.parsingError("Can't show action because the id is not a number." + eventId, eventId);
        }
    };
    Story.prototype.hideStoryElements = function () {
        this.parentContainer.fadeOut();
    };
    Story.prototype.showStoryElements = function () {
        this.parentContainer.fadeIn();
    };
    Story.prototype.executeCurrentAction = function () {
        this.buttonsBox.html("");
        this.messageBox.html("");
        var gameState = GameManager.gameState;
        var myStory = this;
        switch (this.currentAction.type) {
            case "dialog":
                this.messageBox.html(this.currentAction.message);
                this.iconBox.attr("src", "data/assets/" + this.currentAction.icon + ".png");
                this.buttonsBox.html("<button class='nextButton rpgButton'>Weiter</button>");
                $(".nextButton").click(function () { return myStory.nextAction(); });
                $(document).on("keydown.nextStoryAction", function (event) {
                    if (event.key == "Enter") {
                        $(document).off("keydown.nextStoryAction");
                        myStory.nextAction();
                    }
                });
                this.showStoryElements();
                break;
            case "decision":
                this.buttonsBox.html("");
                this.messageBox.html(this.currentAction.message);
                this.iconBox.attr("src", "data/assets/" + this.currentAction.icon + ".png");
                for (var i = 0; i < this.currentAction.options.length; i++) {
                    var currentButton = $("<button class='decisionButton rpgButton' data-decision-id='" + i + "'>" + this.currentAction.options[i].message + "</button>");
                    this.buttonsBox.append(currentButton);
                }
                this.registerButtonEvents();
                this.showStoryElements();
                break;
            case "health":
                if (this.currentAction.change == "absolute") {
                    this.setHealth(this.currentAction.value);
                }
                else if (this.currentAction.change == "relative") {
                    this.setHealthRelative(this.currentAction.value);
                }
                else {
                    this.parsingError("Invalid Health change. Operation was " + this.currentAction.change);
                }
                this.nextAction();
                break;
            case "setFlag":
                gameState.flags[this.currentAction.name] = this.currentAction.value;
                this.nextAction();
                break;
            case "readFlag":
                if (gameState.flags[this.currentAction.name] === undefined) {
                    this.parsingError("Flag \"" + this.currentAction.name + "\" was not yet set. Story will fire onFalse event");
                }
                if (gameState.flags[this.currentAction.name] == true) {
                    //onTrue
                    this.showEvent(this.currentAction.onTrue);
                }
                else {
                    //onFalse
                    this.showEvent(this.currentAction.onFalse);
                }
                break;
            case "addTile":
                gameState.accessableTiles.push(this.currentAction.name);
                this.nextAction();
                break;
            case "startBattle":
                var opponent = this.currentAction.opponent;
                var onWinEvent_1 = this.currentAction.onWin;
                var onLooseEvent_1 = this.currentAction.onLoose;
                var onWin = function () { myStory.showEvent(onWinEvent_1); };
                var onLoose = function () { myStory.showEvent(onLooseEvent_1); };
                GameManager.prepareBattle(opponent, onWin, onLoose);
                break;
            case "objectState":
                var visible = this.currentAction.visible;
                var solid = this.currentAction.solid;
                var objectName = this.currentAction.name;
                var eventMap = GameManager.map.eventTriggerMap;
                for (var row in eventMap) {
                    for (var column in eventMap[row]) {
                        var eventObject = eventMap[row][column];
                        if (eventObject && eventObject.name == objectName) {
                            eventObject.visible = visible;
                            eventObject.sprite.visible = visible;
                            GameManager.map.collisionBitMap[row][column] = solid;
                        }
                    }
                }
                this.nextAction();
                break;
            default:
                this.parsingError("Not known Event: " + this.currentAction.type);
        }
    };
    Story.prototype.registerButtonEvents = function () {
        var myStory = this;
        $(".decisionButton").click(function () {
            var decisionId = $(this).attr("data-decision-id");
            var nextEvent = myStory.currentAction.options[decisionId].nextEvent;
            myStory.currentAction = myStory.actions[nextEvent];
            myStory.executeCurrentAction();
        });
    };
    Story.prototype.setHealth = function (health) {
        this.health = Math.min(100, Math.max(0, health));
        $(".healthBar").css("stroke-dasharray", this.health + " 100");
        return health;
    };
    Story.prototype.setHealthRelative = function (health) {
        return this.setHealth(this.health + health);
    };
    Story.prototype.parsingError = function (message, eventId) {
        if (!eventId) {
            eventId = this.currentEventId;
        }
        console.log("%c[Story Parsing] " + message + "   %cEvent id: " + eventId, 'color: #bf1d00', "color: #0056ba");
    };
    Story.prototype.destroy = function () {
        this.parentContainer.html("");
        this.parentContainer.hide();
    };
    Story.END = "end";
    return Story;
}());
