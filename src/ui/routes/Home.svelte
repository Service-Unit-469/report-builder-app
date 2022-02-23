<script>
  window.api.send("home/getstats");
  window.api.receive("home/stats", (s) => {
    stats = s;
  });

  let stats = {
    current: {
      girls: "N/A",
      adults: "N/A",
      troops: "N/A",
    },
    other: {
      girls: "N/A",
      adults: "N/A",
      troops: "N/A",
    },
    otherTitle: "Next Year",
  };
</script>

<div>
  <h1>Report Builder</h1>
  <p>Select an action on the left bar to get started!</p>

  <h1>Current Year</h1>

  <div class="flex-inline">
    <div>
      <h2>{stats.current.girls}</h2>
      <br />
      <h4>Girls</h4>
    </div>
    <div>
      <h2>{stats.current.adults}</h2>
      <br />
      <h4>Adults</h4>
    </div>
    <div>
      <h2>{stats.current.troops}</h2>
      <br />
      <h4>Troops</h4>
    </div>
  </div>

  <h1>{stats.otherTitle}</h1>

  <div class="flex-inline">
    <div>
      <h2>{stats.other.girls}</h2>
      <br />
      <h4>Girls</h4>
    </div>
    <div>
      <h2>{stats.other.adults}</h2>
      <br />
      <h4>Adults</h4>
    </div>
    <div>
      <h2>{stats.other.troops}</h2>
      <br />
      <h4>Troops</h4>
    </div>
  </div>
</div>

<style>
  div {
    text-align: center;
  }
  h2,
  h4 {
    margin: 0;
  }
</style>
