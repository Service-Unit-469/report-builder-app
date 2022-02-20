function filterToGirls(rec) {
  return (
    rec["Troop/Group"].indexOf("Troop") !== -1 && rec["Role Name"] === "Girl"
  );
}

function escapeTroopName(name) {
  name = name.replace(/\*.+\*\s/, "");
  name = name.replace(/_\d+/, "");
  return name;
}

module.exports = function (context) {
  const { last_year, current_year } = context;
  const lastYearTroops = {};
  const currentYearTroops = new Set();
  current_year.filter(filterToGirls).forEach((r) => {
    currentYearTroops.add(escapeTroopName(r["Troop/Group"]));
  });

  last_year.filter(filterToGirls).forEach((r) => {
    const troopName = escapeTroopName(r["Troop/Group"]);
    if (!currentYearTroops.has(troopName)) {
      if (!lastYearTroops[troopName]) {
        lastYearTroops[troopName] = {
          Troop: troopName,
          Level: r["Program Grade Level"],
          Members: 0,
        };
      }
      lastYearTroops[troopName].Members++;
    }
  });

  const data = [];
  Object.keys(lastYearTroops).forEach((k) => data.push(lastYearTroops[k]));
  return data;
};
