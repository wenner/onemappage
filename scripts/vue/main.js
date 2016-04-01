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

        detailMenus: [
            {text:"基本信息" , code:"info" , icon:"fa-info-circle"} ,
            {text:"危险品" , code:"danger" , icon:"fa-bomb"} ,
            {text:"排放检测" , code:"discharge" , icon:"fa-pagelines"} ,
            {text:"生产工艺" , code:"processing" , icon:"fa-sun-o" , disabled:true} ,
            {text:"安全设施" , code:"safe" , icon:"fa-yelp" , disabled:true} ,
            {text:"其他1" , code:"other" , icon:"fa-empire" , disabled:true}
        ] ,
        currentDetailMenu: {} ,

        //企业明细数据
        companyDangerData: null ,
        companyDangerSelectedItem: {} ,
        companyDischargeData: []
    } ,
    watch: {
        currentDetailMenu: function(detailMenu){
            if (!this.currentSelectedCompany || !this.currentDetailMenu) return false;
            var code = detailMenu.code;
            code = code.substring(0,1).toUpperCase()+code.substring(1);
            console.log(code)
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

            // findParams.layerIds=[10];
            // findParams.searchFields=["XMMC" , "UNAME"];
            // if(this.keyword==''){
            //     console.log("this.keyword==''");
            //     findParams.searchText="空港";
            // }else{
            //     console.log("this.keyword=="+this.keyword);
            //     findParams.searchText=this.keyword;
            // }
            // findTask.execute(findParams , function(resultBulding){
            //     //self.sideLoading=false;
            //     self.resultBulding=resultBulding;
                //self.sideState="list";
                // self.addResultGraphicBuilding();
            // });
        } ,
        addResultGraphic:function(){
            //$Map.graphics.clear();
            this.clearGraphics();
            searchGraphicsLayer.clear();
            var scSymbol=new SimpleFillSymbol(
                SimpleFillSymbol.STYLE_SOLID ,
                new SimpleLineSymbol(
                    SimpleLineSymbol.STYLE_SOLID ,
                    new Color([164 , 164 , 164 , 0.75]) ,
                    2
                ) ,
                new Color([196 , 246 , 252 , 0.05])
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
                        var pms=new esri.symbol.PictureMarkerSymbol("../onemappage/assets/images/location_icon/0.PNG" , 30 , 40);
                        var gImg=new Graphic(pt , pms);
                        var pms = new esri.symbol.PictureMarkerSymbol("../onemappage/assets/images/location_icon/"+i+".PNG",30,40);
                        var gImg = new Graphic(pt,pms);
                        markLayer.add(gImg);
                        break;
                }                graphic.setSymbol(symbol);
                graphic.setInfoTemplate(infoTemplate);
                // 添加到graphics进行高亮显示
                //$Map.graphics.add(graphic);
                searchGraphicsLayer.add(graphic);
            }
        } ,
/*        addResultGraphicBuilding:function(){
            //$Map.graphics.clear();
            //this.clearGraphics();
            //searchGraphicsLayer.clear();
            var scSymbol=new SimpleFillSymbol(
                SimpleFillSymbol.STYLE_SOLID ,
                new SimpleLineSymbol(
                    SimpleLineSymbol.STYLE_SOLID ,
                    new Color([102 , 0 , 255 , 0.95]) ,
                    2
                ) ,
                new Color([119 , 119 , 119 , 0.85])
            );
            var result=this.resultBulding;
            for(var i=0; i<result.length; i++){
                console.log(" var result=this.resultBulding; "+i);
                var item=result[i] ,
                    graphic=item.feature ,
                    symbol ,
                    infoTemplate=null;
                switch(graphic.geometry.type){
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
                        break;
                }
                graphic.setSymbol(symbol);
                graphic.setInfoTemplate(infoTemplate);
                // 添加到graphics进行高亮显示
                //$Map.graphics.add(graphic);
                searchBuildingGraphicsLayer.add(graphic);
            }
        } ,*/
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
                new Color([204 , 255 , 255 , 1])
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
                //self.currentCont= rs;
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
                self.companyDangerData = {
                    columns: columns ,
                    store: store ,
                    firstShowFields: [
                        "ChemicalName" , "Usage" , "DailyDosage"
                    ]
                };
            } , 200);

            return false;

            console.log("进入ajax查询数据方法");
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
           return $.inArray(current.code, this.companyDangerData.firstShowFields) >-1
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
            self.currentDetailMenu = null;
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
            var self = this;
            //获取远程数据,目前用本地数据模拟
            var data = [
                {FID:'103' , companyName:'卡特彼勒（天津）有限公司' , sn:'1' , pfk:'GF-KG337' , name:'危险废物暂存点' , location:'后续车间东南' , fqp:'' , xx:'13066660.807829' , yy:'4741642.792416' , group:'固废监测点位'},
                {FID:'103' , companyName:'卡特彼勒（天津）有限公司' , sn:'2' , pfk:'GF-KG338' , name:'危险废物暂存点' , location:'后续车间东南角' , fqp:'' , xx:'13066575.458003' , yy:'4741689.442409' , group:'固废监测点位'},
                {FID:'103' , companyName:'卡特彼勒（天津）有限公司' , sn:'3' , pfk:'GF-KG339' , name:'一般固废暂存点' , location:'仓库西北角' , fqp:'' , xx:'13066163.220181' , yy:'4742245.529108' , group:'固废监测点位'},
                {FID:'103' , companyName:'卡特彼勒（天津）有限公司' , sn:'4' , pfk:'WS-KG285' , name:'生产污水排放口' , location:'厂区东侧' , fqp:'' , xx:'13066582.426528' , yy:'4742281.669901' , group:'废水监测点位'},
                {FID:'103' , companyName:'卡特彼勒（天津）有限公司' , sn:'5' , pfk:'WS-KG286' , name:'生活污水排放口' , location:'厂区西侧' , fqp:'' , xx:'13066266.674085' , yy:'4741888.232011' , group:'废水监测点位'},
                {FID:'103' , companyName:'卡特彼勒（天津）有限公司' , sn:'6' , pfk:'' , name:'雨水排放口1' , location:'厂区西侧' , fqp:'' , xx:'13066031.556982' , yy:'4742286.657332' , group:'雨水排放点位'},
                {FID:'103' , companyName:'卡特彼勒（天津）有限公司' , sn:'7' , pfk:'' , name:'雨水排放口2' , location:'厂区西侧' , fqp:'' , xx:'13066024.550076' , yy:'4742205.873962' , group:'雨水排放点位'},
                {FID:'103' , companyName:'卡特彼勒（天津）有限公司' , sn:'8' , pfk:'' , name:'雨水排放口3' , location:'厂区南侧' , fqp:'' , xx:'13066063.667717' , yy:'4742160.117731' , group:'雨水排放点位'},
                {FID:'103' , companyName:'卡特彼勒（天津）有限公司' , sn:'9' , pfk:'' , name:'雨水排放口4' , location:'厂区南侧' , fqp:'' , xx:'13066172.26863' , yy:'4742015.445636' , group:'雨水排放点位'},
                {FID:'103' , companyName:'卡特彼勒（天津）有限公司' , sn:'10' , pfk:'' , name:'雨水排放口5' , location:'厂区南侧' , fqp:'' , xx:'13066275.457244' , yy:'4741877.732572' , group:'雨水排放点位'},
                {FID:'103' , companyName:'卡特彼勒（天津）有限公司' , sn:'11' , pfk:'' , name:'雨水排放口6' , location:'厂区南侧' , fqp:'' , xx:'13066442.109707' , yy:'4741625.2834' , group:'雨水排放点位'},
                {FID:'103' , companyName:'卡特彼勒（天津）有限公司' , sn:'12' , pfk:'' , name:'雨水排放口7' , location:'厂区东侧' , fqp:'' , xx:'13066804.953342' , yy:'4741798.088252' , group:'雨水排放点位'},
                {FID:'103' , companyName:'卡特彼勒（天津）有限公司' , sn:'13' , pfk:'' , name:'雨水排放口8' , location:'厂区东侧' , fqp:'' , xx:'13066765.20274' , yy:'4741899.707208' , group:'雨水排放点位'},
                {FID:'103' , companyName:'卡特彼勒（天津）有限公司' , sn:'14' , pfk:'' , name:'雨水排放口9' , location:'厂区北侧' , fqp:'' , xx:'13066180.297782' , yy:'4742345.363987' , group:'雨水排放点位'},
                {FID:'103' , companyName:'卡特彼勒（天津）有限公司' , sn:'14' , pfk:'FQ-KG455' , name:'FQ-KG455' , location:'后续车间前处理1' , fqp:'' , xx:'13066487.020852' , yy:'4741728.911874' , group:'废气监测点位'},
                {FID:'103' , companyName:'卡特彼勒（天津）有限公司' , sn:'15' , pfk:'FQ-KG456' , name:'FQ-KG456' , location:'后续车间前处理2' , fqp:'4m' , xx:'13066489.494619' , yy:'4741729.709239' , group:'废气监测点位'},
                {FID:'103' , companyName:'卡特彼勒（天津）有限公司' , sn:'16' , pfk:'FQ-KG457' , name:'FQ-KG457' , location:'后续车间水分烘干' , fqp:'14m' , xx:'13066504.027997' , yy:'4741736.885522' , group:'废气监测点位'},
                {FID:'103' , companyName:'卡特彼勒（天津）有限公司' , sn:'17' , pfk:'FQ-KG450' , name:'FQ-KG450' , location:'底漆喷涂室' , fqp:'' , xx:'13066513.304621' , yy:'4741725.323734' , group:'废气监测点位'},
                {FID:'103' , companyName:'卡特彼勒（天津）有限公司' , sn:'18' , pfk:'FQ-KG451' , name:'FQ-KG451' , location:'面漆喷涂室' , fqp:'' , xx:'13066498.152801' , yy:'4741717.350096' , group:'废气监测点位'},
                {FID:'103' , companyName:'卡特彼勒（天津）有限公司' , sn:'19' , pfk:'FQ-KG452' , name:'FQ-KG452' , location:'补漆喷涂室' , fqp:'' , xx:'13066551.648001' , yy:'4741696.618664' , group:'废气监测点位'},
                {FID:'103' , companyName:'卡特彼勒（天津）有限公司' , sn:'20' , pfk:'FQ-KG453' , name:'FQ-KG453' , location:'底漆面漆烘干' , fqp:'' , xx:'13066487.948515' , yy:'4741713.363279' , group:'废气监测点位'},
                {FID:'103' , companyName:'卡特彼勒（天津）有限公司' , sn:'21' , pfk:'FQ-KG454' , name:'FQ-KG454' , location:'补漆烘干室' , fqp:'' , xx:'13066552.575664' , yy:'4741694.226579' , group:'废气监测点位'},
                {FID:'103' , companyName:'卡特彼勒（天津）有限公司' , sn:'22' , pfk:'FQ-KG458' , name:'FQ-KG458' , location:'后续车间高压清洗' , fqp:'6m' , xx:'13066552.575664' , yy:'4741700.206793' , group:'废气监测点位'},
                {FID:'103' , companyName:'卡特彼勒（天津）有限公司' , sn:'23' , pfk:'FQ-KG459' , name:'FQ-KG459' , location:'1#发动机测试间' , fqp:'' , xx:'13066518.561375' , yy:'4741770.773596' , group:'废气监测点位'},
                {FID:'103' , companyName:'卡特彼勒（天津）有限公司' , sn:'24' , pfk:'FQ-KG460' , name:'FQ-KG460' , location:'1#发动机测试间' , fqp:'1m' , xx:'13066515.159946' , yy:'4741774.361752' , group:'废气监测点位'},
                {FID:'103' , companyName:'卡特彼勒（天津）有限公司' , sn:'25' , pfk:'FQ-KG465' , name:'FQ-KG465' , location:'2#发动机测试间' , fqp:'' , xx:'13066528.765661' , yy:'4741765.590707' , group:'废气监测点位'},
                {FID:'103' , companyName:'卡特彼勒（天津）有限公司' , sn:'26' , pfk:'FQ-KG466' , name:'FQ-KG466' , location:'2#发动机测试间' , fqp:'8m' , xx:'13066520.107479' , yy:'4741764.394656' , group:'废气监测点位'},
                {FID:'103' , companyName:'卡特彼勒（天津）有限公司' , sn:'27' , pfk:'FQ-KG467' , name:'FQ-KG467' , location:'3#发动机测试间' , fqp:'8m' , xx:'13066509.903192' , yy:'4741764.793339' , group:'废气监测点位'},
                {FID:'103' , companyName:'卡特彼勒（天津）有限公司' , sn:'28' , pfk:'FQ-KG468' , name:'FQ-KG468' , location:'3#发动机测试间' , fqp:'' , xx:'13066512.376959' , yy:'4741764.394656' , group:'废气监测点位'},
                {FID:'103' , companyName:'卡特彼勒（天津）有限公司' , sn:'29' , pfk:'FQ-KG461' , name:'FQ-KG461' , location:'1#发电机测试间' , fqp:'' , xx:'13066532.16709' , yy:'4741730.905285' , group:'废气监测点位'},
                {FID:'103' , companyName:'卡特彼勒（天津）有限公司' , sn:'30' , pfk:'FQ-KG462' , name:'FQ-KG462' , location:'1#发电机测试间' , fqp:'1m' , xx:'13066538.042286' , yy:'4741728.11451' , group:'废气监测点位'},
                {FID:'103' , companyName:'卡特彼勒（天津）有限公司' , sn:'31' , pfk:'FQ-KG463' , name:'FQ-KG463' , location:'2#发电机测试间' , fqp:'' , xx:'13066533.713194' , yy:'4741720.938232' , group:'废气监测点位'},
                {FID:'103' , companyName:'卡特彼勒（天津）有限公司' , sn:'32' , pfk:'FQ-KG464' , name:'FQ-KG464' , location:'2#发电机测试间' , fqp:'1m' , xx:'13066532.785532' , yy:'4741725.323734' , group:'废气监测点位'},
                {FID:'58' , companyName:'捷尔杰（天津）设备有限公司' , sn:'1' , pfk:'GF-BS165' , name:'危险废物暂存点' , location:'厂区南侧' , fqp:'' , xx:'13073564.052805' , yy:'4738620.152256' , group:'固废监测点位'},
                {FID:'58' , companyName:'捷尔杰（天津）设备有限公司' , sn:'2' , pfk:'' , name:'一般固废暂存点' , location:'厂区西侧' , fqp:'' , xx:'13073419.9498' , yy:'4738888.914546' , group:'固废监测点位'},
                {FID:'58' , companyName:'捷尔杰（天津）设备有限公司' , sn:'3' , pfk:'WS-KG184' , name:'污水排放口（生产+生活）' , location:'厂区北侧' , fqp:'' , xx:'13073646.427717' , yy:'4738906.526888' , group:'废水监测点位'},
                {FID:'58' , companyName:'捷尔杰（天津）设备有限公司' , sn:'4' , pfk:'' , name:'污水站' , location:'一期厂房南侧' , fqp:'' , xx:'13073634.725137' , yy:'4738615.216309' , group:'废水监测点位'},
                {FID:'58' , companyName:'捷尔杰（天津）设备有限公司' , sn:'5' , pfk:'雨水 1' , name:'雨水排放口' , location:'厂区西北角' , fqp:'' , xx:'13073408.628102' , yy:'4738933.600152' , group:'雨水排放点位'},
                {FID:'58' , companyName:'捷尔杰（天津）设备有限公司' , sn:'6' , pfk:'雨水 2' , name:'雨水排放口' , location:'厂区北侧' , fqp:'' , xx:'13073537.583179' , yy:'4738921.701556' , group:'雨水排放点位'},
                {FID:'58' , companyName:'捷尔杰（天津）设备有限公司' , sn:'7' , pfk:'雨水 3' , name:'雨水排放口' , location:'厂区北侧' , fqp:'' , xx:'13073664.798588' , yy:'4738908.801513' , group:'雨水排放点位'},
                {FID:'58' , companyName:'捷尔杰（天津）设备有限公司' , sn:'8' , pfk:'雨水 4' , name:'雨水排放口' , location:'厂区东侧' , fqp:'' , xx:'13073806.805006' , yy:'4738787.383466' , group:'雨水排放点位'},
                {FID:'58' , companyName:'捷尔杰（天津）设备有限公司' , sn:'9' , pfk:'雨水 5' , name:'雨水排放口' , location:'厂区东南角' , fqp:'' , xx:'13073788.592142' , yy:'4738594.051384' , group:'雨水排放点位'},
                {FID:'58' , companyName:'捷尔杰（天津）设备有限公司' , sn:'10' , pfk:'FQ-KG359' , name:'废气排放口' , location:'一期厂房' , fqp:'' , xx:'13073653.316273' , yy:'4738838.084166' , group:'废气排放点位'},
                {FID:'58' , companyName:'捷尔杰（天津）设备有限公司' , sn:'11' , pfk:'FQ-KG358' , name:'废气排放口' , location:'一期厂房' , fqp:'' , xx:'13073709.913531' , yy:'4738686.633496' , group:'废气排放点位'},
                {FID:'58' , companyName:'捷尔杰（天津）设备有限公司' , sn:'12' , pfk:'FQ-KG357' , name:'废气排放口' , location:'一期厂房' , fqp:'' , xx:'13073687.341264' , yy:'4738682.24763' , group:'废气排放点位'},
                {FID:'58' , companyName:'捷尔杰（天津）设备有限公司' , sn:'13' , pfk:'FQ-KG360' , name:'废气排放口' , location:'一期厂房' , fqp:'' , xx:'13073664.452402' , yy:'4738777.901336' , group:'废气排放点位'},
                {FID:'58' , companyName:'捷尔杰（天津）设备有限公司' , sn:'14' , pfk:'FQ-KG356' , name:'废气排放口' , location:'一期厂房' , fqp:'' , xx:'13073604.767578' , yy:'4738673.083718' , group:'废气排放点位'},
                {FID:'58' , companyName:'捷尔杰（天津）设备有限公司' , sn:'15' , pfk:'FQ-KG355' , name:'废气排放口' , location:'一期厂房西侧' , fqp:'' , xx:'13073609.050283' , yy:'4738707.7609' , group:'废气排放点位'},
                {FID:'58' , companyName:'捷尔杰（天津）设备有限公司' , sn:'16' , pfk:'FQ-KG226' , name:'废气排放口' , location:'定制服务车间' , fqp:'' , xx:'13073408.263931' , yy:'4738703.902659' , group:'废气排放点位'},
                {FID:'58' , companyName:'捷尔杰（天津）设备有限公司' , sn:'17' , pfk:'FQ-KG227' , name:'废气排放口' , location:'定制服务车间' , fqp:'5m' , xx:'13073416.612665' , yy:'4738705.497419' , group:'废气排放点位'},
                {FID:'58' , companyName:'捷尔杰（天津）设备有限公司' , sn:'18' , pfk:'FQ-KG225' , name:'废气排放口' , location:'定制服务车间' , fqp:'' , xx:'13073466.394222' , yy:'4738742.16832' , group:'废气排放点位'},
                {FID:'58' , companyName:'捷尔杰（天津）设备有限公司' , sn:'19' , pfk:'FQ-KG228' , name:'废气排放口' , location:'定制服务车间' , fqp:'3m' , xx:'13073459.28348' , yy:'4738721.841113' , group:'废气排放点位'},
                {FID:'58' , companyName:'捷尔杰（天津）设备有限公司' , sn:'20' , pfk:'FQ-KG224' , name:'废气排放口' , location:'定制服务车间' , fqp:'3m' , xx:'13073424.651727' , yy:'4738714.664864' , group:'废气排放点位'},
                {FID:'55' , companyName:'空中客车（天津）总装有限公司' , sn:'1' , pfk:'GF-KG117' , name:'一般固废暂存点' , location:'大部件库东北侧' , fqp:'' , xx:'13067756.719482' , yy:'4737512.070159' , group:'固废监测点位'},
                {FID:'55' , companyName:'空中客车（天津）总装有限公司' , sn:'2' , pfk:'GF-KG 119' , name:'危险废物暂存点' , location:'大部件库东北侧' , fqp:'' , xx:'13067714.361153' , yy:'4737498.518251' , group:'固废监测点位'},
                {FID:'55' , companyName:'空中客车（天津）总装有限公司' , sn:'3' , pfk:'GF-KG 118' , name:'危险废物暂存点' , location:'厂区东南角' , fqp:'' , xx:'13068198.522612' , yy:'4738053.294633' , group:'固废监测点位'},
                {FID:'55' , companyName:'空中客车（天津）总装有限公司' , sn:'4' , pfk:'WS-KG149' , name:'生活污水排放口' , location:'厂区东侧' , fqp:'' , xx:'13067827.960854' , yy:'4738605.160175' , group:'废水监测点位'},
                {FID:'55' , companyName:'空中客车（天津）总装有限公司' , sn:'5' , pfk:'WS-KG150' , name:'生活污水排放口' , location:'厂区东侧' , fqp:'' , xx:'13067901.657982' , yy:'4738513.889349' , group:'废水监测点位'},
                {FID:'55' , companyName:'空中客车（天津）总装有限公司' , sn:'6' , pfk:'WS-KG151' , name:'生活污水排放口' , location:'厂区东侧' , fqp:'' , xx:'13067578.315042' , yy:'4738930.513146' , group:'废水监测点位'},
                {FID:'55' , companyName:'空中客车（天津）总装有限公司' , sn:'7' , pfk:'WS-KG152' , name:'生活、生产污水排放口' , location:'厂区东侧' , fqp:'' , xx:'13067678.378411' , yy:'4738785.759884' , group:'废水监测点位'},
                {FID:'55' , companyName:'空中客车（天津）总装有限公司' , sn:'8' , pfk:'WS-KG153' , name:'喷漆车间废水排放（纯生产废水）' , location:'喷漆车间' , fqp:'' , xx:'13067819.08443' , yy:'4738437.751504' , group:'废水监测点位'},
                {FID:'55' , companyName:'空中客车（天津）总装有限公司' , sn:'9' , pfk:'' , name:'A' , location:'厂区东侧' , fqp:'' , xx:'13067347.100326' , yy:'4738296.616948' , group:'固废监测点位'},
                {FID:'55' , companyName:'空中客车（天津）总装有限公司' , sn:'10' , pfk:'' , name:'B' , location:'厂区东侧' , fqp:'' , xx:'13067409.252214' , yy:'4738208.142916' , group:'固废监测点位'},
                {FID:'55' , companyName:'空中客车（天津）总装有限公司' , sn:'11' , pfk:'' , name:'C' , location:'厂区东侧' , fqp:'' , xx:'13067594.066495' , yy:'4737853.994049' , group:'固废监测点位'},
                {FID:'55' , companyName:'空中客车（天津）总装有限公司' , sn:'12' , pfk:'' , name:'D' , location:'厂区东侧' , fqp:'' , xx:'13067711.567928' , yy:'4737689.010521' , group:'固废监测点位'},
                {FID:'55' , companyName:'空中客车（天津）总装有限公司' , sn:'13' , pfk:'' , name:'E' , location:'厂区东侧' , fqp:'' , xx:'13067585.371527' , yy:'4738859.249665' , group:'固废监测点位'},
                {FID:'55' , companyName:'空中客车（天津）总装有限公司' , sn:'14' , pfk:'' , name:'F' , location:'厂区东侧' , fqp:'' , xx:'13067835.424196' , yy:'4738562.112517' , group:'固废监测点位'},
                {FID:'55' , companyName:'空中客车（天津）总装有限公司' , sn:'15' , pfk:'' , name:'G' , location:'厂区东侧' , fqp:'' , xx:'13067663.598322' , yy:'4738658.533529' , group:'固废监测点位'},
                {FID:'55' , companyName:'空中客车（天津）总装有限公司' , sn:'16' , pfk:'' , name:'H' , location:'16号楼以南' , fqp:'' , xx:'13067974.688491' , yy:'4737696.597108' , group:'固废监测点位'},
                {FID:'55' , companyName:'空中客车（天津）总装有限公司' , sn:'17' , pfk:'WS-KG153' , name:'生产污水排放口' , location:'喷漆厂房内' , fqp:'' , xx:'13067766.188087' , yy:'4738386.572166' , group:'废水监测点位'},
                {FID:'55' , companyName:'空中客车（天津）总装有限公司' , sn:'18' , pfk:'FQ-KG127' , name:'1号机库喷漆废气排放口' , location:'喷漆1号机库' , fqp:'' , xx:'13067652.712525' , yy:'4738254.625624' , group:'废气排放点位'},
                {FID:'55' , companyName:'空中客车（天津）总装有限公司' , sn:'19' , pfk:'FQ-KG129' , name:'VTC机库喷漆废气排放口' , location:'喷漆VTC机库' , fqp:'10' , xx:'13067575.333691' , yy:'4738354.201242' , group:'废气排放点位'},
                {FID:'55' , companyName:'空中客车（天津）总装有限公司' , sn:'20' , pfk:'FQ-KG128' , name:'2号机库喷漆废气排放口' , location:'喷漆2号机库' , fqp:'80' , xx:'13067923.949822' , yy:'4738266.499344' , group:'废气排放点位'},
                {FID:'80' , companyName:'麦格纳汽车动力总成（天津）有限公司' , sn:'1' , pfk:'FQ-KG260' , name:'危险废物暂存点' , location:'厂区西侧' , fqp:'' , xx:'13068078.758928' , yy:'4739494.733106' , group:'固废监测点位'},
                {FID:'80' , companyName:'麦格纳汽车动力总成（天津）有限公司' , sn:'2' , pfk:'FQ-KG261' , name:'一般固废暂存点' , location:'厂区西侧' , fqp:'' , xx:'13068091.435564' , yy:'4739502.705787' , group:'固废监测点位'},
                {FID:'80' , companyName:'麦格纳汽车动力总成（天津）有限公司' , sn:'3' , pfk:'FQ-KG237' , name:'生活污水总排口' , location:'厂区东侧' , fqp:'' , xx:'13068192.004099' , yy:'4739679.385049' , group:'废水监测点位'},
                {FID:'80' , companyName:'麦格纳汽车动力总成（天津）有限公司' , sn:'4' , pfk:'-' , name:'雨水排放口' , location:'厂区东侧' , fqp:'' , xx:'13068265.000575' , yy:'4739610.513668' , group:'废水监测点位'},
                {FID:'80' , companyName:'麦格纳汽车动力总成（天津）有限公司' , sn:'5' , pfk:'FQ-KG329' , name:'废气排放口' , location:'厂区西侧' , fqp:'' , xx:'13068001.180686' , yy:'4739602.670445' , group:'废气排放点位'},
                {FID:'80' , companyName:'麦格纳汽车动力总成（天津）有限公司' , sn:'6' , pfk:'FQ-KG330' , name:'废气排放口' , location:'厂区西侧' , fqp:'28' , xx:'13068032.411805' , yy:'4739569.588711' , group:'废气排放点位'},
                {FID:'80' , companyName:'麦格纳汽车动力总成（天津）有限公司' , sn:'7' , pfk:'FQ-KG331' , name:'废气排放口' , location:'厂区西侧' , fqp:'2' , xx:'13068033.958115' , yy:'4739564.40704' , group:'废气排放点位'},
                {FID:'80' , companyName:'麦格纳汽车动力总成（天津）有限公司' , sn:'8' , pfk:'FQ-KG447' , name:'废气排放口' , location:'厂区西侧' , fqp:'6' , xx:'13068039.524207' , yy:'4739556.036841' , group:'废气排放点位'},
                {FID:'80' , companyName:'麦格纳汽车动力总成（天津）有限公司' , sn:'9' , pfk:'FQ-KG448' , name:'废气排放口' , location:'厂区西侧' , fqp:'3' , xx:'13068041.070299' , yy:'4739554.442548' , group:'废气排放点位'},
                {FID:'130' , companyName:'爱思开能源润滑油（天津）有限公司' , sn:'1' , pfk:'WS-BS083' , name:'生活污水排放口' , location:'厂区西南角' , fqp:'' , xx:'13109301.135668' , yy:'4721381.812385' , group:'废水监测点位'},
                {FID:'130' , companyName:'爱思开能源润滑油（天津）有限公司' , sn:'2' , pfk:'雨水总排口' , name:'厂区西北角办公楼后方' , location:'厂区西北角办公楼后方' , fqp:'' , xx:'13109335.00525' , yy:'4721443.580953' , group:'废水监测点位'},
                {FID:'130' , companyName:'爱思开能源润滑油（天津）有限公司' , sn:'3' , pfk:'GF-BS062' , name:'危险废物暂存点' , location:'厂区添加剂罐区西侧' , fqp:'' , xx:'13109377.714295' , yy:'4721261.44205' , group:'固废监测点位'},
                {FID:'130' , companyName:'爱思开能源润滑油（天津）有限公司' , sn:'4' , pfk:'GF-BS063' , name:'一般固废暂存点' , location:'厂区添加剂罐区西侧' , fqp:'' , xx:'13109384.598491' , yy:'4721275.053983' , group:'固废监测点位'}
            ];
            console.log(company.feature.attributes.FID)
            var groups = _.transform(
                _.groupBy(
                    _.filter(data, {'FID':company.feature.attributes.FID}) ,
                    'group'
                ),
                function(result, value, key) {
                    result.push({name:key , children:value});
                },
                []
            );
            console.log(groups)

            setTimeout(function(){
                self.companyDischargeData = groups;
            } , 500);

        } ,

        clearGraphics:function(){
            //清除以前的currentSelectedCompany状态 以及清除所有高亮的graphic
            hightLightGraphicLayer.clear();  //为什么不清除图层呢
            dijitPopup.close(dialog);

        }
    }
};