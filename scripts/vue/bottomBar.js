vueExports.bottomBar = {
    el: '#bottomBar',
    data: {
        menus:[
            {text:"事件定位" , icon:"fa-map-marker" , modal:"modal1"} ,
            {text:"范围确定" , icon:"fa-bank" , modal:"modal2"} ,
            {text:"影响分析" , icon:"fa-lightbulb-o" , modal:"modal3"} ,
            {text:"资源分析" , icon:"fa-question-circle" , modal:"modal4"} ,
            {text:"路径分析" , icon:"fa-sign-in" , modal:"modal5"} ,
            {text:"态势分析" , icon:"fa-info-circle" , modal:"modal6"}
        ] ,
        currentModal: null
    },
    methods: {
        openModal: function (menu) {
            var self = this ,
                registry = dojoRegistry;
            if (self.currentModal) self.currentModal.hide();

            var modal = registry.byId(menu.modal);
            if (!modal) return;
            self.currentModal = modal;
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
            var modalExports = vueExports[menu.modal];
            setTimeout(function(){
                jsc.init();   //注册jsColor.js的初始化事件，jscolor.js中的var jsc变量已改动设为全局变量
                if (modalExports) new Vue(modalExports);
            } , 1500)

        }
    }
};