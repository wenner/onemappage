vueExports.side = {
    el: '#sidepanel',
    data: {
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
};