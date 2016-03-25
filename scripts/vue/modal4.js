/**
 * Created by wwm on 2016/3/24.
 */
vueExports.modal4 = {
    el: '#modal4',
    data: {
        line:[],
        switchAll:""
    },
    watch: {
        line: function (val, oldVal) {
            //console.log( val, oldVal);
        }
    },
    methods: {
        switchPipeline: function () {
            //pipeLineLayer.setVisibleLayers(this.line);
            pipeLineLayer.show();
        },
        addPipeLineLayer: function () {
            //使用ImageParameters设置地图服务的图层定义以及显示那些图层
            var imageParameters = new ImageParameters();
            //var layerDefs=[];
            //layerDefs[1]="name='konggang'";
            //layerDefs[2]="name='haigang'";
            //imageParameters.layerDefinitions=layerDefs;
            //只显示序号为1,2,3的图层

            imageParameters.layerIds = [0];  //为了安全考虑，目前不把管线数据展示出来
            //imageParameters.layerIds = [7, 6, 5, 4, 3];
            //imageParameters.visibleLayers=[7,6,5,4,3];
            imageParameters.layerOption = ImageParameters.LAYER_OPTION_SHOW;
            imageParameters.transparent = true;
            //使用上面的参数构造ArcGISDynamicMapServiceLayer类的实例
            pipeLineLayer = new ArcGISDynamicMapServiceLayer("http://60.29.110.104:6080/arcgis/rest/services/一张网/一张网动态图/MapServer", {
                "imageParameters": imageParameters,
                id: "pipeLine"
            });
            $Map.addLayer(pipeLineLayer);
            pipeLineLayer.hide();
        },
        closeAllPipeline: function () {
            if(this.switchAll){
                //this.line=["7", "6", "5", "4", "3"];
                //pipeLineLayer.setVisibleLayers(this.line);
                pipeLineLayer.show();
            }else{
                this.line=[];
                //pipeLineLayer.setVisibleLayers(this.line);
                pipeLineLayer.hide();   //隐藏管线图层
            }
        }
    },
    created: function () {
        this.addPipeLineLayer();
    }
};
