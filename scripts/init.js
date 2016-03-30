(function(){
    //开始初始化vue
    $vmMain = new Vue(vueExports.main);
    var mapInited = false , modalInited = false;
    window.init = function(){
		loadModalHtml();
		createMap();
    };
    function createMap() {
        //var InfoWindow = myInfoWindow,
            Draw = esri.toolbars.Draw;
        var infoWindow = new myInfoWindow({
            domNode: dojoDomConstruct.create("div", null, dojoDom.byId("mapDiv"))
        });

        var startExtent = new esri.geometry.Extent(
            13067177.4503, 4743096.0757, 13068617.8449, 4744176.8112,
            new esri.SpatialReference({wkid: 102100})
        );
        esri.basemaps.kgmap = {
            baseMapLayers: [{url: $BaseServiceUrl + "kgmap/MapServer"}],
            thumbnailUrl: "assets/images/thumbnail-onemap.jpg",
            title: "空港图"
        };
        $Map = new esri.Map("mapDiv", {
            extent: startExtent,
            slider: true,  //显示缩放控件
            infoWindow: infoWindow,  //此处对应自定义的infoWindow 设置
            logo: false,
            basemap: "kgmap"
        });
        $Map.infoWindow.resize(375, 315);  //设置弹窗大小
        //添加危险企业动态点位图
        var dynamicMapSericeLayerAlarmLayer=new ArcGISDynamicMapServiceLayer($BaseServiceUrl+"一张网/危险企业红线点位动态Map/MapServer");
        $Map.addLayer(dynamicMapSericeLayerAlarmLayer);
        //创建图形图层
        //把图层添加到地图上
        hightLightGraphicLayer=new GraphicsLayer();
        $Map.addLayer(hightLightGraphicLayer);  //将高亮图层放在最下面，防止其他图层失去点击事件
        searchGraphicsLayer=new GraphicsLayer();
        $Map.addLayer(searchGraphicsLayer);
        redPointLayer = new GraphicsLayer();
        $Map.addLayer(redPointLayer);  //添加红线点图层，显示infowindow用
        areaLayer = new GraphicsLayer();
        $Map.addLayer(areaLayer);
        routeLayer = new GraphicsLayer();
        $Map.addLayer(routeLayer);
        plottingLayer = new GraphicsLayer();
        $Map.addLayer(plottingLayer);
        bufferLayer = new GraphicsLayer();
        $Map.addLayer(bufferLayer);
        alarmLayer = new GraphicsLayer();
        $Map.addLayer(alarmLayer);
        labelLayer = new GraphicsLayer();
        $Map.addLayer(labelLayer);
        redLineCategoryLayer=new GraphicsLayer();
        $Map.addLayer(redLineCategoryLayer);
        markLayer=new GraphicsLayer();
        $Map.addLayer(markLayer);

        setSymbolStyle();
        var baseMaps = getBaseMaps();
        createMapToggle();
        createMapGallery(baseMaps);
        initMapEvent();
        mapInited = true;
        hideLoader();
        setWithTipsLayerToMap();
    }

    function loadModalHtml(){
        var modals = $(".dijitHidden div");
        var loadedCount = 0;
        modals.each(function(i , n){
            var modal = $(n);
            modalHref = modal.data("modalhref");
            modal.load(modalHref , function(){
                var modalExports = vueExports[modal.attr("id")];
                if (modalExports) new Vue(modalExports);
                loadedCount ++;
                if (loadedCount == modals.length){
                    modalInited = true;
                    hideLoader();
                }
            });
        });
        for(var i = 0 ; i<bottomBarMenus.length ;i++){

        }
    }

    function hideLoader() {
        if (mapInited && modalInited) {
            $("#pageloader").hide();
        }
    }

    function setSymbolStyle() {
        var SimpleMarkerSymbol = esri.symbol.SimpleMarkerSymbol,
            SimpleLineSymbol = esri.symbol.SimpleLineSymbol,
            SimpleFillSymbol = esri.symbol.SimpleFillSymbol,
            CartographicLineSymbol = esri.symbol.CartographicLineSymbol,
            PictureFillSymbol = esri.symbol.PictureFillSymbol,
            Color = esri.Color,
            Graphic = esri.Graphic;

        var markerSymbol = $markerSymbol = new SimpleMarkerSymbol();
        markerSymbol.setPath("M50,2.125c26.441,0,47.875,21.434,47.875,47.875c0,26.441-21.434,47.875-47.875,47.875C17.857,97.875,2.125,76.441,2.125,50C2.125,23.559,23.559,2.125,50,2.125z'/><g class='icon'><path class='base' d='M50,19.53c13.945,0,25.248,11.213,25.248,25.045C75.248,60.437,54.207,80.47,50,80.47c-4.208,0-25.248-20.033-25.248-35.895C24.752,30.743,36.056,19.53,50,19.53z'/><path class='inner' d='M50,30.488c8.174,0,14.8,6.625,14.8,14.799c0,8.173-6.626,14.8-14.8,14.8s-14.8-6.626-14.8-14.799C35.2,37.114,41.826,30.488,50,30.488z");
        markerSymbol.setColor(new Color("red"));


        // lineSymbol used for freehand polyline, polyline and line.
        var lineSymbol = $lineSymbol = new CartographicLineSymbol(
            CartographicLineSymbol.STYLE_SOLID,
            new Color([255, 0, 0]), 10,
            CartographicLineSymbol.CAP_ROUND,
            CartographicLineSymbol.JOIN_MITER, 5
        );


        // fill symbol used for extent, polygon and freehand polygon, use a picture fill symbol
        // the images folder contains additional fill images, other options: sand.png, swamp.png or stiple.png
        var fillSymbol = $fillSymbol = new PictureFillSymbol(
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
        var ptSymbol = $ptSymbol = new SimpleMarkerSymbol(
            SimpleMarkerSymbol.STYLE_SQUARE, 10,
            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                new Color([204, 204, 204]), 1),
            new Color([0, 255, 0, 0.25])
        );
        var lineSymbol2 = $lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, new Color([255, 0, 0]), 1);
        var polygonSymbol = $polygonSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NONE, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([153,204,204]), 0.5), new Color([153,153,204, 0.25]));


    }

    function getBaseMaps() {
        var Basemap = esri.dijit.Basemap,
            BasemapLayer = esri.dijit.BasemapLayer;
        var basemaps = [];
        var konggangMap = new Basemap({
            layers: [new BasemapLayer({
                url: $BaseServiceUrl + "影像服务/谷歌卫星_20160301_空港/ImageServer"
            })],
            id: "konggangMap",
            title: "空港影像图",
            thumbnailUrl: "assets/images/thumbnail-konggang.png"
        });
        basemaps.push(konggangMap);
        var streetMap = new Basemap({
            layers: [new BasemapLayer({
                url: $BaseServiceUrl + "20160301_海港/ImageServer"
            })],
            id: "StreetMap",
            title: "海港影像图",
            thumbnailUrl: "assets/images/thumbnail-haigang.png"
        });
        basemaps.push(streetMap);
        var waterBasemap = new Basemap({
            layers: [new BasemapLayer({
                url: $BaseServiceUrl + "kgmap/MapServer"
            })],
            title: "空港矢量图",
            thumbnailUrl: "assets/images/thumbnail-water.png"
        });
        basemaps.push(waterBasemap);
        var satelliteMap = new Basemap({
            layers: [new BasemapLayer({
                url: $BaseServiceUrl + "一张网/一张网企业项目动态图map/MapServer"
            })],
            id: "Satellite",
            title: "清色图",
            thumbnailUrl: "assets/images/thumbnail-onemap.jpg"
        });
        basemaps.push(satelliteMap);
        var secFiveDMap=new Basemap({
            layers:[new BasemapLayer({
                url: $BaseServiceUrl + "影像服务/25Dkg84/ImageServer"
            })],
            id:"25DMap",
            title:"2.5D空港图",
            thumbnailUrl:"assets/images/thumbnail-konggang-25D.png"
        });
        basemaps.push(secFiveDMap);
        return basemaps;
    }

    function createMapToggle() {
        var BasemapToggle = esri.dijit.BasemapToggle;
        var toggle = new BasemapToggle({
            //theme: "basemapToggle",
            map: $Map,
            visible: true,
            //basemap: "satellite"
            //basemaps:basemaps ,
            basemap: "kgmap"
        }, "BasemapToggle");
        toggle.startup();
    }

    function createMapGallery(baseMaps){
        var BasemapGallery = esri.dijit.BasemapGallery;
        var basemapGallery = new BasemapGallery({
            showArcGISBasemaps: false,  //是否显示ArcGIS自带basemap
            basemaps: baseMaps,
            map: $Map
        }, "basemapGallery");
        basemapGallery.startup();
    }

    function initMapEvent(){
        $Map.on('mouse-move', showCoordinates);
        $Map.on('mouse-drag', showCoordinates);
    }

    function showCoordinates(evt) {
        var mp = evt.mapPoint;
        $("#XYinfo").html("坐标：" + mp.x.toFixed(4) + " , " + mp.y.toFixed(4));  //toFiex(2) 限制小数点后显示的位数
    }

    //将点平移到map正中 (并 缩放到制定map级别)
    function setMapCenter(evt, level) {
        var location = new esri.geometry.Point(evt.mapPoint.x, evt.mapPoint.y, map.spatialReference)  //evt.mapPoint.y-5000 将y值向上提高5000m
        //map.centerAndZoom(location, level);   //将点平移到map正中 并 缩放到制定map级别
        map.centerAt(location);  //将点平移到map正中
    }

    /*
    * 添加需要在地图上显示的graphics，并且给此graphics附加上tips窗口
    * */
    function setWithTipsLayerToMap(){
        //涉危企业面图层
        var redLineCategory = new FeatureLayer("http://60.29.110.104:6080/arcgis/rest/services/一张网/一张网动态图/MapServer/9", {
            mode: FeatureLayer.MODE_SNAPSHOT,
            outFields: ["UNAME", "JZXG", "YDXZ", "QYKK", "BXMMC"]
        });
        //涉危企业点图层
        var redPointCategory = new FeatureLayer("http://60.29.110.104:6080/arcgis/rest/services/一张网/一张网动态图/MapServer/1", {
            mode: FeatureLayer.MODE_SNAPSHOT,
            outFields: ["UNAME", "XMMC", "JSDW", "单位名称", "分类"]
        });
        //redLineCategory.setDefinitionExpression("STATE_NAME = 'South Carolina'");  //可对特定字段进行sql查询,目前没用到
        var pointSymbol = new SimpleMarkerSymbol({
            "color": [255,255,100,64],
            "size": 6,
            "angle": 0,
            "xoffset": 0,
            "yoffset": 0,
            "type": "esriSMS",
            "style": "esriSMSCircle",
            "outline": {
                "color": [0,0,0,100],
                "width": 1,
                "type": "esriSLS",
                "style": "esriSLSSolid"
            }
        });
        var polySymbol = new SimpleFillSymbol(
            SimpleFillSymbol.STYLE_SOLID,
            new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,
                new Color([255,255,255,0.35]),
                1
            ),
            new Color([125,125,125,0.35])
        );
        //redLineCategory.setRenderer(new SimpleRenderer(polySymbol));
        redPointCategory.setRenderer(new SimpleRenderer(pointSymbol)); //setRenderer设置图层显示的样式，如果是Graphic则用setSymbol
        //$Map.addLayer(redLineCategory);
        $Map.addLayer(redPointCategory);
        //$Map.infoWindow.resize(245,125);  //可以设置窗口大小

        dialog = new TooltipDialog({
            id: "tooltipDialog",
            style: "position: absolute; width: 250px; font: normal normal normal 10pt Helvetica;z-index:100"
        });
        dialog.startup();

        var highlightPolySymbol = new SimpleFillSymbol(
            SimpleFillSymbol.STYLE_SOLID,
            new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,
                new Color([255,0,0]), 3
            ),
            new Color([125,125,125,0.35])
        );
        var highlightPointSymbol = new SimpleMarkerSymbol({
            "color": [0,255,255,64],
            "size": 12,
            "angle": 0,
            "xoffset": 0,
            "yoffset": 0,
            "type": "esriSMS",
            "style": "esriSMSCircle",
            "outline": {
                "color": [255,0,0,255],
                "width": 2,
                "type": "esriSLS",
                "style": "esriSLSSolid"
            }
        });
        //close the dialog when the mouse leaves the highlight graphic
        $Map.on("load", function(){
            redLineCategoryLayer.enableMouseEvents();  //设置启动该图层的鼠标事件
            redLineCategoryLayer.on("mouse-out", closeDialog);
        });

        //listen for when the onMouseOver event fires on the countiesGraphicsLayer
        //when fired, create a new graphic with the geometry from the event.graphic and add it to the maps graphics layer
        redLineCategory.on("mouse-over", function(evt){
            var t = "<b>${UNAME}</b><hr><b>项目: </b>${JZXG}<br>"
                + "<b>用地性质: </b>${YDXZ}<br>"
                + "<b>企业开口: </b>${QYKK}<br>"
                + "<b>项目名称: </b>${BXMMC}";

            var content = esriLang.substitute(evt.graphic.attributes,t); // 将内容变量放置到graphic.attributes中 用到了esriLang.substitute
            var highlightGraphic = new Graphic(evt.graphic.geometry,highlightPolySymbol);
            //$Map.graphics.add(highlightGraphic);
            redLineCategoryLayer.add(highlightGraphic);
            dialog.setContent(content);

            domStyle.set(dialog.domNode, "opacity", 0.85);
            dijitPopup.open({
                popup: dialog,
                x: evt.pageX,
                y: evt.pageY
            });
        });

        redPointCategory.on("mouse-over", function(evt){
            var t = "<b>${UNAME}</b><hr><b>项目名称: </b>${XMMC}<br>"
                + "<b>建设单位: </b>${JSDW}<br>"
                + "<b>单位名称: </b>${单位名称}<br>"
                + "<b>类别: </b>${分类}";

            var content = esriLang.substitute(evt.graphic.attributes,t);
            var highlightGraphic = new Graphic(evt.graphic.geometry,highlightPointSymbol);
            //$Map.graphics.add(highlightGraphic);
            redLineCategoryLayer.add(highlightGraphic);
            dialog.setContent(content);

            domStyle.set(dialog.domNode, "opacity", 0.85);
            dijitPopup.open({
                popup: dialog,
                x: evt.pageX+8,
                y: evt.pageY
            });
        });
        redPointCategory.on("click",function(evt){
            var attr=evt.graphic.attributes;
            console.log(attr);
            var aa=attr.FID+attr.JSDW+attr.UNAME+attr.XMMC+attr.分类+attr.单位名称;
            alert(aa);
        });
        function closeDialog() {
            redLineCategoryLayer.clear();
            dijitPopup.close(dialog);
        }
    }
})();


