vueExports.modal1 = {
    el: '#modal1',
    data: {
        address:""
    },
    methods: {
        drawPoint: function(){
			//$Map.graphics.clear();
            //$Map.disableMapNavigation();
            $Toolbar.activate("point");
        } ,
        searchAddress: function(){
            console.log("你要查询的地址是： "+this.address);
        }
    }
};