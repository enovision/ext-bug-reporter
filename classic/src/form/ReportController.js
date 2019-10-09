/**
 * Created by j.vd.merwe on 3/30/18.
 */
Ext.define('BugReporter.form.ReportController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.BugReporterReportController',

    requires: [
        'BugReporter.singleton.Settings'
    ],

    onTypeChanged: function(combo, newValue) {
        var record = combo.findRecord('key', newValue);
        this.updateIcon('iconType', record);
    },

    onPriorityChanged: function(combo, newValue) {
        var record = combo.findRecord('key', newValue);
        this.updateIcon('iconPriority', record);
    },

    updateIcon: function(reference, record) {
        var icon = this.lookupReference(reference),
            cls = '<i class="fa fa-2x fa-' + record.get('glyph') + '"</i>';

        if (icon.rendered) {
            icon.update(cls);
        } else {
            icon.on('afterrender', function(comp) {
                comp.update(cls);
            });
        }
    },

    onDueOrChanged: function(radio, value) {
        var dp = this.lookupReference('dueDate');
        if (value === true) {
            dp.enable();
        } else {
            dp.disable();
        }
    },

    onCancelClicked: function() {
        var view = this.getView();
        view.ownerCt.destroy();
    },

    onSubmitClicked: function() {
        var me = this,
            result,
            view = this.getView();
        var parameters;

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
            success: function(form, action) {
                result = action.result;
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