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
});