import Phaser from "phaser";
import Coordinates from "../types/Coordinates";
import HexagonTile from "../objects/HexagonTile";
import MainCamera from "../objects/MainCamera";

declare global {
	var scene: Phaser.Scene;
}

export default class Hexagons extends Phaser.Scene {
	private mainCamera?: MainCamera;
	private tiles: Map<Coordinates, HexagonTile>;

	constructor() {
		super("GameScene");
		globalThis.scene = this;
		this.tiles = new Map<Coordinates, HexagonTile>();
	}

	preload() {
		this.load.image("hexagon-tile", "assets/hexagon-tile.png");
	}

	create() {
		this.input.mouse.disableContextMenu();
		this.mainCamera = new MainCamera(this.cameras.main);

		const verticalHexagonTileCount = (document.body.clientHeight + HexagonTile.heightOffset) / HexagonTile.height;
		const horizontalHexagonTileCount = (document.body.clientWidth + HexagonTile.widthOffset) / HexagonTile.width;

		for (let y = 0; y < verticalHexagonTileCount; y++) {
			for (let x = 0; x < horizontalHexagonTileCount; x++) {
				const coordinates = new Coordinates(x, y);
				this.tiles.set(coordinates, new HexagonTile(coordinates));
			}
		}
	}

	update(time: number, delta: number): void {
		this.mainCamera?.handleUpdate();
	}
}
