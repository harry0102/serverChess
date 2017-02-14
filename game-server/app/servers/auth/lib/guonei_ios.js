/**
 * Created by Administrator on 2016/2/24 0024.
 */

var exp = module.exports = {};
var request = require('request');
var utils = require('../../util/utils'),
    config = require('../../../config/auth.json').guonei_ios,
    Code = require('../../../shared/code');
exp.authCheck = function(opts, cb){
    var userInfo = {
        username: opts.uid,
        password: opts.pwd
    };
    var options = {
        uri: config.url,
        method: config.method,
        json: userInfo
    };

    request(options, function (err, res, body) {
        if (err) {
            console.log('authCheck failed!err = %s', err.stack);
            utils.invokeCallback(cb, err.message, {result: false, code: Code.FAIL});
            return;
        }
        if (res.statusCode !== 200) {
            console.log('authCheck failed!code = %s', res.statusCode);
            utils.invokeCallback(cb, 'statusCode error', {
                result: false,
                code: (body.message === 500) ? Code.DB_ERROR : Code.CONNECTOR.FA_PWD_ERROR
            });
            return;
        }
        console.log('authCheck success body =%s ', body.message);
        utils.invokeCallback(cb, null, {result: true, code: Code.OK, uid: [config.prefix, opts.uid].join('')});
    });
};