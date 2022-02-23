const { ipcMain } = require("electron");
const {
  CURRENT_YEAR_FILE,
  NEXT_YEAR_FILE,
  LAST_YEAR_FILE,
} = require("../constants");
const { filter } = require("@service-unit-469/report-builder/src/filter");
const fs = require("fs");

function uniqueTroopCount(records) {
  const troops = new Set();
  records
    .map((r) => r["Troop/Group"])
    .filter((t) => t.indexOf("Troop") !== -1)
    .forEach((t) => troops.add(t));
  return troops.size;
}

function updateStats(mainWindow) {
  let current = [];
  let other = [];
  let otherTitle;
  if (fs.existsSync(CURRENT_YEAR_FILE)) {
    current = JSON.parse(fs.readFileSync(CURRENT_YEAR_FILE));

    other = JSON.parse(fs.readFileSync(NEXT_YEAR_FILE));
    if (other.length > 0) {
      otherTitle = "Next Year";
    } else {
      other = JSON.parse(fs.readFileSync(LAST_YEAR_FILE));
      otherTitle = "Last Year";
    }
  }
  mainWindow.webContents.send("home/stats", {
    current: {
      girls: filter(current, 'Troop_Group ~= "Troop" and Role_Name == "Girl"')
        .length,
      adults: filter(current, 'Troop_Group ~= "Troop" and Role_Name != "Girl"')
        .length,
      troops: uniqueTroopCount(current),
    },
    other: {
      girls: filter(other, 'Troop_Group ~= "Troop" and Role_Name == "Girl"')
        .length,
      adults: filter(other, 'Troop_Group ~= "Troop" and Role_Name != "Girl"')
        .length,
      troops: uniqueTroopCount(other),
    },
    otherTitle,
  });
}
module.exports.updateStats = updateStats;

function registerHome(mainWindow) {
  ipcMain.on("home/getstats", () => {
    updateStats(mainWindow);
  });
}

module.exports.registerHome = registerHome;
