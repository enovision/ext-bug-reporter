/**
 * @class BugReporter.store.ReportLog
 */
Ext.define('BugReporter.store.ReportLog', {
    extend: 'Ext.data.Store',

    requires: [
        'BugReporter.singleton.Settings'
    ],

    fields: [{
        name: 'priority_icon',
        convert: function (val, data) {
            var arr = BugReporterSettings.getPriority(),
                find = arr.find(function (x) {
                    return x.key === data.get('priority')
                });

            return typeof(find) !== 'undefined' ? '<i class="fa fa-circle ' + find.color + '"></i>' : '&nbsp';
        }
    }, {
        name: 'type_icon',
        convert: function (val, data) {
            // noinspection JSUnresolvedVariable
            var arr = BugReporterSettings.getTypes();
            var find = arr.find(function (x) {
                return x.key === data.get('type');
            });
            return typeof(find) !== 'undefined' ? '<i class="' + find.class + '"></i>' : '&nbsp;';
        }
    }],

    pageSize: 50,
    proxy: {
        type: 'ajax',
        actionMethods: {
            read: 'POST'
        },
        url: BugReporterSettings.getUrlReport(),
        reader: {
            rootProperty: 'records',
            type: 'json',
            idProperty: 'id',
            totalProperty: 'total'
        },
        extraParams: {
            dbLocation: null
        }
    },
    autoLoad: true,

    constructor: function (config) {
        this.callParent(config);
        if (config.hasOwnProperty('dbLocation')) {
            this.getProxy().setExtraParam('dbLocation', config['dbLocation']);
        }
    }
});