/** Testing function **/

// see https://web.archive.org/web/20061025015342/http://aymanh.com/9-javascript-tips-you-may-not-know
function AssertException(message) { this.message = message; }
AssertException.prototype.toString = function () {
  return 'AssertException: ' + this.message;
}

export function assert(exp, message) {
  if (!exp) {
    throw new AssertException(message);
  }
}

export function test(description, fn) {
  console.log(`testing ${description}`);
  try { fn(); console.log("PASSED!\n"); } catch(error) { console.log(error); }
}

export function announceGroup(description) {
	console.log(`\nGroup: ${description}\n----------\n`);
}

