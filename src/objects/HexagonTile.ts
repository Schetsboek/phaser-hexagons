import Phaser from "phaser";
import Coordinates from "./Coordinates";

export default class HexagonTile {
	private coordinates: Coordinates;

	public static readonly width: number = 98;
	public static readonly widthOffset: number = 46;
	public static readonly height: number = 84;
	public static readonly heightOffset: number = 57;

	constructor(coordinates: Coordinates) {
		this.coordinates = coordinates;

		let sprite = scene.add
			.image(
				coordinates.x * HexagonTile.width + (coordinates.y % 2 === 0 ? 49 : 0),
				coordinates.y * HexagonTile.height,
				"hexagon-tile",
			)
			.setInteractive({ pixelPerfect: true });

		sprite.on("pointerdown", function (pointer: Phaser.Input.Pointer) {
			if (pointer.leftButtonDown()) {
				sprite.setRotation(sprite.rotation + Math.PI * 0.5);
			}
		});

		sprite.on("pointerover", function () {
			sprite.setTint(0xff0000);
		});

		sprite.on("pointerout", function () {
			sprite.setTint();
		});
	}
}
