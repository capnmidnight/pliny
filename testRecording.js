(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Hello = factory());
}(this, (function () { 'use strict';

// BEGIN PLINY

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


function hash(buf) {
  let s1 = 1, s2 = 0;
  buf.split("")
    .forEach((c) => {
      s1 = (s1 + c.charCodeAt(0)) % 32771;
      s2 = (s2 + s1) % 32771;
    });

  return s2 << 8 | s1;
}

/////
// Fills in intermediate levels of an object tree to make the full object tree
// accessible, in the documentation database.
//
// @param {String} name - a period-delimited list of object accessors, naming the object we want to fill in.
// @param {Object} rootObject - the object on which to fill in values.
// @returns {Object} - the leaf-level filled-in object.
///
function fillBag(name) {
  // Start at the top level.
  var bag = database;
  if (typeof name !== "undefined" && name.length > 0) {
    // Break up the object path.
    var parts = name.split("."),

      // We'll be rebuilding the path as we go, so we can name intermediate objects.
      path = "",

      // The first time we extend the path, it doesn't get a period seperator.
      sep = "";
    // Walk through the object tree.
    for (var i = 0; i < parts.length; ++i) {
      // Fill in any missing objects.
      if (typeof bag[parts[i]] === "undefined") {
        bag[parts[i]] = {};
      }

      path += sep + parts[i];
      sep = ".";

      // Drill down into the tree.
      bag = bag[parts[i]];

      // If we have a name, and the object hasn't already been named, then we
      // give it a name.
      if (path.length > 0 && !bag.name) {
        bag.name = path;
      }
    }
  }
  return bag;
}

/////
// Reads the documentation metadata and builds up the documentation database.
//
// @param {String} fieldType - the name of the type of object for which we're reading metadata: function, class, namespace, etc.
// @param {String} info - the metadata object the user provided us.
///
function analyzeObject(fieldType, info) {
  var i;
  // If the user didn't supply a type for the metadata object, we infer it
  // from context.
  if (typeof info.fieldType === 'undefined') {
    info.fieldType = fieldType;
  }

  // Find out where we're going to store the object in the metadata database and where in the parent object we're going to store the documentation object.
  var parentBag = fillBag(info.parent || ""),
  pluralName = fieldType + "s";
  pluralName = pluralName.replace(/ys$/, "ies")
  .replace(/ss$/, "ses");
  if (!parentBag[pluralName]) {
    parentBag[pluralName] = [];
  }
  var arr = parentBag[pluralName];

  // Make sure we haven't already stored an object by this name.
  var found = false;
  for (i = 0; i < arr.length; ++i) {
    if (arr[i].name === info.name) {
      found = true;
    }
  }

  if (!found) {
    var subArrays = {};

    ["examples", "issues", "comments"].forEach(function (k) {
      if (typeof info[k] !== "undefined") {
        subArrays[k] = info[k];
        delete info[k];
      }
    });

    // After we copy the metadata, we get back the documentation database object
    // that will store the fuller data we get from other objects.
    info = copyObjectMetadata(info);

    arr.push(info);

    // Handle other parent-child relationships.
    if (info.fieldType === "class" && info.baseClass) {
      if (info.parent === undefined) {
        info.parent = info.baseClass;
      }
      pliny["subClass"](info);
    }

    for (var k in subArrays) {
      var subArr = subArrays[k],
      type = k.substring(0, k.length - 1);
      for (i = 0; i < subArr.length; ++i) {
        if (subArr[i].parent === undefined) {
          subArr[i].parent = info.fullName.replace(/::/g, ".");
        }
        pliny[type](subArr[i]);
      }
    }
  }
}

/////
// Copies all of the data the user entered for metadata to the documetation
// object in the documentation database.
//
// @param {String} name - a period-delimited list of object accessors, naming the documentation object we want to create.
// @param {Object} info - the metadata object from the user.
// @returns the documentation object that we created.
///
function copyObjectMetadata(info) {
  var fullName = (info.parent && info.parent + "." || "") + info.name,
  bag = fillBag(fullName);

  // Make sure we aren't setting the data for a second time.
  if (!bag.fieldType) {

    // Copy all the fields! ALL THE FIELDS!
    // TODO: don't copy metadata directly to bag object. The bag objects are used
    // as the search path for finding code objects, and some of the metadata field
    // names might clash with code object field names. Maybe have a new metadata
    // table.
    for (var k in info) {
      bag[k] = info[k];
    }

    // The fullName is used in titles on documentation articles.
    if (!bag.fullName) {
      if (bag.fieldType === "issue") {
        Object.defineProperty(bag, "issueID", {
          get: function get() {
            return hash(this.parent + "." + this.name);
          }
        });
      }
      Object.defineProperty(bag, "fullName", {
        get: function get() {
          var output = "";
          if (this.parent) {
            output += this.parent;

            // Print the seperator between the parent identifier and the name of
            // the object.
            if (this.fieldType === "method" || this.fieldType === "property" || this.fieldType === "event") {
              // Methods, properties, and events aren't invokable from their class
              // objects, so print them in a different way that doesn't suggest you
              // can dot-access them. I'm using the typical C++ notation for member
              // fields here.
              output += "::";
            }
            else if (this.fieldType === "example" || this.fieldType === "issue") {
              output += ": ";
            }
            else {
              output += ".";
            }
          }
          output += this.name;
          return output;
        }
      });
    }

    // The ID is used to make DOM elements.
    if (!bag.id) {
      Object.defineProperty(bag, "id", {
        get: function get() {
          return this.fullName.replace(/(\.|:)/g, "_")
          .replace(/ /g, "");
        }
      });
    }

    // We try to see if the real object exists yet (whether the documentation
    // before or after the object it is documenting). If it doesn't, then we
    // wait a small amount of time for the rest of the script to execute and
    // then pick up where we left off.
    if (!setContextualHelp(fullName)) {
      // The setTimeout is to allow the script to continue to load after this
      // particular function has called, so that more of the script can be
      // inspected.
      setTimeout(setContextualHelp, 1, fullName);
    }
  }
  return bag;
}

function setEnumerationValues(name) {
  var enumeration = null;
  try {
    enumeration = require(name);
  }
  catch (exp) {
    enumeration = null;
  }
  if (!enumeration) {
    setTimeout(setEnumerationValues, 1, name);
  }
  else {
    for (var key in enumeration) {
      var val = enumeration[key];
      if (enumeration.hasOwnProperty(key) && typeof val === "number") {
        pliny["value"]({
          parent: name,
          name: key,
          type: "Number",
          description: val.toString(),
          value: val
        });
      }
    }
  }
}

const scriptPattern = /\bpliny\s*\.\s*(\w+)/gm;
/////
// Finds the actual object in the scope hierarchy, and looks for contextual scripts that might be defined in this object
//
// @param {String} name - a period-delimited list of object accessors, naming the real object we want to access.
// @returns {Object} - the actual object the name refers to, or undefined if such an object exists.
///
function setContextualHelp(name) {
  // Find the real object
  var obj = openBag(database, name);
  if (obj) {
    if (obj.fieldType === "enumeration") {
      setEnumerationValues(obj.parent + "." + obj.name);
    }
    // Look for contextual scripts
    if (typeof obj === "function") {
      var script = obj.toString(),
      match = null;
      while (!!(match = scriptPattern.exec(script))) {
        var fieldType = match[1],
        start = match.index + match[0].length,
        fieldInfo = getFieldInfo(script.substring(start));
        // Shove in the context.
        if (fieldInfo.parent === undefined) {
          fieldInfo.parent = name;
        }

        // And follow the normal documentation path.
        pliny[fieldType].call(null, fieldInfo);
      }
    }
  }
  return obj;
}

/////
// When a documentation script is included inside of a function, we need to
// read the script and parse out the JSON objects so we can later execute
// the documentation function safely, i.e. not use eval().
//
// @param {String} script - the source code of the containing function.
// @return {Array} - a list of JSON-parsed objects that are the parameters specified at the documentation function call-site (i.e. sans context)
///
function getFieldInfo(script) {
  var parameters = [],
  start = 0,
  scopeLevel = 0,
  inString = false,
  stringToken = null;

  // Walk over the script...
  for (var i = 0; i < script.length; ++i) {
    // ... a character at a time
    var c = script.charAt(i);

    // Keep track of whether or not we're in a string. We're looking for any
    // quotation marks that are either at the beginning of the string or have
    // not previously been escaped by a backslash...
    if ((inString && c === stringToken || !inString && (c === '"' || c === "'")) && (i === 0 || script.charAt(i - 1) !== '\\')) {
      inString = !inString;
      if (inString) {
        stringToken = c;
      }
    }

    // ... because only then...
    if (!inString) {
      // ... can we change scope level. We're only supporting JSON objects,
      // so no need to go any further than this.
      if (c === '(' || c === '{' || c === '[') {
        ++scopeLevel;
      }
      else if (c === ')' || c === '}' || c === ']') {
        --scopeLevel;
      }
    }

    // If we've exited the parameter list, or we're inside the parameter list
    // and see a comma that is not inside of a string literal...
    if (scopeLevel === 0 || scopeLevel === 1 && c === ',' && !inString) {
      // ... save the parameter, skipping the first character because it's always
      // either the open paren for the parameter list or one of the commas
      // between parameters.
      parameters.push(parseParameter(script.substring(start + 1, i)
        .trim()));

      // Advance forward the start of the next token.
      start = i;

      // If we left the parameter list, we've found all of the parameters and
      // can quit out of the loop before we get to the end of the script.
      if (scopeLevel === 0) {
        break;
      }
    }
  }
  if (parameters.length !== 1) {
    throw new Error("There should have only been one parameter to the function");
  }
  return parameters[0];
}

/////
// When we've found an individual parameter to a documentation function in a
// contextual scope, we need to make sure it's valid JSON before we try to
// convert it to a real JavaScript object.
//
// @param {String} script - the subscript portion that refers to a single parameter.
// @return {Object} - the value that the string represents, parsed with JSON.parse().
///
function parseParameter(script) {
  // Make sure all hash key labels are surrounded in quotation marks.
  const stringLiterals = [],
    litReplace = (str) => {
      var name = "&STRING_LIT" + stringLiterals.length + ";";
      if (str[0] === "'") {
        str = str.replace(/\\"/g, "&_DBLQUOTE_;")
        .replace(/\\'/g, "&_SGLQUOTE_;")
        .replace(/"/g, "\\\"")
        .replace(/'/g, "\"")
        .replace(/&_DBLQUOTE_;/g, "\\\"")
        .replace(/&_SGLQUOTE_;/g, "\\'");
      }
      stringLiterals.push(str);
      return name;
    },
    litReturn = (a, b) => stringLiterals[b],
      param = script.replace(/'(\\'|[^'])+'/g, litReplace)
        .replace(/"(\\"|[^"])+"/g, litReplace)
        .replace(/\b(\w+)\b\s*:/g, "\"$1\":")
        .replace(/&STRING_LIT(\d+);/g, litReturn)
        .replace(/&STRING_LIT(\d+);/g, litReturn)
        .replace(/\\\r?\n/g, "");
  return JSON.parse(param);
}

  // The default storage location.
const database = {
  fieldType: "database",
  fullName: "[Global]",
  id: "Global",
  description: "These are the elements in the global namespace."
};

// Create documentation functions for each of the supported types of code objects.
const recorders = [
  "namespace",
  "event",
  "function",
  "value",
  "class",
  "property",
  "method",
  "enumeration",
  "record",
  "subClass",
  "example",
  "error",
  "issue",
  "comment"
].reduce(function (obj, k) {
  obj[k] = analyzeObject.bind(null, k);
  return obj;
}, {});

const pliny = Object.assign({

}, recorders, {
  database,
  get(id) {
    return openBag(database, id);
  }
});



// END PLINY

const Hello = {
  World(){
    console.log("Hello, world");
  }
};

return Hello;

})));
