$(document).ready(function() {
  // $("body").backstretch("destroy", false);
  $(".ui.banner").backstretch("/static/img/square_banner1.1.jpg");
  // $(".ui.banner").backstretch("/static/img/" + $("span#bg-img").text());
  
  if($(".design.card").length) {
    $(".ui.segment.empty").removeClass("empty");
  }

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

});