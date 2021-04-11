$(document).ready(function () {
    $("#include-header").load("/header");
});

function validateEmail(email) {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    console.log('validateEmail(email) : ',re.test(email))
    return re.test(email);
  }
function validatePhoneNumber(phone) {
    let re = /^[0-9]*$/;
    return re.test(phone);
}
function updateUser() {
    const pwd = document.getElementById('userPwd').value
    const repwd = document.getElementById('reuserPwd').value;
    const email = $("#userEmail").val();
    const phone = $("#userPhoneNumber").val();


    if (pwd == repwd) {
        if (!validateEmail(email)) {
            alert('정확한 이메일 작성부탁드립니다.')
            return false;
        } else {
            if (!validatePhoneNumber($phone)) {
                alert('전화번호를 숫자로만 작성부탁드립니다.')
                return false
            } else {
                updateForm.submit();
            }
        }
    } else {
        alert("비밀번호가 동일하지 않습니다.");
        return false
    }
}

$(document).mousemove(() => {

    const name = document.getElementById('userName').value;
    const pwd = document.getElementById('userPwd').value;
    const repwd = document.getElementById('reuserPwd').value;
    const phone = document.getElementById('userPhoneNumber').value;
    const email = document.getElementById('userEmail').value;
    console.log(name,pwd,repwd,phone,email)
    if ((name != "") & (pwd != "") & (repwd != "") & (phone != "") & (email != "")) {
        if (pwd == repwd) {
            if (validateEmail(email)) {
                if (validatePhoneNumber(phone)) {
                    if(phone.length>10){
                    $('#updateBtn').attr('disabled', false);
                    }else{
                        $('#updateBtn').attr('disabled', true);
                    }
                } else {
                    $('#updateBtn').attr('disabled', true);
                }
            } else {
                $('#updateBtn').attr('disabled', true);
            }
        } else {
            $('#updateBtn').attr('disabled', true);
        }
    }else{
        console.log('여기')
        $('#updateBtn').attr('disabled', true);
    }
});


function readImg(input){
    console.log('input')
    var reader = new FileReader();
    reader.onload = function (e){
        $('#previewProfile').attr('src',e.target.result);
    }
    reader.readAsDataURL(input.files[0]);
}

// let clickWithdrawal = document.getElementById('Withdrawal-text')
// clickWithdrawal.addEventListener('click',()=>{
//     let cof = confirm('정말로 회원 탈퇴를 하시겠습니까?(회원탈퇴 시 올리신 게시글,댓글 등 복구가 불가능합니다.)');
//     if(cof==true){
//         location.href='/users/withdrawal'
//     }else{ 
//         return false
//     }
// })