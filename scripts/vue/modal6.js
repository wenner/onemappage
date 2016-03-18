/**
 * Created by wwm on 2016/3/18.
 */
vueExports.modal6 = {
    el: '#modal6',
    data: {
        jsColorFill: "",
        jsColorOutline: ""
    },
    methods: {
        yanweiGraphic: function () {
            var rgb = this.jsColorFill.toRGB();
            console.log(rgb[0], rgb[1], rgb[2]);

            // markerSymbol is used for point and multipoint, see http://raphaeljs.com/icons/#talkq for more examples
            var markerSymbol = new SimpleMarkerSymbol();
            markerSymbol.setPath("M16,4.938c-7.732,0-14,4.701-14,10.5c0,1.981,0.741,3.833,2.016,5.414L2,25.272l5.613-1.44c2.339,1.316,5.237,2.106,8.387,2.106c7.732,0,14-4.701,14-10.5S23.732,4.938,16,4.938zM16.868,21.375h-1.969v-1.889h1.969V21.375zM16.772,18.094h-1.777l-0.176-8.083h2.113L16.772,18.094z");
            markerSymbol.setColor(new Color("#00FFFF"));

            // lineSymbol used for freehand polyline, polyline and line.
            var lineSymbol = new CartographicLineSymbol(
                CartographicLineSymbol.STYLE_SOLID,
                new Color([255,0,0]), 10,
                CartographicLineSymbol.CAP_ROUND,
                CartographicLineSymbol.JOIN_MITER, 5
            );

            // fill symbol used for extent, polygon and freehand polygon, use a picture fill symbol
            // the images folder contains additional fill images, other options: sand.png, swamp.png or stiple.png
            var fillSymbol = new PictureFillSymbol("../onemappage/assets/images/mangrove.png",new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color('#000'),1), 42, 42 );

            tb = new Draw($Map);
            tb.on("draw-end", addGraphic);

            function addGraphic(evt) {
                //deactivate the toolbar and clear existing graphics
                tb.deactivate();
                $Map.enableMapNavigation();
                // figure out which symbol to use
                var symbol;
                if ( evt.geometry.type === "point" || evt.geometry.type === "multipoint") {
                    symbol = markerSymbol;
                } else if ( evt.geometry.type === "line" || evt.geometry.type === "polyline") {
                    symbol = lineSymbol;
                }
                else {
                    symbol = fillSymbol;
                }
                $Map.graphics.add(new Graphic(evt.geometry, symbol));
            }

        }

    },
    created: function () {
        jsc.init();   //注册jsColor.js的初始化事件，jscolor.js中的var jsc变量已改动设为全局变量
        $(".bs-slider").slider({
            tooltip: 'always'
        });
    }
};


