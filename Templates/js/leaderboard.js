function leaderboard_info(){

  var group_id = getCookieByName('group_id');

  var form_data1 = new FormData();
  form_data1.append('group_id',group_id);


  var xhr1 = new XMLHttpRequest();
  xhr1.responseType = 'json';
  xhr1.open("post","/Project/groupPageInfo");
  xhr1.send(form_data1);
  xhr1.onreadystatechange = function() { 
    if (xhr1.readyState == 4){
      if (xhr1.status == 200){
        var json_data = xhr1.response;
     	console.log(json_data[0])
        document.getElementById("group_name").innerHTML = json_data[0];
      }
    }    
  }
  var form_data = new FormData();
  form_data.append('group_id',group_id);
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  xhr.open("post","/Project/leaderboard_info");
  xhr.send(form_data);

  xhr.onreadystatechange = function() { 
    if (xhr.readyState == 4){
      if (xhr.status == 200){
        var json_data = xhr.response;
        //var total = json_data.length;
        
        for(let i = 0;i<json_data.length;i++){
            var node = document.getElementById("copy").cloneNode(true);
            node.removeAttribute('id');
            node.removeAttribute('hidden');
            node.childNodes[1].innerHTML = i+1;
            node.childNodes[5].innerHTML = json_data[i][2];
            node.childNodes[7].innerHTML = json_data[i][0];
            node.childNodes[9].innerHTML = json_data[i][4];
            insert.appendChild(node);
        }
      }
     }
  }
}
