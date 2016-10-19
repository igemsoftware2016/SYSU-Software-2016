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

    var compund='<tr class="compund">\
            <td class="center aligned">\
              <div class="ui search name fluid standard">\
                <div class="ui icon input fluid">\
                  <input class="prompt" type="text" placeholder="Search matters...">\
                  <i class="search icon"></i>\
                </div>\
                <div class="results"></div>\
              </div>\
            </td>\
            <td class="center aligned">\
              <div class="ui right labeled input fluid">\
                <input type="number" placeholder="Enter Time">\
                <div class="ui basic label">Mins </div>\
              </div>\
            </td>\
            <td class="center aligned">\
              <div class="ui right labeled input fluid">\
                <input type="number" placeholder="Weight..">\
                <div class="ui basic label">mol/L </div>\
              </div>\
            </td>\
            <td class="right aligned">\
              <button class="ui circular minus icon button tiny remove-compund">\
                <i class="minus icon"></i>\
              </button>\
            </td>\
          </tr>';

    var abs600='<tr class="abs600">\
            <td class="center aligned">\
              <div class="ui right labeled input fluid">\
                <input type="number" placeholder="Enter Time">\
                <div class="ui basic label">Mins </div>\
              </div>\
            </td>\
            <td class="center aligned">\
              <div class="ui right labeled input fluid">\
                <input type="number" placeholder="Weight..">\
                <div class="ui basic label">AU </div>\
              </div>\
            </td>\
            <td class="right aligned">\
              <button class="ui circular minus icon button tiny remove-abs600">\
                <i class="minus icon"></i>\
              </button>\
            </td>\
          </tr>';

    var fl = '<tr class="fl">\
            <td class="center aligned">\
              <div class="ui right labeled input fluid">\
                <input type="number" placeholder="Enter Time">\
                <div class="ui basic label">Mins </div>\
              </div>\
            </td>\
            <td class="center aligned">\
              <div class="ui right labeled input fluid">\
                <input type="number" placeholder="Weight..">\
                <div class="ui basic label">AU </div>\
              </div>\
            </td>\
            <td class="right aligned">\
              <button class="ui circular minus icon button tiny remove-fl">\
                <i class="minus icon"></i>\
              </button>\
            </td>\
          </tr>';

    $("#add-compund").click(function() {
        $("#co-culture").append(compund);
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

    $("#add-abs600").click(function() {
        $("#abs600").append(abs600);
    });

    $("#add-fl").click(function() {
        $("#fl").append(fl);
    });

    $(document).on("click", ".remove-compund", function() {
        if ($(".compund").length > 1) {
            $(this).parents(".compund").remove();
        }
    });

    $(document).on("click", ".remove-abs600", function() {
        if ($(".abs600").length > 1) {
            $(this).parents(".abs600").remove();
        }
    });

    $(document).on("click", ".remove-fl", function() {
        if ($(".fl").length > 1) {
            $(this).parents(".fl").remove();
        }
    });

    // set up ajax package
    var setUpPackage = function() {
        var inputs = {
            abs600: [],
            fl: [],
            compund: []
        };
        
        var vaild = true;
        
        $(".abs600").each(function(n, el) {
            var line = $(el).find("input");
            if (!($(line[0]).val() && $(line[1]).val()))
                vaild = false;
            if ($(line[0]).val() < 0 || $(line[1]).val() < 0)
                vaild = false;
            inputs.abs600.push({
                time: $(line[0]).val(),
                abs600: $(line[1]).val()
            });
        });

        $(".fl").each(function(n, el) {
            var line = $(el).find("input");
            if (!($(line[0]).val() && $(line[1]).val()))
                vaild = false;
            if ($(line[0]).val() < 0 || $(line[1]).val() < 0)
                vaild = false;
            inputs.fl.push({
                time: $(line[0]).val(),
                fl: $(line[1]).val()
            });
        });

        $(".compund").each(function(n, el) {
            var line = $(el).find("input");
            if (!($(line[0]).val() && $(line[1]).val() && $(line[2]).val()))
                vaild = false;
            if ($(line[1]).val() < 0 || $(line[2]).val() < 0)
                vaild = false;
            inputs.compund.push({
                compund: $(line[0]).val(),
                time: $(line[1]).val(),
                concentration: $(line[2]).val()
            });
        });

        if (vaild)
            return {
                design_id: $("#design-id").text(),
                inputs: inputs,
            };
        else
            return false;
    }

    $(".dimmer.upload").dimmer({
        capacity: 0.54,
        closable: false
    });

    var isUpload = false;

    $('#upload-all-file').change(function() {
        $('.upload span').text($('#upload-all-file').val());
    });

    if ($('#design-file-5').text() === "True") {
        $('.ui.dimmer.upload').dimmer('show');
        $('#dimmer-content').html('<a href="/static/upload/design-' + $("#design-id").text() +'-state-5.xls"> design-' + $("#design-id").text() +'-state-5.xls</a>');
        console.log("A");
        isUpload = true;
    } else {
        $.ajax({
            url: "/get_state_5_saved",
            type: "GET",
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
            cache: false,
            data: {design_id: $("#design-id").text()},
            success: function(r) {
                if (r.code) {
                    swal({
                        title: "Ooo",
                        text: r.message,
                        type: "error",
                        confirmButtonText: "Okay"
                    });
                    return false;
                }
                var abs600_data = r.ret.inputs.abs600;
                var fl_data = r.ret.inputs.fl;
                var compund_data = r.ret.inputs.compund;
                $(abs600_data).each(function (n, el) {
                    $('.abs600:last input:eq(0)').val(el.time);
                    $('.abs600:last input:eq(1)').val(el.abs600);
                    $("#abs600").append(abs600);
                });
                $(fl_data).each(function (n, el) {
                    $('.fl:last input:eq(0)').val(el.time);
                    $('.fl:last input:eq(1)').val(el.fl);
                    $("#fl").append(fl);
                });
                $(compund_data).each(function (n, el) {
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
                    $('.compund:last input:eq(0)').val(el.compund);
                    $('.compund:last input:eq(1)').val(el.time);
                    $('.compund:last input:eq(2)').val(el.concentration);
                    $("#co-culture").append(compund);
                });
                $('.abs600:last').remove();
                $('.fl:last').remove();
                $('.compund:last').remove();
            }
        });
    }

    var uploader = new plupload.Uploader({
        runtimes : 'html5,flash,silverlight,html4',

        browse_button : 'upload-btn', // you can pass in id...
        //container: getElementById, // ... or DOM Element itself

        url : "/upload/" + $("#design-id").text() + "/5",

        filters : {
            max_file_size : '100mb',
            mime_types: [
                {title : "excel files", extensions : "xls"}
            ]
        },

        // Flash settings
        flash_swf_url : 'static/plupload/js/Moxie.swf',

        // Silverlight settings
        silverlight_xap_url : 'static/plupload/js/Moxie.xap',

        init: {
            PostInit: function() {
                document.getElementById('submit').onclick = function() {
                    if (isUpload == false) {
                        var upload_data = setUpPackage();
                        if (!upload_data) {
                            swal("", "Invalid parameters", "info");
                            return;
                        }
                        $.ajax({
                            url: "/save_state_5",
                            type: "POST",
                            dataType: "json",
                            contentType: 'application/json; charset=utf-8',
                            cache: false,
                            data: JSON.stringify(upload_data),
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
                                    }).then(function(){
                                        window.location.href='/design/' + $('#design-id').text();
                                    });
                                }
                            }
                        });
                    } else {
                        uploader.start();
                        $(".dimmer.upload").dimmer("hide");
                    }
                    return false;
                };
            },

            FilesAdded: function(up, files) {
                isUpload = true;
                $(".dimmer.upload").dimmer("show");
                $(files).each(function(n, file){
                    if (n == 0)
                        $('.upload span').text(file.name);
                    else
                        up.removeFile(file);
                });
            },

            FilesRemoved: function(up, files) {
                if (up.files.length < 1) {
                    $(".dimmer.upload").dimmer("hide");
                    isUpload = false;
                }
                $(files).each(function(n, file){
                    console.log(file.name);
                });
            },
 
            Error: function(up, err) {
                console.log(err);
                swal({
                    title: "Ooo",
                    text: err.message,
                    type: "error",
                    confirmButtonText: "Okay"
                });
            },
            
            UploadComplete: function(up, files) {
                swal({
                    title: "Done",
                    text: "File is uploaded.",
                    type: "success",
                    confirmButtonText: "Okay"
                }).then(function() {
                    window.location.href='/design/' + $('#design-id').text();
                });
            }
        }
    });
    
    uploader.init();
    
    $(".dimmer").click(function() {
        $(uploader.files).each(function(n, file) {
            uploader.removeFile(file);
        });
    });
});
