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
var SimpleMarkerSymbol,SimpleLineSymbol,SimpleFillSymbol;   //定义样式
var Draw;



///颜色十六进制转RGB方法
String.prototype.toRGB = function(){
    var sColor = this.toLowerCase();
    var sColorChange = [];
    for(var i=1; i<7; i+=2){
        sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));
    }
    return sColorChange;
};
