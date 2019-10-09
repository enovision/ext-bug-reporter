Ext.define ('BugReporter.button.BugReporter', {
    extend: 'Ext.button.Button',
    xtype: 'bugreporterbutton',

    requires: [
        'BugReporter.window.BugReport'
    ],

    text: 'Bug Reporter',

    iconCls: 'x-fa fa-bug',

    dbLocation: null,
    project: 'default',
    dbLog: false,

    type: 'window',

    _data : false,

    initComponent: function () {
        var me = this;

        function btnClicked () {
            var win = Ext.create ('BugReporter.window.BugReport', {
                _data: me._data,
                dbLocation: me.dbLocation,
                dbLog: me.dbLog,
                project: me.project,
                listeners: {
                    'BugFormSubmitted': function (win, success, message) {
                        me.fireEvent('BugFormSubmitted', me, win, success, message);
                    }
                }
            });

            win.show ();
        }

        Ext.apply (this, {
            handler: btnClicked
        });

        me.callParent();
    }
});