sap.ui.define([
    "sap/ui/core/UIComponent"
], function(UIComponent) {
    'use strict';

    return UIComponent.extend("art.bif.oc.Component", {


        metadata: {

            manifest: "json"
        },

        init: function(){

            UIComponent.prototype.init.apply(this);

            this.oRouter = this.getRouter();

            this.oRouter.initialize();
            
        }

    });
    
});