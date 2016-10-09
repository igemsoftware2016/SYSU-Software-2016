$(document).ready(function(){
    $(".ui.banner").backstretch("/static/img/profile_banner.png");
    $(".ui.image.icon").dimmer({
        on: "hover"
    });

    $(".nickname.icon").click(function() {
        $(this).toggleClass("edit");
        $(this).toggleClass("square outline");
        $(".input.nickname").toggleClass("disabled focus");
    });

    $(".password.icon").click(function() {
        $(this).toggleClass("edit");
        $(this).toggleClass("square outline");
        $(".input.password").toggleClass("disabled focus");
    });
});