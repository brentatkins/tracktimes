const { buildLineArray, mapToRaceTime } = require("./dataProcessor");

describe("data processing tests", () => {
  describe("buildLineArray", () => {
    describe("when characters are split two spaces", () => {
      it("should create an element for each item", () => {
        var line = "one  two  three";
        expect(buildLineArray(line)).toEqual(["one", "two", "three"]);
      });
    });

    describe("when words have only a single space", () => {
      it("should be grouped into a single item", () => {
        var line = "one two  three";
        expect(buildLineArray(line)).toEqual(["one two", "three"]);
      });
    });

    describe("when words are split by more than two spaces", () => {
      it("should create separate elements", () => {
        var line = "one two       three";
        expect(buildLineArray(line)).toEqual(["one two", "three"]);
      });
    });

    describe("when actual line from file", () => {
      it("should split correctly", () => {
        var line =
          "        1      12:37.35   Kenenisa Bekele                ETH     13.06.82    1      Hengelo                     31.05.2004";
        expect(buildLineArray(line)).toEqual([
          "1",
          "12:37.35",
          "Kenenisa Bekele",
          "ETH",
          "13.06.82",
          "1",
          "Hengelo",
          "31.05.2004"
        ]);
      });
    });
  });

  describe("mapToRaceTime", () => {
    describe("when an array is passed", () => {
      it("should build raceTime object", () => {
        const data = [
          "1",
          "12:37.35",
          "Kenenisa Bekele",
          "ETH",
          "13.06.82",
          "1",
          "Hengelo",
          "31.05.2004"
        ];

        expect(mapToRaceTime(data)).toEqual({
          overallPosition: "1",
          time: "12:37.35",
          name: "Kenenisa Bekele",
          country: "ETH",
          dob: "13.06.82",
          placing: "1",
          city: "Hengelo",
          date: "31.05.2004"
        });
      });
    });
  });
});
