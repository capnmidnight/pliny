pliny.function({
  parent: "Hello",
  name: "World",
  returns: "nothing",
  description: `Jello is good
<pre><code>var hwat = console.log("hello");</code></pre>`,
  parameters: [{
    name: "A",
    type: "Number",
    description: "A number",
    optional: true,
    defaultValue: 17
  },{
    name: "B",
    type: "Number",
    description: "Another number",
    optional: true,
    defaultValue: 19
  }]
});

