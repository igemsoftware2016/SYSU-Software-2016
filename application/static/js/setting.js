$(document).ready(function(){
    $(".ui.banner").backstretch("/static/img/setting_banner1.1.jpg");
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

    var defaultName = $("input[name='nickname']").val();

    $(".new-icon").click(function() {
        // from 0~5
        var new_num = Math.floor(Math.random() * 6);
        // console.log(new_num.toString(), $("img.icon").attr("new_num"));
        while(new_num.toString() == $("img.icon").attr("new_num")) {
            new_num = Math.floor(Math.random() * 6);
        }
        var new_src = '/static/img/icon/' + new_num + '.jpg';
        $("img.icon").attr("src", new_src);
        $("img.icon").attr("new_num", new_num);
    });

    $("input").keypress(function() {
        $(this).parent().removeClass("error");
    });
    
    $(".ui.button.commit").click(function() {
        var data = {
            setName: false,
            setPassword: false,
            setIcon: false
        };
        if($(".nickname.icon").hasClass("edit") && $("input[name='nickname']").val() != defaultName) {
            data.setName = true;
            data.newName = $("input[name='nickname']").val();
            if(!data.newName) {
                $("input[name='nickname']").parent().addClass("error");
                return false;
            }
        }
        if($(".password.icon").hasClass("edit")) {
            data.setPassword = true;
            data.newPassword = $("input[name='new_password']").val();
            data.oldPassword = $("input[name='old_password']").val();
            if(!(data.oldPassword)) {
                $("input[name='old_password']").parent().addClass("error");
                return false;
            }
            if(!(data.newPassword)) {
                $("input[name='new_password']").parent().addClass("error");
                return false;
            }
        }
        if($("img.icon").attr("new_num") != $("img.icon").attr("pic_num")) {
            data.setIcon = true;
            data.newIcon = $("img.icon").attr("new_num");
        }
        $.ajax({
            url: "/setting",
            type: "POST",
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
            cache: false,
            data: JSON.stringify(data),
            success: function(r) {
                if (r.code) {
                    swal({
                        title: "Ooo",
                        text: r.message,
                        type: "error",
                        confirmButtonText: "Okay"
                    });
                    return false;
                } else {
                    swal({
                        title: "Done",
                        type: "success",
                        confirmButtonText: "Okay"
                    });
                }
            }
        });
    });

    // reset button
    $(".ui.button.reset").click(function() {
        // reset icon
        var new_num = $("img.icon").attr("pic_num");
        var new_src = '/static/img/icon/' + new_num + '.jpg';
        $("img.icon").attr("src", new_src);
        $("img.icon").attr("new_num", new_num);
        // reset name
        $("input[name='nickname']").val(defaultName);
        // reset password
        $("input[name='new_password']").val("");
        $("input[name='old_password']").val("");
    })
});