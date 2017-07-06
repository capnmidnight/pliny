import FormatWriter from "./FormatWriter";

// Output to the Developer console in the browser directly.
export default class ConsoleFormatter extends FormatWriter {

  /////
  // Puts together a string that describes a top-level field out of a documentation
  // object.
  //
  // @params {Object} obj - the documentation object out of which we're retrieving the field.
  // @params {String} p - the name of the field we're retrieving out of the documentation object.
  // @return {String} - a description of the field.
  ///
  formatField(obj, propertyName, value) {
    if (value instanceof Array) {
      return this.formatArray(obj, propertyName, value);
    }
    else if (propertyName === "description") {
      return "\t" + value + "\n";
    }
    else {
      return "\t" + propertyName + ": " + value + "\n";
    }
  }

  /////
  // Puts together lists of parameters for function signatures, as well as
  // lists of properties and methods for classes and the like.
  //
  // @param {Object} obj - the documentation object from which to read an array.
  // @param {String} arrName - the name of the array to read from the documentation object.
  // @return {String} - the formatted description of the array.
  ///
  formatArray(obj, arrName, arr) {
    var output = "\t";
    if (obj.fieldType === "class") {
      if (arrName === "parameters") {
        output += "constructor ";
      }
      else if (arrName === "functions") {
        output += "static ";
      }
    }

    if (arrName !== "description") {
      output += arrName + ":\n";
    }

    if (arr instanceof Array) {
      output += arr.map(this.formatArrayElement.bind(this, arrName))
      .join("");
    }
    else {
      output += arr;
    }
    return output;
  }

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
  formatArrayElement(arrName, n, i) {
    var s = "\t\t" + i + ": " + this.shortDescription(false, n);
    if (n.description) {
      s += " - " + n.description;

      if (arrName !== "parameters" && arrName !== "properties" && arrName !== "methods" && s.length > 200) {
        s = s.substring(0, 200) + "...";
      }
    }
    s += "\n";
    return s;
  }

  /////
  // Describe an object by type, name, and parameters (if it's a function-type object).
  // @param {Object} p - the documentation object to describe.
  // @return {String} - the description of the documentation object.
  ///
  shortDescription(topLevel, p) {
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
        output += p.parameters.map(this.shortDescription.bind(this, false))
        .join(", ");
      }
      output += ")";
    }

    return output;
  }

}
