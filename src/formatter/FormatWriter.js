// Walks through dot-accessors to retrieve an object out of a root object.
//
// @param {Object} bag - the root object.
// @param {String} name - a period-delimited list of object accessors, naming the object we want to access.
// @returns {Object} - the object we asked for, or undefined, if it doesn't exist.
function openBag(bag, name) {
  // Break up the object path, then recurse through objects until we either run
  // out of objects or find the one we're looking for.
  return name
    .split(".")
    .reduce((obj, p) => obj[p], bag);
}

export default class FormatWriter {
  /////
  // Find a particular object and print out the documentation for it.
  //
  // @param {String} name - a period-delimited list of object accessors, naming the object we want to access.
  ///
  format(database, name) {
    var obj = null;
    if (typeof name === "string" || name instanceof String) {
      obj = openBag(database, name);
    }
    else {
      obj = name;
    }
    if (obj) {
      var output = this.shortDescription(true, obj);

      // The array defines the order in which they will appear.
      output += "\n\n" + ["parent", "description", "parameters", "returns", "errors", "namespaces", "classes", "functions", "values", "events", "properties", "methods", "enumerations", "records", "examples", "issues", "comments"].map((field) =>
          this.checkAndFormatField(obj, field))
        // filter out any lines that returned undefined because they didn't exist
        .filter(v => v)
        // concate them all together
        .join("\n");

      return output;
    }
  }

  checkAndFormatField(obj, prop) {
    var obj2 = obj[prop];
    if (obj2) {
      return this.formatField(obj, prop, obj2);
    }
  }
}
