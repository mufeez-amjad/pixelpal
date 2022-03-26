import { Tray, nativeImage, NativeImage } from 'electron';
import path from 'path';

const ICON_WIDTH = 26;
const ICON_HEIGHT = 20;

class AppTray extends Tray {
	pressed = false;
	constructor() {
		const standard = nativeImage.createFromPath(
			path.join(__dirname, '../../assets/icon-standard.png')
		);
		const pressed = nativeImage.createFromPath(
			path.join(__dirname, '../../assets/icon-pressed.png')
		);
		super(standard.resize({ width: ICON_WIDTH, height: ICON_HEIGHT }));

		this.addListener('click', () => {
			this.pressed = !this.pressed;
			const img = this.pressed ? pressed : standard;
			this.setImage(img.resize({ width: ICON_WIDTH, height: ICON_HEIGHT }));
		});
	}
}

export default AppTray;
