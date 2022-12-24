import Phaser from "phaser";
import { Position } from "../enumerations/Position";
import Coordinates from "../types/Coordinates";
import { ObjectSet } from "./ObjectSet";

export default class HexagonTile {
	private coordinates: Coordinates;
	private center: Coordinates;

	public static readonly width: number = 84;
	public static readonly widthOffset: number = 42;
	public static readonly height: number = 71;
	public static readonly heightOffset: number = 48.5;

	private objects: Map<Position, ObjectSet>;

	constructor(coordinates: Coordinates, objects: Map<Position, ObjectSet>) {
		this.coordinates = coordinates;
		this.objects = objects;

		const isEven = coordinates.y % 2 === 0;

		this.center = new Phaser.Math.Vector2(
			coordinates.x * HexagonTile.width + (isEven ? HexagonTile.widthOffset : 0),
			coordinates.y * HexagonTile.height,
		);

		const group = scene.add.group();
		group.setXY(this.center.x, this.center.y);

		let image = group.create(this.center.x, this.center.y, "hexagon-tile").setInteractive({ pixelPerfect: true });

		image.on("pointerdown", function (pointer: Phaser.Input.Pointer) {
			if (pointer.leftButtonDown()) {
				image.setRotation(image.rotation + Math.PI * 0.5);
			}
		});
	}

	public getObjects(): Readonly<Map<Position, ObjectSet>> {
		return this.objects;
	}
}
