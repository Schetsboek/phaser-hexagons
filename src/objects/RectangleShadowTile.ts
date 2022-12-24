import Phaser from "phaser";
import { Position } from "../enumerations/Position";
import Coordinates from "../types/Coordinates";
import HexagonTile from "./HexagonTile";
import ShadowTile from "./ShadowTile";

export default class RectangleShadowTile extends ShadowTile {
	private coordinates: Coordinates;
	private center: Coordinates;

	public static readonly width: number = 42;
	public static readonly height: number = 31;

	constructor(coordinates: Coordinates, position: Position, shadowCoords: Coordinates, type: number) {
		super(type === 0);

		this.coordinates = coordinates;

		const isEven = coordinates.y % 2 === 0;

		this.center = new Phaser.Math.Vector2(
			coordinates.x * HexagonTile.width + (isEven ? HexagonTile.widthOffset : 0),
			coordinates.y * HexagonTile.height,
		);

		this.group = scene.add.group();
		this.group.setXY(this.center.x, this.center.y);

		const texture = this.isTransparent ? "mrpas-rectangle" : "mrpas-rectangle-wall";

		const xOffset = position === Position.Left ? -21 : 21;
		const any = this.group
			.create(this.center.x + xOffset, this.center.y, texture)
			.setDepth(1)
			.setInteractive({ pixelPerfect: true });

		// this.group.setVisible(false);

		any.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
			if (pointer.leftButtonDown()) {
				alert(`${shadowCoords.x} & ${shadowCoords.y} and transparent = ${this.isTransparent}`);
			}
		});
	}
}
