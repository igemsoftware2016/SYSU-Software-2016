$(document).ready(function() {
    // $("body").backstretch("destroy", false);
    $(".ui.banner").backstretch("/static/img/profile_banner-1.1.jpg");

    if($(".design.card").length) {
        $(".ui.segment.empty").removeClass("empty");
    }

    $(".item").click(function() {
        $(".item.active").removeClass("active");
        $(this).addClass("active");
    });

    $(".item.mark").click(function() {
        $(".design.card").each(function(n, el) {
            if ($(el).find(".star.icon").hasClass("empty")) {
                $(el).fadeOut();
            } else {
                $(el).fadeIn();
            }
        });
    });

    $(".item.create").click(function() {
        $(".design.card").each(function(n, el) {
            if ($(el).hasClass("my")) {
                $(el).fadeIn();
            } else {
                $(el).fadeOut();
            }
        });
    });

    $(".item.all").click(function() {
        $(".design.card").each(function(n, el) {
            $(el).fadeIn();
        });
    });

    $(".button.delete").click(function() {
        var $btn = $(this);
        swal({
            title: 'You are deleting a design',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            focusCancel: true
        }).then(function() {
            $.ajax({
                url: "/delete_design",
                type: "DELETE",
                dataType: "json",
                contentType: 'application/json; charset=utf-8',
                cache: false,
                data: JSON.stringify({
                    design_id: $btn.parents('.grid.design').attr('design-id')
                }),
                success: function(r) {
                    if (r.code) {
                        showErrMsg(r.message);
                        return false;
                    } else {
                        $($btn.parents(".card.design")).remove();
                    }
                }
            });
        })
    })
});