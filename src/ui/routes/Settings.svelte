<script>
  let message = "";
  let level = "info";
  window.api.receive("settings/set", (res) => {
    level = res.success ? "success" : "error";
    message = res.message;
    setTimeout(() => (message = ""), 3000);
  });

  const settings = { looker: {} };
  window.api.send("settings/getsettings");
  window.api.receive("settings/settings", (data) => {
    Object.keys(data).forEach((k) => (settings[k] = data[k]));
  });
  function save() {
    level = "info";
    message = "Saving...";
    window.api.send("settings/putsettings", settings);
  }
</script>

<h1>Settings</h1>
<p class="message {level}">{message}</p>
<div>
  <h2>Looker</h2>
  <div class="field-group">
    <label for="username">Looker Username:</label>
    <input type="text" id="username" bind:value={settings.looker.username} />
  </div>
  <div class="field-group">
    <label for="password">Looker Password:</label>
    <input
      type="password"
      id="password"
      bind:value={settings.looker.password}
    />
  </div>
  <div class="field-group">
    <label
      for="fullRosterId"
      title="Found in the URL for Looker, e.g.
    https://girlscouts.looker.com/dashboards/[Looker Report
    ID]?[SOME_LONG_VALUE]">Looker Full Roster Report ID:</label
    >
    <input
      type="text"
      id="fullRosterId"
      bind:value={settings.looker.fullRosterId}
    /><br />
  </div>
  <div class="field-group">
    <label
      for="troopDetailsId"
      title="Found in the URL for Looker, e.g.
    https://girlscouts.looker.com/dashboards/[Looker Report
    ID]?[SOME_LONG_VALUE]">Looker Troop Details Report ID:</label
    >
    <input
      type="text"
      id="troopDetailsId"
      bind:value={settings.looker.troopDetailsId}
    /><br />
  </div>
  <h2>Debugging</h2>
  <div class="field-group">
    <label for="debugEnabled">Enable Verbose Logging?</label>
    <input
      type="checkbox"
      id="debugEnabled"
      bind:checked={settings.debugEnabled}
    /><br />
    <small
      >Logs can be found at <span
        on:click={() => window.api.send("general/open", `file:${settings.logPath}`)}
        >{settings.logPath}</span
      ></small
    >
  </div>
  <div class="field-group">
    <label for="lookerHeadful">Show Looker Download?</label>
    <input
      type="checkbox"
      id="lookerHeadful"
      bind:checked={settings.lookerHeadful}
    />
  </div>
  <button on:click={save}>Save</button>
</div>
