/**
 * Created by j.vd.merwe on 3/29/18.
 */
Ext.define('BugReporter.panel.LogController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.BugReporterLogController',

    requires: [
        'Ext.layout.container.Fit',
        'Ext.window.Window'
    ],

    control: {
        '#': {
            afterrender: 'onAfterrender'
        }
    },

    unDockViewConfig: {
        width: 500,
        height: 500,
        resizable: true,
        maximizable: true,
        showCloseTbar: false
    },

    onAfterrender: function (view) {
        this.DetailPanel = view.down('BugReporterDetailPanel');
        this.LogGrid = view.down('BugreporterLogGrid');
    },

    /**
     * Grid events
     * @param b
     */
    onDetailsClicked: function (b) {
        var me = this,
            row = b.up('gridview').indexOf(b.el.up('table')),
            store = this.LogGrid.getStore(),
            record = store.getAt(row);

        me.DetailPanel.updatePanel(record);
        me.DetailPanel.show();
    },

    onUndock: function (panel) {
        var me = this;
        var parent = me.getView();

        if (panel.unDockable === false) return false;

        var viewConfig = Ext.clone(me.unDockViewConfig);
        if (parent.hasOwnProperty('unDockViewConfig')) {
            Ext.apply(viewConfig, parent['unDockViewConfig']);
        }

        var toolToggle = function(panel)  {
            var tools = panel.getHeader().getTools();
            Ext.each(tools, function(tool) {
                panel.ownerCt.getXType() !== 'window' ? tool.show() : tool.hide();
            });
        };

        var closePanel = function () {
            if (parent !== null && parent.destroyed === false) {
                parent.add(panel);
                toolToggle(panel);
            }
        };

        parent.remove(panel, false);

        var winConfig = {
            title: parent.getTitle(),
            iconCls: parent.getIconCls(),
            layout: 'fit',
            items: [panel],
            width: 400,
            height: 400,
            resizable: true,
            constrain: true,
            listeners: {
                close: closePanel,
                beforerender: function(window) {
                    var panel = window.down('BugReporterDetailPanel');
                    toolToggle(panel);
                }
            }
        };

        Ext.apply(winConfig, viewConfig);

        if (viewConfig['showCloseTbar'] === true) {
            Ext.apply(winConfig, {
                buttons: [{
                    text: 'Schliessen',
                    iconCls: 'fa fa-close',
                    handler: function(b) {
                        var win = b.up('window');
                        win.fireEvent('close', win);
                        win.destroy();
                    }
                }]
            });
        }

        Ext.create('Ext.window.Window', winConfig).show();
    }
});