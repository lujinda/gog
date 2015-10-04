if (document.location.pathname == '/search'){
    nodes=["gb_36", "gb_8", "gb_78", "gb_23", 'gb_49', 'gb_119', 'gbg', 'gbztms', 'pushdown', 'fbarcnt'];
    a_list =  document.getElementsByTagName('a');
    for (i=0;i<a_list.length;i++){
        a_list[i].onmousedown='';
    }
}

for (var i=0;i<nodes.length;i++){
    c=document.getElementById(nodes[i]);
    if (c == null)continue;
    c.parentNode.removeChild(c);
}

setTimeout("window.stop()", 2000);
