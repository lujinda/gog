var https = require('https');
var config = require('./config').proxy;
var zlib = require('zlib');
var util = require('./util'); 
var fs = require('fs');
var expire_data = new util.ExpireData();
var replase_format = [];
var send_email = require('./email').send_email;

var js_content = null;
var COOKIE = 'PREF=ID=1111111111111111:FF=2:LD=zh-CN:TM=1442195499:LM=1442195499:V=1:S=BbOVLcMsZb-BmAGs; NID=71=mrFSOAmzMlkYtr0on7JAn8rApjQiNCA4AQzroD68lxSwQZv5bXjgM9YstqPY5w0QQJhyvtJgTeJTTxahBNTtqj93m_3P1TT1pvfyCXowv_aRCWNkXwWqVSH_m1Qcm9pr'

fs.readFile(__dirname + '/js.js', function(err, data){
        if(err){
            console.log(err);
            return;
        }
        js_content = data;
    });

function get_request_data(request){
    var headers = util.deepcopy(request.headers);
    headers.cookie = COOKIE;
    headers.host= config.host;
    var headser = {};
    var _data = {
        'host': config.host,
        'port': config.port,
        'method': 'GET',
        'path': request.originalUrl,
        'headers': headers
    };
    return _data
}

function process_body(body, res, my_host){
    var content_type = res.headers['content-type'];
    if (!content_type){
        return body;
    }
    content_type = content_type.split(';')[0].trim();
    if (!body){
        return body;
    }
    switch (content_type){
        case 'text/html':
            break;
        default:
            return body;
    }
    var target_host = 'https?://' + config.host;
    var re = new RegExp(target_host, 'g');
    var new_body = body.replace(re, 'http://' + my_host);

    if (js_content){
        new_body = new_body.replace('</html>', 
                String.format('</html><script>{0}</script>',
                    js_content));
    }
    return new_body;
}

function pipe_res(res){
    switch (res.headers['content-encoding']){
        case 'gzip':
            var _pipe = zlib.createGunzip();
            break;
        default:
            return res;
    }
    res.pipe(_pipe);
    return _pipe
}

function generate_cookies(set_cookie){
    var cookies = [];
    if (!set_cookie){
        return '';
    }
    for (var i in set_cookie){
        var _cookie = set_cookie[i].split(';')[0];
        cookies.push(_cookie);
    }
    return cookies.join('; ');
}

function update_cookie(callback){
    var request = https.request({'host': 'www.google.com.hk', 'path': '/', 'port': 443}, function(response){
        var cookies = generate_cookies(response.headers['set-cookie']);
        console.log(cookies);
        COOKIE = cookies;
        if(callback){
            callback();
        }
    });
    request.end();
}

exports.handler = function(request, response){
    var request_data = get_request_data(request);
    var proxy_req = https.request(request_data, function(proxy_res){
        var _pipe = pipe_res(proxy_res);
        var body = '';
        _pipe.on('data', function(chunk){
            body += chunk.toString('binary'); // 以二进制方式存起来
        }).on('end', function(){
            // 设置http response headers
            var client_res_header = ['set-cookie', 'date', 'content-type'];
            if (proxy_res.statusCode == 302){
                console.log('302');
                var counter_302 = expire_data.incr('counter_302');
                console.log(counter_302);
                if (counter_302 == 1){
                    expire_data.expire('counter_302', 30); // 只有在30秒内连接发生多次302，则认定是程序出了问题
                }
                if (counter_302 == 3){ // 当连接发生了3次，则认定是程序出了问题
                    expire_data.clear_expire('counter_302');
                    console.log('出现了多次302,不正常了');
                    send_email('q8886888@qq.com', 
                        {'headers': util.headers_lines(request.headers).join('<br/>')});
                    response.end();
                    return;
                }
                update_cookie(function(){
                    response.redirect(request.originalUrl);
                });
            }else{

                for (var i in client_res_header){
                    var k = client_res_header[i];
                    response.set(k, proxy_res.headers[k]);
                }
                body = process_body(body, proxy_res, request.get('host'));
                response.set('content-length', body.length);
                response.set('cache-control', 'max-age=86400');
                response.status(proxy_res.statuscode || 200).write(body, 'binary'); // 以二进制方式写入
                response.end();
            }
        });
    });
    proxy_req.end();
}

