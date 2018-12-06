const intro = {
	information: {
		health: 100
	},
	variables: {},
	actions: {
		0: {
			type: "dialog",
			nextEvent: 1,
			message: "Hallo Königin, ich bin Aris ein tapferer Kämpfer aus dem Land der Patrobier. Man sagte mir, hier wird Hilfe gebraucht...",
			icon: "hero"
		},
		1: {
			type: "dialog",
			nextEvent: 2,
			message: "Aris, es ist gut dass du da bist. Sei willkommen. Für wahr, wir brauchen deine Hilfe. Ich habe einen Auftrag für dich.",
			icon: "woman"
		},
		2: {
			type: "dialog",
			nextEvent: 3,
			message: "Erzählt mir mehr. Es wird mir eine ehrenvolle Aufgabe sein euch zu dienen.",
			icon: "hero"
		},
		3: {
			type: "dialog",
			nextEvent: 4,
			message: "Unser Land hat ein Problem. Die Tamos greifen immer häufiger uns Menschen an...",
			icon: "woman"
		},
		4: {
			type: "dialog",
			nextEvent: 5,
			message: "Was sind Tamos? Diese Wesen sind mir nicht bekannt. Ich komme aus dem Land das weit hinter den silbernen Bergen liegt. Ich kenne sie nicht!",
			icon: "hero"
		},
		5: {
			type: "dialog",
			nextEvent: 6,
			message: "Die Tamos sind kleine Wesen. Es gibt sie in allen nur vorstellbaren Formen und Farben. Wir lebten jahrhundertelang in Frieden mit Ihnen. Doch seit einiger Zeit hört man immer öfter von wilden Horden von Tamos, die unsere Dörfer überfallen und alles klauen, was ihnen in die Hände fällt.",
			icon: "woman"
		},
		6: {
			type: "dialog",
			nextEvent: 7,
			message: "Wo soll ich mit meiner Suche nach dem Geheimnis beginnen?",
			icon: "hero"
		},
		7: {
			type: "dialog",
			nextEvent: 8,
			message: "Geh nach Uttelfeld. In diesem kleinen Dorf lebt der alte Krador. Er ist einer der ältesten Forscher unseres Landes. Er kann dir noch einiges mehr über die Tamos berichten",
			icon: "woman"
		},
		8: {
			type: "decision",
			message: "Was möchtest du tun?",
			icon: "woman",
			options: [{
					message: "Gehe nach Uttelfeld",
					nextEvent: 100
      },
				{
					message: "Stärke dich zunächst",
					nextEvent: 101
        }
        ]
		},
		100: {
			type : "health",
			change: "relative",
			value: -10,
			nextEvent: 10
		},
		101: {
			type : "health",
			change: "relative",
			value: 10,
			nextEvent: 9
		},
		9: {
			type: "dialog",
			nextEvent: 0,
			message: "Du stärkst dich im Gasthaus",
			icon: "hero"

		},
		10: {
			type: "dialog",
			nextEvent: 0,
			message: "Du gehst direkt nach Uttelfeld, dies schwächt dich",
			icon: "hero"
		},
		11: {
			type: "dialog",
			nextEvent: 1,
			message: "Di bist fertig ;-)",
			icon: "hero"
		}
	}
};
