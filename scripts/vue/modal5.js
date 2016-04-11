/**
 * Created by wwm on 2016/3/18.
 */
var routeTask, routeParams, routes = [];
var stopSymbol, barrierSymbol, routeSymbol;
var mapOnClick_addStops_connect = null, mapOnClick_addBarriers_connect = null;
vueExports.modal5 = {
    el: '#modal5',
    data: {
        tab1:{
            t1:2,
            t2:5,
            t3:10
        },
        tab2: {
        }
    },
    methods: {
        areaService:function(){
            var t1=this.tab1.t1,t2=this.tab1.t2,t3=this.tab1.t3;
            var serviceAreaTask = new ServiceAreaTask("http://60.29.110.104:6080/arcgis/rest/services/GP/networkAnalyst/NAServer/serverArea");
            var params = new ServiceAreaParameters();
            params.defaultBreaks = [1, 2, 3];
            params.outSpatialReference = $Map.spatialReference;
            params.returnFacilities = false;

            var handle= $Map.on("click", computeServiceArea);

            function computeServiceArea(evt) {
                areaLayer.clear();
                var pointSymbol = new SimpleMarkerSymbol();
                pointSymbol.setOutline = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                    new Color([255, 0, 0]), 1);
                pointSymbol.setSize(5);
                pointSymbol.setColor(new Color([0, 255, 0, 0.25]));

                var graphic = new Graphic(evt.mapPoint, pointSymbol);
                $Map.graphics.add(graphic);

                params.defaultBreaks = [t1,t2,t3];

                var features = [];
                features.push(graphic);
                var featureSet = new FeatureSet();
                featureSet.features = features;
                params.facilities = featureSet;

                serviceAreaTask.solve(params, showServiceAreas);
            }

            function showServiceAreas(solveResult) {
                var features = solveResult.serviceAreaPolygons;
                for (var f = 0, fl = features.length; f < fl; f++) {
                    var feature = features[f];
                    if (f == 0) {
                        var polySymbolRed = new SimpleFillSymbol();
                        polySymbolRed.setOutline(
                            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                                new Color([0, 0, 0, 0.5]), 1));
                        polySymbolRed.setColor(new Color([255, 0, 0, 0.7]));
                        feature.setSymbol(polySymbolRed);
                    }
                    else if (f == 1) {
                        var polySymbolGreen = new SimpleFillSymbol();
                        polySymbolGreen.setOutline(
                            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                                new Color([0, 0, 0, 0.5]), 1));
                        polySymbolGreen.setColor(new Color([0, 255, 0, 0.7]));
                        feature.setSymbol(polySymbolGreen);
                    }
                    else if (f == 2) {
                        var polySymbolBlue = new SimpleFillSymbol();
                        polySymbolBlue.setOutline(
                            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                                new Color([0, 0, 0, 0.5]), 1));
                        polySymbolBlue.setColor(new Color([0, 0, 255, 0.7]));
                        feature.setSymbol(polySymbolBlue);
                    }
                    areaLayer.add(feature);
                }
                handle.remove();  //将map.on click事件移除，达到只触发一次目的
                console.log("handle.remove()");
            }
        },
        clearAreaGraphics:function(){
            console.log("clearAreaGraphics");
            areaLayer.clear();
            $Map.graphics.clear();
        },
        addStops:function(){
            console.log("addStops");
            this.removeEventHandlers();
            mapOnClick_addStops_connect = $Map.on("click", this.addStop);
        },
        clearStops:function(){
            console.log("clearStops");
            this.removeEventHandlers();
            for (var i = routeParams.stops.features.length - 1; i >= 0; i--) {
                $Map.graphics.remove(routeParams.stops.features.splice(i, 1)[0]);
            }
        },
        addStop:function(evt){
            console.log("addStop");
            var graphic = new Graphic(evt.mapPoint, stopSymbol);
            routeParams.stops.features.push($Map.graphics.add(graphic));
        },
        addBarriers:function(){
            console.log("addBarriers");
            this.removeEventHandlers();
            mapOnClick_addBarriers_connect = $Map.on("click", this.addBarrier);
        },
        clearBarriers:function(){
            console.log("clearBarriers");
            this.removeEventHandlers();
            for (var i = routeParams.barriers.features.length - 1; i >= 0; i--) {
                $Map.graphics.remove(routeParams.barriers.features.splice(i, 1)[0]);
            }
        },
        addBarrier:function(evt){
            console.log("addBarrier");
            var graphic = new Graphic(evt.mapPoint, barrierSymbol);
            routeParams.barriers.features.push($Map.graphics.add(graphic));
        },
        removeEventHandlers:function(){
            console.log("removeEventHandlers");
            if (mapOnClick_addStops_connect != null) {
                mapOnClick_addStops_connect.remove();
            }
            if (mapOnClick_addBarriers_connect != null) {
                mapOnClick_addBarriers_connect.remove();
            }
        },
        solveRoute:function(){
            console.log("solveRoute");
            this.removeEventHandlers();
            routeTask.solve(routeParams, this.showRoute, this.errorHandler);
        },
        clearRoutes:function(){
            console.log("clearRoutes");
            for (var i = routes.length - 1; i >= 0; i--) {
                $Map.graphics.remove(routes.splice(i, 1)[0]);
            }
            routes = [];
        },
        showRoute:function(result){
            console.log("showRoute");
            this.clearRoutes();
            var routeResults = result.routeResults;
            routes.push(
                $Map.graphics.add(routeResults[0].route.setSymbol(routeSymbol))
            );
            var msgs = ["服务器消息："];
            for (var i = 0; i < result.messages.length; i++) {
                msgs.push(result.messages[i].type + " : " + result.messages[i].description);
            }
            if (msgs.length > 1) {
                alert(msgs.join("\n - "));
            }
        },
        errorHandler:function(err){
            alert("发生错误\n" + err.message + "\n" + err.details.join("\n"));
        }
    },
    created: function () {
        routeTask = new RouteTask("http://60.29.110.104:6080/arcgis/rest/services/GP/networkAnalyst/NAServer/routLayer");
        routeParams = new RouteParameters();
        routeParams.stops = new FeatureSet();
        routeParams.barriers = new FeatureSet();

        stopSymbol = new SimpleMarkerSymbol().setStyle(SimpleMarkerSymbol.STYLE_CROSS).setSize(15);
        stopSymbol.outline.setWidth(3);

        barrierSymbol = new SimpleMarkerSymbol().setStyle(SimpleMarkerSymbol.STYLE_X).setSize(10);
        barrierSymbol.outline.setWidth(3).setColor(new Color([255, 0, 0]));

        routeSymbol = new SimpleLineSymbol().setColor(new Color([0, 0, 255, 0.5])).setWidth(5);
    }
};


