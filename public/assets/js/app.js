console.log("JS is loaded");

$(document).ready(function() {    
    $(".bookmark-btn").on("click", function() {
        console.log("button clicked");
        var id = $(this).attr("data-id");
        console.log(id);
        $.ajax({
            type: "PUT",
            dataType: "json",
            url: "/api/bookmarked",
            data: {
              id: id,
            }
          })
          // If that API call succeeds, add the title and a delete button for the note to the page
            .then(function(data) {
                console.log("post has been bookmarked!");
            });
        
    });
});
$(document).on("click", "h1", function () {
  $(".save-notes").empty();
  $(".view-notes").empty();
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/api/posts/" + thisId
  })
  .then(function(data) {
    console.log(data);
    $(".view-notes").append("<h2>" + data.title + "</h2>");
    $(".save-notes").append("<input id='titleinput' name='title' >");
    $(".save-notes").append("<textarea id='bodyinput' name='body'></textarea>");
    $(".save-notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

    // data.forEach(dataItem => {
      if (data.note.length > 0) {
        data.note.forEach(note => {

          $(".view-notes").append("<p>" + note.title + "<br />" + note.body + "</p>")
        }) 
      }
    // });
  });

});

$(document).on("click", "#savenote", function() {
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/api/posts/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  }).then(function(data) {
    console.log(data);
    $(".view-notes").empty();
  });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});
