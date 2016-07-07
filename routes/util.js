var crypto = require('crypto');

//加盐，生产一个随机数，范围大一些
function getSalt = function(){
     return parseInt(math.random()*9000000+1000000)
}

//预留吧。。。没注册模块
function getSignedPwd = function(pwd, sault){

    var tmpPwd = pwd + "123**#)+_fe}"+sault;
	return crypto.createHash('md5').update(tmpPwd).digest('hex');
}

// exports.hex_sha1 = function(str){
//     return hex_sha1(str+"#x123.(8^*"+getSalt());
// }