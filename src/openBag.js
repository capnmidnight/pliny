// BEGIN PLINY

// Walks through dot-accessors to retrieve an object out of a root object.
//
// @param {Object} bag - the root object.
// @param {String} name - a period-delimited list of object accessors, naming the object we want to access.
// @returns {Object} - the object we asked for, or undefined, if it doesn't exist.
export default function openBag(bag, name) {
  // Break up the object path, then recurse through objects until we either run
  // out of objects or find the one we're looking for.
  return name
    .split(".")
    .reduce((obj, p) => obj[p], bag);
}
