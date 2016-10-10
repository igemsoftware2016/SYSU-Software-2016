$(document).ready(function() {
    $("body").backstretch("/static/img/login_bg.png");
    // $("body").backstretch("destroy", false);

    $.extend($.fn.api.settings.api, {
        categorySearch: 'http://api.semantic-ui.com/search/category/{query}'
    });

    var $category = $('.ui.category.search');
    $category.search({
        type: 'category',
        apiSettings: {
            action: 'categorySearch'
        }
    });

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
        if ($(document).scrollTop() == 0 && $("#to-top").hasClass("visibled")) {
            $("#to-top").removeClass("visibled");
            $("#to-top").fadeOut("fast");
        } else if (!$("#to-top").hasClass("visibled")) {
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

    var steps = $(".ui.five.steps.sticky");
    var data = {
        "_id": $("#design-id").text()
    }
    if (steps.length) {
        $.ajax({
            url: "/get_steps",
            type: "GET",
            dataType: "json",
            contentType: 'application/x-www-form-urlencoded; charset=utf-8',
            cache: false,
            data: data,
            success: function(r) {
                if (r.code) {
                    swal({
                        title: "Ooo_ERROR_STEPS",
                        text: r.message,
                        type: "error",
                        confirmButtonText: "Okay"
                    });
                    return false;
                } else {
                    r.ret -= 1; /* 1~5 -> 0~4*/
                    $(steps.find(".step")).each(function(n, el) {
                        if (n < r.ret) {
                            $(el).children(".icon").addClass("green check"); /* done */
                        } else if (n === r.ret) {
                            $(el).children(".icon").addClass("info"); /* now doing */
                        } else {
                            $(el).addClass("disabled");
                            $(el).children(".icon").addClass("help"); /* todo */
                        }
                    });
                }
            },
            error: function() {
                /* test !!! */
                // ret = 3; /* 1~5 -> 0~4*/
                // ret -= 1;
                // // console.log(steps.find(".step"));
                // $(steps.find(".step")).each(function(n, el) {
                //     // console.log(el);
                //     if (n < ret) {
                //         $(el).children(".icon").addClass("green check"); /* done */
                //     } else if (n === ret) {
                //         $(el).children(".icon").addClass("info"); /* now doing */
                //     } else {
                //         $(el).addClass("disabled");
                //         $(el).children(".icon").addClass("help"); /* todo */
                //     }
                // });
                AjaxFail();
            }
        });
    } else {
        console.log("no steps");
    }

    window.showErrMsg = function(msg) {
        swal({
            title: "Ooo",
            text: msg,
            type: "error",
            confirmButtonText: "Okay"
        });
    }
});