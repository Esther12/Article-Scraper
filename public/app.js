
$("#scraptNYT").on("click", function(){
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
    console.log($(this).attr("data-id"));
})
