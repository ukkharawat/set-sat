import { Status } from './status'

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

onmessage = async (e) => {
  const sleepTime = Math.random() * 5000;

  console.log(`webworker #${e.data.index}: working`)
  await sleep(sleepTime)
  console.log(`webworker #${e.data.index}:`, e.data.message, sleepTime)
  console.log(`webworker #${e.data.index}: done`)

  postMessage({
    index: e.data.index,
    status: Status.done
  })
}