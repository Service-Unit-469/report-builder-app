<script>
  import AdvancedSearch from "../components/AdvancedSearch.svelte";
  import SimpleSearch from "../components/SimpleSearch.svelte";

  import {
    searchQuery as queryStore,
    searchParameters as parametersStore,
  } from "../stores";

  let query = "";

  let include = "Current";
  let message = "";
  let level = "info";
  let results = [];
  let mode = "simple";
  let current;
  let miscFields = [];
  queryStore.subscribe((nq) => {
    query = nq;
  });

  const primaryFields = [
    "Troop/Group",
    "Role Name",
    "First Name",
    "Last Name",
    "Email",
    "Preferred Contact First Name",
    "Preferred Contact Last Name",
    "Preferred Contact Email",
    "Preferred Contact Phone",
    "Phone Number",
    "Address Line 1",
    "City",
    "State Name (Abbr.)",
    "Zip Code",
    "Name (School)",
    "Girl Grade",
    "Membership Type",
  ];

  // get the fields
  let fields = {};
  window.api.send("search/getfields");
  window.api.receive("search/fields", (f) => {
    fields = f;
  });

  // get the recent queries
  let recentQueries = [];
  window.api.send("search/getrecentqueries");
  window.api.receive("search/recentqueries", (q) => {
    recentQueries = q.reverse();
  });

  // run queries and handle results
  window.api.receive("search/results", (res) => {
    level = res.success ? "success" : "error";
    message = res.message;
    results = res.results;
  });
  function run() {
    level = "info";
    message = "Searching...";
    window.api.send("search/run", {
      query,
      include,
    });
  }
  function save() {
    window.api.send("general/save", {
      suggest: "search.csv",
      data: results,
    });
  }
  function openDialog(record) {
    current = record;
    miscFields = Object.keys(record)
      .filter(
        (k) =>
          !primaryFields.includes(k) &&
          k !== "" &&
          k !== "Year" &&
          k !== "Service Unit" &&
          record[k] !== "~" &&
          record[k] !== "" &&
          record[k] !== "Not Applicable"
      )
      .sort();
    document.getElementById("info-dialog").showModal();
  }
</script>

<h1>Search</h1>

<div class="field-group flex-inline">
  <div class="flex-inline">
    <label>
      <input type="radio" bind:group={mode} name="mode" value="simple" />
      Simple&nbsp;
    </label>
    <label>
      <input type="radio" bind:group={mode} name="mode" value="advanced" />
      Advanced
    </label>
  </div>
  <div class="flex-inline">
    <label for="include">Include</label>
    <select id="include" bind:value={include}>
      <option>All</option>
      <option value="Current">Current Year</option>
      <option value="Next">Next Year</option>
      <option value="Last">Last Year</option>
    </select>
  </div>
</div>
{#if mode === "advanced"}
  <AdvancedSearch {fields} {recentQueries} />
{:else}
  <SimpleSearch {fields} {queryStore} {parametersStore} />
{/if}
<div class="field-group">
  <button on:click={run}>Run</button>&nbsp;
  {#if level === "success"}
    <button on:click={save}>Save</button>
  {/if}
</div>
<hr />
<p class="message {level}">{message}</p>
<br />
<div class="h-scroll">
  <table>
    <thead>
      {#each primaryFields as field}
        <th>{field}</th>
      {/each}
    </thead>
    <tbody>
      {#each results as record}
        <tr on:click={() => openDialog(record)}>
          {#each primaryFields as field}
            <td>{record[field]}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<dialog id="info-dialog">
  {#if current}
    <h2>
      {current["First Name"]}
      {current["Last Name"]} <small>({current["Role Name"]})</small>
    </h2>

    <h3>Contact</h3>
    <dl>
      {#if current["Email"]}
        <dt>Email</dt>
        <dd
          on:click={() =>
            window.api.send("general/open", `mailto:${current["Email"]}`)}
        >
          {current["Email"]}
        </dd>
      {/if}
      {#if current["Phone Number"]}
        <dt>Phone</dt>
        <dd
          on:click={() =>
            window.api.send("general/open", `tel:${current["Phone Number"]}`)}
        >
          {current["Phone Number"]}
        </dd>
      {/if}
      <dt>Address</dt>
      <dd
        on:click={() =>
          window.api.send(
            "general/open",
            `https://www.google.com/maps/search/${current["Address Line 1"]},${current["City"]}, ${current["State Name (Abbr.)"]} ${current["Zip Code"]}`
          )}
      >
        {current["Address Line 1"]}<br />
        {current["City"]}, {current["State Name (Abbr.)"]}
        {current["Zip Code"]}
      </dd>
    </dl>
    {#if current["Role Name"] === "Girl"}
      <h3>
        {current["Preferred Contact First Name"]}
        {current["Preferred Contact Last Name"]}
        <small>(Preferred Contact)</small>
      </h3>
      <dt>Email</dt>
      <dd
        on:click={() =>
          window.api.send(
            "general/open",
            `mailto:${current["Preferred Contact Email"]}`
          )}
      >
        {current["Preferred Contact Email"]}
      </dd>
      <dt>Phone</dt>
      <dd
        on:click={() =>
          window.api.send(
            "general/open",
            `tel:${current["Preferred Contact Phone"]}`
          )}
      >
        {current["Preferred Contact Phone"]}
      </dd>
    {/if}
    <h3>Membership</h3>
    <dl>
      <dt>Troop</dt>
      <dd>{current["Troop/Group"]}</dd>
      <dt>Type</dt>
      <dd>{current["Membership Type"]}</dd>
      {#if current["Membership Type"] === "Girl Membership"}
        <dt>School</dt>
        <dd>{current["Name (School)"]}</dd>
        <dt>Grade</dt>
        <dd>{current["Girl Grade"]}</dd>
      {/if}
    </dl>

    <details>
      <summary>More</summary>
      <dl>
        {#each miscFields as field}
          <dt>{field}</dt>
          <dd>{current[field]}</dd>
        {/each}
      </dl>
    </details>

    <button on:click={() => document.getElementById("info-dialog").close()}
      >OK</button
    >
  {/if}
</dialog>
