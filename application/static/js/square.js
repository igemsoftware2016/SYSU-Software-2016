$(document).ready(function() {
    // $("body").backstretch("destroy", false);
    $(".ui.banner").backstretch("./static/img/profile_banner.png");

    $(".ui.sticky").sticky({
        context: '#square-context',
        offset: 54,
    });

    $(".popup-bro").popup({
        inline: true,
        hoverable: true,
        position: 'left center',
        delay: {
            show: 100,
            hide: 100
        }
    });

    $(".ui.progress").progress();

    $(".button.like").click(function() {
        if($($(this).find(".icon")).hasClass("empty")) {
            var nowLike = parseInt($($(this).find(".label")).text());
            $($(this).find(".label")).text(nowLike+1);
        } else {
            var nowLike = parseInt($($(this).find(".label")).text());
            $($(this).find(".label")).text(nowLike-1);
        }
        $($(this).find(".icon")).toggleClass("empty");
    });

    $(".button.mark").click(function() {
        $($(this).find(".icon")).toggleClass("empty");
    });

    $(".button.tip-off").click(function() {
        swal({
            html: '<b>Describt the tip-off reason please.</b>',
            input: 'textarea',
            showCancelButton: true,
            confirmButtonText: 'Submit',
            showLoaderOnConfirm: true,
            preConfirm: function(text) {
                return new Promise(function(resolve, reject) {
                    setTimeout(function() {
                        resolve();
                    }, 1000);
                });
            },
            allowOutsideClick: false
        }).then(function(text) {
            $.ajax({
                url: "http://www.findpsw.test.com",
                type: "POST",
                dataType: "json",
                contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                cache: false,
                data: {"email": email},
                success: function(data) {
                    if (data.code) {
                        swal({
                            title: "Ooo",
                            text: data.message,
                            type: "error",
                            confirmButtonText: "Okay"
                        });
                        return false;
                    } else {
                        swal({
                            type: 'success',
                            title: 'Done',
                            html: 'Your password was sended, check it please.'
                        });
                    }
                },
                error: function() {
                    AjaxFail();
                }
            });
        });
    });
});