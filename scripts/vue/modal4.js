/**
 * Created by wwm on 2016/3/24.
 */
var _list = [{name: "供电管线", ls: 3, checked: false}, {name: "路灯电缆", ls: 4, checked: false}, { name: "燃气管线", ls: 5, checked: false}, {name: "污水管线", ls: 6, checked: false}, {name: "雨水管线", ls: 7, checked: false}];
vueExports.modal4 = {
    el: '#modal4',
    computed: {
        allChecked: {
            get: function () {
                return this.checkedCount == this.list.length;
            },
            set: function (value) {
                this.list.forEach(function (item) {
                    item.checked = value
                });
                return value;
            }
        },
        checkedCount: {
            get: function () {
                var i = 0;
                this.list.forEach(function (item) {
                    if (item.checked == true) i++;
                });
                return i;
            }
        }
    },
    data: {
        layID: [],
        list: _list

    },
    watch: {
        layID: function (val, oldVal) {
            console.log( val, oldVal,val.length);
            pipeLineLayer.show();
            pipeLineLayer.setVisibleLayers(val);
        }
    },
    methods: {
        switchPipeline: function (index) {
            for (var i = 0; i < this.list.length; i++) {
                if (this.layID.contains(this.list[index].ls)) {
                    this.layID.remove(this.list[index].ls);
                    console.log("remove:" + this.list[index].ls);
                } else {
                    this.layID.push(this.list[index].ls);
                    this.layID.sort();
                    console.log("push:" + this.list[index].ls);
                }
            }
            pipeLineLayer.show();
            pipeLineLayer.setVisibleLayers(this.layID);
            console.log(this.layID.toString());
        },
        addPipeLineLayer: function () {
            //使用ImageParameters设置地图服务的图层定义以及显示那些图层
            var imageParameters = new ImageParameters();
            //var layerDefs=[];
            //layerDefs[1]="name='konggang'";
            //layerDefs[2]="name='haigang'";
            //imageParameters.layerDefinitions=layerDefs;
            //只显示序号为1,2,3的图层

            imageParameters.layerIds = [7, 6, 5, 4, 3];
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
            //pipeLineLayer.hide();  //隐藏管线图层
            for (var j = 0, jl = $Map.layerIds.length; j < jl; j++) {
                var currentLayer = $Map.getLayer($Map.layerIds[j]);
                //console.log("id: " + currentLayer.id);
                if (currentLayer.id == "pipeLine") {
                    //$Map.removeLayer(currentLayer);
                    console.log(currentLayer.visible);
                    if (currentLayer.visible&&this.layID.length==this.list.length) {
                        console.log(currentLayer.visible,this.layID.length==this.list.length);
                        currentLayer.hide();
                        this.layID = [];
                    } else {
                        console.log(currentLayer.visible,this.layID.length==this.list.length);
                        this.layID = [7, 6, 5, 4, 3];
                        $Map.removeLayer(currentLayer);
                        this.addPipeLineLayer();
                        pipeLineLayer.show();
                    }
                } else {
                    this.addPipeLineLayer();
                    pipeLineLayer.show();
                }
            }
        }
    },
    created: function () {
        this.addPipeLineLayer();
    }
}
