import Phaser from "phaser";

export default {
	type: Phaser.AUTO,
	parent: "game",
	antialias: true,
	scale: {
		mode: Phaser.Scale.RESIZE,
	},
};
