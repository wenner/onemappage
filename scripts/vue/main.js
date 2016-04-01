vueExports.main={
    el:'#outerwrap' ,
    data:{
        sideExpanded:true ,

        menus:bottomBarMenus ,
        currentModal:null ,

        sideState:"list" ,
        showList: true ,
        showDetail: false ,
        currentQueryType:{text:"关键字" , value:"keyword"} ,
        queryTypes: [
            {text: "关键字", value: "keyword"},
            {text: "危险化学品", value: "danger"},
            {text: "排放口点位", value: "outfall"}
        ],
        sideLoading:false ,
        keyword:'石化' ,
        result:[] ,
        resultBulding:[],
        resultSort:[] ,
        currentSelectedCompany: {} ,

        currentCont: {} ,
        contentSelectedItem: null ,

        detailMenus: [
            {text:"基本信息" , code:"info" , icon:"fa-info-circle"} ,
            {text:"危险品" , code:"danger" , icon:"fa-bomb"} ,
            {text:"排放检测" , code:"discharge" , icon:"fa-pagelines"} ,
            {text:"生产工艺" , code:"processing" , icon:"fa-sun-o" , disabled:true} ,
            {text:"安全设施" , code:"safe" , icon:"fa-yelp" , disabled:true} ,
            {text:"其他1" , code:"other" , icon:"fa-empire" , disabled:true}
        ] ,
        currentDetailMenu: {}
    } ,
    watch: {
        currentDetailMenu: function(detailMenu){
            if (!this.currentSelectedCompany || !this.currentDetailMenu) return false;
            var code = detailMenu.code;
            code = code.substring(0,1).toUpperCase()+code.substring(1);
            if (this["get"+code+"Detail"]){
                this["get"+code+"Detail"].call(this , this.currentSelectedCompany);
            }
        }
    } ,
    methods: {
        //打开关闭侧边栏
        toggleSide:function(){
            this.sideExpanded= !this.sideExpanded;
        } ,
        openSide:function(){
            this.sideExpanded=true;
        } ,
        hideSide:function(){
            this.sideExpanded=false;
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
            var aa=[];
            //清除以前的图层
            searchGraphicsLayer.clear();
            // searchBuildingGraphicsLayer.clear();
            markLayer.clear();
            var self=this;
            self.sideLoading=true;
            var FindParameters=esri.tasks.FindParameters ,
                FindTask=esri.tasks.FindTask;

            var findTask=new FindTask($BaseServiceUrl+"一张网/一张网动态图/MapServer");
            // FindTask的参数`
            var findParams=new FindParameters();
            // 返回Geometry
            findParams.returnGeometry=true;
            // 查询的图层id
            //Layer: 密度点84 (0) 红线84分类点 (1) 泵站84 (2) 企业内部点位 (3) 供电管线84 (4) 路灯电缆84 (5) 燃气管线84 (6)
            // 污水管线84 (7) 雨水管线84 (8) 企业红线84 (9) 企业内部建筑物84 (10) 企业内部绿地84 (11)
            findParams.layerIds = [9];

            // 查询字段
            findParams.searchFields=["XMMC" , "UNAME"];
            if(this.keyword==''){
                console.log("this.keyword==''");
                findParams.searchText="空港";
            }else{
                console.log("this.keyword=="+this.keyword);
                findParams.searchText=this.keyword;
            }
            findTask.execute(findParams , function(result){
                self.sideLoading=false;
                self.result=result;
                self.sideState="list";
                self.addResultGraphic();
                for(var i=0; i<self.result.length; i++){
                    aa.push(i);
                }
            });
            this.resultSort=aa;
        } ,
        addResultGraphic:function(){
            //$Map.graphics.clear();
            this.clearGraphics();
            searchGraphicsLayer.clear();
            var scSymbol=new SimpleFillSymbol(
                SimpleFillSymbol.STYLE_SOLID ,
                new SimpleLineSymbol(
                    SimpleLineSymbol.STYLE_SOLID ,
                    new Color([102 , 102 , 255 , 0.55]) ,
                    1
                ) ,
                new Color([255 , 102 , 102 , 0.35])
            );
            var result=this.result;
            for(var i=0; i<result.length; i++){
                var item=result[i] ,
                    graphic=item.feature ,
                    symbol ,
                    infoTemplate=null;
                switch(graphic.geometry.type){
                    case "point":
                        symbol=$ptSymbol;
                        infoTemplate=new InfoTemplate("${ObjName}" , "${*}");
                        //infoTemplate.setTitle("<div class='xyfg_list_title'>" + "${ObjName}" + "</div>");
                        //var con = "<div class='xndw_con_bg'>\
                        //            <div class='xndw_info_over'>\
                        //            <p class='xndw_info_li'><a href='javascript:;'>1、名称：${ObjName}</a></p>\
                        //            <p class='xndw_info_li'><a href='javascript:;'>2、所属单位：${DeptName2}</a></p>  \
                        //            <p class='xndw_info_li'><a href='javascript:;'>3、性质分类：${SUBSID}</a></p>\
                        //            <p class='xndw_info_li'><a href='javascript:;'>4、井深：${BOTTOM_H}</a></p>\
                        //            <p class='xndw_info_li'><a href='javascript:;'>5、管顶高：${SURF_H}</a></p>\
                        //            <p class='xndw_info_li'><a href='javascript:;'>6、管底高：${B_DEEP} </a></p>\
                        //            </div></div>";
                        infoTemplate.setContent(con);
                        break;
                    case "polyline":
                        symbol=$lineSymbol;
                        infoTemplate=new esri.InfoTemplate("${ObjName}" , "${*}");
                        break;
                    case "polygon":
                        symbol=scSymbol;
                        //var fill = new SimpleFillSymbol("solid", null, new Color("#A4CE67"));
                        var fill=new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID ,
                            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID ,
                                new Color([255 , 255 , 255 , 0.15]) , 1) ,
                            new Color([153 , 204 , 204 , 0.25]));
                        infoTemplate=new InfoTemplate({fillSymbol:fill});
                        infoTemplate.setTitle("<div class='xyfg_list_title'>"+"${UNAME}"+"</div>");
                        var con="<div class='xndw_con_bg'>\
                                    <div class='xndw_info_over'>\
                                    <p class='xndw_info_li'><a href='javascript:;'>1、企业名称：${UNAME}</a></p>\
                                    <p class='xndw_info_li'><a href='javascript:;'>2、项目名称：${XMMC}</a></p>  \
                                    <p class='xndw_info_li'><a href='javascript:;'>3、规划状态：${GHZT}</a></p>\
                                    <p class='xndw_info_li'><a href='javascript:;'>4、性质：${XZ}</a></p>\
                                    <p class='xndw_info_li'><a href='javascript:;'>5、企业名：${企业名}</a></p>\
                                    <p class='xndw_info_li'><a href='javascript:;'>6、性质分类：${Zlbmc} </a></p>\
                                    </div></div>";
                        infoTemplate.setContent(con);
                        //添加标注ABCmark图标
                        var sExtent=graphic.geometry.getExtent();
                        var pt=new esri.geometry.Point(
                            (sExtent.xmin+sExtent.xmax)/2 ,
                            (sExtent.ymin+sExtent.ymax)/2 ,
                            new esri.SpatialReference($Map.spatialReference)
                        );
                        var pms = new esri.symbol.PictureMarkerSymbol("../onemappage/assets/images/location_icon/_"+i+".PNG",30,80);
                        var gImg = new Graphic(pt,pms);
                        markLayer.add(gImg);
                        break;
                }
                graphic.setSymbol(symbol);
                graphic.setInfoTemplate(infoTemplate);
                // 添加到graphics进行高亮显示
                //$Map.graphics.add(graphic);
                searchGraphicsLayer.add(graphic);
            }
        } ,
        showResultItem:function(item){
            var self = this;
            //this.clearGraphics();
            hightLightGraphicLayer.clear();
            this.currentSelectedCompany=item;
            //console.log("显示点击的Geometry");
            //console.log(this.currentSelectedCompany.feature.attributes.ID);

            //开始查询SQL危化品
            //this.QueryTextFromSQL();

            self.showList = false;
            self.showDetail= true;

            this.currentDetailMenu = this.detailMenus[0];


            var graphic=item.feature ,
                id=graphic.attributes.FID ,
                map=$Map;
            var polySymbol=new SimpleFillSymbol(
                SimpleFillSymbol.STYLE_SOLID ,
                new SimpleLineSymbol(
                    SimpleLineSymbol.STYLE_SOLID ,
                    new Color([255 , 0 , 0 , 1]) ,
                    3
                ) ,
                new Color([204 , 255 , 255 , 0.05])
            );

            var sGrapphic=graphic;
            var sGeometry=sGrapphic.geometry;
            // 当点击的名称对应的图形为点类型时进行地图中心定位显示
            if(sGeometry.type=="point"){
                var cPoint=new Point(sGeometry.x , sGeometry.y , new SpatialReference(map.spatialReference));
                //cPoint.x = sGeometry.x;
                //cPoint.y = sGeometry.y;
                map.infoWindow.hide();
                map.centerAt(cPoint);
                //map.centerAndZoom(cPoint, 10);   //将点平移到map正中 并 缩放到制定map级别
                //console.log("对应的类型是点,X/Y坐标：" + cPoint.x + "   " + cPoint.y);
                var p=map.toScreen(sGrapphic.geometry);
                var iw=map.infoWindow;
                iw.setTitle(sGrapphic.getTitle());
                iw.setContent(sGrapphic.getContent());
                iw.show(p , map.getInfoWindowAnchor(p));
            }
            //当点击的名称对应的图形为线或面类型时获取其范围进行放大显示
            else{
                var sExtent=sGeometry.getExtent();
                sExtent=sExtent.expand(2);
                map.setExtent(sExtent);
                //console.log("对应的类型是线或面,范围：" + JSON.stringify(sExtent));  //JSON.stringify(obj)  将obj json对象转换为string
                //var p = map.toScreen(sGrapphic.geometry);
                //var iw = map.infoWindow;
                //iw.show();
                //iw.setTitle(sGrapphic.getTitle());
                //iw.setContent(sGrapphic.getContent());
                //iw.show(p,map.getInfoWindowAnchor(p));
                //var loc = new esri.geometry.Point(
                //    (sExtent.xmin + sExtent.xmax) / 2,
                //    (sExtent.ymin + sExtent.ymax) / 2,
                //    new esri.SpatialReference(map.spatialReference)
                //);
                //var attr = sGrapphic.attributes;
                //var infoTemplate = new InfoTemplate("${UNAME}", "${XMMC}", "${企业名}");
                //var gc = new Graphic(loc, polygonSymbol, attr, infoTemplate);
                //var gc = new Graphic(loc, polygonSymbol, attr);
                //graphic.setSymbol(polySymbol);   //这样加入的graphic layer层clear()清除不掉
                var searGraphic=new Graphic(sGeometry , polySymbol);
                hightLightGraphicLayer.add(searGraphic);
            }
        } ,
        QueryTextFromSQL:function(){
            var self=this;
            setTimeout(function(){
                var rs = {
                    "ChsFields":[
                        {"title":"中文名称"} , {"title":"危险货物编号"} , {"title":"用途"} ,
                        {"title":"日常用量"} , {"title":"最大储存量"} , {"title":"储存位置"}
                    ] ,
                    "CommandCount":0 ,
                    "Commands":[] ,
                    "Data":[
                        ["硫酸" , "" , "其它" , "0.9kg/月" , "9kg" , ""] ,
                        ["盐酸" , "" , "其它" , "0.6kg/月" , "6kg" , ""] ,
                        ["石油醚" , "" , "其它" , "4kg/月" , "7kg" , ""] ,
                        ["异辛烷" , "" , "其它" , "2kg/月" , "7kg" , ""] ,
                        ["异丙醇" , "" , "其它" , "35kg/月" , "35kg" , ""] ,
                        ["环己烷" , "" , "其它" , "0.2kg/月" , "4kg" , "品控部化学品库"] ,
                        ["甲醇" , "" , "其它" , "0.4kg/月" , "8kg" , ""] ,
                        ["乙醇" , "" , "其它" , "5kg/月" , "10kg" , "品控部化学品库"] ,
                        ["丙酮" , "" , "其它" , "22kg/月" , "40kg" , "品控部化学品库"]
                    ] ,
                    "DataCount":6 ,
                    "EngFields":[
                        {"title":"ChemicalName"} ,
                        {"title":"ChemicalNum"} ,
                        {"title":"Usage"} ,
                        {"title":"DailyDosage"} ,
                        {"title":"MaximumStockingCapacity"} ,
                        {"title":"StorageSite"}
                    ] , "KeyField":null
                };
                self.currentCont= rs;
                var columns = [] ,
                    store = [];
                for(var i = 0 ; i<rs.EngFields.length ; i++){
                    var col = {} ,
                        key = rs.EngFields[i].title;
                    col = {code:key , text:rs.ChsFields[i].title};
                    columns.push(col);
                    for(var j = 0 ; j<rs.Data.length ; j++){
                        if (!store[j]) store[j] = {};
                        store[j][key] = rs.Data[j][i];
                    }
                }
                self.currentCont = {
                    columns: columns ,
                    store: store ,
                    firstShowFields: [
                        "ChemicalName" , "Usage" , "DailyDosage"
                    ]
                };
                console.log(self.currentCont);
            } , 200);

            return false;

            // console.log("进入ajax查询数据方法");
            //var name = $('#searchText').val();
            //var name = this.currentSelectedCompany.value;
            var name="中储粮油脂（天津）有限公司";
            var source='/AppWebSite/FMService/chemical';
            var field='ChemicalName,ChemicalNum,Usage,DailyDosage,MaximumStockingCapacity,StorageSite';
            var data={
                Fields:field.split(',') ,
                Search:'EnterpriseName = {0}' ,
                Values:[name] ,
                OrderFieldName:'RegistrationTime' ,
                OrderType:'desc'
            };
            var arg_map={
                data:data ,
                success:this.onSuccess ,
                fail:this.onFail ,
                url:source
            };
            tjx.data.safetysearch.getDataTable(arg_map);
        } ,
        myCustomFilterFunction: function(current , index , all){
           return $.inArray(current.code, this.currentCont.firstShowFields) >-1
        } ,
        selectContentItem: function(r){
            this.currentCont.selectedItem = r;
            console.log(r , this.currentCont.selectedItem , r == this.currentCont.selectedItem)
        } ,
        onSuccess:function(data){
            //this.currentSelectedCompany=data;
            //console.log(data);
            var resultHead=[];
            var resultCont;
            for(var i=0; i<data.ChsFields.length; i++){
                resultHead.push(data.ChsFields[i].title);
            }
            console.log(resultHead);  //表头信息
            resultHead=data.ChsFields;
            console.log(resultHead);
            for(var i=0; i<data.DataCount; i++){
                console.log(data.Data[i]);
                resultCont+=data.Data[i];
            }
            this.currentCont=JSON.stringify(data); //内容信息
        } ,
        onFail:function(data){
            console.log(data);
        } ,
        backToList:function(){
            var self = this;
            //self.sideAction = "toList";
            self.sideState="list";
            self.showDetail= false;
            self.showList = true;
            self.currentDetailMenu=null;
        } ,
        switchDetail: function(detailMenu){
            this.currentDetailMenu = detailMenu;
        } ,
        
        
        getInfoDetail: function(company){
            console.log(company)
        } ,
        getDangerDetail: function(company){
            this.QueryTextFromSQL();
        } ,
        getDischargeDetail: function(company){

        } ,

        clearGraphics:function(){
            //清除以前的currentSelectedCompany状态 以及清除所有高亮的graphic
            hightLightGraphicLayer.clear();  //为什么不清除图层呢
            dijitPopup.close(dialog);

        }
    }
};