const { app, dialog, ipcMain, shell } = require("electron");
const fs = require("fs");
const path = require("path");
const csvStringifier = require("csv-writer").createObjectCsvStringifier;
const log = require("../log")();

module.exports = function (mainWindow, browserWindow) {
  ipcMain.on("general/open", (event, url) => {
    shell.openExternal(url);
  });

  ipcMain.on("general/save", (event, req) => {
    const { data, suggest } = req;
    const file = dialog.showSaveDialogSync(browserWindow, {
      defaultPath: suggest,
      properties: ["createDirectory"],
    });
    log.info(`File selected: ${file}`);
    if (file) {
      try {
        log.info(`Creating parent directory of: ${file}`);
        fs.mkdirSync(path.dirname(file), { recursive: true });

        log.info("Writing data to file...");
        const stringifier = csvStringifier({
          header: Object.keys(data[0]).map((k) => {
            return {
              id: k,
              title: k,
            };
          }),
        });
        fs.writeFileSync(
          file,
          stringifier.getHeaderString() + stringifier.stringifyRecords(data)
        );
        log.info("File saved successfully!");
        dialog.showMessageBox(browserWindow, {
          message: "File saved successfully!",
        });
      } catch (e) {
        log.error(`Failed to save to file: ${file}`, e);
        dialog.showErrorBox(
          "Failed to save file!",
          `Failed to save to ${file} due to exception: ${e.message}`
        );
      }
    }
  });
  ipcMain.on("general/getversion", (event, url) => {
    mainWindow.webContents.send("general/version", app.getVersion());
  });
};
