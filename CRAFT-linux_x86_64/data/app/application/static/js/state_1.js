$(document).ready(function() {
  $('.ui.name.search').search({
    apiSettings: {
      url: '/search/matters/{query}'
    },
    fields: {
      results: 'results',
      title: 'title'
    },
    minCharacters: 1
  });

  $('.ui.env.search').search({
    apiSettings: {
      url: '/search/microbiota/{query}'
    },
    fields: {
      results: 'results',
      title: 'title'
    },
    minCharacters: 1,
    maxResults: 4,
    onSelect: function(result, response) {
      var color = colors[Math.floor(Math.random() * colors.length)];
      $('.env.labels').append('<a class="ui env label ' + color + '"><span>' +
        result.title + '</span><i class="icon env close"></i></a>');
    }
  });

  // remove env labels
  $(document).on('click', '.env.close', function() {
    $(this).parent().remove();
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

  var makeLine = '<tr class="make-line"><td class="center aligned"><div class="ui search name fluid"><div class="ui icon input fluid"><input class="prompt" type="text" placeholder="Search matters..."><i class="search icon"></i></div><div class="results"></div></div></td><td class="center aligned"><div class="ui right labeled input fluid"><input type="number" placeholder="Weight.."><div class="ui basic label">mol/L </div></div></td><td class="center aligned"><div class="ui right labeled input fluid"><input type="number" placeholder="Weight.."><div class="ui basic label">mol/L </div></div></td><td class="center aligned"><div class="ui toggle checkbox max"><input type="checkbox"><label></label></div></td><td class="right aligned"><button class="ui circular minus icon button tiny remove-add"><i class="minus icon"></i></button></td></tr>'
  var resolveLine = '<tr class="resolve-line"><td class="center aligned"><div class="ui input fluid name search"><input class="prompt" type="text" placeholder="Search matter..."></div><div class="results"></div></td><td class="center aligned"><div class="ui right labeled input fluid"><input type="number" placeholder="Weight.."><div class="ui basic label">mol/L </div></div></td><td class="right aligned"><button class="ui circular minus icon button tiny remove-resolve"><i class="minus icon"></i></button></td></tr>'


  $(document).on('click', "#add-make", function() {
    $($("#make-tbody")[0]).append(makeLine);
    $('.ui.name.search').search({
      apiSettings: {
        url: '/search/matters/{query}'
      },
      fields: {
        results: 'results',
        title: 'title'
          // description: 'description'
      },
      minCharacters: 1
    });
  });

  $("#add-resolve").click(function() {
    $($("#resolve-tbody")[0]).append(resolveLine);
    $('.ui.name.search').search({
      apiSettings: {
        url: '/search/matters/{query}'
      },
      fields: {
        results: 'results',
        title: 'title'
          // description: 'description'
      },
      minCharacters: 1
    });
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
        '<div class="ui buttons"><button class="ui button mode-btn make">Synthesis</button><div class="or"></div><button class="ui button mode-btn resolve">Decomposition</button></div>',
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
            "_id": $("#design-id").text()
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
  } else if ($("#design-mode").text() == "resolve") {
    $(".make-row").hide();
    $(".ui.dimmer:not(.upload)").dimmer("hide");
    isMake = false;
  }

  if ($('#design-file').text() === "True") {
    $('.ui.dimmer.upload').dimmer('show');
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
            "_id": $("#design-id").text()
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
  // var medium, flora;
  $("#medium-slt").dropdown();
  // $("#medium-slt").dropdown({
  // onChange: function(value, text, $selectedItem) {
  //     medium = value;
  //     console.log(value, text, $selectedItem);
  // }
  // });
  // $("#medium-slt").dropdown("set selected", 1);

  // $("#flora-slt").dropdown({
  //     onChange: function(value, text, $selectedItem) {
  //         flora = value;
  //         console.log(value, text, $selectedItem);
  //     }
  // });
  // $("#flora-slt").dropdown("set selected", 1);

  // disable everything while using file
  $(".dimmer.upload").dimmer({
    capacity: 0.54,
    closable: false
  });

  var isUpload = false;

  $('#upload-all-file').change(function() {
    $('.upload span').text($('#upload-all-file').val());
  });

  // set up ajax package
  var setUpPackage = function() {
    var inputs = [],
      flora = [],
      err = false;

    if (isMake) {
      $(".make-line").each(function(n, el) {
        var line = $(el).find("input"),
          name = $(line[0]).val(),
          lower = $(line[1]).val(),
          upper = $(line[2]).val();
        if (!(name && lower && upper)) {
          swal("", "Some parameters have not been defined.", "info");
          err = true;
          return false;
        }
        if (lower < 0 || upper < 0 || (lower - upper >= 0)) {
          console.log(lower, upper, (lower - upper >= 0));
          swal("", "Some bounds are illegal.", "info");
        }
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
        if (!($(line[0]).val() && $(line[1]).val())) {
          swal("", "Some parameters have not been defined.", "info");
          err = true;
          return false;
        }
        inputs.push({
          name: $(line[0]).val(),
          begin: $(line[1]).val()
        });
      });
    }

    $('.env.label').each(function(n, el) {
      flora.push($(el).find('span').text());
    })

    var other = {
      time: $("#time").val(),
      medium: $("#medium-slt").dropdown("get value"),
      env: flora
    }

    if (!(other.time && other.medium)) {
      swal("", "Some parameters have not been defined.", "info");
      return false;
    }

    return err ? false : {
      design_id: $("#design-id").text(),
      mode: (isMake ? "make" : "resolve"),
      inputs: inputs,
      other: other
    };
  }

  var uploader = new plupload.Uploader({
    runtimes: 'html5,flash,silverlight,html4',

    browse_button: 'upload-btn', // you can pass in id...
    //container: getElementById, // ... or DOM Element itself

    url: "/upload/" + $("#design-id").text() + "/1",

    filters: {
      max_file_size: '100mb',
      mime_types: [{
        title: "excel files",
        extensions: "xls"
      }]
    },

    // Flash settings
    flash_swf_url: 'static/plupload/js/Moxie.swf',

    // Silverlight settings
    silverlight_xap_url: 'static/plupload/js/Moxie.xap',

    init: {
      PostInit: function() {
        document.getElementById('save-btn').onclick = function() {

          if (parseInt($("#design-state").text()) <= 1) {
            save_state_1_with_file();
          } else {
            swal({
              title: 'Trying saving a previous step',
              text: "Subsequent steps will be reset!",
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#d33',
              confirmButtonText: 'Yes, commit it!',
              focusCancel: true
            }).then(function() {
              save_state_1_with_file();
            });
          }

          return false;
        };
      },

      FilesAdded: function(up, files) {
        isUpload = true;
        $("#design-file").text("False");
        $(".dimmer.upload").dimmer("show");
        $(files).each(function(n, file) {
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
        $(files).each(function(n, file) {
          console.log(file.name);
        });
      },

      Error: function(up, err) {
        // console.log(err);
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
          location.reload();
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

  // get saved state data
  if ($("#design-file").text() === "False") {
    $.ajax({
      url: "/get_state_1_saved",
      type: "GET",
      dataType: "json",
      contentType: 'charset=utf-8',
      cache: false,
      data: {
        design_id: $("#design-id").text()
      },
      success: function(r) {
        if (r.code) {
          showErrMsg(r.message);
          return false;
        } else {
          if (r.ret) {
            if (r.ret.mode == "make") {
              $(r.ret.input).each(function(n, el) {
                var $line = $('.make-line').eq(-1);
                $line.find("input").eq(0).val(el.name);
                $line.find("input").eq(1).val(el.lower);
                $line.find("input").eq(2).val(el.upper);
                if (el.maxim) {
                  $line.find(".ui.checkbox").checkbox("set checked");
                }
                $("#add-make").click();
              });
              $('.make-line').eq(-1).find("button.remove-add").click();
            } else if (r.ret.mode == "resolve") {
              $(r.ret.input).each(function(n, el) {
                var $line = $('.resolve-line').eq(-1);
                $line.find("input").eq(0).val(el.name);
                $line.find("input").eq(1).val(el.begin);
                $("#add-resolve").click();
              });
              $('.resolve-line').eq(-1).find("button.remove-resolve").click();
            }

            if (r.ret.other) {
              $("#time").val(r.ret.other.time);
              $("#medium-slt").dropdown("set value", r.ret.other.medium);
              $(r.ret.other.env).each(function(n, el) {
                var color = colors[Math.floor(Math.random() * colors.length)];
                $('.env.labels').append('<a class="ui env label ' + color + '"><span>' +
                  el + '</span><i class="icon env close"></i></a>');
              });
              $("#medium-slt").dropdown("set selected", r.ret.other.medium);
            }
          }
        }
      }
    });
  }

  var save_state_1_with_file = function() {
    if (isUpload == false) {
      var pack = setUpPackage();
      console.log(pack);
      if (!pack) {
        return false;
      } else {
        $.ajax({
          url: "/save_state_1",
          type: "POST",
          dataType: "json",
          contentType: 'application/json; charset=utf-8',
          cache: false,
          data: JSON.stringify(pack),
          success: function(r) {
            if (r.code) {
              showErrMsg(r.message);
              return false;
            } else {
              swal({
                title: "Done",
                type: "success",
                confirmButtonText: "Okay"
              });
            }
          },
          error: AjaxFail
        });
      }
    } else {
      uploader.start();
      // $(".dimmer.upload").dimmer("hide");
    }
  }

  var save_state_1 = function() {
    if ($("#design-file").text() === "True") {
      $.ajax({
        url: "/commit_state_1",
        type: "POST",
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        cache: false,
        data: JSON.stringify({
          "design_id": $("#design-id").text()
        }),
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
            window.location.href = r.ret;
          }
        },
        error: AjaxFail
      });
      return True;
    } else if (isUpload) {
      swal("", "Click save button to upload file first.", "info");
      return false;
    }
    var pack = setUpPackage();
    if (!pack) {
      return false;
    }
    $.ajax({
      url: "/commit_state_1",
      type: "POST",
      dataType: "json",
      contentType: 'application/json; charset=utf-8',
      cache: false,
      data: JSON.stringify(pack),
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
          window.location.href = r.ret;
        }
      },
      error: AjaxFail
    });
  }


  $("#next-step").click(function() {
    if (parseInt($("#design-state").text()) <= 1) {
      save_state_1();
    } else {
      swal({
        title: 'Trying saving a previous step',
        text: "Subsequent steps will be reset!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Yes, commit it!',
        focusCancel: true
      }).then(function() {
        save_state_1();
      });
    }
  });
});