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
.from("cds_assignment.md")
  .to("CDS_Episode1_Assignment.pdf", function () { console.log("Done") });

