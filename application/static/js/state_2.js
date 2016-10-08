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
    var myLineChart = new Chart(ctx, {
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

    // range item
    $('.ui.range').range({
        min: 0,
        max: 10,
        start: 1
    });

    // plasmid
    // orange one
    $($("#marker-1").parent()).click(function() {
        if(!$("#marker-1").attr("_id")) {
            return false;
        }
        $("img.promoter").attr("src", "/static/img/promoter-orange.png");
        $("img.RBS").attr("src", "/static/img/RBS-orange.png");
        $("img.CDS").attr("src", "/static/img/CDS-orange.png");
        $("img.teminator").attr("src", "/static/img/teminator-orange.png");
        $(".ui.row.component").hide();
        $(".ui.row.component").fadeIn();
    });
    // green one
    $($("#marker-2").parent()).click(function() {
        if(!$("#marker-2").attr("_id")) {
            return false;
        }
        $("img.promoter").attr("src", "/static/img/promoter-green.png");
        $("img.RBS").attr("src", "/static/img/RBS-green.png");
        $("img.CDS").attr("src", "/static/img/CDS-green.png");
        $("img.teminator").attr("src", "/static/img/teminator-green.png");
        $(".ui.row.component").hide();
        $(".ui.row.component").fadeIn();
    });
    // blue one
    $($("#marker-3").parent()).click(function() {
        if(!$("#marker-3").attr("_id")) {
            return false;
        }
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


    /* 
     * select dropdown
     * define the change callback function
     * to modify the plasmid
    */
    var promoter_info, RBS_info, bacteria_list;
    var nowBac, nowPla;
    $("#bacteria-slt").dropdown({
        onChange: function(value, text, $selectedItem) {
            console.log(value, text, $selectedItem);
            $(bacteria_list).each(function(n, bac) {
                if(bac._id == value) {
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
            for(var i=0; i<3; i++) {
                $("#path-text-" + (i+1)).find("textPath").text("");
                $("#marker-" + (i+1)).attr("_id", "");
            }
            $(nowBac.plasmid).each(function(n, plas) {
                if(plas._id == value) {
                    nowPla = plas;
                    $(plas.pathway).each(function(n, el) {
                        $("#path-text-" + (n+1)).find("textPath").text(el.name);
                        $("#marker-" + (n+1)).attr("_id", el._id);
                    })
                }
            })
        }
    });
    $("#plasmid-slt").dropdown("set selected", 1);

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
                console.log(data);
                promoter_info = data.ret.promoter_Info;
                RBS_info = data.ret.RBS_Info;
                bacteria_list = data.ret.bacteria;
                console.log(promoter_info, RBS_info, bacteria_list);

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
            }
        },
        error: function() {
            AjaxFail();
        }
    });
})