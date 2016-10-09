$(document).ready(function() {
  $('.ui.sidebar')
    .sidebar({
      context: $('.bottom.segment')
    });

  var ctx = document.getElementById("myChart");
  var data = {
    labels: ['0.0', '0.5', '1.0', '1.5', '2.0', '2.5', '3.0', '3.5', '4.0', '4.5', '5.0', '5.5', '6.0', '6.5', '7.0', '7.5', '8.0', '8.5', '9.0', '9.5', '10.0'],
    datasets: [{
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
    }]
  };
  window.myLineChart = new Chart(ctx, {
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

    $("img.promoter").attr("src", "/static/img/promoter-orange.png");
    $("img.RBS").attr("src", "/static/img/RBS-orange.png");
    $("img.CDS").attr("src", "/static/img/CDS-orange.png");
    $("img.teminator").attr("src", "/static/img/teminator-orange.png");
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
    $("img.promoter").attr("src", "/static/img/promoter-green.png");
    $("img.RBS").attr("src", "/static/img/RBS-green.png");
    $("img.CDS").attr("src", "/static/img/CDS-green.png");
    $("img.teminator").attr("src", "/static/img/teminator-green.png");
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
    $("img.promoter").attr("src", "/static/img/promoter-blue.png");
    $("img.RBS").attr("src", "/static/img/RBS-blue.png");
    $("img.CDS").attr("src", "/static/img/CDS-blue.png");
    $("img.teminator").attr("src", "/static/img/teminator-blue.png");
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
    var el = $.grep($(nowPla.pathway), function(p) {
      return p._id == now_id;
    })[0];
    // console.log(el);
    set_comp(".ui.promoter + .popup", getProm(el.prom));
    set_comp(".ui.RBS + .popup", getRBS(el.RBS));
    set_comp(".ui.CDS + .popup", getCDS(el.CDS));
    set_comp(".ui.teminator + .popup", getTerm(el.term));
  }
  // set popup
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
      min: prom_lower,
      max: prom_upper,
      start: prom.s,
      step: 0.01,
      onChange: function(val) {
        console.log(val);
        $(".promoter.num").text(val.toFixed(2));
      }
    });
    var RBS_lower = path.strength.RBS_lower,
      RBS_upper = path.strength.RBS_upper,
      RBS = $.grep(path.strength.RBS, function(el) {
        return el.info == path.RBS;
      })[0];
    $('.ui.range.RBS').range({
      min: RBS_lower,
      max: RBS_upper,
      start: RBS.s,
      step: 0.01,
      onChange: function(val) {
        console.log(val);
        $(".RBS.num").text(val.toFixed(2));
      }
    });
    var mRNA_lower = path.strength.mRNA_lower,
      mRNA_upper = path.strength.mRNA_upper,
      mRNA = path.strength.mRNA_s;
    $('.ui.range.mRNA').range({
      min: mRNA_lower,
      max: mRNA_upper,
      start: mRNA,
      step: 0.01,
      onChange: function(val) {
        console.log(val);
        $(".mRNA.num").text(val.toFixed(2));
      }
    });
    var protein_lower = path.strength.protein_lower,
      protein_upper = path.strength.protein_upper,
      protein = path.strength.protein_s;
    $('.ui.range.protein').range({
      min: protein_lower,
      max: protein_upper,
      start: protein,
      step: 0.01,
      onChange: function(val) {
        console.log(val);
        $(".protein.num").text(val.toFixed(2));
      }
    });
  }
  // set component
  var set_comp = function(selector, info) {
    var $popup = $(selector);
    $popup.find(".name").text(info.name);
    $popup.find(".type").text(info.type);
    $popup.find(".BBa").text(info.BBa);
    $popup.find(".intro").text(info.Introduction);
    $popup.find("a.NCBI").attr("href", "#" + info.NCBI);
    $popup.find("a.FASTA").attr("href", "#" + info.FASTA);
    console.log(selector, info);
  }


  /* 
   * select dropdown
   * define the change callback function
   * to modify the plasmid
   */
  var promoter_info, RBS_info,
    CDS_info, term_info,
    bacteria_list;
  var nowBac, nowPla;
  $("#bacteria-slt").dropdown({
    onChange: function(value, text, $selectedItem) {
      console.log(value, text, $selectedItem);
      $(bacteria_list).each(function(n, bac) {
        if (bac._id == value) {
          nowBac = bac;
          $("#plasmid-slt").find(".item").remove();
          $(bac.plasmid).each(function(n, el) {
            $("#plasmid-slt").find(".menu").append('<div class="item" data-value="' + el._id + '">' + el.name + '</div>');
          });
        }
      });
    }
  });
  // $("#bacteria-slt").dropdown("set selected", 1);

  $("#plasmid-slt").dropdown({
    onChange: function(value, text, $selectedItem) {
      console.log(value, text, $selectedItem);
      for (var i = 0; i < 3; i++) {
        $("#path-text-" + (i + 1)).find("textPath").text("");
        $("#marker-" + (i + 1)).attr("_id", "");
      }
      $(nowBac.plasmid).each(function(n, plas) {
        if (plas._id == value) {
          nowPla = plas;
          $(plas.pathway).each(function(n, el) {
            $("#path-text-" + (n + 1)).find("textPath").text(el.name);
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

  $.ajax({
    url: "/getState2Info",
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
          $(".ui.dimmer.active").removeClass("active");
          // console.log("select!");
        }, 1000);
      }
    },
    error: function() {
      AjaxFail();
    }
  });

  // range items
  $('.ui.range').range({
    min: 0,
    max: 1,
    start: 0,
    step: 0.01
  });


  // modify by address
  // $(".ui.button.save").click(function(){
  //   console.log(bacteria_list);
  //   nowPla.name = "change!!!!";
  //   console.log(bacteria_list);
  // })
})