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

const readFileStream = path => {
  const parseFile = R.compose(
    lines(),
    R.map(buildLineArray),
    R.map(mapToRaceTime),
    R.map(R.over(R.lensProp("dob"), trackTimeDateToJSDate)),
    R.map(R.over(R.lensProp("date"), trackTimeDateToJSDate)),
    R.map(R.over(R.lensProp("time"), trackTimeToMilleseconds)),
    R.groupBy(R.prop("name")),
    R.map(([name, trackTimes]) => ({
      name,
      country: trackTimes[0].country,
      trackTimes: R.sortBy(R.prop("date"))(trackTimes)
    }))
  );

  const fileStream = fs.createReadStream(path, {
    encoding: "utf8"
  });
  return fileStream.pipe(stream(parseFile, { objectMode: true }));
};

const trackTimeDateToJSDate = trackTimeDob => {
  const [date, month, year] = R.split(".")(trackTimeDob);
  return new Date(year, month - 1, date);
};

const trackTimeToMilleseconds = trackTime => {
  const parts = R.split(":", trackTime);
  var hours = 0;
  var minutes = 0;
  var seconds = 0;
  var hundredths = 0;

  if (parts.length === 2) {
    minutes = parseInt(parts[0]);
    let secondParts = R.split(".", parts[1]);
    seconds = parseInt(secondParts[0]);
    if (secondParts.length === 2) {
      hundredths = parseInt(secondParts[1]);
    }
  } else if (parts.length === 3) {
    hours = parseInt(parts[0]);
    minutes = parseInt(parts[1]);
    seconds = parseInt(parts[1]);
  }

  return (
    hours * 60 * 60 * 1000 +
    minutes * 60 * 1000 +
    seconds * 1000 +
    hundredths * 10
  );
};

module.exports = {
  buildLineArray,
  mapToRaceTime,
  readFileStream,
  trackTimeDateToJSDate,
  trackTimeToMilleseconds
};
