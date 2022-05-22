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
    window.location.href = '/Project/userpage';//refresh the task page
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
    var json_data = xhr.response;
    console.log(json_data)
    var complete = json_data.complete
    var left = json_data.left
    var tasks = json_data.tasks

    document.getElementById('user_id').innerHTML = getCookieByName('user_id');
    document.getElementById('username').innerHTML = getCookieByName('username');
    document.getElementById('mission_c').innerHTML = complete;
    document.getElementById('mission_l').innerHTML = left;
    for(let i = 0;i<tasks.length;i++){
      const para = document.createElement("p");
      var status = ""
      if(tasks[i].status === 0){
        status = "未完成"
      }else{
        status = "完成"
      }

      const node = document.createTextNode(tasks[i].title + " " + status);
      para.appendChild(node);
      document.getElementById("task").appendChild(para);
    }
  }
    

}



function login(){
  var form_data = new FormData();
  var username = document.querySelector('#username').value
  var password = document.querySelector('#password').value

  form_data.append('username', document.querySelector('#username').value);
  form_data.append('password', document.querySelector('#password').value);
	//alert(document.querySelector('#username').value)
// form_data.append('xxx', $("#xxx").text());
//附帶text也是可以的

  var xhr = new XMLHttpRequest();  
    xhr.responseType = 'json';
    xhr.open("POST", "/Project/input");
    xhr.send(form_data); 
    
    xhr.onreadystatechange = function() { 
      // If the request completed, close the extension popup
      
      if (xhr.readyState == 4){
        if (xhr.status == 200){
          var json_data = xhr.response;          
          if(json_data.status === 'login_success'){//change the page to userpage
            //user_page()
            document.getElementById('response').innerHTML='successful login';
            document.getElementById('response').style.display='block';
            document.cookie = "user_id=" + json_data.user_id;
            document.cookie = "username=" + username;
            window.location.href = '/Project/userpage';
            //{'user_id': json_data.user_id,'username':username}
            
          }else{          
            document.getElementById('response').innerHTML='username or password not correct';
            document.getElementById('response').style.display='block';
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


