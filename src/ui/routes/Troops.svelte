<script>
  import SimpleSearch from "../components/SimpleSearch.svelte";

  import {
    troopParameters as parametersStore,
    troopQuery as queryStore,
  } from "../stores";

  let currentLeader;
  let fields = {};
  let troops = [];
  let level = "info";
  let message = "";
  const roles = [
    "Troop Leader",
    "Troop Assistant-Cookie Manager",
    "Troop Assistant-Fall Product Manager",
    "Troop Assistant",
    "Adult Members",
  ];

  let query = "";
  queryStore.subscribe((nq) => {
    query = nq;
    if (!troops) {
      window.api.send("troops/gettroops", query);
    }
  });
  window.api.receive("troops/troops", (data) => {
    troops = data;
    message = `Found ${data.length} troops`;
    level = "info";
  });

  window.api.send("troops/getfields");
  window.api.receive("troops/fields", (f) => {
    fields = f;
  });

  function run() {
    level = "info";
    message = "Searching...";
    window.api.send("troops/gettroops", query);
  }
  function displayLeader(leader) {
    currentLeader = leader;
    document.getElementById("leader-dialog").showModal();
  }
</script>

<h1>Troops</h1>

<SimpleSearch {fields} {parametersStore} {queryStore} />

<div class="field-group">
  <button on:click={run}>Run</button>&nbsp;
</div>
<hr />
<p class="message {level}">{message}</p>
<br />
<div class="h-scroll">
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Level</th>
        <th>Grade</th>
        <th>Leaders</th>
        <th>Meeting Schedule</th>
        <th>Meeting Location</th>
        <th>Assigned</th>
        <th>Availability</th>
      </tr>
    </thead>
    <tbody>
      {#each troops as troop}
        <tr>
          <td>
            {troop["Troop/Group"]}
          </td>
          <td>{troop["Troop Type"]}</td>
          <td>{troop["Program Grade Level"]}</td>
          <td>{troop["Troop Grade"]}</td>
          <td>
            {#each roles as role}
              {#if troop.leaders[role.toLowerCase()]}
                <h5>{role}</h5>
                <ul>
                  {#each troop.leaders[role.toLowerCase()] as leader}
                    <li
                      class="is-linked"
                      on:click={() => displayLeader(leader)}
                    >
                      {leader["First Name"]}
                      {leader["Last Name"]}
                    </li>
                  {/each}
                </ul>
              {/if}
            {/each}
          </td>
          <td>
            {troop["Meeting Frequency"]}
            {troop["Meeting Days"]}
            {#if troop["Meeting Start Time"]}
              <br />{troop["Meeting Start Time"]} - {troop["Meeting End Time"]}
            {/if}
          </td>
          <td>
            {troop["Meeting Location"]}
            {#if troop["Meeting Location Street1 Addr"]}
              <div
                class="is-linked"
                on:click={() =>
                  window.api.send(
                    "general/open",
                    `https://www.google.com/maps/search/${troop["Meeting Location Street1 Addr"]},${troop["Meeting Location City"]}, ${troop["Meeting Location State"]} ${troop["Meeting Location Zip Code"]}`
                  )}
              >
                {troop["Meeting Location Street1 Addr"]}<br />
                {#if troop["Meeting Location Street2 Addr"]}
                  {troop["Meeting Location Street2 Addr"]}<br />
                {/if}
                {troop["Meeting Location City"]}, {troop[
                  "Meeting Location State"
                ]}
                {troop["Meeting Location Zip Code"]}
              </div>
            {/if}
            {#if troop["Meeting Notes"]}
              <p>
                {troop["Meeting Notes"]}
              </p>
            {/if}
          </td>
          <td>{troop["Girls Assigned"]}</td>
          <td>{troop["Girl Openings Remaining"]}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<dialog id="leader-dialog">
  {#if currentLeader}
    <h2>
      {currentLeader["First Name"]}
      {currentLeader["Last Name"]} <small>({currentLeader["Role Name"]})</small>
    </h2>

    <h3>Contact</h3>
    <dl>
      {#if currentLeader["Phone Number"]}
        <dt>Email</dt>
        <dd
          class="is-linked"
          on:click={() =>
            window.api.send("general/open", `mailto:${currentLeader["Email"]}`)}
        >
          {currentLeader["Email"]}
        </dd>
      {/if}
      {#if currentLeader["Phone Number"]}
        <dt>Phone</dt>
        <dd
          class="is-linked"
          on:click={() =>
            window.api.send(
              "general/open",
              `tel:${currentLeader["Phone Number"]}`
            )}
        >
          {currentLeader["Phone Number"]}
        </dd>
      {/if}
      <dt>Address</dt>
      <dd
        class="is-linked"
        on:click={() =>
          window.api.send(
            "general/open",
            `https://www.google.com/maps/search/${currentLeader["Address Line 1"]},${currentLeader["City"]}, ${currentLeader["State Name (Abbr.)"]} ${currentLeader["Zip Code"]}`
          )}
      >
        {currentLeader["Address Line 1"]}<br />
        {currentLeader["City"]}, {currentLeader["State Name (Abbr.)"]}
        {currentLeader["Zip Code"]}
      </dd>
    </dl>
    <h3>Membership</h3>
    <dl>
      <dt>Troop</dt>
      <dd>{currentLeader["Troop/Group"]}</dd>
      <dt>Type</dt>
      <dd>{currentLeader["Membership Type"]}</dd>
    </dl>
    <br />
    <button on:click={() => document.getElementById("leader-dialog").close()}
      >OK</button
    >
  {/if}
</dialog>
