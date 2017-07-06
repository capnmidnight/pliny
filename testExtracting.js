(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

function extract(txt){

  txt = txt.replace(/import \w+ from "pliny"/g, "");

  var test = /pliny\.\w+/g,
    left = 0,
    outputLeft = "",
    outputRight = "",

    startLib = /\s*\/\/ BEGIN PLINY\s*/,
    startLibMatch = txt.match(startLib),
    endLib = /\s*\/\/ END PLINY\s*/,
    endLibMatch = txt.match(endLib);

  if(startLibMatch && endLibMatch) {

    var startLibLength = startLibMatch[0].length,
      startLibIndex = startLibMatch.index,
      startLibEnd = startLibIndex + startLibLength,
      endLibLength = endLibMatch[0].length,
      endLibStart = endLibMatch.index,
      endLibIndex = endLibStart + endLibLength;

    if(0 <= startLibIndex && startLibIndex <= endLibIndex && endLibIndex < txt.length) {
      txt = txt.substring(0, startLibIndex) + txt.substring(endLibIndex);
    }
  }

  var matches = test.exec(txt),
    stringDelims = ['"', "'", "`"];
  while (matches) {
    var sub = txt.substring(left, matches.index),
      depth = 0,
      inString = false,
      curDelim = null,
      found = false;

    outputLeft += sub;

    for (left = matches.index + matches.length; left < txt.length; ++left) {
      const curChar = txt[left],
        delimIdx = stringDelims.indexOf(curChar),
        stringStarted = !inString && delimIdx > -1,
        stringEnded = inString && curChar === curDelim,
        escaped = left > 0 && txt[left - 1] === "\\";

      if ((stringStarted || stringEnded) && !escaped) {
        inString = !inString;
        if(inString) {
          curDelim = curChar;
        }
        else{
          curDelim = null;
        }
      }

      if (!inString) {
        if (txt[left] === "(") {
          found = true;
          ++depth;
        }
        else if (txt[left] === ")") {
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
  return {
    left: outputLeft,
    right: outputRight
  };
}

var pre = document.querySelector("pre");

function _print(txt) {
  pre.appendChild(document.createTextNode(txt));
}

function println(obj) {
  _print(JSON.stringify(obj, null, 2));
  _print("\n");
}

fetch("testExtractingShim.js")
  .then(res => res.text())
  .then(extract)
  .then((obj) => {
    println(obj.left);
    println(obj.right);
  });

})));
