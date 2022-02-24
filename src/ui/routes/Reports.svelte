<script>
  const defaultReports = [
    {
      name: "Disbanded Troops",
      description:
        "Looks for troops that are found in Last Year that are not found in the Current Year",
      ref: "reports/disbanded-troops.js",
      email: false,
    },
    {
      name: "Unrenewed Girls",
      description:
        "Looks for girls that are found in Last Year that are not found in the Current Year",
      ref: "reports/dropped-out-girls.js",
      email: true,
    },
    {
      name: "Troop Discrepancies",
      description:
        "Finds discrepancies between the troops found in the troops report and the troops found by membership",
      ref: "reports/troop-discrepancies.js",
      email: false,
    },
  ];
  let running = false;
  let mode = "view";
  let currentReport;

  let viewData;
  let viewFields;

  let level = "info";
  let message = "";

  window.api.receive("reports/results", (res) => {
    running = false;
    level = res.success ? "success" : "error";
    message = res.message;
    const data = res.data;
    if (res.success) {
      if (mode === "save") {
        window.api.send("general/save", {
          data,
          suggest: `${currentReport.name}.csv`,
        });
      } else if (mode === "email") {
        window.api.send("general/webmail", data);
      } else {
        viewFields = Object.keys(data[0]);
        viewData = data;
        document.getElementById("report-dialog").showModal();
      }
    }
  });
  function runReport(report) {
    running = true;
    currentReport = report;
    level = "info";
    message = `Running report: ${report.name}`;
    window.api.send("reports/run", report);
  }

  function emailReport(report) {
    mode = "email";
    runReport(report);
  }

  function viewReport(report) {
    mode = "view";
    runReport(report);
  }

  function saveReport(report) {
    mode = "save";
    runReport(report);
  }
</script>

<h1>Reports</h1>

<p class="message {level}">{message}</p>
<table>
  <thead>
    <tr>
      <th>Report</th>
      <th>Description</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {#each defaultReports as report}
      <tr>
        <td>
          {report.name}
        </td>
        <td>
          {report.description}
        </td>
        <td>
          <button disabled={running} on:click={() => viewReport(report)}
            >&#x1F50D;</button
          >
          <button disabled={running} on:click={() => saveReport(report)}>
            &#x1F4C1;
          </button>
          {#if report.email}
            <button disabled={running} on:click={() => emailReport(report)}>
              &#x1F4E7;
            </button>
          {/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>
<dialog id="report-dialog">
  {#if viewData}
    <h2>
      {currentReport.name}
    </h2>
    <div class="container">
      <table>
        <thead>
          <tr>
            {#each viewFields as field}
              <th>
                {field}
              </th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each viewData as record}
            <tr
              >{#each viewFields as field}
                <td>
                  {record[field]}
                </td>
              {/each}</tr
            >{/each}
        </tbody>
      </table>
    </div>
    <br />
    <button
      on:click={() => {
        document.getElementById("report-dialog").close();
        viewData = null;
      }}>OK</button
    >
  {/if}
</dialog>

<style>
  .container {
    max-height: 500px;
    max-width: 700px;
    overflow: auto;
  }
</style>
