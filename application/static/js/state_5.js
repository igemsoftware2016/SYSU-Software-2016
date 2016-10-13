$(document).ready(function() {
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

    var compund='<tr class="compund">\
            <td class="center aligned">\
              <div class="ui search name fluid standard">\
                <div class="ui icon input fluid">\
                  <input class="prompt" type="text" placeholder="Search matters...">\
                  <i class="search icon"></i>\
                </div>\
                <div class="results"></div>\
              </div>\
            </td>\
            <td class="center aligned">\
              <div class="ui right labeled input fluid">\
                <input type="number" placeholder="Weight..">\
                <div class="ui basic label">Unit </div>\
              </div>\
            </td>\
            <td class="center aligned">\
              <div class="ui right labeled input fluid">\
                <input type="number" placeholder="Weight..">\
                <div class="ui basic label">Unit </div>\
              </div>\
            </td>\
            <td class="right aligned">\
              <button class="ui circular minus icon button tiny remove-compund">\
                <i class="minus icon"></i>\
              </button>\
            </td>\
          </tr>';

    var abs600='<tr class="abs600">\
            <td class="center aligned">\
              <div class="ui right labeled input fluid">\
                <input type="number" placeholder="Weight..">\
                <div class="ui basic label">Unit </div>\
              </div>\
            </td>\
            <td class="center aligned">\
              <div class="ui right labeled input fluid">\
                <input type="number" placeholder="Weight..">\
                <div class="ui basic label">Unit </div>\
              </div>\
            </td>\
            <td class="right aligned">\
              <button class="ui circular minus icon button tiny remove-abs600">\
                <i class="minus icon"></i>\
              </button>\
            </td>\
          </tr>';

    var fl = '<tr class="fl">\
            <td class="center aligned">\
              <div class="ui right labeled input fluid">\
                <input type="number" placeholder="Weight..">\
                <div class="ui basic label">Unit </div>\
              </div>\
            </td>\
            <td class="center aligned">\
              <div class="ui right labeled input fluid">\
                <input type="number" placeholder="Weight..">\
                <div class="ui basic label">Unit </div>\
              </div>\
            </td>\
            <td class="right aligned">\
              <button class="ui circular minus icon button tiny remove-fl">\
                <i class="minus icon"></i>\
              </button>\
            </td>\
          </tr> </tbody>';

    $("#add-compund").click(function() {
        $("#co-culture").append(compund);
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
    });

    $("#add-abs600").click(function() {
        $("#abs600").append(abs600);
    });

    $("#add-fl").click(function() {
        $("#fl").append(fl);
    });

    $(document).on("click", ".remove-compund", function() {
        if ($(".compund").length > 1) {
            $(this).parents(".compund").remove();
        }
    });

    $(document).on("click", ".remove-abs600", function() {
        if ($(".abs600").length > 1) {
            $(this).parents(".abs600").remove();
        }
    });

    $(document).on("click", ".remove-fl", function() {
        if ($(".fl").length > 1) {
            $(this).parents(".fl").remove();
        }
    });

    // set up ajax package
    var setUpPackage = function() {
        var inputs = {
            abs600: [],
            fl: [],
            compund: []
        };
        
        $(".abs600").each(function(n, el) {
            var line = $(el).find("input");
            inputs.abs600.push({
                time: $(line[0]).val(),
                abs600: $(line[1]).val()
            });
        });

        $(".fl").each(function(n, el) {
            var line = $(el).find("input");
            inputs.fl.push({
                time: $(line[0]).val(),
                fl: $(line[1]).val()
            });
        });

        $(".compund").each(function(n, el) {
            var line = $(el).find("input");
            inputs.compund.push({
                compund: $(line[0]).val(),
                time: $(line[1]).val(),
                concentration: $(line[1]).val()
            });
        });

        return {
            design_id: $("#design-id").text(),
            inputs: inputs,
        };
    }

    $("#submit").click(function() {
        $.ajax({
            url: "/submit",
            type: "POST",
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
            cache: false,
            data: JSON.stringify(setUpPackage()),
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
                    swal({
                        title: "Done",
                        type: "success",
                        confirmButtonText: "Okay"
                    });
                }
            }
        });
    });

});
