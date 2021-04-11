$(document).ready(function(){
    $("#include-header").load("/header");
});

$('#uploadBtn').click(()=>{
    const file = document.getElementById('gramImageUrl').value;
    const textarea = document.getElementById('txtContent').value;

    if(file==''&&textarea==''){
        alert('사진 또는 글 중 하나는 필요합니다!!');
        return false;
    }else{
        makeBoard.action='/mainBoard/makeBoard'
        makeBoard.submit();
    }
})