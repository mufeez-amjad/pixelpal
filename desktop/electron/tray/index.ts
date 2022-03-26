import { Tray, nativeImage } from 'electron';
import path from 'path';

const ICON_WIDTH = 26;
const ICON_HEIGHT = 20;

const standard = nativeImage.createFromPath(
	path.join(__dirname, '../../assets/icon-standard.png')
);
const pressed = nativeImage.createFromPath(
	path.join(__dirname, '../../assets/icon-pressed.png')
);
class AppTray extends Tray {
	pressed = false;
	constructor() {
		super(standard.resize({ width: ICON_WIDTH, height: ICON_HEIGHT }));
		this.addListener('click', () => {
			this.setPressed(!this.pressed);
		});
	}

	setPressed = (val: boolean) => {
		this.pressed = val;
		const img = this.pressed ? pressed : standard;
		this.setImage(img.resize({ width: ICON_WIDTH, height: ICON_HEIGHT }));
	};
}

export default AppTray;
