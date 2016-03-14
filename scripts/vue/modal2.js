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
            //自己实现一个polygon，以便自动覆盖全区所有范围
            var polygon = new Polygon({
                "rings": [
                    [
                        [13058455.6036, 4732130.0963],
                        [13110312.3447, 4719396.2062],
                        [13114701.4726, 4721075.9959],
                        [13116855.3971, 4727944.1698],
                        [13077773.1877, 4746340.5785],
                        [13054974.1037, 4747776.5273],
                        [13058455.6036, 4732130.0963]
                    ]
                ],
                "spatialReference": {
                    "wkid": 102100
                }
            });
        }

    }
};