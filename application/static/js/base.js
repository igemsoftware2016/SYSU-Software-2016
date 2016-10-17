$(document).ready(function() {
  $("body").backstretch("/static/img/login_bg.png");
  // $("body").backstretch("destroy", false);

  $.extend($.fn.api.settings.api, {
    // categorySearch: 'http://api.semantic-ui.com/search/category/{query}'
    categorySearch: '/search/category/{query}'
  });

  window.colors = ['orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'violet', 'purple', 'pink', 'brown'];

  var $category = $('.ui.category.search');
  $category.search({
    type: 'category',
    apiSettings: {
      action: 'categorySearch'
    }
  });

  $('.menu > .ui.dropdown').dropdown({
    on: "hover"
  });

  var lastScroll = 0;
  $(window).scroll(function(event) {
    // console.log($(document).scrollTop());
    // if($(document).scrollTop() == 0) {
    //     $(".main.menu").fadeIn();
    // } else if($(document).scrollTop() < lastScroll) {
    //     $(".main.menu").fadeIn();
    // } else {
    //     $(".main.menu").fadeOut();
    // }
    if ($(document).scrollTop() == 0 && $("#to-top").hasClass("visibled")) {
      $("#to-top").removeClass("visibled");
      $("#to-top").fadeOut("fast");
    } else if (!$("#to-top").hasClass("visibled")) {
      $("#to-top").addClass("visibled");
      $("#to-top").show();
    }
    lastScroll = $(document).scrollTop();
    if ($(document).scrollTop() + $(window).height() >= $(document).height()) {
      $(".vertical.footer").fadeIn();
    } else {
      $(".vertical.footer").fadeOut();
    }
  });

  $("#to-top").click(function(e) {
    //以1秒的间隔返回顶部
    $('body,html').animate({
      scrollTop: 0
    }, 400);
  });

  $(".vertical.footer").fadeOut("slow");

  // global 
  window.AjaxFail = function() {
    swal({
      title: "Oo..",
      text: "There seems to be some problem",
      type: "error",
      confirmButtonText: "Okay..."
    });
  };

  var steps = $(".ui.five.steps.sticky");
  var data = {
    "_id": $("#design-id").text()
  }
  if (steps.length) {
    $.ajax({
      url: "/get_steps",
      type: "GET",
      dataType: "json",
      contentType: 'application/x-www-form-urlencoded; charset=utf-8',
      cache: false,
      data: data,
      success: function(r) {
        if (r.code) {
          swal({
            title: "Ooo_ERROR_STEPS",
            text: r.message,
            type: "error",
            confirmButtonText: "Okay"
          });
          return false;
        } else {
          r.ret -= 1; /* 1~5 -> 0~4*/
          $(steps.find(".step")).each(function(n, el) {
            if (n < r.ret) {
              $(el).children(".icon").addClass("green check"); /* done */
            } else if (n === r.ret) {
              $(el).children(".icon").addClass("info"); /* now doing */
            } else {
              $(el).addClass("disabled");
              $(el).children(".icon").addClass("help"); /* todo */
            }
          });
        }
      },
      error: AjaxFail
    });
  }

  window.showErrMsg = function(msg, text) {
    if (text) {
      swal({
        title: msg,
        text: text,
        type: "error",
        confirmButtonText: "Okay"
      });
    } else {
      swal({
        title: "Ooo",
        text: msg,
        type: "error",
        confirmButtonText: "Okay"
      });
    }
  }


  // like and mark button
  $(".button.like").click(function() {
    var $btn = $(this);
    if ($($(this).find(".icon")).hasClass("empty")) {
      $.ajax({
        url: "/set_like",
        type: "POST",
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        cache: false,
        data: JSON.stringify({
          design_id: $(this).parents('.grid.design').attr('design-id'),
          isLike: true
        }),
        success: function(r) {
          if (r.code) {
            showErrMsg(r.message);
            return false;
          } else {
            var nowLike = parseInt($($btn.find(".label")).text());
            $($btn.find(".label")).text(nowLike + 1);
            $($btn.find(".icon")).toggleClass("empty");
          }
        }
      });
    } else {
      $.ajax({
        url: "/set_like",
        type: "POST",
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        cache: false,
        data: JSON.stringify({
          design_id: $(this).parents('.grid.design').attr('design-id'),
          isLike: false
        }),
        success: function(r) {
          if (r.code) {
            showErrMsg(r.message);
            return false;
          } else {
            var nowLike = parseInt($($btn.find(".label")).text());
            $($btn.find(".label")).text(nowLike - 1);
            $($btn.find(".icon")).toggleClass("empty");
          }
        }
      });
    }
  });


  $(".button.mark").click(function() {
    var $btn = $(this);
    $.ajax({
      url: "/set_mark",
      type: "POST",
      dataType: "json",
      contentType: 'application/json; charset=utf-8',
      cache: false,
      data: JSON.stringify({
        design_id: $(this).parents('.grid.design').attr('design-id'),
        isMark: $($(this).find(".icon")).hasClass("empty")
      }),
      success: function(r) {
        if (r.code) {
          showErrMsg(r.message);
          return false;
        } else {
          $($btn.find(".icon")).toggleClass("empty");
        }
      }
    });
  });

  $(".button.tip-off").click(function() {
    var $btn = $(this);
    swal({
      html: '<b>Describe the tip-off reason please.</b>',
      input: 'textarea',
      showCancelButton: true,
      confirmButtonText: 'Submit',
      showLoaderOnConfirm: true,
      preConfirm: function(text) {
        return new Promise(function(resolve, reject) {
          setTimeout(function() {
            resolve();
          }, 1000);
        });
      },
      allowOutsideClick: false
    }).then(function(text) {
      $.ajax({
        url: "/report",
        type: "POST",
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        cache: false,
        data: JSON.stringify({
          "design_id": $btn.parents('.grid.design').attr('design-id'),
          "reason": text
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
              html: 'Your report is received.'
            });
          }
        },
        error: function() {
          AjaxFail();
        }
      });
    });
  });

  $(".ui.progress").progress();


});