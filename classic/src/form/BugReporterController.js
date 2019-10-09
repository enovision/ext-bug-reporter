/**
 * Created by j.vd.merwe on 3/29/18.
 */
Ext.define('BugReporter.form.BugReporterController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.BugReporterController',

    requires: [
        'BugReporter.singleton.Settings'
    ],

    init: function () {

    },

    onTypeChanged: function (combo, newValue, oldValue) {
        var imgType = this.lookupReference('imgType'),
            rec = combo.findRecord('key', newValue),
            cls = rec.get('glyph');

        imgType.update('<i class="fa fa-2x fa-' + cls + '"</i>');
    },

    onPriorityChanged: function (combo, newValue, oldValue) {
        var imgPriority = this.lookupReference('imgPriority'),
            rec = combo.findRecord('key', newValue),
            cls = rec.get('glyph');

        imgPriority.update('<i class="fa fa-2x fa-' + cls + '"</i>');
    },

    onDueOrChanged: function (radio, value) {
        var dp = this.lookupReference('dueDate');
        if (value === true) {
            dp.enable();
        } else {
            dp.disable();
        }
    },

    onCancelClicked: function (b, e) {
        var view = this.getView();
        view.ownerCt.destroy();
    },

    onSubmitClicked: function (b, e) {
        var me = this,
            view = this.getView(),
            parameters;

        if (!view.isValid()) return;

        parameters = {};

        Ext.apply(parameters, {
            dbLocation: view.dbLocation,
            project: view.project,
            dbLog: view.dbLog
        });

        view.submit({
            clientValidation: true,
            url: BugReporterSettings.getUrlSubmit(),
            params: parameters,
            success: function (form, action) {
                var result = action.result;
                me.fireViewEvent('BugFormSubmitted', result.success, result.message, result.error);
            },
            failure: function (form, action) {
                Ext.Msg.show({
                    title: action.result.error,
                    msg: action.result.message,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR
                });
            }
        });
    }

});