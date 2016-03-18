var $Map , $Toolbar , $CurrentGraphic , $CurrentSymbol;
var $markerSymbol , $lineSymbol , $fillSymbol , $ptSymbol , $polygonSymbol;
var $BaseServiceUrl = "http://60.29.110.104:6080/arcgis/rest/services/";

//dojo变量
var dojoDom , dojoDomConstruct , dojoRegistry;
//自定义变量
var myInfoWindow;
var bism;  //热度图变量
var pointBufferFeature;//热度图缓冲区
var vueExports = {};
var queryT;
var Color;
var SimpleMarkerSymbol,SimpleLineSymbol,SimpleFillSymbol,PictureFillSymbol;   //定义样式
var CartographicLineSymbol;
var Draw;


var bottomBarMenus = [
    {text:"事件定位" , icon:"fa-map-marker" , modal:"modal1"} ,
    {text:"范围确定" , icon:"fa-bank" , modal:"modal2"} ,
    {text:"影响分析" , icon:"fa-lightbulb-o" , modal:"modal3"} ,
    {text:"资源分析" , icon:"fa-question-circle" , modal:"modal4"} ,
    {text:"路径分析" , icon:"fa-sign-in" , modal:"modal5"} ,
    {text:"态势分析" , icon:"fa-info-circle" , modal:"modal6"}
];


///颜色十六进制转RGB方法
String.prototype.toRGB = function(){
    var sColor = this.toLowerCase();
    var sColorChange = [];
    for(var i=1; i<7; i+=2){
        sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));
    }
    return sColorChange;
};
