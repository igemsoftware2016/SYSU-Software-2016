$(document).ready(function() {
  // $("body").backstretch("destroy", false);
  $(".ui.banner").backstretch("/static/img/detail_banner-1.1.jpg");
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

  $('.ui.accordion').accordion();

  // hide not reached tab
  for(var i = parseInt($("#design-state").text()) + 1; i < 6; i++) {
    console.log("div.title.step-" + i);
    $("div.title.step-" + i).hide();
    $("div.content.step-" + i).hide();
  }

  if($("#design-state-2-not").text() === "True") {
    $("div.title.step-2").hide();
    $("div.content.step-2").hide();
  }

  if($("#design-state-3-not").text() === "True") {
    $("div.title.step-3").hide();
    $("div.content.step-3").hide();
  }

  // step 2 begin ///////////////////
  $(".step-2.title").click(function() {
    setTimeout(function() {
      $("#marker-1").click();
      $(".button.redraw2").click();
    }, 600);
  });

  // step 2 end   ///////////////////

  // share button (unshared now)
  $(".button.share.gray").click(function() {
    swal({
      title: '<b>Describe this design</b>',
      html: '<div class="ui form"><div class="field"><textarea rows="3" class="description"></textarea></div></div>' +
        '<div class="ui toggle checkbox"><input type="checkbox" class="help"><label>Wants someone help</label></div>',
      // input: 'textarea',
      showCancelButton: true,
      confirmButtonText: 'Submit',
      showLoaderOnConfirm: true,
      preConfirm: function(result) {
        return new Promise(function(resolve, reject) {
          var desc = $("textarea.description").val(),
            shared = true,
            needHelp = $("input.help:checked").length;
          resolve({
            "description": desc,
            "shared": shared,
            "needHelp": needHelp,
            "_id": $("#design-id").text()
          });
        });
      }
    }).then(function(text) {
      $.ajax({
        url: "/set_design_shared",
        type: "POST",
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        cache: false,
        data: JSON.stringify(text),
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
              html: 'This design could be visited by public now.'
            }).then(function() {
              location.reload();
            });
          }
        },
        error: function() {
          AjaxFail();
        }
      });
    });
  });

  // share button (shared)
  $(".button.share.brown").click(function() {
    swal({
      title: 'Set it private?',
      // text: "Others can't see this great work",
      type: 'question',
      showCancelButton: true,
      // confirmButtonColor: '#3085d6',
      // cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then(function() {
      $.ajax({
        url: "/set_design_shared",
        type: "POST",
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        cache: false,
        data: JSON.stringify({
          "shared": false,
          "needHelp": false,
          "_id": $("#design-id").text()
        }),
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
              html: 'This design is private now.'
            }).then(function() {
              location.reload();
            });
          }
        },
        error: function() {
          AjaxFail();
        }
      });
    });
  });

  $(".button.delete").click(function() {
    var $btn = $(this);
    swal({
      title: 'You are deleting a design',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      focusCancel: true
    }).then(function() {
      $.ajax({
        url: "/delete_design",
        type: "DELETE",
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        cache: false,
        data: JSON.stringify({
          design_id: $btn.parents('.grid.design').attr('design-id')
        }),
        success: function(r) {
          if (r.code) {
            showErrMsg(r.message);
            return false;
          } else {
            window.location.href = '/profile';
          }
        }
      });
    });
  });

  // get detail 1 saved data
  if ($("#design-file-1").text() === "False") {
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
          swal(r.message, "", "error").then(function() {
            window.location.href = "/profile";
          });
          return false;
        } else {
          if (r.ret) {
            if (r.ret.mode == "make") {
              $(".resolve-row").hide();
              $(r.ret.input).each(function(n, el) {
                var $line = $('<tr class="make-line">\
                  <td></td><td></td><td></td>\
                  <td>\
                  <div class="ui toggle checkbox">\
                  <input type="checkbox">\
                  <label></label>\
                  </div>\
                  </td>\
                  </tr>');
                $line.find("td").eq(0).text(el.name);
                $line.find("td").eq(1).text(el.lower);
                $line.find("td").eq(2).text(el.upper);
                $line.find(".ui.checkbox").checkbox();
                if (el.maxim) {
                  $line.find(".ui.checkbox").checkbox("check");
                }
                // $line.find(".ui.checkbox").addClass("disabled");
                $("#make-tbody").append($line);
              });
            } else if (r.ret.mode == "resolve") {
              $(".make-row").hide();
              // console.log(r.ret.input);
              $(r.ret.input).each(function(n, el) {
                var $line = $('<tr class="resolve-line"><td></td><td></td></tr>');
                $line.find("td").eq(0).text(el.name);
                $line.find("td").eq(1).text(el.begin);
                $("#resolve-tbody").append($line);
              });
            }

            $(".field.time").text(r.ret.other.time);
            $(".field.medium").text(r.ret.other.mediumName);
            $(r.ret.other.env).each(function(n, el) {
              var color = colors[Math.floor(Math.random() * colors.length)];
              $('.env.labels').append('<a class="ui ' + color + ' tag label">' + el + '</a>');
            });
          }
        }
      }
    });
    $(".upload-1").remove();
  } else {
    $(".none-upload-1").remove();
  }

  var abs600 = '<tr class="abs600">\
            <td class="center aligned">\
              <div class="ui right labeled input fluid">\
                <div class="state5_abs600"> ahahahah </div>\
              </div>\
            </td>\
            <td class="center aligned">\
              <div class="ui right labeled input fluid">\
                <div class="state5_abs600"> ahahahah </div>\
              </div>\
            </td>\
          </tr>';
  var fl = '<tr class="fl">\
            <td class="center aligned">\
              <div class="ui right labeled input fluid">\
                <div class="state5_fl"> ahahahah </div>\
              </div>\
            </td>\
            <td class="center aligned">\
              <div class="ui right labeled input fluid">\
                <div class="state5_fl"> ahahahah </div>\
              </div>\
            </td>\
          </tr>';
  var compund = '<tr class="compund">\
            <td class="center aligned">\
              <div class="ui search name fluid standard">\
                <div class="ui icon input fluid">\
                  <div class="state5_compund">Search matters...</div>\
                </div>\
                <div class="results"></div>\
              </div>\
            </td>\
            <td class="center aligned">\
              <div class="ui right labeled input fluid">\
                <div class="state5_compund">Search matters...</div>\
              </div>\
            </td>\
            <td class="center aligned">\
              <div class="ui right labeled input fluid">\
                <div class="state5_compund">Search matters...</div>\
              </div>\
            </td>\
          </tr>'

  if ($("#design-file-5").text() === "False") {
    $(".upload-5").remove();
        var cur_step = parseInt($("#design-state").text());

        if (cur_step >= 5)
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
                    $('.abs600:last .state5_abs600:eq(0)').text(el.time);
                    $('.abs600:last .state5_abs600:eq(1)').text(el.abs600);
                    $("#abs600").append(abs600);
                });
                $(fl_data).each(function (n, el) {
                    $('.fl:last .state5_fl:eq(0)').text(el.time);
                    $('.fl:last .state5_fl:eq(1)').text(el.fl);
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
                    $('.compund:last .state5_compund:eq(0)').text(el.compund);
                    $('.compund:last .state5_compund:eq(1)').text(el.time);
                    $('.compund:last .state5_compund:eq(2)').text(el.concentration);
                    $("#co-culture").append(compund);
                });
                $('.abs600:last').remove();
                $('.fl:last').remove();
                $('.compund:last').remove();
            }
        });

  } else {
    $(".non-upload-5").remove();
  }

});
