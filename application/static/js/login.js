$(document).ready(function() {
    // $('.main.menu').visibility({
    //     type: 'fixed'
    // });

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

    $("#sign-up-btn").click(function() {
        console.log("1");
        $("#sign-in-btn").removeClass("active");
        $("#sign-up-btn").addClass("active");
        $("#sign-in-form").hide();
        $("#sign-up-form").fadeIn();

    });

    $("#sign-in-btn").click(function() {
        console.log("2");
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
                        if (email === 'taken@example.com') {
                            reject('This email is already taken.');
                        } else {
                            resolve();
                        }
                    }, 2000);
                });
            },
            allowOutsideClick: false
        }).then(function(email) {
            swal({
                type: 'success',
                title: 'Ajax request finished!',
                html: 'Submitted email: ' + email
            });
        });
    });

    // falling stars using plax.js

    $('#star-1').plaxify({
        "xRange": 5,
        "yRange": 5
    });
    $('#star-2').plaxify({
        "xRange": 6,
        "yRange": 6
    });
    $('#star-3').plaxify({
        "xRange": 3,
        "yRange": 3,
        "invert": true
    });
    $.plax.enable();
});