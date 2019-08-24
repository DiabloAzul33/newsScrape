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

