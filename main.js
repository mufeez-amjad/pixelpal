const { app, BrowserWindow, Tray, screen, nativeImage } = require('electron');
const path = require('path');
let window, tray;

//defaults
let width = 500;
let height = 300;

function init() {
  const image = nativeImage.createFromPath(
    path.join(__dirname, "./corgi.png")
  );
  tray = new Tray(image.resize({ width: 32, height: 32 }));
  createWindow();

  tray.on("click", function(event) {
    toggleWindow();
  });

  setWindowAutoHide();
  alignWindow();
}

function createWindow(windowUrl) {
  window = undefined;

  window = new BrowserWindow({
    width: width,
    height: height,
    // maxWidth: width,
    // maxHeight: height,
    show: true,
    frame: false,
    fullscreenable: false,
    resizable: false,
    useContentSize: true,
    transparent: false,
    alwaysOnTop: true,
    webPreferences: {
      backgroundThrottling: false
    }
  });
  window.setMenu(null);

  setWindowUrl('https://www.google.com');

  return window;
}

function setWindowUrl(windowUrl) {
  window.loadURL(windowUrl);
}

function setWindowAutoHide() {
  window.hide();
  window.on("blur", () => {
    if (!window.webContents.isDevToolsOpened()) {
      window.hide();
    }
  });
  window.on("close", function(event) {
    event.preventDefault();
    window.hide();
  });
}

function toggleWindow() {
  if (window.isVisible()) {
    window.hide();
    return;
  }

  showWindow();
}

function alignWindow() {
  const position = calculateWindowPosition();
  window.setBounds({
    width: width,
    height: height,
    x: position.x,
    y: position.y
  });
}

function showWindow() {
  alignWindow();
  window.show();
}

app.whenReady().then(() => {
  init();
  // if (app.dock) {
  //   app.dock.hide();
  // }
})

function calculateWindowPosition() {
  const screenBounds = screen.getPrimaryDisplay().size;
  const trayBounds = tray.getBounds();

  return {x: trayBounds.x - width + trayBounds.width, y: 0}
}