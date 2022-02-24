const KEY = "Troop/Group";

function getValidTroops(fullList) {
  return fullList
    .map((t) => t[KEY])
    .filter(
      (t) => t.indexOf("Troop") !== -1 && t.indexOf("*Now Forming*") == -1
    );
}

module.exports = function (context) {
  let { troops, current_year } = context;

  const troopReportTroops = new Set(getValidTroops(troops));
  const memberReportTroops = new Set(getValidTroops(current_year));
  return [
    {
      "No Members": [...troopReportTroops]
        .filter((t) => !memberReportTroops.has(t))
        .join(", "),

      "Troop Missing From Report": [...memberReportTroops]
        .filter((t) => !troopReportTroops.has(t))
        .join(", "),
    },
  ];
};
