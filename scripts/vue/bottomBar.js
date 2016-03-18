vueExports.bottomBar = {
    el: '#bottomBar',
    data: {
        menus: bottomBarMenus ,
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

        }
    }
};