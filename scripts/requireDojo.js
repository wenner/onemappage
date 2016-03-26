require([
    //custom lib
    "myModules/InfoWindow/InfoWindow",
    "myAppMeasure/measure",
    "bism/bism/HeatmapLayer",
    //dojo lib
    "dojo/dom",
    "dojo/dom-construct",
    "dijit/registry",
    "esri/tasks/query",
    "esri/Color",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/CartographicLineSymbol",
    "esri/symbols/PictureFillSymbol",
    "esri/toolbars/draw",
    "scripts/modules/poltDraw/DrawExt.js",
    "esri/layers/GraphicsLayer",
    "esri/graphic",
    "esri/layers/FeatureLayer",
    "esri/symbols/TextSymbol",
    "esri/symbols/PictureMarkerSymbol",
    "esri/tasks/RouteTask",
    "esri/tasks/RouteParameters",
    "esri/tasks/FeatureSet",
    "esri/tasks/ServiceAreaTask",
    "esri/tasks/ServiceAreaParameters",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/layers/ImageParameters",
    "esri/InfoTemplate",
    "esri/renderers/SimpleRenderer",
    "esri/lang",
    "dojo/number",
    "dojo/dom-style",
    "dijit/TooltipDialog",
    "dijit/popup",

    "dojo/on",
    "dojo/parser",
    "dojo/string",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane",
    "dojo/query",

    //arcgis lib
    "esri/map",
    "esri/basemaps",
    "esri/dijit/Basemap",
    "esri/dijit/BasemapLayer",
    "esri/dijit/BasemapToggle",
    "esri/dijit/BasemapGallery",
    "esri/arcgis/utils",
    "esri/geometry/Extent",


    "esri/SpatialReference",
    "esri/layers/ArcGISTiledMapServiceLayer",

    "esri/layers/ArcGISImageServiceLayer",
    "esri/layers/ImageServiceParameters",
    "esri/geometry/Point",
    "esri/geometry/Polygon",
    "esri/tasks/FindTask",
    "esri/tasks/FindParameters",





    "esri/tasks/Geoprocessor",
    "esri/tasks/JobInfo",

    "esri/tasks/LinearUnit",
    "esri/tasks/PrintTask",
    "esri/tasks/PrintParameters",
    "esri/tasks/PrintTemplate",
    "dojo/domReady!"
], function (InfoWindow,measure, HeatmapLayer, dom, domConstruct, registry, QueryT, color, simpleMarkerSymbol, simpleLineSymbol, simpleFillSymbol, cartographicLineSymbol, pictureFillSymbol,
             draw, poltDraw, graphicsLayer, graphic, featureLayer,textSymbol,pictureMarkerSymbol,routeTask, routeParameters,featureSet,serviceAreaTask, serviceAreaParameters,
             arcGISDynamicMapServiceLayer,imageParameters,infoTemplate,simpleRenderer,EsriLang,Number,DomStyle,tooltipDialog, DijitPopup
) {
    myInfoWindow = InfoWindow;
    Measure=measure;
    dojoDom = dom;
    dojoDomConstruct = domConstruct;
    dojoRegistry = registry;
    bism = HeatmapLayer;
    queryT = QueryT;
    Color = color;
    SimpleMarkerSymbol = simpleMarkerSymbol;
    SimpleLineSymbol = simpleLineSymbol;
    SimpleFillSymbol = simpleFillSymbol;
    CartographicLineSymbol = cartographicLineSymbol;
    PictureFillSymbol = pictureFillSymbol;
    PictureMarkerSymbol=pictureMarkerSymbol;
    Draw = draw;
    PoltDraw = poltDraw;
    GraphicsLayer = graphicsLayer;
    Graphic = graphic;
    FeatureLayer = featureLayer;
    TextSymbol=textSymbol;
    RouteTask=routeTask;
    RouteParameters=routeParameters;
    ServiceAreaTask=serviceAreaTask;
    ServiceAreaParameters=serviceAreaParameters;
    FeatureSet=featureSet;
    ArcGISDynamicMapServiceLayer=arcGISDynamicMapServiceLayer;
    ImageParameters=imageParameters;
    InfoTemplate=infoTemplate;
    SimpleRenderer=simpleRenderer;
    esriLang=EsriLang;
    number=Number;
    domStyle=DomStyle;
    TooltipDialog=tooltipDialog;
    dijitPopup=DijitPopup;
    init();
});