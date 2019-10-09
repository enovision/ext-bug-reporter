/**
 * Created by j.vd.merwe on 3/30/18.
 */
Ext.define('BugReporter.window.BugReport', {
    extend: 'Ext.window.Window',
    alternateClassName: ['BugReporterReportWindow'],
    alias: 'widget.BugreporterReportWindow',

    requires: [
        'BugReporter.form.Report',
        'Ext.layout.container.Fit'
    ],

    autoShow: true,
    height: 700,
    width: 800,
    resizable: true,
    modal: true,

    layout: 'fit',
    autoScroll: true,

    _data: [],
    project: 'default',
    dbLocation: null,
    dbLog: false,

    iconCls: 'fa fa-bug',
    title: 'Bug Reporter',

    scrollable: true,

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            items: [{
                xtype: 'BugReporterReportFormPanel',
                _data: me._data,
                project: me.project,
                header: false,
                dbLocation: me.dbLocation,
                dbLog: me.dbLog,
                listeners: {
                    'BugFormSubmitted': function(form, success, message, error) {
                        me.fireEvent('BugFormSubmitted', me, success, message, error);
                    }
                }
            }]
        });

        me.callParent(arguments);
    }
});