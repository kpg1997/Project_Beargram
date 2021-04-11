$(document).ready(function () {
    $("#include-header").load("/header");
});

$('#follow-list-title').click(()=>{
    $('#follow-list').css('display','block')
    $('#follower-list').css('display','none')
})

$('#follower-list-title').click(()=>{
    $('#follow-list').css('display','none')
    $('#follower-list').css('display','block')
})
$(window).scroll(()=>{
    const scroll = $(this).scrollTop();
    if(scroll>400){
        $('.GoTop').css('display','block')
    }else{
        $('.GoTop').css('display','none')
    }
})