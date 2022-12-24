export default class ShadowTile {
	protected isTransparent: boolean;
	protected group?: Phaser.GameObjects.Group;
	private visibility: boolean;

	constructor(isTransparent: boolean) {
		this.isTransparent = isTransparent;
		this.visibility = false;
	}

	public getIsTransparent(): boolean {
		return this.isTransparent;
	}

	public setVisibility(visibility: boolean): void {
		if (this.visibility && !visibility) {
			this.group?.setAlpha(0.5);
		} else if (visibility) {
			this.group?.setVisible(true);
		}
		this.visibility = visibility;
	}

	public getVisibility(): boolean {
		return this.visibility;
	}
}
