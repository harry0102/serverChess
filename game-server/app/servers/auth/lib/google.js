/**
 * Created by tony on 2016/9/13.
 * 谷歌登录sdk接入模块
 */
var crypto = require('crypto'),
    util = require('util');

var request = require('request');

var conf = require('../../../../config/auth.json').google,
    Code = require('../../../shared/code');

var exp = module.exports = {};

/*
*  用客户端传过来的数据 验证google平台登录
* */
exp.authCheck=function( opts , cb )
{
    
};