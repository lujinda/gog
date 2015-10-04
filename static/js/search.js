var t = 0;
var new_item = null;
function get_keywork_list(key){
    var url = '/complete/search?client=hp&hl=zh-CN&xhr=t&q=' + key;
    clearTimeout(t);
    t = setTimeout(function()
        {$.ajax({type: 'GET',
        url:url,
        error:function(){
            return []
        },
        dataType:'json',
        beforeSend:function(){
            if (key.trim() != $('#search_input').val().trim()){
                return false;
            }
        },
        success:function(data){
            var list=[];
            for (i in data[1]){
                list[i] = data[1][i][0];
            }
            var topic_wrap = $('#search_topic_wrap').empty();
            new_item = null;
            for (i in list){
                topic_wrap.append('<a>' + list[i] + '</a>');
            }
            if (list.length > 0){
                topic_wrap.show();
                bind_mouse();
            }else{
                topic_wrap.hide();
            }
        },
    });
    }, 50);
}

function auto_topic(event){
    if (this.value.trim() == ''){
        $('#search_topic_wrap').empty().hide();
        return false;
    }
    var key_code = event.keyCode;
    if (key_code == 40){
        if (new_item == null){
            new_item = $('#search_topic_wrap').children().first();
        }else{
            new_item = new_item.next();
        }
        if (new_item.first().length == 0){
            new_item = $('#search_topic_wrap').children().first();
            $('#search_topic_wrap').children().last().attr('class', '');
        }
        new_item.prev().attr('class', '');
        new_item.attr('class', 'now_topic');
        $('#search_input').val(new_item.html());
    }else if (key_code == 38){
        if (new_item == null){
            new_item = $('#search_topic_wrap').children().last();
        }else{
            new_item = new_item.prev();
        }
        if (new_item.length == 0){
            new_item = $('#search_topic_wrap').children().last();
            $('#search_topic_wrap').children().first().attr('class', '');
        }
        new_item.attr('class', 'now_topic');
        new_item.next().attr('class', '');
        $('#search_input').val(new_item.html());

    }else{
        get_keywork_list(this.value);
    }
}
function bind_mouse(){
    $('#search_topic_wrap a').mouseover(function(){
        this.className = 'now_topic';
        new_item = $(this);
    }).mouseout(function (){
        this.className = '';
    }).click(function(){
        $('#search_input').val($(this).html());
        $('form').submit();
    });
}
