import { writable } from "svelte/store";

export const searchQuery = writable("");
export const searchParameters = writable([
  {
    field: "Troop_Group",
    operator: "~=",
    value: "Troop",
  },
]);

export const troopQuery = writable("");
export const troopParameters = writable([
  {
    field: "Troop_Group",
    operator: "~=",
    value: "Troop",
  },
]);
