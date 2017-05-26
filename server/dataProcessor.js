const R = require("ramda");

const buildLineArray = R.pipe(
  R.split("  "),
  R.map(R.trim),
  R.filter(R.complement(R.not))
);

const mapToRaceTime = data => ({
  overallPosition: data[0],
  time: data[1],
  name: data[2],
  country: data[3],
  dob: data[4],
  placing: data[5],
  city: data[6],
  date: data[7]
});

module.exports = {
  buildLineArray,
  mapToRaceTime
};
