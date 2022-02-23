const { app, ipcMain } = require("electron");
const filesize = require("filesize");
const fs = require("fs");
const path = require("path");
const LookerDownloader = require("@service-unit-469/looker-downloader");
const {
  APP_FILES_ROOT,
  DOWNLOAD_FOLDER,
  FIELDS_FILE,
} = require("../constants");
const { getSettings } = require("./settings");
const log = require("../log")();
const os = require("os");
const convert = require("@service-unit-469/report-builder/src/converter");

// set the path to the downloaded chromium
const chromiumPath = path.join(APP_FILES_ROOT, "chromium");
const appversion = path.join(APP_FILES_ROOT, "appversion");
process.env.PUPPETEER_DOWNLOAD_PATH = chromiumPath;
function downloadChromium() {
  fs.mkdirSync(chromiumPath, { recursive: true });
  const puppeteer_install = require("puppeteer/lib/cjs/puppeteer/node/install.js");
  puppeteer_install
    .downloadBrowser()
    .then(() => {
      log.info("Chromium downloaded successfully!");
    })
    .catch((err) => log.error("Failed to download chromium", err));
}

if (!fs.existsSync(chromiumPath) || !fs.existsSync(appversion)) {
  log.info("Downloading chromium...");
  downloadChromium();
  fs.writeFileSync(appversion, app.getVersion());
} else if (fs.readFileSync(appversion).toString() !== app.getVersion()) {
  log.info("Downloading latest chromium...");
  fs.rmSync(chromiumPath, { recursive: true });
  downloadChromium();
  fs.writeFileSync(appversion, app.getVersion());
} else {
  log.info("Skipping chromium download");
}

if (!fs.existsSync(DOWNLOAD_FOLDER)) {
  fs.mkdirSync(DOWNLOAD_FOLDER, { recursive: true });
}
function getDownloads() {
  const downloads = fs.readdirSync(DOWNLOAD_FOLDER);
  return downloads.map((f) => {
    const stats = fs.statSync(DOWNLOAD_FOLDER + "/" + f);
    return {
      size: filesize(stats.size),
      lastModified: stats.mtime,
      name: f,
      path: DOWNLOAD_FOLDER + "/" + f,
    };
  });
}

module.exports = function (mainWindow) {
  // handle the initial event to get the downloads
  ipcMain.on("sync/getcurrent", () => {
    mainWindow.webContents.send("sync/current", getDownloads());
  });

  // handle a clear event
  ipcMain.on("sync/clear", async () => {
    log.info("Clearing downloaded files...");
    fs.readdirSync(DOWNLOAD_FOLDER).forEach((f) => {
      log.debug(`Deleting ${f}`);
      fs.rmSync(path.join(DOWNLOAD_FOLDER, f));
    });

    mainWindow.webContents.send("sync/done", {
      message: `Cleared downloads successfully!`,
      success: true,
    });
    mainWindow.webContents.send("sync/current", getDownloads());
    log.info("Downloaded files cleared successfully!");
  });

  // handle a sync request
  ipcMain.on("sync/sync", async () => {
    const settings = await getSettings();

    if (
      !settings ||
      !settings.looker ||
      !settings.looker.username ||
      !settings.looker.password ||
      !settings.looker.fullRosterId ||
      !settings.looker.troopDetailsId
    ) {
      mainWindow.webContents.send("sync/done", {
        message: "Could not sync from Looker, please configure settings",
        success: false,
      });
      return;
    }
    const { username, password, fullRosterId, troopDetailsId } =
      settings.looker;

    const downloader = LookerDownloader(
      "https://girlscouts.looker.com",
      username,
      password,
      !settings.lookerHeadful,
      log
    );
    try {
      const tempdir = fs.mkdtempSync(path.join(os.tmpdir(), "report-builder"));
      async function downloadAndConvert(reportId, filter, fileName) {
        const download = path.join(tempdir, `${fileName}.csv`);
        await downloader.downloadReport(reportId, filter, download);
        const converted = path.join(DOWNLOAD_FOLDER, `${fileName}.json`);
        log.info(`Converting ${download} to JSON...`);
        convert(download, converted);
        log.info(`Converted file saved to: ${converted}`);
      }

      const years = ["Current", "Next", "Last"];
      const fields = {};
      await downloader.startup();
      for (const year of years) {
        await downloadAndConvert(
          fullRosterId,
          [
            { name: "Year", value: `${year} Year` },
            {
              name: "Service Unit",
              value: "{{ _user_attributes['service_unit_name'] }}",
            },
          ],
          `Full-Roster-${year}`
        );

        // gather up the unique fields and values
        const records = JSON.parse(
          fs.readFileSync(
            path.join(DOWNLOAD_FOLDER, `Full-Roster-${year}.json`)
          )
        );
        records.forEach((record) => {
          Object.keys(record).forEach((k) => {
            const escaped = k.replace(/[ \/\(\)\.]/g, "_");
            if (!fields[escaped]) {
              fields[escaped] = {
                values: new Set(),
                label: k,
              };
            }
            fields[escaped].values.add(record[k]);
          });
        });
      }
      Object.keys(fields).forEach(
        (k) => (fields[k].values = Array.from(fields[k].values).sort())
      );
      fs.writeFileSync(FIELDS_FILE, JSON.stringify(fields));

      await downloadAndConvert(troopDetailsId, {}, "Troop-Details");
      await downloader.shutdown();

      mainWindow.webContents.send("sync/current", getDownloads());
      mainWindow.webContents.send("sync/done", {
        message: `Synchronized successfully!`,
        success: true,
      });
    } catch (e) {
      mainWindow.webContents.send("sync/done", {
        message: `Failed to sync from Looker, error: ${e.message}`,
        success: false,
      });
    }
  });
};
