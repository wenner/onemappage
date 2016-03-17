require(["dojo/dom", "dojo/parser", "dijit/registry", "esri/config", "esri/sniff", 'dojo/on', "esri/map", "esri/layers/ArcGISTiledMapServiceLayer", "esri/layers/FeatureLayer", "esri/tasks/GeometryService", "esri/units", "esri/geometry/Extent", "esri/SpatialReference", "esri/InfoTemplate", "esri/graphic", "esri/layers/GraphicsLayer", "esri/toolbars/draw",
    "esri/symbols/PictureMarkerSymbol", "esri/renderers/SimpleRenderer", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol", "esri/Color", "esri/dijit/editing/Editor", "esri/dijit/Print", "esri/dijit/AttributeInspector", "esri/tasks/QueryTask", "esri/tasks/query", "dojo/query", "dojo/_base/array", "dojo/data/ItemFileReadStore",
     "esri/geometry/Polygon", "esri/geometry/Point", "dijit/form/CheckBox", "dojo/keys", "dijit/ToolbarSeparator", "esri/dijit/HomeButton", "esri/dijit/LocateButton", "esri/dijit/OverviewMap", "esri/dijit/Scalebar", "esri/SnappingManager", "esri/dijit/Measurement",
     "dojox/grid/DataGrid", "dijit/TitlePane", "dijit/form/Button", "dijit/layout/BorderContainer", "dijit/layout/ContentPane", "dijit/layout/AccordionContainer", "dojo/domReady!"],
      function (dom, parser, registry, esriConfig, has, on, Map, ArcGISTiledMapServiceLayer, FeatureLayer, GeometryService, Units, Extent, SpatialReference, InfoTemplate, Graphic, GraphicsLayer, Draw,
                PictureMarkerSymbol, SimpleRenderer, SimpleLineSymbol, SimpleFillSymbol, Color, Editor, Print, AttributeInspector, QueryTask, QueryT, query, array, ItemFileReadStore,
                Polygon, Point, CheckBox, keys, ToolbarSeparator, HomeButton, LocateButton, OverviewMap, Scalebar, SnappingManager, Measurement) {
          parser.parse();
          //var extent = new Extent(-95.271, 38.933, -95.228, 38.976, new SpatialReference({ wkid: 4326 }));
          var map = new Map("map", {
              //center: [-117.535, 34.28],
              //extent:extent,
              zoom: 3,
              maxZoom: 10, //最大缩放层级
              minZoom: 2,//最小缩放层级
              logo: false
          });

          var home = new HomeButton({
              map: map
          }, "HomeButton");
          home.startup();

          //定位
          geoLocate = new LocateButton({
              map: map
          }, "LocateButton");
          geoLocate.startup();

          var overviewMapDijit = new OverviewMap({
              map: map,  //必要的
              attachTo: "bottom-right", //放置位置
              color: "#D84E13", //设置颜色
              opacity: .40,  //透明度
              visible: true,  //初始化不可见
              width: 250,  //默认值是地图高度的 1/4th
              height: 210,  // 默认值是地图高度的 1/4th
              //maximizeButton:true,   // 最大化,最小化按钮，默认false
              expandFactor: 1.5 //概览地图和总览图上显示的程度矩形的大小之间的比例。默认值是2，这意味着概览地图将至少是两倍的大小的程度矩形。
          });
          overviewMapDijit.startup();

          var scalebar = new Scalebar({
              map: map,
              // "dual" displays both miles and kilmometers
              // "english" is the default, which displays miles
              // use "metric" for kilometers
              scalebarUnit: "metric",
              attachTo: "bottom-left",
          });

          var agoServiceURL = "http://60.29.110.104:6080/arcgis/rest/services/外业点位图map20151207/MapServer";
          //var agoLayer = new ArcGISTiledMapServiceLayer(agoServiceURL, { displayLevels: [0, 1, 2, 3, 4, 5, 6, 7] });
          var agoLayer = new ArcGISTiledMapServiceLayer(agoServiceURL);
          map.addLayer(agoLayer);

          map.on("layers-add-result", initEditor);

          var baseUrl = "http://60.29.110.104:6080/arcgis/rest/services/FeatureMap20151208/FeatureServer/"; //此图层只有0层
          var pointsOfInterest = new FeatureLayer(baseUrl + "0", {
              mode: FeatureLayer.MODE_ONDEMAND,
              outFields: ['*']
          });
          var WildfireLine = new FeatureLayer(baseUrl + "1", {
              mode: FeatureLayer.MODE_ONDEMAND,
              outFields: ['*']
          });
          var evacuationPerimeter = new FeatureLayer(baseUrl + "2", {
              mode: FeatureLayer.MODE_ONDEMAND,
              outFields: ['*']
          });

          //map.addLayers([pointsOfInterest, WildfireLine, evacuationPerimeter]);
          map.addLayers([pointsOfInterest, WildfireLine, evacuationPerimeter]);
          var sfs = new SimpleFillSymbol(
              "solid",
              new SimpleLineSymbol("solid", new Color([195, 176, 23]), 2),
              null
          );

          //MeasureWidget
          //esriConfig.defaults.io.proxyUrl = "proxy.ashx";
          //esriConfig.defaults.io.alwaysUseProxy = false;
          //esriConfig.defaults.geometryService = new GeometryService("http://60.29.110.104:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer");
          var parcelsLayer = new FeatureLayer("http://60.29.110.104:6080/arcgis/rest/services/FeatureMap20151208/FeatureServer/0", {
              mode: FeatureLayer.MODE_ONDEMAND,
              outFields: ["*"]
          });
          parcelsLayer.setRenderer(new SimpleRenderer(sfs));
          map.addLayers([parcelsLayer]);
          //dojo.keys.copyKey maps to CTRL on windows and Cmd on Mac., but has wrong code for Chrome on Mac
          var snapManager = map.enableSnapping({
              snapKey: has("mac") ? keys.META : keys.CTRL
          });
          var layerInfos = [{
              layer: parcelsLayer
          }];
          snapManager.setLayerInfos(layerInfos);

          var measurement = new Measurement({
              map: map,
              defaultPositionUnit: Units.METERS,
              defaultAreaUnit: Units.SQUARE_METERS,
              defaultLengthUnit: Units.METERS
          }, dom.byId("measurementDiv"));
          measurement.startup();

          //MeasureWidget End
          // close the info window when esc is pressed
          map.on("key-down", function (e) {
              if (e.keyCode === 27) {
                  //measurement.clearResult();
                  //measurement.destroy();
                  //measurement.startup();
              }
          });
          //on(dom.byId("execute"), "click", execute);  //执行示例
          function initEditor(evt) {
              //build the layer and field information for the layer, display the description field
              //using a text area.
              var layers = array.map(evt.layers, function (result) {
                  var fieldInfos = array.map(result.layer.fields, function (field) {
                      if (field.name === 'description') {
                          return {
                              'fieldName': field.name,
                              'label': 'Details',
                              stringFieldOption: AttributeInspector.STRING_FIELD_OPTION_TEXTAREA
                          }
                      }
                      else {
                          return { 'fieldName': field.name, 'lable': field.alias }
                      }
                  });
                  return { featureLayer: result.layer, 'fieldInfos': fieldInfos }
              });

              var settings = {
                  map: map,
                  enableUndoRedo: true,
                  layerInfos: layers,
                  toolbarVisible: true,
                  createOptions: {
                      polygonDrawTools: [
                        Editor.CREATE_TOOL_FREEHAND_POLYGON,
                        Editor.CREATE_TOOL_AUTOCOMPLETE
                      ]
                  },
                  toolbarOptions: {
                      reshapeVisible: true,
                      cutVisible: true,
                      mergeVisible: true
                  }
              };
              var params = { settings: settings };

              editorWidget = new Editor(params, 'editorDiv');

              //Dojo.keys.copyKey maps to CTRL in Windows and CMD in Mac
              map.enableSnapping({ snapKey: keys.copyKey });

              //create a new checkbox to enable/disable snapping
              var checkBox = new CheckBox({
                  name: "chkSnapping",
                  checked: true,
                  id: "chkSnapping",
                  label: "Snapping",
                  showLabel: "false",
                  title: "捕捉",
                  onChange: function (evt) {
                      if (this.checked) {
                          map.enableSnapping({ snapKey: keys.copyKey });
                      } else {
                          map.disableSnapping();
                      }
                  }
              });


              //add the snapping checkbox to the editor's toolbar 
              var myToolbarElement = query(".esriDrawingToolbar", editorWidget.domNode)[0];
              var myToolbar = registry.byId(myToolbarElement.id);

              myToolbar.addChild(new ToolbarSeparator());
              myToolbar.addChild(checkBox);

              editorWidget.startup();

              //listen for the template pickers onSelectionChange and disable
              //the snapping checkbox when a template is selected
              var templatePickerElement = query(".esriTemplatePicker", editorWidget.domNode)[0];
              var templatePicker = registry.byId(templatePickerElement.id);
              templatePicker.on("selection-change", function () {
                  if (templatePicker.getSelected()) {
                      registry.byId('chkSnapping').set("disabled", true);
                  } else {
                      registry.byId('chkSnapping').set("disabled", false);
                  }
              });
              map.infoWindow.resize(325, 200);
          }
          ////////////////////////////////////////////////////////--------右侧功能区---------///////////////////////////////////////////////////////////////////////////


          var tb = new Draw(map);
          tb.on("draw-end", addGraphic);
          //on(dom.byId("btnAll"), "click", addGraphic);
          registry.forEach(function (d) {
              if (d.declaredClass == "dijit.form.Button") {
                  d.on("click", activateTool);
              }
          });
          //设置快捷键
          //显示地图坐标
          map.on('mouse-move', showCoordinates);
          map.on('mouse-drag', showCoordinates);
          //显示地图坐标
          function showCoordinates(evt) {
              var mp = evt.mapPoint;
              dojo.byId("XYinfo").innerHTML = "坐标：" + mp.x.toFixed(4) + " , " + mp.y.toFixed(4);  //toFiex(2) 限制小数点后显示的位数
          }
          map.on("key-down", function (e) {
              if (e.keyCode == 27) {
                  remove();
              } else if (e.keyCode == 83) {
                  on(dom.byId("btnTS"), "click-down", activateTool);
              }
          });
          //Listen for row clicks in the dojo table
          gridWidget.on("RowClick", onTableRowClick);
          //Populate table with headers
          setGridHeader();
          var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.5]));
          var pntSym1 = new PictureMarkerSymbol("images/CircleBlue16.png", 16, 16);
          var pntSym2 = new PictureMarkerSymbol("images/CircleBlue24.png", 18, 18);
          var pntSym3 = new PictureMarkerSymbol("images/CircleRed32.png", 25, 25);

          // 初始化查询任务与查询参数
          var queryTask = new QueryTask("http://60.29.110.104:6080/arcgis/rest/services/FeatureMap20151208/FeatureServer/0");
          queryTask.on("complete", showResult);
          var query = new QueryT();
          query.returnGeometry = true;
          query.outFields = ["OBJECTID", "TYPE", "CID", "NUM", "MONTH"];

          function activateTool() {
              var tool = null;
              if (this.label == "清空") {
                  remove();
              } else {
                  switch (this.label) {
                      case "全区范围":
                          remove();
                          //tool = "POLYGON";
                          addGraphicALL();
                          break;
                      case "徒手":
                          remove();
                          tool = "FREEHAND_POLYGON";
                          break;
                  }
                  tb.activate(Draw[tool]);
                  //map.hideZoomSlider();
              }
          }
          function setGridHeader() {
              var layout = [
                  //{ field: 'OBJECTID', name: '标识ID', width: "50px", headerStyles: "text-align:center;" },
                  { field: 'TYPE', name: '类型', width: "48px", headerStyles: "text-align:center;" },
                  { field: 'CID', name: '编码', width: "48px", headerStyles: "text-align:center;" },
                  { field: 'NUM', name: '数量', width: "48px", headerStyles: "text-align:center;" },
                  { field: 'MONTH', name: '月份', width: "48px", headerStyles: "text-align:center;" }
              ];
              gridWidget.setStructure(layout);
          }
          //Draw a dojox table using an array as input
          function drawTable(features) {
              var items = []; //all items to be stored in data store
              //items = dojo.map(features, function(feature) {return feature.attributes});
              items = array.map(features, "return item.attributes");
              //Create data object to be used in store
              var data = {
                  identifier: "OBJECTID",  //This field needs to have unique values
                  label: "OBJECTID", //Name field for display. Not pertinent to a grid but may be used elsewhere.
                  items: items
              };
              var store = new ItemFileReadStore({ data: data });

              gridWidget.setStore(store);
              gridWidget.setQuery({ OBJECTID: '*' });
          }
          function addGraphicALL() {
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
              var handgraphic = new Graphic(polygon, symbol);
              //map.graphics.add(handgraphic);//不显示画出来的线
              query.geometry = handgraphic.geometry;
              queryTask.execute(query);
          }
          //Set drawing properties and add polygon to map
          function addGraphic(geometry) {
              var handgraphic = new Graphic(geometry, symbol);
              map.graphics.add(handgraphic);

              // 改变信息窗口的大小
              //map.infoWindow.resize(325, 200);

              // 将用户绘制的几何对象传入查询参数
              query.geometry = handgraphic.geometry;
              queryTask.execute(query);
          }

          var evtResult;  //用于临时保存空间查询出来的数据，以便后续二次操作
          function showResult(evt) {
              var resultFeatures = evt.featureSet.features;
              evtResult = resultFeatures;
              for (var i = 0, il = resultFeatures.length; i < il; i++) {
                  var graphic = resultFeatures[i];

                  //Assign a symbol sized based on populuation
                  setTheSymbol(graphic);

                  //graphic.setInfoTemplate(resultTemplate);
                  map.graphics.add(graphic);
              }

              var total = sumPopulation(evt.featureSet);

              //var r = "<i>" + totalPopulation + "</i>";
              var r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, Other;
              var s = total.split(',');
              r1 = s[0];
              r2 = s[1];
              r3 = s[2];
              r4 = s[3];
              r5 = s[4];
              r6 = s[5];
              r7 = s[6];
              r8 = s[7];
              r9 = s[8];
              r10 = s[9];
              r11 = s[10];
              r12 = s[11];
              Other = s[12];

              document.getElementById('totalPopulation').innerHTML = resultFeatures.length;
              document.getElementById('Span1').innerHTML = r1;
              document.getElementById("Span2").innerHTML = r2;
              document.getElementById('Span3').innerHTML = r3;
              document.getElementById('Span4').innerHTML = r4;
              document.getElementById('Span5').innerHTML = r5;
              document.getElementById('Span6').innerHTML = r6;
              document.getElementById('Span7').innerHTML = r7;
              document.getElementById('Span8').innerHTML = r8;
              document.getElementById('Span9').innerHTML = r9;
              document.getElementById('Span10').innerHTML = r10;
              document.getElementById('Span11').innerHTML = r11;
              document.getElementById('Span12').innerHTML = r12;
              document.getElementById('Other').innerHTML = Other;
              drawTable(resultFeatures);

              tb.deactivate();
              //map.showZoomSlider();
          }

          registry.forEach(function (d) {
              if (d.declaredClass == "dijit.form.Button") {
                  d.on("click", CheckMonth);
              }
          });
          function CheckMonth() {
              var tool = null;
              switch (this.label) {
                  case "1月":
                      removeTable();
                      showResultMon(evtResult,1);
                      break;
                  case "2月":
                      removeTable();
                      showResultMon(evtResult, 2);
                      break;
                  case "3月":
                      showResultMon(evtResult, 3);
                      break;
                  case "4月":
                      showResultMon(evtResult, 4);
                      break;
                  case "5月":
                      showResultMon(evtResult, 5);
                      break;
                  case "6月":
                      showResultMon(evtResult, 6);
                      break;
                  case "7月":
                      showResultMon(evtResult, 7);
                      break;
                  case "8月":
                      showResultMon(evtResult, 8);
                      break;
                  case "9月":
                      showResultMon(evtResult, 9);
                      break;
                  case "10月":
                      showResultMon(evtResult, 10);
                      break;
                  case "11月":
                      showResultMon(evtResult, 11);
                      break;
                  case "12月":
                      showResultMon(evtResult, 12);
                      break;
              }
          }

          function showResultMon(evtResult, MonNum) {
              //var resultFeatures = evt.featureSet.features;
              var resultFeaturesMon = [];
              var j = 0;
              var t0=0,t1 = 0, t2 = 0, t3 = 0, t4 = 0, t5 = 0, t6 = 0, t7 = 0;
              for (var i = 0, il = evtResult.length; i < il; i++) {
                  if (evtResult[i].attributes['MONTH'][0] == String(MonNum)) {
                      //var graphic = resultFeatures[i];
                      //Assign a symbol sized based on populuation
                      //setTheSymbol(graphic);
                      //graphic.setInfoTemplate(resultTemplate);
                      //map.graphics.add(graphic);
                      //resultFeatures.add(evtResult[i]);
                      resultFeaturesMon[j++] = evtResult[i];
                      switch (parseInt(evtResult[i].attributes['TYPE'][0])) {
                          case 0:
                              t0 += 1;
                              break;
                          case 1:
                              t1 += 1;
                              break;
                          case 2:
                              t2 += 1;
                              break;
                          case 3:
                              t3 += 1;
                              break;
                          case 4:
                              t4 += 1;
                              break;
                          case 5:
                              t5 += 1;
                              break;
                          case 6:
                              t6 += 1;
                              break;
                          case 7:
                              t7 += 1;
                              break;
                          default :
                              break;
                      }
                  }
              }
              
              document.getElementById('type0').innerHTML = "   "+t0+"个";
              document.getElementById('type1').innerHTML = "   " + t1 + "个";
              document.getElementById('type2').innerHTML = "   " + t2 + "个";
              document.getElementById('type3').innerHTML = "   " + t3 + "个";
              document.getElementById('type4').innerHTML = "   " + t4 + "个";
              document.getElementById('type5').innerHTML = "   " + t5 + "个";
              document.getElementById('type6').innerHTML = "   " + t6 + "个";
              document.getElementById('type7').innerHTML = "   " + t7 + "个";
              drawTable(resultFeaturesMon);
          }
          //Set the symbol based on population
          function setTheSymbol(graphic) {
              if (graphic.attributes['NUM'] < 2) {
                  return graphic.setSymbol(pntSym1);
              }
              else if (graphic.attributes['NUM'] < 4) {
                  return graphic.setSymbol(pntSym1);
              }
              else {
                  return graphic.setSymbol(pntSym1);
              }
          }
          //calculate the total using a featureSet
          function sumPopulation(fset) {
              var features = fset.features;
              var Month1 = 0, Month2 = 0, Month3 = 0, Month4 = 0, Month5 = 0, Month6 = 0, Month7 = 0, Month8 = 0, Month9 = 0, Month10 = 0, Month11 = 0, Month12 = 0, Other = 0;
              for (var x = 0; x < features.length; x++) {
                  switch (Number(features[x].attributes['MONTH'])) {
                      case 1:
                          Month1 += 1;
                          break;
                      case 2:
                          Month2 += 1;
                          break;
                      case 3:
                          Month3 += 1;
                          break;
                      case 4:
                          Month4 += 1;
                          break;
                      case 5:
                          Month5 += 1;
                          break;
                      case 6:
                          Month6 += 1;
                          break;
                      case 7:
                          Month7 += 1;
                          break;
                      case 8:
                          Month8 += 1;
                          break;
                      case 9:
                          Month9 += 1;
                          break;
                      case 10:
                          Month10 += 1;
                          break;
                      case 11:
                          Month11 += 1;
                          break;
                      case 12:
                          Month12 += 1;
                          break;
                      default:
                          Other += 1;
                  }
              }
              return Month1 + "," + Month2 + "," + Month3 + "," + Month4 + "," + Month5 + "," + Month6 + "," + Month7 + "," + Month8 + "," + Month9 + "," + Month10 + "," + Month11 + "," + Month12 + "," + Other;
          }


          //创建临时图形图层,为Table点击生成临时高亮点，容易清理
          var TempLayer = new GraphicsLayer();
          map.addLayer(TempLayer, 2);

          //On row click
          function onTableRowClick(evt) {
              var clickedId = gridWidget.getItem(evt.rowIndex).OBJECTID;
              var graphic;
              for (var i = 0, il = map.graphics.graphics.length; i < il; i++) {
                  var currentGraphic = map.graphics.graphics[i];
                  if ((currentGraphic.attributes) && currentGraphic.attributes.OBJECTID == clickedId) {
                      graphic = currentGraphic;
                      break;
                  }
              }

              var p = map.toScreen(graphic.geometry);
              //var iw = map.infoWindow;
              //iw.setTitle(graphic.getTitle());
              //iw.setContent(graphic.getContent());
              //iw.show(p, map.getInfoWindowAnchor(p));
              setMapCenter(graphic, 8);

              TempLayer.clear();
              var loc = new Point(graphic.geometry.x, graphic.geometry.y, new SpatialReference(map.spatialReference));
              var attr = currentGraphic.attributes;
              //var infoTemplate = new InfoTemplate("${TYPE}", "${CID}", "${NUM}");
              //var gc = new Graphic(loc, pntSym3, attr, infoTemplate);
              var gc = new Graphic(loc, pntSym3, attr);
              TempLayer.add(gc);
              gc.setSymbol(pntSym3);
          }
          //将点平移到map正中 (并 缩放到指定map级别)
          function setMapCenter(graphic, level) {
              var location = new esri.geometry.Point(graphic.geometry.x, graphic.geometry.y, map.spatialReference)  //evt.mapPoint.y-5000 将y值向上提高5000m
              map.centerAndZoom(location, level);   //将点平移到map正中 并 缩放到制定map级别
              //map.centerAt(location);  //将点平移到map正中
          }
          function remove() {
              //clear all graphics from map
              map.graphics.clear();
              TempLayer.clear();
              map.infoWindow.hide();
              //Reset the divs to display 0
              
              dojo.byId('Span1').innerHTML = "";
              dojo.byId('Span2').innerHTML = "";
              dojo.byId('Span3').innerHTML = "";
              dojo.byId('Span4').innerHTML = "";
              dojo.byId('Span5').innerHTML = "";
              dojo.byId('Span6').innerHTML = "";
              dojo.byId('Span7').innerHTML = "";
              dojo.byId('Span8').innerHTML = "";
              dojo.byId('Span9').innerHTML = "";
              dojo.byId('Span10').innerHTML = "";
              dojo.byId('Span11').innerHTML = "";
              dojo.byId('Span12').innerHTML = "";
              dojo.byId('totalPopulation').innerHTML = "";
              dojo.byId('Other').innerHTML = "";
              document.getElementById('type0').innerHTML = "";
              document.getElementById('type1').innerHTML = "";
              document.getElementById('type2').innerHTML = "";
              document.getElementById('type3').innerHTML = "";
              document.getElementById('type4').innerHTML = "";
              document.getElementById('type5').innerHTML = "";
              document.getElementById('type6').innerHTML = "";
              document.getElementById('type7').innerHTML = "";
              drawTable();
          }
          function removeTable() {
              TempLayer.clear();
              drawTable();
          }

      });