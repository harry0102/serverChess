/**
 * Created by employee11 on 2015/12/15.
 * 负责SDK接入模块的载入，并对外提供一个统一接口
 */

var fs = require('fs'),
    path = require('path');

var _ = require('underscore');

var authConfig = require('../../config/auth.json'),
    Code = require('../../shared/code');

// load all sorts of auth modules
var exp = module.exports = {};
exp.modules = {};
exp.enabled = {};

var files = fs.readdirSync(__dirname + '/lib').filter(function (file) {
    return (path.extname(file) === '.js' || path.extname(file) === '.jse');
});

var includeModules = files.map(function (fname) {
    return path.basename(fname, path.extname(fname));
});
// 将各个SDK接入模块作为此模块的属性
for (var i = 0, l = includeModules.length; i < l; i++) {
    var name = includeModules[i];

    Object.defineProperty(exp, name, {
        get: (function (name) {
            return function () {
                // lazy load.
                var mod = this.modules[name] || (this.modules[name] = require('./lib/' + name));
                this.enabled[name] = mod;
                return mod;
            }
        })(name)
    });
}
/*
*   对外提供的所有SDK接入的统一接口 (比如：handle模块会调用)
* */
exp.authCheck = function (thirdPartyName, opts, cb) {
    if (_.indexOf(includeModules, thirdPartyName) === -1) {
        console.log('authCheck module %s not found!', thirdPartyName);
        return cb(false, Code.CONNECTOR.PLATFORM_UNKNOWN);
    }
    // 检查是否开启
    var config = authConfig[thirdPartyName];
    if (!config || !config.enable) {
        console.log('authCheck module %s disabled', thirdPartyName);
        return cb(false, Code.CONNECTOR.PLATFORM_DISABLED);
    }
    console.log("thirdPartyName : %s ",thirdPartyName);
    exp[thirdPartyName].authCheck(opts, cb);
};