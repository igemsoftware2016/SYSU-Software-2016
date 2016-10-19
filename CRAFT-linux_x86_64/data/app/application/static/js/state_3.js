$(document).ready(function() {
    var datasetGene = function(label, data) {
        var color = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
        // console.log(color);
        return {
            label: label,
            fill: false, // 
            lineTension: 0.4,
            backgroundColor: color,
            borderColor: color,
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: color,
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: color,
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            pointStyle: "round",
            data: data,
            spanGaps: false,
        }
    }
    var randomData = function() {
        var ret = [(Math.random() * 2000).toFixed(1)];
        for (var i = 0; i < 20; i++) {
            var num = (parseFloat(ret[i]) + (Math.random() * 100) * Math.pow(-1, Math.random() < 0.5)).toFixed(1);
            console.log(num);
            ret.push(num);
        }
        return ret;
    }
    var ctx = document.getElementById("myChart-3");
    var dataSets = [];
    var data = {
        labels: [],
        datasets: dataSets
    };
    window.myLineChart_3 = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            title: {
                display: true,
                text: ''
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

    window.myUpdate = function() {
        window.myLineChart_3.update(true);
        $(".item.legend").each(function(n, el) {
            if (!$(el).hasClass("active")) {
                $(el).click();
            }
        });
        $("#state-3-menu").empty();
        $("#state-3-menu").append(myLineChart_3.generateLegend());
        $(".item.legend").on("click", function() {
            $(this).toggleClass("active");
        });
    }

    window.updateDataset = function(e, datasetIndex) {
        var index = datasetIndex;
        var ci = window.myLineChart_3;
        var meta = ci.getDatasetMeta(index);

        // See controller.isDatasetVisible comment
        meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;

        // We hid a dataset ... rerender the chart
        ci.update();
    };

    $("#state-3-menu").append(myLineChart_3.generateLegend());

    $(".item.legend").on("click", function() {
        $(this).toggleClass("active");
    });

    if(parseInt($("#design-state").text()) >= 3) {
        $.ajax({
            url: "/get_state_3_saved",
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
                    var labels = [];
                    for (var i = 0; i < 21; i++) {
                        labels.push((i / 21.0 * data.ret.time).toFixed(1));
                    }
                    window.myLineChart_3.data.labels = labels;
                    $(data.ret.datasets).each(function(n, el) {
                        var ds = datasetGene(el.name, el.data);
                    // console.log(ds);
                    window.myLineChart_3.data.datasets.push(ds);
                })
                    window.myUpdate();
                }
            },
            error: AjaxFail
        });
    }

    // build chart test
    $(".next.button").click(function() {
        $.ajax({
            url: "/commit_state_3",
            type: "POST",
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                "design_id": $("#design-id").text()
            }),
            cache: false,
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

});