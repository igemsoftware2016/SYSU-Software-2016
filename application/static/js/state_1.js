$(document).ready(function() {
    $('.ui.name.search').search({
        apiSettings: {
            url: '/search/matters/{query}'
        },
        fields: {
            results: 'results',
            title: 'title',
            description: 'description'
        },
        minCharacters: 1
    });

    // Can not fix the flashing problem
    // $('.ui.sticky').sticky({
    //     context: '#main-container',
    //     offset: 0
    // });

    // $(window).scroll(function(e){
    //     // console.log($(document).scrollTop());
    //     // if($(document).scrollTop() == 0) {
    //     //     $(".main.menu").fadeIn();
    //     // } else if($(document).scrollTop() < lastScroll) {
    //     //     $(".main.menu").fadeIn();
    //     // } else {
    //     //     $(".main.menu").fadeOut();
    //     // }
    //     lastScroll = $(document).scrollTop();
    //     if ($(document).scrollTop() + $(window).height()>= $(document).height() - 54) {
    //         console.log("pre!");
    //         e.preventDefault();
    //         e.stopPropagation();
    //         return false;
    //     }
    // });

    var makeLine = '<tr class="make-line"><td class="center aligned"><div class="ui search name fluid"><div class="ui icon input fluid"><input class="prompt" type="text" placeholder="Search animals..."><i class="search icon"></i></div><div class="results"></div></div></td><td class="center aligned"><div class="ui right labeled input fluid"><input type="number" placeholder="Weight.."><div class="ui basic label">Unit </div></div></td><td class="center aligned"><div class="ui right labeled input fluid"><input type="number" placeholder="Weight.."><div class="ui basic label">Unit </div></div></td><td class="center aligned"><div class="ui toggle checkbox max"><input type="checkbox"><label></label></div></td><td class="right aligned"><button class="ui circular minus icon button tiny remove-add"><i class="minus icon"></i></button></td></tr>'
    var resolveLine = '<tr class="resolve-line"><td class="center aligned"><div class="ui input fluid name search"><input class="prompt" type="text" placeholder="Search matter..."></div><div class="results"></div></td><td class="center aligned"><div class="ui right labeled input fluid"><input type="number" placeholder="Weight.."><div class="ui basic label">Unit </div></div></td><td class="right aligned"><button class="ui circular minus icon button tiny remove-resolve"><i class="minus icon"></i></button></td></tr>'


    $(document).on('click', "#add-make", function() {
        $($("#make-tbody")[0]).append(makeLine);
        $('.ui.name.search').search({
            apiSettings: {
                url: '/search/matters/{query}'
            },
            fields: {
                results: 'results',
                title: 'title',
                description: 'description'
            },
            minCharacters: 1
        });
    });

    $("#add-resolve").click(function() {
        console.log($($("#resolve-tbody")[0]));
        $($("#resolve-tbody")[0]).append(resolveLine);
    });

    $(document).on('click', '.remove-add', function() {
        if ($('.make-line').length > 1) {
            $(this).parents(".make-line").remove();
        }
    });

    $(document).on('click', '.remove-resolve', function() {
        if ($('.resolve-line').length > 1) {
            $(this).parents(".resolve-line").remove();
        }
    });

    // keep radio of max&min checkbox
    // $(document).on('click', '.checkbox.max', function() {
    //     $(this).parents(".make-line").find(".checkbox.min").checkbox('uncheck');
    // });
    // $(document).on('click', '.checkbox.min', function() {
    //     $(this).parents(".make-line").find(".checkbox.max").checkbox('uncheck');
    // });

    var isMake = true;
    $(".ui.dimmer:not(.upload)").dimmer("show");
    if ($(".design-name").hasClass("new")) {
        swal({
            title: 'Name and select mode',
            html: '<div class="ui input mini fluid focus"><input type="text" placeholder="Design Name" id="design-name-input"></div><br>' +
                '<div class="ui buttons"><button class="ui button mode-btn make">Products</button><div class="or"></div><button class="ui button mode-btn resolve">Substrates</button></div>',
            preConfirm: function(result) {
                return new Promise(function(resolve, reject) {
                    var name = $("#design-name-input").val();
                    if (!name.length) {
                        reject("Enter a name.");
                    }
                    if (!$(".make.mode-btn").hasClass("active") && !$(".resolve.mode-btn").hasClass("active")) {
                        reject("Select a mode.");
                    }
                    var mode = $(".make.mode-btn").hasClass("active") ? "make" : "resolve";
                    resolve({
                        "name": name,
                        "mode": mode,
                        "_id":  $("#design-id").text()
                    });
                });
            },
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then(function(result) {
            // console.log(result);
            $.ajax({
                url: "/setDesignName",
                type: "POST",
                dataType: "json",
                contentType: 'application/json; charset=utf-8',
                cache: false,
                data: JSON.stringify(result),
                success: function(r) {
                    if (r.code) {
                        showErrMsg(r.message);
                        return false;
                    } else {
                        $(".design-name").text(result.name);
                    }
                }
            });
            if (result.mode === "make") {
                $(".resolve-row").hide();
                $(".ui.dimmer:not(.upload)").dimmer("hide");
            } else {
                $(".make-row").hide();
                $(".ui.dimmer:not(.upload)").dimmer("hide");
                isMake = false;
            }

            swal(
                'Enjoy the design time!',
                '',
                'success'
            );
        });
    } else if ($("#design-mode").text() == "make") {
        $(".resolve-row").hide();
        $(".ui.dimmer:not(.upload)").dimmer("hide");
    } else if ($("#design-mode").text() == "make") {
        $(".make-row").hide();
        $(".ui.dimmer:not(.upload)").dimmer("hide");
        isMake = false;
    }

    $(".idea.icon").click(function() {
        swal({
            title: 'Give it a new Name',
            html: '<div class="ui input mini fluid focus"><input type="text" placeholder="Design Name" id="design-name-input"></div><br>',
            preConfirm: function(result) {
                return new Promise(function(resolve, reject) {
                    var name = $("#design-name-input").val();
                    if (!name.length) {
                        reject("Enter a name.");
                    }
                    resolve({
                        "name": name,
                        "_id":  $("#design-id").text()
                    });
                });
            },
            showCancelButton: true
        }).then(function(result) {
            // console.log(result);
            $.ajax({
                url: "/setDesignName",
                type: "POST",
                dataType: "json",
                contentType: 'application/json; charset=utf-8',
                cache: false,
                data: JSON.stringify(result),
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
                        $(".design-name").text(result.name);
                    }
                }
            });
            swal(
                'Done!',
                '',
                'success'
            );
        });
    })

    $(document).on('click', '.mode-btn', function() {
        if ($(this).hasClass("make")) {
            $(this).addClass("green active");
            $(".resolve.mode-btn").removeClass("orange active");
        } else {
            $(this).addClass("orange active");
            $(".make.mode-btn").removeClass("green active");
        }
    })

    /* 
     * select dropdown
     * define the change callback function
     * to modify the package
     */
    var medium, flora;
    $("#medium-slt").dropdown({
        onChange: function(value, text, $selectedItem) {
            medium = value;
            console.log(value, text, $selectedItem);
        }
    });
    $("#medium-slt").dropdown("set selected", 1);

    $("#flora-slt").dropdown({
        onChange: function(value, text, $selectedItem) {
            flora = value;
            console.log(value, text, $selectedItem);
        }
    });
    $("#flora-slt").dropdown("set selected", 1);

    // disable select after upload file
    $(".button.flora").click(function() {
        $("#flora-slt").toggleClass("disabled");
    })

    // disable everything while using file
    $(".dimmer.upload").dimmer({
        capacity: 0.54,
        closable: false
    });
    $(".all-file").click(function() {
        $("#upload-all-file").click();
        $(".dimmer.upload").dimmer("toggle");
    });

    // set up ajax package
    var setUpPackage = function() {
        var inputs = [];

        if (isMake) {
            $(".make-line").each(function(n, el) {
                var line = $(el).find("input");
                inputs.push({
                    name: $(line[0]).val(),
                    lower: $(line[1]).val(),
                    upper: $(line[2]).val(),
                    maxim: $(el).find(".ui.checkbox").checkbox("is checked")
                });
            });
        } else {
            $(".resolve-line").each(function(n, el) {
                var line = $(el).find("input");
                inputs.push({
                    name: $(line[0]).val(),
                    begin: $(line[1]).val()
                });
            });
        }

        var other = {
            time: $("#time").val(),
            medium: medium,
            env: flora
        }

        return {
            design_id: $("#design-id").text(),
            mode: (isMake ? "made" : "resolve"),
            inputs: inputs,
            other: other
        };
    }

    $("#save-btn").click(function() {
        $.ajax({
            url: "/save_test",
            type: "POST",
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
            cache: false,
            data: JSON.stringify(setUpPackage()),
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
});