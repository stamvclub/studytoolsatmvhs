let url = "./quizData.json"
let recentData = []
fetch(url, {method: 'GET',})
  .then(Response => Response.json())
  .then(data => doStuff(data))

  function doStuff(data) {
    console.log("what");
    recentData = data.recent
    for(i =0; i<recentData.length; i++){
      document.getElementById("title"+(i+1)).innerText = recentData[i].title;
      document.getElementById("description"+(i+1)).innerText = recentData[i].desc;
      //others are recentData[i].mastered, recentData[i].learned, recentData[i].unkown
    }
    
  }