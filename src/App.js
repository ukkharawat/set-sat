import { render } from "@testing-library/react";
// eslint-disable-next-line import/no-webpack-loader-syntax
import ThreadPool from './workers/thread-pool'

const App = () => {
  const threadPool = new ThreadPool(1);
  threadPool.addJob('hello world');
  threadPool.addJob('hello world 2');
  threadPool.addJob('hello world 3');

  return <>hello</>
}

export default App;
