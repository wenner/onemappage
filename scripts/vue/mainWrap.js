vueExports.mainWrap = {
    el: '#mainwrap',
    data: {
        sideExpanded: false
    },
    methods: {
        toggle: function(){
            this.sideExpanded = !this.sideExpanded;
        }
    }
};