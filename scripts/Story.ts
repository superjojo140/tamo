class Story {

	actions: any;
	currentEventId: number;
	currentAction: any;
	health: number;
	messageBox: JQuery<HTMLElement>;
	iconBox: JQuery<HTMLElement>;
	buttonsBox: JQuery<HTMLElement>;
	parentContainer: JQuery<HTMLElement>;
	callOnFinish: Function;
	static END: string = "end";


	constructor(storyPath: string, htmlContainerId: string) {
		let thisStory = this;
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

	nextAction() {
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
	}

	hideStoryElements() {
		this.parentContainer.fadeOut();
	}

	showStoryElements() {
		this.parentContainer.fadeIn();
	}

	showAction() {
		this.showStoryElements();
		this.buttonsBox.html("");
		this.messageBox.html("");

		let gameState = GameManager.gameState;

		switch (this.currentAction.type) {
			case "dialog":
				this.messageBox.html(this.currentAction.message);
				this.iconBox.attr("src", "data/assets/" + this.currentAction.icon + ".png");
				this.buttonsBox.html("<button class='nextButton rpgButton'>Weiter</button>");
				let myStory = this;
				$(".nextButton").click(() => myStory.nextAction());
				break;
			case "decision":
				this.buttonsBox.html("");
				this.messageBox.html(this.currentAction.message);
				this.iconBox.attr("src", "data/assets/" + this.currentAction.icon + ".png");
				for (let i = 0; i < this.currentAction.options.length; i++) {
					let currentButton = $(`<button class='decisionButton rpgButton' data-decision-id='${i}'>${this.currentAction.options[i].message}</button>`);
					this.buttonsBox.append(currentButton);
				}
				this.registerButtonEvents();
				break;
			case "health":
				if (this.currentAction.change == "absolute") {
					this.setHealth(this.currentAction.value);
				} else if (this.currentAction.change == "relative") {
					this.setHealthRelative(this.currentAction.value);
				} else {
					this.parsingError(`Invalid Health change. Operation was ${this.currentAction.change}`);
				}
				this.nextAction();
				break;

			case "setFlag":
				gameState.flags[this.currentAction.name] = this.currentAction.value;
				this.nextAction();
				break;

			case "readFlag":
				if (gameState.flags[this.currentAction.name] === undefined) {
					this.parsingError(`Flag "${this.currentAction.name}" was not yet set. Story will fire onFalse event`);
				}
				if (gameState.flags[this.currentAction.name] == true){
					//onTrue
					this.currentAction.nextEvent = this.currentAction.onTrue;
				}
				else{
					//onFalse
					this.currentAction.nextEvent = this.currentAction.onFalse;
				} 
				this.nextAction();
				break;
			default:
				this.parsingError("Not known Event: " + this.currentAction.type);
		}

	}

	registerButtonEvents() {
		let myStory = this;
		$(".decisionButton").click(function () {
			let decisionId = $(this).attr("data-decision-id");
			let nextEvent = myStory.currentAction.options[decisionId].nextEvent;
			myStory.currentAction = myStory.actions[nextEvent];
			myStory.showAction();
		});
	}

	setHealth(health: number) {
		this.health = Math.min(100, Math.max(0, health));
		$(".healthBar").css("stroke-dasharray", `${this.health} 100`);
		return health;
	}

	setHealthRelative(health: number) {
		return this.setHealth(this.health + health);
	}

	showEvent(eventId: number, callOnFinish?: Function) {
		this.currentEventId = eventId;
		this.currentAction = this.actions[this.currentEventId];
		this.callOnFinish = callOnFinish;
		this.showAction();
	}

	parsingError(message: string, eventId?: number) {
		if (!eventId) {
			eventId = this.currentEventId;
		}
		console.log(`%c[Story Parsing] ${message}   %cEvent id: ${eventId}`, 'color: #bf1d00', "color: #0056ba");
	}

	destroy() {
		this.parentContainer.html("");
		this.parentContainer.hide();
	}

}
