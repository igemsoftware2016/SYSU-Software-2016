$(document).ready(function() {
    $("body").backstretch("destroy", false);
    $("body").backstretch("./static/img/404-bg.png");
    // $('#star-1').plaxify({
    //     "xRange": 7,
    //     "yRange": 13
    // });
    // $('#star-2').plaxify({
    //     "xRange": 8,
    //     "yRange": 9
    // });
    // $('#star-3').plaxify({
    //     "xRange": 6,
    //     "yRange": 19,
    //     "invert": true
    // });
    $('#title-404').plaxify({
        "xRange": 26,
        "yRange": 7,
        "invert": true
    });
    $.plax.enable();

});