// eagles.js
const baseEagles = [
  {
    name: "Eagle Strafing Run",
    baseUsesPerRearm: 4,
  },
  {
    name: "Eagle Airstrike",
    baseUsesPerRearm: 2,
  },
  {
    name: "Eagle Cluster Bomb",
    baseUsesPerRearm: 4,
  },
  {
    name: "Eagle Napalm Airstrike",
    baseUsesPerRearm: 2,
  },
  {
    name: "Eagle Smoke Strike",
    baseUsesPerRearm: 2,
  },
  {
    name: "Eagle 110mm Rocket Pods",
    baseUsesPerRearm: 3,
  },
  {
    name: "Eagle 500kg Bomb",
    baseUsesPerRearm: 1,
  },
];

export const EAGLES = baseEagles.map((eagle) => ({
  ...eagle,
  type: "eagle",
  category: "eagles",
  singleUseCd: 8,
  rearmCd: 150,
}));
