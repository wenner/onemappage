var map, tb, toolbar;
require(["dojo/parser", "dojo/dom", "dojo/dom-construct", "dojo/on", "dojo/string", "esri/map", "esri/basemaps", "esri/dijit/Basemap", "esri/dijit/BasemapLayer", "esri/dijit/BasemapToggle", "esri/dijit/BasemapGallery", "esri/arcgis/utils",
        "esri/geometry/Extent", "esri/layers/GraphicsLayer", "esri/graphic", "esri/layers/FeatureLayer", "esri/toolbars/draw","esri/tasks/Geoprocessor","esri/tasks/JobInfo",
        "esri/tasks/FeatureSet","esri/tasks/LinearUnit",
        "esri/SpatialReference", "esri/layers/ArcGISTiledMapServiceLayer", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/layers/ArcGISImageServiceLayer", "esri/layers/ImageServiceParameters", "esri/geometry/Point",
        "esri/tasks/FindTask", "esri/tasks/FindParameters", "esri/InfoTemplate", "myModules/InfoWindow/InfoWindow",  "esri/symbols/CartographicLineSymbol", "esri/symbols/PictureFillSymbol", //自定义的Infowindow
        "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol", "esri/renderers/SimpleRenderer", "esri/Color",
        "dijit/layout/BorderContainer", "dijit/layout/ContentPane", "dojo/domReady!"],
    function (parser, dom, domConstruct, on, string, Map, esriBasemaps, Basemap, BasemapLayer, BasemapToggle, BasemapGallery, arcgisUtils,
              Extent, GraphicsLayer, Graphic, FeatureLayer, Draw,Geoprocessor,JobInfo,FeatureSet,LinearUnit,
              SpatialReference, ArcGISTiledMapServiceLayer, ArcGISDynamicMapServiceLayer, ArcGISImageServiceLayer, ImageServiceParameters, Point,
              FindTask, FindParameters, InfoTemplate, InfoWindow,CartographicLineSymbol, PictureFillSymbol,
              SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, SimpleRenderer, Color) {
        //配置代理------------------------------------------A
        esriConfig.defaults.io.proxyUrl = "/proxy/proxy.ashx";
        //esriConfig.defaults.io.alwaysUseProxy = true;
        //parser.parse();
        //自定义basemap
        var basemaps = [];
        var konggangMap = new Basemap({
            layers: [new BasemapLayer({
                url: "http://60.29.110.104:6080/arcgis/rest/services/影像服务/谷歌卫星_20160301_空港/ImageServer"
            })],
            id: "konggangMap",
            title: "空港影像图",
            thumbnailUrl: "assets/images/thumbnail-konggang.png"
        });
        basemaps.push(konggangMap);
        var streetMap = new Basemap({
            layers: [new BasemapLayer({
                url: "http://60.29.110.104:6080/arcgis/rest/services/20160301_海港/ImageServer"
            })],
            id: "StreetMap",
            title: "海港影像图",
            thumbnailUrl: "assets/images/thumbnail-haigang.png"
        });
        basemaps.push(streetMap);
        var waterBasemap = new Basemap({
            layers: [new BasemapLayer({
                url: "http://60.29.110.104:6080/arcgis/rest/services/kgmap/MapServer"
            })],
            title: "空港矢量图",
            thumbnailUrl: "assets/images/thumbnail-water.png"
        });
        basemaps.push(waterBasemap);
        var satelliteMap = new Basemap({
            layers: [new BasemapLayer({
                url: "http://60.29.110.104:6080/arcgis/rest/services/一张网/一张网企业项目动态图map/MapServer"
            })],
            id: "Satellite",
            title: "清色图",
            thumbnailUrl: "assets/images/thumbnail-onemap.jpg"
        });
        basemaps.push(satelliteMap);
        //自定义basemap1
        esriBasemaps.kgmap = {
            baseMapLayers: [{url: "http://60.29.110.104:6080/arcgis/rest/services/kgmap/MapServer"}],
            thumbnailUrl: "assets/images/thumbnail-onemap.jpg",
            title: "空港图"
        };

        //设置自定义的infowindow   如果不设置此infoWindow 默认为系统infowindow
        var infoWindow = new InfoWindow({
            domNode: domConstruct.create("div", null, dom.byId("mapDiv"))
        });
        var startExtent = new Extent(13067177.4503, 4743096.0757, 13068617.8449, 4744176.8112, new SpatialReference({wkid: 102100}));
        map = new Map("mapDiv", {
            extent: startExtent,
            slider: true,  //显示缩放控件
            infoWindow: infoWindow,  //此处对应自定义的infoWindow 设置
            logo: false,
            basemap: "kgmap"
            //basemap: "topo"
        });
        /* var params = new ImageServiceParameters();
         params.noData = 0;
         var imageServiceLayer = new ArcGISImageServiceLayer("http://60.29.110.104:6080/arcgis/rest/services/20160301_海港/ImageServer", {
         imageServiceParameters: params,
         opacity: 1
         });
         map.addLayer(imageServiceLayer);*/

        //basemap toggle 功能没有实现，改为basemapgallery
        var toggle = new BasemapToggle({
            //theme: "basemapToggle",
            map: map,
            visible: true,
            //basemap: "satellite"
            //basemaps:basemaps ,
            basemap: "kgmap"
        }, "BasemapToggle");
        toggle.startup();

        var basemapGallery = new BasemapGallery({
            showArcGISBasemaps: false,  //是否显示ArcGIS自带basemap
            basemaps: basemaps,
            map: map
        }, "basemapGallery");
        basemapGallery.startup();


        /*        function createBasemapGallery(){
         var basemaps=[];
         require(["esri/dijit/BasemapLayer","esri/dijit/Basemap","esri/dijit/BasemapGallery"],
         function(BasemapLayer,Basemap,BasemapGallery){
         var streetMap = new esri.dijit.Basemap({
         layers: [new esri.dijit.BasemapLayer({
         url: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer"
         })],
         id: "StreetMap",
         title: "Street Map View",
         thumbnailUrl:"img/lightColor.jpg"
         });
         basemaps.push(streetMap);
         var satelliteMap = new esri.dijit.Basemap({
         layers: [new esri.dijit.BasemapLayer({
         url: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
         })],
         id: "Satellite",
         title: "Satellite View",
         thumbnailUrl:"img/sateImage.jpg"
         });
         basemaps.push(satelliteMap);
         basemapGallery = new esri.dijit.BasemapGallery({
         showArcGISBasemaps: false,
         basemaps: basemaps,
         map: map
         },"dvBmGallery");
         basemapGallery.startup();
         }//end para2
         );//end require
         }//end createBmGallery*/

        var symbol,graphic;
        var markerSymbol = new SimpleMarkerSymbol();
        markerSymbol.setPath("M50,2.125c26.441,0,47.875,21.434,47.875,47.875c0,26.441-21.434,47.875-47.875,47.875C17.857,97.875,2.125,76.441,2.125,50C2.125,23.559,23.559,2.125,50,2.125z'/><g class='icon'><path class='base' d='M50,19.53c13.945,0,25.248,11.213,25.248,25.045C75.248,60.437,54.207,80.47,50,80.47c-4.208,0-25.248-20.033-25.248-35.895C24.752,30.743,36.056,19.53,50,19.53z'/><path class='inner' d='M50,30.488c8.174,0,14.8,6.625,14.8,14.799c0,8.173-6.626,14.8-14.8,14.8s-14.8-6.626-14.8-14.799C35.2,37.114,41.826,30.488,50,30.488z");
        markerSymbol.setColor(new Color("red"));
        // lineSymbol used for freehand polyline, polyline and line.
        var lineSymbol = new CartographicLineSymbol(
            CartographicLineSymbol.STYLE_SOLID,
            new Color([255,0,0]), 10,
            CartographicLineSymbol.CAP_ROUND,
            CartographicLineSymbol.JOIN_MITER, 5
        );

        // fill symbol used for extent, polygon and freehand polygon, use a picture fill symbol
        // the images folder contains additional fill images, other options: sand.png, swamp.png or stiple.png
        var fillSymbol = new PictureFillSymbol(
            "../onemappage/assets/images/mangrove.png",
            new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,
                new Color('#000'),
                1
            ),
            60,
            60
        );
        //定义矢量显示样式
        var ptSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([204, 204, 204]), 1), new Color([0, 255, 0, 0.25]));
        var lineSymbol2 = new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, new Color([255, 0, 0]), 1);
        var polygonSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NONE, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([204, 204, 204]), 2), new Color([255, 204, 204, 0.25]));
        // 动态图
        //var usaBase = new ArcGISDynamicMapServiceLayer("http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StatesCitiesRivers_USA/MapServer");
        var usaBase = new ArcGISDynamicMapServiceLayer("http://60.29.110.104:6080/arcgis/rest/services/一张网/一张网企业项目动态图map/MapServer");
        // 设置要显示的图层
        usaBase.setVisibleLayers([2, 0]);
        // 设置图层透明度
        usaBase.setOpacity(0.8);
        //map.addLayer(usaBase);

        // 实例化FindTask
        //var findTask = new FindTask("http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StatesCitiesRivers_USA/MapServer");
        var findTask = new FindTask("http://60.29.110.104:6080/arcgis/rest/services/一张网/一张网企业项目动态图map/MapServer");
        // FindTask的参数`
        var findParams = new FindParameters();
        // 返回Geometry
        findParams.returnGeometry = true;
        // 查询的图层id
        findParams.layerIds = [2];  //Layer: 雨水井 (0)   Layer: 建筑物 (1)   Layer: 项目 (2)
        // 查询字段
        findParams.searchFields = ["XMMC", "UNAME"];

        //注册按钮事件
        on(document.getElementById("findBtn"), "click", function () {
            execute(document.getElementById('searchText').value);
            //QueryTextFromSql();  从崔哥那边的数据库查询详细信息
        });

        // 根据输入的关键字进行findTask操作
        function execute(searchText) {
            findParams.searchText = searchText;
            findTask.execute(findParams, showResults);
        }

        // 显示findTask的结果
        function showResults(results) {
            // 清除上一次的高亮显示
            map.graphics.clear();

            var innerHtml = "";
            var symbol;
            for (var i = 0; i < results.length; i++) {
                var curFeature = results[i];
                var graphic = curFeature.feature;
                var infoTemplate = null;

                // 根据类型设置显示样式
                switch (graphic.geometry.type) {
                    case "point":
                        symbol = ptSymbol;
                        //infoTemplate = new InfoTemplate("${ObjName}", "${*}");
                        infoTemplate = new InfoTemplate();
                        infoTemplate.setTitle("<div class='xyfg_list_title'>" + "${ObjName}" + "</div>");
                        var con = "<div class='xndw_con_bg'>\
        <div class='xndw_info_over'>\
        <p class='xndw_info_li'><a href='javascript:;'>1、名称：${ObjName}</a></p>\
        <p class='xndw_info_li'><a href='javascript:;'>2、所属单位：${DeptName2}</a></p>  \
        <p class='xndw_info_li'><a href='javascript:;'>3、性质分类：${SUBSID}</a></p>\
        <p class='xndw_info_li'><a href='javascript:;'>4、井深：${BOTTOM_H}</a></p>\
        <p class='xndw_info_li'><a href='javascript:;'>5、管顶高：${SURF_H}</a></p>\
        <p class='xndw_info_li'><a href='javascript:;'>6、管底高：${B_DEEP} </a></p>\
        </div></div>";
                        infoTemplate.setContent(con);
                        break;
                    case "polyline":
                        symbol = lineSymbol2;
                        infoTemplate = new InfoTemplate("${ObjName}", "${*}");
                        break;
                    case "polygon":
                        symbol = polygonSymbol;
                        var fill = new SimpleFillSymbol("solid", null, new Color("#A4CE67"));
                        infoTemplate = new InfoTemplate({fillSymbol: fill});
                        infoTemplate.setTitle("<div class='xyfg_list_title'>" + "${UNAME}" + "</div>");
                        var con = "<div class='xndw_con_bg'>\
        <div class='xndw_info_over'>\
        <p class='xndw_info_li'><a href='javascript:;'>1、企业名称：${UNAME}</a></p>\
        <p class='xndw_info_li'><a href='javascript:;'>2、项目名称：${XMMC}</a></p>  \
        <p class='xndw_info_li'><a href='javascript:;'>3、规划状态：${GHZT}</a></p>\
        <p class='xndw_info_li'><a href='javascript:;'>4、性质：${XZ}</a></p>\
        <p class='xndw_info_li'><a href='javascript:;'>5、企业名：${企业名}</a></p>\
        <p class='xndw_info_li'><a href='javascript:;'>6、性质分类：${Zlbmc} </a></p>\
        </div></div>";
                        infoTemplate.setContent(con);
                        break;
                }
                // 设置显示样式
                graphic.setSymbol(symbol);
                graphic.setInfoTemplate(infoTemplate);
                // 添加到graphics进行高亮显示
                map.graphics.add(graphic);

                if (curFeature.layerId === 0) {
                    innerHtml += "<a href='javascript:positionFeature(" + graphic.attributes.FID + ")' class='list-group-item'>" + graphic.attributes.ObjName + "</a>";
                }
                else if (curFeature.layerId === 1) {
                    innerHtml += "<a href='javascript:positionFeature(" + graphic.attributes.FID + ")' class='list-group-item'>" + graphic.attributes.ObjName + "</a>";
                }
                else if (curFeature.layerId == 2) {
                    innerHtml += "<a href='javascript:positionFeature(" + graphic.attributes.FID + ")' class='list-group-item'>" + graphic.attributes.XMMC + "</a>";
                }
            }

            document.getElementById("contentsContainer").innerHTML = innerHtml;
        }


        //创建临时图形图层,为Table点击生成临时高亮点，容易清理
        //var TempLayer = new GraphicsLayer();
        //map.addLayer(TempLayer, 20);


        window.positionFeature = function (id) {
            console.log($(this));
            var sGrapphic;
            //遍历地图的图形查找FID和点击行的FID相同的图形
            for (var i = 0; i < map.graphics.graphics.length; i++) {
                var cGrapphic = map.graphics.graphics[i];
                if ((cGrapphic.attributes) && cGrapphic.attributes.FID == id) {
                    sGrapphic = cGrapphic;
                    break;
                }
            }
            var sGeometry = sGrapphic.geometry;
            // 当点击的名称对应的图形为点类型时进行地图中心定位显示
            if (sGeometry.type == "point") {
                var cPoint = new Point(sGeometry.x, sGeometry.y, new SpatialReference(map.spatialReference));
                //cPoint.x = sGeometry.x;
                //cPoint.y = sGeometry.y;
                map.infoWindow.hide();
                map.centerAt(cPoint);
                //map.centerAndZoom(cPoint, 10);   //将点平移到map正中 并 缩放到制定map级别
                console.log("对应的类型是点,X/Y坐标：" + cPoint.x + "   " + cPoint.y);
                var p = map.toScreen(sGrapphic.geometry);
                var iw = map.infoWindow;
                iw.setTitle(sGrapphic.getTitle());
                iw.setContent(sGrapphic.getContent());
                iw.show(p, map.getInfoWindowAnchor(p));
            }
            //当点击的名称对应的图形为线或面类型时获取其范围进行放大显示
            else {
                var sExtent = sGeometry.getExtent();
                sExtent = sExtent.expand(2);
                map.setExtent(sExtent);
                console.log("对应的类型是线或面,范围：" + JSON.stringify(sExtent));  //JSON.stringify(obj)  将obj json对象转换为string
                var p = map.toScreen(sGrapphic.geometry);
                var iw = map.infoWindow;
                //iw.setTitle(sGrapphic.getTitle());
                //iw.setContent(sGrapphic.getContent());
                //iw.show(p,map.getInfoWindowAnchor(p));

                var loc = new Point((sExtent.xmin + sExtent.xmax) / 2, (sExtent.ymin + sExtent.ymax) / 2, new SpatialReference(map.spatialReference));
                var attr = sGrapphic.attributes;
                console.log(loc.x + "   " + loc.y + "    其中最小X：" + sExtent.xmin + "   最大X:" + sExtent.xmax)
                //var infoTemplate = new InfoTemplate("${UNAME}", "${XMMC}", "${企业名}");
                //var gc = new Graphic(loc, polygonSymbol, attr, infoTemplate);
                //var gc = new Graphic(loc, polygonSymbol, attr);
                //TempLayer.add(gc);
                //gc.setSymbol(polygonSymbol);
            }
        };
        map.infoWindow.resize(353, 415);

        //设置快捷键
        //显示地图坐标
        map.on('mouse-move', showCoordinates);
        map.on('mouse-drag', showCoordinates);
        //显示地图坐标
        function showCoordinates(evt) {
            var mp = evt.mapPoint;
            dojo.byId("XYinfo").innerHTML = "坐标：" + mp.x.toFixed(4) + " , " + mp.y.toFixed(4);  //toFiex(2) 限制小数点后显示的位数
        }
        function showPointXY(evt) {
            var mp = evt.mapPoint;
            dojo.byId("positionPoint").innerHTML = "坐标：" + mp.x.toFixed(4) + " , " + mp.y.toFixed(4);  //toFiex(2) 限制小数点后显示的位数
            console.log( "坐标：" + mp.x.toFixed(4) + " , " + mp.y.toFixed(4));
        }
        //监听键盘事件，当按下回车键时，触发点击事件 ,当按下ECS键时触发清除图层和infowindow以及清空查询结果
        map.on("key-down", function (e) {
            if (e.keyCode == 27) {
                map.infoWindow.hide();
                map.graphics.clear();
                document.getElementById("contentsContainer").innerHTML = "";
                console.log(e.keyCode);
            } else if (e.keyCode == 13) {  //火狐浏览器不支持js直接调用btn event事件
                document.getElementById("findBtn").click();
                console.log(e.keyCode);
            }
        });
        var alarmLayer = new GraphicsLayer();
        map.addLayer(alarmLayer);
        //var symbolAlarm = new PictureMarkerSymbol("images/1.png", 20, 20);
        tb = new Draw(map);
        tb.on("draw-end", addGraphic);
        // 绑定父节点的id，然后寻找其子孙节点的id
        on(dom.byId("modal1"), "click", function(evt) {
            console.log("触发的ID为："+evt.target.id.toLowerCase());
            if ( evt.target.id === "info" ) {
                return;
            }else if(evt.target.id.toLowerCase()==="point"){
                var tool = evt.target.id.toLowerCase();
                console.log("var tool = evt.target.id.toLowerCase();   "+tool);
                map.disableMapNavigation();
                tb.activate(tool);
            }else if(evt.target.id.toLowerCase()==="searchplace"){
                console.log("你要查询的地址是： "+dom.byId("inputAddress").value);
            }else {
                return;
            }
        });
        on(dom.byId("modal2"), "click", function(evt) {
            console.log("触发的ID为："+evt.target.id.toLowerCase());
            if ( evt.target.id === "btnBuffer" ) {
                var bufferNum=dom.byId("inputBufferNum").value;
                var bufferDistance=dom.byId("inputBufferDistance").value;
                console.log("绘制缓存层级为："+bufferNum+"缓冲区半径为："+bufferDistance);

                if(bufferNum > 0){
                    console.log("bufferNum > 0,进入switch语句");
                    switch(bufferNum)
                    {
                        case "1":
                            console.log("进入switch语句，执行buffer的层级数量1");
                            tojob(graphic,bufferDistance);
                            break;
                        case "2":
                            tojob(graphic,bufferDistance);
                            tojob(graphic,bufferDistance*2);
                            break;
                        case "3":
                            tojob(graphic,bufferDistance);
                            tojob(graphic,bufferDistance*2);
                            tojob(graphic,bufferDistance*3);
                            break;
                        default:
                            return;
                    }
                }
            }else if(evt.target.id.toLowerCase()==="polygon"){
                var tool = evt.target.id.toLowerCase();
                console.log("var tool = evt.target.id.toLowerCase();   "+tool);
                map.disableMapNavigation();
                tb.activate(tool);
            }else if(evt.target.id.toLowerCase()==="freehandpolygon"){
                var tool = evt.target.id.toLowerCase();
                console.log("var tool = evt.target.id.toLowerCase();   "+tool);
                map.disableMapNavigation();
                tb.activate(tool);
            }else if(evt.target.id.toLowerCase()==="rectangle"){
                var tool = evt.target.id.toLowerCase();
                console.log("var tool = evt.target.id.toLowerCase();   "+tool);
                map.disableMapNavigation();
                tb.activate(tool);
            }
            else if(evt.target.id.toLowerCase()==="circle"){
                var tool = evt.target.id.toLowerCase();
                console.log("var tool = evt.target.id.toLowerCase();   "+tool);
                map.disableMapNavigation();
                tb.activate(tool);
            }else if(evt.target.id.toLowerCase()==="btncleanbuffer" || evt.target.id.toLowerCase()==="btncleanresult"){
                cleanGraphic();
            }
            else{
                return;
            }
        });



        function addGraphic(evt) {
            //deactivate the toolbar and clear existing graphics
            tb.deactivate();
            map.enableMapNavigation();
            // figure out which symbol to use
            if ( evt.geometry.type === "point" || evt.geometry.type === "multipoint") {
                symbol = markerSymbol;
                //map.on('mouse-click', showPointXY);  //显示地图坐标到制定label没有成功
            } else if ( evt.geometry.type === "line" || evt.geometry.type === "polyline") {
                symbol = lineSymbol;
            }
            else {
                symbol = fillSymbol;
            }
            graphic=new Graphic(evt.geometry,symbol);
            map.graphics.add(new Graphic(evt.geometry, symbol));
        }

        function tojob(graphic,distance) {
            //第一步构造GP
            var gpUrl = 'http://60.29.110.104:6080/arcgis/rest/services/GP/缓冲区分析/GPServer/Buffer_point2poly';
            gp = new Geoprocessor(gpUrl);
            //第二步，构造参数
            //我们通过上面，了解到GPFeatureRecordSetLayer对应FeatureSet
            var features = [];
            features.push(graphic);
            var featureset = new FeatureSet();
            featureset.features = features;
            //构造缓冲长度，这里的单位是可以更改的
            var Dis = new LinearUnit();
            Dis.distance = distance;
            //Dis.units = "esriKilometers";
            Dis.units = "esriMeters";
            var parms = {
                pDistance: Dis,
                pDataSet: featureset
            };
            //这里函数是异步的，使用函数是submitJob,同步的使用的是execute。
            //成功之后，调用jobResult,建议看一下这个参数。
            gp.submitJob(parms, jobResult);
        }

        /**
         * 计算完成
         * @param result
         */
        function jobResult(result) {
            var jobId = result.jobId;
            var status = result.jobStatus;
            if(status === JobInfo.STATUS_SUCCEEDED) {
                //成功之后，将其中的结果取出来，当然这也是参数名字。
                //在模型中，想要取出中间结果，需要设置为模型参数
                console.log("GP服务执行成功。   status:"+status  + "   jobId:"+jobId);
                gp.getResultData(jobId, "outSHP", addResults);
            }
        }
        function addResults(results){
            var features = results.value.features;
            if(features.length>0) {
                console.log("callback success... features.length="+features.length);
                for (var i = 0, length = features.length; i != length; ++i) {
                    var feature = features[i];
                    var polySymbolRed = new SimpleFillSymbol();
                    polySymbolRed.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 0, 0.5]), 1));
                    polySymbolRed.setColor(new Color([255, 0, 0, 0.5]));
                    feature.setSymbol(polySymbolRed);
                    map.graphics.add(feature);
                }
                console.log("提示","计算成功！");
            }
            else{
                console.log("提示","计算失败！");
            }
        }
/*        function drawEnd(geometry) {
            console.log("执行绘制结束后的操作   geometry:type   " + geometry);
            //toolbar.deactivate();
            var symbol = null;
            if (geometry.type === "point") {
                console.log("进入点的绘制");
                symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 10,
                    new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                        new Color([255, 0, 0]), 1),
                    new Color([0, 255, 0, 50]));
            }
            else if (geometry.type === "polyline") {
                symbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([255, 0, 0]), 2);
            }
            else {
                symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.25]));
            }
            var graphic = new Graphic(geometry, symbol);
            map.graphics.add(graphic);
        }*/

        //点击一级查询结果单条记录，进行二次ajax查询sql数据库，返回数据 by wwmin 20160304 13:52:16
        //function QueryTextFromSql() {
        //    console.log("进入ajax查询数据方法");
        //    $.ajax({
        //        //                type: "GET",
        //        //                url: "http://ajhb.tjxrs.cn/FMService/chemical",
        //        type: "POST",
        //        url: "http://ajhb.tjxrs.cn/LoginService/test",
        //        async: true,  //是否异步，true为是异步
        //        dataType: "text",
        //        success: function (response) {
        //            alert("ajax成功，返回数据为：" + response);
        //        },
        //        error: function (ex) {
        //            console.log(ex.toLocaleString() + "   alarm失败 。");
        //        }
        //    });
        //}

        //清楚map上的graphic
        function cleanGraphic(){
            map.graphics.clear();
        }
    });


/*
 function positionFeature(id) {
 require(["esri/geometry/Point"], function (Point) {
 var sGrapphic;
 //遍历地图的图形查找FID和点击行的FID相同的图形
 for (var i = 0; i < map.graphics.graphics.length; i++) {
 var cGrapphic = map.graphics.graphics[i];
 if ((cGrapphic.attributes) && cGrapphic.attributes.FID == id) {
 sGrapphic = cGrapphic;
 break;
 }
 }

 var sGeometry = sGrapphic.geometry;
 // 当点击的名称对应的图形为点类型时进行地图中心定位显示
 if (sGeometry.type == "point") {
 var cPoint = new Point();
 cPoint.x = sGeometry.x;
 cPoint.y = sGeometry.y;
 map.centerAt(cPoint);

 var p = map.toScreen(sGrapphic.geometry);
 var iw = map.infoWindow;
 iw.setTitle(sGrapphic.getTitle());
 iw.setContent(sGrapphic.getContent());
 iw.show(p, map.getInfoWindowAnchor(p));
 }
 //当点击的名称对应的图形为线或面类型时获取其范围进行放大显示
 else {
 var sExtent = sGeometry.getExtent();
 sExtent = sExtent.expand(2);
 map.setExtent(sExtent);
 }
 });
 }*/
