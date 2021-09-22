const {app, nativeImage, Tray, Menu, BrowserWindow} = require("electron");

let top = {};

app.once("ready", ev => {
    top.win = new BrowserWindow({
        width: 800, height: 600, center: true, minimizable: false, show: false,
        webPreferences: {
            nodeIntegration: false,
            webSecurity: true,
            sandbox: true,
            nativeWindowOpen: true,
        },                                
    })
    top.win.loadURL("https://google.com/");
    top.win.on("close", ev => {
        //console.log(ev);
        ev.sender.hide();
        ev.preventDefault(); // prevent quit process
    });

    // empty image as transparent icon: it can click
    // see: https://electron.atom.io/docs/api/tray/
    top.tray = new Tray(nativeImage.createEmpty());
    const menu = Menu.buildFromTemplate([
        {label: "Actions", submenu: [
            {label: "Open Google", click: (item, window, event) => {
                //console.log(item, event);
                top.win.show();
            }},
        ]},
        {type: "separator"},
        {role: "quit"}, // "role": system prepared action menu
    ]);
    top.tray.setToolTip("hello electron");
    top.tray.setTitle("Tray Example"); // macOS only
    top.tray.setContextMenu(menu);

    // Option: some animated web site to tray icon image
    // see: https://electron.atom.io/docs/tutorial/offscreen-rendering/
    top.icons = new BrowserWindow({
        show: false, webPreferences: {offscreen: true}});
    top.icons.loadURL("https://trends.google.com/trends/hottrends/visualize");
    top.icons.webContents.on("paint", (event, dirty, image) => {
        if (top && top.tray) top.tray.setImage(image.resize({width: 16, height: 16}));
    });
});
app.on("before-quit", ev => {
    // BrowserWindow "close" event spawn after quit operation,
    // it requires to clean up listeners for "close" event
    top.win.removeAllListeners("close");
    // release windows
    top = null;
});