## We have looked at View and Controller lets bring in Model.
Lets add description field to each of the input fields. Now whenever we type PO number or type or anything it shall update the description automatically via binding.
Change App view to
```xml
<mvc:**View**
   controllerName="search.PO.controller.App"
   xmlns="sap.m"              
   xmlns:mvc="sap.ui.core.mvc"
    xmlns:html="http://www.w3.org/1999/xhtml">  
<html:style>
      .bluetext {
         color: blue;
      }
   </html:style>
   <Input placeholder="Invoice Type" value="{/poInput/poNumber}" description="Entered PO is {/poInput/poNumber} " valueLiveUpdate="true"/>
   <Input placeholder="Invoice Number" value="{/poInput/poType}" description="Entered Invoice Number is {/poInput/poType}" valueLiveUpdate="true"/>
   <Input placeholder="PCompany Code" value="{/poInput/plant}" description="Company Code is {/poInput/plant} " valueLiveUpdate="true"/>
      <Button
      text="Search"
      press=".onSearchPO"/>
</mvc:View>
```
Change App controller to 
```javascript
sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast",
   "sap/ui/model/json/JSONModel"
], function (Controller,MessageToast,JSONModel) {
   "use strict";
   return Controller.extend("search.PO.controller.App", {
   	  onInit: function(){
         // Set data model on view.
         var poInput = {
            poInput : {
               poNumber : "",
               poType:"",
               plant:"",
               companyCode:""
            }
         };
         var oModel = new JSONModel(poInput);
         this.getView().setModel(oModel);
   	  },
      onSearchPO : function () {
        
         MessageToast.show("Searching PO's");
      }
   });
});
```
## Lets now think about all the labels which we have
Different countries have different languages how do we handle via i18n
Create the folder webapp/i18n and the file i18n.properties inside
Add the following to i18n
```html
searchPO=Searching PO's
poNumber=Purchase Order Number
poType=Purchase Order Type
plant=Plant
companyCode=Company Code
```
Change the App.controller.js to
```Javascript
sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast",
   "sap/ui/model/json/JSONModel",
     "sap/ui/model/resource/ResourceModel"
], function (Controller,MessageToast,JSONModel,ResourceModel) {
   "use strict";
   return Controller.extend("search.PO.controller.App", {
   	  onInit: function(){
         // Set data model on view.
         var poInput = {
            poInput : {
               poNumber : "",
               poType:"",
               plant:"",
               companyCode:""
            }
         };
         var oModel = new JSONModel(poInput);
         this.getView().setModel(oModel);
        
         var i18nModel = new ResourceModel({
            bundleName: "search.PO.i18n.i18n"
         });
         this.getView().setModel(i18nModel, "i18n");
   	  },
      onSearchPO : function () {
         var oBundle = this.getView().getModel("i18n").getResourceBundle();
         MessageToast.show(oBundle.getText("searchPO"));
      }
   });
});
```
Change the App.view.xml
```xml
<mvc:View
   controllerName="search.PO.controller.App"
   xmlns="sap.m"              
   xmlns:mvc="sap.ui.core.mvc"
    xmlns:html="http://www.w3.org/1999/xhtml">  
    
<html:style>
      .bluetext {
         color: blue;
      }
   </html:style>
   <Text  class="bluetext" text="Purchase Order Report "/>
   <Input placeholder="{i18n>poNumber}" value="{/poInput/poNumber}" description="{i18n>poNumber} is {/poInput/poNumber} " valueLiveUpdate="true"/>
   <Input placeholder="{i18n>poType}" value="{/poInput/poType}" description="{i18n>poType} is {/poInput/poType}" valueLiveUpdate="true"/>
   <Input placeholder="{i18n>plant}" value="{/poInput/plant}" description="{i18n>plant} is {/poInput/plant} " valueLiveUpdate="true"/>
   <Input placeholder="{i18n>companyCode}" value="{/poInput/companyCode}" description="{i18n>companyCode}  is {/poInput/companyCode}" valueLiveUpdate="true"/>
      <Button
      text="Search"
      press="onSearchPO"/>
</mvc:View>
```

## Lets bring in Component concept.
Lets think big if we have to embed our app in SAP Fiori Lanuchpad or it needs be opened in the flp container then we have to make it independent of index.html it has to be something like a component which anyone can use.

Create Component.js file in webapp folder.
```javascript
sap.ui.define([
   "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
   "sap/ui/model/resource/ResourceModel"
], function (UIComponent,JSONModel,ResourceModel) {
   "use strict";
   return UIComponent.extend("search.PO.Component", {
 metadata : {
         rootView: {
            "viewName": "search.PO.view.App",
            "type": "XML",
            "async": true,
            "id": "app"
         }
      },
      init : function () {
         // call the init function of the parent
         UIComponent.prototype.init.apply(this, arguments);
          // Set data model on view.
         var poInput = {
            poInput : {
               poNumber : "",
               poType:"",
               plant:"",
               companyCode:""
            }
         };
         var oModel = new JSONModel(poInput);
         this.setModel(oModel);
        
         var i18nModel = new ResourceModel({
            bundleName: "search.PO.i18n.i18n"
         });
         this.setModel(i18nModel, "i18n");
      }
   });
});                                      
```
Change App.controller.js. Remove the model from app controller as we have defined in the Component controller. The childerns have access to parent so they will be able to access model.

```javascript
sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast"
], function (Controller,MessageToast) {
   "use strict";
   return Controller.extend("search.PO.controller.App", {
   	  onInit: function(){
   	  },
      onSearchPO : function () {
         var oBundle = this.getView().getModel("i18n").getResourceBundle();
         MessageToast.show(oBundle.getText("searchPO"));
      }
   });
});
```
Change Index.js to now create the component container
```javascript
sap.ui.define([
"sap/ui/core/ComponentContainer"
], function (ComponentContainer) {
	"use strict";


	new ComponentContainer({
		name: "search.PO",
		settings : {
			id : "walkthrough"
		},
		async: true
	}).placeAt("content");

});
```

## Bring in next biggie Descriptor manifest.json
We have got rid of Index.html dependency. Our view and models are associated via component.js. But component.js is handling 
multiple things. It makes sense to move all config out of it into some kind of description which describe the application and component takes care of appllication coding parts.

Lets create file manifest.json in webapp folder.
```json
{
  "_version": "1.12.0",
  "sap.app": {
	"id": "search.PO",
	"type": "application",
	"i18n": "i18n/i18n.properties",
	"title": "{{appTitle}}",
	"description": "{{appDescription}}",
	"applicationVersion": {
	  "version": "1.0.0"
	}
  },
  "sap.ui": {
	"technology": "UI5",
	"deviceTypes": {
		"desktop": true,
		"tablet": true,
		"phone": true
	}
  },
  "sap.ui5": {
	"rootView": {
		"viewName": "search.PO.view.App",
		"type": "XML",
		"async": true,
		"id": "app"
	},
	"dependencies": {
	  "minUI5Version": "1.60",
	  "libs": {
		"sap.m": {}
	  }
	},
	"models": {
	  "i18n": {
		"type": "sap.ui.model.resource.ResourceModel",
		"settings": {
		  "bundleName": "search.PO.i18n.i18n"
		}
	  }
	}
  }
}
```

Modify the index.html file to call our component directly without using index.js
```html
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Purchase Order Search App</title>
		<script
		id="sap-ui-bootstrap"
		src="https://openui5.hana.ondemand.com/resources/sap-ui-core.js"
		data-sap-ui-theme="sap_belize"
		data-sap-ui-libs="sap.m"
		data-sap-ui-compatVersion="edge"
		data-sap-ui-async="true"
		data-sap-ui-oninit="module:sap/ui/core/ComponentSupport"
		data-sap-ui-resourceroots='{
			"search.PO": "./"
		}'>

    </script>
</head>
<body class="sapUiBody" id="content">

<div data-sap-ui-component data-name="search.PO" data-id="container" data-settings='{"id" : "walkthrough"}'></div>
	
</body>
</html>
```

Add app title and description in i18n
```
searchPO=Searching PO's
poNumber=Purchase Order Number
poType=Purchase Order Type
plant=Plant
companyCode=Company Code
appTitle=My Title
appDescription=my desc
```
Change component js now to refer manifest.json and remove resoucre model

```javascript
sap.ui.define([
   "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
   "sap/ui/model/resource/ResourceModel"
], function (UIComponent,JSONModel,ResourceModel) {
   "use strict";
   return UIComponent.extend("search.PO.Component", {
 metadata : {
            manifest: "json"
      },
      init : function () {
         // call the init function of the parent
         UIComponent.prototype.init.apply(this, arguments);
          // Set data model on view.
         var poInput = {
            poInput : {
               poNumber : "",
               poType:"",
               plant:"",
               companyCode:""
            }
         };
         var oModel = new JSONModel(poInput);
         this.setModel(oModel);
   
      }
   });
});                                      
```
## Our structure is ready Lets beautify it.
Lets move our view inside pages change App.view.xml
```xml
<mvc:View
   controllerName="search.PO.controller.App"
   xmlns="sap.m"              
   xmlns:mvc="sap.ui.core.mvc"
displayBlock="true">  

     <App>
      <pages>
         <Page title="{i18n>homePageTitle}">
            <content>
   <Input placeholder="{i18n>poNumber}" value="{/poInput/poNumber}" description="{i18n>poNumber} is {/poInput/poNumber} " valueLiveUpdate="true"/>
   <Input placeholder="{i18n>poType}" value="{/poInput/poType}" description="{i18n>poType} is {/poInput/poType}" valueLiveUpdate="true"/>
   <Input placeholder="{i18n>plant}" value="{/poInput/plant}" description="{i18n>plant} is {/poInput/plant} " valueLiveUpdate="true"/>
   <Input placeholder="{i18n>companyCode}" value="{/poInput/companyCode}" description="{i18n>companyCode}  is {/poInput/companyCode}" valueLiveUpdate="true"/>
      <Button
      text="Search"
      press="onSearchPO"/>
       </content>
         </Page>
      </pages>
   </App>
 
</mvc:View>
```
Lets add our app inside a shell infact
```xml
<mvc:View
   controllerName="search.PO.controller.App"
   xmlns="sap.m"              
   xmlns:mvc="sap.ui.core.mvc"
displayBlock="true">  
<Shell>
     <App>
      <pages>
         <Page title="{i18n>homePageTitle}">
            <content>
   <Input placeholder="{i18n>poNumber}" value="{/poInput/poNumber}" description="{i18n>poNumber} is {/poInput/poNumber} " valueLiveUpdate="true"/>
   <Input placeholder="{i18n>poType}" value="{/poInput/poType}" description="{i18n>poType} is {/poInput/poType}" valueLiveUpdate="true"/>
   <Input placeholder="{i18n>plant}" value="{/poInput/plant}" description="{i18n>plant} is {/poInput/plant} " valueLiveUpdate="true"/>
   <Input placeholder="{i18n>companyCode}" value="{/poInput/companyCode}" description="{i18n>companyCode}  is {/poInput/companyCode}" valueLiveUpdate="true"/>
      <Button
      text="Search"
      press="onSearchPO"/>
       </content>
         </Page>
      </pages>
   </App>
   </Shell>
</mvc:View>
```
Lets add some margins also..
```xml
<mvc:View
   controllerName="search.PO.controller.App"
   xmlns="sap.m"              
   xmlns:mvc="sap.ui.core.mvc"
displayBlock="true">  
<Shell>
     <App>
      <pages>
         <Page title="{i18n>homePageTitle}" >
            <content >
   <Input placeholder="{i18n>poNumber}" value="{/poInput/poNumber}" description="{i18n>poNumber} is {/poInput/poNumber} " valueLiveUpdate="true" class="sapUiResponsiveMargin"
	 />
   <Input class="sapUiResponsiveMargin"
	 placeholder="{i18n>poType}" value="{/poInput/poType}" description="{i18n>poType} is {/poInput/poType}" valueLiveUpdate="true"/>
   <Input class="sapUiResponsiveMargin"
		 placeholder="{i18n>plant}" value="{/poInput/plant}" description="{i18n>plant} is {/poInput/plant} " valueLiveUpdate="true"/>
   <Input  class="sapUiResponsiveMargin"
	 placeholder="{i18n>companyCode}" value="{/poInput/companyCode}" description="{i18n>companyCode}  is {/poInput/companyCode}" valueLiveUpdate="true"/>
      <Button class="sapUiResponsiveMargin"
		
      text="Search"
      press="onSearchPO"/>
       </content>
         </Page>
      </pages>
   </App>
   </Shell>
</mvc:View>
```

## So now time has come to add our list of PO's
if we will add list of PO's also in app view it will become too crowded lets have separate
view for this complete view and let app view just calls it.

Create a new view PO.view.xml and move code
```xml
<mvc:View
   controllerName="search.PO.controller.PO"
   xmlns="sap.m"
   xmlns:mvc="sap.ui.core.mvc">
    <Input placeholder="{i18n>poNumber}" value="{/poInput/poNumber}" description="{i18n>poNumber} is {/poInput/poNumber} " valueLiveUpdate="true" class="sapUiResponsiveMargin"
	 />
   <Input class="sapUiResponsiveMargin"
	 placeholder="{i18n>poType}" value="{/poInput/poType}" description="{i18n>poType} is {/poInput/poType}" valueLiveUpdate="true"/>
   <Input class="sapUiResponsiveMargin"
		 placeholder="{i18n>plant}" value="{/poInput/plant}" description="{i18n>plant} is {/poInput/plant} " valueLiveUpdate="true"/>
   <Input  class="sapUiResponsiveMargin"
	 placeholder="{i18n>companyCode}" value="{/poInput/companyCode}" description="{i18n>companyCode}  is {/poInput/companyCode}" valueLiveUpdate="true"/>
      <Button class="sapUiResponsiveMargin"
		
      text="Search"
      press="onSearchPO"/>
</mvc:View>
```
Move button methods from App.controller.js to PO.controller.js, this PO controller needs to be created
```javascript
sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast"
], function (Controller,MessageToast) {
   "use strict";
   return Controller.extend("search.PO.controller.PO", {
   	  onInit: function(){
   	  },
      onSearchPO : function () {
         var oBundle = this.getView().getModel("i18n").getResourceBundle();
         MessageToast.show(oBundle.getText("searchPO"));
      }
   });
});
```

Add the call of PO view in App.view.xml
```xml
<mvc:View
   controllerName="search.PO.controller.App"
   xmlns="sap.m"              
   xmlns:mvc="sap.ui.core.mvc"
displayBlock="true">  
<Shell>
     <App>
      <pages>
         <Page title="{i18n>homePageTitle}" >
            <content >
 <mvc:XMLView viewName="search.PO.view.PO"/>
       </content>
         </Page>
      </pages>
   </App>
   </Shell>
</mvc:View>
```
Remove the methods of app controller
```javascript
sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast"
], function (Controller,MessageToast) {
   "use strict";
   return Controller.extend("search.PO.controller.App", {
   	  
   });
});
```

Create a PO.json file with all PO's
```json
{
  "PurchaseOrders": [
	{
	  "Ebeln": "1",
	  "Menge": 98,
	  "Netpr": 100,
	  "Matnr": "MAT1",
	  "PODate": "2020-06-23T00:00:00",
	  "POStatus": "CONF",
	  "Waers":"INR"
	},
	{
	  "Ebeln": "2",
	  "Menge":321,
	  "Netpr": 9872,
	  "Matnr": "MAT2",
	  "PODate": "2020-06-21T00:00:00",
	  "POStatus": "CONF",
	  "Waers":"INR"
	},
		{
	  "Ebeln": "3",
	  "Menge": 108,
	  "Netpr": 120,
	  "Matnr": "MAT3",
	  "PODate": "2020-06-13T00:00:00",
	  "POStatus": "OPEN",
	  "Waers":"INR"
	},
		{
	  "Ebeln": "4",
	  "Menge": 789,
	  "Netpr": 1200,
	  "Matnr": "MAT4",
	  "PODate": "2020-06-12T00:00:00",
	  "POStatus": "PEND",
	  "Waers":"INR"
	}
  ]
}
```

Add the call for model in manifest.json
```json
{
  "_version": "1.12.0",
  "sap.app": {
	"id": "search.PO",
	"type": "application",
	"i18n": "i18n/i18n.properties",
	"title": "{{appTitle}}",
	"description": "{{appDescription}}",
	"applicationVersion": {
	  "version": "1.0.0"
	}
  },
  "sap.ui": {
	"technology": "UI5",
	"deviceTypes": {
		"desktop": true,
		"tablet": true,
		"phone": true
	}
  },
  "sap.ui5": {
	"rootView": {
		"viewName": "search.PO.view.App",
		"type": "XML",
		"async": true,
		"id": "app"
	},
	"dependencies": {
	  "minUI5Version": "1.60",
	  "libs": {
		"sap.m": {}
	  }
	},
	"models": {
	  "i18n": {
		"type": "sap.ui.model.resource.ResourceModel",
		"settings": {
		  "bundleName": "search.PO.i18n.i18n"
		}
	  },
	  "pos":{ 
		"type": "sap.ui.model.json.JSONModel",
		"uri": "PO.json"
	  }
	}
  }
}
```
Add the list for showing the value in PO view
```xml
<mvc:View
   controllerName="search.PO.controller.PO"
   xmlns="sap.m"
   xmlns:mvc="sap.ui.core.mvc">
    <Input placeholder="{i18n>poNumber}" value="{/poInput/poNumber}" description="{i18n>poNumber} is {/poInput/poNumber} " valueLiveUpdate="true" class="sapUiResponsiveMargin"
	 />
   <Input class="sapUiResponsiveMargin"
	 placeholder="{i18n>poType}" value="{/poInput/poType}" description="{i18n>poType} is {/poInput/poType}" valueLiveUpdate="true"/>
   <Input class="sapUiResponsiveMargin"
		 placeholder="{i18n>plant}" value="{/poInput/plant}" description="{i18n>plant} is {/poInput/plant} " valueLiveUpdate="true"/>
   <Input  class="sapUiResponsiveMargin"
	 placeholder="{i18n>companyCode}" value="{/poInput/companyCode}" description="{i18n>companyCode}  is {/poInput/companyCode}" valueLiveUpdate="true"/>
      <Button class="sapUiResponsiveMargin"
		
      text="Search"
      press="onSearchPO"/>
      <List
      headerText="{i18n>POList}"
      class="sapUiResponsiveMargin"
      width="auto"
      items="{pos>/PurchaseOrders}" >
      <items>
         <ObjectListItem
            title="{pos>Ebeln} - {pos>Matnr}"
            number="{
			parts: [{path: 'pos>Netpr'}, {path: 'pos>/Waers'}],
			type: 'sap.ui.model.type.Currency',
			formatOptions: {
				showMeasure: false
			}
		}"
		numberUnit="{pos>/Waers}"/>
      </items>
   </List>
</mvc:View>
```
