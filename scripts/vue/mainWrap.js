vueExports.mainWrap = {
    el: '#mainwrap',
    data: {
        sideCollapsed: true
    },
    methods: {
        toggle: function(){
            this.sideCollapsed = !this.sideCollapsed;
        }
    }
};