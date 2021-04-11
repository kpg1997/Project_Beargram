$("#inspection").click(function () {
  console.log("실행", $("#userId").val());
  window.open(
    "/sign/inspection",
    "Terms-of-Service",
    "width=600,height=230,scrollbars=yes"
  );
});

$("#userPwd").keyup(() => {
  const $pwd = $("#userPwd").val();
  const warning = document.getElementById("w-pwd");
  console.log($pwd.length)
  if ($pwd == "") {
    warning.innerHTML = "비밀번호를 입력해주세요.";
    $('#signupBtn').attr('disabled', true);
    submitSign()
  } else if ($pwd.length < 9) {
    warning.innerHTML = "비밀번호를 9자리 이상 입력해주세요.";
    $('#signupBtn').attr('disabled', true);
    submitSign()
  } else {
    warning.innerHTML = "";
    submitSign()
  }
});


$(document).mousemove(() => {
  const id = document.getElementById('userId').value;
  const pwd = document.getElementById('userPwd').value;
  const repwd = document.getElementById('userRePwd').value;
  const name = document.getElementById('userName').value;
  const email = document.getElementById('userEmail').value;
  const phone = document.getElementById('userPhoneNumber').value;
  const birth = document.getElementById('userBirthday').value;
  const radio = document.getElementsByName('gender')[0].checked


  const wid = document.getElementById('w-id').innerText;
  const wpwd = document.getElementById('w-pwd').innerText;
  const wrepwd = document.getElementById('w-repwd').innerText;
  const wname = document.getElementById('w-name').innerText;
  const wemail = document.getElementById('w-email').innerText;
  const wphone = document.getElementById('w-phone').innerText;
  const wbirthday = document.getElementById('w-birthday').innerText;

  const box2 = document.getElementById('box2').checked ? 1 : 0;
  const box3 = document.getElementById('box3').checked ? 1 : 0;



  const men = document.getElementsByName("gender")[0].checked
  const girl = document.getElementsByName("gender")[1].checked



  if ((id == "") & (pwd == "") & (repwd == "") & (name == "") & (email == "") & (phone == "") & (birth == "")) {
    $('#signupBtn').attr('disabled', true)
  } else if ((wid == "") &(wpwd == "") & (wrepwd == "") & (wname == "") & (wemail == "") & (wphone == "") & (wbirthday == "")) {
    $('#signupBtn').attr('disabled', true)
    if ((id != "") & (pwd != "") & (repwd != "") & (name != "") & (email != "") & (phone != "") & (birth != "")) {
      $('#signupBtn').attr('disabled', true)
      console.log('1')
      if ((box2 == 1) & (box3 == 1)) {
        if((men==false)&(girl==false)){
          $('#signupBtn').attr('disabled', true)
        }else{
          $('#signupBtn').attr('disabled', false)
        }
      } else {
        $('#signupBtn').attr('disabled', true)
        console.log('3')
      }
    } else {
      $('#signupBtn').attr('disabled', true)
    }
  } else {
  }
})
$("#userRePwd").keyup(() => {
  const $repwd = $("#userRePwd").val();
  const $pwd = $("#userPwd").val();
  const warning = document.getElementById("w-repwd");
  if ($repwd == "") {
    warning.innerHTML = "비밀번호를 입력해주세요.";
    $('#signupBtn').attr('disabled', true);
    submitSign()
  } else if ($repwd != $pwd) {
    warning.innerHTML = "비밀번호가 같지 않습니다.";
    $('#signupBtn').attr('disabled', true);
    submitSign()
  } else {
    warning.innerHTML = "";
    submitSign()
  }
});
function submitSignUP() {
  const box2 = document.getElementById('box2').checked ? 1 : 0;
  const box3 = document.getElementById('box3').checked ? 1 : 0;

  if ((box2 == 0) & (box3 == 0)) {
    alert('필수 체크 부탁드립니다.')
    history.back();
  } else {
    signForm.submit();
  }
}
function submitSign() {
  const id = document.getElementById('userId').value;
  const pwd = document.getElementById('userPwd').value;
  const repwd = document.getElementById('userRePwd').value;
  const name = document.getElementById('userName').value;
  const email = document.getElementById('userEmail').value;
  const phone = document.getElementById('userPhoneNumber').value;
  const birth = document.getElementById('userBirthday').value;

  const wid = document.getElementById('w-id').innerText;
  const wpwd = document.getElementById('w-pwd').innerText;
  const wrepwd = document.getElementById('w-repwd').innerText;
  const wname = document.getElementById('w-name').innerText;
  const wemail = document.getElementById('w-email').innerText;
  const wphone = document.getElementById('w-phone').innerText;
  const wbirthday = document.getElementById('w-birthday').innerText;

  const box2 = document.getElementById('box2').checked ? 1 : 0;
  const box3 = document.getElementById('box3').checked ? 1 : 0;


  const men = document.getElementsByName("gender")[0].checked
  const girl = document.getElementsByName("gender")[1].checked
  console.log('men,girl',men,girl)



  if ((id == "") & (pwd == "") & (repwd == "") & (name == "") & (email == "") & (phone == "") & (birth == "")) {
    $('#signupBtn').attr('disabled', true)
  } else if ((wid == "") & (wpwd == "") & (wrepwd == "") & (wname == "") & (wemail == "") & (wphone == "") & (wbirthday == "")) {
    $('#signupBtn').attr('disabled', true)
    if ((id != "") & (pwd != "") & (repwd != "") & (name != "") & (email != "") & (phone != "") & (birth != "")) {
      $('#signupBtn').attr('disabled', true)
      console.log('1')
      if ((box2 == 1) & (box3 == 1)) {
        if((men==false)&(girl==false)){
          $('#signupBtn').attr('disabled', true)
        }else{
          $('#signupBtn').attr('disabled', false)
        }
      } else {
        $('#signupBtn').attr('disabled', true)
        console.log('3')
      }
    } else {
      $('#signupBtn').attr('disabled', true)
    }
  } else {
  }
}

$("#userName").keyup(() => {
  const $name = $("#userName").val();
  const warning = document.getElementById("w-name");
  if ($name == "") {
    warning.innerHTML = "이름을 입력해주세요.";
    $('#signupBtn').attr('disabled', true);
    submitSign()
  } else if (!validateName($name)) {
    warning.innerHTML = "특수문자를 사용 금지.";
    $('#signupBtn').attr('disabled', true);
    submitSign()
  } else {
    warning.innerHTML = "";
    submitSign()
  }
});


function validateName(name) {
  var re = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\*]+$/;

  return re.test(name);
}

$("#userEmail").keyup(() => {
  const $email = $("#userEmail").val();
  const warning = document.getElementById("w-email");
  if ($email == "") {
    warning.innerHTML = "이메일을 입력해주세요.";
    $('#signupBtn').attr('disabled', true);
    submitSign()
  } else if (!validateEmail($email)) {
    warning.innerHTML = "정확한 이메일 작성.";
    $('#signupBtn').attr('disabled', true);
    submitSign()
  } else {
    warning.innerHTML = "";
    submitSign()
  }
});
function validateEmail(email) {
  let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

$("#userPhoneNumber").keyup(() => {
  const $phone = $("#userPhoneNumber").val();
  const warning = document.getElementById("w-phone");
  if ($phone == "") {
    warning.innerHTML = "전화번호를 입력해주세요.";
    $('#signupBtn').attr('disabled', true);
    submitSign()
  } else if (!validatePhoneNumber($phone)) {
    warning.innerHTML = "숫자로만 작성.";
    $('#signupBtn').attr('disabled', true);
    submitSign()
  } else {
    warning.innerHTML = "";
  }
});
function validatePhoneNumber(phone) {
  let re = /^[0-9]*$/;
  return re.test(phone);
}

$("#userBirthday").keyup(() => {
  const $birthday = $("#userBirthday").val();
  const warning = document.getElementById("w-birthday");
  console.log($birthday);
  if ($birthday == "") {
    warning.innerHTML = "생일입력을 부탁드립니다.";
    $('#signupBtn').attr('disabled', true);
    submitSign()
  } else {
    warning.innerHTML = "";
    submitSign()
  }
});

$("#userBirthday").change(() => {
  const $birthday = $("#userBirthday").val();
  const warning = document.getElementById("w-birthday");
  console.log($birthday);
  if ($birthday == "") {
    warning.innerHTML = "생일입력을 부탁드립니다.";
    $('#signupBtn').attr('disabled', true);
    submitSign()
  } else {
    warning.innerHTML = "";
    submitSign()
  }
});
$(".agreement-panel").on("click", "#chk", function () {
  var checked = $(this).is(":checked");

  if (checked) {
    $(this).parents(".agreement-panel").find('input').prop("checked", true);
  } else {
    $(this).parents(".agreement-panel").find('input').prop("checked", false);
  }
});

$('#userId').on('keyup',()=>{
  let userId = $('#userId').val();
  console.log('userid==>',userId.length<7)
  if(userId==""){
    $('#w-id').html('필수 입력');
    $('#signupBtn').attr('disabled', true);
  }else if(userId.length<8){
    console.log('length',userId.length)
    $('#w-id').html('8글자 이상 입력');
    $('#signupBtn').attr('disabled', true);
  }else{
    $.ajax({
      //아이디 중복 체크
      url:'/sign/inspection',
      dataType : 'json',
      type:'POST',
      data:{
         'data':userId 
      },
      success:(result)=>{
          if(result['result']==true){
              $('#w-id').html('');
          }else{
            $('#w-id').html('중복된 아이디 입니다.');
            $('#signupBtn').attr('disabled', true);
          }
      }
    })
  }
})


////////////////////////////////////

function useid() {
  opener.signForm.userId.value = document.getElementById('userId').value;
  self.close();

}
/////////////////////////////////////
// $("#userId").on("keyup", function() {
//   let inp_id = $('#userId').val();
//   let idExp = (inp_id.length);
//   console.log(inp_id == "",',',idExp)
//   if(inp_id == "") {
//       $('#w-id').html("필수 입력");
//       idBool = 1;
//       $("#signUpBtn").attr("disabled", true);
//   }
//   else {
//       if(idExp<7) {
//           $('#w-id').html("8자 이상");
//           idBool = 1;
//           $("#signUpBtn").attr("disabled", true);
//       }
//       else {
//           // 중복검사
//           // ajax 사용해서 라우터로 데이터를 전송
//           // 라우터에서 디비 검사
//           $.ajax({
//               url: '/sign/inspection', // 주소, 경로
//               dataType: 'json', // json 형식으로 전송
//               type: 'POST', // post 방식
//               data: { 'data': inp_id }, // 보낼 데이터 
//               success: (result) => { // 데이터를 보내고 나서 받아온 결과값
//                   if(result['result'] == true) { 
//                       $('#id_msg').html("");
//                       idBool = 0;
//                   }
//                   else {
//                       $('#w-id').html("중복");
//                       idBool = 1;
//                       $("#signUpBtn").attr("disabled", true);
//                   }
//               },
//           });
//       }
//   }
// });