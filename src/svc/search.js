const { ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");
const filter = require("@service-unit-469/report-builder/src/filter");
const log = require("../log")();

const {
  FIELDS_FILE,
  DOWNLOAD_FOLDER,
  RECENT_QUERIES_FILE,
} = require("../constants");

function getFields() {
  if (fs.existsSync(FIELDS_FILE)) {
    return JSON.parse(fs.readFileSync(FIELDS_FILE));
  }
  return {};
}

function getYear(name) {
  return name.match(/Full-Roster-(\w*).json/)[0];
}

function loadRecords(include) {
  log.info(`Loading records for: ${include}`);
  const records = [];
  if (fs.existsSync(DOWNLOAD_FOLDER)) {
    if (include === "All") {
      fs.readdirSync(DOWNLOAD_FOLDER).forEach((file) => {
        if (file.indexOf("Full-Roster") !== -1) {
          addRecords(file, records);
        }
      });
    } else {
      const file = path.join(DOWNLOAD_FOLDER, `Full-Roster-${include}.json`);
      if (fs.existsSync(file)) {
        addRecords(`Full-Roster-${include}.json`, records);
      } else {
        throw new Error(`Could not find source file for ${include}!`);
      }
    }
  } else {
    throw new Error("No downloads found, be sure to sync first!");
  }
  log.info(`Loaded ${records.length} records`);
  return records;
}

function addRecords(name, records) {
  log.debug(`Loading records from: ${name}`);
  const year = getYear(name);
  JSON.parse(fs.readFileSync(path.join(DOWNLOAD_FOLDER, name))).forEach(
    (record) => {
      record["Year"] = year;
      records.push(record);
    }
  );
}

function getRecentQueries() {
  if (fs.existsSync(RECENT_QUERIES_FILE)) {
    return JSON.parse(fs.readFileSync(RECENT_QUERIES_FILE));
  } else {
    return [];
  }
}

function addRecentQuery(query) {
  let queries = getRecentQueries();
  if (!queries.includes(query)) {
    if (queries.length > 10) {
      queries = queries.slice(0);
    }
    queries.push(query);
    fs.writeFileSync(RECENT_QUERIES_FILE, JSON.stringify(queries));
  }
}

function runSearch(query, include) {
  try {
    const records = loadRecords(include);
    let results;
    if (query && query !== "") {
      log.info(`Executing query: ${query}`);
      results = filter(records, query);
    } else {
      results = records;
    }
    log.info(`Found ${results.length} results`);
    addRecentQuery(query);
    return {
      success: true,
      message: `Found ${results.length} results!`,
      results,
    };
  } catch (e) {
    log.error(`Failed to execute: ${query} including: ${include}`, e);
    return {
      success: false,
      message: `Failed to run search: ${e.message}`,
      results: [],
    };
  }
}

module.exports = function (mainWindow) {
  ipcMain.on("search/getfields", () => {
    mainWindow.webContents.send("search/fields", getFields());
  });
  ipcMain.on("search/run", (event, req) => {
    const { query, include } = req;
    const res = runSearch(query, include);
    mainWindow.webContents.send("search/results", res);
    if (res.success) {
      mainWindow.webContents.send("search/recentqueries", getRecentQueries());
    }
  });
  ipcMain.on("search/getrecentqueries", () => {
    mainWindow.webContents.send("search/recentqueries", getRecentQueries());
  });
};
