/** Utility functions for benchmarking **/

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
           y: Math.floor(Math.random() * max_coord) }
}

export function announceBenchGroup(description) {
	console.log(`\nBenchmarking Group: ${description}\n----------\n`);
}


