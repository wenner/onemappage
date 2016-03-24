/**
 * Created by wwm on 2016/3/24.
 */
var heatLayer;
var featureLayer;
var tb;
vueExports.modal4 = {
    el: '#modal4',
    data: {
        line:[3,4,5,6,7]
    },
    methods: {
        switchPipeline:function(){
            console.log(this.line.toString());

            for (var j=0, jl=$Map.layerIds.length; j<jl; j++) {
                var currentLayer = $Map.getLayer($Map.layerIds[j]);
                console.log("id: " + currentLayer.id);
                if(currentLayer.id=="pipeLine"){
                    //$Map.removeLayer(currentLayer);
                    pipeLineLayer.setVisibleLayers([]);
                    break;
                }
            }
            pipeLineLayer.show();
            pipeLineLayer.setVisibleLayers(this.line);

        },
        addPipeLineLayer:function(){
            //使用ImageParameters设置地图服务的图层定义以及显示那些图层
            var imageParameters=new ImageParameters();
            //var layerDefs=[];
            //layerDefs[1]="name='konggang'";
            //layerDefs[2]="name='haigang'";
            //imageParameters.layerDefinitions=layerDefs;
            //只显示序号为1,2,3的图层

            imageParameters.layerIds=[7,6,5,4,3];
            //imageParameters.visibleLayers=[7,6,5,4,3];
            imageParameters.layerOption = ImageParameters.LAYER_OPTION_SHOW;
            imageParameters.transparent=true;
            //使用上面的参数构造ArcGISDynamicMapServiceLayer类的实例
            pipeLineLayer=new ArcGISDynamicMapServiceLayer("http://60.29.110.104:6080/arcgis/rest/services/一张网/一张网动态图/MapServer",{"imageParameters":imageParameters,id:"pipeLine"});
            $Map.addLayer(pipeLineLayer);
            pipeLineLayer.hide();

        },
        closeAllPipeline:function(){
            this.line=[];
            //pipeLineLayer.hide();  //隐藏管线图层
            for (var j=0, jl=$Map.layerIds.length; j<jl; j++) {
                var currentLayer = $Map.getLayer($Map.layerIds[j]);
                //console.log("id: " + currentLayer.id);
                if(currentLayer.id=="pipeLine"){
                    //$Map.removeLayer(currentLayer);
                    currentLayer.hide();
                }
            }
        }
    },
    created:function(){
        this.addPipeLineLayer();
    }
};
