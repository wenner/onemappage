/**
 * Created by wwm on 2016/3/18.
 */
vueExports.modal6 = {
    el: '#modal6',
    data: {
        jsColor: ""
    },
    methods: {
        yanweiGraphic: function () {
            var rgb=this.jsColor.toRGB();
            console.log(rgb[0],rgb[1],rgb[2]);
        }

    } ,
	created: function () {
		jsc.init();   //注册jsColor.js的初始化事件，jscolor.js中的var jsc变量已改动设为全局变量
		//// With JQuery
		$(".bs-slider").slider({
			tooltip: 'always'
		});
	  }
};


