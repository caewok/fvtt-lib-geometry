/** Utility functions for benchmarking **/
/* globals
foundry
*/

export async function benchmarkLoopFn(iterations, fn, name, ...args) {
  const f = () => fn(...args);
  Object.defineProperty(f, "name", {value: `${name}`, configurable: true});
  await foundry.utils.benchmark(f, iterations, ...args);
}

export async function benchmarkLoop(iterations, thisArg, fn, ...args) {
  const f = () => thisArg[fn](...args);
  Object.defineProperty(f, "name", {value: `${thisArg.name || thisArg.constructor.name}.${fn}`, configurable: true});
  await foundry.utils.benchmark(f, iterations, ...args);
}

export function randomPoint(max_coord) {
  return { x: Math.floor(Math.random() * max_coord),
           y: Math.floor(Math.random() * max_coord) };
}

export function announceBenchGroup(description) {
  console.log(`\nBenchmarking Group: ${description}\n----------\n`);
}

export function spacer() {
  console.log(`----------`);
}


function quantile(arr, q) {
    arr.sort((a, b) => a - b);
    if(!q.length) { return q_sorted(arr, q); }

    const out = {};
    for(let i = 0; i < q.length; i += 1){
      const q_i = q[i];
      out[q_i] = q_sorted(arr, q_i);
    }

    return out;
}

function q_sorted(arr, q) {
  const pos = (arr.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (arr[base + 1] !== undefined) {
     return arr[base] + rest * (arr[base + 1] - arr[base]);
  }
  return arr[base];
}


function precision(n, digits = 2) {
  return Math.round(n * Math.pow(10, digits)) / Math.pow(10, digits);
}



 /**
  * Benchmark a function, first calling the setup function before each iteration.
  * @param {number} iterations    Number of repetitions. Will add an addition 10% warmup.
  * @param {Function} setup_fn    Function to call before each iteration.
  *                               Should take single parameter setup_args.
  *                               Should return an array of parameters to fn
  * @param {Function} fn          Function to benchmark.
  * @param {string} name          Name/identifier to display in console log
  * @param {Object} setup_args    Arguments to pass to setup_fn.
  * @param {Object} ...args       Additional arguments to pass to fn
  */
export function QBenchmarkLoop(iterations, setup, thisArg, fn_name, setup_args, ...args) {
  const name = `${thisArg.name || thisArg.constructor.name}.${fn_name}`;
  const fn = (...args) => thisArg[fn_name](...args);
  QBenchmarkLoopFn(iterations, setup, fn, name, setup_args, ...args);
}


export function QBenchmarkLoopFn(iterations, setup_fn, fn, name, setup_args, ...args) {
  const timings = [];

  const warmup = iterations / 10;
  const total_iter = iterations + warmup;
  for(let i = 0; i < total_iter; i += 1) {
    if(i % (iterations / 10) === 0) { console.log("..."); }
    const data = setup_fn(setup_args);
    const t0 = performance.now();
    fn.apply(null, [...data, ...args]);
    const t1 = performance.now();

    if(i > warmup) { timings.push(t1 - t0); }
  }

  const sum = timings.reduce((prev, curr) => prev + curr);
  const q = quantile(timings, [.1, .5, .9]);

  console.log(`${name} | ${iterations} iterations | ${precision(sum, 4)}ms | ${precision(sum / iterations, 4)}ms per | 10/50/90: ${precision(q[.1], 4)} / ${precision(q[.5], 4)} / ${precision(q[.9], 4)}`);

//  return timings;

}
