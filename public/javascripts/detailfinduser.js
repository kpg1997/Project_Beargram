$(document).ready(function(){
    $("#include-header").load("/header");
});


$(document).ready(()=>{
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
})



$(document).ready(()=>{
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


$(document).ready(()=>{
    const userId = document.getElementById('userId').innerText;
    $.ajax({
        //팔로우 / 팔로우 취소 뜨는 거
        url:'/users/atag',
        dataType : 'json',
        type:'POST',
        data:{
           'data':userId 
        },
        success:(result)=>{
            if(result['result']==true){
                $('#insert-follow').css('display','inline');
                $('#delete-follow').css('display','none')
            }else{
                $('#insert-follow').css('display','none');
                $('#delete-follow').css('display','inline')
            }
            
        }
    })
})


$('#insert-follow').click(()=>{

    // 팔로우 수 증가와 팔로우 취소버튼 보이고 팔로우 버튼은 사라지는 거
    // gramMe = session gramFollowuserid = userId
    const userId = document.getElementById('userId').innerText;
    $.ajax({
        //팔로우 
        url:'/users/insert',
        dataType : 'json',
        type:'POST',
        data:{
           'data':userId 
        },
        success:(result)=>{
            if(result['result']==true){
                followsum()
                findFollow()
                $('#insert-follow').css('display','none');
                $('#delete-follow').css('display','inline')
            }
        }
    })
})



$('#delete-follow').click(()=>{

    // 팔로우 수 증가와 팔로우 취소버튼 보이고 팔로우 버튼은 사라지는 거
    // gramMe = session gramFollowuserid = userId
    const userId = document.getElementById('userId').innerText;
    $.ajax({
        //팔로우 
        url:'/users/delete',
        dataType : 'json',
        type:'POST',
        data:{
           'data':userId 
        },
        success:(result)=>{
            if(result['result']==true){
                followsum()
                findFollow()
                $('#insert-follow').css('display','inline');
                $('#delete-follow').css('display','none')
            }
        }
    })
})



$(window).scroll(()=>{
    const scroll = $(this).scrollTop();
    if(scroll>400){
        $('.GoTop').css('display','block')
    }else{
        $('.GoTop').css('display','none')
    }
}) 


$('#Dm-start').click(()=>{
    const otherUserId = document.getElementById('userId').innerText;
    location.href='/Dm/start/'+otherUserId
})

// setInterval('findFollow()',500)
// setInterval('followsum()',500)