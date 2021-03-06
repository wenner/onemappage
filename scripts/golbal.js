var $Map , $Toolbar , $CurrentGraphic , $CurrentSymbol;
var $markerSymbol , $lineSymbol , $fillSymbol , $ptSymbol , $polygonSymbol;
var $BaseServiceUrl = "http://60.29.110.104:6080/arcgis/rest/services/";

//dojo变量
var dojoOn, dojoDom , dojoDomConstruct , dojoRegistry,mouse;
//自定义变量
var myInfoWindow;
var spatialReference;
var bism;  //热度图变量
var pointBufferFeature;//热度图缓冲区
var vueExports = {};
var queryT;
var Color;
var SimpleMarkerSymbol,SimpleLineSymbol,SimpleFillSymbol,PictureFillSymbol,PictureMarkerSymbol;   //定义样式
var CartographicLineSymbol;
var Draw;
var PoltDraw;
var GraphicsLayer,Graphic,FeatureLayer;
var InfoTemplate; //infowindow窗口
var iTip; ////鼠标悬停变量
//创建多个图层，便于管理graphic
var alarmLayer, plottingLayer,bufferLayer,labelLayer,areaLayer,routeLayer,hightLightGraphicLayer,searchGraphicsLayer,markLayer;
var pipeLineLayer,redPointLayer,redLineCategoryLayer,searchBuildingGraphicsLayer,outWasteLayer,txtLayer;
var Measure,TextSymbol;
var SimpleRenderer;
var esriLang;
var number;
var domStyle;
var TooltipDialog, dijitPopup,dialog;
var Point;

//底图影像及矢量图层
var ArcGISDynamicMapServiceLayer,ImageParameters;

//网络分析变量
var RouteTask, RouteParameters;
var ServiceAreaTask, ServiceAreaParameters;
var FeatureSet;

//Vue变量
var $vmMain;


var bottomBarMenus = [
    {text:"事件定位" , icon:"fa-map-marker" , modal:"modal1"} ,
    {text:"范围确定" , icon:"fa-bank" , modal:"modal2"} ,
    {text:"影响分析" , icon:"fa-lightbulb-o" , modal:"modal3"} ,
    {text:"资源分析" , icon:"fa-question-circle" , modal:"modal4"} ,
    {text:"路径分析" , icon:"fa-sign-in" , modal:"modal5"} ,
    {text:"态势分析" , icon:"fa-info-circle" , modal:"modal6"}
];


//十六进制颜色值的正则表达式
/*16进制颜色转为RGB格式*/
String.prototype.toRGB = function(){
    var ColorReg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    var sColor = this.toLowerCase();
    if(sColor && ColorReg.test(sColor)){
        if(sColor.length === 4){
            var sColorNew = "#";
            for(var i=1; i<4; i+=1){
                sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));
            }
            sColor = sColorNew;
        }
        //处理六位的颜色值
        var sColorChange = [];
        for(var i=1; i<7; i+=2){
            sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));
            console.log(parseInt("0x"+sColor.slice(i,i+2)));
        }
        //return "RGB(" + sColorChange.join(",") + ")";
        return sColorChange;
    }else{
        return "这个是颜色值吗？";
    }
};
//这个扩展表达式不能匹配字符串
// Array.prototype.contains = function(item){
//     // return RegExp("\\b"+item+"\\b").test(this);
//     return RegExp("(^|,)" + item.toString() + "($|,)").test(this);
// };
Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
};
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};