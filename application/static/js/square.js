$(document).ready(function() {
    // $("body").backstretch("destroy", false);
    $(".ui.banner").backstretch("/static/img/square_banner1.1.jpg");

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
        var $btn = $(this);
        if ($($(this).find(".icon")).hasClass("empty")) {
            $.ajax({
                url: "/set_like",
                type: "POST",
                dataType: "json",
                contentType: 'application/json; charset=utf-8',
                cache: false,
                data: JSON.stringify({
                    design_id: $(this).parents('.grid.design').attr('design-id'),
                    isLike: true
                }),
                success: function(r) {
                    if (r.code) {
                        showErrMsg(r.message);
                        return false;
                    } else {
                        var nowLike = parseInt($($btn.find(".label")).text());
                        $($btn.find(".label")).text(nowLike + 1);
                        $($btn.find(".icon")).toggleClass("empty");
                    }
                }
            });
        } else {
            $.ajax({
                url: "/set_like",
                type: "POST",
                dataType: "json",
                contentType: 'application/json; charset=utf-8',
                cache: false,
                data: JSON.stringify({
                    design_id: $(this).parents('.grid.design').attr('design-id'),
                    isLike: false
                }),
                success: function(r) {
                    if (r.code) {
                        showErrMsg(r.message);
                        return false;
                    } else {
                        var nowLike = parseInt($($btn.find(".label")).text());
                        $($btn.find(".label")).text(nowLike - 1);
                        $($btn.find(".icon")).toggleClass("empty");
                    }
                }
            });

        }
    });

    $(".button.mark").click(function() {
        var $btn = $(this);
        $.ajax({
            url: "/set_mark",
            type: "POST",
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
            cache: false,
            data: JSON.stringify({
                design_id: $(this).parents('.grid.design').attr('design-id'),
                isMark: $($(this).find(".icon")).hasClass("empty")
            }),
            success: function(r) {
                if (r.code) {
                    showErrMsg(r.message);
                    return false;
                } else {
                    $($btn.find(".icon")).toggleClass("empty");
                }
            }
        });
    });

    $(".button.tip-off").click(function() {
        var $btn = $(this);
        swal({
            html: '<b>Describe the tip-off reason please.</b>',
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
                url: "/report",
                type: "POST",
                dataType: "json",
                contentType: 'application/json; charset=utf-8',
                cache: false,
                data: JSON.stringify({
                    "design_id": $btn.parents('.grid.design').attr('design-id'),
                    "reason": text
                }),
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
                            html: 'Your report is received.'
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