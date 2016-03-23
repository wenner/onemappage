vueExports.modal1 = {
    el: '#modal1',
    data: {
        address:""
    },
    methods: {
        drawPoint: function (evt) {

            var pictureSymbol =  new PictureMarkerSymbol({
                "url":"../onemappage/assets/images/alert.gif",
                "height":50,
                "width":50,
                "type":"esriPMS",
                "angle": 0
            });

            tb = new Draw($Map);
            tb.on("draw-end", addGraphic);
            $Map.disableMapNavigation();   //禁用map双击放大事件

            var toDrawGraphic = evt.target.value.toLowerCase();
            tb.activate(toDrawGraphic);
            function addGraphic(evt) {
                //deactivate the toolbar
                tb.deactivate();
                $Map.enableMapNavigation(); //画完之后启用双击放大事件
                // figure out which symbol to use
                var alarmSymbol;
                if (evt.geometry.type === "point" || evt.geometry.type === "multipoint") {
                    alarmSymbol = pictureSymbol;
                } else if (evt.geometry.type === "line" || evt.geometry.type === "polyline") {
                    alarmSymbol = lineSymbol;
                }
                else {
                    alarmSymbol = sfs;
                }
                alarmLayer.add(new Graphic(evt.geometry, alarmSymbol));
                //$Map.graphics.add(new Graphic(evt.geometry, symbol));
                tb.deactivate();
            }
        },
        clearPoint:function(){
            alarmLayer.clear();
        },
        searchAddress: function(){
            console.log("你要查询的地址是： "+this.address);
        }

    }
};