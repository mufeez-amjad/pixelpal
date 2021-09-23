import { Tray, nativeImage } from 'electron';
import path from 'path';

const ICON_WIDTH = 32;
const ICON_HEIGHT = 32;

class AppTray extends Tray {
    constructor() {
        const image = nativeImage.createFromPath(
            path.join(__dirname, '../../assets/icon.png')
        );
        super(image.resize({ width: ICON_WIDTH, height: ICON_HEIGHT }));
    }
}

export default AppTray;
