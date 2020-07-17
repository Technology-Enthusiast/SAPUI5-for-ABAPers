## Lets check now expression binding
Lets add two things one is status in title and another is expression binding which is if amount is greater than 120 i want it to be displayed as red else green
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
            title="{pos>Ebeln} - {pos>Matnr} - {pos>POStatus}"
            number="{
			parts: [{path: 'pos>Netpr'}, {path: 'pos>/Waers'}],
			type: 'sap.ui.model.type.Currency',
			formatOptions: {
				showMeasure: false
			}
		}"
		numberUnit="{pos>/Waers}"
		numberState="{= ${pos>Netpr} > 120 ? 'Error' : 'Success' }"/>
      </items>
   </List>
</mvc:View>
```
It does not look good lets check in Objectlist item help do we have something else. Lets try to move PO status to Object Attribute and it shall be displayed on left side below title
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
		numberUnit="{pos>/Waers}"
		numberState="{= ${pos>Netpr} > 120 ? 'Error' : 'Success' }">
         	<ObjectAttribute text="{pos>POStatus}" />
         		</ObjectListItem>
      </items>
   </List>
</mvc:View>
```
We also see markers lets try to use them. What we can do is we can make them dynamic if PO status is confirmed maked in favorite else flagged
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
		numberUnit="{pos>/Waers}"
		numberState="{= ${pos>Netpr} > 120 ? 'Error' : 'Success' }">
         	<ObjectAttribute text="{pos>POStatus}" />
         	<markers>
				<ObjectMarker type="{= ${pos>POStatus} === 'CONF' ? 'Favorite' : 'Flagged' }" />
			</markers>
         		</ObjectListItem>
      </items>
   </List>
</mvc:View>
```
## Bringing in Formatter
Now this PO status codes does not look good right. So is there a way by which we can format them that bring us to formatter.

Create a new file model/formatter.js
```javascript
sap.ui.define([], function () {
	"use strict";
	return {
		readbalePOStatus: function (poStatus) {
			var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
			switch (poStatus) {
				case "CONF":
					return resourceBundle.getText("CONF");
				case "PEND":
					return resourceBundle.getText("PEND");
				case "OPEN":
					return resourceBundle.getText("OPEN");
				default:
					return poStatus;
			}
		}
	};
});
```
Lets define these texts in i18n
```html
searchPO=Searching PO's
poNumber=Purchase Order Number
poType=Purchase Order Type
plant=Plant
companyCode=Company Code
appTitle=My Title
appDescription=my desc
homePageTitle=My PO's
POList=PO List
CONF= PO Confirmed
PEND= PO Confirmation Pending
OPEN= PO Open
```
Our function is ready but how do we let our PO controller/view know it is available
Add in PO controller as a dependency to load it
```javascript
sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast",
   "../model/formatter"
], function (Controller,MessageToast,formatter) {
   "use strict";
   return Controller.extend("search.PO.controller.PO", {
   	  formatter: formatter,
   	  onInit: function(){
   	  },
      onSearchPO : function () {
         var oBundle = this.getView().getModel("i18n").getResourceBundle();
         MessageToast.show(oBundle.getText("searchPO"));
      }
   });
});
```
Our controller knows about formatter but not our view PO view lets add it der also
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
		numberUnit="{pos>/Waers}"
		numberState="{= ${pos>Netpr} > 120 ? 'Error' : 'Success' }">
         	<ObjectAttribute text="{
						path: 'pos>POStatus',
						formatter: '.formatter.readbalePOStatus'
					}" />
         	<markers>
				<ObjectMarker type="{= ${pos>POStatus} === 'CONF' ? 'Favorite' : 'Flagged' }" />
			</markers>
         		</ObjectListItem>
      </items>
   </List>
</mvc:View>
```
In PO view Status text on left does not look good lets add it to right using first status and on left in object attribute we add plant/Company code and document type

lets first modify our json file
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
	  "Waers":"INR",
	  "Plant":"DE01",
	  "Bukrs":"1000",
	  "POType":"NB"
	},
	{
	  "Ebeln": "2",
	  "Menge":321,
	  "Netpr": 9872,
	  "Matnr": "MAT2",
	  "PODate": "2020-06-21T00:00:00",
	  "POStatus": "CONF",
	  "Waers":"INR",
	  	  "Plant":"DE01",
	  "Bukrs":"1000",
	  "POType":"NB"
	},
		{
	  "Ebeln": "3",
	  "Menge": 108,
	  "Netpr": 120,
	  "Matnr": "MAT3",
	  "PODate": "2020-06-13T00:00:00",
	  "POStatus": "OPEN",
	  "Waers":"INR",
	  	  "Plant":"DE02",
	  "Bukrs":"2000",
	  "POType":"BN"
	},
		{
	  "Ebeln": "4",
	  "Menge": 789,
	  "Netpr": 1200,
	  "Matnr": "MAT4",
	  "PODate": "2020-06-12T00:00:00",
	  "POStatus": "PEND",
	  "Waers":"INR",
	  	  "Plant":"DE02",
	  "Bukrs":"2000",
	  "POType":"BN"
	}
  ]
}
```
Now we modify PO View
```xml
<mvc:View controllerName="search.PO.controller.PO" xmlns="sap.m" xmlns:mvc="sap.ui.core.mvc">
	<Input placeholder="{i18n>poNumber}" value="{/poInput/poNumber}" description="{i18n>poNumber} is {/poInput/poNumber} "
		valueLiveUpdate="true" class="sapUiResponsiveMargin"/>
	<Input class="sapUiResponsiveMargin" placeholder="{i18n>poType}" value="{/poInput/poType}" description="{i18n>poType} is {/poInput/poType}"
		valueLiveUpdate="true"/>
	<Input class="sapUiResponsiveMargin" placeholder="{i18n>plant}" value="{/poInput/plant}" description="{i18n>plant} is {/poInput/plant} "
		valueLiveUpdate="true"/>
	<Input class="sapUiResponsiveMargin" placeholder="{i18n>companyCode}" value="{/poInput/companyCode}"
		description="{i18n>companyCode} is {/poInput/companyCode}" valueLiveUpdate="true"/>
	<Button class="sapUiResponsiveMargin" text="Search" press="onSearchPO"/>
	<List headerText="{i18n>POList}" class="sapUiResponsiveMargin" width="auto" items="{pos>/PurchaseOrders}">
		<items>
			<ObjectListItem title="{pos>Ebeln} - {pos>Matnr}"
				number="{ parts: [{path: 'pos>Netpr'}, {path: 'pos>/Waers'}], type: 'sap.ui.model.type.Currency', formatOptions: { showMeasure: false } }"
				numberUnit="{pos>/Waers}" numberState="{= ${pos>Netpr} > 120 ? 'Error' : 'Success' }">
				<ObjectAttribute text="{pos>Plant}"/>
				<ObjectAttribute text="{pos>Bukrs}"/>
				<ObjectAttribute text="{pos>POType}"/>
				<markers>
					<ObjectMarker type="{= ${pos>POStatus} === 'CONF' ? 'Favorite' : 'Flagged' }"/>
				</markers>
				<firstStatus>
					<ObjectStatus text="{ path: 'pos>POStatus', formatter: '.formatter.readbalePOStatus' }"/>
				</firstStatus>
			</ObjectListItem>
		</items>
	</List>
</mvc:View>
```
## Time now to add filter

Lets assign an id to invoice we will update the binded data of list via filter
```xml
<mvc:View controllerName="search.PO.controller.PO" xmlns="sap.m" xmlns:mvc="sap.ui.core.mvc">
	<Input placeholder="{i18n>poNumber}" value="{/poInput/poNumber}" description="{i18n>poNumber} is {/poInput/poNumber} "
		valueLiveUpdate="true" class="sapUiResponsiveMargin"/>
	<Input class="sapUiResponsiveMargin" placeholder="{i18n>poType}" value="{/poInput/poType}" description="{i18n>poType} is {/poInput/poType}"
		valueLiveUpdate="true"/>
	<Input class="sapUiResponsiveMargin" placeholder="{i18n>plant}" value="{/poInput/plant}" description="{i18n>plant} is {/poInput/plant} "
		valueLiveUpdate="true"/>
	<Input class="sapUiResponsiveMargin" placeholder="{i18n>companyCode}" value="{/poInput/companyCode}"
		description="{i18n>companyCode} is {/poInput/companyCode}" valueLiveUpdate="true"/>
	<Button class="sapUiResponsiveMargin" text="Search" press="onSearchPO"/>
	<List id="poList" headerText="{i18n>POList}" class="sapUiResponsiveMargin" width="auto" items="{pos>/PurchaseOrders}">
		<items>
			<ObjectListItem title="{pos>Ebeln} - {pos>Matnr}"
				number="{ parts: [{path: 'pos>Netpr'}, {path: 'pos>/Waers'}], type: 'sap.ui.model.type.Currency', formatOptions: { showMeasure: false } }"
				numberUnit="{pos>/Waers}" numberState="{= ${pos>Netpr} > 120 ? 'Error' : 'Success' }">
				<ObjectAttribute text="{pos>Plant}"/>
				<ObjectAttribute text="{pos>Bukrs}"/>
				<ObjectAttribute text="{pos>POType}"/>
				<markers>
					<ObjectMarker type="{= ${pos>POStatus} === 'CONF' ? 'Favorite' : 'Flagged' }"/>
				</markers>
				<firstStatus>
					<ObjectStatus text="{ path: 'pos>POStatus', formatter: '.formatter.readbalePOStatus' }"/>
				</firstStatus>
			</ObjectListItem>
		</items>
	</List>
</mvc:View>
```
modify po controller for filters
```javascript
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, MessageToast, formatter, Filter, FilterOperator) {
	"use strict";
	return Controller.extend("search.PO.controller.PO", {
		formatter: formatter,
		onInit: function () {},
		onSearchPO: function () {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			MessageToast.show(oBundle.getText("searchPO"));
			// build filter array
			var aFilter = [];
			let inputData = JSON.parse(this.getView().getModel().getJSON()).poInput;
			if (inputData.companyCode) {
				aFilter.push(new Filter("Bukrs", FilterOperator.Contains, inputData.companyCode));
			}
			if (inputData.plant) {
				aFilter.push(new Filter("Plant", FilterOperator.Contains, inputData.plant));
			}
			if (inputData.poNumber) {
				aFilter.push(new Filter("Ebeln", FilterOperator.Contains, inputData.poNumber));
			}
			if (inputData.poType) {
				aFilter.push(new Filter("POType", FilterOperator.Contains, inputData.poType));
			}
			// filter binding
			var oList = this.byId("poList");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		}
	});
});
```
before we now see sorting and grouping lets increas our po data
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
	  "Waers":"INR",
	  "Plant":"DE01",
	  "Bukrs":"1000",
	  "POType":"NB"
	},
	{
	  "Ebeln": "2",
	  "Menge":321,
	  "Netpr": 9872,
	  "Matnr": "MAT2",
	  "PODate": "2020-06-21T00:00:00",
	  "POStatus": "CONF",
	  "Waers":"INR",
	  	  "Plant":"DE01",
	  "Bukrs":"1000",
	  "POType":"NB"
	},
		{
	  "Ebeln": "3",
	  "Menge": 108,
	  "Netpr": 120,
	  "Matnr": "MAT3",
	  "PODate": "2020-06-13T00:00:00",
	  "POStatus": "OPEN",
	  "Waers":"INR",
	  	  "Plant":"DE02",
	  "Bukrs":"2000",
	  "POType":"BN"
	},
		{
	  "Ebeln": "4",
	  "Menge": 789,
	  "Netpr": 1200,
	  "Matnr": "MAT4",
	  "PODate": "2020-06-12T00:00:00",
	  "POStatus": "PEND",
	  "Waers":"INR",
	  	  "Plant":"DE02",
	  "Bukrs":"2000",
	  "POType":"BN"
	},
	{
	  "Ebeln": "5",
	  "Menge": 98,
	  "Netpr": 100,
	  "Matnr": "MAT1",
	  "PODate": "2020-06-23T00:00:00",
	  "POStatus": "CONF",
	  "Waers":"INR",
	  "Plant":"DE03",
	  "Bukrs":"1000",
	  "POType":"NB"
	},
	{
	  "Ebeln": "6",
	  "Menge":321,
	  "Netpr": 9872,
	  "Matnr": "MAT2",
	  "PODate": "2020-06-21T00:00:00",
	  "POStatus": "CONF",
	  "Waers":"INR",
	  	  "Plant":"DE03",
	  "Bukrs":"1000",
	  "POType":"NB"
	},
		{
	  "Ebeln": "7",
	  "Menge": 108,
	  "Netpr": 120,
	  "Matnr": "MAT3",
	  "PODate": "2020-06-13T00:00:00",
	  "POStatus": "OPEN",
	  "Waers":"INR",
	  	  "Plant":"DE03",
	  "Bukrs":"2000",
	  "POType":"BN"
	},
		{
	  "Ebeln": "8",
	  "Menge": 789,
	  "Netpr": 1200,
	  "Matnr": "MAT4",
	  "PODate": "2020-06-12T00:00:00",
	  "POStatus": "PEND",
	  "Waers":"INR",
	  	  "Plant":"DE01",
	  "Bukrs":"2000",
	  "POType":"BN"
	}
  ]
}
```
Lets now sort by plant for example
```xml
<mvc:View controllerName="search.PO.controller.PO" xmlns="sap.m" xmlns:mvc="sap.ui.core.mvc">
	<Input placeholder="{i18n>poNumber}" value="{/poInput/poNumber}" description="{i18n>poNumber} is {/poInput/poNumber} "
		valueLiveUpdate="true" class="sapUiResponsiveMargin"/>
	<Input class="sapUiResponsiveMargin" placeholder="{i18n>poType}" value="{/poInput/poType}" description="{i18n>poType} is {/poInput/poType}"
		valueLiveUpdate="true"/>
	<Input class="sapUiResponsiveMargin" placeholder="{i18n>plant}" value="{/poInput/plant}" description="{i18n>plant} is {/poInput/plant} "
		valueLiveUpdate="true"/>
	<Input class="sapUiResponsiveMargin" placeholder="{i18n>companyCode}" value="{/poInput/companyCode}"
		description="{i18n>companyCode} is {/poInput/companyCode}" valueLiveUpdate="true"/>
	<Button class="sapUiResponsiveMargin" text="Search" press="onSearchPO"/>
	<List id="poList" headerText="{i18n>POList}" class="sapUiResponsiveMargin" width="auto" 
	 items="{
         path : 'pos>/PurchaseOrders',
         sorter : {
            path : 'Plant' 
         }
      }" 
	>
		<items>
			<ObjectListItem title="{pos>Ebeln} - {pos>Matnr}"
				number="{ parts: [{path: 'pos>Netpr'}, {path: 'pos>/Waers'}], type: 'sap.ui.model.type.Currency', formatOptions: { showMeasure: false } }"
				numberUnit="{pos>/Waers}" numberState="{= ${pos>Netpr} > 120 ? 'Error' : 'Success' }">
				<ObjectAttribute text="{pos>Plant}"/>
				<ObjectAttribute text="{pos>Bukrs}"/>
				<ObjectAttribute text="{pos>POType}"/>
				<markers>
					<ObjectMarker type="{= ${pos>POStatus} === 'CONF' ? 'Favorite' : 'Flagged' }"/>
				</markers>
				<firstStatus>
					<ObjectStatus text="{ path: 'pos>POStatus', formatter: '.formatter.readbalePOStatus' }"/>
				</firstStatus>
			</ObjectListItem>
		</items>
	</List>
</mvc:View>
```
Now rather than sort we group
```xml
<mvc:View controllerName="search.PO.controller.PO" xmlns="sap.m" xmlns:mvc="sap.ui.core.mvc">
	<Input placeholder="{i18n>poNumber}" value="{/poInput/poNumber}" description="{i18n>poNumber} is {/poInput/poNumber} "
		valueLiveUpdate="true" class="sapUiResponsiveMargin"/>
	<Input class="sapUiResponsiveMargin" placeholder="{i18n>poType}" value="{/poInput/poType}" description="{i18n>poType} is {/poInput/poType}"
		valueLiveUpdate="true"/>
	<Input class="sapUiResponsiveMargin" placeholder="{i18n>plant}" value="{/poInput/plant}" description="{i18n>plant} is {/poInput/plant} "
		valueLiveUpdate="true"/>
	<Input class="sapUiResponsiveMargin" placeholder="{i18n>companyCode}" value="{/poInput/companyCode}"
		description="{i18n>companyCode} is {/poInput/companyCode}" valueLiveUpdate="true"/>
	<Button class="sapUiResponsiveMargin" text="Search" press="onSearchPO"/>
	<List id="poList" headerText="{i18n>POList}" class="sapUiResponsiveMargin" width="auto" 
	 items="{
         path : 'pos>/PurchaseOrders',
         sorter : {
            path : 'Plant',
            group : true
         }
      }" 
	>
		<items>
			<ObjectListItem title="{pos>Ebeln} - {pos>Matnr}"
				number="{ parts: [{path: 'pos>Netpr'}, {path: 'pos>/Waers'}], type: 'sap.ui.model.type.Currency', formatOptions: { showMeasure: false } }"
				numberUnit="{pos>/Waers}" numberState="{= ${pos>Netpr} > 120 ? 'Error' : 'Success' }">
				<ObjectAttribute text="{pos>Plant}"/>
				<ObjectAttribute text="{pos>Bukrs}"/>
				<ObjectAttribute text="{pos>POType}"/>
				<markers>
					<ObjectMarker type="{= ${pos>POStatus} === 'CONF' ? 'Favorite' : 'Flagged' }"/>
				</markers>
				<firstStatus>
					<ObjectStatus text="{ path: 'pos>POStatus', formatter: '.formatter.readbalePOStatus' }"/>
				</firstStatus>
			</ObjectListItem>
		</items>
	</List>
</mvc:View>
```

this is all static can we have dynamic sorting?
```xml
<mvc:View controllerName="search.PO.controller.PO" xmlns="sap.m" xmlns:mvc="sap.ui.core.mvc">
	<Input placeholder="{i18n>poNumber}" value="{/poInput/poNumber}" description="{i18n>poNumber} is {/poInput/poNumber} "
		valueLiveUpdate="true" class="sapUiResponsiveMargin"/>
	<Input class="sapUiResponsiveMargin" placeholder="{i18n>poType}" value="{/poInput/poType}" description="{i18n>poType} is {/poInput/poType}"
		valueLiveUpdate="true"/>
	<Input class="sapUiResponsiveMargin" placeholder="{i18n>plant}" value="{/poInput/plant}" description="{i18n>plant} is {/poInput/plant} "
		valueLiveUpdate="true"/>
	<Input class="sapUiResponsiveMargin" placeholder="{i18n>companyCode}" value="{/poInput/companyCode}"
		description="{i18n>companyCode} is {/poInput/companyCode}" valueLiveUpdate="true"/>
	<Button class="sapUiResponsiveMargin" text="Search" press="onSearchPO"/>
	<List id="poList" headerText="{i18n>POList}" class="sapUiResponsiveMargin" width="auto" 
	 items="{
         path : 'pos>/PurchaseOrders',
         sorter : {
            path : 'Plant',
            group : true
         }
      }" 
	>
		<items>
			<ObjectListItem title="{pos>Ebeln} - {pos>Matnr}"
				number="{ parts: [{path: 'pos>Netpr'}, {path: 'pos>/Waers'}], type: 'sap.ui.model.type.Currency', formatOptions: { showMeasure: false } }"
				numberUnit="{pos>/Waers}" numberState="{= ${pos>Netpr} > 120 ? 'Error' : 'Success' }">
				<ObjectAttribute text="{pos>Plant}"/>
				<ObjectAttribute text="{pos>Bukrs}"/>
				<ObjectAttribute text="{pos>POType}"/>
				<markers>
					<ObjectMarker type="{= ${pos>POStatus} === 'CONF' ? 'Favorite' : 'Flagged' }"/>
				</markers>
				<firstStatus>
					<ObjectStatus text="{ path: 'pos>POStatus', formatter: '.formatter.readbalePOStatus' }"/>
				</firstStatus>
			</ObjectListItem>
		</items>
		<headerToolbar>
			<OverflowToolbar>
				<Button
					text="Sort by Company Code"
					press=".handleSortPress" />
				<Button
					text="Group by Company Code"
					press=".handleGroupPress" />
	
			</OverflowToolbar>
		</headerToolbar>
	</List>
</mvc:View>
```

chaneg controller
```javascript
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, MessageToast, formatter, Filter, FilterOperator) {
	"use strict";
	return Controller.extend("search.PO.controller.PO", {
		formatter: formatter,
		onInit: function () {},
		onSearchPO: function () {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			MessageToast.show(oBundle.getText("searchPO"));
			// build filter array
			var aFilter = [];
			let inputData = JSON.parse(this.getView().getModel().getJSON()).poInput;
			if (inputData.companyCode) {
				aFilter.push(new Filter("Bukrs", FilterOperator.Contains, inputData.companyCode));
			}
			if (inputData.plant) {
				aFilter.push(new Filter("Plant", FilterOperator.Contains, inputData.plant));
			}
			if (inputData.poNumber) {
				aFilter.push(new Filter("Ebeln", FilterOperator.Contains, inputData.poNumber));
			}
			if (inputData.poType) {
				aFilter.push(new Filter("POType", FilterOperator.Contains, inputData.poType));
			}
			// filter binding
			var oList = this.byId("poList");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		},
		handleSortPress:function(){
			var oList = this.byId("poList");
			var oBinding = oList.getBinding("items");
			var aSorter = [];
			aSorter.push(new sap.ui.model.Sorter("Bukrs", false, false));
			oBinding.sort(aSorter);
		},
		handleGroupPress:function(){
				var oList = this.byId("poList");
			var oBinding = oList.getBinding("items");
			var aSorter = [];
			aSorter.push(new sap.ui.model.Sorter("Bukrs", false, true));
			oBinding.sort(aSorter);
		}
	});
});
```

## Lets bring in the biggie Navigation and Routing

Routing details are define in manifest.json
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
	},
	"routing": {
	  "config": {
		"routerClass": "sap.m.routing.Router",
		"viewType": "XML",
		"viewPath": "search.PO.view",
		"controlId": "app",
		"controlAggregation": "pages",
		"async": true
	  },
	  "routes": [
		{
		  "pattern": "",
		  "name": "pohome",
		  "target": "pohome"
		},
		{
		  "pattern": "podetail",
		  "name": "podetail",
		  "target": "podetail"
		}
	  ],
	  "targets": {
		"pohome": {
		  "viewId": "PO",
		  "viewName": "PO"
		},
		"podetail": {
		  "viewId": "PODetail",
		  "viewName": "PODetail"
		}
	  }
	}
  }
}
```

Initialize router class in component.js
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
		 this.getRouter().initialize();
      }
   });
});                                      
```
Lets change now our App view as container for different pages or view 
```xml
<mvc:View controllerName="search.PO.controller.App" xmlns="sap.m" xmlns:mvc="sap.ui.core.mvc" displayBlock="true">
	<Shell>
		<App class="poApp" id="app"/>
	</Shell>
</mvc:View>
```
Adjust PO.view.xml to add on  press list item and pagesnnn
```xml
<mvc:View controllerName="search.PO.controller.PO" xmlns="sap.m" xmlns:mvc="sap.ui.core.mvc">
	<Page title="{i18n>homePageTitle}">
		<content >
			<Input placeholder="{i18n>poNumber}" value="{/poInput/poNumber}" description="{i18n>poNumber} is {/poInput/poNumber} "
				valueLiveUpdate="true" class="sapUiResponsiveMargin"/>
			<Input class="sapUiResponsiveMargin" placeholder="{i18n>poType}" value="{/poInput/poType}" description="{i18n>poType} is {/poInput/poType}"
				valueLiveUpdate="true"/>
			<Input class="sapUiResponsiveMargin" placeholder="{i18n>plant}" value="{/poInput/plant}" description="{i18n>plant} is {/poInput/plant} "
				valueLiveUpdate="true"/>
			<Input class="sapUiResponsiveMargin" placeholder="{i18n>companyCode}" value="{/poInput/companyCode}"
				description="{i18n>companyCode} is {/poInput/companyCode}" valueLiveUpdate="true"/>
			<Button class="sapUiResponsiveMargin" text="Search" press="onSearchPO"/>
			<List id="poList" headerText="{i18n>POList}" class="sapUiResponsiveMargin" width="auto"
				items="{ path : 'pos>/PurchaseOrders', sorter : { path : 'Plant', group : true } }">
				<items>
					<ObjectListItem title="{pos>Ebeln} - {pos>Matnr}"
						number="{ parts: [{path: 'pos>Netpr'}, {path: 'pos>/Waers'}], type: 'sap.ui.model.type.Currency', formatOptions: { showMeasure: false } }"
						numberUnit="{pos>/Waers}" numberState="{= ${pos>Netpr} > 120 ? 'Error' : 'Success' }"
						type="Navigation"
					press="showDetail">
						<ObjectAttribute text="{pos>Plant}"/>
						<ObjectAttribute text="{pos>Bukrs}"/>
						<ObjectAttribute text="{pos>POType}"/>
						<markers>
							<ObjectMarker type="{= ${pos>POStatus} === 'CONF' ? 'Favorite' : 'Flagged' }"/>
						</markers>
						<firstStatus>
							<ObjectStatus text="{ path: 'pos>POStatus', formatter: '.formatter.readbalePOStatus' }"/>
						</firstStatus>
					</ObjectListItem>
				</items>
				<headerToolbar>
					<OverflowToolbar>
						<Button text="Sort by Company Code" press=".handleSortPress"/>
						<Button text="Group by Company Code" press=".handleGroupPress"/>
					</OverflowToolbar>
				</headerToolbar>
			</List>
		</content>
	</Page>
</mvc:View>
```
Add method to navigate
```javascript
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, MessageToast, formatter, Filter, FilterOperator) {
	"use strict";
	return Controller.extend("search.PO.controller.PO", {
		formatter: formatter,
		onInit: function () {},
		onSearchPO: function () {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			MessageToast.show(oBundle.getText("searchPO"));
			// build filter array
			var aFilter = [];
			let inputData = JSON.parse(this.getView().getModel().getJSON()).poInput;
			if (inputData.companyCode) {
				aFilter.push(new Filter("Bukrs", FilterOperator.Contains, inputData.companyCode));
			}
			if (inputData.plant) {
				aFilter.push(new Filter("Plant", FilterOperator.Contains, inputData.plant));
			}
			if (inputData.poNumber) {
				aFilter.push(new Filter("Ebeln", FilterOperator.Contains, inputData.poNumber));
			}
			if (inputData.poType) {
				aFilter.push(new Filter("POType", FilterOperator.Contains, inputData.poType));
			}
			// filter binding
			var oList = this.byId("poList");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		},
		handleSortPress:function(){
			var oList = this.byId("poList");
			var oBinding = oList.getBinding("items");
			var aSorter = [];
			aSorter.push(new sap.ui.model.Sorter("Bukrs", false, false));
			oBinding.sort(aSorter);
		},
		handleGroupPress:function(){
				var oList = this.byId("poList");
			var oBinding = oList.getBinding("items");
			var aSorter = [];
			aSorter.push(new sap.ui.model.Sorter("Bukrs", false, true));
			oBinding.sort(aSorter);
		},
		showDetail:function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("podetail");
		}
	});
});
```


create a new view PODetail.view.xml
```xml
<mvc:View
	xmlns="sap.m"
	xmlns:mvc="sap.ui.core.mvc">
	<Page
		title="{i18n>PODetailPage}">
		<ObjectHeader
			title="{i18n>SelectedPO}"/>
	</Page>
</mvc:View>
```
update i18n
```html
searchPO=Searching PO's
poNumber=Purchase Order Number
poType=Purchase Order Type
plant=Plant
companyCode=Company Code
appTitle=My Title
appDescription=my desc
homePageTitle=My PO's
POList=PO List
CONF= PO Confirmed
PEND= PO Confirmation Pending
OPEN= PO Open
PODetailPage=PO Detail Page
SelectedPO=Selected PO
```

Now we are going to next page but nothing displayed lets add it

lets first add parameters in route manifest.json
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
	},
	"routing": {
	  "config": {
		"routerClass": "sap.m.routing.Router",
		"viewType": "XML",
		"viewPath": "search.PO.view",
		"controlId": "app",
		"controlAggregation": "pages",
		"async": true
	  },
	  "routes": [
		{
		  "pattern": "",
		  "name": "pohome",
		  "target": "pohome"
		},
		{
		  "pattern": "podetail/{po}",
		  "name": "podetail",
		  "target": "podetail"
		}
	  ],
	  "targets": {
		"pohome": {
		  "viewId": "PO",
		  "viewName": "PO"
		},
		"podetail": {
		  "viewId": "PODetail",
		  "viewName": "PODetail"
		}
	  }
	}
  }
}
```

lets add some fields in PODetail view
```xml
<mvc:View
controllerName="search.PO.controller.PODetail"
	xmlns="sap.m"
	xmlns:mvc="sap.ui.core.mvc">
	<Page
		title="{i18n>PODetailPage}">
		<ObjectHeader
		intro="{pos>Ebeln}"
			title="{pos>Matnr}"/>
	</Page>
</mvc:View>
```
Lets modify the navigation in PO controller
```javascript
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, MessageToast, formatter, Filter, FilterOperator) {
	"use strict";
	return Controller.extend("search.PO.controller.PO", {
		formatter: formatter,
		onInit: function () {},
		onSearchPO: function () {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			MessageToast.show(oBundle.getText("searchPO"));
			// build filter array
			var aFilter = [];
			let inputData = JSON.parse(this.getView().getModel().getJSON()).poInput;
			if (inputData.companyCode) {
				aFilter.push(new Filter("Bukrs", FilterOperator.Contains, inputData.companyCode));
			}
			if (inputData.plant) {
				aFilter.push(new Filter("Plant", FilterOperator.Contains, inputData.plant));
			}
			if (inputData.poNumber) {
				aFilter.push(new Filter("Ebeln", FilterOperator.Contains, inputData.poNumber));
			}
			if (inputData.poType) {
				aFilter.push(new Filter("POType", FilterOperator.Contains, inputData.poType));
			}
			// filter binding
			var oList = this.byId("poList");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		},
		handleSortPress:function(){
			var oList = this.byId("poList");
			var oBinding = oList.getBinding("items");
			var aSorter = [];
			aSorter.push(new sap.ui.model.Sorter("Bukrs", false, false));
			oBinding.sort(aSorter);
		},
		handleGroupPress:function(){
				var oList = this.byId("poList");
			var oBinding = oList.getBinding("items");
			var aSorter = [];
			aSorter.push(new sap.ui.model.Sorter("Bukrs", false, true));
			oBinding.sort(aSorter);
		},
		showDetail:function (oEvent) {
			var oItem = oEvent.getSource();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("podetail", {
				po: window.encodeURIComponent(oItem.getBindingContext("pos").getPath().substr(1))
			});
		}
	});
});
```

now we need to read it in our controller PODetail
```javascript
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent"
], function (Controller, UIComponent) {
	"use strict";
	return Controller.extend("search.PO.controller.PODetail", {
		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("podetail").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function (oEvent) {
			this.getView().bindElement({
				path: "/" + window.decodeURIComponent(oEvent.getParameter("arguments").po),
				model: "pos"
			});
		}
	});
});
```

Lets add the last missing puzzle back button in PODetail vie
```xml
<mvc:View
controllerName="search.PO.controller.PODetail"
	xmlns="sap.m"
	xmlns:mvc="sap.ui.core.mvc">
	<Page
		title="{i18n>PODetailPage}"
		showNavButton="true"
		navButtonPress=".onNavBack">
		<ObjectHeader
		intro="{pos>Ebeln}"
			title="{pos>Matnr}"/>
	</Page>
</mvc:View>
```
Lets hanlde this back button press in detail controller
```javascript
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/ui/core/routing/History"
], function (Controller, UIComponent,History) {
	"use strict";
	return Controller.extend("search.PO.controller.PODetail", {
		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("podetail").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function (oEvent) {
			this.getView().bindElement({
				path: "/" + window.decodeURIComponent(oEvent.getParameter("arguments").po),
				model: "pos"
			});
		},
		

		onNavBack: function () {
			var oHistory = History.getInstance();
			**var sPreviousHash = oHistory.getPreviousHash();
**
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = UIComponent.getRouterFor(this);
				oRouter.navTo("pohome", {}, true);
			}
		}
	});
});
```