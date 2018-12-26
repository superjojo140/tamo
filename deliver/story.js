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
                    thisStory.showAction();
                }
            }
        });
    }
    Story.prototype.nextAction = function () {
        if (this.currentAction.nextEvent != Story.END && this.currentAction.nextEvent) {
            this.currentEventId = this.currentAction.nextEvent;
            this.currentAction = this.actions[this.currentEventId];
            this.showAction();
        }
        else {
            this.hideStoryElements();
            //Call Callback function
            if (this.callOnFinish) {
                this.callOnFinish();
            }
        }
    };
    Story.prototype.hideStoryElements = function () {
        this.parentContainer.fadeOut();
    };
    Story.prototype.showStoryElements = function () {
        this.parentContainer.fadeIn();
    };
    Story.prototype.showAction = function () {
        this.showStoryElements();
        this.buttonsBox.html("");
        this.messageBox.html("");
        switch (this.currentAction.type) {
            case "dialog":
                this.messageBox.html(this.currentAction.message);
                this.iconBox.attr("src", "data/assets/" + this.currentAction.icon + ".png");
                this.buttonsBox.html("<button class='nextButton'>Weiter</button>");
                var myStory_1 = this;
                $(".nextButton").click(function () { return myStory_1.nextAction(); });
                break;
            case "decision":
                this.buttonsBox.html("");
                this.messageBox.html(this.currentAction.message);
                this.iconBox.attr("src", "data/assets/" + this.currentAction.icon + ".png");
                for (var i = 0; i < this.currentAction.options.length; i++) {
                    var currentButton = $("<button class='decisionButton' data-decision-id='" + i + "'>" + this.currentAction.options[i].message + "</button>");
                    this.buttonsBox.append(currentButton);
                }
                this.registerButtonEvents();
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
            myStory.showAction();
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
    Story.prototype.showEvent = function (eventId, callOnFinish) {
        this.currentEventId = eventId;
        this.currentAction = this.actions[this.currentEventId];
        this.callOnFinish = callOnFinish;
        this.showAction();
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
