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
        c3:[],
        c4:[]
    },
    methods: {
        reset: function () {
            this.c1 = [];
            this.c2 = [];
            this.c3=[];
            this.c4=[];

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
        }
    }
};
