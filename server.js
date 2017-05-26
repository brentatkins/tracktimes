const { buildLineArray, mapToRaceTime } = require("./server/dataProcessor");
const fs = require("fs");
const R = require("ramda");

const file = fs.readFileSync("./data/5000mMini.txt", "utf8");

const splitLines = R.split("\n");

const parseFile = R.pipe(
  splitLines,
  R.map(buildLineArray),
  R.map(mapToRaceTime)
);

//const output = R.into('', R.identity, parseFile(file));
const output = parseFile(file);
console.log(output);
