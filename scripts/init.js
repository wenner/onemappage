(function(){
	var mapInited = false , modalInited = false;

    window.init = function(){
		loadModalHtml();
		initVue();
		createMap();
    };

	function createMap(){
	
        var InfoWindow = myInfoWindow ,
            Draw = esri.toolbars.Draw;

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


        //创建图形图层
        //把图层添加到地图上
        areaLayer=new GraphicsLayer();
        $Map.addLayer(areaLayer);
        plottingLayer = new GraphicsLayer();
        $Map.addLayer(plottingLayer);
        bufferLayer = new GraphicsLayer();
        $Map.addLayer(bufferLayer);
        alarmLayer = new GraphicsLayer();
        $Map.addLayer(alarmLayer);
        labelLayer=new GraphicsLayer();
        $Map.addLayer(labelLayer);

		setSymbolStyle();

        $Toolbar = new Draw($Map);
        $Toolbar.on("draw-end", addGraphic);

        var baseMaps = getBaseMaps();
        createMapToggle();
        createMapGallery(baseMaps);

        //initmapevent
        initMapEvent();

		mapInited = true;
		hideLoader();
	}

	function initVue(){
	    new Vue(vueExports.query);
		new Vue(vueExports.bottomBar);
	    new Vue(vueExports.mainWrap);
	}

	function loadModalHtml(){
		var modals = $(".dijitHidden div");
		var loadedCount = 0;
		modals.each(function(i , n){
			var modal = $(n);
			modalHref = modal.data("modalhref");
			modal.load(modalHref , function(){
				var modalExports = vueExports[modal.attr("id")];
				if (modalExports) new Vue(modalExports);
				loadedCount ++;
				if (loadedCount == modals.length){
					modalInited = true;
					hideLoader();
				}
			});
		});
		for(var i = 0 ; i<bottomBarMenus.length ;i++){
			
		}
	}


	function hideLoader(){
		if (mapInited && modalInited){
			$("#pageloader").hide();
		}
	}

	function setSymbolStyle(){		
        var SimpleMarkerSymbol = esri.symbol.SimpleMarkerSymbol ,
            SimpleLineSymbol = esri.symbol.SimpleLineSymbol ,
            SimpleFillSymbol =esri.symbol.SimpleFillSymbol ,
			CartographicLineSymbol = esri.symbol.CartographicLineSymbol ,
			PictureFillSymbol = esri.symbol.PictureFillSymbol ,
			Color = esri.Color ,
            Graphic = esri.Graphic;

        var markerSymbol  = $markerSymbol = new SimpleMarkerSymbol();
        markerSymbol.setPath("M50,2.125c26.441,0,47.875,21.434,47.875,47.875c0,26.441-21.434,47.875-47.875,47.875C17.857,97.875,2.125,76.441,2.125,50C2.125,23.559,23.559,2.125,50,2.125z'/><g class='icon'><path class='base' d='M50,19.53c13.945,0,25.248,11.213,25.248,25.045C75.248,60.437,54.207,80.47,50,80.47c-4.208,0-25.248-20.033-25.248-35.895C24.752,30.743,36.056,19.53,50,19.53z'/><path class='inner' d='M50,30.488c8.174,0,14.8,6.625,14.8,14.799c0,8.173-6.626,14.8-14.8,14.8s-14.8-6.626-14.8-14.799C35.2,37.114,41.826,30.488,50,30.488z");
        markerSymbol.setColor(new Color("red"));


        // lineSymbol used for freehand polyline, polyline and line.
        var lineSymbol = $lineSymbol = new CartographicLineSymbol(
            CartographicLineSymbol.STYLE_SOLID,
            new Color([255,0,0]), 10,
            CartographicLineSymbol.CAP_ROUND,
            CartographicLineSymbol.JOIN_MITER, 5
        );


        // fill symbol used for extent, polygon and freehand polygon, use a picture fill symbol
        // the images folder contains additional fill images, other options: sand.png, swamp.png or stiple.png
        var fillSymbol = $fillSymbol = new PictureFillSymbol(
            "../onemappage/assets/images/mangrove.png",
            new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,
                new Color('#000'),
                1
            ),
            60,
            60
        );


        //定义矢量显示样式
        var ptSymbol = $ptSymbol = new SimpleMarkerSymbol(
			SimpleMarkerSymbol.STYLE_SQUARE, 10, 
			new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, 
				new Color([204, 204, 204]), 1), 
				new Color([0, 255, 0, 0.25])
			);
        var lineSymbol2 = $lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, new Color([255, 0, 0]), 1);
        var polygonSymbol = $polygonSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NONE, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([204, 204, 204]), 2), new Color([255, 204, 204, 0.25]));
		

	}


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

    function addGraphic(evt) {
        $Toolbar.deactivate();
        $Map.enableMapNavigation();
        // figure out which symbol to use
        if ( evt.geometry.type === "point" || evt.geometry.type === "multipoint") {
            $CurrentSymbol = $markerSymbol;
        } else if ( evt.geometry.type === "line" || evt.geometry.type === "polyline") {
            $CurrentSymbol = $lineSymbol;
        }
        else {
            $CurrentSymbol = $fillSymbol;
        }
        $CurrentGraphic=new Graphic(evt.geometry , $CurrentSymbol);
        $Map.graphics.add($CurrentGraphic);
        //console.log($CurrentGraphic)
    }

    function initMapEvent(){
        $Map.on('mouse-move', showCoordinates);
        $Map.on('mouse-drag', showCoordinates);
    }

    function showCoordinates(evt) {

        var mp = evt.mapPoint;
        dojo.byId("XYinfo").innerHTML = "坐标：" + mp.x.toFixed(4) + " , " + mp.y.toFixed(4);  //toFiex(2) 限制小数点后显示的位数
    }
})();


