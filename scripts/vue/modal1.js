vueExports.modal1 = {
    el: '#modal1',
    data: {
        address:""
    },
    methods: {
        drawPoint: function (evt) {
            $Map.setMapCursor("url(assets/images/cursor/cur_arrow_color.cur),auto");
            var pictureSymbol =  new PictureMarkerSymbol({
                "url":"../onemappage/assets/images/alert.gif",
                "height":50,
                "width":50,
                "type":"esriPMS",
                "angle": 0
            });

            tb = new Draw($Map);
            tb.on("draw-end", addGraphic);
            // $Map.disableMapNavigation();   //禁用map双击放大事件

            var toDrawGraphic = evt.target.value.toLowerCase();
            tb.activate(toDrawGraphic);
            function addGraphic(evt) {
                //涉危企业面图层
                var redLineCategory = new FeatureLayer("http://60.29.110.104:6080/arcgis/rest/services/一张网/一张网动态图/MapServer/9", {
                    mode: FeatureLayer.MODE_SNAPSHOT,
                    outFields: ["UNAME", "JZXG", "YDXZ", "QYKK", "BXMMC"]
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
                $Map.setMapCursor("url(assets/images/cursor/aero_arrow.cur),auto");
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
                tb.deactivate();
            }
        },
        clearPoint:function(){
            tb.deactivate();
            alarmLayer.clear();
        },
        searchAddress: function(){
            console.log("你要查询的地址是： "+this.address);
        }

    }
};