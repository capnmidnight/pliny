import markdown from "marked";
import FormatWriter from "./FormatWriter";
import openBag from "../openBag";

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
  }
  else {
    return maybeName;
  }
}


// Make HTML that can be written out to a page
export default class HTMLFormatter extends FormatWriter {

  format(database, name) {
    var obj = resolveBag(database, name);
    return `<section id="${obj.id}" class="${obj.fieldType}"><article>${super.format(database, obj)}</article></section>`;
  }

  /////
  // Puts together a string that describes a top-level field out of a documentation
  // object.
  //
  // @param {Object} obj - the documentation object out of which we're retrieving the field.
  // @param {String} p - the name of the field we're retrieving out of the documentation object.
  // @return {String} - a description of the field.
  ///
  formatField(obj, propertyName, value) {
    var output = "";
    if (obj.fieldType === "enumeration" && propertyName === "values") {
      output += this.formatEnumeration(obj, propertyName, value);
    }
    else if (value instanceof Array) {
      output += this.formatArray(obj, propertyName, value);
    }
    else if (propertyName === "parent") {
      var box = pliny.get(value);
      output += `<p>Contained in <a href="index.html#${box.id}"><code>${value}</code></a></p>`;
    }
    else if (propertyName === "description") {
      output += markdown(value);
    }
    else if (propertyName === "returns") {
      output += `<h3>Return value</h3>${markdown(value)}`;
    }
    else {
      output += `<dl><dt>${propertyName}</dt><dd>${value}</dd></dl>`;
    }
    return output;
  }

  ////
  // Specific fomratting function for Enumerations
  //
  // @param {Object} obj - the documentation object from which to read an array.
  // @param {String} arrName - the name of the array to read from the documentation object.
  // @param {Array} arr - the array from which we're reading values.
  // @return {String} - the formatted description of the array.
  formatEnumeration(obj, arrName, arr) {
    var output = "<table><thead><tr><th>Name</th><th>Value</th><tr><thead><tbody>";
    for (var i = 0; i < arr.length; ++i) {
      var e = arr[i];
      output += `<tr><td>${e.name}</td><td>${e.description}</td></tr>`;
    }
    output += "</tbody></table>";
    return output;
  }

  ////
  // Specific formatting function for Code Example.
  //
  // @param {Array} arr - an array of objects defining programming examples.
  // @return {String} - a summary/details view of the programming examples.
  examplesFormat(obj, arr) {
    var output = "";
    for (var i = 0; i < arr.length; ++i) {
      var ex = arr[i];
      output += `<div><h3><a href="index.html#${ex.id}">${ex.name}</a></h3>${markdown(ex.description)}</div>`;
    }
    return output;
  }

  ////
  // Specific formatting function for Issues.
  //
  // @param {Array} arr - an array of objects defining issues.
  // @return {String} - a summary/details view of the issues.
  issuesFormat(obj, arr) {
    var parts = {
      open: "",
      closed: ""
    };
    for (var i = 0; i < arr.length; ++i) {
      var issue = arr[i],
      str = `<div><h3><a href="index.html#${issue.id}">${issue.issueID}: ${issue.name} [${issue.type}]</a></h3>${markdown(issue.description)}</div>`;
      parts[issue.type] += str;
    }
    return `${parts.open}<h2>Closed Issues</h2>${parts.closed}`;
  }

  ////
  // Specific formatting function for Comments section of Issues.
  //
  // @param {Array} arr - an array of objects defining comments.
  // @return {String} - a summary/details view of the comment.
  commentsFormat(obj, arr) {
    var output = "";
    for (var i = 0; i < arr.length; ++i) {
      var comment = arr[i];
      output += `<aside><h3>${comment.name}</h3>${markdown(comment.description)}`;
      if (typeof comment.comments !== "undefined" && comment.comments instanceof Array) {
        output += this.formatArray(comment, "comments", comment.comments);
      }
      output += "</aside>";
    }
    return output;
  }

  /////
  // Puts together lists of parameters for function signatures, as well as
  // lists of properties and methods for classes and the like.
  //
  // @param {Object} obj - the documentation object from which to read an array.
  // @param {String} arrName - the name of the array to read from the documentation object.
  // @param {Array} arr - the array from which we're reading values.
  // @return {String} - the formatted description of the array.
  ///
  formatArray(obj, arrName, arr) {
    var output = "<h2>";
    if (obj.fieldType === "class") {
      if (arrName === "parameters") {
        output += "constructor ";
      }
      else if (arrName === "functions") {
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
    }
    else {
      output += `<ul class="${arrName}">${arr.map(this.formatArrayElement.bind(this, arrName))
      .join("")}</ul>`;
    }
    return output;
  }

  /////
  // For individual elements of an array, formats the element so it fits well
  // on the screen.
  //
  // @param {String} arrName - the name of the array from which we retrieved elements.
  // @param {String} n - one of the array elements.
  // @return {String} - the formatted element, including a newline at the end.
  ///
  formatArrayElement(arrName, n) {
    var s = "<li>";
    if (n.description) {
      var desc = n.description;
      if (n.optional) {
        desc = "(Optional) " + desc;
      }

      if (n.default !== undefined) {
        desc += ` Defaults to <code>${n.default}</code>.`;
      }

      s += `<dl><dt>${this.shortDescription(false, n)}</dt><dd>${markdown(desc)}</dd></dl>`;
    }
    else {
      s += this.shortDescription(false, n);
    }
    s += "</li>";
    return s;
  }

  /////
  // Describe an object by type, name, and parameters (if it's a function-type object).
  // @param {Object} p - the documentation object to describe.
  // @return {String} - the description of the documentation object.
  ///
  shortDescription(topLevel, p) {
    var output = "",
    tag = topLevel ? "h1" : "span",
    isFunction = p.fieldType === "function" || p.fieldType === "method" || p.fieldType === "event",
    isContainer = isFunction || p.fieldType === "class" || p.fieldType === "namespace" || p.fieldType === "enumeration" || p.fieldType === "subClass" || p.fieldType === "record";

    output += `<${tag}>`;
    if (isContainer && !topLevel) {
      output += `<a href="index.html#${p.id}">`;
    }

    output += `<code>${(topLevel && p.fieldType !== "example" && p.fullName || p.name)}`;

    if (p.type) {
      output += ` <span class="type">${p.type}</span>`;
    }

    // But functions and classes take parameters, so they get slightly more.
    if (isFunction) {
      output += `<ol class="signatureParameters">`;
      if (p.parameters) {
        output += p.parameters.map(p => `<li>${p.name}</li>`).join("");
      }
      output += "</ol>";
    }

    if (isContainer && !topLevel) {
      output += "</a>";
    }

    return output + `</code></${tag}>`;
  }

}
