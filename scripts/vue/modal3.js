/**
 * Created by wwm on 2016/3/15.
 */
var heatLayer;
var featureLayer;
var tb;
vueExports.modal3 = {
    el: '#modal3',
    data: {
        picked: 1,
        c1: [],
        c2: [],
        c3: [],
        c4: [],
        docName:"公共影响因素分析结果及处置建议",
        print:{
            printFormat:"JPG",
            printLayout:"A4 Landscape"
        }
    },
    methods: {
        reset: function () {
            this.c1 = [];
            this.c2 = [];
            this.c3 = [];
            this.c4 = [];

        },
        personHeatMap: function () {
            //防止第二次点击后重复添加热度图，可以设置逻辑为
            if (heatLayer) {
                $Map.removeLayer(heatLayer);
            }
            console.log("进入HeatMap");
            var FeatureLayer = esri.layers.FeatureLayer;
            //配置代理------------------------------------------
            esriConfig.defaults.io.proxyUrl = "../assets/proxy/proxy.ashx";
            //esriConfig.defaults.io.alwaysUseProxy = true;
            this.setHeatMap();
            $Map.addLayer(heatLayer);
            $Map.resize();
            // 创建一要素图层，从该图层中获取点要素
            featureLayer = new FeatureLayer("http://60.29.110.104:6080/arcgis/rest/services/一张网/一张网动态图/MapServer/0", {
                mode: FeatureLayer.MODE_ONDEMAND,
                visible: false
            });
            $Map.addLayer(featureLayer);
            // 从要素图层中获取点数据
            this.getFeatures();
            $Map.on("extent-change", this.getFeatures);
        },
        setHeatMap: function (theMap) {
            //var HeatmapLayer=bism.HeatmapLayer;
            heatLayer = new bism({
                config: {
                    "useLocalMaximum": true,
                    "radius": 25,
                    "gradient": {
                        0.15: "rgb(000,000,255)",
                        0.45: "rgb(000,255,255)",
                        0.60: "rgb(000,255,000)",
                        0.85: "rgb(255,255,000)",
                        1.00: "rgb(255,000,000)"
                    }
                },
                "map": $Map,
                "domNodeId": "heatLayer",
                "opacity": 0.75
            })
        },
        getFeatures: function () {
            // 创建查询
            var query = new esri.tasks.Query();
            // 只查询当前显示范围内的要素
            query.geometry = $Map.extent;
            query.where = "1=1";
            query.outSpatialReference = $Map.spatialReference;

            featureLayer.queryFeatures(query, function (featureSet) {
                var data = [];
                if (featureSet && featureSet.features && featureSet.features.length > 0) {
                    data = featureSet.features;
                }
                // 将数据赋给热度图图层
                heatLayer.setData(data);
            });
        },
        wealthHeatMap: function () {
            if (heatLayer.visible) {
                heatLayer.hide();
            } else {
                heatLayer.show();
            }
        },
        trafficHeatMap: function () {
            if (heatLayer.visible) {
                heatLayer.hide();
            } else {
                heatLayer.show();
            }
        },
        clearHeatMap: function () {
            console.log("清除热度图");
            $Map.removeLayer(heatLayer);
        },
        analysis: function () {   /////实现查询图层点，并显示到地图上，目前只做了一个查询后期要根据选择内容查询多个图层
            //console.log(this.c1+"  "+this.picked);
            var SimpleMarkerSymbol = esri.symbol.SimpleMarkerSymbol;
            var SimpleLineSymbol = esri.symbol.SimpleLineSymbol;
            var SimpleFillSymbol = esri.symbol.SimpleFillSymbol;
            var QueryTask = esri.tasks.QueryTask;
            var Color = esri.Color;
            var Graphic = esri.graphic;
            var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.5]));
            // 初始化查询任务与查询参数
            var url = "http://60.29.110.104:6080/arcgis/rest/services/外业点位图map20151207/MapServer";
            var queryTask0 = new QueryTask(url + "/0");
            var queryTask1 = new QueryTask(url + "/1");
            var queryTask2 = new QueryTask(url + "/2");

            queryTask2.on("complete", showResult);
            var query = new esri.tasks.Query();
            query.returnGeometry = true;
            query.outFields = ["X", "Y", "UNAME", "FID "];
            //var graphic = new Graphic();
            console.log("pointBufferFeature :  " + pointBufferFeature);
            query.geometry = pointBufferFeature.geometry;
            queryTask2.execute(query);

            var selectSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 12, new SimpleLineSymbol(SimpleLineSymbol.STYLE_NULL, new Color([0, 0, 255, 0.9]), 1), new Color([0, 0, 255, 0.8]));
            var evtResult;  //用于临时保存空间查询出来的数据，以便后续二次操作
            function showResult(evt) {
                var resultFeatures = evt.featureSet.features;
                evtResult = resultFeatures;
                for (var i = 0, il = resultFeatures.length; i < il; i++) {
                    console.log("resultFeatures[" + i + "]:" + resultFeatures[i]);
                    var graphic = resultFeatures[i];
                    //Assign a symbol sized based on populuation
                    graphic.setSymbol(selectSymbol);
                    $Map.graphics.add(graphic);
                }
                //tb.deactivate();
                //map.showZoomSlider();
            }
        },
        draw: function (e) {
            //同一方法，对应不同按钮，获取此按钮的value 判断得到的是那个按钮事件
            var btnValue = e.target.value;
            console.log(btnValue);
            // 实例化符号类
            var pointSym, lineSym, polygonSym;
            var redColor = new Color([255, 0, 0]);
            var halfFillYellow = new Color([0,0,204,0.8]);

            pointSym = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_DIAMOND, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, redColor, 1), halfFillYellow);
            lineSym = new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, redColor, 2);
            polygonSym = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, redColor, 2), halfFillYellow);
            tb = new esri.toolbars.Draw($Map);
            tb.on("draw-end", doQuery);

            // 实例化查询参数类
            //var url = "http://60.29.110.104:6080/arcgis/rest/services/外业点位图map20151207/MapServer";
            var url = "http://60.29.110.104:6080/arcgis/rest/services/一张网/一张网动态图/MapServer";
            var queryTask0 = new esri.tasks.QueryTask(url + "/0"); //密度点84 (0)
            var queryTask1 = new esri.tasks.QueryTask(url + "/1");//红线84分类点 (1)
            var queryTask2 = new esri.tasks.QueryTask(url + "/2");//泵站84 (2)
            var queryTask3 = new esri.tasks.QueryTask(url + "/3");//企业内部点位 (3)
            query = new esri.tasks.Query();
            query.returnGeometry = true;

            // 实例化信息模板类
            //statesInfoTemplate = new esri.InfoTemplate("${STATE_NAME}", "州名： ${STATE_NAME}<br/> <br />面积：${AREA}");
            //riversInfoTemplate = new esri.InfoTemplate("${NAME}", "河流名称：${NAME}<br/><br/>流域名：${SYSTEM}");
            //citiesInfoTemplate = new esri.InfoTemplate("${CITY_NAME}", "城市名：${CITY_NAME}<br/> 州名： ${STATE_NAME}<br />人口：${POP1990}");
            activateTool();

            // 或者 find the divs for buttons
            //query(".drawing").forEach(function (btn) {
            //    var button = new Button({
            //        label: btn.innerHTML,
            //        onClick: function () {
            //            activateTool(this.id);
            //        }
            //    }, btn);
            //});
            function activateTool() {
                var tool = null;
                console.log("进入activateTool方法");
                $Map.setMapCursor("url(assets/images/cursor/e6.cur),auto");
                switch (btnValue) {
                    case "rectangle":
                        console.log("进入画矩形case: "+btnValue);
                        tool = "rectangle";
                        break;
                    case "circle":
                        tool = "circle";
                        break;
                    case "polygon":
                        tool = "polygon";
                        break;
                    case "freehandpolygon":
                        tool = "freehandpolygon";
                        break;
                }
                tb.activate(tool);
                //$Toolbar.activate("rectangle");
            }

            function doQuery(evt) {
                query.geometry = evt.geometry;
                //var taskName = document.getElementById("task").value;
                var queryTask;
                queryTask = queryTask1; //后期可以根据选择的项进行判断查询哪些图层
                query.returnGeometry = true;
                query.outFields = ["XMMC", "分类", "UNAME", "FID"];
                /*if (this.c1 === "statesTask") {
                 queryTask = statesTask;
                 query.outFields = ["STATE_NAME", "AREA"];
                 }
                 else if (taskName === "riversTask") {
                 queryTask = riversTask;
                 query.outFields = ["NAME", "SYSTEM"];
                 }
                 else {
                 queryTask = citiesTask;
                 query.outFields = ["CITY_NAME", "STATE_NAME", "POP1990"];
                 }*/
                queryTask.execute(query, showResults);
            }

            function showResults(featureSet) {
                // console.log("进入显示查询出来的图形，加载到map中");
                // 清除上一次的高亮显示
                //$Map.graphics.clear();
                tb.deactivate();
                $Map.setMapCursor("url(assets/images/cursor/aero_arrow.cur),auto");
                var symbol, infoTemplate;
                symbol = pointSym;
                //var taskName = document.getElementById("task").value;
                //switch (taskName) {
                //    case "citiesTask":
                //        symbol = pointSym;
                //        //infoTemplate = citiesInfoTemplate;
                //        break;
                //    case "riversTask":
                //        symbol = lineSym;
                //        //infoTemplate = riversInfoTemplate;
                //        break;
                //    case "statesTask":
                //        symbol = polygonSym;
                //        //infoTemplate = statesInfoTemplate;
                //        break;
                //}

                var resultFeatures = featureSet.features;
                for (var i = 0, il = resultFeatures.length; i < il; i++) {
                    // 从featureSet中得到当前地理特征
                    // 地理特征就是一图形对象
                    var graphic = resultFeatures[i];
                    graphic.setSymbol(symbol);
                    // 设置信息模板
                    //graphic.setInfoTemplate(infoTemplate);
                    // 在地图的图形图层中增加图形
                    $Map.graphics.add(graphic);
                }
            }
        },
        modal3delGraphic: function () {
            tb.deactivate();
            $Map.setMapCursor("url(assets/images/cursor/aero_arrow.cur),auto");
            $Map.graphics.clear();
        },
        printDoc:function(){
            tb.deactivate();
            $Map.setMapCursor("url(assets/images/cursor/aero_arrow.cur),auto");
            console.log("开始打印", this.docName);
            var PrintTemplate=esri.tasks.PrintTemplate;
            var template = new PrintTemplate();
            template.format = this.print.printFormat;
            template.layout = this.print.printLayout;
            console.log(this.print.printFormat,this.print.printLayout);
            template.layoutOptions = {
                "titleText": this.docName,
                "scalebarUnit": "Kilometers",
                "copyrightText": "",
                "showAttribution": false,
                "legendLayers": []
            };
            template.preserveScale = true;

            var PrintParameters=esri.tasks.PrintParameters;
            var params = new PrintParameters();
            params.map = $Map;
            params.template = template;
            var PrintTask=esri.tasks.PrintTask;
            var printTask = new PrintTask("http://60.29.110.104:6080/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export Web Map Task");
            printTask.execute(params, printResult, printError);
            function printResult(result) {
                window.open(result.url, "_blank");
                console.log("打印成功");
            }

            function printError(error) {
                alert(error);
            }
        }
    }

};
