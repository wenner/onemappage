// Require the Dialog class
require(["dijit/registry", "dojo/query", "dojo/parser", "dojo/dom-prop", "dojo/dom", "dojo/on", "dijit/Dialog", "dojo/domReady!"],
    function (registry, query, parser, prop, dom, on) {
        var menus = $(".bmenu .nav a");
        menus.on("click", function () {
            menus.each(function (i, n) {
                var modal = $(n).data("modaltarget");
                if (modal) {
                    registry.byId(modal).hide();
                }
            });
            var targetModal = $(this).data("modaltarget");
            if (targetModal) {
                registry.byId(targetModal).show();
            }
        });
        parser.parse();
    });

(function ($) {
    $(document).ready(function () {
        $("#sidepanel-togglemenu").click(function () {
            $("#mainwrap").toggleClass("sidecollapsed", "");
        });
        //$(document).on('click', "#modal1 .searchBtn", function () {
        //    alert("这个按钮的事件触发了! 表单数据:"+$("#modal1 .tab2 form").serialize());
        //});
    });
})(jQuery);


