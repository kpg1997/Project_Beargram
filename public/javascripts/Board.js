$(document).ready(function(){
    $("#include-header").load("/header");
    followsum()
    findFollow()
});
$(window).scroll(()=>{
    const scroll = $(this).scrollTop();
    if(scroll>400){
        $('.GoTop').css('display','block')
    }else{
        $('.GoTop').css('display','none')
    }
})

function followsum(){
    const userId = document.getElementById('userId').innerText
    console.log('userId',userId)
    $.ajax({
        //팔로우 수 찾기
        url:'/users/followSum',
        dataType : 'json',
        type:'POST',
        data:{
           'data':userId 
        },
        success:(result)=>{
            if(result['result']==undefined){
                console.log('result follow ==> ',result['result'])
                $('#follow-su').html('0');
            }else{
                $('#follow-su').html(result['result']);
            }
            
        }
    })
}


function findFollow(){
    const userId = document.getElementById('userId').innerText
    console.log('userId',userId)
    $.ajax({
        //팔로워 수 찾기
        url:'/users/followerSum',
        dataType : 'json',
        type:'POST',
        data:{
           'data':userId 
        },
        success:(result)=>{
            if(result['result']==undefined){
                console.log('result ==> ',result['result'])
                $('#follower-su').html(0);
            }else{
                $('#follower-su').html(result['result']);
            }
            
        }
    })
}
setInterval('findFollow()',500)
setInterval('followsum()',500)