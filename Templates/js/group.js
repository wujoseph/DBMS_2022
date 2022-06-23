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
        /*
        for(var i in json_data[1]){
          members_st += json_data[1][i] + ', '
        }*/
        let member_num = 0
         for(var i in json_data[1]){          
          members_st += json_data[1][i]
          member_num++;
          if(member_num < Object.keys(json_data[1]).length)members_st += ', '
          
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
  form_data.append('user_id', getCookieByName('user_id'));
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

function add_group_task(){
  var form_data = new FormData();
  form_data.append('user_id', getCookieByName('user_id'));
  form_data.append('group_id', getCookieByName('group_id'));

  form_data.append('title', document.getElementById("TaskName").value);
  form_data.append('note', document.getElementById("note").value);
  form_data.append('start_date', document.getElementById("Start").value);
  form_data.append('end_date', document.getElementById("End").value);
  

  var xhr = new XMLHttpRequest();  
  xhr.responseType = 'json';
  xhr.open("post", "/Project/add_group_task");
  xhr.send(form_data);

  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4){
      if (xhr.status == 200){
        window.location.href = '/Project/groupPage';//refresh the task page
      }
    }    
  }
}

Date.prototype.timeNow = function () {
     return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}

function send_message(){
  var str = document.getElementById("input").value
  var mes_fra = document.getElementsByClassName("messageframe")[0].cloneNode(true);
  var mes_box = mes_fra.childNodes[1];
  var mes = mes_box.childNodes[1];
  mes.innerHTML = str;
  mes_fra.removeAttribute('hidden');
  document.getElementsByClassName("chatbox")[0].appendChild(mes_fra);

  document.getElementById("input").value = "";

  var today = new Date();
  var time = new Date().timeNow();
  mes_fra.childNodes[3].innerHTML = time
  
  var form_data = new FormData();
  form_data.append('group_id', getCookieByName('group_id'));
  form_data.append('text', str);
  form_data.append('time', time);

  var xhr = new XMLHttpRequest();  
  xhr.responseType = 'json';
  xhr.open("post", "/Project/add_comment");
  xhr.send(form_data);

  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4){
      if (xhr.status == 200){
        window.location.href = '/Project/groupPage';//refresh the task page
      }
    }    
  }
}

function comment_info(){
  var form_data = new FormData();
  form_data.append('group_id', getCookieByName('group_id'));

  var xhr = new XMLHttpRequest();  
  xhr.responseType = 'json';
  xhr.open("post", "/Project/comment_info");
  xhr.send(form_data);

  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4){
      if (xhr.status == 200){
        var json_data = xhr.response;
        for(let i = 0;i<json_data.length;i++){
          var text = json_data[i][0];
          var time = json_data[i][1];

          var mes_fra = document.getElementsByClassName("messageframe")[0].cloneNode(true);
          var mes_box = mes_fra.childNodes[1];
          var mes = mes_box.childNodes[1];
          mes.innerHTML = text;
          mes_fra.removeAttribute('hidden');
          document.getElementsByClassName("chatbox")[0].appendChild(mes_fra);
          mes_fra.childNodes[3].innerHTML = time;
        }
      }
    }    
  }
}