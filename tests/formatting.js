import pliny from "../src/client";
import formats from "../src/formatter";

window.pliny = pliny;
window.formats = formats;

fetch("./testRecording.doc.js")
  .then(res => res.text())
  .then(eval)
  .then(() => document.body.innerHTML = formats.html(pliny.database, "Hello.World"));
