import React from "react";
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryScatter,
  VictoryTooltip
} from "victory";
import * as R from "ramda";

const formatTimeFromMs = timeInMs => {
  const hours = parseInt(timeInMs / (60 * 60 * 1000), 10);
  const minutes = parseInt(timeInMs / (60 * 1000), 10);
  const seconds = ((timeInMs % 60000) / 1000).toFixed(0);
  const ms = parseInt((timeInMs % 1000) / 100);

  const prependZero = x => (x < 10 ? `0${x}` : x);

  return hours
    ? `${hours}:${minutes}:${prependZero(seconds)}:${ms}`
    : `${minutes}:${prependZero(seconds)}:${ms}`;
};

const calculateDomain = times => {
  const timesOnly = R.pipe(
    R.map(R.prop("trackTimes")),
    R.flatten(),
    R.map(R.prop("time"))
  )(times);
  const max = R.reduce(R.max, 0)(timesOnly);
  const min = R.reduce(R.min, Infinity)(timesOnly);
  const domain = [min - min * 0.005, max + max * 0.005];
  return domain;
};

const getCountryColor = country => {
  if (country === "ETH") return "green";
  else if (country === "KEN") return "red";
  else return "black";
};

export default ({ times }) => {
  const domain = calculateDomain(times);
  return (
    <VictoryChart>
      <VictoryAxis scale="time" standalone={false} />
      <VictoryAxis
        dependentAxis
        domain={domain}
        orientation="left"
        standalone={false}
        tickFormat={formatTimeFromMs}
      />
      {times.map(athlete => {
        const countryColour = getCountryColor(athlete.country);
        return [
          <VictoryLine
            key={athlete.name}
            data={athlete.trackTimes.map(trackTime => ({
              date: new Date(trackTime.date),
              time: trackTime.time
            }))}
            x="date"
            y="time"
            domain={{ y: domain }}
            style={{
              data: { stroke: countryColour }
            }}
          />,
          <VictoryScatter
            labelComponent={<VictoryTooltip />}
            data={athlete.trackTimes.map(trackTime => ({
              date: new Date(trackTime.date),
              time: trackTime.time,
              label: `${athlete.name} [${athlete.country}] - ${trackTime.date}`
            }))}
            x="date"
            y="time"
            domain={{ y: domain }}
            style={{
              data: { fill: countryColour }
            }}
          />
        ];
      })}
    </VictoryChart>
  );
};
