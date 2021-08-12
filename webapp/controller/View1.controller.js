sap.ui.define([
    "art/bif/oc/controller/BaseController",
    "sap/ui/core/message/Message",
    "sap/ui/core/library",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel"
], function (BaseController, Message, library, Fragment, JSONModel) {
    'use strict';

    // shortcut for sap.ui.core.ValueState
    var ValueState = library.ValueState;

    // shortcut for sap.ui.core.MessageType
    var MessageType = library.MessageType;

    return BaseController.extend("art.bif.oc.controller.View1", {

        onInit: function () {

            this.oFragmentFin = null;

            const date = new Date();
            date.setDate(date.getDate() + 10);

            var oDate = this.getView().byId("idDate").setMinDate(date);

            this.oView = this.getView();

            // set message model
            var oMessageManager = sap.ui.getCore().getMessageManager();
            this.oView.setModel(oMessageManager.getMessageModel(), "message");

            // or just do it for the whole view
            oMessageManager.registerObject(this.oView, true);

            var oLocalModel = new JSONModel({

                "orderCreate": {

                    "PO_GUID": "",
                    "PO_NO": "",
                    "SUPPLIER_GUID": "",
                    "PO_GROSS_AMT": "",
                    "PO_TAX_AMT": "",
                    "PO_NET_AMT": "",
                    "PO_QTY": "",
                    "CURRENCY_CODE": "",
                    "UOM": "",
                    "ORDER_DATE": "",
                    "NavOrderItems": []
                }

            })

            this.oView.setModel(oLocalModel, "local");

        },

        onChange: function (oChange) {

            sap.ui.getCore().getMessageManager().removeAllMessages();

            if (oChange.getSource().isValidValue() === false) {

                var oMessage = new Message({
                    message: "Invalid Delivery Date",
                    type: MessageType.Error,
                    target: "/Dummy",
                    processor: this.getView().getModel()
                });
                sap.ui.getCore().getMessageManager().addMessages(oMessage);

            }

        },

        onMessagePopoverPress: function (oEvent) {
            var oSourceControl = oEvent.getSource();
            this._getMessagePopover().then(function (oMessagePopover) {
                oMessagePopover.openBy(oSourceControl);
            });
        },

        _getMessagePopover: function () {
            var oView = this.getView();

            // create popover lazily (singleton)
            if (!this._pMessagePopover) {
                this._pMessagePopover = Fragment.load({
                    id: oView.getId(),
                    name: "art.bif.oc.fragments.MessagePopover"
                }).then(function (oMessagePopover) {
                    oView.addDependent(oMessagePopover);
                    return oMessagePopover;
                });
            }
            return this._pMessagePopover;
        },

        onAdd: function () {

            var aItems = this.oView.getModel("local").getProperty("/orderCreate/NavOrderItems");

            var item = {

                "PO_I_GUID": "",
                "PO_GUID": "",
                "PO_ITEM_NO": aItems.length + 1,
                "QUANTITY": "",
                "UOM": "CAR",
                "GROSS_AMT": "",
                "TAX_AMOUNT": "",
                "NET_AMOUNT": "",
                "CURRENCY_CODE": "INR"
            }

            aItems.push(item);

            this.oView.getModel("local").setProperty("/orderCreate/NavOrderItems", aItems);

        },

        onValue: function(){

            var that = this;

            if(!this.oFragmentFin){

            Fragment.load({
                id: "idPop",
                name: "art.bif.oc.fragments.Popup",
                controller: this
            }).then(function(oFragment){

               that.oFragmentFin = oFragment;

               that.oFragmentFin.open();

            });

            }else{

                this.oFragmentFin.open();

            }

        }

    });

});