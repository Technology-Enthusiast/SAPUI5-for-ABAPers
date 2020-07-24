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
.from("Assignment5.md")
  .to("SAPUI5_ABAP_Session5_Assignment.pdf", function () { console.log("Done") });
  markdownpdf(options)
  .from("Solution5.md")
    .to("Refer_SAPUI5_ABAP_Session5_CodeUsedInDemo.pdf", function () { console.log("Done") }) ;
