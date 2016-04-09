vueExports.modal2 = {
    el: '#modal2',
    data: {
        tab1: {
            level: 1,
            distance: 100
        },
        tab2: {
            color: "#33FF33"
        },
        tab3: {},
        gp: null
    },
    methods: {
        tab1a: function () {
            var self = this;
            var bufferNum = this.tab1.level;
            var bufferDistance = this.tab1.distance;
            console.log("绘制缓存层级为：" + bufferNum + "缓冲区半径为：" + bufferDistance);
            var alarmGraphics;
            console.log(alarmLayer.graphics);

            if (!alarmLayer.graphics) {
                alert("请现在图上指定事故地点，在事件定位栏");
                return;
            }
            for (var i in alarmLayer.graphics) {

                if (bufferNum > 0) {
                    console.log("第" + i + "次进入，  bufferNum > 0,进入switch语句");
                    switch (bufferNum.toString()) {
                        case "1":
                            console.log("进入switch语句，执行buffer的层级数量1");
                            this.tojob(alarmLayer.graphics[i], bufferDistance);
                            break;
                        case "2":
                            this.tojob(alarmLayer.graphics[i], bufferDistance);
                            this.tojob(alarmLayer.graphics[i], bufferDistance * 2);
                            break;
                        case "3":
                            this.tojob(alarmLayer.graphics[i], bufferDistance);
                            this.tojob(alarmLayer.graphics[i], bufferDistance * 2);
                            this.tojob(alarmLayer.graphics[i], bufferDistance * 3);
                            break;
                        default:
                            console.log("other level" + bufferNum);
                            return;
                    }
                }
            }

        },
        tab1b: function () {
            console.log(this.tab1.distance);
        },
        tojob: function (graphic, distance) {
            var Geoprocessor = esri.tasks.Geoprocessor,
                FeatureSet = esri.tasks.FeatureSet,
                LinearUnit = esri.tasks.LinearUnit;
            //第一步构造GP
            var gpUrl = 'http://60.29.110.104:6080/arcgis/rest/services/GP/缓冲区分析/GPServer/Buffer_point2poly';
            this.gp = new Geoprocessor(gpUrl);
            //第二步，构造参数
            //我们通过上面，了解到GPFeatureRecordSetLayer对应FeatureSet
            var features = [];
            features.push(graphic);
            var featureset = new FeatureSet();
            featureset.features = features;
            //构造缓冲长度，这里的单位是可以更改的
            var Dis = new LinearUnit();
            Dis.distance = distance;
            //Dis.units = "esriKilometers";
            Dis.units = "esriMeters";
            var parms = {
                pDistance: Dis,
                pDataSet: featureset
            };
            //这里函数是异步的，使用函数是submitJob,同步的使用的是execute。
            //成功之后，调用jobResult,建议看一下这个参数。
            this.gp.submitJob(parms, this.jobResult);
        },

        jobResult: function (result) {
            console.log("job result", result);
            var JobInfo = esri.tasks.JobInfo;

            var jobId = result.jobId;
            var status = result.jobStatus;
            if (status === JobInfo.STATUS_SUCCEEDED) {
                //成功之后，将其中的结果取出来，当然这也是参数名字。
                //在模型中，想要取出中间结果，需要设置为模型参数
                console.log("GP服务执行成功。   status:" + status + "   jobId:" + jobId);
                this.gp.getResultData(jobId, "outSHP", this.addResults);
            }
        },
        addResults: function (results) {
            var SimpleFillSymbol = esri.symbol.SimpleFillSymbol,
                SimpleLineSymbol = esri.symbol.SimpleLineSymbol,
                Color = esri.Color;
            var features = results.value.features;
            if (features.length > 0) {
                console.log("callback success... features.length=" + features.length);
                for (var i = 0, length = features.length; i != length; ++i) {
                    pointBufferFeature = features[i];
                    var polySymbolRed = new SimpleFillSymbol();
                    polySymbolRed.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 0, 0.5]), 1));
                    polySymbolRed.setColor(new Color([255, 0, 0, 0.5]));
                    pointBufferFeature.setSymbol(polySymbolRed);
                    bufferLayer.add(pointBufferFeature);
                }
                console.log("提示", "计算成功！");
            }
            else {
                console.log("提示", "计算失败！");
            }
        },

        Draw: function (evt) {
            var rgbFill = ("#" + this.tab2.color).toRGB();
            //var rgbOutline = ("#" + this.jsColorOutline).toRGB();
            var rgbaFill = [rgbFill[0], rgbFill[1], rgbFill[2], 0.5];  //透明度 的值没法获取
            //var rgbaOutline = [rgbOutline[0], rgbOutline[1], rgbOutline[2], this.jsColorTransparency];  //透明度 的值没法获取
            //console.log(rgbFill, rgbOutline, rgbaFill);
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
            var sfs = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0, 0.5]), 2), new Color(rgbaFill));
            var tb = new Draw($Map);
            tb.on("draw-end", addGraphic);
            $Map.disableMapNavigation();   //禁用map双击放大事件

            // console.log(evt.target.value, this.tab2.color); //获取到button的value值
            var toDrawGraphic = evt.target.value;
            tb.activate(toDrawGraphic);
            function addGraphic(evt) {
                //deactivate the toolbar
                tb.deactivate();
                $Map.enableMapNavigation(); //画完之后启用双击放大事件
                // figure out which symbol to use
                var areaSymbol;
                if (evt.geometry.type === "point" || evt.geometry.type === "multipoint") {
                    areaSymbol = markerSymbol;
                } else if (evt.geometry.type === "line" || evt.geometry.type === "polyline") {
                    areaSymbol = lineSymbol;
                }
                else {
                    areaSymbol = sfs;
                }
                areaLayer.add(new Graphic(evt.geometry, areaSymbol));
            }
        },
        setERGgraphic: function () {
            var Polygon = esri.geometry.Polygon;
            //首先获取事件点的位置
            //console.log($CurrentGraphic.geometry.x,$CurrentGraphic.geometry.x);
            if (!alarmLayer.graphics) {
                alert("请现在图上指定事故地点，在事件定位栏");
                return;
            }

            //var Graphic=esri.graphic;
            var SimpleFillSymbol = esri.symbol.SimpleFillSymbol,
                SimpleLineSymbol = esri.symbol.SimpleLineSymbol,
                Color = esri.Color;
            var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.5]));

            //根据数据框数据的条件进行参数设定，包括大小，旋转方向
            //1.大小的确定
            var weight = 800;
            var height = 1100;
            // var rings = [
            //     [-500, -500],
            //     [500, -500],
            //     [500, 500],
            //     [-500, 500],
            //     [-500, -500]     //poly面需要闭合，故首尾坐标一致
            // ];

            var rings = [
                [0, 0],
                [1000, 0],
                [1000, 1000],
                [0, 1000],
                [0, 0]     //poly面需要闭合，故首尾坐标一致
            ];
            rings[0][0] = -(weight / 2);
            rings[0][1] = -(height / 2);
            rings[1][0] = weight / 2;
            rings[1][1] = -(height / 2);
            rings[2][0] = weight / 2;
            rings[2][1] = height / 2;
            rings[3][0] = -(weight / 2);
            rings[3][1] = height / 2;
            rings[4][0] = rings[0][0];
            rings[4][1] = rings[0][1];


            //2.旋转方向的确定
            var ra = 45 * 0.017453293;
            var rate = 25;
            var arc = rate * 0.017453293; //将角度转换成弧度
            //rings[0][0] =rings[0][0]+Math.abs(rings[0][0])*Math.cos(ra)-Math.abs(rings[0][0])*Math.cos(ra+arc);
            rings[0][0] = -Math.abs(rings[0][0]) * Math.cos(ra + arc);
            rings[0][1] = -Math.abs(rings[0][1]) * Math.sin(ra - arc);
            rings[1][0] = Math.abs(rings[1][0]) * Math.cos(ra + arc);
            rings[1][1] = -Math.abs(rings[1][1]) * Math.sin(ra - arc);
            rings[2][0] = Math.abs(rings[2][0]) * Math.cos(ra - arc);
            rings[2][1] = Math.abs(rings[2][1]) * Math.sin(ra + arc);
            rings[3][0] = -Math.abs(rings[3][0]) * Math.cos(ra - arc);
            rings[3][1] = Math.abs(rings[3][1]) * Math.sin(ra + arc);
            rings[4][0] = rings[0][0];
            rings[4][1] = rings[0][1];
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 2; j++) {
                    console.log(rings[i][j]);
                }
            }
            var polygon = new Polygon({
                "rings": [   //作为默认poly
                    [
                        rings[0],
                        rings[1],
                        rings[2],
                        rings[3],
                        rings[4]     //poly面需要闭合，故首尾坐标一致
                    ]
                ],
                "spatialReference": {
                    "wkid": 102100
                }
            });
            console.log("polygon.rings[0]  " + polygon.rings[0]);
            var ERGgraphic = new Graphic(polygon, symbol);
            //重新定义个ERG模型至正确坐标
            var poly = polygon;
            var ERG = new Graphic(poly, symbol);

            //以事故地点的坐标为中心点，进行平移
            for (var alg in alarmLayer.graphics)
            {
                if(alg==0){
                    var gx=parseFloat(alarmLayer.graphics[alg].geometry.x);
                    var gy=parseFloat(alarmLayer.graphics[alg].geometry.y);
                    for (var i = 0; i < polygon.rings[0].length; i++) {
                        //console.log("polygon    "+i);
                        //ERG.geometry.rings[0][i][0]=0;
                        //ERG.geometry.rings[0][i][1]=0;
                        var x= 0.0,y=0.0;
                        var xx= parseFloat(ERGgraphic.geometry.rings[0][i][0]);
                        var yy= parseFloat(ERGgraphic.geometry.rings[0][i][1]);
                        x=gx+xx;
                        y=gy+yy;
                        ERG.geometry.rings[0][i][0]=x;
                        ERG.geometry.rings[0][i][1]=y;
                    }
                    areaLayer.add(ERG);
                }
            }


            //var myPolygon = {"geometry":{"rings":[[[-115.3125,37.96875],[-111.4453125,37.96875],
            //    [-99.84375,36.2109375],[-99.84375,23.90625],[-116.015625,24.609375],
            //    [-115.3125,37.96875]]],"spatialReference":{"wkid":102100}},
            //    "symbol":{"color":[0,0,0,64],"outline":{"color":[0,0,0,255],
            //        "width":1,"type":"esriSLS","style":"esriSLSSolid"},
            //        "type":"esriSFS","style":"esriSFSSolid"}};
            //var p=myPolygon.geometry.rings;
            //console.log(p);
            //var gra = new esri.Graphic(myPolygon);
        },
        clearBuffer: function () {
            bufferLayer.clear();
        },
        clearGraphic: function () {
            areaLayer.clear();
        },
        btnCleanResult:function(){
            areaLayer.clear();
        }
    }
};