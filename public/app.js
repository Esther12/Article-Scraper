
$("#scraptNYT").on("click", function(){
    $.ajax({
        url : "/articles",
        method : "GET"
    }).then((data)=>{
        console.log(data);
        for(let i = 0; i< 100; i++){
            $("#articleList").append(`
            <h2><a href = ${data[i].link}>${data[i].title}<a></h2>
            <p>${data[i].discription}</p>
        `)
        }
    })
});