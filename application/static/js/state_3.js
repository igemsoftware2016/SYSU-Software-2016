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
    var ctx = document.getElementById("myChart");
    var dataSets = [];
    var data = {
        labels: [],
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

    window.myUpdate = function() {
        window.myLineChart.update(true);
        $(".item.legend").each(function(n, el) {
            if (!$(el).hasClass("active")) {
                $(el).click();
            }
        });
        $("#state-3-menu").empty();
        $("#state-3-menu").append(myLineChart.generateLegend());
        $(".item.legend").on("click", function() {
            $(this).toggleClass("active");
        });
    }

    window.updateDataset = function(e, datasetIndex) {
        var index = datasetIndex;
        var ci = window.myLineChart;
        var meta = ci.getDatasetMeta(index);

        // See controller.isDatasetVisible comment
        meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;

        // We hid a dataset ... rerender the chart
        ci.update();
    };

    $("#state-3-menu").append(myLineChart.generateLegend());

    $(".item.legend").on("click", function() {
        $(this).toggleClass("active");
    });

    // build chart test
    $(".next.button").click(function() {
        ret = {
            time: 19.4,
            datasets: [{
                name: "CL",
                data: [0, 500, 680, 610, 510, 400, 270, 120, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }, {
                name: "TetR",
                data: [0, 320, 500, 600, 605, 612, 619, 623, 629, 631, 638, 640, 647, 659, 672, 710, 801, 964, 1218, 1521, 1900]
            }, {
                name: "UVR8-TetR",
                data: [0.0, 24.0, 48.0, 71.0, 95.0, 119.0, 143.0, 167.0, 190.0, 214.0, 238.0, 262.0, 286.0, 310.0, 333.0, 357.0, 381.0, 405.0, 429.0, 452.0, 476.0]
            }]
        };
        // labels: [0.00, 0.05, 0.10, 0.15, 0.20, 0.25, 0.30, 0.35, 0.40, 0.45, 0.50, 0.55, 0.60, 0.65, 0.70, 0.75, 0.80, 0.85, 0.90, 0.95, 0.100];
        var labels = [];
        for(var i=0; i<21; i++) {
          labels.push((i/21.0*ret.time).toFixed(1));
        }
        window.myLineChart.data.labels = labels;
        $(ret.datasets).each(function(n, el) {
            var ds = datasetGene(el.name, el.data);
            // console.log(ds);
            window.myLineChart.data.datasets.push(ds);
        })
        window.myUpdate();
    });

});