<script>
  let files = [];
  let level = "info";
  let message = "";
  let syncDisabled = false;

  // get download files
  window.api.send("sync/getcurrent");
  window.api.receive("sync/current", (data) => {
    files = [];
    data.forEach((d) => files.push(d));
  });

  // handle syncing and clearing
  function sync() {
    syncDisabled = true;
    level = "info";
    message = "Syncing, this can take up to a couple minutes...";
    window.api.send("sync/sync");
  }
  function clear() {
    syncDisabled = true;
    level = "info";
    message = "Clearing files...";
    window.api.send("sync/clear");
  }
  window.api.receive("sync/done", (res) => {
    syncDisabled = false;
    message = res.message;
    level = res.success ? "success" : "error";
  });
</script>

<h1>Current Downloaded Files</h1>
<p class="message {level}">{message}</p>
<table>
  <thead>
    <tr>
      <th>File</th>
      <th>Last Modified</th>
      <th>Size</th>
    </tr>
  </thead>
  <tbody>
    {#each files as file}
      <tr>
        <td on:click={() => window.api.send("general/open", `file:${file.path}`)}>
          {file.name}
        </td>
        <td>
          {new Intl.DateTimeFormat("en-US", {
            dateStyle: "short",
            timeStyle: "short",
          }).format(file.lastModified)}
        </td>
        <td>
          {file.size}
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<div class="field-group">
  <button on:click={sync} disabled={syncDisabled}>Sync</button> &nbsp;
  <button on:click={clear} disabled={syncDisabled}>Clear</button>
</div>

<style>
  table {
    width: 100%;
  }
</style>
