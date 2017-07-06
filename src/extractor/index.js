import fs from "fs";
import { createFilter } from "rollup-pluginutils";
import extract from "./extract";

export { extract };

const stringChars = ["\"", "'", "`"];

// Strip pliny calls out of a source file and deposit them into a separate file.
export function carve (source, libFile, docFile, callback) {
  fs.readFile(source, "utf-8", function (err, txt) {
    var output = this.extract(txt);
    this.write(libFile, docFile, output, callback);
  });
}

export function write(libFile, outputLeft, docFile, outputRight, callback) {
  if(docFile) {
    if(!outputRight) {
      console.warn("no documentation to write to " + docFile);
    }
    else{
      callback = (function(cb) {
        fs.writeFile(docFile, outputRight, cb);
      }.bind(null, callback));
    }
  }
  fs.writeFile(libFile, outputLeft, callback);
}

export function rollupPlugin(options) {
  options = options || {};

  var filter = createFilter( options.include, options.exclude ),
    documentation = "";

  return {
    name: "pliny",

    transform ( code, id ) {
      if (filter(id) && !/package\.json$/.test(id) && code.indexOf("pliny") > -1) {
        var obj = extract(code);
        documentation = obj.right;
        return obj.left;
      }
    },

    onwrite(options) {
      var docFile = options.dest.replace(/(\.min)?(\.\w+)$/,  ".doc$2");
      return new Promise(function(resolve, reject) {
        if(!documentation) {
          console.warn("no documentation to write to " + docFile);
          resolve(options.dest);
        }
        else{
          fs.writeFile(docFile, documentation, function(){
            resolve(options.dest);
          });
        }
      });
    }
  };
};
