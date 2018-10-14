class Story {
  constructor(story, htmlContainerId) {
    this.actions = story.actions;
    this.currentAction = this.actions[0];

    this.messageBox = $("<div id='messageBox'></div>");
    $("#" + htmlContainerId).html(this.messageBox);

    this.iconBox = $("<img id='iconBox' height='100%'>");
    $("#" + htmlContainerId).prepend(this.iconBox);

    this.buttonsBox = $("<div id='buttonsBox'></div>");
    $("#" + htmlContainerId).append(this.buttonsBox);



    this.showAction();
  }

  nextAction() {
    this.currentAction = this.actions[this.currentAction.nextEvent];
    this.showAction();

  }

  showAction() {
    
    this.buttonsBox.html("");
    this.messageBox.html("");
    
    switch (this.currentAction.type) {
      case "dialog":
        this.messageBox.html(this.currentAction.message);
        this.iconBox.attr("src", "assets/" + this.currentAction.icon + ".png");
        this.buttonsBox.html("<button class='nextButton'>Weiter</button>");
        let myStory = this;
        $(".nextButton").click(()=>myStory.nextAction());
        break;
      case "decision":
        this.buttonsBox.html("");
        this.messageBox.html(this.currentAction.message);
        this.iconBox.attr("src", "assets/" + this.currentAction.icon + ".png");
        for (let i = 0; i < this.currentAction.options.length; i++) {
          let currentButton = $(`<button class='decisionButton' data-decision-id='${i}'>${this.currentAction.options[i].message}</button>`);
          this.buttonsBox.append(currentButton);
        }
        this.registerButtonEvents();
        break;
      default:
        console.log("Not known Event: " + this.currentAction.type);
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

}
