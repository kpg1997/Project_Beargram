$(document).ready(function(){
    $("#include-header").load("/header");
});

$('#deleteBoard').click(()=>{
    const con = confirm('해당 게시글을 삭제하시겠습니까?(삭제할 경우 복구 불가능합니다.)');
    const gNo = document.getElementById('gNo').value;
    if(con == true){
        location.href = '/mainBoard/deleteBoard/'+gNo
    }
})
$(window).scroll(()=>{
    const scroll = $(this).scrollTop();
    if(scroll>400){
        $('.GoTop').css('display','block')
    }else{
        $('.GoTop').css('display','none')
    }
})

$('#replybtn').click(()=>{
    const reply = $('#reply').val()
    if(reply==''){
        alert('댓글을 작성해주시기 바랍니다.')
        return false;
    }else{
        const gramNo =  document.getElementById('gNo').value;
        replyForm.action='/mainBoard/reply/'+gramNo
        replyForm.submit();
    }
    
})

$('#Dm-start').click(()=>{
    const otherUserId = document.getElementById('userId').innerText;
    location.href='/Dm/start/'+otherUserId
})


let before = document.getElementById('before');
let after = document.getElementById('after');

before.addEventListener('click',()=>{
    const gramNo = document.getElementById('gNo').value
    console.log('gramNo==>insert',gramNo)
    $.ajax({
        //팔로우 
        url:'/mainBoard/likeBoard',
        dataType : 'json',
        type:'POST',
        data:{
           'data':gramNo 
        },
        success:(result)=>{
            if(result['result']==true){
                getGramNoSu()
                before.style.display='none'
                after.style.display='inline'
            }
        }
    })
})

after.addEventListener('click',()=>{
    const gramNo = document.getElementById('gNo').value
    console.log('gramNo==>delete',gramNo)
    $.ajax({
        //팔로우 
        url:'/mainBoard/UnlikeBoard',
        dataType : 'json',
        type:'POST',
        data:{
           'data':gramNo 
        },
        success:(result)=>{
            if(result['result']==true){
                getGramNoSu()
                before.style.display='inline'
                after.style.display='none'
            }
        }
    })
})

function getGramNoLike(){
    const gramNo = document.getElementById('gNo').value
    console.log('gramNo==>select',gramNo)
    $.ajax({
        //팔로우 
        url:'/mainBoard/GetlikeBoard',
        dataType : 'json',
        type:'POST',
        data:{
           'data':gramNo 
        },
        success:(result)=>{
            console.log(result['result'])
            getGramNoSu()
            if(result['result']=='0'){
                before.style.display='inline'
                after.style.display='none'
            }else if(result['result']=='1'){
                before.style.display='none'
                after.style.display='inline'
            }
        }
    })
}
function getGramNoSu(){
    const gramNo = document.getElementById('gNo').value
    console.log('gramNo==>getGramNoSu',gramNo)
    $.ajax({
        //팔로우 
        url:'/mainBoard/GetlikeBoardSu',
        dataType : 'json',
        type:'POST',
        data:{
           'data':gramNo 
        },
        success:(result)=>{
            if(
                result['result']==0){$('#getGramNoSu').html('');
            }else{
                    console.log('result ==>',result['result'])
                    $('#getGramNoSu').html(result['result']);
            }
        }
    })
}
$(document).ready(()=>{
    getGramNoLike()
    getGramNoSu()
})
$(document).on(()=>{
    getGramNoSu()
})

setInterval('getGramNoSu()',500);