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

  // step 2 begin ///////////////////
  $(".state-2.title").click(function() {
    setTimeout(function() {
      $("#marker-1").click();
      $(".button.redraw2").click();
    }, 600); 
  });
  

  // var ctx = document.getElementById("myChart-2");
  // var data = {
  //   labels: ['0.0', '0.5', '1.0', '1.5', '2.0', '2.5', '3.0', '3.5', '4.0', '4.5', '5.0', '5.5', '6.0', '6.5', '7.0', '7.5', '8.0', '8.5', '9.0', '9.5', '10.0'],
  //   datasets: [{
  //     label: "CL",
  //     fill: false, // 
  //     lineTension: 0.4,
  //     backgroundColor: "rgba(237,174,73,0.4)",
  //     borderColor: "rgba(237,174,73,1)",
  //     borderCapStyle: 'butt',
  //     borderDash: [],
  //     borderDashOffset: 0.0,
  //     borderJoinStyle: 'miter',
  //     pointBorderColor: "rgba(237,174,73,1)",
  //     pointBackgroundColor: "#fff",
  //     pointBorderWidth: 1,
  //     pointHoverRadius: 5,
  //     pointHoverBackgroundColor: "rgba(237,174,73,1)",
  //     pointHoverBorderColor: "rgba(237,174,730,1)",
  //     pointHoverBorderWidth: 2,
  //     pointRadius: 1,
  //     pointHitRadius: 10,
  //     pointStyle: "round",
  //     data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //     spanGaps: false,
  //   }]
  // };
  // window.myLineChart_2 = new Chart(ctx, {
  //   type: 'line',
  //   data: data,
  //   options: {
  //     title: {
  //       display: true,
  //       text: 'Dynamic Performance'
  //     },
  //     maintainAspectRatio: false,
  //     fullWidth: false,
  //     legend: {
  //       position: "left",
  //       display: false
  //     },
  //     scales: {
  //       yAxes: [{
  //         scaleLabel: {
  //           display: true,
  //           labelString: 'Output'
  //         }
  //       }],
  //     }
  //   }
  // });


  // $($("#marker-1").parent()).click(function() {
  //   var now_id = $("#marker-1").attr("_id");
  //   if (!now_id) {
  //     return false;
  //   }
  //   setPopup(now_id); // set four popup
  //   setRange(now_id); // set four range

  //   $("img.promoter").attr("src", "/static/img/promoter-orange.png");
  //   $("img.RBS").attr("src", "/static/img/RBS-orange.png");
  //   $("img.CDS").attr("src", "/static/img/CDS-orange.png");
  //   $("img.teminator").attr("src", "/static/img/teminator-orange.png");
  //   $(".ui.row.component").hide();
  //   $(".ui.row.component").fadeIn();
  // });
  // // green one
  // $($("#marker-2").parent()).click(function() {
  //   var now_id = $("#marker-2").attr("_id");
  //   if (!now_id) {
  //     return false;
  //   }
  //   setPopup(now_id); // set four popup
  //   setRange(now_id); // set four range
  //   $("img.promoter").attr("src", "/static/img/promoter-green.png");
  //   $("img.RBS").attr("src", "/static/img/RBS-green.png");
  //   $("img.CDS").attr("src", "/static/img/CDS-green.png");
  //   $("img.teminator").attr("src", "/static/img/teminator-green.png");
  //   $(".ui.row.component").hide();
  //   $(".ui.row.component").fadeIn();
  // });
  // // blue one
  // $($("#marker-3").parent()).click(function() {
  //   var now_id = $("#marker-3").attr("_id");
  //   if (!now_id) {
  //     return false;
  //   }
  //   setPopup(now_id); // set four popup
  //   setRange(now_id); // set four range
  //   $("img.promoter").attr("src", "/static/img/promoter-blue.png");
  //   $("img.RBS").attr("src", "/static/img/RBS-blue.png");
  //   $("img.CDS").attr("src", "/static/img/CDS-blue.png");
  //   $("img.teminator").attr("src", "/static/img/teminator-blue.png");
  //   $(".ui.row.component").hide();
  //   $(".ui.row.component").fadeIn();
  // });
  // $("#marker-1").mouseenter(function() {
  //   $("#highlight-1").show();
  // }).mouseleave(function() {
  //   $("#highlight-1").hide();
  // });
  // $("#marker-2").mouseenter(function() {
  //   $("#highlight-2").show();
  // }).mouseleave(function() {
  //   $("#highlight-2").hide();
  // });
  // $("#marker-3").mouseenter(function() {
  //   $("#highlight-3").show();
  // }).mouseleave(function() {
  //   $("#highlight-3").hide();
  // });

  // $("#highlight-1").hide();
  // $("#highlight-2").hide();
  // $("#highlight-3").hide();

  // step 2 end   ///////////////////

  // step 3 chart
  var ctx = document.getElementById("myChart-3");
  var dataSets = [{
    label: "CL",
    fill: false, // 
    lineTension: 0.4,
    backgroundColor: "rgba(75,192,192,0.4)",
    borderColor: "rgba(75,192,192,1)",
    borderCapStyle: 'butt',
    borderDash: [],
    borderDashOffset: 0.0,
    borderJoinStyle: 'miter',
    pointBorderColor: "rgba(75,192,192,1)",
    pointBackgroundColor: "#fff",
    pointBorderWidth: 1,
    pointHoverRadius: 5,
    pointHoverBackgroundColor: "rgba(75,192,192,1)",
    pointHoverBorderColor: "rgba(220,220,220,1)",
    pointHoverBorderWidth: 2,
    pointRadius: 1,
    pointHitRadius: 10,
    pointStyle: "round",
    data: [0, 500, 680, 610, 510, 400, 270, 120, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    spanGaps: false,
  }, {
    label: "TetR",
    fill: false, // 
    lineTension: 0.4,
    backgroundColor: "rgba(213,78,78,0.4)",
    borderColor: "rgba(213,78,78,1)",
    borderCapStyle: 'butt',
    borderDash: [],
    borderDashOffset: 0.0,
    borderJoinStyle: 'miter',
    pointBorderColor: "rgba(213,78,78,1)",
    pointBackgroundColor: "#fff",
    pointBorderWidth: 1,
    pointHoverRadius: 5,
    pointHoverBackgroundColor: "rgba(213,78,78,1)",
    pointHoverBorderColor: "rgba(220,220,220,1)",
    pointHoverBorderWidth: 2,
    pointRadius: 1,
    pointHitRadius: 10,
    pointStyle: "round",
    data: [0, 320, 500, 600, 605, 612, 619, 623, 629, 631, 638, 640, 647, 659, 672, 710, 801, 964, 1218, 1521, 1900],
    spanGaps: false,
  }, {
    label: "UVR8-TetR",
    fill: false, // 
    lineTension: 0.4,
    backgroundColor: "rgba(48,48,48,0.4)",
    borderColor: "rgba(48,48,48,1)",
    borderCapStyle: 'butt',
    borderDash: [],
    borderDashOffset: 0.0,
    borderJoinStyle: 'miter',
    pointBorderColor: "rgba(48,48,48,1)",
    pointBackgroundColor: "#fff",
    pointBorderWidth: 1,
    pointHoverRadius: 5,
    pointHoverBackgroundColor: "rgba(48,48,48,1)",
    pointHoverBorderColor: "rgba(220,220,220,1)",
    pointHoverBorderWidth: 2,
    pointRadius: 1,
    pointHitRadius: 10,
    pointStyle: "round",
    data: [0.0, 24.0, 48.0, 71.0, 95.0, 119.0, 143.0, 167.0, 190.0, 214.0, 238.0, 262.0, 286.0, 310.0, 333.0, 357.0, 381.0, 405.0, 429.0, 452.0, 476.0],
    spanGaps: false,
  }];
  var data = {
    labels: ['0.0', '0.5', '1.0', '1.5', '2.0', '2.5', '3.0', '3.5', '4.0', '4.5', '5.0', '5.5', '6.0', '6.5', '7.0', '7.5', '8.0', '8.5', '9.0', '9.5', '10.0'],
    datasets: dataSets
  };
  window.myLineChart_3 = new Chart(ctx, {
    type: 'line',
    data: data,
    options: {
      title: {
        display: true,
        text: 'Dynamic Performance'
      },
      maintainAspectRatio: false,
      fullWidth: false,
      legend: {
        position: "left",
        display: false
      },
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Output'
          }
        }]
      },
      legendCallback: function(chart) {
        // console.log(chart);
        var legendHtml = [];
        for (var i = 0; i < chart.data.datasets.length; i++) {
          if (chart.data.datasets[i].label) {
            legendHtml.push('<a class="item active legend" onclick="updateDataset(event, \'' + chart.legend.legendItems[i].datasetIndex + '\')">' + chart.data.datasets[i].label + '</a>');
          }
        }
        return legendHtml.join("");
      },
    }
  });

  updateDataset = function(e, datasetIndex) {
    var index = datasetIndex;
    var ci = e.view.myLineChart_3;
    var meta = ci.getDatasetMeta(index);

    // See controller.isDatasetVisible comment
    meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;

    // We hid a dataset ... rerender the chart
    ci.update();
  };

  $("#state-3-menu").append(myLineChart_3.generateLegend());

  $(".item.legend").click(function() {
    $(this).toggleClass("active");
  });

  // share button (unshared now)
  $(".button.share.gray").click(function() {
    swal({
      title: '<b>Describe this design</b>',
      html: '<div class="ui form"><div class="field"><textarea rows="3" class="description"></textarea></div></div>' +
        '<div class="ui toggle checkbox"><input type="checkbox" class="help"><label>Wanted someone help</label></div>',
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
            location.reload();
            // swal({
            //     type: 'success',
            //     title: 'Done',
            //     html: 'This design could be visited by public now.'
            // });
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
            location.reload();
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
              if (el.maxim) {
                $line.find(".ui.checkbox").checkbox("set checked");
              }
              $line.find(".ui.checkbox").checkbox("set disabled");
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
});