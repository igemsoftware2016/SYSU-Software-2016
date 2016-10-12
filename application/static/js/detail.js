$(document).ready(function() {
    // $("body").backstretch("destroy", false);
    $(".ui.banner").backstretch("/static/img/detail_banner-1.1.jpg");
    $(".ui.progress").progress();

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

    $(".ui.progress").progress();

    $(".button.like").click(function() {
        if ($($(this).find(".icon")).hasClass("empty")) {
            var nowLike = parseInt($($(this).find(".label")).text());
            $($(this).find(".label")).text(nowLike + 1);
        } else {
            var nowLike = parseInt($($(this).find(".label")).text());
            $($(this).find(".label")).text(nowLike - 1);
        }
        $($(this).find(".icon")).toggleClass("empty");
    });

    $(".button.mark").click(function() {
        $($(this).find(".icon")).toggleClass("empty");
    });

    $(".button.tip-off").click(function() {
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

    $('.ui.accordion')
        .accordion();

    // step 3 chart
    var ctx = document.getElementById("myChart");
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
        var ci = e.view.myLineChart;
        var meta = ci.getDatasetMeta(index);

        // See controller.isDatasetVisible comment
        meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;

        // We hid a dataset ... rerender the chart
        ci.update();
    };

    $("#state-3-menu").append(myLineChart.generateLegend());

    $(".item.legend").click(function() {
        $(this).toggleClass("active");
    });

    // share button
    $(".button.share").click(function() {
        swal({
            title: '<b>Describe the tip-off reason please.</b>',
            html: '<div class="ui form"><div class="field"><textarea rows="3"></textarea></div></div>' +
                '<div class="ui slider checkbox"><input type="checkbox" name="newsletter"><label>Wanted someone help</label></div>',
            // input: 'textarea',
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
                url: "http://www.findpsw.test.com",
                type: "POST",
                dataType: "json",
                contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                cache: false,
                data: {
                    "email": email
                },
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
                            html: 'Your password was sended, check it please.'
                        });
                    }
                },
                error: function() {
                    AjaxFail();
                }
            });
        });
    });
});