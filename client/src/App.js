import React, { Component } from "react";
import TrackTimeChart from "./TrackTimeChart";
import { fetchTimes } from "./dataFetcher";

class App extends Component {
  state = { times: [] };
  componentDidMount() {
    console.warn("fetch data");
    fetchTimes()
      .then(times => {
        this.setState((prevState, props) => ({ times }));
      })
      .catch(error => {
        console.error("error", error);
      });
  }
  render() {
    return this.state.times.length > 0
      ? <TrackTimeChart times={this.state.times} />
      : <div>loading</div>;
  }
}

export default App;