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
		jsc.init();   //ע��jsColor.js�ĳ�ʼ���¼���jscolor.js�е�var jsc�����ѸĶ���Ϊȫ�ֱ���
		//// With JQuery
		$(".bs-slider").slider({
			tooltip: 'always'
		});
	  }
};


