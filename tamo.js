$("body").keyup((event) => {
  if (event.key == "Enter") {
    enterPressed();
  }
});

const currentStory = new Story(intro,"messageContainer");

function enterPressed(){
  currentStory.nextAction();
}
