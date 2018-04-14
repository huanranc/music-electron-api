// https://github.com/darknessomi/musicbox/wiki/
'use strict'
const crypto = require('crypto')
const bigInt = require('big-integer')
const modulus =
  '00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7'
const nonce = '0CoJUm6Qyw8W8jud'
const pubKey = '010001'

String.prototype.hexEncode = function() {
  let hex, i

  let result = ''
  for (i = 0; i < this.length; i++) {
    hex = this.charCodeAt(i).toString(16)
    result += ('' + hex).slice(-4)
  }
  return result
}

//算法先通过createSecrectKey生成一个16位的随机字符串作为密钥secKey。 secKey=>证书管理密钥
//然后将明文text进行两次AES加密获得密文encText。
//secKey是客户端生产的所以还要对RSA加密在传给服务端。

function createSecretKey(size) {
  const keys = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let key = ''
  for (let i = 0; i < size; i++) {
    let pos = Math.random() * keys.length
    pos = Math.floor(pos)
    key = key + keys.charAt(pos)
  }
  return key
}

//AES加密的具体算法为: AES-128-CBC，输出格式为 base64 
//AES加密时需要指定 iv：0102030405060708 

function aesEncrypt(text, secKey) {
  const _text = text
  const lv = new Buffer('0102030405060708', 'binary')
  const _secKey = new Buffer(secKey, 'binary')
  const cipher = crypto.createCipheriv('AES-128-CBC', _secKey, lv)  //Cipher类是Node.js的crypto模块的封装对象之一
  let encrypted = cipher.update(_text, 'utf8', 'base64')
  encrypted += cipher.final('base64')
  return encrypted
}


//RSA 加密采用非常规填充方式，既不是PKCS1也不是PKCS1_OAEP，
//网易的做法是直接向前补0 
//这样加密出来的密文有个特点：加密过程没有随机因素，明文多次加密后得到的密文是相同的 
//然而，我们常用的 RSA 加密模块均不支持此种加密
//输入过程中需要对加密字符串进行 hex 格式转码


//JavaScript中的数字是没有前置0的，因此需要我们自己进行操作来添加前置0，而且还得转换成字符串。
function zfill(str, size) {
  while (str.length < size) str = '0' + str
  return str
}

function rsaEncrypt(text, pubKey, modulus) {
  const _text = text.split('').reverse().join('')
  const biText = bigInt(new Buffer(_text).toString('hex'), 16),
    biEx = bigInt(pubKey, 16),
    biMod = bigInt(modulus, 16),
    biRet = biText.modPow(biEx, biMod)
  return zfill(biRet.toString(16), 256)
}

function Encrypt(obj) {
  const text = JSON.stringify(obj)
  const secKey = createSecretKey(16)
  const encText = aesEncrypt(aesEncrypt(text, nonce), secKey)
  const encSecKey = rsaEncrypt(secKey, pubKey, modulus)
  return {
    params: encText,
    encSecKey: encSecKey
  }
}

// AES加密是把歌曲id用16位数随机数作为key两次aes加密得到第一个参数params
// 那么网易肯定需要解密得到歌曲id才能返回歌曲给我们，
// 所以encSecKey这个参数是把16位数随机数加密然后传输到服务端，
// 然后服务端RSA解密通过得到16位随机数当作AES解密的key从而得到歌曲的id
// 然后返回对应的mp3播放地址等信息

module.exports = Encrypt