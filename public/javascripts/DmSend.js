$(document).ready(function () {
  $("#include-header").load("/header");
});

const listDiv = document.querySelector('.list-ul-div');

$(window).scroll(()=>{
  const scroll = $(this).scrollTop();
  if(scroll>400){
      $('.GoTop').css('display','block')
  }else{
      $('.GoTop').css('display','none')
  }
})

// $("#send-Dm-comment").click(() => {
  // const userId = document.getElementById("userId").innerText;
  // const gramDmNo = document.getElementById("gramDmNo").innerText;
  // const comment = document.getElementById("comment").value;

//   // alert("/Dm/insert/" + gramDmNo + "/" + comment);
//   if (comment == "") {
//     alert("내용을 입력하시오");
//     return false;
//   } else {
//     DmSendForm.action = "/Dm/insert/" + gramDmNo + "/" + comment;
//     DmSendForm.submit();
//   }
// });
$("#send-Dm-comment").click(() => {
  // const userId = document.getElementById("userId").innerText;
  const gramDmNo = document.getElementById("gramDmNo").innerText;
  const comment = document.getElementById("comment").value;
    $.ajax({
      //대화 보내기
      url:"/Dm/insert/" + gramDmNo + "/" + comment,
      dataType : 'json',
      type:'POST',
      data:{
      },
      success:(result)=>{
          // comment.innerHTML=result['result'];
          inputReset();
          listDiv.scrollTo(0,listDiv.scrollHeight)
      }
    })
});

function send(){
  const gramDmNo = document.getElementById("gramDmNo").innerText;
  const comment = document.getElementById("comment").value;
  const commentinput = document.getElementById("comment")
  console.log('==>',gramDmNo,comment,commentinput)
  $.ajax({
    //대화 보내기
    url:"/Dm/insert/" + gramDmNo + "/" + comment,
    dataType : 'json',
    type:'POST',
    data:{
    },
    success:(result)=>{
        selectList();
        inputReset();
        listDiv.scrollTo(0,listDiv.scrollHeight)
        console.log('마지막꺼')
    }
  })
    
}

let chatInput = document.querySelector('#comment');


chatInput.addEventListener('keypress',(e)=>{
  //  엔터칠 때
  if(e.keyCode == 13 ){
      send();
  }
})

function inputReset(){
  const commentinput = document.getElementById("comment").value="";
  listDiv.scrollTo(0,listDiv.scrollHeight);
}




let su=0
function selectList() {
  const gramDmNo = document.getElementById("gramDmNo").innerText;
  const comment = document.getElementById("comment").value;
  const li = document.createElement("li");
  const ul = document.querySelector("#list-ul");
  let size = ul.childElementCount;
  console.log('size ==> ',size)
  // $('li').remove('#Sibal')
  // const timer = setInterval(() => {
  $.ajax({
    url: "/Dm/List/select/gramDmNo",
    dataType: "json",
    type: "POST",
    data: {
      comment: comment,
      gramDmNo: gramDmNo,
    },
    success: (result) => {
      const a = result["result"];
      if (a == undefined) {
      } else {
        // cssJs();
        console.log('a.length ==> ',a.length);
        let alength = a.length;
        let commentLength =  alength-size;
        console.log('commentLength,alength,size',commentLength,',',alength,',',size);
        if(commentLength != 0){
          let dom;
          for(let x = size; x<=alength; x++){
            let date=new Date(a[x].commentTime);
            let fdate=date.getFullYear() + '년'+(date.getMonth() + 1) + '월' + date.getDate() + '일'+"    "+date.getHours()+':'+date.getMinutes();
            console.log('fdate==>',fdate);
            if(a[x].userImageUrl!=null){
              dom="<li id='"+a[x].dmuserId+"'><span class='userImage'><img src='/images/"+a[x].userId+"/"+a[x].userImageUrl+"'alt=''></span><span class='dmuserId'>" +a[x].dmuserId +"</span><span class='comment'><p>" +a[x].comment +"</p></span><span class='time'>" +fdate +"</span></li>";
            }else{
              if(a[x].gender==1){
              dom ="<li id='"+a[x].dmuserId+"'><span class='userImage'><img src='/images/men.png' alt=''></span><span class='dmuserId'>"+a[x].dmuserId +"</span><span class='comment'><p>" +a[x].comment +"</p></span><span class='time'>" +fdate +"</span></li>";
              }else{
              dom ="<li id='"+a[x].dmuserId+"'><span class='userImage'><img src='/images/girl.png' alt=''></span><span class='dmuserId'>"+a[x].dmuserId +"</span><span class='comment'><p>" + a[x].comment +"</p></span><span class='time'>" +fdate +"</span></li>";
              }
            }
            ul.innerHTML += dom;
            console.log('여기로는 오는가')
            listDiv.scrollTo(0,listDiv.scrollHeight)
            console.log('여가가 안나오면 문제가 있다....111')
            cssJs();
            console.log('여가가 안나오면 문제가 있다....')
          }
        }
        // ul.removeChild(li);
        // for (let x = 0; x < a.length; x++) {
        //   const dom =
        //     "<li id='Sibal'><div>" +
        //     a[x].userId +
        //     "</div><div>" +
        //     a[x].comment +
        //     "</div><div>" +
        //     a[x].commentTime +
        //     "</div></li>";
        //   ul.innerHTML += dom;
        // }
        //  $('li').remove('#Sibal')
      }

    },
  });
  // }, 1000);
}

setInterval("selectList()", 500);


$(document).on(()=>{
  let session = document.getElementById('userSession').value;
  let mother = document.getElementById('list-ul');
  let a = mother.children[i]
  let ch = a.children[1].innerText
  a.classList.add(session== ch?"sent":'received')
  listDiv.scrollTo(0,listDiv.scrollHeight)
  cssJs();
})

$(document).ready(()=>{
  listDiv.scrollTo(0,listDiv.scrollHeight)
})



function cssJs(){
  const userid=''
  let session = document.getElementById('userSession').value;
  let mother = document.getElementById('list-ul');
  let fchild = mother.children;
  let size = mother.childElementCount;
  let count =0;
  // let ffchild = mother.firstChild.firstChild.innerText;
  for(let i=0;i<=size;i++){
    let a = mother.children[i]
    let ch = a.children[1].innerText
    console.log('여기')
    // if(ch==undefined)return  false
    a.classList.add(session == ch ? "sent" : "received");
    // let beftext = bef.children[1].innerText
    
    // console.log(ch==beftext,',',ch,',',beftext)
    // if(ch==beftext){
    //   $('li div img').css('display','none');
    // }
    // if(ch == session){
    //   a.style.flexDirection='row-reverse'
    //   a.style.float='right'
    //   $('.sent .dmuserId').css('display','none');
    //   $('.sent div img').css('display','none');
    // // flex-direction: row-reverse;
    // // float: right;
    //   count++;
    // }
    // console.log('ch',ch)
    // // console.log('a',fchild)
    // // console.log('userid ==> ',session,a.children[1].innerText)
  }
  // if(session==child){
  // child.style.display = 'none';
  // }
  console.log('여기로 오는가 제발 나와요...')
  }
$(document).ready(()=> {
  cssJs()
});