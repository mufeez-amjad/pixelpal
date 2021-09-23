import { app } from 'electron';

import AppTray from './tray';
import AppWindow from './window';

require('@electron/remote/main').initialize();

/* eslint-disable no-unused-vars */
let window: AppWindow;
let tray: AppTray;
/* eslint-disable no-unused-vars */

function init() {
    tray = new AppTray();
    window = new AppWindow({ tray });

    // window.hide()
}

app.whenReady().then(() => {
    init();
    if (app.dock) {
        app.dock.hide();
    }
});
