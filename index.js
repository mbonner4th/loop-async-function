function resolveAfterXMilliseconds (timeout) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('resolved');
    }, timeout);
  });
};

/**
 * Waits for the wait duration and then calls the callback. If a call logs is not returned the
 * function is repeated until the loop count is exhausted. If the loop count is exhausted, any
 * error returned by the query is thrown.
 * NOTE: The wait time is per function call. A function with a wait duration of 5000 and a loop 
 * count of 6 has the potential to wait 1 minute if the maxAwait is not triggered
 * @param {*} callback a callable function. expected ()=>{someAsyncFunction}
 * @param {*} loopCount the maximum number of times to run the request
 * @param {*} [waitDuration=2000] the wait time per callback in milliseconds
 * @param {*} [maxAwait=4000] the maximum time to await the waitDuration and callback. If the
 *   waitDuration + time fot the callback response exceeds the maxAwait, an error is thrown.
 */
async function loopAsyncFunction(
  callback,
  loopCount,
  waitDuration = 2000,
  maxAwait = 10000,
) {
  if (waitDuration > maxAwait) {
    throw new Error('waitDuration can not exceed max Await');
  }
  const maxTimeout = setTimeout(() => {
    throw new Error('Max await time exceeded');
  }, maxAwait);
  await resolveAfterXMilliseconds(waitDuration);
  try {
    const callbackResult = await callback();
    clearTimeout(maxTimeout);
    return callbackResult;
  } catch (error) {
    clearTimeout(maxTimeout);
    if (loopCount) {
      return loopAsyncFunction(
        callback,
        loopCount - 1,
        waitDuration,
      );
    }
    throw error;
  }
}
module.exports = loopAsyncFunction;