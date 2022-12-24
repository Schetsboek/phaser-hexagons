import Phaser from "phaser";
import Coordinates from "../types/Coordinates";
import HexagonTile from "./HexagonTile";

export default class Token {
	private coordinates: Coordinates;
	private center: Coordinates;

	public static readonly width: number = 62;
	public static readonly widthOffset: number = 31;
	public static readonly height: number = 62;
	public static readonly heightOffset: number = 31;

	constructor(coordinates: Coordinates) {
		this.coordinates = coordinates;

		const isEven = coordinates.y % 2 === 0;

		this.center = new Phaser.Math.Vector2(
			coordinates.x * HexagonTile.width + (isEven ? 42 : 0),
			coordinates.y * HexagonTile.height,
		);

		const group = scene.add.group();
		group.setXY(this.center.x, this.center.y);

		let image = scene.add
			.image(this.center.x, this.center.y, "medium-token")
			.setDepth(2)
			.setInteractive({ pixelPerfect: true });

		image.on("pointerdown", function (pointer: Phaser.Input.Pointer) {
			if (pointer.leftButtonDown()) {
				image.setRotation(image.rotation + Math.PI * 0.5);
			}
		});

		image.on("pointerover", function () {
			image.setTint(0xff0000);
		});

		image.on("pointerout", function () {
			image.setTint();
		});
	}
}
