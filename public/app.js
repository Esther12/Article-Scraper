var notes = {};
$("#scraptNYT").on("click", function(){
    $.ajax({
        url : "/scrape",
        method : "GET"
    }).then((data)=>{
        console.log(data);
    });
});
$(document).ready(function(){
    $.ajax({
        url : "/articles",
        method : "GET"
    }).then((data)=>{
        console.log(data);
        for(let i = 0; i< 100; i++){
            $("#articleList").append(`
            <div class="card" style="width: 18rem;">
            <div class="card-body">
            <h6 class="card-title"><a href = ${data[i].link}>${data[i].title}<a></h6>
            <p class="card-text">${data[i].discription}</p>
            <button class="btn btn-warning btn-sm addNote" data-toggle="modal" data-target="#basicModal" data-id=${data[i]._id}>Add Notes</button>
            <div>
            <div>
        `)
        }
    })
});

$("#articleList").on("click",".addNote", function(){
     // Empty the notes section
     $("#commentNote").val("");
    $("#historyNote").empty();
    let ArticleId = $(this).attr("data-id");
    $("#newsId").text(ArticleId);
    $.ajax({
        url : "/getNote/" + ArticleId,
        method : "GET"
    }).then((data)=>{
        console.log(data);
        for(let i = 0; i< data.length; i++){
            $("#historyNote").append(`
            <li class="list-group-item">${data[i].comments} 
            <button class="float-right btn btn-danger btn-sm deletNote" 
            data-id=${data[i]._id} data-dismiss="modal"
            >Delete</button></li>
        `)
        }
    });
});

$("#submitNote").on("click",function(){
     let comments = $("#commentNote").val();
     let id = $("#newsId").text();
     notes ={
        articles :  id,
        comments : comments
     };
     $.ajax({
         url : "/addNotes",
         method : "POST",
         data : notes
     }).then(function(data){
        // Log the response
        console.log(data);
         // Empty the notes section
        $("#commentNote").val("");
        
     });
    console.log(comments,id);
    
});

$("#historyNote").on("click",".deletNote", function(){
    let noteId = $(this).attr("data-id");
    $.ajax({
        url : "/delete/" + noteId,
        method : "GET"
    }).then(data=>{
        // Log the response
        console.log(data);
    });
})

