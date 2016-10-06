$(document).ready(function() {
    // $("body").backstretch("destroy", false);
    $(".ui.banner").backstretch("/static/img/profile_banner.png");

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
});