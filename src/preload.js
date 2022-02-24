const { contextBridge, ipcRenderer } = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => {
    // whitelist channels
    const validChannels = [
      "general/open",
      "general/getversion",
      "general/save",
      "general/webmail",
      "home/getstats",
      "reports/run",
      "search/getfields",
      "search/getrecentqueries",
      "search/run",
      "settings/getsettings",
      "settings/putsettings",
      "sync/clear",
      "sync/getcurrent",
      "sync/sync",
      "troops/getfields",
      "troops/gettroops"
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, fn) => {
    const validChannels = [
      "general/version",
      "home/stats",
      "reports/results",
      "search/fields",
      "search/recentqueries",
      "search/results",
      "settings/settings",
      "settings/set",
      "sync/current",
      "sync/done",
      "troops/fields",
      "troops/troops"
    ];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => fn(...args));
    }
  },
});
