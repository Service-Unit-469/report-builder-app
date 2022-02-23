const { app, BrowserWindow } = require("electron");
const windowStateKeeper = require("electron-window-state");
const path = require("path");
const { settingsHandlers } = require("./svc/settings");
const generalHandlers = require("./svc/general");
const { registerHome } = require("./svc/home");
const reportsHandlers = require("./svc/reports");
const searchHandlers = require("./svc/search");
const syncHandlers = require("./svc/sync");
const troopsHandlers = require("./svc/troops");

app.on("ready", () => {
  const mainWindowState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 800,
  });
  const mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    webPreferences: {
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, "preload.js"), // use a preload script
    },
  });
  mainWindowState.manage(mainWindow);
  mainWindow.loadFile(path.join(__dirname, "public/index.html"));

  generalHandlers(mainWindow);
  registerHome(mainWindow);
  reportsHandlers(mainWindow);
  settingsHandlers(mainWindow);
  syncHandlers(mainWindow);
  searchHandlers(mainWindow);
  troopsHandlers(mainWindow);
});

app.on("window-all-closed", () => {
  app.quit();
});
