require([
    //custom lib
    "myModules/InfoWindow/InfoWindow" ,
    "bism/bism/HeatmapLayer",
    //dojo lib
    "dojo/dom" ,
    "dojo/dom-construct" ,
    "dijit/registry" ,
    "esri/tasks/query",
    "esri/Color" ,
    "esri/symbols/SimpleMarkerSymbol" ,
    "esri/symbols/SimpleLineSymbol" ,
    "esri/symbols/SimpleFillSymbol" ,
    "esri/toolbars/draw" ,
    "dojo/on" ,
    "dojo/parser" ,
    "dojo/string" ,
    "dijit/layout/BorderContainer" ,
    "dijit/layout/ContentPane" ,
    "dojo/query",

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

    "esri/SpatialReference" ,
    "esri/layers/ArcGISTiledMapServiceLayer" ,
    "esri/layers/ArcGISDynamicMapServiceLayer" ,
    "esri/layers/ArcGISImageServiceLayer" ,
    "esri/layers/ImageServiceParameters" ,
    "esri/geometry/Point" ,
    "esri/geometry/Polygon",
    "esri/tasks/FindTask" ,
    "esri/tasks/FindParameters" ,

    "esri/InfoTemplate" ,
    "esri/symbols/CartographicLineSymbol" ,
    "esri/symbols/PictureFillSymbol" ,

    "esri/renderers/SimpleRenderer" ,
    "esri/tasks/Geoprocessor",
    "esri/tasks/JobInfo",
    "esri/tasks/FeatureSet",
    "esri/tasks/LinearUnit",
    "esri/tasks/PrintTask",
    "esri/tasks/PrintParameters",
    "esri/tasks/PrintTemplate",
    "dojo/domReady!"
] , function(InfoWindow ,HeatmapLayer, dom ,domConstruct , registry,QueryT,color,simpleMarkerSymbol,simpleLineSymbol,simpleFillSymbol,draw

){
    myInfoWindow = InfoWindow;
    dojoDom = dom;
    dojoDomConstruct = domConstruct;
    dojoRegistry = registry;
    bism = HeatmapLayer;
    queryT=QueryT;
    Color=color;
    SimpleMarkerSymbol=simpleMarkerSymbol;
    SimpleLineSymbol=simpleLineSymbol;
    SimpleFillSymbol=simpleFillSymbol;
    Draw=draw;
    createMap();
});