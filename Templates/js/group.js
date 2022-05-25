function group_info(){
  var group_id = getCookieByName('group_id');

  var form_data = new FormData();
  form_data.append('group_id',group_id);

  var xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  xhr.open("post","/Project/groupPageInfo");
  xhr.send(form_data);

  xhr.onreadystatechange = function() { 
    if (xhr.readyState == 4){
      if (xhr.status == 200){
        var json_data = xhr.response;
        document.getElementById('group_id').innerHTML = group_id;
        document.getElementById('group_name').innerHTML = json_data[0];
        var members_st = ""
        for(var i in json_data[1]){
          members_st += json_data[1][i] + ', '
        }
        console.log(members_st)
        document.getElementById('group_members').innerHTML = members_st;
        //window.location.href = '/Project/groupPage';
      }
    }    
  }
}

function group_task_info(){
  var form_data = new FormData();
  form_data.append('group_id', getCookieByName('group_id'));
  
  var xhr = new XMLHttpRequest();  
  xhr.responseType = 'json';
  xhr.open("post", "/Project/group_task_info");
  xhr.send(form_data);
 
  xhr.onreadystatechange = function() { 
    if (xhr.readyState == 4){
      if (xhr.status == 200){
        var json_data = xhr.response;
        //console.log(json_data)
        var insert = document.getElementById("insert");
        for(let i = 0;i<json_data.length;i++){
          var node = document.getElementById("copy").cloneNode(true);
          node.removeAttribute('id');
          node.removeAttribute('hidden');
          //console.log(node.childNodes);
          node.childNodes[1].innerHTML = json_data[i]['title'];
          node.childNodes[5].innerHTML = json_data[i]['description'];
          //node.childNodes[7].innerHTML = json_data[i]['status'];
          //node.childNodes[9].innerHTML = json_data[i]['title'];
          node.childNodes[11].innerHTML = json_data[i]['start_date'];
          node.childNodes[13].innerHTML = json_data[i]['end_date'];
          node.setAttribute('task_id', json_data[i]['task_id']);

          //status
          node.childNodes[7].innerHTML = json_data[i]['done_number']
          if(json_data[i]['status'] === 0){
            node.childNodes[9].firstChild.checked=false;
          }else{
            node.childNodes[9].firstChild.checked=true;
          }
          

          insert.appendChild(node);
        } 
      }
    }    
  }
}

function group_complete_click(task){
  var status;
  if(task.checked){
    status = 1;
  }else{
    status = 0;
  }
  var td = task.parentNode;
  var tr = td.parentNode;
  //console.log(tr);
  //console.log(tr.getAttribute('task_id'));
  var form_data = new FormData();
  var task_id = tr.getAttribute('task_id')
  form_data.append('task_id',task_id);
  form_data.append('user_id', getCookieByName('user_id'));
  form_data.append('group_id', getCookieByName('group_id'));
  form_data.append('status',status);
  var xhr = new XMLHttpRequest();  
  xhr.responseType = 'json';
  xhr.open("post", "/Project/group_task_update");
  xhr.send(form_data);
 
  xhr.onreadystatechange = function() { 
    if (xhr.readyState == 4){
      if (xhr.status == 200){
        window.location.href = '/Project/groupPage';
      }
    }    
  }
}