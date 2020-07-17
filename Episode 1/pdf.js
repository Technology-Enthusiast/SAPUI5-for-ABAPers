var markdownpdf = require("markdown-pdf")
  , fs = require("fs")
  var options = {
    remarkable: {
        html: true,
        breaks: true,
        plugins: [ require('remarkable-classy') ],
        syntax: [ 'footnote', 'sup', 'sub' ]
    }
}
markdownpdf(options)
.from("Assignment4.md")
  .to("SAPUI5_ABAP_Session4_Assignment.pdf", function () { console.log("Done") });
  markdownpdf(options)
  .from("Solution4.md")
    .to("Refer_SAPUI5_ABAP_Session4_CodeUsedInDemo.pdf", function () { console.log("Done") }) ;
