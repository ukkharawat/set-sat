// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from 'worker-loader!./worker'

import { Status } from './status'

export default class ThreadPool {
  // queue
  //   -> status: working, available
  //   -> message: job message
  // idea
  //   -> if thread is working, postMessage 'working' to thread pool for set current status
  //   -> if thread done postMessage 'done' to thread pool for pick next item, or set it free
  //   -> if error, set it free
  //   -> item in queue must be fifo

  constructor(poolCount) {
    this.queue = []
    this.threadPool = [];

    for (let i = 0; i < poolCount; i++) {
      const worker = new Worker();
      worker.onmessage = (event) => this.onThreadCallback(event);
      worker.onerror = (err) => this.onThreadError(err);

      this.threadPool.push({
        index: i,
        status: Status.available,
        worker,
        message: null
      })
    }
  }

  addJob(message) {
    const thread = this.threadPool.find((thread) => thread.status === Status.available);
   
    if (thread) {
      thread.worker.postMessage({
        index: thread.index,
        message,
      });
      thread.status = Status.working
    } else {
      this.queue.push(message)
    }
  }

  onThreadCallback(event) {
    const { index, status } = event.data;
    const thread = this.threadPool[index];
    thread.status = status;

    if (thread.status === Status.done) {
      const job = this.queue.shift();
      
      if (job) {
        console.log('next:', job)
        thread.worker.postMessage({
          index: thread.index,
          message: job,
        })
        thread.status = Status.working
      } else {
        thread.status = Status.available
      }
    }
  }

  onThreadError(err) {
    console.log('thread error', err)
  }
}