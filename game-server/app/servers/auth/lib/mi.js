/**
 * Created by kilua on 2015-10-07.
 * 小米SDK接入模块
 */

var crypto = require('crypto'),
    util = require('util');

var request = require('request');

var conf = require('../../../../config/auth.json').mi,
    Code = require('../../../shared/code');

var exp = module.exports = {};

/*
*   组织待签名字符串
* */
function getPlainText(appId, session, uid) {
    //按字母顺序排序(不包含 signature),
    //排序后拼接成par1=val1&par2=val2&par3=val3
    //没有值的参数请不要参与签名
    var plainText = '';
    if (appId) {
        plainText += util.format('appId=%s', appId);
    }
    if (session) {
        plainText += util.format('&session=%s', session);
    }
    if (uid) {
        plainText += util.format('&uid=%s', uid);
    }
    return plainText;
}

/*
*   签名
* */
function sign(algorithm, encryptKey, plainText) {
    var encoder = crypto.createHmac(algorithm, encryptKey);
    encoder.update(plainText);
    return encoder.digest('hex');
}

var errCodeDict = {
    200: Code.OK,
    1515: Code.CONNECTOR.APP_ID_ERROR,
    1516: Code.CONNECTOR.FA_MAC_ERROR,
    1520: Code.CONNECTOR.TOKEN_ERROR,
    1525: Code.CONNECTOR.SIGNATURE_ERROR
};

/*
*   用客户端传过来的数据库，调用小米登录验证接口
* */
exp.authCheck = function (opts, cb) {
    var uid = opts.uid.replace('mi_', '');
    var qs = {
        appId: conf.appId,
        session: opts.token,
        uid: uid,
        signature: sign(conf.algorithm, conf.appSecret, getPlainText(conf.appId, opts.token, uid))
    };
    console.log('authCheck url = %s, qs = %j', conf.url, qs);
    request({url: conf.url, qs: qs}, function (err, response, body) {
        if (err) {
            console.log(err);
            return cb(err.message, {result: false, code: Code.FAIL});
        }
        console.log('get response: ' + response.statusCode);
        if (response.statusCode !== 200) {
            return cb('statusCode error', {result: false, code: Code.FAIL});
        }
        console.log(body);
        try {
            var res = JSON.parse(body);
            cb(null, {
                result: res.errcode === 200,
                code: errCodeDict[res.errcode] || Code.FAIL, uid: [conf.prefix, opts.uid].join('')
            });
        } catch (ex) {
            cb(null, {result: false, code: Code.FAIL});
        }
    });
};