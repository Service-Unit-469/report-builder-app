<script>
  import Home from "./routes/Home.svelte";
  import Reports from "./routes/Reports.svelte";
  import Search from "./routes/Search.svelte";
  import Settings from "./routes/Settings.svelte";
  import Sync from "./routes/Sync.svelte";

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
      <!-- svelte-ignore a11y-invalid-attribute -->
      <a class="nav-link" href="#" on:click={() => (currentView = "home")}
        >Home</a
      >
      <!-- svelte-ignore a11y-invalid-attribute -->
      <a class="nav-link" href="#" on:click={() => (currentView = "search")}
        >Search</a
      >
      <!-- svelte-ignore a11y-invalid-attribute -->
      <a class="nav-link" href="#" on:click={() => (currentView = "reports")}
        >Reports</a
      >
      <!-- svelte-ignore a11y-invalid-attribute -->
      <a class="nav-link" href="#" on:click={() => (currentView = "sync")}
        >Sync Looker</a
      >
      <!-- svelte-ignore a11y-invalid-attribute -->
      <a class="nav-link" href="#" on:click={() => (currentView = "settings")}
        >Settings</a
      >
    </div>
    <div class="nav-link">
      &copy; 2022 <span
        on:click={() =>
          window.api.send("general/open", `https://www.danklco.com`)}
        >Dan Klco</span
      >
      <br />
      Version {version}
    </div>
  </nav>
  <article>
    <div class={currentView === "home" ? "" : "is-hidden"}>
      <Home />
    </div>
    <div class={currentView === "search" ? "" : "is-hidden"}>
      <Search />
    </div>
    <div class={currentView === "reports" ? "" : "is-hidden"}>
      <Reports />
    </div>
    <div class={currentView === "sync" ? "" : "is-hidden"}>
      <Sync />
    </div>
    <div class={currentView === "settings" ? "" : "is-hidden"}>
      <Settings />
    </div>
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
