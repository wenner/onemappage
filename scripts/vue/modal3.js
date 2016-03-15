/**
 * Created by wwm on 2016/3/15.
 */
var heatLayer;
var featureLayer;
vueExports.modal3 = {
    el: '#modal3',
    data: {
        address: ""
    },
    methods: {

        personHeatMap: function () {
            console.log("进入HeatMap");
            var FeatureLayer=esri.layers.FeatureLayer;
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
        //showHeatMap:function(){
        //    if (heatLayer.visible) {
        //        heatLayer.hide();
        //    } else {
        //        heatLayer.show();
        //    }
        //},
        getFeatures:function(){
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
        }
    }
};
