function parseCookie() {
    var cookieObj = {};
    var cookieAry = document.cookie.split(';');
    var cookie;
    
    for (var i=0, l=cookieAry.length; i<l; ++i) {
        cookie = jQuery.trim(cookieAry[i]);
        cookie = cookie.split('=');
        cookieObj[cookie[0]] = cookie[1];
    }
    
    return cookieObj;
}


function getCookieByName(name) {
    var value = parseCookie()[name];
    if (value) {
        value = decodeURIComponent(value);
    }
    return value;
}

function add_task(task_name){
  const input = prompt("Add task name here:");

  var form_data = new FormData();
  form_data.append('title', input);
  form_data.append('user_id', getCookieByName('user_id'));
  var xhr = new XMLHttpRequest();  
  xhr.responseType = 'json';
  xhr.open("post", "/Project/addtask");
  xhr.send(form_data);

  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4){
      if (xhr.status == 200){
        window.location.href = '/Project/task';//refresh the task page
      }
    }    
  }
}


function user_page_get(){
  window.location.href = '/Project/userpage';
}

function user_page(){
  var form_data = new FormData();
  form_data.append('user_id', getCookieByName('user_id'));
  var xhr = new XMLHttpRequest();  
  xhr.responseType = 'json';
  xhr.open("post", "/Project/userpageinfo");
  xhr.send(form_data);
 
  xhr.onreadystatechange = function() { 
    if (xhr.readyState == 4){
      if (xhr.status == 200){
        var json_data = xhr.response;
        var group_num;
        if(json_data == null){
          group_num = 0;
        }else{
          group_num = json_data.length;
        }    

        //insert option of group
        for(let i =0;i<group_num;i++){
          option = document.createElement("option");
          const node = document.createTextNode(json_data[i]['name']);
          option.appendChild(node);
          option.setAttribute('value',i+1);
          option.setAttribute('group_id',json_data[i]['id']);
          document.getElementById("GroupList").appendChild(option);
        }
        document.getElementById('username').innerHTML = getCookieByName('username');
        document.getElementById('groupnums').innerHTML = group_num;
      }
    }
  }    

}



function login(){
  var form_data = new FormData();
  var email = document.querySelector('#email').value
  var password = document.querySelector('#password').value

  form_data.append('email', email);
  form_data.append('password', password);
	//alert(document.querySelector('#username').value)
  // form_data.append('xxx', $("#xxx").text());
  //附帶text也是可以的

  var xhr = new XMLHttpRequest();  
    xhr.responseType = 'json';
    xhr.open("POST", "/Project");
    xhr.send(form_data); 
    
    xhr.onreadystatechange = function() { 
      // If the request completed, close the extension popup
      
      if (xhr.readyState == 4){
        if (xhr.status == 200){
          var json_data = xhr.response;          
          if(json_data.status === 'login_success'){//change the page to userpage
            //user_page()
            document.cookie = "user_id=" + getCookieByName('user_id') +"; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/";
            document.cookie = "username=" + getCookieByName('username') +"; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/";

            document.cookie = "user_id=" + json_data.user_id;
            document.cookie = "username=" + json_data.username;
            window.location.href = '/Project/userpage';
            console.alert('login success')
            //{'user_id': json_data.user_id,'username':username}
            
          }else{        
            
            document.getElementById('login_fail').removeAttribute('hidden');
            console.alert('login fail')
          }
        }
      };
    }
/*
$.ajax({
      type: "POST",
      url: "/login/input",
      data: form_data,
      success: (data) => {
        console.log(data.validate);

        //alert(data.validate)
        //alert(data.Rtnfood)
        //也可以用jquery來呈現結果
      },
      contentType: false,
      processData: false,
      dataType: "json"
    });
*/
}

function register(){
  var form_data = new FormData();
  var username = document.querySelector('#username').value
  var password = document.querySelector('#password').value

  form_data.append('username', document.querySelector('#username').value);
  form_data.append('password', document.querySelector('#password').value);

  var xhr = new XMLHttpRequest();  
    xhr.responseType = 'json';
    xhr.open("POST", "/Project/register");
    xhr.send(form_data); 
    
    xhr.onreadystatechange = function() { 
      // If the request completed, close the extension popup
      
      if (xhr.readyState == 4){
        if (xhr.status == 200){
          var json_data = xhr.response;          
          if(json_data.status === 'register_success'){//change the page to userpage
            //user_page()
            document.getElementById('response').innerHTML='successful register';
            document.getElementById('response').style.display='block';
            document.cookie = "user_id=" + json_data.user_id;
            document.cookie = "username=" + username;
            window.location.href = '/Project/userpage';
            //{'user_id': json_data.user_id,'username':username}
            
          }else{          
            document.getElementById('response').innerHTML='fail register';
            document.getElementById('response').style.display='block';
          }
        }
      };
    }
}
//?
function user_analysis(){
  window.location.href = '/Project/userAnalysis';
}

function user_analysis_info(){
  var form_data = new FormData();
  form_data.append('user_id', getCookieByName('user_id'));
  var xhr = new XMLHttpRequest();  
  xhr.responseType = 'json';
  xhr.open("post", "/Project/userAnalysisInfo");
  xhr.send(form_data);
 
  xhr.onreadystatechange = function() { 
    if (xhr.readyState == 4){
      if (xhr.status == 200){
        var json_data = xhr.response;
        console.log(json_data)
        for(var key in json_data){      
          const para = document.createElement("p");
          const node = document.createTextNode( key + " " + json_data[key][0]+ "/" + json_data[key][1] + " " + json_data[key][2]);
          para.appendChild(node);
          document.getElementById("analysis").appendChild(para);
          
        } 
      }
    }    
  }
}

//not sure, first try the submit form
function change_name(){
  var form_data = new FormData();
  form_data.append('user_id', getCookieByName('user_id'));
  var username = document.getElementById("inputUserSetting").value
  console.log(username)
  form_data.append('username',username);
  //delete cookie before update it
  document.cookie = "username=" + getCookieByName('username') +"; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/";
  document.cookie = "username=" + username;//update cookie so other page can be refreshed
  var xhr = new XMLHttpRequest();  
  xhr.responseType = 'json';
  xhr.open("post", "/Project/changeName");
  xhr.send(form_data);
  
  xhr.onreadystatechange = function() { 
    if (xhr.readyState == 4){
      if (xhr.status == 200){
        
        window.location.href = '/Project/userpage';
        //console.log('???????????')
      }
    }    
  }
}


function create_group(){
  var form_data = new FormData();
  form_data.append('user_id', getCookieByName('user_id'));
  var group_name = document.getElementById("create_group_input").value;
  //console.log(group_name)
  form_data.append('group_name',group_name);

  var xhr = new XMLHttpRequest();  
  xhr.responseType = 'json';
  xhr.open("post", "/Project/create_group");
  xhr.send(form_data);
  
  xhr.onreadystatechange = function() { 
    if (xhr.readyState == 4){
      if (xhr.status == 200){        
        window.location.href = '/Project/userpage';
      }
    }    
  }
}

function join_group(){
  var form_data = new FormData();
  form_data.append('user_id', getCookieByName('user_id'));
  var group_id = document.getElementById("join_group_input").value;
  form_data.append('group_id',group_id);

  var xhr = new XMLHttpRequest();  
  xhr.responseType = 'json';
  xhr.open("post", "/Project/join_group");
  xhr.send(form_data);
  
  xhr.onreadystatechange = function() { 
    if (xhr.readyState == 4){
      if (xhr.status == 200){        
        var res = xhr.response;
        console.log(res)
        if(res === "not exist"){
          var warning = document.getElementById("join_group_warning")
          warning.removeAttribute('hidden');
          warning.innerHTML = "Group ID not exist"
        }else if(res === "exist"){
          var warning = document.getElementById("join_group_warning")
          warning.removeAttribute('hidden');
          warning.innerHTML = "Already in the group"
        }else{          
          window.location.href = '/Project/userpage';
        }
        
      }
    }    
  }
}


function change_group_page(){
  //create cookie of group_id and change to group page
  var select = document.getElementById("GroupList");
  if(select.value === 0)return;//default selection

  var childs = select.childNodes;
  //console.log(select.value);
  var option = childs[4+parseInt(select.value)];
  var group_id = option.getAttribute('group_id');
  console.log(group_id);

  //create an new cookie to access group page, also delete former id
  document.cookie = "group_id=" + group_id +"; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/";
  document.cookie = "group_id=" + group_id;//update cookie so other page can be refreshed

  window.location.href = '/Project/groupPage';
}


function close_new_task_window(){
  document.getElementById("background").setAttribute('hidden',true);
  document.getElementById("input_task").setAttribute('hidden',true);
}


function new_task_window(){
  document.getElementById("background").removeAttribute('hidden');
  document.getElementById("input_task").removeAttribute('hidden');
}
