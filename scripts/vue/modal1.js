vueExports.modal1 = {
    el: '#modal1',
    data: {
        address: "",
        pointResult: [],
        noEnterprise: ""
    },
    methods: {
        drawPoint: function (evt) {
            outWasteLayer.clear();
            markLayer.clear();
            hightLightGraphicLayer.clear();
            alarmLayer.clear();
            searchGraphicsLayer.clear();
            var self = this;
            $Map.setMapCursor("url(assets/images/cursor/cur_arrow_color.cur),auto");
            var pictureSymbol = new PictureMarkerSymbol({
                "url": "../onemappage/assets/images/alert.gif",
                "height": 50,
                "width": 50,
                "type": "esriPMS",
                "angle": 0
            });

            //涉危企业面图层
            var redLineCategory = new FeatureLayer("http://60.29.110.104:6080/arcgis/rest/services/一张网/一张网动态图/MapServer/9", {
                mode: FeatureLayer.MODE_SNAPSHOT,
                outFields: ["XMMC", "分类", "UNAME", "FID", "JZXG", "YDXZ", "QYKK", "BXMMC", "DISTRICT", "Dlbmc", "XZ", "企业名", "Zlbmc"]
            });
            var polySymbol = new SimpleFillSymbol(
                SimpleFillSymbol.STYLE_SOLID,
                new SimpleLineSymbol(
                    SimpleLineSymbol.STYLE_SOLID,
                    new Color([255, 255, 255, 0.35]),
                    1
                ),
                new Color([125, 125, 125, 0.35])
            );
            // 实例化查询参数类
            query = new esri.tasks.Query();
            query.returnGeometry = true;

            tb = new Draw($Map);
            tb.on("draw-end", addGraphic);
            // $Map.disableMapNavigation();   //禁用map双击放大事件

            // var toDrawGraphic = evt.target.value.toLowerCase();
            var toDrawGraphic = evt.target.value;
            tb.activate(toDrawGraphic);
            function addGraphic(evt) {
                doQuery(evt);
                $Map.setMapCursor("url(assets/images/cursor/aero_arrow.cur),auto");
                //deactivate the toolbar
                tb.deactivate();
                $Map.enableMapNavigation(); //画完之后启用双击放大事件
                // figure out which symbol to use
                var alarmSymbol;
                if (evt.geometry.type === "point" || evt.geometry.type === "multipoint") {
                    alarmSymbol = pictureSymbol;
                    self.setExtent(evt);
                } else if (evt.geometry.type === "line" || evt.geometry.type === "polyline") {
                    alarmSymbol = lineSymbol;
                }
                else {
                    alarmSymbol = sfs;
                }
                alarmLayer.add(new Graphic(evt.geometry, alarmSymbol));
                tb.deactivate();
            }

            function doQuery(evt) {

                query.geometry = evt.geometry;
                query.outFields = ["XMMC", "分类", "UNAME", "FID", "JZXG", "YDXZ", "QYKK", "BXMMC", "DISTRICT", "Dlbmc", "XZ", "企业名", "Zlbmc"];
                var queryTask = new esri.tasks.QueryTask("http://60.29.110.104:6080/arcgis/rest/services/一张网/一张网动态图/MapServer/9");
                queryTask.execute(query, showResults);
            }

            function showResults(featureSet) {

                var symbol, infoTemplate;
                symbol = polySymbol;
                // infoTemplate = statesInfoTemplate;
                //构造一个graphic对象，包含feature
                var resultObject = {feature: null};
                var resultFeatures = featureSet.features;
                for (var i = 0, il = resultFeatures.length; i < il; i++) {
                    // 从featureSet中得到当前地理特征
                    // 地理特征就是一图形对象
                    var graphic = resultFeatures[i];
                    graphic.setSymbol(symbol);

                    // 设置信息模板
                    // graphic.setInfoTemplate(infoTemplate);

                    // 在地图的图形图层中增加图形
                    searchGraphicsLayer.add(graphic);
                    resultObject.feature = graphic;
                    self.setExtent(graphic);
                }
                //将graphic对象存入result数组中
                var result = [];
                if (resultObject.feature != null) {
                    result.push(resultObject);
                }
                if (result.length == 0) {
                    $vmMain.result = [];
                } else {
                    self.pointResult = result;
                    $vmMain.result = result;
                    $vmMain.sideState = "list";
                }
                // console.log(searchResultGraphic);
                // console.log(featureSet);
            }
        },
        clearPoint: function () {
            tb.deactivate();
            $vmMain.result=[];
            this.pointResult=[];
            outWasteLayer.clear();
            markLayer.clear();
            hightLightGraphicLayer.clear();
            alarmLayer.clear();
            searchGraphicsLayer.clear();
        },
        searchAddress: function () {
            console.log("你要查询的地址是： " + this.address);
        },
        //设置点或面层的放大显示
        setExtent: function (graphic) {
            if(graphic.geometry.type=="point"){
                var cPoint = new Point(graphic.geometry.x, graphic.geometry.y, new spatialReference($Map.spatialReference));
                $Map.centerAndZoom(cPoint,8);
            }else{
                var Geometry = graphic.geometry;
                var Extent=Geometry.getExtent();
                Extent = Extent.expand(1);
                $Map.setExtent(Extent);
            }
        }

    }
};