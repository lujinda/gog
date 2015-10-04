exports.website = {
    'port': 1238,
    'host': '0.0.0.0'
}
exports.proxy = {
    'host': 'www.google.com.hk',
    'port': 443
}

exports.session = {
    'db': 2,
    'prefix': '',
    'session_secret': 'absdfwer',
    'timeout': 86400 * 30
}

/*下面是submail的配置，是用来代理系统出错时发布邮件的，如果你不需要报警，可以将proxy.js中跟email有关的代码删除*/
exports.submail = {
    'appid': '你的submail的id',
    'appkey': 'xxx',
    'template_id': 'xxx',
    'apiurl': 'https://api.submail.cn/mail/xsend'
}

