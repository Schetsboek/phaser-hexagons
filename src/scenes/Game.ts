import Phaser from "phaser";
import Coordinates from "../types/Coordinates";
import HexagonTile from "../objects/HexagonTile";
import MainCamera from "../objects/MainCamera";
import Token from "../objects/Token";
import SquareShadowTile from "../objects/SquareShadowTile";
import { Position } from "../enumerations/Position";
import RectangleShadowTile from "../objects/RectangleShadowTile";
import { Mrpas } from "mrpas";
import ShadowTile from "../objects/ShadowTile";
import { ObjectSet } from "../objects/ObjectSet";

declare global {
	var scene: Phaser.Scene;
}

export default class Hexagons extends Phaser.Scene {
	private mainCamera?: MainCamera;
	private tiles: Map<Coordinates, HexagonTile>;
	private shadowTiles: ShadowTile[][];
	private map: number[][];
	private fov?: Mrpas;

	constructor() {
		super("GameScene");
		globalThis.scene = this;
		this.tiles = new Map<Coordinates, HexagonTile>();
		this.shadowTiles = [[]];
		this.map = [
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		];
	}

	preload() {
		this.load.image("hexagon-tile", "assets/hexagon-tile.png");
		this.load.image("mrpas-square", "assets/mrpas-square.png");
		this.load.image("mrpas-square-wall", "assets/mrpas-square-wall.png");
		this.load.image("mrpas-rectangle", "assets/mrpas-rectangle.png");
		this.load.image("mrpas-rectangle-wall", "assets/mrpas-rectangle-wall.png");
		this.load.image("medium-token", "assets/medium-token.png");
	}

	create() {
		// this.input.mouse.disableContextMenu();
		this.mainCamera = new MainCamera(this.cameras.main);

		// const verticalHexagonTileCount = (document.body.clientHeight + HexagonTile.heightOffset) / HexagonTile.height;
		// const horizontalHexagonTileCount = (document.body.clientWidth + HexagonTile.widthOffset) / HexagonTile.width;
		const verticalHexagonTileCount = this.map.length / 2;
		const horizontalHexagonTileCount = this.map[0].length / 2;

		for (let y = 0; y < verticalHexagonTileCount; y++) {
			for (let x = 0; x < horizontalHexagonTileCount; x++) {
				const shadowXOffset = y % 2 !== 0 ? 1 : 0;
				const xLeft = x * 2 - shadowXOffset;
				const xRight = x * 2 + 1 - shadowXOffset;

				let rectangleRight;
				let rectangleLeft;
				let squareRight;
				let squareLeft;

				if (!(y % 2 !== 0 && x === 0)) {
					if (!this.shadowTiles[xLeft]) {
						this.shadowTiles[xLeft] = [];
					}
					rectangleLeft = new RectangleShadowTile(
						new Coordinates(x, y),
						Position.Left,
						new Coordinates(xLeft, y * 2),
						this.map[y * 2][xLeft],
					);
					squareLeft = new SquareShadowTile(
						new Coordinates(x, y),
						Position.Left,
						new Coordinates(xLeft, y * 2 + 1),
						this.map[y * 2 + 1][xLeft],
					);
					this.shadowTiles[xLeft][y * 2] = rectangleLeft;
					this.shadowTiles[xLeft][y * 2 + 1] = squareLeft;
				}
				if (!this.shadowTiles[xRight]) {
					this.shadowTiles[xRight] = [];
				}
				console.log(xLeft);
				rectangleRight = new RectangleShadowTile(
					new Coordinates(x, y),
					Position.Right,
					new Coordinates(xRight, y * 2),
					this.map[y * 2][xRight],
				);
				squareRight = new SquareShadowTile(
					new Coordinates(x, y),
					Position.Right,
					new Coordinates(xRight, y * 2 + 1),
					this.map[y * 2 + 1][xRight],
				);
				this.shadowTiles[xRight][y * 2] = rectangleRight;
				this.shadowTiles[xRight][y * 2 + 1] = squareRight;

				const coordinates = new Coordinates(x, y);

				const objects = new Map<Position, ObjectSet>();
				objects.set(Position.Left, { rectangle: rectangleLeft, square: squareLeft });
				objects.set(Position.Right, { rectangle: rectangleRight, square: squareRight });

				this.tiles.set(coordinates, new HexagonTile(coordinates, objects));
			}
		}

		new Token(new Coordinates(4, 4));

		// this.fov = new Mrpas(
		// 	Math.ceil(horizontalHexagonTileCount) * 2 - 1,
		// 	Math.ceil(verticalHexagonTileCount) * 2,
		// 	(x, y) => {
		// 		const tile = this.shadowTiles[x][y];
		// 		return tile && tile.getIsTransparent();
		// 	},
		// );

		// const lightRenders: Coordinates[] = [
		// 	new Coordinates(8, 8),
		// 	new Coordinates(9, 8),
		// 	new Coordinates(2, 2),
		// 	new Coordinates(3, 2),
		// ];
		// for (let i = 0; i < lightRenders.length; i++) {
		// 	this.fov.compute(
		// 		lightRenders[i].x,
		// 		lightRenders[i].y,
		// 		10,
		// 		(x, y) => {
		// 			const tile = this.shadowTiles[x][y];
		// 			return tile && tile.getVisibility();
		// 		},
		// 		(x, y) => {
		// 			const tile = this.shadowTiles[x][y];
		// 			tile.setVisibility(true);
		// 		},
		// 	);
		// }
	}

	update(time: number, delta: number): void {
		this.mainCamera?.handleUpdate();
	}
}
