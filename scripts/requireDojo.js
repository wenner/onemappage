require([
    //custom lib
    "myModules/InfoWindow/InfoWindow" ,

    //dojo lib
    "dojo/dom" ,
    "dojo/dom-construct" ,
    "dojo/on" ,
    "dojo/parser" ,
    "dojo/string" ,
    "dijit/layout/BorderContainer" ,
    "dijit/layout/ContentPane" ,


    //arcgis lib
    "esri/map" ,
    "esri/basemaps" ,
    "esri/dijit/Basemap" ,
    "esri/dijit/BasemapLayer" ,
    "esri/dijit/BasemapToggle" ,
    "esri/dijit/BasemapGallery" ,
    "esri/arcgis/utils" ,
    "esri/geometry/Extent" ,
    "esri/layers/GraphicsLayer" ,
    "esri/graphic" ,
    "esri/layers/FeatureLayer" ,
    "esri/toolbars/draw" ,
    "esri/SpatialReference" ,
    "esri/layers/ArcGISTiledMapServiceLayer" ,
    "esri/layers/ArcGISDynamicMapServiceLayer" ,
    "esri/layers/ArcGISImageServiceLayer" ,
    "esri/layers/ImageServiceParameters" ,
    "esri/geometry/Point" ,
    "esri/tasks/FindTask" ,
    "esri/tasks/FindParameters" ,
    "esri/InfoTemplate" ,
    "esri/symbols/CartographicLineSymbol" ,
    "esri/symbols/PictureFillSymbol" ,
    "esri/symbols/SimpleMarkerSymbol" ,
    "esri/symbols/SimpleLineSymbol" ,
    "esri/symbols/SimpleFillSymbol" ,
    "esri/renderers/SimpleRenderer" ,
    "esri/Color" ,

    "dojo/domReady!"
] , function(
    InfoWindow ,
    dom ,
    domConstruct
){
    myInfoWindow = InfoWindow;
    dojoDom = dom;
    dojoDomConstruct = domConstruct;

    createMap();
    $("#pageloader").hide();
});