import Phaser from "phaser";
import Coordinates from "../objects/Coordinates";

export default class MainCamera {
	private pointerStart?: Coordinates;
	private cameraStart: Coordinates;
	private panning: boolean;

	private mainCamera: Phaser.Cameras.Scene2D.Camera;

	constructor(mainCamera: Phaser.Cameras.Scene2D.Camera) {
		this.mainCamera = mainCamera;

		this.cameraStart = new Coordinates(mainCamera.centerX, mainCamera.centerY);
		this.panning = false;

		// Zoom handling
		scene.input.on("wheel", (pointer: Phaser.Input.Pointer) => {
			const currentZoom = this.mainCamera.zoom;
			if (pointer.deltaY > 0 && currentZoom > 0.25) {
				this.mainCamera.setZoom(currentZoom - 0.25);
			} else if (pointer.deltaY < 0 && currentZoom < 2) {
				this.mainCamera.setZoom(currentZoom + 0.25);
			}
		});

		// Pan handling
		scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
			if (!this.panning && pointer.middleButtonDown()) {
				this.pointerStart = new Coordinates(pointer.x, pointer.y);
				this.panning = true;
			}
		});
	}

	public handleUpdate(): void {
		const activePointer = scene.input.activePointer;

		if (activePointer.middleButtonDown()) {
			if (this.pointerStart) {
				// Slow when zoomed in, faster when zoomed out to keep a consistent pan speed
				const panSpeedModifier = 1 / this.mainCamera.zoom;
				this.mainCamera.centerOn(
					this.cameraStart.x + (this.pointerStart.x - activePointer.x) * panSpeedModifier,
					this.cameraStart.y + (this.pointerStart.y - activePointer.y) * panSpeedModifier,
				);
			}
		} else if (this.panning) {
			this.panning = false;
			this.cameraStart = new Coordinates(
				this.mainCamera.scrollX + this.mainCamera.centerX,
				this.mainCamera.scrollY + this.mainCamera.centerY,
			);
		}
	}
}
