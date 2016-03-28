vueExports.main={
    el:'#outerwrap' ,
    data:{
        sideExpanded:false ,

        menus:bottomBarMenus ,
        currentModal:null ,

        sideState:"list" ,
        currentQueryType: {text:"关键字" , value:"keyword"} ,
        queryTypes: [
            {text:"关键字" , value:"keyword"} ,
            {text:"病害类别" , value:"disease"} ,
            {text:"危险品" , value:"danger"}
        ] ,
        sideLoading: false ,
        keyword:'空港' ,
        result:[] ,
        currentItem: null
    } ,
    methods:{
        //打开关闭侧边栏
        toggleSide:function(){
            this.sideExpanded= !this.sideExpanded;
        } ,
        openSide: function(){
            this.sideExpanded = true;
        } ,
        hideSide: function(){
            this.sideExpanded = false;
        } ,

        //底部菜单打开对应的modal
        openModal:function(menu){
            var self=this ,
                registry=dojoRegistry;
            if(self.currentModal) self.currentModal.hide();

            var modal=registry.byId(menu.modal);
            if(!modal) return;
            self.currentModal=modal;
            modal.show();

            /*
             BootstrapDialog.show({
             message: 'Hi Apple!' ,
             backdrop: false ,
             closeByBackdrop: false ,
             draggable: true
             });
             */
            $("#"+menu.modal).tab();

        } ,

        search:function(){
            var self=this;

            self.sideLoading = true;
            var FindParameters=esri.tasks.FindParameters ,
                FindTask=esri.tasks.FindTask;

            var findTask=new FindTask($BaseServiceUrl+"一张网/一张网企业项目动态图map/MapServer");
            // FindTask的参数`
            var findParams=new FindParameters();
            // 返回Geometry
            findParams.returnGeometry=true;
            // 查询的图层id
            findParams.layerIds=[2];  //Layer: 雨水井 (0)   Layer: 建筑物 (1)   Layer: 项目 (2)
            // 查询字段
            findParams.searchFields=["XMMC" , "UNAME"];
            findParams.searchText=this.keyword;

            findTask.execute(findParams , function(result){
                self.sideLoading = false;
                self.result=result;
                self.sideState = "list";
                self.addResultGraphic();
            });
        } ,
        addResultGraphic: function(){
            $Map.graphics.clear();

            var result = this.result;
            for(var i = 0; i<result.length ;i++){
                var item = result[i] ,
                    graphic = item.feature ,
                    symbol ,
                    infoTemplate;
                switch (graphic.geometry.type) {
                    case "point":
                        symbol = $ptSymbol;
                        //infoTemplate = new InfoTemplate("${ObjName}", "${*}");
                        infoTemplate = new esri.InfoTemplate();
                        infoTemplate.setTitle("<div class='xyfg_list_title'>" + "${ObjName}" + "</div>");
                        var con = "<div class='xndw_con_bg'>\
                                    <div class='xndw_info_over'>\
                                    <p class='xndw_info_li'><a href='javascript:;'>1、名称：${ObjName}</a></p>\
                                    <p class='xndw_info_li'><a href='javascript:;'>2、所属单位：${DeptName2}</a></p>  \
                                    <p class='xndw_info_li'><a href='javascript:;'>3、性质分类：${SUBSID}</a></p>\
                                    <p class='xndw_info_li'><a href='javascript:;'>4、井深：${BOTTOM_H}</a></p>\
                                    <p class='xndw_info_li'><a href='javascript:;'>5、管顶高：${SURF_H}</a></p>\
                                    <p class='xndw_info_li'><a href='javascript:;'>6、管底高：${B_DEEP} </a></p>\
                                    </div></div>";
                        infoTemplate.setContent(con);
                        break;
                    case "polyline":
                        symbol = $lineSymbol;
                        infoTemplate = new esri.InfoTemplate("${ObjName}", "${*}");
                        break;
                    case "polygon":
                        symbol = $polygonSymbol;
                        var fill = new SimpleFillSymbol("solid", null, new Color("#A4CE67"));
                        infoTemplate = new esri.InfoTemplate({fillSymbol: fill});
                        infoTemplate.setTitle("<div class='xyfg_list_title'>" + "${UNAME}" + "</div>");
                        var con = "<div class='xndw_con_bg'>\
                                    <div class='xndw_info_over'>\
                                    <p class='xndw_info_li'><a href='javascript:;'>1、企业名称：${UNAME}</a></p>\
                                    <p class='xndw_info_li'><a href='javascript:;'>2、项目名称：${XMMC}</a></p>  \
                                    <p class='xndw_info_li'><a href='javascript:;'>3、规划状态：${GHZT}</a></p>\
                                    <p class='xndw_info_li'><a href='javascript:;'>4、性质：${XZ}</a></p>\
                                    <p class='xndw_info_li'><a href='javascript:;'>5、企业名：${企业名}</a></p>\
                                    <p class='xndw_info_li'><a href='javascript:;'>6、性质分类：${Zlbmc} </a></p>\
                                    </div></div>";
                        infoTemplate.setContent(con);
                        break;
                }
                graphic.setSymbol(symbol);
                graphic.setInfoTemplate(infoTemplate);

                // 添加到graphics进行高亮显示
                $Map.graphics.add(graphic);
            }
        } ,

        showResultItem: function(item){
            //清楚以前的currentItem状态


            this.currentItem = item;
            this.sideState = "detail";
            //读取选中的item的内容;

            //companyInfo = json;

            var graphic = item.feature ,
                id = graphic.attributes.FID ,
                map = $Map;
            var sGrapphic = graphic;
            var sGeometry = sGrapphic.geometry;
            // 当点击的名称对应的图形为点类型时进行地图中心定位显示
            if (sGeometry.type == "point") {
                var cPoint = new Point(sGeometry.x, sGeometry.y, new SpatialReference(map.spatialReference));
                //cPoint.x = sGeometry.x;
                //cPoint.y = sGeometry.y;
                map.infoWindow.hide();
                map.centerAt(cPoint);
                //map.centerAndZoom(cPoint, 10);   //将点平移到map正中 并 缩放到制定map级别
                console.log("对应的类型是点,X/Y坐标：" + cPoint.x + "   " + cPoint.y);
                var p = map.toScreen(sGrapphic.geometry);
                var iw = map.infoWindow;
                iw.setTitle(sGrapphic.getTitle());
                iw.setContent(sGrapphic.getContent());
                iw.show(p, map.getInfoWindowAnchor(p));
            }
            //当点击的名称对应的图形为线或面类型时获取其范围进行放大显示
            else {
                var sExtent = sGeometry.getExtent();
                sExtent = sExtent.expand(2);
                map.setExtent(sExtent);
                console.log("对应的类型是线或面,范围：" + JSON.stringify(sExtent));  //JSON.stringify(obj)  将obj json对象转换为string
                var p = map.toScreen(sGrapphic.geometry);
                var iw = map.infoWindow;
                iw.show();
                //iw.setTitle(sGrapphic.getTitle());
                //iw.setContent(sGrapphic.getContent());
                //iw.show(p,map.getInfoWindowAnchor(p));

                var loc = new esri.geometry.Point(
                    (sExtent.xmin + sExtent.xmax) / 2,
                    (sExtent.ymin + sExtent.ymax) / 2,
                    new esri.SpatialReference(map.spatialReference)
                );
                var attr = sGrapphic.attributes;
                console.log(loc.x + "   " + loc.y + "    其中最小X：" + sExtent.xmin + "   最大X:" + sExtent.xmax)
                //var infoTemplate = new InfoTemplate("${UNAME}", "${XMMC}", "${企业名}");
                //var gc = new Graphic(loc, polygonSymbol, attr, infoTemplate);
                //var gc = new Graphic(loc, polygonSymbol, attr);
                //TempLayer.add(gc);
                //gc.setSymbol(polygonSymbol);
            }
        } ,

        backToList: function(){
            this.sideState = "list";
        }
    }
};