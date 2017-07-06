import pliny from "../src/extractor/extract";

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
  .then(pliny)
  .then((obj) => {
    println(obj.left);
    println(obj.right);
  });
