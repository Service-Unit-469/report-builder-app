function filterToGirls(rec) {
    return (
      rec["Troop/Group"].indexOf("Troop") !== -1 && rec["Role Name"] === "Girl"
    );
  }
  
  module.exports = function (context) {
    let { last_year, current_year } = context;
    last_year = last_year.filter(filterToGirls);
    current_year = current_year.filter(filterToGirls);
    return last_year.filter((lyg) => {
      const matching = current_year.filter((cyg) => {
        return (
          cyg["First Name"] === lyg["First Name"] &&
          cyg["Last Name"] === lyg["Last Name"]
        );
      });
      return matching.length === 0;
    });
  };
  