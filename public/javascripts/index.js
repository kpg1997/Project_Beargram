$("input").keyup(() => {
  const id = $("#login-id").val();
  const pwd = $("#login-pwd").val();
  console.log('id .length',id .length)
  if (id.length > 6) {
    if (pwd.length > 8) {
      console.log('btn false')
      $(".login-btn").attr("disabled", false);
    } else {
      console.log('btn true')
      $(".login-btn").attr("disabled", true);
    }
  } else {
    console.log('btn true')
    $(".login-btn").attr("disabled", true);
  }
});


$('.login-btn').click(()=>{
  loginForm.submit();
})

function findId(){
  window.open(
    "/users/find/id",
    "Terms-of-Service",
    "width=600,height=260,scrollbars=yes"
  );
}

function findPwd(){
  window.open(
    "/users/find/pwd",
    "Terms-of-Service",
    "width=600,height=250,scrollbars=yes"
  );
}


function sign(){
    location.href="/sign"
}
