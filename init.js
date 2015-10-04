module.exports = function(req, res, next){
    res.set('Server', 'tuxpy proxy'); // 设置response headers
    res.removeHeader('X-Powered-By');
    next();
}

