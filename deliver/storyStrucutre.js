 const storyName = {
 	info: {
 		name: "Titel"
 	},
 	variables: {
		name : value
	},
 	actions: {
 		0: {
 			type: "dialog",
 			nextEvent: 1,
 			message: "Dies ist eine Nachricht",
 			icon: "hero" //==> /assets/hero.png
 		},

 		1: {
 			type: "decision",
 			message: "Was möchtest du tun?",
 			icon: "woman",
 			options: [
 				{
 					message: "Gehe nach Uttelfeld",
 					nextEvent: 10
      			},
 				{
 					message: "Stärke dich zunächst",
 					nextEvent: 9
        		}
        			]
 		},
		
		3: {
			type : "health",
			change: "relative|absolute",
			value: 0-100,
			nextEvent: 5
		}
 
 	}
 };
