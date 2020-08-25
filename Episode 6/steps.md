## Lets bring in Router
First of all we will remove the hardcoded pages in App.view.xml. Our flexible column layout now uses a dynamic layout from another. 
```xml
<mvc:View controllerName="Supplier.SecondApp.controller.App" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns="sap.m" xmlns:f="sap.f">
	<App id="app">
		<f:FlexibleColumnLayout id="flexibleColumnLayout"
		stateChange=".onStateChanged"
		backgroundDesign="Solid"
		layout="{lay>/layout}" />
			

	</App>
</mvc:View>
```

Since it is a global model lets set it in Component.js
```javascript
sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"Supplier/SecondApp/model/models",
	'sap/ui/model/json/JSONModel',
	'sap/f/library'
], function (UIComponent, Device, models,JSONModel,fioriLibrary) {
	"use strict";

	return UIComponent.extend("Supplier.SecondApp.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			var oModel,
		
				oRouter;
				oModel = new JSONModel();
			this.setModel(oModel,"lay");
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
		oRouter = this.getRouter();
			oRouter.attachBeforeRouteMatched(this._onBeforeRouteMatched, this);
			oRouter.initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
		},

		_onBeforeRouteMatched: function(oEvent) {
			var oModel = this.getModel("lay"),
				sLayout = oEvent.getParameters().arguments.layout;

			// If there is no layout parameter, set a default layout (normally OneColumn)
			if (!sLayout) {
				sLayout = fioriLibrary.LayoutType.OneColumn;
			}

			oModel.setProperty("/layout", sLayout);
		}
	});
});
```
Now how do we react basically in App.controller.js we handle state changes
```javascript
sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("Supplier.SecondApp.controller.App", {
		onInit: function () {
			this.oOwnerComponent = this.getOwnerComponent();
			this.oRouter = this.oOwnerComponent.getRouter();
			this.oRouter.attachRouteMatched(this.onRouteMatched, this);
		},

		onRouteMatched: function (oEvent) {
			var sRouteName = oEvent.getParameter("name"),
				oArguments = oEvent.getParameter("arguments");

			// Save the current route name
			this.currentRouteName = sRouteName;
				this.supplier = oArguments.supplier;
		},

		onStateChanged: function (oEvent) {
			var bIsNavigationArrow = oEvent.getParameter("isNavigationArrow"),
				sLayout = oEvent.getParameter("layout");

			// Replace the URL with the new layout if a navigation arrow was used
			if (bIsNavigationArrow) {
				this.oRouter.navTo(this.currentRouteName, {layout: sLayout, supplier: this.supplier}, true);
			}
		},

		onExit: function () {
			this.oRouter.detachRouteMatched(this.onRouteMatched, this);
		}
	});
});
```
What if we select one line then in Supplier.controller.js handle the press 
```javascript
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/f/library'
], function (Controller, fioriLibrary) {
	"use strict";

	return Controller.extend("Supplier.SecondApp.controller.Supplier", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Supplier.SecondApp.view.Supplier
		 */
		onInit: function () {
			this.oView = this.getView();
			this.oRouter = this.getOwnerComponent().getRouter();
		},
		onSelectionChange: function (oEvent) {
				// var oFCL = this.oView.getParent().getParent();

				// oFCL.setLayout(fioriLibrary.LayoutType.TwoColumnsMidExpanded);
				var supplierPath = oEvent.getParameter("listItem").getBindingContext().getPath()
				var supplier = supplierPath.split("/").slice(-1).pop();

			this.oRouter.navTo("detail", {layout: fioriLibrary.LayoutType.TwoColumnsMidExpanded, supplier: supplier});
			}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf Supplier.SecondApp.view.Supplier
			 */
			//	onBeforeRendering: function() {
			//
			//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf Supplier.SecondApp.view.Supplier
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf Supplier.SecondApp.view.Supplier
		 */
		//	onExit: function() {
		//
		//	}

	});

});
```
We have done almost everything but have not defined any routes:)

```json
{
	"_version": "1.12.0",
	"sap.app": {
		"id": "Supplier.SecondApp",
		"type": "application",
		"i18n": "i18n/i18n.properties",
		"applicationVersion": {
			"version": "1.0.0"
		},
		"title": "{{appTitle}}",
		"description": "{{appDescription}}",
		"sourceTemplate": {
			"id": "servicecatalog.connectivityComponentForManifest",
			"version": "0.0.0"
		},
		"dataSources": {
			"Odata.svc": {
				"uri": "/MyDest/V2/Odata/Odata.svc/",
				"type": "OData",
				"settings": {
					"localUri": "localService/metadata.xml"
				}
			}
		}
	},
	"sap.ui": {
		"technology": "UI5",
		"icons": {
			"icon": "",
			"favIcon": "",
			"phone": "",
			"phone@2": "",
			"tablet": "",
			"tablet@2": ""
		},
		"deviceTypes": {
			"desktop": true,
			"tablet": true,
			"phone": true
		}
	},
	"sap.ui5": {
		"flexEnabled": false,
		"rootView": {
			"viewName": "Supplier.SecondApp.view.App",
			"type": "XML",
			"async": true,
			"id": "App"
		},
		"dependencies": {
			"minUI5Version": "1.65.6",
			"libs": {
				"sap.ui.layout": {},
				"sap.ui.core": {},
				"sap.m": {},
				"sap.f": {},
				"sap.uxap": {}
			}
		},
		"contentDensities": {
			"compact": true,
			"cozy": true
		},
		"models": {
			"i18n": {
				"type": "sap.ui.model.resource.ResourceModel",
				"settings": {
					"bundleName": "Supplier.SecondApp.i18n.i18n"
				}
			},
			"": {
				"type": "sap.ui.model.odata.v2.ODataModel",
				"settings": {
					"defaultOperationMode": "Server",
					"defaultBindingMode": "OneWay",
					"defaultCountMode": "Request"
				},
				"dataSource": "Odata.svc",
				"preload": true
			}
		},
		"resources": {
			"css": [
				{
					"uri": "css/style.css"
				}
			]
		},
		"routing": {
			"config": {
				"routerClass": "sap.f.routing.Router",
				"viewType": "XML",
				"async": true,
				"viewPath": "Supplier.SecondApp.view",
				"controlId": "flexibleColumnLayout",
				"transition": "slide"
			},
			"routes": [
				{
					"pattern": ":layout:",
					"name": "master",
					"target": [
						"master",
						"detail"
					]
				},
				{
					"pattern": "detail/{supplier}/{layout}",
					"name": "detail",
					"target": [
						"master",
						"detail"
					]
				}
			],
			"targets": {
				"master": {
					"viewName": "Supplier",
					"controlAggregation": "beginColumnPages"
				},
				"detail": {
					"viewName": "SupplierDetail",
					"controlAggregation": "midColumnPages"
				}
			}
		}
	}
}
```

Okay now we are able to pass selected data to next page via navigation. Lets adapt our SupplierDetail
Lets add methods to SupplierDetail controller to read the passed value.
Modify our SupplierDetail view
```xml 
<mvc:View 	controllerName="Supplier.SecondApp.controller.SupplierDetail" xmlns="sap.uxap"
	xmlns:m="sap.m"
	xmlns:f="sap.f"
	xmlns:form="sap.ui.layout.form"
	xmlns:mvc="sap.ui.core.mvc">
	<ObjectPageLayout
		id="ObjectPageLayout"
		showTitleInHeaderContent="true"
		alwaysShowContentHeader="false"
		preserveHeaderStateOnScroll="false"
		headerContentPinnable="true"
		isChildPage="true"
		upperCaseAnchorBar="false">
		<headerTitle>
			<ObjectPageDynamicHeaderTitle>
				<actions>
					<m:ToggleButton
						text="Edit"
						type="Emphasized"
						press=".onEditToggleButtonPress"/>
					<m:Button
						text="Delete"
						type="Transparent"/>
					<m:Button
						text="Copy"
						type="Transparent"/>
					<m:Button
						icon="sap-icon://action"
						type="Transparent"/>
				</actions>
			</ObjectPageDynamicHeaderTitle>
		</headerTitle>
		
		<headerContent>
			<m:FlexBox wrap="Wrap" fitContainer="true" alignItems="Stretch">
			
				<m:VBox justifyContent="Center" class="sapUiSmallMarginEnd">
					<m:Label text="--SupplierName---"/>
				</m:VBox>
			
			</m:FlexBox>
		</headerContent>
		<sections>
			<ObjectPageSection title="General Information">
				<subSections>
					<ObjectPageSubSection>
						<blocks>
							<form:SimpleForm
								maxContainerCols="2"
								editable="false"
								layout="ResponsiveGridLayout"
								labelSpanL="12"
								labelSpanM="12"
								emptySpanL="0"
								emptySpanM="0"
								columnsL="1"
								columnsM="1">
								<form:content>
								<m:Label text="Street"/>
									<m:Text text="{/Address/Street}"/>
									<m:Label text="City"/>
									<m:Text text="{/Address/City}"/>
									<m:Label text="State"/>
									<m:Text text="{/Address/State}"/>
								</form:content>
							</form:SimpleForm>
						</blocks>
					</ObjectPageSubSection>
				</subSections>
			</ObjectPageSection>

			<ObjectPageSection title="Products">
				<subSections>
					<ObjectPageSubSection>
						<blocks>
							<m:Table
								id="productsTable"
								items="{/Products}"
								>
								<m:columns>
									<m:Column/>
								</m:columns>
								<m:items>
									<m:ColumnListItem type="Navigation">
										<m:cells>
											<m:ObjectIdentifier text="{Name}"/>
										</m:cells>
									</m:ColumnListItem>
								</m:items>
							</m:Table>
						</blocks>
					</ObjectPageSubSection>
				</subSections>
			</ObjectPageSection>
		</sections>
		<footer>
			<m:OverflowToolbar>
				<m:ToolbarSpacer/>
				<m:Button type="Accept" text="Save"/>
				<m:Button type="Reject" text="Cancel"/>
			</m:OverflowToolbar>
		</footer>
	</ObjectPageLayout>

</mvc:View>
```
In supplier detail controller we will add the logic to update the table items binding first.
```javascript
sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("Supplier.SecondApp.controller.SupplierDetail", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Supplier.SecondApp.view.SupplierDetail
		 */
		onInit: function () {
			var oOwnerComponent = this.getOwnerComponent();

			this.oRouter = oOwnerComponent.getRouter();
			this.oModel = oOwnerComponent.getModel();

			this.oRouter.getRoute("master").attachPatternMatched(this._onSupplierMatched, this);
			this.oRouter.getRoute("detail").attachPatternMatched(this._onSupplierMatched, this);
		},

		_onSupplierMatched: function (oEvent) {
			this._supplier = oEvent.getParameter("arguments").supplier || this._supplier || "0";
			this.byId("productsTable").bindItems({
				path: "/" + this._supplier + "/Products"
				
			});
		},
		onExit: function () {
			this.oRouter.getRoute("master").detachPatternMatched(this._onSupplierMatched, this);
			this.oRouter.getRoute("detail").detachPatternMatched(this._onSupplierMatched, this);
		},
		onEditToggleButtonPress: function () {
				var oObjectPage = this.getView().byId("ObjectPageLayout"),
					bCurrentShowFooterState = oObjectPage.getShowFooter();

				oObjectPage.setShowFooter(!bCurrentShowFooterState);
			}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf Supplier.SecondApp.view.SupplierDetail
			 */
			//	onBeforeRendering: function() {
			//
			//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf Supplier.SecondApp.view.SupplierDetail
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf Supplier.SecondApp.view.SupplierDetail
		 */
		//	onExit: function() {
		//
		//	}

	});

});
```
Template is missing how do we find it. We shall not define again as our XML view already contains how we want our data to be.
```javascript
sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("Supplier.SecondApp.controller.SupplierDetail", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Supplier.SecondApp.view.SupplierDetail
		 */
		onInit: function () {
			var oOwnerComponent = this.getOwnerComponent();

			this.oRouter = oOwnerComponent.getRouter();
			this.oModel = oOwnerComponent.getModel();

			this.oRouter.getRoute("master").attachPatternMatched(this._onSupplierMatched, this);
			this.oRouter.getRoute("detail").attachPatternMatched(this._onSupplierMatched, this);
		},

		_onSupplierMatched: function (oEvent) {
			this._supplier = oEvent.getParameter("arguments").supplier || this._supplier || "0";
			this.byId("productsTable").bindItems({
				path: "/" + this._supplier + "/Products",
				template: this.byId("productsTable").getBindingInfo("items").template
			});
		},
		onExit: function () {
			this.oRouter.getRoute("master").detachPatternMatched(this._onSupplierMatched, this);
			this.oRouter.getRoute("detail").detachPatternMatched(this._onSupplierMatched, this);
		},
		onEditToggleButtonPress: function () {
				var oObjectPage = this.getView().byId("ObjectPageLayout"),
					bCurrentShowFooterState = oObjectPage.getShowFooter();

				oObjectPage.setShowFooter(!bCurrentShowFooterState);
			}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf Supplier.SecondApp.view.SupplierDetail
			 */
			//	onBeforeRendering: function() {
			//
			//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf Supplier.SecondApp.view.SupplierDetail
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf Supplier.SecondApp.view.SupplierDetail
		 */
		//	onExit: function() {
		//
		//	}

	});

});
```
Lets adjust our header also. Lets bind element at view level. Change JS code of SupplierDetail controller
```javascript
sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("Supplier.SecondApp.controller.SupplierDetail", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Supplier.SecondApp.view.SupplierDetail
		 */
		onInit: function () {
			var oOwnerComponent = this.getOwnerComponent();

			this.oRouter = oOwnerComponent.getRouter();
			this.oModel = oOwnerComponent.getModel();

			this.oRouter.getRoute("master").attachPatternMatched(this._onSupplierMatched, this);
			this.oRouter.getRoute("detail").attachPatternMatched(this._onSupplierMatched, this);
		},

		_onSupplierMatched: function (oEvent) {
			this._supplier = oEvent.getParameter("arguments").supplier || this._supplier || "0";
			this.byId("productsTable").bindItems({
				path: "/" + this._supplier + "/Products",
				template: this.byId("productsTable").getBindingInfo("items").template
			});
			this.getView().bindElement({
				path: "/" +this._supplier
				
			});
		},
		onExit: function () {
			this.oRouter.getRoute("master").detachPatternMatched(this._onSupplierMatched, this);
			this.oRouter.getRoute("detail").detachPatternMatched(this._onSupplierMatched, this);
		},
		onEditToggleButtonPress: function () {
				var oObjectPage = this.getView().byId("ObjectPageLayout"),
					bCurrentShowFooterState = oObjectPage.getShowFooter();

				oObjectPage.setShowFooter(!bCurrentShowFooterState);
			}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf Supplier.SecondApp.view.SupplierDetail
			 */
			//	onBeforeRendering: function() {
			//
			//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf Supplier.SecondApp.view.SupplierDetail
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf Supplier.SecondApp.view.SupplierDetail
		 */
		//	onExit: function() {
		//
		//	}

	});

});
```
 Our SupplierDetail xml view 
 ```xml
 <mvc:View 	controllerName="Supplier.SecondApp.controller.SupplierDetail" xmlns="sap.uxap"
	xmlns:m="sap.m"
	xmlns:f="sap.f"
	xmlns:form="sap.ui.layout.form"
	xmlns:mvc="sap.ui.core.mvc">
	<ObjectPageLayout
		id="ObjectPageLayout"
		showTitleInHeaderContent="true"
		alwaysShowContentHeader="false"
		preserveHeaderStateOnScroll="false"
		headerContentPinnable="true"
		isChildPage="true"
		upperCaseAnchorBar="false">
		<headerTitle>
			<ObjectPageDynamicHeaderTitle>
				<actions>
					<m:ToggleButton
						text="Edit"
						type="Emphasized"
						press=".onEditToggleButtonPress"/>
					<m:Button
						text="Delete"
						type="Transparent"/>
					<m:Button
						text="Copy"
						type="Transparent"/>
					<m:Button
						icon="sap-icon://action"
						type="Transparent"/>
				</actions>
			</ObjectPageDynamicHeaderTitle>
		</headerTitle>
		
		<headerContent>
			<m:FlexBox wrap="Wrap" fitContainer="true" alignItems="Stretch">
			
				<m:VBox justifyContent="Center" class="sapUiSmallMarginEnd">
					<m:Label text="{Name}"/>
				</m:VBox>
			
			</m:FlexBox>
		</headerContent>
		<sections>
			<ObjectPageSection title="General Information">
				<subSections>
					<ObjectPageSubSection>
						<blocks>
							<form:SimpleForm
								maxContainerCols="2"
								editable="false"
								layout="ResponsiveGridLayout"
								labelSpanL="12"
								labelSpanM="12"
								emptySpanL="0"
								emptySpanM="0"
								columnsL="1"
								columnsM="1">
								<form:content>
								<m:Label text="Street"/>
									<m:Text text="{Address/Street}"/>
									<m:Label text="City"/>
									<m:Text text="{Address/City}"/>
									<m:Label text="State"/>
									<m:Text text="{Address/State}"/>
								</form:content>
							</form:SimpleForm>
						</blocks>
					</ObjectPageSubSection>
				</subSections>
			</ObjectPageSection>

			<ObjectPageSection title="Products">
				<subSections>
					<ObjectPageSubSection>
						<blocks>
							<m:Table
								id="productsTable"
								items="{/Products}"
								>
								<m:columns>
									<m:Column/>
								</m:columns>
								<m:items>
									<m:ColumnListItem type="Navigation">
										<m:cells>
											<m:ObjectIdentifier text="{Name}"/>
										</m:cells>
									</m:ColumnListItem>
								</m:items>
							</m:Table>
						</blocks>
					</ObjectPageSubSection>
				</subSections>
			</ObjectPageSection>
		</sections>
		<footer>
			<m:OverflowToolbar>
				<m:ToolbarSpacer/>
				<m:Button type="Accept" text="Save"/>
				<m:Button type="Reject" text="Cancel"/>
			</m:OverflowToolbar>
		</footer>
	</ObjectPageLayout>

</mvc:View>
```

Lets now try to understand how we post data to our url. 
First we need to generate a token 
```xml
https://services.odata.org/V2/(S(fi10nzln4kd14c1ssrb0hyph))/OData/OData.svc/
```

Now we have got token lets see how many supplier we have and lets try to create one.
```json
If-Match: *
```

Okay so now we know how to handle Create/Update/Delete. Lets start building our frontend for Adding a supplier.
Lets add Create button to supplier view. 
```xml
<mvc:View controllerName="Supplier.SecondApp.controller.Supplier" 	xmlns="sap.m"
	xmlns:semantic="sap.f.semantic"
	xmlns:mvc="sap.ui.core.mvc">

	<semantic:SemanticPage
		id="masterPage"
		preserveHeaderStateOnScroll="true"
		toggleHeaderOnTitleClick="false">
		<semantic:titleHeading>
			<Title
				id="masterPageTitle"
				text="{masterView>/title}"
				level="H2"/>
		</semantic:titleHeading>
		<semantic:content>
			<!-- For client side filtering add this to the items attribute: parameters: {operationMode: 'Client'}}" -->
			<List
				id="list"
				width="auto"
				class="sapFDynamicPageAlignContent"
				items="{
					path: '/Suppliers',
					sorter: {
						path: 'Name',
						descending: false
					},
					groupHeaderFactory: '.createGroupHeader'
				}"
				busyIndicatorDelay="{masterView>/delay}"
				noDataText="{masterView>/noDataText}"
				mode="{= ${device>/system/phone} ? 'None' : 'SingleSelectMaster'}"
				growing="true"
				growingScrollToLoad="true"
				updateFinished=".onUpdateFinished"
				selectionChange=".onSelectionChange">
				<infoToolbar>
					<Toolbar
						active="true"
						id="filterBar"
						visible="{masterView>/isFilterBarVisible}"
						press=".onOpenViewSettings">
						<Title
							id="filterBarLabel"
							text="{masterView>/filterBarLabel}"
							level="H3"/>
					</Toolbar>
				</infoToolbar>
				<headerToolbar>
					<OverflowToolbar>
						<SearchField
							id="searchField"
							showRefreshButton="true"
							tooltip="{i18n>masterSearchTooltip}"
							search=".onSearch"
							width="auto">
							<layoutData>
								<OverflowToolbarLayoutData
									minWidth="150px"
									maxWidth="240px"
									shrinkable="true"
									priority="NeverOverflow"/>
							</layoutData>
						</SearchField>
						<ToolbarSpacer/>
						<Button
							id="addButton"
							press=".onCreateSupplier"
							icon="sap-icon://add"
							type="Transparent"/>
						<Button
							id="sortButton"
							press=".onOpenViewSettings"
							icon="sap-icon://sort"
							type="Transparent"/>
						<Button
							id="filterButton"
							press=".onOpenViewSettings"
							icon="sap-icon://filter"
							type="Transparent"/>
						<Button
							id="groupButton"
							press=".onOpenViewSettings"
							icon="sap-icon://group-2"
							type="Transparent"/>
					</OverflowToolbar>
				</headerToolbar>
				<items>
					<ObjectListItem
						type="Navigation"
						press=".onSelectionChange"
						title="{Name}"
						number="{
							path: 'ID',
							formatter: '.formatter.currencyValue'
						}"
						numberUnit="{Address/City}">
					</ObjectListItem>
				</items>
			</List>
		</semantic:content>
	</semantic:SemanticPage>
</mvc:View>
```

Create a new view CreateSupplier with below code
```xml
<mvc:View controllerName="Supplier.SecondApp.controller.CreateSupplier" xmlns:core="sap.ui.core" xmlns:f="sap.ui.layout.form"
	xmlns:footerbar="sap.ushell.ui.footerbar" xmlns:l="sap.ui.layout" xmlns:mvc="sap.ui.core.mvc" xmlns:semantic="sap.m.semantic"
	xmlns:smart="sap.ui.comp.smartfield" xmlns="sap.m">
	<semantic:DetailPage id="page" navButtonPress="onNavBack" title="Create Supplier" busy="{viewModel>/busy}">
		<semantic:content>
			<f:SimpleForm class="editableForm" columnsL="1" columnsM="1" editable="true" emptySpanL="4" emptySpanM="4" id="newEntitySimpleForm"
				labelSpanL="3" labelSpanM="3" layout="ResponsiveGridLayout" maxContainerCols="2" minWidth="1024"
				title="{= ${viewModel>/mode} === 'edit'? 'Edit ODataDemo.Supplier': 'New ODataDemo.Supplier'}">
				<f:content>
					<Label text="ID" required="true"/>
					<Input name="ID" id="ID_id" valueLiveUpdate="true" liveChange="_validateSaveEnablement"
						enabled="{= ${viewModel>/mode} === 'edit'? false: true}" visible="true"
						value="{ path: 'ID', type: 'sap.ui.model.odata.type.Int32' , constraints:{ nullable:false } }"/>
					<Label text="Name" required="false"/>
					<Input name="Name" id="Name_id" valueLiveUpdate="true" liveChange="_validateSaveEnablement" enabled="true" visible="true"
						value="{ path: 'Name', type: 'sap.ui.model.odata.type.String' }"/>
					<Label text="Address/Street" required="true"/>
					<Input name="Address/Street" id="Address_Street_id" valueLiveUpdate="true" liveChange="_validateSaveEnablement" enabled="true"
						visible="true" value="{ path: 'Address/Street', type: 'sap.ui.model.odata.type.String' , constraints:{ nullable:false } }"/>
					<Label text="Address/City" required="true"/>
					<Input name="Address/City" id="Address_City_id" valueLiveUpdate="true" liveChange="_validateSaveEnablement" enabled="true" visible="true"
						value="{ path: 'Address/City', type: 'sap.ui.model.odata.type.String' , constraints:{ nullable:false } }"/>
					<Label text="Address/State" required="true"/>
					<Input name="Address/State" id="Address_State_id" valueLiveUpdate="true" liveChange="_validateSaveEnablement" enabled="true" visible="true"
						value="{ path: 'Address/State', type: 'sap.ui.model.odata.type.String' , constraints:{ nullable:false } }"/>
					<Label text="Address/ZipCode" required="true"/>
					<Input name="Address/ZipCode" id="Address_ZipCode_id" valueLiveUpdate="true" liveChange="_validateSaveEnablement" enabled="true"
						visible="true" value="{ path: 'Address/ZipCode', type: 'sap.ui.model.odata.type.String' , constraints:{ nullable:false } }"/>
					<Label text="Address/Country" required="true"/>
					<Input name="Address/Country" id="Address_Country_id" valueLiveUpdate="true" liveChange="_validateSaveEnablement" enabled="true"
						visible="true" value="{ path: 'Address/Country', type: 'sap.ui.model.odata.type.String' , constraints:{ nullable:false } }"/>
					<Label text="Concurrency" required="true"/>
					<Input name="Concurrency" id="Concurrency_id" valueLiveUpdate="true" liveChange="_validateSaveEnablement" enabled="true" visible="true"
						value="{ path: 'Concurrency', type: 'sap.ui.model.odata.type.Int32' , constraints:{ nullable:false } }"/>
				</f:content>
			</f:SimpleForm>
		</semantic:content>
		<semantic:saveAction>
			<semantic:SaveAction id="save" enabled="{viewModel>/enableCreate}" press="onSave"/>
		</semantic:saveAction>
		<semantic:cancelAction>
			<semantic:CancelAction id="cancel" press="onCancel"></semantic:CancelAction>
		</semantic:cancelAction>
	</semantic:DetailPage>
</mvc:View>
```

We have defined the view now lets define a new route towards it in manifest.json
```json 
{
	"_version": "1.12.0",
	"sap.app": {
		"id": "Supplier.SecondApp",
		"type": "application",
		"i18n": "i18n/i18n.properties",
		"applicationVersion": {
			"version": "1.0.0"
		},
		"title": "{{appTitle}}",
		"description": "{{appDescription}}",
		"sourceTemplate": {
			"id": "servicecatalog.connectivityComponentForManifest",
			"version": "0.0.0"
		},
		"dataSources": {
			"Odata.svc": {
				"uri": "/MyDest/V2/OData/OData.svc/",
				"type": "OData",
				"settings": {
					"localUri": "localService/metadata.xml"
				}
			}
		}
	},
	"sap.ui": {
		"technology": "UI5",
		"icons": {
			"icon": "",
			"favIcon": "",
			"phone": "",
			"phone@2": "",
			"tablet": "",
			"tablet@2": ""
		},
		"deviceTypes": {
			"desktop": true,
			"tablet": true,
			"phone": true
		}
	},
	"sap.ui5": {
		"flexEnabled": false,
		"rootView": {
			"viewName": "Supplier.SecondApp.view.App",
			"type": "XML",
			"async": true,
			"id": "App"
		},
		"dependencies": {
			"minUI5Version": "1.65.6",
			"libs": {
				"sap.ui.layout": {},
				"sap.ui.core": {},
				"sap.m": {},
				"sap.f": {},
				"sap.uxap": {}
			}
		},
		"contentDensities": {
			"compact": true,
			"cozy": true
		},
		"models": {
			"i18n": {
				"type": "sap.ui.model.resource.ResourceModel",
				"settings": {
					"bundleName": "Supplier.SecondApp.i18n.i18n"
				}
			},
			"": {
				"type": "sap.ui.model.odata.v2.ODataModel",
				"settings": {
					"defaultOperationMode": "Server",
					"defaultBindingMode": "OneWay",
					"defaultCountMode": "Request",
					"useBatch": false
				},
				"dataSource": "Odata.svc",
				"preload": true
			}
		},
		"resources": {
			"css": [
				{
					"uri": "css/style.css"
				}
			]
		},
		"routing": {
			"config": {
				"routerClass": "sap.f.routing.Router",
				"viewType": "XML",
				"async": true,
				"viewPath": "Supplier.SecondApp.view",
				"controlId": "flexibleColumnLayout",
				"transition": "slide"
			},
			"routes": [
				{
					"pattern": ":layout:",
					"name": "master",
					"target": [
						"master",
						"detail"
					]
				},
				{
					"pattern": "detail/{supplier}/{layout}",
					"name": "detail",
					"target": [
						"master",
						"detail"
					]
				},
				{
					"pattern": "create/{layout}",
					"name": "create",
					"target": [
						"master",
						"create"
					]
				}
			],
			"targets": {
				"master": {
					"viewName": "Supplier",
					"controlAggregation": "beginColumnPages"
				},
				"detail": {
					"viewName": "SupplierDetail",
					"controlAggregation": "midColumnPages"
				},
				"create": {
					"controlAggregation": "midColumnPages",
					"viewName": "CreateSupplier"
				}
			}
		}
	}
}
```

Lets now call view the SupplierController.
```javascript 
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/f/library'
], function (Controller, fioriLibrary) {
	"use strict";

	return Controller.extend("Supplier.SecondApp.controller.Supplier", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Supplier.SecondApp.view.Supplier
		 */
		onInit: function () {
			this.oView = this.getView();
			this.oRouter = this.getOwnerComponent().getRouter();
		},
		onSelectionChange: function (oEvent) {
				// var oFCL = this.oView.getParent().getParent();

				// oFCL.setLayout(fioriLibrary.LayoutType.TwoColumnsMidExpanded);
				var supplierPath = oEvent.getParameter("listItem").getBindingContext().getPath()
				var supplier = supplierPath.split("/").slice(-1).pop();

			this.oRouter.navTo("detail", {layout: fioriLibrary.LayoutType.TwoColumnsMidExpanded, supplier: supplier});
			},
			onCreateSupplier:function(oEvent){
					this.oRouter.navTo("create", {layout: fioriLibrary.LayoutType.TwoColumnsMidExpanded});
			}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf Supplier.SecondApp.view.Supplier
			 */
			//	onBeforeRendering: function() {
			//
			//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf Supplier.SecondApp.view.Supplier
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf Supplier.SecondApp.view.Supplier
		 */
		//	onExit: function() {
		//
		//	}

	});

});
```