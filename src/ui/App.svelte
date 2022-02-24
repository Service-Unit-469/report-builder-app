<script>
  import Home from "./routes/Home.svelte";
  import Reports from "./routes/Reports.svelte";
  import Search from "./routes/Search.svelte";
  import Settings from "./routes/Settings.svelte";
  import Sync from "./routes/Sync.svelte";
  import Troops from "./routes/Troops.svelte";

  let currentView = "home";
  let version = "";

  window.api.send("general/getversion");
  window.api.receive("general/version", (v) => {
    version = v;
  });

  window.api.send("settings/getsettings");
  window.api.receive("settings/settings", (settings) => {
    if (!settings.looker.username || !settings.looker.password) {
      document.getElementById("setup-required").showModal();
    }
  });
</script>

<main>
  <nav>
    <div>
      <div
        class="nav-item nav-link is-linked"
        on:click={() => (currentView = "home")}
      >
        Home
      </div>
      <div
        class="nav-item nav-link is-linked"
        on:click={() => (currentView = "search")}
      >
        Search
      </div>
      <div
        class="nav-item nav-link is-linked"
        on:click={() => (currentView = "reports")}
      >
        Reports
      </div>
      <div
        class="nav-item nav-link is-linked"
        on:click={() => (currentView = "troops")}
      >
        Troops
      </div>
      <div
        class="nav-item nav-link is-linked"
        on:click={() => (currentView = "sync")}
      >
        Sync Looker
      </div>
      <div
        class="nav-item nav-link"
        on:click={() => (currentView = "settings")}
      >
        Settings
      </div>
    </div>
    <div>
      <div
        class="nav-item nav-link is-linked"
        on:click={() =>
          window.api.send(
            "general/open",
            "https://github.com/Service-Unit-469/report-builder-ui/issues"
          )}
      >
        Report a Bug
      </div>
      <div class="nav-item">
        &copy; 2022 <span
          class="is-linked"
          on:click={() =>
            window.api.send("general/open", `https://www.danklco.com`)}
          >Dan Klco</span
        >
        <br />
        Version {version}
      </div>
    </div>
  </nav>
  <article>
    {#if currentView == "home"}
      <Home />
    {/if}
    {#if currentView == "search"}
      <Search />
    {/if}
    {#if currentView == "reports"}
      <Reports />
    {/if}
    {#if currentView == "troops"}
      <Troops />
    {/if}
    <div class={currentView === "sync" ? "" : "is-hidden"}>
      <Sync />
    </div>
    {#if currentView == "settings"}
      <Settings />
    {/if}
  </article>
</main>
<dialog id="setup-required">
  <h2>Setup Required</h2>
  <p>
    You must configure your Looker username and password.<br />You will now be
    taken to the settings screen to configure these values.
  </p>
  <p>
    <button
      on:click={() => {
        currentView = "settings";
        document.getElementById("setup-required").close();
      }}>OK</button
    >
  </p>
</dialog>

<style>
  article {
    margin: 0 1em;
    flex-basis: 0;
    flex-grow: 2;
    overflow-x: hidden;
    height: 100vh;
  }
  main {
    flex-direction: row;
    display: flex;
    height: 100vh;
    min-width: 0;
    overflow-y: auto;
  }
  nav {
    background-color: rgb(0, 174, 88);
    flex-basis: 200px;
    flex-grow: 0;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: white;
  }
</style>
