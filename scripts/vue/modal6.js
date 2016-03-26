/**
 * Created by wwm on 2016/3/18.
 */
vueExports.modal6 = {
    el: '#modal6',
    data: {
        jsColorFill: "",
        jsColorOutline: "",
        jsColorTransparency: 0.9,  //此值实际值为v-model中的
        mark: "",
        tab2: {
            text: "",
            textFont: "",
            textColor: "",
            textSize: 20
        }
    },
    methods: {
        plotting: function (evt) {
            var rgbFill = ("#" + this.jsColorFill).toRGB();
            var rgbOutline = ("#" + this.jsColorOutline).toRGB();
            var rgbaFill = [rgbFill[0], rgbFill[1], rgbFill[2], this.jsColorTransparency];  //透明度 的值没法获取
            var rgbaOutline = [rgbOutline[0], rgbOutline[1], rgbOutline[2], this.jsColorTransparency];  //透明度 的值没法获取
            console.log(rgbFill, rgbOutline, rgbaFill);
            // markerSymbol is used for point and multipoint, see http://raphaeljs.com/icons/#talkq for more examples1
            var markerSymbol = new SimpleMarkerSymbol();
            markerSymbol.setPath("M16,4.938c-7.732,0-14,4.701-14,10.5c0,1.981,0.741,3.833,2.016,5.414L2,25.272l5.613-1.44c2.339,1.316,5.237,2.106,8.387,2.106c7.732,0,14-4.701,14-10.5S23.732,4.938,16,4.938zM16.868,21.375h-1.969v-1.889h1.969V21.375zM16.772,18.094h-1.777l-0.176-8.083h2.113L16.772,18.094z");
            markerSymbol.setColor(new Color("#00FFFF"));

            // lineSymbol used for freehand polyline, polyline and line.
            var lineSymbol = new CartographicLineSymbol(
                CartographicLineSymbol.STYLE_SOLID,
                new Color([255, 0, 0]), 10,
                CartographicLineSymbol.CAP_ROUND,
                CartographicLineSymbol.JOIN_MITER, 5
            );

            // fill symbol used for extent, polygon and freehand polygon, use a picture fill symbol
            // the images folder contains additional fill images, other options: sand.png, swamp.png or stiple.png
            var fillSymbol = new PictureFillSymbol("../onemappage/assets/images/mangrove.png", new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color('#000'), 1), 42, 42);
            var sfs = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color(rgbaOutline), 2), new Color(rgbaFill));
            tb = new PoltDraw($Map);
            tb.on("draw-end", addGraphic);
            $Map.disableMapNavigation();   //禁用map双击放大事件

            console.log(evt.target.value); //获取到button的value值
            var toDrawGraphic = evt.target.value.toLowerCase();
            tb.activate(toDrawGraphic);
            function addGraphic(evt) {
                //deactivate the toolbar
                tb.deactivate();
                $Map.enableMapNavigation(); //画完之后启用双击放大事件
                // figure out which symbol to use
                var symbol;
                if (evt.geometry.type === "point" || evt.geometry.type === "multipoint") {
                    symbol = markerSymbol;
                } else if (evt.geometry.type === "line" || evt.geometry.type === "polyline") {
                    symbol = lineSymbol;
                }
                else {
                    symbol = sfs;
                }
                plottingLayer.add(new Graphic(evt.geometry, symbol));
            }
        },
        clearGraphic: function () {
            plottingLayer.clear();
        },
        addLabel: function () {
            var tc=("#" + this.tab2.textColor).toRGB();
            var txtColor = [tc[0],tc[1],tc[2],1];
            console.log(txtColor);
            var markerSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_X, 25,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_DOT,
                    new Color(txtColor), 2));
            var toolbar = new Draw($Map);
            toolbar.on("draw-end", addToMap);
            toolbar.activate("point");
            function addToMap(evt) {
                var geometry = evt.geometry;
                var symbol;
                symbol = markerSymbol;
                var graphic = new Graphic(geometry, symbol);
                //$Map.graphics.add(graphic);
                //labelLayer.add(graphic);

                // 增加标注
                addLabel(geometry);
            }
            var text=this.tab2.text;
            console.log(text);
            if(text==""|| text==null){
                console.warn("请输入文本");
                //alert("请输入文本");
            }
            function addLabel(geometry) {
                toolbar.deactivate();
                var x, y, g;
                x = Measure.round(geometry.x, 2);
                y = Measure.round(geometry.y, 2);
                //g = getPointLabel(x + ", " + y, geometry);
                g = getPointLabel(text, geometry);
                //$Map.graphics.add(g);
                labelLayer.add(g);
            }
            var fontFace = "Arial";
            function getFont() {
                var size = 20;
                var f = new esri.symbol.Font(size + "pt",
                    esri.symbol.Font.STYLE_NORMAL,
                    esri.symbol.Font.VARIANT_NORMAL,
                    esri.symbol.Font.WEIGHT_BOLD,
                    fontFace);
                return f;
            }

            function getPointLabel(text, point) {
                var sym = new TextSymbol(text, getFont(), new Color(txtColor));
                sym.setAlign(TextSymbol.ALIGN_START);
                var g = new Graphic(point, sym);
                return g;
            }
        },
        clearLabelLayer: function () {
            console.log("清除LabelLayer");
            labelLayer.clear();
        },
        saveLabelLayer: function () {

        }
    },
    created: function () {
        jsc.init();   //注册jsColor.js的初始化事件，jscolor.js中的var jsc变量已改动设为全局变量
        this.slider = $("#ex1Slider1").slider({
            tooltip: 'always'
        });
        this.slider2 = $("#ex1Slider2").slider({
            tooltip: 'always'
        });
        //var r = $('#ex1Slider').slider().data('slider');
        //console.log("$('#ex1Slider').slider().data('slider');    =====  "+r.getValue());
    }
};


