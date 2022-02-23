const homedir = require("os").homedir();
const path = require("path");

const APP_FILES_ROOT = path.join(homedir, ".reportbuilder");
const LOG_FILE = path.join(APP_FILES_ROOT, "app.log");
const DOWNLOAD_FOLDER = path.join(APP_FILES_ROOT, "downloads");
const FULL_ROSTER_FIELDS_FILE = path.join(
  DOWNLOAD_FOLDER,
  "Fields-Full-Roster.json"
);
const TROOP_FIELDS_FILE = path.join(
  DOWNLOAD_FOLDER,
  "Fields-Troop_Details.json"
);
const RECENT_QUERIES_FILE = path.join(APP_FILES_ROOT, "recentqueries.json");

const CURRENT_YEAR_FILE = path.join(
  DOWNLOAD_FOLDER,
  "Full-Roster-Current.json"
);
const LAST_YEAR_FILE = path.join(DOWNLOAD_FOLDER, "Full-Roster-Last.json");
const NEXT_YEAR_FILE = path.join(DOWNLOAD_FOLDER, "Full-Roster-Next.json");
const TROOPS_FILE = path.join(DOWNLOAD_FOLDER, "Troop-Details.json");

module.exports = {
  CURRENT_YEAR_FILE,
  LAST_YEAR_FILE,
  NEXT_YEAR_FILE,
  TROOPS_FILE,
  APP_FILES_ROOT,
  LOG_FILE,
  DOWNLOAD_FOLDER,
  FULL_ROSTER_FIELDS_FILE,
  RECENT_QUERIES_FILE,
  TROOP_FIELDS_FILE,
};
