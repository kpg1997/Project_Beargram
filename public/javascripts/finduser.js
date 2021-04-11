$(document).ready(function(){
    $("#include-header").load("/header");
});

$(window).scroll(()=>{
    const scroll = $(this).scrollTop();
    if(scroll>400){
        $('.GoTop').css('display','block')
    }else{
        $('.GoTop').css('display','none')
    }
})