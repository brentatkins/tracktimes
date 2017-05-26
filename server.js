const { readFile } = require("./server/fileProcessor");

var prom = readFile("./data/5000mMini.txt")
  .then((data) => console.warn("done", data))
  .catch(error => console.error("error reading file"));