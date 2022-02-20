const { ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");
const keytar = require("keytar");

const { APP_FILES_ROOT, LOG_FILE } = require("../constants");

const settingsFile = path.join(APP_FILES_ROOT, "settings.json");

function isDebug() {
  return loadSettings().debugEnabled;
}

function loadSettings() {
  let settings = {
    looker: {
      troopDetailsId: 1074,
      fullRosterId: 1077,
    },
  };
  if (fs.existsSync(settingsFile)) {
    settings = JSON.parse(fs.readFileSync(settingsFile));
  }
  settings.logPath = LOG_FILE;
  return settings;
}

async function getSettings() {
  const settings = loadSettings();
  settings.looker.password = await keytar.getPassword(
    "@service-unit-469/report-builder-ui",
    "looker"
  );
  return settings;
}

function settingsHandlers(mainWindow) {
  ipcMain.on("settings/getsettings", async () => {
    mainWindow.webContents.send("settings/settings", await getSettings());
  });
  ipcMain.on("settings/putsettings", async (event, settings) => {
    const log = require("../log")();
    try {
      if (!fs.existsSync(path.dirname(settingsFile))) {
        log.info("Creating parent folder...");
        fs.mkdirSync(path.dirname(settingsFile), { recursive: true });
      }
      if (settings.looker.password) {
        await keytar.setPassword(
          "@service-unit-469/report-builder-ui",
          "looker",
          settings.looker.password
        );
        delete settings.looker.password;
      }
      log.info("Saving settings...");
      fs.writeFileSync(settingsFile, JSON.stringify(settings));
      mainWindow.webContents.send("settings/set", {
        message: "Settings saved successfully!",
        success: true,
      });
      log.info("Settings saved successfully!");
    } catch (e) {
      log.error("Failed to save settings", e);
      mainWindow.webContents.send("settings/set", {
        message: `Failed to save settings: ${e.message}`,
        success: false,
      });
    }
  });
}
module.exports = {
  getSettings,
  isDebug,
  settingsHandlers,
};
