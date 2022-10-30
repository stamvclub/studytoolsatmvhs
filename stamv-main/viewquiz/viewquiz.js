let questions = []
let currentPosition = 0
let url = "../testdata/test.json"
let numAnswers = 4
let selectedAnswer = null
let shownAnswers = []
let currentQuestion = null
let answersRevealed = false

fetch(url, {method: 'GET',})
  .then(Response => Response.json())
  .then(data => start(data))




function start(data) {
  questions = data.questions
  document.getElementById("title").innerText = data.title
  document.getElementById("description").innerText = data.description
  console.log(questions)
  document.getElementById("progress").max = questions.length
  renderQuestion()
}

function renderQuestion() {
  currentQuestion = questions[currentPosition]
  shownAnswers = generate(currentQuestion)
  trueRender(shownAnswers)
}

function checkBtnBehavior(self) {
  if (self.innerText == "Next") {
    answersRevealed = false
    self.innerText = "Check"
    renderQuestion()
  } else if (self.innerText == "Check") {
    document.getElementById("progress").value = ++currentPosition
    revealAnswers(shownAnswers)
  } else if (self.innerText == "Done") {
    console.log("done")
    document.getElementById("centralArea").innerHTML = ""
  }
}

function revealAnswers(arr) {
  for (let i = 0; i < arr.length; i++) {
    let x = document.getElementById(`q${i}`)
    console.log(x)
    x.classList.add(arr[i] == currentQuestion.definitions[0] ? "correct" : "wrong")
  }

  selectedAnswer = null
  answersRevealed = true
  if (currentPosition != questions.length) {
    document.getElementById("checkBtn").innerText = "Next"
  } else {
    document.getElementById("checkBtn").innerText = "Done"
  }
}

// actually draws the it 
function trueRender(arr) {
  buffer = ""
  for (let i = 0; i < arr.length; i++) {
    buffer += `
    <div class="answers" id="q${i}" onclick="makeSelected(this)">
      <p class="unselectable">
      ${arr[i]}
      </p>
    </div>
    `
  }
  buffer += `
    <button onclick="checkBtnBehavior(this)" id="checkBtn" disabled=${selectedAnswer == null}>
      Check
    </button>
  `
  document.getElementById("term").innerText = currentQuestion.term
  document.getElementById("answersContainer").innerHTML = buffer
}

function generate(cq) {
  arr = []
  arr.push(cq.definitions[0])
  for (let i = 0; i < numAnswers - 1; i++) {
    x = parseInt(Math.random() * questions.length)
    if (questions[x].definitions[0] != cq.definitions[0]) {
      arr.push(questions[x].definitions[0])
    }
    else {
      i--
    }
  }
  console.log("generate")
  console.log(arr)
  return arr
}


function makeSelected(id) {
  console.log(id)
  // now that they have selected an answer to check they can now check it
  document.getElementById("checkBtn").disabled = false
  if (selectedAnswer != null) {
    // if they are changing answers the other is no longer selected
    selectedAnswer.classList.remove("selected")
  } 

  if (selectedAnswer == id) {
    // if they are selecting the same answer as before it deselcts it
    id.classList.remove("selected")
    document.getElementById("checkBtn").disabled = true
    selectedAnswer = null
  } else {
    selectedAnswer = id
    // if they are clicking on an all ready selected answer we deselect it which removes the ability to check
    if (id.classList.contains("selected")) {
    } else {
      id.classList.add("selected")
    }
  }
}