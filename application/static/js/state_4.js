$(document).ready(function(){
	// $('a.media.pdf').media();
    $(".next.button").click(function() {
        $.ajax({
            url: "/commit_state_4",
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
})