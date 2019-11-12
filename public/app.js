$("#scraptNYT").on("click", function() {
  console.log("click");
  $.ajax({
    url: "/scrape",
    method: "GET"
  }).then(data => {
    console.log("display", data);
    display();
  });
});

function display() {
  $.ajax({
    url: "/articles",
    method: "GET"
  }).then(data => {
    console.log(data);
    for (let i = 0; i < data.length; i++) {
      $("#articleList").append(`
            <div class="card m-1" style="width: 100%;">
            <div class = "row no-gutters">
            <div class = "col-md-4">
            <img src=${data[i].img} class="card-img" alt=${data[i].title}>
            </div>
            <div class = " col-md-8">
            <div class="card-body">
            <h4 class="card-title"><a href = ${data[i].link}>${data[i].title}<a></h4>
            <p class="card-text">${data[i].description}</p>
            <a class="btn btn-warning btn-sm float-right addNote" data-toggle="modal" data-target="#basicModal" data-id=${data[i]._id}>Add Notes</a>
            <div>
            <div>
            <div>
            <div>
        `);
      console.log("this is the link", data[i].link);
    }
  });
}
$(document).ready(function() {
  display();
});
$("#articleList").on("click", ".addNote", function() {
  // Empty the notes section
  $("#commentNote").val("");
  $("#historyNote").empty();
  let ArticleId = $(this).attr("data-id");
  $("#newsId").text(ArticleId);
  $.ajax({
    url: "/getNote/" + ArticleId,
    method: "GET"
  }).then(data => {
    console.log(data);
    for (let i = 0; i < data.length; i++) {
      $("#historyNote").append(`
            <li class="list-group-item">${data[i].comments} 
            <button class="float-right btn btn-danger btn-sm deletNote" 
            data-id=${data[i]._id} data-dismiss="modal"
            >Delete</button></li>
        `);
    }
  });
});

$("#submitNote").on("click", function() {
  let comments = $("#commentNote").val();
  let id = $("#newsId").text();
  let notes = {
    articles: id,
    comments: comments
  };
  $.ajax({
    url: "/addNotes",
    method: "POST",
    data: notes
  }).then(function(data) {
    // Log the response
    console.log(data);
    // Empty the notes section
    $("#commentNote").val("");
  });
  console.log(comments, id);
});

$("#historyNote").on("click", ".deletNote", function() {
  let noteId = $(this).attr("data-id");
  $.ajax({
    url: "/delete/" + noteId,
    method: "GET"
  }).then(data => {
    // Log the response
    console.log(data);
  });
});
