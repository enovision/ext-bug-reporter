/**
 * @class BugReporter.singleton.Settings
 *
 * @namespace BugReporter.singleton
 *
 * @constructor
 * @param {object} Settings
 * @author J.J. van de Merwe, Enovision GmbH
 * @version 6.0.1
 */

Ext.define('BugReporter.singleton.Settings', {

    requires: [
        'Ext.data.JsonStore',
        'Ext.data.Store',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json'
    ],

    alternateClassName: ['BugReporterSettings'],
    singleton: true,

    callback: false,

    config: {
        packageName: 'ext-bug-reporter',
        /**
         * When the BugReporter packages is not added as a
         * remote package to your application, you have to
         * change the "enovironment" value to "local"
         */
        environment: 'remote',
        /**
         * Usually you don't have to change anything below this
         */
        localPath: '../packages/local/ext-bug-reporter/',
        remotePath: '../packages/remote/ext-bug-reporter/',
        packagePath: false,
        urlSettings: null,
        urlLanguage: null,
        urlSubmit: null,
        urlReport: null,
        reportLoader: null,
        imgPath: null,
        language: 'en',
        langData: false,
        dateFmt: 'd/m/Y',
        dateFmtLong: 'd/m/Y H:i:s',
        submit: null,
        priority: null,
        types: null,
        modules: null,
    },

    constructor: function (config) {
        var me = this;

        me.initConfig(config);

        var packageName = this.getPackageName();
        me.setUrlSettings(Ext.getResourcePath('server/BugreporterSettings.php', null, packageName));
        // me.setUrlLanguage(Ext.getResourcePath('language/' + me.getLanguage() + '.json', null, packageName));
        me.setUrlSubmit(Ext.getResourcePath('server/Mailer.php', null, packageName));
        me.setUrlReport(Ext.getResourcePath('server/Report.php', null, packageName));
        me.setImgPath(Ext.getResourcePath('', null, packageName) + 'assets/images/');

        /* models for storing the combo settings */

        var convertIcon = function (val) {
            return me.getImgPath() + val;
        };

        var fields = ['key', 'value', {
            'name': 'icon' //,
            //convert: convertIcon
        }];

        /**
         * Types
         * @type {Ext.data.Store}
         */
        var BTstore = Ext.create('Ext.data.Store', {
            storeId: 'bugReporterTypes',
            fields: fields
        });
        /**
         * Priorities
         * @type {Ext.data.Store}
         */
        var BPstore = Ext.create('Ext.data.Store', {
            storeId: 'bugReporterPriority',
            fields: fields
        });
        /**
         * Modules
         * @type {Ext.data.Store}
         */
        var MDstore = Ext.create('Ext.data.Store', {
            storeId: 'bugReporterModules',
            fields: ['key', 'value']
        });

        Ext.Ajax.request({
            url: me.getUrlSettings(),
            method: 'POST',
            params: {
                imgpath: me.getPackagePath() + me.getImgPath()
            },
            success: function (result, action) {
                var fb = Ext.decode(result.responseText); //decode the response
                if (fb.success) {
                    var data = fb.data;

                    if (data.hasOwnProperty('priority')) {
                        var p = data.priority;
                        BPstore.add(p);
                        me.setPriority(p);
                    }
                    if (data.hasOwnProperty('types')) {
                        p = data.types;
                        BTstore.add(p);
                        me.setTypes(p);
                    }
                    if (data.hasOwnProperty('modules')) {
                        p = data.modules;
                        MDstore.add(p);
                        me.setModules(p);
                    }
                    if (fb.hasOwnProperty('submit')) {
                        me.setSubmit(fb.submit);
                    }
                    if (data.hasOwnProperty('language')) {
                        me.setLanguage(data.language);
                    }
                    if (data.hasOwnProperty('dateFmt')) {
                        me.setDateFmt(data.dateFmt);
                    }
                    if (data.hasOwnProperty('dateFmtLong')) {
                        me.setDateFmtLong(data.dateFmtLong);
                    }
                    /**
                     * Language
                     */

                    me.setUrlLanguage(Ext.getResourcePath('language/' + me.getLanguage() + '.json', null, packageName));

                    Ext.create('Ext.data.JsonStore', {
                        storeId: 'bugReporterLanguage',
                        proxy: {
                            type: 'ajax',
                            url: me.getUrlLanguage(),
                            reader: {
                                type: 'json',
                                rootProperty: 'language'
                            }
                        }
                    }).load({
                        callback: function (records) {
                            me.setLangData(records[0]);
                        }
                    });
                }
            }
        });
    }
});