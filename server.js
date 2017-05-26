const { readFileStream } = require("./server/fileProcessor");
const express = require("express");

const app = express();

app.set("port", process.env.PORT || "3001");

app.get("/api/times", (req, res) => {
  res.set("Content-Type", "application/json");
  res.write("[");
  var prevChunk = null;

  readFileStream("./data/5000mMini.txt")
    .on("data", function onData(data) {
      if (prevChunk) {
        res.write(JSON.stringify(prevChunk) + ",");
      }
      prevChunk = data;
    })
    .on("end", function onEnd() {
      if (prevChunk) {
        res.write(JSON.stringify(prevChunk));
      }
      res.end("]");
    });
});

app.listen(app.get("port"), () => {
  console.log(`Server started on http://localhost:${app.get("port")}/`);
});
