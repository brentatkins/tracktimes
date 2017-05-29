function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error = new Error(`HTTP error ${response.statusText}`);
    error.status = response.status;
    error.response = response;
    console.error(error);
    throw error;
  }
}

function parseJson(response) {
  return response.json();
}

export function fetchTimes() {
  return fetch("api/times").then(checkStatus).then(parseJson);
}
