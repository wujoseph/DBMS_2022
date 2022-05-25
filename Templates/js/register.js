function register_pre_check(){
  var email = document.getElementById("email").value
  var password = document.getElementById("password").value
  var password2 = document.getElementById("password2").value
  if(password !== password2){
  	document.getElementById("password_warn").removeAttribute('hidden');
  	return false;
  }

  var checked = document.getElementById("agree").checked;
  console.log(checked);
  if(checked === false){
  	document.getElementById("checked_warn").removeAttribute('hidden');
  	return false;
  }
  return true;
}

function register(){
  var result = register_pre_check();
  if(result === false){
  	console.log("return");
  	return;
  }
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var form_data = new FormData();
  form_data.append('email',email);
  form_data.append('password',password);

  var xhr = new XMLHttpRequest();  
    xhr.responseType = 'json';
    xhr.open("POST", "/Project/register_check");
    xhr.send(form_data); 
    
    xhr.onreadystatechange = function() { 
      // If the request completed, close the extension popup
      
      if (xhr.readyState == 4){
        if (xhr.status == 200){
          var json_data = xhr.response;          
          if(json_data.status === 'register_success'){//change the page to userpage
            //user_page()

            window.location.href = '/Project';
            
          }else{          
            document.getElementById("email_warn").removeAttribute('hidden');
          }
        }
      };
    }
}