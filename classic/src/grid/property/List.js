/**
 * Created by j.vd.merwe on 3/29/18.
 */
Ext.define('BugReporter.grid.property.List', {
    extend: 'Ext.grid.property.Grid',
    xtype: 'BugReporterPropertyList',

    requires: [
        'Ext.data.Store'
    ],

    autoScroll: true,
    /**
     * @cfg {String} nameField
     * what field in the record holds the label (default: 'label')
     */
    nameField: 'label',
    /**
     * @cfg {String} valueField
     * what field in the record holds the value (default: 'value')
     */
    valueField: 'value',
    /**
     * @cfg {String} sortableColumns
     * are the columns sortable (default: false)
     */
    sortableColumns: false,

    /**
     * @cfg {Object} rows
     * The defition how to handle the record in this component
     * //TODO, needs some more documentation here
     */
    rows: [],

    listeners: {
        'beforeedit': function () {
            return  false;
        }
    },

    config: {
        record: null
    },

    sourceConfig: [],

    initComponent: function () {
        var me = this;

        var store = Ext.create('Ext.data.Store', {
            fields: ['id', 'label', 'value']
        });

        Ext.apply(me, {
            store: store,
        });

        me.callParent(arguments);
    },

    /**
     * This method requires an Ext.data.Model
     * - text (required, label)
     * - val (required, value)
     * - dataIndex
     * @param record
     */
    loadRecord: function (record) {
        var me = this;
        var store = me.getStore();
        store.removeAll();

        me.setRecord(record);

        var id = 0;

        me.rows.map(function(item)  {
            var hidden = false;
            var val = record.get(item.dataIndex);

            var fnRenderer = function(val) {
                return val;
            };

            var cellWrap = function (val, meta) {
                meta.tdCls = Ext.baseCSSPrefix + 'wrap-cell';
                return val;
            };

            if (item.hasOwnProperty('renderer')) {
                val = item.renderer(val, record);

                if (me.sourceConfig.hasOwnProperty(item.text)) {

                    if (me.sourceConfig[item.text].hasOwnProperty('renderer')) {
                        /* can't have 2 renderers */
                        delete me.sourceConfig[item.text]['renderer'];
                    }

                    /* simple renderer to make the renderer work */
                    Ext.apply(me.sourceConfig[item.text], {
                        renderer: fnRenderer
                    });

                } else {

                    /* simple renderer to make the renderer work */
                    me.sourceConfig[item.text] = {
                        renderer: fnRenderer
                    }

                }
            }

            if (item.hasOwnProperty('cellWrap')) {
                if (me.sourceConfig.hasOwnProperty(item.text)) {
                    Ext.apply(me.sourceConfig[item.text], {
                        renderer: cellWrap
                    });
                } else {
                    me.sourceConfig[item.text] = {
                        renderer: cellWrap
                    }
                }
            }

            if (item.hasOwnProperty('keepLineBreaks')) {
                if (val.indexOf('\n') > -1) {
                    val = val.replace(/\n/g, '<br />');
                }
            }

            if (item.hasOwnProperty('hidden')) {
                hidden = item.hidden;
            }

            if (hidden === false) {
                store.add({
                    'id': id,
                    'label': item.text,
                    'value': val
                });

                id++;
            }
        });
    }
});