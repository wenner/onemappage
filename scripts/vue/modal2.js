vueExports.modal2={
    el:'#modal2' ,
    data:{
        tab1:{
            level:1 ,
            distance:100
        } ,
        tab2:{

        } ,
        tab3:{} ,
        gp: null
    } ,
    methods:{
        tab1a:function(){
            var self=this;
            var bufferNum=this.tab1.level;
            var bufferDistance=this.tab1.distance;
            console.log("绘制缓存层级为："+bufferNum+"缓冲区半径为："+bufferDistance);

            if (!$CurrentGraphic){
                alert("no $Graphic");
                return;
            }

            if(bufferNum>0){
                console.log("bufferNum > 0,进入switch语句");
                switch(bufferNum.toString()){
                    case "1":
                        console.log("进入switch语句，执行buffer的层级数量1");
                        this.tojob($CurrentGraphic , bufferDistance);
                        break;
                    case "2":
                        this.tojob($CurrentGraphic , bufferDistance);
                        this.tojob($CurrentGraphic , bufferDistance*2);
                        break;
                    case "3":
                        this.tojob($CurrentGraphic , bufferDistance);
                        this.tojob($CurrentGraphic , bufferDistance*2);
                        this.tojob($CurrentGraphic , bufferDistance*3);
                        break;
                    default:
                        console.log("other level"+bufferNum);
                        return;
                }
            }
        } ,
        tab1b:function(){
            console.log(this.tab1.distance);
        } ,
        tojob:function(graphic , distance){
            var Geoprocessor=esri.tasks.Geoprocessor ,
                FeatureSet=esri.tasks.FeatureSet ,
                LinearUnit=esri.tasks.LinearUnit;
            //第一步构造GP
            var gpUrl='http://60.29.110.104:6080/arcgis/rest/services/GP/缓冲区分析/GPServer/Buffer_point2poly';
            this.gp=new Geoprocessor(gpUrl);
            //第二步，构造参数
            //我们通过上面，了解到GPFeatureRecordSetLayer对应FeatureSet
            var features=[];
            features.push(graphic);
            var featureset=new FeatureSet();
            featureset.features=features;
            //构造缓冲长度，这里的单位是可以更改的
            var Dis=new LinearUnit();
            Dis.distance=distance;
            //Dis.units = "esriKilometers";
            Dis.units="esriMeters";
            var parms={
                pDistance:Dis ,
                pDataSet:featureset
            };
            //这里函数是异步的，使用函数是submitJob,同步的使用的是execute。
            //成功之后，调用jobResult,建议看一下这个参数。
            this.gp.submitJob(parms , this.jobResult);
        } ,

        jobResult: function(result) {
            console.log("job result" , result);
            var JobInfo = esri.tasks.JobInfo;

            var jobId = result.jobId;
            var status = result.jobStatus;
            if(status === JobInfo.STATUS_SUCCEEDED) {
                //成功之后，将其中的结果取出来，当然这也是参数名字。
                //在模型中，想要取出中间结果，需要设置为模型参数
                console.log("GP服务执行成功。   status:"+status  + "   jobId:"+jobId);
                this.gp.getResultData(jobId, "outSHP", this.addResults);
            }
        } ,
        addResults: function(results){
            var SimpleFillSymbol = esri.symbol.SimpleFillSymbol ,
                SimpleLineSymbol = esri.symbol.SimpleLineSymbol ,
                Color = esri.Color;
            var features = results.value.features;
            if(features.length>0) {
                console.log("callback success... features.length="+features.length);
                for (var i = 0, length = features.length; i != length; ++i) {
                    var feature = features[i];
                    var polySymbolRed = new SimpleFillSymbol();
                    polySymbolRed.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 0, 0.5]), 1));
                    polySymbolRed.setColor(new Color([255, 0, 0, 0.5]));
                    feature.setSymbol(polySymbolRed);
                    $Map.graphics.add(feature);
                }
                console.log("提示","计算成功！");
            }
            else{
                console.log("提示","计算失败！");
            }
        },

        drawRectangle:function(){
            $Map.disableMapNavigation();
            $Toolbar.activate("rectangle");
        },
        drawCircle:function(){
            $Map.disableMapNavigation();
            $Toolbar.activate("circle");
        },
        drawPolygon:function(){
            $Map.disableMapNavigation();
            $Toolbar.activate("polygon");
        },
        drawFreehandPolygon:function(){
            $Map.disableMapNavigation();
            $Toolbar.activate("freehandpolygon");
        },
        clearGraphic:function(){
            $Map.graphics.clear();
        },
        setERGgraphic:function(){
            var Polygon=esri.geometry.Polygon;
            //自己实现一个polygon，以便自动覆盖全区所有范围
            //首先获取时间点的位置
            console.log($CurrentGraphic.geometry.x,$CurrentGraphic.geometry.x);

            //var Graphic=esri.graphic;
            var SimpleFillSymbol = esri.symbol.SimpleFillSymbol ,
                SimpleLineSymbol = esri.symbol.SimpleLineSymbol ,
                Color = esri.Color;
            var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.5]));

            //根据数据框数据的条件进行参数设定，包括大小，旋转方向
            //1.大小的确定
            var weight=140;
            var height=180;
            var rings=[
                [-200, -200],
                [200, -200],
                [200, 200],
                [-200, 200],
                [-200,-200]     //poly面需要闭合，故首尾坐标一致
            ];
            rings[0][0]=-(weight/2);
            rings[0][1]=-(height/2);
            rings[1][0]=weight/2;
            rings[1][1]=-(height/2);
            rings[2][0]=weight/2;
            rings[2][1]=height/2;
            rings[3][0]=-(weight/2);
            rings[3][1]=height/2;
            rings[4][0]=rings[0][0];
            rings[4][1]=rings[0][1];


            //2.旋转方向的确定
            var ra=45*0.017453293;
            var rate=25;
            var arc=rate*0.017453293; //将角度转换成弧度
            //rings[0][0] =rings[0][0]+Math.abs(rings[0][0])*Math.cos(ra)-Math.abs(rings[0][0])*Math.cos(ra+arc);
            rings[0][0] =-Math.abs(rings[0][0])*Math.cos(ra+arc);
            rings[0][1] =-Math.abs(rings[0][1])*Math.sin(ra+arc);
            rings[1][0] =Math.abs(rings[1][0])*Math.cos(ra-arc);
            rings[1][1] =-Math.abs(rings[1][1])*Math.sin(ra-arc);
            rings[2][0] =Math.abs(rings[2][0])*Math.cos(ra+arc);
            rings[2][1] =Math.abs(rings[2][1])*Math.sin(ra+arc);
            rings[3][0] =-Math.abs(rings[3][0])*Math.cos(ra-arc);
            rings[3][1] =Math.abs(rings[3][1])*Math.sin(ra-arc);
            rings[4][0] =rings[0][0];
            rings[4][1] =rings[0][1];
            for(var i=0;i<4;i++){
                for(var j=0;j<2;j++){
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
            console.log(polygon.rings[0]);
            var ERGgraphic =new esri.Graphic(polygon, symbol);
            console.log(ERGgraphic.geometry);
            //以事故地点的坐标为中心点，进行平移
            for(var i=0;i<polygon.rings[0].length;i++){
                var x= parseFloat(ERGgraphic.geometry.rings[0][i][0])+parseFloat($CurrentGraphic.geometry.x);
                ERGgraphic.geometry.rings[0][i][0]=x;
                var y= parseFloat(ERGgraphic.geometry.rings[0][i][1])+parseFloat($CurrentGraphic.geometry.y);
                ERGgraphic.geometry.rings[0][i][1]=y;
                console.log("x: "+ x+"  | y: "+ y);
            }
            $Map.graphics.add(ERGgraphic);

            //var myPolygon = {"geometry":{"rings":[[[-115.3125,37.96875],[-111.4453125,37.96875],
            //    [-99.84375,36.2109375],[-99.84375,23.90625],[-116.015625,24.609375],
            //    [-115.3125,37.96875]]],"spatialReference":{"wkid":102100}},
            //    "symbol":{"color":[0,0,0,64],"outline":{"color":[0,0,0,255],
            //        "width":1,"type":"esriSLS","style":"esriSLSSolid"},
            //        "type":"esriSFS","style":"esriSFSSolid"}};
            //var p=myPolygon.geometry.rings;
            //console.log(p);
            //var gra = new esri.Graphic(myPolygon);
        }

    }
};