$(document).ready(function() {
  $('.ui.sidebar')
    .sidebar({
      context: $('.bottom.segment')
    });

  // range items
  $('.ui.range').range({
    min: 0,
    max: 1,
    start: 0,
    step: 0.01
  });


  var ctx = document.getElementById("myChart-2");
  var time_2 = parseFloat($("#design-time").text());
  var labels = [];
  for (var i = 0; i < 21; i++) {
    labels.push((i / 21.0 * time_2).toFixed(1));
  }
  var data = {
    labels: labels,
    datasets: [{
      label: "CL",
      fill: false, // 
      lineTension: 0.4,
      backgroundColor: "rgba(237,174,73,0.4)",
      borderColor: "rgba(237,174,73,1)",
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: "rgba(237,174,73,1)",
      pointBackgroundColor: "#fff",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "rgba(237,174,73,1)",
      pointHoverBorderColor: "rgba(237,174,730,1)",
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      pointStyle: "round",
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      spanGaps: false,
    }]
  };
  window.myLineChart_2 = new Chart(ctx, {
    type: 'line',
    data: data,
    options: {
      title: {
        display: true,
        text: 'Protein Expression'
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
            labelString: 'Concentration (mol/L)'
          }
        }],
        // xAxes: [{
        //     scaleLabel: {
        //         display: true,
        //         labelString: 'month'
        //     }
        // }]
      }
    }
  });
  // plasmid
  // orange one
  $($("#marker-1").parent()).click(function() {
    var now_id = $("#marker-1").attr("_id");
    if (!now_id) {
      return false;
    }
    setPopup(now_id); // set four popup
    setRange(now_id); // set four range

    $("img.promoter").attr("src", "/static/img/promoter-blue.png");
    $("img.RBS").attr("src", "/static/img/RBS-blue.png");
    $("img.CDS").attr("src", "/static/img/CDS-blue.png");
    $("img.teminator").attr("src", "/static/img/teminator-blue.png");
    $(".ui.row.component").hide();
    $(".ui.row.component").fadeIn();
  });
  // green one
  $($("#marker-2").parent()).click(function() {
    var now_id = $("#marker-2").attr("_id");
    if (!now_id) {
      return false;
    }
    setPopup(now_id); // set four popup
    setRange(now_id); // set four range
    $("img.promoter").attr("src", "/static/img/promoter-orange.png");
    $("img.RBS").attr("src", "/static/img/RBS-orange.png");
    $("img.CDS").attr("src", "/static/img/CDS-orange.png");
    $("img.teminator").attr("src", "/static/img/teminator-orange.png");
    $(".ui.row.component").hide();
    $(".ui.row.component").fadeIn();
  });
  // blue one
  $($("#marker-3").parent()).click(function() {
    var now_id = $("#marker-3").attr("_id");
    if (!now_id) {
      return false;
    }
    setPopup(now_id); // set four popup
    setRange(now_id); // set four range
    $("img.promoter").attr("src", "/static/img/promoter-green.png");
    $("img.RBS").attr("src", "/static/img/RBS-green.png");
    $("img.CDS").attr("src", "/static/img/CDS-green.png");
    $("img.teminator").attr("src", "/static/img/teminator-green.png");
    $(".ui.row.component").hide();
    $(".ui.row.component").fadeIn();
  });
  $("#marker-1").mouseenter(function() {
    $("#highlight-1").show();
  }).mouseleave(function() {
    $("#highlight-1").hide();
  });
  $("#marker-2").mouseenter(function() {
    $("#highlight-2").show();
  }).mouseleave(function() {
    $("#highlight-2").hide();
  });
  $("#marker-3").mouseenter(function() {
    $("#highlight-3").show();
  }).mouseleave(function() {
    $("#highlight-3").hide();
  });

  $("#highlight-1").hide();
  $("#highlight-2").hide();
  $("#highlight-3").hide();

  // get path info
  var getProm = function(_id) {
    return promoter_info[_id.toString()];
  };
  var getRBS = function(_id) {
    return RBS_info[_id.toString()];
  };
  var getCDS = function(_id) {
    return CDS_info[_id.toString()];
  };
  var getTerm = function(_id) {
    return term_info[_id.toString()];
  };

  // set popup
  var setPopup = function(now_id) {
      nowPath = $.grep($(nowPla.pathway), function(p) {
        return p._id == now_id;
      })[0];
      // console.log(el);
      set_comp(".ui.promoter + .popup", getProm(nowPath.prom));
      set_comp(".ui.RBS + .popup", getRBS(nowPath.RBS));
      set_comp(".ui.CDS + .popup", getCDS(nowPath.CDS));
      set_comp(".ui.teminator + .popup", getTerm(nowPath.term));
    }
    // set range
  var setRange = function(now_id) {
      var path = $.grep($(nowPla.pathway), function(p) {
        return p._id == now_id;
      })[0];
      var prom_lower = path.strength.promoter_lower,
        prom_upper = path.strength.promoter_upper,
        prom = $.grep(path.strength.promoter, function(el) {
          return el.info == path.prom;
        })[0];
      $('.ui.range.promoter').range({
        min: 0.01,
        max: prom_upper,
        start: prom.s,
        step: 0.01,
        onChange: function(val) {
          // console.log(val);
          $(".promoter.num").text(val.toFixed(2));
          setClosestInfo(val, "prom", path.strength.promoter);
        }
      });
      var RBS_lower = path.strength.RBS_lower,
        RBS_upper = path.strength.RBS_upper,
        RBS = $.grep(path.strength.RBS, function(el) {
          return el.info == path.RBS;
        })[0];
      $('.ui.range.RBS').range({
        min: 0.01,
        max: RBS_upper,
        start: RBS.s,
        step: 0.01,
        onChange: function(val) {
          // console.log(val);
          $(".RBS.num").text(val.toFixed(2));
          setClosestInfo(val, "RBS", path.strength.RBS);
        }
      });
      var mRNA_lower = path.strength.mRNA_lower,
        mRNA_upper = path.strength.mRNA_upper,
        mRNA = path.mRNA_s;
      $('.ui.range.mRNA').range({
        min: 0.01,
        max: mRNA_upper,
        start: mRNA,
        step: 0.01,
        onChange: function(val) {
          // console.log(val);
          $(".mRNA.num").text(val.toFixed(2));
          setClosestInfo(val, "mRNA");
        }
      });
      var protein_lower = path.strength.protein_lower,
        protein_upper = path.strength.protein_upper,
        protein = path.protein_s;
      $('.ui.range.protein').range({
        min: 0.01,
        max: protein_upper,
        start: protein,
        step: 1,
        onChange: function(val) {
          // console.log(val);
          $(".protein.num").text(val.toFixed(2));
          setClosestInfo(val, "protein");
        }
      });
    }
    // find the closest strength one and set popup
    // modify the package(will be send when save) at the same time
  var setClosestInfo = function(val, type, slist) {
    if (type === "mRNA") {
      nowPath.mRNA_s = val;
      return true;
    } else if (type === "protein") {
      nowPath.protein_s = val;
      return true;
    }

    var clIndex = 0;
    $(slist).each(function(n, el) {
      // console.log(slist[clIndex].s, el.s, val);
      if (parseFloat(slist[clIndex].s) < parseFloat(val) ||
        parseFloat(el.s - val) < parseFloat(slist[clIndex].s - val)) {
        // console.log("change");
        clIndex = n;
      }
    });

    if (type === "prom") {
      set_comp(".ui.promoter + .popup", getProm(slist[clIndex].info));
      nowPath.prom = slist[clIndex].info;
    } else if (type === "RBS") {
      // console.log(slist);
      set_comp(".ui.RBS + .popup", getRBS(slist[clIndex].info));
      nowPath.RBS = slist[clIndex].info;
    }
  }

  // set component
  var set_comp = function(selector, info) {
      var $popup = $(selector);
      $popup.find(".name").text(info.name);
      // $popup.find(".type").text(info.type);
      $popup.find(".BBa").text(info.BBa);
      $popup.find(".intro").text((info.Introduction ? info.Introduction : "No intoduction yet."));
      if (info.name && info.name != '-') {
        $popup.find("a.NCBI").attr("href", "https://www.ncbi.nlm.nih.gov/gquery/?term=" + info.name);
        $popup.find("a.NCBI").removeClass("disabled");
      } else {
        $popup.find("a.NCBI").addClass("disabled");
      }
      if (info.BBa && info.BBa != '-') {
        $popup.find("a.FASTA").attr("href", "http://parts.igem.org/fasta/parts/" + info.BBa);
        $popup.find("a.FASTA").removeClass("disabled");
      } else {
        $popup.find("a.FASTA").addClass("disabled");
      }
      // console.log(selector, info);
    }
    // draw the line chart when click redraw
  $(".button.redraw2").click(function() {
    redrawChart_2();
  });

  window.redrawChart_2 = function() {
    var prom = $(".promoter.num").text(),
      RBS = $(".RBS.num").text(),
      mRNA = $(".mRNA.num").text(),
      protein = $(".protein.num").text();

    // window.myLineChart_2.data.datasets[0].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    // window.myLineChart_2.update();

    $.ajax({
      url: "/state2_chart/" + prom + '/' + RBS + '/' + mRNA + '/' + protein,
      type: "GET",
      dataType: "json",
      contentType: 'charset=utf-8',
      cache: false,
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
          window.myLineChart_2.data.datasets[0].data = data.ret.y;
          window.myLineChart_2.update();
        }
      },
      error: AjaxFail
    });
  }


  /* 
   * select dropdown
   * define the change callback function
   * to modify the plasmid
   */
  var promoter_info, RBS_info,
    CDS_info, term_info,
    bacteria_list;
  var nowBac, nowPla, nowPath;
  $("#bacteria-slt").dropdown({
    onChange: function(value, text, $selectedItem) {
      // console.log(value, text, $selectedItem);
      $(bacteria_list).each(function(n, bac) {
        if (bac._id == value) {
          nowBac = bac;
          $("#plasmid-slt").find(".item").remove();
          $(bac.plasmid).each(function(n, el) {
            $("#plasmid-slt").find(".menu").append('<div class="item" data-value="' + el._id + '">' + el.name + '</div>');
          });
          setTimeout(function() {
            $("#plasmid-slt").dropdown("set selected", bac.plasmid[0]._id);
            $("#marker-1").click();
          }, 100);
        }
      });
    }
  });
  // $("#bacteria-slt").dropdown("set selected", 1);

  $("#plasmid-slt").dropdown({
    onChange: function(value, text, $selectedItem) {
      // console.log(value, text, $selectedItem);
      for (var i = 0; i < 3; i++) {
        $("#path-text-" + (i + 1)).find("textPath").text("");
        $("#marker-" + (i + 1)).attr("_id", "");
      }
      $(nowBac.plasmid).each(function(n, plas) {
        if (plas._id == value) {
          nowPla = plas;
          $("#marker-1").hide();
          $("#marker-2").hide();
          $("#marker-3").hide();
          $("#plasmid-title").text(plas.name);
          $(plas.pathway).each(function(n, el) {
            $("#path-text-" + (n + 1)).find("textPath").text(el.name);
            $("#marker-" + (n + 1)).fadeIn();
            $("#marker-" + (n + 1)).attr("_id", el._id);
          });
        }
      });
    }
  });
  // $("#plasmid-slt").dropdown("set selected", 1);

  /* component popup */
  $(".ui.row.component img").popup({
    inline: true,
    on: "click"
  });

  if (parseInt($("#design-state").text()) >= 2 &&
    $("#design-state-2-not").text() == "False") {

    $.ajax({
      url: "/get_state_2_saved",
      type: "GET",
      dataType: "json",
      data: {
        "design_id": $("#design-id").text()
      },
      contentType: 'charset=utf-8',
      cache: false,
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
          promoter_info = data.ret.promoter_Info;
          RBS_info = data.ret.RBS_Info;
          CDS_info = data.ret.CDS_Info;
          term_info = data.ret.term_Info;
          bacteria_list = data.ret.bacteria;

          // redraw drowdown
          $("#bacteria-slt").find(".item").remove();
          $(bacteria_list).each(function(n, el) {
            $("#bacteria-slt").find(".menu").append('<div class="item" data-value="' + el._id + '">' + el.name + '</div>');
          });

          // redraw second drowdown
          $("#plasmid-slt").find(".item").remove();
          $(bacteria_list[0].plasmid).each(function(n, el) {
            $("#plasmid-slt").find(".menu").append('<div class="item" data-value="' + el._id + '">' + el.name + '</div>');
          });

          setTimeout(function() {
            $("#bacteria-slt").dropdown("set selected", bacteria_list[0]._id);
            $("#plasmid-slt").dropdown("set selected", bacteria_list[0].plasmid[0]._id);
            $("#marker-1").click();
            $(".button.redraw2").click();
            $(".ui.dimmer.active").removeClass("active");
            // console.log("select!");
          }, 1000);
        }
      },
      error: AjaxFail
    });
  }

  // modify by address
  // $(".ui.button.save").click(function() {
  //   console.log(bacteria_list);
  // });

  $("#save-btn").click(function() {
    console.log(bacteria_list);
    if (parseInt($("#design-state").text()) <= 2) {
      $.ajax({
        url: "/save_state_2",
        type: "POST",
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        cache: false,
        data: JSON.stringify({
          "design_id": $("#design-id").text(),
          "bacteria": bacteria_list
        }),
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
        $.ajax({
          url: "/save_state_2",
          type: "POST",
          dataType: "json",
          contentType: 'application/json; charset=utf-8',
          cache: false,
          data: JSON.stringify({
            "design_id": $("#design-id").text(),
            "bacteria": bacteria_list
          }),
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
      });
    }
  });

  // next step
  $("#next-step").click(function() {
    if (parseInt($("#design-state").text()) <= 2) {
      $.ajax({
        url: "/commit_state_2",
        type: "POST",
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        cache: false,
        data: JSON.stringify({
          "design_id": $("#design-id").text(),
          "bacteria": bacteria_list
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
        $.ajax({
          url: "/commit_state_2",
          type: "POST",
          dataType: "json",
          contentType: 'application/json; charset=utf-8',
          cache: false,
          data: JSON.stringify({
            "design_id": $("#design-id").text(),
            "bacteria": bacteria_list
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
      });
    }
  });
});