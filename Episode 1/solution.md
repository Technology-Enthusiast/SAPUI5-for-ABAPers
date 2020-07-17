# Technology Enthusiast
## SAPUI5 for ABAPer's - Session 1 Solution
### Step 1
Basic page
```html
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Invoice Report SAPUI5 App</title>
</head>
<body>
	<div>Invoice Report</div>
</body>
</html>
```

### Step 2
Bootstrapping our SAPUI5 library. 
Themes available sap_fiori_3_dark, sap_fiori_3, sap_belize, sap_belize_plus, sap_fiori_3_hcw, and sap_fiori_3_hcb
```javascript
	<script
		id="sap-ui-bootstrap"
		src="https://openui5.hana.ondemand.com/resources/sap-ui-core.js"
		data-sap-ui-theme="sap_belize"
		data-sap-ui-libs="sap.m"
		data-sap-ui-compatVersion="edge"
		data-sap-ui-async="true"
		data-sap-ui-onInit="module:search/PO/index"
		data-sap-ui-resourceroots='{
			"search.Invoice": "./"
		}'>

    </script>
```
Create an index.js file
```javascript
sap.ui.define([

], function () {
	"use strict";


	alert("I am loaded");
});
```

### Step 3
lets add div for body contents and remove div in body tag


```html
<body class="sapUiBody" id="content">
</body>
```

change index.js to 
```javascript
sap.ui.define([
	"sap/m/Text"

], function (Text) {
	"use strict";

	new Text({
		text: "Invoice Report"
	}).placeAt("content");

});
```

### Step 4
Create a new view folder in our app and a new file for our XML view inside the app folder
```xml
<mvc:View
   xmlns="sap.m"            
   xmlns:mvc="sap.ui.core.mvc"
    xmlns:html="http://www.w3.org/1999/xhtml">  
      <html:style>
      .bluetext {
         color: blue;
      }
   </html:style>
   <Text class="bluetext" text="Invoice Report"/>
    <Input placeholder="Invoice Type"/>
   <Input placeholder="Invoice Number"/>
   <Input placeholder="Company Code"/>
</mvc:View>
```
Lets now call this view via our index.js file rather than creating control der
```javascript
sap.ui.define([
	"sap/ui/core/mvc/XMLView"
], function (XMLView) {
	"use strict";

	XMLView.create({
		viewName: "search.Invoice.view.App"
	}).then(function (oView) {
		oView.placeAt("content");
	});

});
```

### Step 5
Lets add a button also for search!
```xml
<mvc:View
   controllerName="search.Invoice.controller.App"
   xmlns="sap.m"              
   xmlns:mvc="sap.ui.core.mvc">  
   <Text class="bluetext" text="Invoice Report"/>
    <Input placeholder="Invoice Type"/>
   <Input placeholder="Invoice Number"/>
   <Input placeholder="Company Code"/>
      <Button
      text="Search Invoices"
      press=".onSearchPO"/>
</mvc:View>
```
create a folder controller in main and inside it file App.controller.js
```javascript
sap.ui.define([
   "sap/ui/core/mvc/Controller"
], function (Controller) {
   "use strict";
   return Controller.extend("search.Invoice.controller.App", {
      onSearchPO : function () {
        
         alert("Searching Invoice's");
      }
   });
});
```

### Step 6
Rather than alert lets use some SAPUI5 control
    
```javascript
sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast"
], function (Controller,MessageToast) {
   "use strict";
   return Controller.extend("search.Invoice.controller.App", {
      onSearchPO : function () {
        
         MessageToast.show("Searching Invoice's");
      }
   });
});
```

