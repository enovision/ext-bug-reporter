/**
 * @class BugReporter.grid.property.Details
 */
Ext.define('BugReporter.grid.property.Details', {
    extend: 'BugReporter.grid.property.List',
    xtype: 'BugReporterDetailPanel',

    autoScroll: true,

    layout: 'fit',

    title: 'Details',

    sortableColumns: false, // no sort
    nameColumnWidth: 130,   // different width

    showPreisProTakt: true,

    viewConfig: {
        getRowClass: function (record) {
            return record.get('label') === "Produziert" ? 'red' : '';
        }
    },
    rows: [{
        text: "Datum",
        dataIndex: "date"
    }, {
        text: "Time",
        dataIndex: "time"
    }, {
        text: "Type",
        dataIndex: "type",
        renderer: function (val, record) {
            return new Ext.XTemplate(
                '{type_icon}',
                '&nbsp;<span>{type_desc}</span>'
            ).apply(record.data)
        }
    }, {
        text: "Priority",
        dataIndex: "priority",
        renderer: function (val, record) {
            return new Ext.XTemplate(
                '{priority_icon}',
                '&nbsp;<span>{priority_desc}</span>'
            ).apply(record.data);
        }
    }, {
        text: "Contact",
        dataIndex: 'name',
        renderer: function (val, record) {
            return new Ext.XTemplate(
                '<div>{name}</div>',
                '<div><i class="fa fa-phone"></i>&nbsp;<i>{phone}</i></div>'
            ).apply(record.data);
        }
    }, {
        text: "Subject",
        dataIndex: "subject",
        cellWrap: true
    }, {
        text: "Message",
        dataIndex: "message",
        cellWrap: true,
        keepLineBreaks: true
    }, {
        text: "Reproduction",
        dataIndex: "reproduction",
        cellWrap: true,
        keepLineBreaks: true
    }, {
        text: 'Project',
        dataIndex: 'project'
    }, {
        text: 'Module',
        dataIndex: 'module_desc'
    }, {
        text: "Due",
        dataIndex: "due_desc",
        renderer: function (val, record) {
            return new Ext.XTemplate(
                '<div>{due_desc}</div>',
                '<div>{due_date}</div>'
            ).apply(record.data);
        }
    }, {
        text: 'Feedback',
        dataIndex: 'feedback_desc'
    }, {
        text: 'Login',
        dataIndex: 'login'
    }],
    sourceConfig: {
        'Due': {
            displayName: 'Due Date'
        }
    },
    updatePanel: function (record) {
        this.loadRecord(record);
    }
});