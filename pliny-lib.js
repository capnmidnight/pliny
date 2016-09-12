////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\pliny\src\pliny.js
(function(){"use strict";

/*
 * Copyright (C) 2016 Sean T. McBeth
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

////////////////////////////////////////////////////////////////////////////
// Pliny's author is not smart enough to figure out how to make it        //
// possible to use it to document itself, so here's a bunch of comments.  //
////////////////////////////////////////////////////////////////////////////


// Pliny is a documentation construction system. You create live documentation
// objects on code assets with pliny, then you read back those documentation objects
// with pliny.
//
// Pliny is also capable of generating HTML output for your documentation.
//
// Pliny is named after Gaius Plinius Secundus (https://en.wikipedia.org/wiki/Pliny_the_Elder),
// a scholar and hero, who died trying to save people from the eruption of Mount
// Vesuvius during the destruction of Pompeii. Also, his nephew Gaius Plinius Caecilius Secundus
// (https://en.wikipedia.org/wiki/Pliny_the_Younger), through whom we know his uncle.

// Walks through dot-accessors to retrieve an object out of a root object.
//
// @param {Object} bag - the root object.
// @param {String} name - a period-delimited list of object accessors, naming the object we want to access.
// @returns {Object} - the object we asked for, or undefined, if it doesn't exist.
function openBag(bag, name) {
  // Break up the object path
  return name.split(".")
  // Recurse through objects until we either run out of objects or find the
  // one we're looking for.
  .reduce(function (obj, p) {
    return obj[p];
  }, bag);
}

var pliny = function (require, module) {
  "use strict";

  var markdown = require("marked");

  // The default storage location.
  var database = {
    fieldType: "database",
    fullName: "[Global]",
    id: "Global",
    description: "These are the elements in the global namespace."
  };

  function hash(buf) {
    var s1 = 1,
        s2 = 0,
        buffer = buf.split("").map(function (c) {
      return c.charCodeAt(0);
    });

    for (var n = 0; n < buffer.length; ++n) {
      s1 = (s1 + buffer[n]) % 32771;
      s2 = (s2 + s1) % 32771;
    }
    return s2 << 8 | s1;
  }

  // Figures out if the maybeName parameter is a bag or a string path to a bag,
  // then either gives you back the bag, or finds the bag that the path refers to
  // and gives you that.
  //
  // @param {Object} bag - the root object.
  // @param {String} maybeName - a period-delimited list of object accessors, naming the object we want to access.
  // @returns {Object} - the object we asked for, or undefined, if it doesn't exist.
  function resolveBag(bag, maybeName) {
    if (typeof maybeName === "string" || maybeName instanceof String) {
      return openBag(bag, maybeName);
    } else {
      return maybeName;
    }
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
    pluralName = pluralName.replace(/ys$/, "ies").replace(/ss$/, "ses");
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
        pliny.subClass(info);
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
              } else if (this.fieldType === "example" || this.fieldType === "issue") {
                output += ": ";
              } else {
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
            return this.fullName.replace(/(\.|:)/g, "_").replace(/ /g, "");
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
    } catch (exp) {
      enumeration = null;
    }
    if (!enumeration) {
      setTimeout(setEnumerationValues, 1, name);
    } else {
      for (var key in enumeration) {
        var val = enumeration[key];
        if (enumeration.hasOwnProperty(key) && typeof val === "number") {
          pliny.value({
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

  var scriptPattern = /\bpliny\s*\.\s*(\w+)/gm;
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
        } else if (c === ')' || c === '}' || c === ']') {
          --scopeLevel;
        }
      }

      // If we've exited the parameter list, or we're inside the parameter list
      // and see a comma that is not inside of a string literal...
      if (scopeLevel === 0 || scopeLevel === 1 && c === ',' && !inString) {
        // ... save the parameter, skipping the first character because it's always
        // either the open paren for the parameter list or one of the commas
        // between parameters.
        parameters.push(parseParameter(script.substring(start + 1, i).trim()));

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

  ////
  // useful in cases where a functional system really just needs to check the
  // value of a collection.
  ///
  function identity(v) {
    return v;
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
    var stringLiterals = [];
    var litReplace = function litReplace(str) {
      var name = "&STRING_LIT" + stringLiterals.length + ";";
      if (str[0] === "'") {
        str = str.replace(/\\"/g, "&_DBLQUOTE_;").replace(/\\'/g, "&_SGLQUOTE_;").replace(/"/g, "\\\"").replace(/'/g, "\"").replace(/&_DBLQUOTE_;/g, "\\\"").replace(/&_SGLQUOTE_;/g, "\\'");
      }
      stringLiterals.push(str);
      return name;
    };
    var litReturn = function litReturn(a, b) {
      return stringLiterals[b];
    };
    var param = script.replace(/'(\\'|[^'])+'/g, litReplace).replace(/"(\\"|[^"])+"/g, litReplace).replace(/\b(\w+)\b\s*:/g, "\"$1\":").replace(/&STRING_LIT(\d+);/g, litReturn).replace(/&STRING_LIT(\d+);/g, litReturn).replace(/\\\r?\n/g, "");
    return JSON.parse(param);
  }

  // A collection of different ways to output documentation data.
  var formatters = {
    /////
    // Find a particular object and print out the documentation for it.
    //
    // @param {String} name - a period-delimited list of object accessors, naming the object we want to access.
    ///
    format: function format(name) {
      var obj = null;
      if (typeof name === "string" || name instanceof String) {
        obj = openBag(database, name);
      } else {
        obj = name;
      }
      if (obj) {
        var output = this.shortDescription(true, obj);

        // The array defines the order in which they will appear.
        output += "\n\n" + ["parent", "description", "parameters", "returns", "errors", "namespaces", "classes", "functions", "values", "events", "properties", "methods", "enumerations", "records", "examples", "issues", "comments"].map(formatters.checkAndFormatField.bind(this, obj))
        // filter out any lines that returned undefined because they didn't exist
        .filter(identity)
        // concate them all together
        .join("\n");
        return output;
      }
    },
    checkAndFormatField: function checkAndFormatField(obj, prop) {
      var obj2 = obj[prop];
      if (obj2) {
        return this.formatField(obj, prop, obj2);
      }
    }
  };
  // Make HTML that can be written out to a page
  formatters.html = {
    format: function format(name) {
      var obj = resolveBag(database, name);
      return "<section id=\"" + obj.id + "\" class=\"" + obj.fieldType + "\"><article>" + formatters.format.call(formatters.html, obj) + "</article></section>";
    },
    /////
    // Puts together a string that describes a top-level field out of a documentation
    // object.
    //
    // @param {Object} obj - the documentation object out of which we're retrieving the field.
    // @param {String} p - the name of the field we're retrieving out of the documentation object.
    // @return {String} - a description of the field.
    ///
    formatField: function formatField(obj, propertyName, value) {
      var output = "";
      if (obj.fieldType === "enumeration" && propertyName === "values") {
        output += this.formatEnumeration(obj, propertyName, value);
      } else if (value instanceof Array) {
        output += this.formatArray(obj, propertyName, value);
      } else if (propertyName === "parent") {
        output += "<p>Contained in <a href=\"index.html#" + pliny.get(value).id + "\"><code>" + value + "</code></a></p>";
      } else if (propertyName === "description") {
        output += markdown(value);
      } else if (propertyName === "returns") {
        output += "<h3>Return value</h3>" + markdown(value);
      } else {
        output += "<dl><dt>" + propertyName + "</dt><dd>" + value + "</dd></dl>";
      }
      return output;
    },
    ////
    // Specific fomratting function for Enumerations
    //
    // @param {Object} obj - the documentation object from which to read an array.
    // @param {String} arrName - the name of the array to read from the documentation object.
    // @param {Array} arr - the array from which we're reading values.
    // @return {String} - the formatted description of the array.
    formatEnumeration: function formatEnumeration(obj, arrName, arr) {
      var output = "<table><thead><tr><th>Name</th><th>Value</th><tr><thead><tbody>";
      for (var i = 0; i < arr.length; ++i) {
        var e = arr[i];
        output += "<tr><td>" + e.name + "</td><td>" + e.description + "</td></tr>";
      }
      output += "</tbody></table>";
      return output;
    },
    ////
    // Specific formatting function for Code Example.
    //
    // @param {Array} arr - an array of objects defining programming examples.
    // @return {String} - a summary/details view of the programming examples.
    examplesFormat: function examplesFormat(obj, arr) {
      var output = "";
      for (var i = 0; i < arr.length; ++i) {
        var ex = arr[i];
        output += "<div><h3><a href=\"index.html#" + ex.id + "\">" + ex.name + "</a></h3>" + markdown(ex.description) + "</div>";
      }
      return output;
    },
    ////
    // Specific formatting function for Issues.
    //
    // @param {Array} arr - an array of objects defining issues.
    // @return {String} - a summary/details view of the issues.
    issuesFormat: function issuesFormat(obj, arr) {
      var parts = {
        open: "",
        closed: ""
      };
      for (var i = 0; i < arr.length; ++i) {
        var issue = arr[i],
            str = "<div><h3><a href=\"index.html#" + issue.id + "\">" + issue.issueID + ": " + issue.name + " [" + issue.type + "]</a></h3>" + markdown(issue.description) + "</div>";
        parts[issue.type] += str;
      }
      return parts.open + "<h2>Closed Issues</h2>" + parts.closed;
    },
    ////
    // Specific formatting function for Comments section of Issues.
    //
    // @param {Array} arr - an array of objects defining comments.
    // @return {String} - a summary/details view of the comment.
    commentsFormat: function commentsFormat(obj, arr) {
      var output = "";
      for (var i = 0; i < arr.length; ++i) {
        var comment = arr[i];
        output += "<aside><h3>" + comment.name + "</h3>" + markdown(comment.description);
        if (typeof comment.comments !== "undefined" && comment.comments instanceof Array) {
          output += this.formatArray(comment, "comments", comment.comments);
        }
        output += "</aside>";
      }
      return output;
    },
    /////
    // Puts together lists of parameters for function signatures, as well as
    // lists of properties and methods for classes and the like.
    //
    // @param {Object} obj - the documentation object from which to read an array.
    // @param {String} arrName - the name of the array to read from the documentation object.
    // @param {Array} arr - the array from which we're reading values.
    // @return {String} - the formatted description of the array.
    ///
    formatArray: function formatArray(obj, arrName, arr) {
      var output = "<h2>";
      if (obj.fieldType === "class") {
        if (arrName === "parameters") {
          output += "constructor ";
        } else if (arrName === "functions") {
          output += "static ";
        }
      }

      if (arrName !== "description") {
        output += arrName;
      }

      output += "</h2>";

      var formatterName = arrName + "Format";
      if (this[formatterName]) {
        output += this[formatterName](obj, arr);
      } else {
        output += "<ul class=\"" + arrName + "\">" + arr.map(this.formatArrayElement.bind(this, arrName)).join("") + "</ul>";
      }
      return output;
    },
    /////
    // For individual elements of an array, formats the element so it fits well
    // on the screen. Elements that are supposed to be inline, but have the ability
    // to be drilled-down into, are truncated if they get to be more than 200
    // characters wide.
    //
    // @param {String} arrName - the name of the array from which we retrieved elements.
    // @param {String} n - one of the array elements.
    // @return {String} - the formatted element, including a newline at the end.
    ///
    formatArrayElement: function formatArrayElement(arrName, n) {
      var s = "<li>";
      if (n.description) {
        var desc = n.description.match(/^(([^\n](\n[^\n])?)+)\n\n/);
        if (desc) {
          desc = desc[1] + "...";
        } else {
          desc = n.description;
        }

        if (n.optional) {
          desc = "(Optional) " + desc;
        }

        if (n.default !== undefined) {
          desc += " Defaults to <code>" + n.default + "</code>.";
        }

        s += "<dl><dt>" + this.shortDescription(false, n) + "</dt><dd>" + markdown(desc) + "</dd></dl>";
      } else {
        s += this.shortDescription(false, n);
      }
      s += "</li>";
      return s;
    },
    /////
    // Describe an object by type, name, and parameters (if it's a function-type object).
    // @param {Object} p - the documentation object to describe.
    // @return {String} - the description of the documentation object.
    ///
    shortDescription: function shortDescription(topLevel, p) {
      var output = "",
          tag = topLevel ? "h1" : "span",
          isFunction = p.fieldType === "function" || p.fieldType === "method" || p.fieldType === "event",
          isContainer = isFunction || p.fieldType === "class" || p.fieldType === "namespace" || p.fieldType === "enumeration" || p.fieldType === "subClass" || p.fieldType === "record";

      output += "<" + tag + ">";
      if (isContainer && !topLevel) {
        output += "<a href=\"index.html#" + p.id + "\">";
      }

      output += "<code>" + (topLevel && p.fieldType !== "example" && p.fullName || p.name);

      if (p.type) {
        output += " <span class=\"type\">" + p.type + "</span>";
      }

      // But functions and classes take parameters, so they get slightly more.
      if (isFunction) {
        output += "<ol class=\"signatureParameters\">";
        if (p.parameters) {
          output += "<li>" + p.parameters.map(function (p) {
            return p.name;
          }).join("</li><li>") + "</li>";
        }
        output += "</ol>";
      }

      if (isContainer && !topLevel) {
        output += "</a>";
      }

      return output + "</code></" + tag + ">";
    }
  };

  // Output to the Developer console in the browser directly.
  formatters.console = {
    format: function format(name) {
      return formatters.format.call(formatters.console, name);
    },
    /////
    // Puts together a string that describes a top-level field out of a documentation
    // object.
    //
    // @params {Object} obj - the documentation object out of which we're retrieving the field.
    // @params {String} p - the name of the field we're retrieving out of the documentation object.
    // @return {String} - a description of the field.
    ///
    formatField: function formatField(obj, propertyName, value) {
      if (value instanceof Array) {
        return this.formatArray(obj, propertyName, value);
      } else if (propertyName === "description") {
        return "\t" + value + "\n";
      } else {
        return "\t" + propertyName + ": " + value + "\n";
      }
    },
    /////
    // Puts together lists of parameters for function signatures, as well as
    // lists of properties and methods for classes and the like.
    //
    // @param {Object} obj - the documentation object from which to read an array.
    // @param {String} arrName - the name of the array to read from the documentation object.
    // @return {String} - the formatted description of the array.
    ///
    formatArray: function formatArray(obj, arrName, arr) {
      var output = "\t";
      if (obj.fieldType === "class") {
        if (arrName === "parameters") {
          output += "constructor ";
        } else if (arrName === "functions") {
          output += "static ";
        }
      }

      if (arrName !== "description") {
        output += arrName + ":\n";
      }

      if (arr instanceof Array) {
        output += arr.map(this.formatArrayElement.bind(this, arrName)).join("");
      } else {
        output += arr;
      }
      return output;
    },
    /////
    // For individual elements of an array, formats the element so it fits well
    // on the screen. Elements that are supposed to be inline, but have the ability
    // to be drilled-down into, are truncated if they get to be more than 200
    // characters wide.
    //
    // @param {String} arrName - the name of the array from which we retrieved elements.
    // @param {String} n - one of the array elements.
    // @param {Number} i - the index of the element in the array.
    // @return {String} - the formatted element, including a newline at the end.
    ///
    formatArrayElement: function formatArrayElement(arrName, n, i) {
      var s = "\t\t" + i + ": " + this.shortDescription(false, n);
      if (n.description) {
        s += " - " + n.description;

        if (arrName !== "parameters" && arrName !== "properties" && arrName !== "methods" && s.length > 200) {
          s = s.substring(0, 200) + "...";
        }
      }
      s += "\n";
      return s;
    },
    /////
    // Describe an object by type, name, and parameters (if it's a function-type object).
    // @param {Object} p - the documentation object to describe.
    // @return {String} - the description of the documentation object.
    ///
    shortDescription: function shortDescription(topLevel, p) {
      // This is the basic description that all objects get.
      var output = "";
      if (topLevel || p.type) {
        output += "[" + (p.type || p.fieldType) + "] ";
      }

      output += topLevel ? p.fullName : p.name;

      // But functions and classes take parameters, so they get slightly more.
      if (p.fieldType === "function" || p.fieldType === "method") {
        output += "(";
        if (p.parameters) {
          output += p.parameters.map(this.shortDescription.bind(this, false)).join(", ");
        }
        output += ")";
      }

      return output;
    }
  };

  // The namespacing object we're going to return to the importing script.
  var pliny = formatters.console.format;
  // Give the user access to the database.
  pliny.database = database;
  // Give the user access to all of the formatters.
  pliny.formats = formatters;
  // Just get the raw data
  pliny.get = openBag.bind(null, pliny.database);
  // Forward on the markdown functionality
  pliny.markdown = markdown;
  // Strip pliny calls out of a source file and deposit them into a separate file.
  pliny.carve = function (source, libFile, docFile, callback) {
    var fs = require("fs");
    fs.readFile(source, "utf-8", function (err, txt) {
      var test = /pliny\.\w+/g,
          left = 0,
          outputLeft = "",
          outputRight = "",
          matches = test.exec(txt);
      while (matches) {
        var sub = txt.substring(left, matches.index);
        outputLeft += sub;
        var depth = 0,
            inString = false,
            found = false;
        for (left = matches.index + matches.length; left < txt.length; ++left) {
          if (txt[left] === "\"" && (left === 0 || txt[left - 1] !== "\\")) {
            inString = !inString;
          }
          if (!inString) {
            if (txt[left] === "(") {
              found = true;
              ++depth;
            } else if (txt[left] === ")") {
              --depth;
            }
          }
          if (depth === 0 && found) {
            break;
          }
        }
        while (left < txt.length && /[;\) \r\n]/.test(txt[left])) {
          left++;
        }

        outputRight += txt.substring(matches.index, left);
        matches = test.exec(txt);
      }
      outputLeft += txt.substring(left);
      fs.writeFile(libFile, outputLeft, function () {
        fs.writeFile(docFile, outputRight, callback);
      });
    });
  };

  // Create documentation functions for each of the supported types of code objects.
  ["namespace", "event", "function", "value", "class", "property", "method", "enumeration", "record", "subClass", "example", "error", "issue", "comment"].forEach(function (k) {
    pliny[k] = pliny[k] || analyzeObject.bind(null, k);
  });

  if (module) {
    module.exports = pliny;
  }

  return pliny;
}(typeof require !== 'undefined' && require || openBag.bind(null, window), typeof module !== "undefined" && module);
    if(typeof window !== "undefined") window.pliny = pliny;
})();
    // end D:\Documents\VR\pliny\src\pliny.js
    ////////////////////////////////////////////////////////////////////////////////
console.info("pliny v3.3.4. see https://github.com/capnmidnight/pliny for more information.");