# mbonner4th/loop-async-function

Waits for the wait duration and then calls the callback. If a call logs is not returned the function is repeated until the loop count is exhausted. If the loop count is exhausted, any error returned by the query is thrown.

> NOTE: The wait time is per function call. A function with a wait duration of 5000 and a loop count of 6 has the potential to wait 1 minute if the maxAwait is not triggered

## Install

```
$ npm install @mbonner4th/loop-async-function -s
```

## Usage

This function is useful for automating getting log data when the data is not immediately available.

```js
const rp = require('request-promise-native');
const loopAsyncFunction = require('./loop-async-function');

function viewVoxologyCallLog(callId) {
  const options = {
    method: 'GET',
    uri: `https://api.voxolo.gy/v1/History/Logs/Calls/${callId}`,
    headers: {
      'X-Api-Key': SOME_API_KEY,
      'Content-Type': 'application/json',
    },
    json: true,
    resolveWithFullResponse: true,
  };
  return rp(options)
  .then((data) => data)
  .catch((error) => { throw error; });
}

loopAsyncFunction(
  () => viewVoxologyCallLog('123@456'),
  3,
  500
  )
  .then(data => {console.log(data)})
  .catch(error => {console.log(error)})

/**
 * => output
 {
  "id": "4469ea1f-abe3-4a30-97e1-45f871f61d65",
  "app_id": "ba012968-7deb-4e9a-841d-93ea35af764d",
  "subaccount_id": 0,
  "call_id": "10605776@17155753",
  "caller_no": "+15551231234",
  "api_no": "+5559871234",
  "start_time": "2019-03-19T22:46:51.462Z",
  "end_time": "2019-03-19T22:46:54.001Z",
  "type": "voice",
  "direction": "outbound",
  "hangup_end": "caller",
  "duration": 2540,
  "status": "completed",
  "detection": "unknown",
  "error": null,
  "connect_time_billed": 0.1,
  "connect_time_sec": 1,
  "origin_api": "CallFlows",
  "charge": {
      "total": 0.0015
  },
  "service": "programmable_voice"
}
 * /
```
