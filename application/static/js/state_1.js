$(document).ready(function() {
    var content = [{
        title: 'Andorra'
    }, {
        title: 'United Arab Emirates'
    }, {
        title: 'Afghanistan'
    }, {
        title: 'Antigua'
    }, {
        title: 'Anguilla'
    }, {
        title: 'Albania'
    }, {
        title: 'Armenia'
    }, {
        title: 'Netherlands Antilles'
    }, {
        title: 'Angola'
    }, {
        title: 'Argentina'
    }, {
        title: 'American Samoa'
    }, {
        title: 'Austria'
    }, {
        title: 'Australia'
    }, {
        title: 'Aruba'
    }, {
        title: 'Aland Islands'
    }, {
        title: 'Azerbaijan'
    }, {
        title: 'Bosnia'
    }, {
        title: 'Barbados'
    }, {
        title: 'Bangladesh'
    }, {
        title: 'Belgium'
    }, {
        title: 'Burkina Faso'
    }, {
        title: 'Bulgaria'
    }, {
        title: 'Bahrain'
    }, {
        title: 'Burundi'
    }];

    $('.ui.input.name').search({
        source: content
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

    var makeLine = '<tr class="make-line"><td class = "center aligned"><div class = "ui input fluid name search"><input class = "prompt"type = "text"placeholder = "Search matter..."></div><div class = "results"></div></td><td class = "center aligned"><div class = "ui right labeled input fluid"><input type = "text"placeholder = "Weight.."><div class = "ui basic label">Unit </div></div></td><td class = "center aligned"><div class = "ui right labeled input fluid"><input type = "text"placeholder = "Weight.."><div class = "ui basic label">Unit </div></div></td><td class = "center aligned"><div class = "ui toggle checkbox max"><input type = "checkbox"><label></label></div></td><td class = "center aligned"><div class = "ui toggle checkbox min"><input type = "checkbox"><label></label></div></td><td class = "right aligned"><button class = "ui circular minus icon button tiny remove-add"><i class = "minus icon"></i></button></td></tr>'
    var resolveLine = '<tr class="resolve-line"><td class="center aligned"><div class="ui input fluid name search"><input class="prompt" type="text" placeholder="Search matter..."></div><div class="results"></div></td><td class="center aligned"><div class="ui right labeled input fluid"><input type="text" placeholder="Weight.."><div class="ui basic label">Unit </div></div></td><td class="right aligned"><button class="ui circular minus icon button tiny remove-resolve"><i class="minus icon"></i></button></td></tr>'


    $(document).on('click', "#add-make", function() {
        $($("#make-tbody")[0]).append(makeLine);
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
    $(document).on('click', '.checkbox.max', function() {
        $(this).parents(".make-line").find(".checkbox.min").checkbox('uncheck');
    });
    $(document).on('click', '.checkbox.min', function() {
        $(this).parents(".make-line").find(".checkbox.max").checkbox('uncheck');
    });

    var isMake = true;
    $(".ui.dimmer:not(.upload)").dimmer("show");
    swal({
        title: 'Select Mode',
        text: "Which design mode you want to use?",
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#21BA45',
        cancelButtonColor: '#FBBD08',
        confirmButtonText: 'Make Mode',
        cancelButtonText: 'Resolve Mode',
        allowOutsideClick: false,
        allowEscapeKey: false,
    }).then(function() {
        swal(
            'Enjoy the design time!',
            '',
            'success'
        );
        $(".resolve-row").hide();
        $(".ui.dimmer:not(.upload)").dimmer("hide");
    }, function(dismiss) {
        // dismiss can be 'cancel', 'overlay',
        // 'close', and 'timer'
        if (dismiss === 'cancel') {
            swal(
                'Enjoy the design time!',
                '',
                'success'
            );
            $(".make-row").hide();
            $(".ui.dimmer:not(.upload)").dimmer("hide");
            isMake = false;
        }
    });

    /* 
     * select dropdown
     * define the change callback function
     * to modify the package
     */
    $("#medium-slt").dropdown({
        onChange: function(value, text, $selectedItem) {
            console.log(value, text, $selectedItem);
        }
    });
    $("#medium-slt").dropdown("set selected", 1);

    $("#flora-slt").dropdown({
        onChange: function(value, text, $selectedItem) {
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
    })
});