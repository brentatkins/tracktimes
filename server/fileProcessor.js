const R = require("ramda");
const { lines } = require("transduce/string");
const stream = require("transduce-stream");
const fs = require("fs");

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

const readFile = path => {
  return new Promise((resolve, reject) => {
    const parseFile = R.compose(
      lines(),
      R.map(buildLineArray),
      R.map(mapToRaceTime)
    );

    const fileStream = fs.createReadStream(path, {
      encoding: "utf8"
    });
    fileStream.on("error", () => {
      reject("an error occured reading file");
    });
    const objStream = fileStream.pipe(stream(parseFile, { objectMode: true }));

    var data = [];
    objStream.on("data", chunk => {
      data.push(chunk);
    });
    objStream.on("end", () => {
      resolve(data);
    });
    objStream.on("error", () => {
      reject("an error occured transforming file");
    });
  });
};

module.exports = {
  buildLineArray,
  mapToRaceTime,
  readFile
};
