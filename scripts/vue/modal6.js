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

    }
};
//// With JQuery
//$("#ex8").slider({
//    tooltip: 'always'
//});

// Without JQuery
var slider = new Slider("#ex8", {
    tooltip: 'always'
});


