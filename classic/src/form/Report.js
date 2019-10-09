/**
 * @class BugReporter.form.Report
 *
 *     // Sample usage
 *
 *     onClickMenuBugReporter: function () {
 *       this.createTab('bugreporter', 'BugReporterReportFormPanel', {
 *         autoScroll: true,
 *         _data: [
 *            {fieldLabel: 'Login', value: 'loginname'},
 *            {fieldLabel: 'Name', value: 'Jane Doe'},
 *            {fieldLabel: 'Email', value: 'jane@doe.net'},
 *            {fieldLabel: 'Phone', value: '0031-12345-67890'},
 *            {fieldLabel: 'tan', value: 'verycryptictancode', hidden: true}
 *         ],
 *         project: 'SomeProjectName',
 *         dbLocation: '/resources/BugReporter',
 *         dbLog: true,
 *         listeners: {
 *           'BugFormSubmitted': function (panel, success, message) {
 *              if (success) {
 *                // something here that happens when success, like a message
 *              }
 *              panel.destroy();
 *           }
 *         }
 *       });
 *     },
 *
 */
Ext.define('BugReporter.form.Report', {
    extend: 'Ext.form.Panel',
    alias: 'widget.BugReporterReportFormPanel',
    controller: 'BugReporterReportController',

    requires: [
        'BugReporter.form.ReportController',
        'BugReporter.singleton.Settings',
        'Ext.container.Container',
        'Ext.data.StoreManager',
        'Ext.form.FieldContainer',
        'Ext.form.FieldSet',
        'Ext.form.RadioGroup',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Date',
        'Ext.form.field.Display',
        'Ext.form.field.Hidden',
        'Ext.form.field.Radio',
        'Ext.form.field.Text',
        'Ext.form.field.TextArea',
        'Ext.layout.container.Column',
        'Ext.layout.container.Fit',
        'Ext.layout.container.HBox',
        'Ext.toolbar.Fill'
    ],

    defaults: {
        labelAlign: 'top'
    },

    bodyPadding: 10,

    iconCls: 'fa fa-bug',
    title: 'Bug Reporter',

    project: 'default',
    dbLocation: null,
    dbLog: false,

    _data: [],

    scrollable: true,

    initComponent: function () {
        var me = this;

        var BPStore = Ext.StoreManager.lookup('bugReporterPriority');
        var BTStore = Ext.StoreManager.lookup('bugReporterTypes');
        var MDStore = Ext.StoreManager.lookup('bugReporterModules');

        var lRecord = BugReporterSettings.getLangData();

        var dt = new Date();
        var editDt = Ext.Date.format(dt, BugReporterSettings.getDateFmtLong());

        Ext.apply(this, {

            items: [{
                xtype: 'hidden',
                name: 'date',
                value: dt,
                submitValue: true
            }, {
                xtype: 'fieldcontainer',
                maxWidth: 1000,
                layout: 'fit',
                items: [{
                    xtype: 'fieldset',
                    padding: 20,
                    defaults: {
                        columnWidth: .5,
                        labelAlign: 'left'
                    },
                    layout: 'column',
                    items: [{
                        xtype: 'displayfield',
                        fieldLabel: lRecord.get('date_time'),
                        name: 'date_form',
                        value: editDt,
                        submitValue: true
                    }],
                    listeners: {
                        scope: me,
                        beforerender: function (fieldset) {
                            if (typeof(me._data) !== 'undefined') {
                                Ext.each(me._data, function (item) {
                                    var config = Object.assign({
                                        xtype: 'displayfield',
                                        submitValue: true,
                                        name: item.fieldLabel.toLowerCase().replace(' ', '_').replace('/', '_').replace('.', '_')
                                    }, item);

                                    fieldset.add(config);
                                })
                                ;
                            }
                        }
                    }
                }, {
                    xtype: 'fieldcontainer',
                    width: '100%',
                    defaults: {
                        columnWidth: .33,
                        labelAlign: 'top',
                        padding: '0 10 10 0'
                    },
                    layout: 'column',
                    items: [{
                        xtype: 'fieldcontainer',
                        fieldLabel: lRecord.get('type'),
                        layout: {
                            type: 'hbox',
                            align: 'stretch'
                        },
                        items: [{
                            xtype: 'combobox',
                            name: 'type',
                            displayField: 'value',
                            valueField: 'key',
                            store: BTStore,
                            queryMode: 'local',
                            flex: 1,
                            padding: '0 5 5 0',
                            editable: false,
                            listConfig: {
                                getInnerTpl: function () {
                                    return '<div>' + '<i class="fa fa-{glyph}"></i>&nbsp;&nbsp;' + '{value}</div>';
                                }
                            },
                            listeners: {
                                change: 'onTypeChanged'
                            }
                        }, {
                            xtype: 'container',
                            reference: 'iconType',
                            height: 32,
                            width: 32
                        }]
                    }, {
                        xtype: 'fieldcontainer',
                        fieldLabel:
                            lRecord.get('priority'),
                        layout: {
                            type: 'hbox',
                            align:
                                'stretch'
                        },
                        items: [{
                            xtype: 'combobox',
                            name: 'priority',
                            displayField: 'value',
                            valueField: 'key',
                            queryMode: 'local',
                            editable: false,
                            padding: '0 5 5 0',
                            flex: 1,
                            store: BPStore,
                            listConfig: {
                                getInnerTpl: function () {
                                    return '<div>' + '<i class="fa fa-{glyph}"></i>&nbsp;&nbsp;' + '{value}</div>';
                                }
                            },
                            listeners: {
                                change: 'onPriorityChanged'
                            }
                        }, {
                            xtype: 'container',
                            reference: 'iconPriority',
                            height: 32,
                            width: 32
                        }]
                    }, {
                        xtype: 'combobox',
                        fieldLabel:
                            lRecord.get('module'),
                        editable: false,
                        name: 'module',
                        displayField: 'value',
                        valueField: 'key',
                        queryMode: 'local',
                        store: MDStore
                    }]
                }, {
                    xtype: 'textfield',
                    anchor: '100%',
                    maxWidth: 800,
                    name: 'subject',
                    fieldLabel: lRecord.get('subject'),
                }, {
                    xtype: 'fieldcontainer',
                    defaults: {
                        columnWidth: .5,
                        labelAlign: 'top',
                        padding: '0 10 10 0',
                        minHeight: 250,
                        grow: true
                    },
                    layout: 'column',
                    items: [{
                        xtype: 'textareafield',
                        allowBlank: false,
                        allowOnlyWhitespace: false,
                        name: 'description',
                        fieldLabel: lRecord.get('description'),
                        msgTarget: 'under'
                    }, {
                        xtype: 'textareafield',
                        name: 'reproduction',
                        fieldLabel: lRecord.get('reproduction'),
                        msgTarget: 'under'

                    }]
                }, {
                    xtype: 'fieldset',
                    layout: 'column',
                    title: 'Rückmeldung',
                    padding: 20,
                    items: [{
                        xtype: 'container',
                        columnWidth: 0.5,
                        layout: 'fit',
                        items: [{
                            xtype: 'radiogroup',
                            defaults: {
                                minWidth: 200
                            },
                            layout: 'fit',
                            fieldLabel: lRecord.get('solution_please'),
                            labelAlign: 'top',
                            vertical: true,
                            items: [{
                                xtype: 'radiofield',
                                boxLabel: lRecord.get('solution_today'),
                                name: 'due',
                                inputValue: 'N'
                            }, {
                                xtype: 'radiofield',
                                boxLabel: lRecord.get('solution_tomorrow'),
                                name: 'due',
                                inputValue: 'T'
                            }, {
                                xtype: 'radiofield',
                                boxLabel: lRecord.get('solution_or'),
                                name: 'due',
                                inputValue: 'O',
                                checked: true,
                                listeners: {
                                    change: 'onDueOrChanged'
                                }
                            }]
                        }, {
                            xtype: 'datefield',
                            name: 'due_date',
                            reference: 'dueDate',
                            disabled: false,
                            value: new Date(),
                            minValue: new Date(),
                            format: BugReporterSettings.getDateFmt(),
                            submitFormat: 'Y-m-d',
                            maxWidth: 300
                        }]
                    }, {
                        xtype: 'container',
                        columnWidth: 0.5,
                        layout: 'fit',
                        items: [{
                            xtype: 'radiogroup',
                            defaults: {
                                minWidth: 200
                            },
                            layout: 'fit',
                            fieldLabel: lRecord.get('feedback'),
                            labelAlign: 'top',
                            vertical: true,
                            items: [{
                                xtype: 'radiofield',
                                boxLabel: lRecord.get('feedback_none'),
                                name: 'contact',
                                inputValue: 'N',
                                checked: true
                            }, {
                                xtype: 'radiofield',
                                boxLabel: lRecord.get('feedback_email'),
                                name: 'contact',
                                inputValue: 'E'
                            }, {
                                xtype: 'radiofield',
                                boxLabel: lRecord.get('feedback_phone'),
                                name: 'contact',
                                inputValue: 'T'
                            }]
                        }]
                    }]
                }]
            }],
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                items: [{
                    xtype: 'tbfill'
                }, {
                    minWidth: 100,
                    text: lRecord.get('button_submit'),
                    handler: 'onSubmitClicked'
                }, {
                    minWidth: 100,
                    text: lRecord.get('button_cancel'),
                    handler: 'onCancelClicked'
                }]
            }]
        });

        me.callParent(arguments);

        Ext.each(me.query('combobox'), function (combo) {
            combo.on('afterrender', function (cb) {
                var record = cb.store.getAt(0);
                cb.setValue(record.get('key'));
            });
        });
    }
});