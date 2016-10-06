$(document).ready(function() {
    $("body").backstretch("./static/img/login_bg.png");
    // $("body").backstretch("destroy", false);

    $('.menu > .ui.dropdown').dropdown();

    var lastScroll = 0;
    $(window).scroll(function(event) {
        // console.log($(document).scrollTop());
        // if($(document).scrollTop() == 0) {
        //     $(".main.menu").fadeIn();
        // } else if($(document).scrollTop() < lastScroll) {
        //     $(".main.menu").fadeIn();
        // } else {
        //     $(".main.menu").fadeOut();
        // }
        if($(document).scrollTop() == 0 && $("#to-top").hasClass("visibled")) {
            $("#to-top").removeClass("visibled");
            $("#to-top").fadeOut("fast");
        } else if(!$("#to-top").hasClass("visibled")){
            $("#to-top").addClass("visibled");
            $("#to-top").show();
        }
        lastScroll = $(document).scrollTop();
        if ($(document).scrollTop() + $(window).height() >= $(document).height()) {
            $(".vertical.footer").fadeIn();
        } else {
            $(".vertical.footer").fadeOut();
        }
    });

    $("#to-top").click(function(e) {
        //以1秒的间隔返回顶部
        $('body,html').animate({
            scrollTop: 0
        }, 400);
    });

    $(".vertical.footer").fadeOut("slow");

    // global 
    window.AjaxFail = function() {
        swal({
            title: "Oo..",
            text: "There seems to be some problem",
            type: "error",
            confirmButtonText: "Okay..."
        });
    };
});