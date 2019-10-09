/**
 *
 *
 * @class BugReporter.panel.Log
 */
Ext.define('BugReporter.panel.Log', {
    extend: 'Ext.panel.Panel',
    xtype: 'BugReporterLogPanel',

    requires: [
        'BugReporter.grid.Log',
        'BugReporter.grid.property.Details',
        'BugReporter.panel.LogController',
        'Ext.layout.container.Border'
    ],

    controller: 'BugReporterLogController',

    dbLocation: null,

    title: 'BugReporter Log',
    iconCls: 'fa fa-bug',

    unDockable: true,

    unDockViewConfig: {
        width: 500,
        height: 500
    },

    layout: 'border',

    initComponent: function () {
        Ext.apply(this, {
            items: [{
                xtype: 'BugreporterLogGrid',
                region: 'center',
                dbLocation: this.dbLocation,
                flex: 3
            }, {
                xtype: 'BugReporterDetailPanel',
                flex: 1,
                split: true,
                region: 'east',
                hidden: true,
                tools: [{
                    type: 'maximize',
                    tooltip: 'Undock',
                    hidden: this.unDockable === false,
                    callback: 'onUndock'
                }, {
                    type: 'right',
                    tooltip: 'Schliessen',
                    callback: function (panel) {
                        panel.hide();
                    }
                }]
            }]
        });

        this.callParent();
    }
});