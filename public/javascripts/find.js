function find(value) {
  const val = value;
  if (val == 1) {
    const name = document.getElementById("userName").value;
    const phone = document.getElementById("userPhoneNumber").value;
    const birth = document.getElementById("userBirthday").value;
    if (!validatePhoneNumber(phone)) {
      alert("숫자로만 작성");
      return false
    } else {
      if (name == "") {
        alert("이름을 입력");
        return false
      } else {
        if ((birth = "")) {
          alert("생일을 입력");
          return false
        } else {
          idForm.action = "/users/find/id";
          idForm.submit();
        }
      }
    }
  } else {
    const name = document.getElementById("userName").value;
    const phone = document.getElementById("userPhoneNumber").value;
    const birth = document.getElementById("userBirthday").value;
    const id = document.getElementById("userId").value;
    if (!validatePhoneNumber(phone)) {
      alert("숫자로만 작성");
      return false
    } else {
      idForm.action = "/users/find/pwd";
      idForm.submit();
    }
  }
}

function validatePhoneNumber(phone) {
  let re = /^[0-9]*$/;
  return re.test(phone);
}

function change() {
  const pwd = document.getElementById("pwd").value;
  const repwd = document.getElementById("repwd").value;
  console.log(   pwd,',' ,'pwd < 8', pwd.length>8, repwd.length)
  if (pwd.length>8) {
    if (repwd.length>8) {
      if (pwd == repwd) {
        chForm.action = "/users/change";
        chForm.submit();
      } else {
        alert("비밀번호가 같지 않습니다.");
        return false
      }
    }
  } else {
    alert("비번 9자리 이상 작성하세요!!");
    return false;
  }
}
// $('#pwdchange').ready(()=>{
//     var $pwd = $('#pwdchange').val()
//     console.log($pwd)
//     var $btnpwd = $('#pwdbtn')
//     var repwd=$('#repwd')
//     var pwd=$('#pwd')
//     if($pwd==''){
//         console.log($btnpwd)
//         // $pwd.attr('disabled','true');
//         pwd.attr('disabled','true');
//         repwd.attr('disabled','true');
//         $btnpwd.attr('disabled','true');
//     }else{

//         // $pwd.attr('disabled','false');
//         pwd.attr('disabled','false');
//         repwd.attr('disabled','false');
//         $btnpwd.attr('disabled','false');
//     }
// })
