const { ipcMain } = require("electron");
const {
  CURRENT_YEAR_FILE,
  TROOPS_FILE,
  TROOP_FIELDS_FILE,
} = require("../constants");
const { filter } = require("@service-unit-469/report-builder/src/filter");
const fs = require("fs");

function getFields() {
  if (fs.existsSync(TROOP_FIELDS_FILE)) {
    return JSON.parse(fs.readFileSync(TROOP_FIELDS_FILE));
  }
  return {};
}

function getTroops(mainWindow, query) {
  let troops = [];
  if (fs.existsSync(TROOPS_FILE)) {
    troops = JSON.parse(fs.readFileSync(TROOPS_FILE));
    if (query) {
      troops = filter(troops, query);
    }
    troops.forEach((troop) => {
      troop.leaders = {};
      filter(
        JSON.parse(fs.readFileSync(CURRENT_YEAR_FILE)),
        `Troop_Group == "${troop["Troop/Group"]}" and Participation_Type == "Job Assignment"`
      ).forEach((l) => {
        const role = l["Role Name"].toLowerCase();
        if (!troop.leaders[role]) {
          troop.leaders[role] = [];
        }
        troop.leaders[role].push(l);
      });
    });
  }
  mainWindow.webContents.send("troops/troops", troops);
}

module.exports = function (mainWindow) {
  ipcMain.on("troops/gettroops", (event, query) => {
    getTroops(mainWindow, query);
  });
  ipcMain.on("troops/getfields", () => {
    mainWindow.webContents.send("troops/fields", getFields());
  });
};
