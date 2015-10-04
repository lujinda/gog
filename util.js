function deepcopy(s_obj){
    if (!s_obj){
        return s_obj;
    }
    var d_obj = null;
    switch (s_obj.constructor){
        case Object:
            d_obj = {};
            break;
        case Array:
            d_obj = [];
            break;
        default:
            return s_obj;
    }

    for (var _k in s_obj){
        var _v = s_obj[_k];
        d_obj[_k] = deepcopy(_v);
    }

    return d_obj;
}


String.format = function(src){
    if (arguments.length == 0) return null;     
        var args = Array.prototype.slice.call(arguments, 1); 
            
            return src.replace(/\{(\d+)\}/g, function(m, i){    return args[i];  }); 
            
};

function rand_int(begin, end){
    return parseInt(Math.random() * (end - begin + 1) + begin);
}
function rand_choice(array){
    return array[rand_int(0, array.length - 1)];
}

function ExpireData(){
    this._data_object = {};
    this._timer = {};
    this.set = function(name, value, expire){ // expire单位是秒
        if (!(name && value)){
            throw Error('must have be name and value');
        }
        this._data_object[name] = value;
        if (expire){
            this.expire(name);
        }
    };
    this.get = function(name){
        return this._data_object[name];
    };

    this.clear_expire = function(name){
        var _t = this._timer[name];
        if (_t){
            clearTimeout(_t);
            delete this._timer[name];
        }
    };

    this.expire = function(name, expire){
        var _data_object = this._data_object;
        var _timer = this._timer;
        var _t = setTimeout(function(){
            delete _data_object[name];
            delete _timer[name];
        }, parseInt(expire * 1000));
        this._timer[name] = _t
    }

    this.incr = function(name, sep){
        sep = sep || 1;
        var value = this._data_object[name];
        if (! value){
            value = 0;
        }
        value += sep;
        this._data_object[name] = value;
        return value;
    }
}

function headers_lines(headers){
    var lines = [];
    for (var k in headers){
        var v = headers[k];
        lines.push(k + ':' + v);
    }
    return lines;
}

exports.deepcopy = deepcopy;
exports.format = String.format;
exports.rand_int = rand_int;
exports.rand_choice = rand_choice;
exports.ExpireData = ExpireData;
exports.headers_lines = headers_lines;

