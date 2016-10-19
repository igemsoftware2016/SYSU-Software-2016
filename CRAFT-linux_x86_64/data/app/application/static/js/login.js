$(document).ready(function() {
    // $('.main.menu').visibility({
    //     type: 'fixed'
    // });

    $("#sign-up-btn").click(function() {
        // console.log("1");
        $("#sign-in-btn").removeClass("active");
        $("#sign-up-btn").addClass("active");
        $("#sign-in-form").hide();
        $("#sign-up-form").fadeIn();

    });

    $("#sign-in-btn").click(function() {
        // console.log("2");
        $("#sign-up-btn").removeClass("active");
        $("#sign-in-btn").addClass("active");
        $("#sign-up-form").hide();
        $("#sign-in-form").fadeIn();
    });


    // click forget password link, use sweetAlert 2
    $(".forget").click(function() {
        swal({
            html: '<b>Submit email to get your password</b>',
            input: 'email',
            showCancelButton: true,
            confirmButtonText: 'Submit',
            showLoaderOnConfirm: true,
            preConfirm: function(email) {
                return new Promise(function(resolve, reject) {
                    setTimeout(function() {
                        resolve();
                    }, 1000);
                });
            },
            allowOutsideClick: false
        }).then(function(email) {
            $.ajax({
                url: "http://www.findpsw.test.com",
                type: "POST",
                dataType: "json",
                contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                cache: false,
                data: {
                    "email": email
                },
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

    // falling stars using plax.js

    $('#star-1').plaxify({
        "xRange": 34,
        "yRange": 5
    });
    $('#star-2').plaxify({
        "xRange": 7,
        "yRange": 6
    });
    $('#star-3').plaxify({
        "xRange": 9,
        "yRange": 3,
        "invert": true
    });
    $('#star-4').plaxify({
        "xRange": 11,
        "yRange": 4,
        "invert": true
    });
    $('#star-5').plaxify({
        "xRange": 16,
        "yRange": 8,
        "invert": true
    });
    $.plax.enable();
    // listen enter
    $("input[name='signup-password']").keydown(function(event) {
        if (event.which == "13") {
            $("#signup-btn").click();
        }
    });
    $("input[name='login-password']").keydown(function(event) {
        if (event.which == "13") {
            $("#login-btn").click();
        }
    });
    // sign in button click event
    $("#signup-btn").click(function() {
        // check inputs has things
        if ($("input[name='signup-email']").val() == "") {
            $("input[name='signup-email']").parent().addClass("error");
            $("input[name='signup-email']").focus();
            return false;
        }
        if ($("input[name='signup-username']").val() == "") {
            $("input[name='signup-username']").parent().addClass("error");
            $("input[name='signup-username']").focus();
            return false;
        }
        if ($("input[name='signup-password']").val() == "") {
            $("input[name='signup-password']").parent().addClass("error");
            $("input[name='signup-password']").focus();
            return false;
        }
        var data = {
            "email": $("input[name='signup-email']").val(),
            "nickname": $("input[name='signup-username']").val(),
            "password": $.md5($("input[name='signup-password']").val())
        }
        $.ajax({
            url: "/register",
            type: "POST",
            dataType: "json",
            contentType: 'application/x-www-form-urlencoded; charset=utf-8',
            cache: false,
            data: data,
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
                    location.href = "/profile";
                }
            },
            error: function() {
                AjaxFail();
            }
        });
    });

    // log in button click event
    $("#login-btn").click(function() {
        // check inputs has things
        if ($("input[name='login-email']").val() == "") {
            $("input[name='login-email']").parent().addClass("error");
            $("input[name='login-email']").focus();
            return false;
        }

        if ($("input[name='login-password']").val() == "") {
            $("input[name='login-password']").parent().addClass("error");
            $("input[name='login-password']").focus();
            return false;
        }

        var data = {
            "email": $("input[name='login-email']").val(),
            "password": $.md5($("input[name='login-password']").val())
        }
        $.ajax({
            url: "/login",
            type: "POST",
            dataType: "json",
            contentType: 'application/x-www-form-urlencoded; charset=utf-8',
            cache: false,
            data: data,
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
                    location.href = "/profile";
                }
            },
            error: function() {
                AjaxFail();
            }
        });
    });

    $("input").keypress(function() {
        $(this).parent().removeClass("error");
    });
});