const { app, BrowserWindow, dialog, ipcMain, shell } = require("electron");
const path = require("path");
const { settingsHandlers } = require("./svc/settings");
const generalHandlers = require("./svc/general");
const reportsHandlers = require("./svc/reports");
const searchHandlers = require("./svc/search");
const syncHandlers = require("./svc/sync");

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, "preload.js"), // use a preload script
    },
  });
  mainWindow.loadFile(path.join(__dirname, "public/index.html"));

  generalHandlers(mainWindow);
  reportsHandlers(mainWindow);
  settingsHandlers(mainWindow);
  syncHandlers(mainWindow);
  searchHandlers(mainWindow);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
