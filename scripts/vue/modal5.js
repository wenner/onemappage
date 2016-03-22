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
            t1:"",
            t2:"",
            t3:""
        },
        tab2: {
        }
    },
    methods: {
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


