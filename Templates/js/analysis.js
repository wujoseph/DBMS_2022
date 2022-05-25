function analysis_info(){
  var form_data = new FormData();
  form_data.append('user_id', getCookieByName('user_id'));
  var xhr = new XMLHttpRequest();  
  xhr.responseType = 'json';
  xhr.open("post", "/Project/analysisInfo");
  xhr.send(form_data);
 
  xhr.onreadystatechange = function() { 
    if (xhr.readyState == 4){
      if (xhr.status == 200){
        var json_data = xhr.response;
        //var total = json_data.length;
        var total = Object.keys(json_data).length
        var complete = 0;
        var key_li = []
        for(var key in json_data){
          complete += json_data[key][0];
          key_li.push(key)
        }
        var insert = document.getElementById("insert");
        var node = document.getElementById("copy").cloneNode(true);
        node.removeAttribute('id');
        node.removeAttribute('hidden');
        node.childNodes[1].innerHTML = "Total";
        node.childNodes[5].innerHTML = complete;
        node.childNodes[7].innerHTML = total;
        node.childNodes[9].innerHTML = parseFloat(complete/total).toFixed(2)*100+"%";
        insert.appendChild(node);

        key_li.sort().reverse()
        console.log(key_li)
        for(let i = 0;i<key_li.length;i++){
            var node = document.getElementById("copy").cloneNode(true);
            node.removeAttribute('id');
            node.removeAttribute('hidden');
            node.childNodes[1].innerHTML = key_li[i];
            node.childNodes[5].innerHTML = json_data[key_li[i]][0];
            node.childNodes[7].innerHTML = json_data[key_li[i]][1];
            node.childNodes[9].innerHTML = json_data[key_li[i]][2];
            insert.appendChild(node);
        }
      }
     }
  }
}