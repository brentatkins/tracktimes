import React, { useEffect, useState } from "react";

import TrackTimeChart from "./TrackTimeChart";
import { fetchTimes } from "./dataFetcher";

function App(props) {
  const [times, setTimes] = useState(null);

  useEffect(() => {
    if (times === null) {
      fetchTimes()
        .then(times => setTimes(times))
        .catch(error => console.error("error loading data", error));
    }
  });

  return times ? <TrackTimeChart times={times} /> : <div>loading</div>;
}

export default App;
