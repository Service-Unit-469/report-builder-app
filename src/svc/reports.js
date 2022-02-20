const { ipcMain } = require("electron");
const fs = require("fs");
const log = require("../log")();

const {
  CURRENT_YEAR_FILE,
  NEXT_YEAR_FILE,
  LAST_YEAR_FILE,
  TROOPS_FILE,
} = require("../constants");

function readData(file) {
  return JSON.parse(fs.readFileSync(file));
}

module.exports = function (mainWindow) {
  ipcMain.on("reports/run", (event, report) => {
    log.info(`Running report: ${report.name}`);
    try {
      log.info("Loading context...");
      const context = {
        current_year: readData(CURRENT_YEAR_FILE),
        last_year: readData(LAST_YEAR_FILE),
        next_year: readData(NEXT_YEAR_FILE),
        troops: readData(TROOPS_FILE),
      };
      if (report.ref) {
        log.info("Running default report...");
        const reportexec = require(`./${report.ref}`);
        mainWindow.webContents.send("reports/results", {
          success: true,
          message: `Report ${report.name} run successfully!`,
          data: reportexec(context),
        });
      }
      log.info("Report run successfully!");
    } catch (e) {
      log.error(`Failed to run report: ${report.name}`, e);

      mainWindow.webContents.send("reports/results", {
        success: false,
        message: `Failed to run report ${report.name} due to exception: ${e.message}`,
      });
    }
  });
};
