const {
  buildLineArray,
  mapToRaceTime,
  trackTimeDateToJSDate,
  trackTimeToMilleseconds
} = require("./fileProcessor");

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

  describe("trackTimeDateToJSDate", () => {
    describe("when passed a track time dob", () => {
      it("should convert to a javascript date", () => {
        const trackTimeDob = "20.04.2012";
        const actual = trackTimeDateToJSDate(trackTimeDob);
        expect(actual).toBeInstanceOf(Date);
      });
      it("should parse dates correctly", () => {
        const trackTimeDob = "20.04.2012";
        const actual = trackTimeDateToJSDate(trackTimeDob);
        expect(actual.getFullYear()).toBe(2012);
        expect(actual.getMonth()).toBe(3);
        expect(actual.getDate()).toBe(20);
      });
    });
  });

  describe("trackTimeToMilleseconds", () => {
    describe("when passed a string time a single colon", () => {
      it("should take number on left as minutes", () => {
        const trackTime = "1:00";
        const actual = trackTimeToMilleseconds(trackTime);
        expect(actual).toEqual(60000);
      });
      it("should take number on right as seconds", () => {
        const trackTime = "0:59";
        const actual = trackTimeToMilleseconds(trackTime);
        expect(actual).toEqual(59000);
      });
    });
    describe("when last number contains a decimal", () => {
      it("should intepret decimal as hundredth of a second", () => {
        const trackTime = "0:0.76";
        const actual = trackTimeToMilleseconds(trackTime);
        expect(actual).toEqual(760);
      });
    });
    describe("when 2 colons are provided", () => {
      it("should break into hours, minutes, seconds", () => {
        const trackTime = "1:00:00";
        const actual = trackTimeToMilleseconds(trackTime);
        expect(actual).toEqual(3600000);
      });
    });
  });
});
