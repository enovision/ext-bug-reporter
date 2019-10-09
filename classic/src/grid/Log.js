/**
 * Created by J.vd.Merwe on 06-May-16.
 */
Ext.define('BugReporter.grid.Log', {
    extend: 'Ext.grid.Panel',
    xtype: 'BugreporterLogGrid',

    requires: [
        'BugReporter.store.ReportLog',
        'Ext.button.Button',
        'Ext.grid.column.Template',
        'Ext.grid.column.Widget',
        'Ext.toolbar.Paging'
    ],

    dbLocation: null,

    defaults: {
        width: 75
    },

    columns: [{
        dataIndex: 'date',
        text: 'Date'
    }, {
        dataIndex: 'time',
        text: 'Time'
    }, {
        xtype: 'templatecolumn',
        dataIndex: 'type_desc',
        text: 'Type',
        tpl: new Ext.XTemplate(
            '<span>{type_icon}&nbsp;&nbsp;</span>',
            '<span>{type_desc}</span>'
        ),
        width: 100,
    }, {
        xtype: 'templatecolumn',
        dataIndex: 'priority_icon',
        text: 'Priorität',
        tpl: new Ext.XTemplate(
            '<span>{priority_icon}&nbsp;&nbsp;</span>',
            '<span>{priority_desc}</span>'
        ),
        width: 100,
    }, {
        dataIndex: 'subject',
        text: 'Subject',
        flex: 1
    }, {
        xtype: 'templatecolumn',
        dataIndex: 'name',
        text: 'Contact',
        tpl: new Ext.XTemplate(
            '<div><strong>{name}</strong></div>',
            '<div><i>{phone}</i></div>'
        ),
        flex: 1
    }, {
        dataIndex: 'module_desc',
        text: 'Module',
        width: 100
    }, {
        dataIndex: 'project',
        text: 'Project',
        width: 150
    }, {
        xtype: 'widgetcolumn',
        text: '&nbsp;',
        widget: {
            xtype: 'button',
            margin: '5 0 5 0',
            text: 'Detail',
            handler: 'onDetailsClicked'
        },
        width: 100
    }],

    initComponent: function () {
        var me = this;

        var store = Ext.create('BugReporter.store.ReportLog', {
            dbLocation: me.dbLocation
        });

        Ext.apply(me, {
            store: store,
            dockedItems: [{
                dock: 'bottom',
                xtype: 'pagingtoolbar',
                store: store
            }]
        });

        me.callParent();
    }
});