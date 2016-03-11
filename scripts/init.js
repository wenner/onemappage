(function(){
    window.createMap = function(){
        var InfoWindow = myInfoWindow;
        var infoWindow = new InfoWindow({
            domNode: dojoDomConstruct.create("div", null, dojoDom.byId("mapDiv"))
        });
        var startExtent = new esri.geometry.Extent(
            13067177.4503, 4743096.0757, 13068617.8449, 4744176.8112,
            new esri.SpatialReference({wkid: 102100})
        );
        esri.basemaps.kgmap = {
            baseMapLayers: [{url: $BaseServiceUrl+"kgmap/MapServer"}],
            thumbnailUrl: "assets/images/thumbnail-onemap.jpg",
            title: "空港图"
        };
        $Map = new esri.Map("mapDiv", {
            extent: startExtent,
            slider: true,  //显示缩放控件
            //infoWindow: infoWindow,  //此处对应自定义的infoWindow 设置
            logo: false,
            basemap: "kgmap"
            //basemap: "topo"
        });
        var baseMaps = getBaseMaps();
        createMapToggle();
        createMapGallery(baseMaps);

        //initmapevent
        initMapEvent();
    };

    function getBaseMaps(){
        var Basemap = esri.dijit.Basemap ,
            BasemapLayer = esri.dijit.BasemapLayer;
        var basemaps = [];
        var konggangMap = new Basemap({
            layers: [new BasemapLayer({
                url: $BaseServiceUrl+"影像服务/谷歌卫星_20160301_空港/ImageServer"
            })],
            id: "konggangMap",
            title: "空港影像图",
            thumbnailUrl: "assets/images/thumbnail-konggang.png"
        });
        basemaps.push(konggangMap);
        var streetMap = new Basemap({
            layers: [new BasemapLayer({
                url:$BaseServiceUrl+"20160301_海港/ImageServer"
            })],
            id: "StreetMap",
            title: "海港影像图",
            thumbnailUrl: "assets/images/thumbnail-haigang.png"
        });
        basemaps.push(streetMap);
        var waterBasemap = new Basemap({
            layers: [new BasemapLayer({
                url: $BaseServiceUrl+"kgmap/MapServer"
            })],
            title: "空港矢量图",
            thumbnailUrl: "assets/images/thumbnail-water.png"
        });
        basemaps.push(waterBasemap);
        var satelliteMap = new Basemap({
            layers: [new BasemapLayer({
                url: $BaseServiceUrl+"一张网/一张网企业项目动态图map/MapServer"
            })],
            id: "Satellite",
            title: "清色图",
            thumbnailUrl: "assets/images/thumbnail-onemap.jpg"
        });
        basemaps.push(satelliteMap);
        return basemaps;
    }

    function createMapToggle(){
        var BasemapToggle = esri.dijit.BasemapToggle;
        var toggle = new BasemapToggle({
            //theme: "basemapToggle",
            map: $Map ,
            visible: true,
            //basemap: "satellite"
            //basemaps:basemaps ,
            basemap: "kgmap"
        }, "BasemapToggle");
        toggle.startup();
    }

    function createMapGallery(baseMaps){
        var BasemapGallery = esri.dijit.BasemapGallery;
        var basemapGallery = new BasemapGallery({
            showArcGISBasemaps: false,  //是否显示ArcGIS自带basemap
            basemaps: baseMaps,
            map: $Map
        }, "basemapGallery");
        basemapGallery.startup();
    }

    function initMapEvent(){
        //$Map.on('mouse-move', showCoordinates);
        //$Map.on('mouse-drag', showCoordinates);
    }

    new Vue({
        el: '#sidepanel',
        data: {
            keyword: '空港' ,
            result: []
        },
        methods: {
            search: function () {
                var self = this;
                var FindParameters = esri.tasks.FindParameters ,
                    FindTask = esri.tasks.FindTask;

                var findTask = new FindTask($BaseServiceUrl+"一张网/一张网企业项目动态图map/MapServer");
                // FindTask的参数`
                var findParams = new FindParameters();
                // 返回Geometry
                findParams.returnGeometry = true;
                // 查询的图层id
                findParams.layerIds = [2];  //Layer: 雨水井 (0)   Layer: 建筑物 (1)   Layer: 项目 (2)
                // 查询字段
                findParams.searchFields = ["XMMC", "UNAME"];
                findParams.searchText = this.keyword;

                findTask.execute(findParams, function(result){
                    self.result = result;
                });
            }
        }
    });




})();


