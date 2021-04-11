function searchAll() {
  const selectValue = document.getElementById("select-option").value;
  const searchText = document.getElementById("search-text").value;

  if (searchText != "") {
    searchForm.action = "/mainBoard/" + selectValue + "/" + searchText;
    searchForm.submit();
  } else {
    alert("입력");
    return false
  }
}
$("#ajaxMypage").click(() => {
  //     alert('ajax')
  //     $.ajax({
  //        url:'/myPage/passwordInput',
  //        dataType : 'json',
  //        type:'POST',
  //        success:(result)=>{
  //            if(result['result']==undefined){
  //                console.log('result ==> ',result['result'])
  //                $('#follower-su').html(0);
  //            }else{
  //                $('#follower-su').html(result['result']);
  //            }

  //        }
  //    })
  location.href='/myPage/myPagePwd  '
});
// function test(id){
//     var pro=prompt('비밀번호를 입력하시오.')
//     location.href='/myPage/test/'+id+'/'+pro
// }


// $('#Dm').click(()=>{
//   location.href='/Dm'
// })

$('#DmList').click(()=>{
  location.href='/Dm/List'
})
