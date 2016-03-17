/**
 * Created by wwm on 2016/3/15.
 */
var heatLayer;
var featureLayer;
vueExports.modal3 = {
    el: '#modal3',
    data: {
        picked: 1,
        c1: [],
        c2: [],
        c3: [],
        c4: []
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
            featureLayer = new FeatureLayer("http://60.29.110.104:6080/arcgis/rest/services/一张网/一张网企业项目动态图map/MapServer/0", {
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
                    "radius": 20,
                    "gradient": {
                        0.45: "rgb(000,000,255)",
                        0.55: "rgb(000,255,255)",
                        0.65: "rgb(000,255,000)",
                        0.95: "rgb(255,255,000)",
                        1.00: "rgb(255,000,000)"
                    }
                },
                "map": $Map,
                "domNodeId": "heatLayer",
                "opacity": 0.85
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
        }
    }
};
