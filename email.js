var http = require('http');
var url = require('url');
var querystring = require('querystring');

var submail_config = require('./config').submail;
function generate_request(email, _vars){
    _vars = _vars && JSON.stringify(_vars) || undefined;
    var url_parts = url.parse(submail_config.apiurl);
    var options = {
        'appid': submail_config.appid,
        'to': email,
        'project': submail_config.template_id,
        'vars': _vars,
        'signature': submail_config.appkey
    };
    var post_data = querystring.stringify(options);
    var request = http.request({
        host: url_parts.host,
        path: url_parts.path,
        method: 'POST',
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': post_data.length
        }
        });
    request.write(querystring.stringify(options));
    return request;
}

function send_email(email, _vars){
    var request = generate_request(email, _vars);
    request.on('response', function(response){
        response.pipe(process.stdout);
    });
    request.end();
}
module.exports.send_email = send_email;

if (require.main == module){
    send_email('q8886888@qq.com', {'headers': 'sdsdf'});
}

