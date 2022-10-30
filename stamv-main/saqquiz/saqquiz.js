let questionType = ""
let strictAnswer = false
let questions = []
let currentPosition = 0
let url = "../testdata/test.json"
let numAnswers = 4
let selectedAnswer = null
let shownAnswers = []
let currentQuestion = null
let answersRevealed = false
let answeringWithDefinition = true

fetch(url, { method: 'GET', })
    .then(Response => Response.json())
    .then(data => start(data))
    


function start(data) {
    console.log(data)
    questions = data.questions
    document.getElementById("title").innerText = data.title
    document.getElementById("description").innerText = data.description
    console.log(questions)
    document.getElementById("progress").max = questions.length
    // disables / enables submit button based on if the answerbox is empty
    currentQuestion = questions[currentPosition]
    renderQuestion()
}

function revealAnswers() {
    console.log("hrere")
    let wasValid = false
    if (answeringWithDefinition) {
        for (let i = 0; i < currentQuestion.definitions.length; i++) {
            if (validAnswer(document.getElementById("answerBox").value, currentQuestion.definitions[i])) {
                wasValid = true
                break
            }
        }
    } else if (validAnswer(document.getElementById("answerBox").value, currentQuestion.term)) {
        wasValid = true
    }

    let correct = answeringWithDefinition ? currentQuestion.definitions[0] : currentQuestion.term

    // should ensure question is safe


    answersContainerBuffer = `
    <div>
        <input type="text" readonly class="answers ${wasValid ? "correct": "wrong"}" id="answerBox" 
                placeholder="Answer here" name="answer1" oninput=answerInput(this) value=${document.getElementById("answerBox").value}>
        <div class="inlineUnderAnswer">
            <p id="typeLabel2" style="float:left">${answeringWithDefinition ? "DEFINITION" : "TERM"}</p>
            <button style="float:right" id="dontKnowBtn" >DONT KNOW</button>
        </div>
        
        <input readonly type="text" class="answers" value=${correct}></input>
        <div class="inlineUnderAnswer">
            <p id="typeLabel2" style="float:left">CORRECT ANSWER</p>
        </div>
    </div>
    <button onclick=nextQuestion() id="checkBtn">${currentPosition - 1 != questions.length ? "NEXT" : "DONE"}</button>`

    console.log(questions.length)
    console.log(currentPosition - 1)
    document.getElementById("answersContainer").innerHTML = answersContainerBuffer


    document.getElementById("progress").value = ++currentPosition

}

function nextQuestion() {
    currentQuestion = questions[currentPosition]
    if (currentQuestion) {
        renderQuestion()
    } else {
        document.getElementById("centralArea").innerHTML = "done"
    }
}

function renderQuestion() {
    let question = null
    if (answeringWithDefinition) {
        question = currentQuestion.term
    } else {
        question = currentQuestion.definitions[0]
    }

    // should ensure question is safe

    termAreaBuffer = `
    <h1 id="question">${question}</h1>
    <hr id="cardSplit" />
    <p id="typeLabel1">${!answeringWithDefinition ? "DEFINITION" : "TERM"}</p>`

    answersContainerBuffer = `
    <div>
        <input type="text" class="answers" autocomplete="off" id="answerBox" placeholder="Answer here" name="answer1" oninput=answerInput(this)>
        <div class="inlineUnderAnswer">
            <p id="typeLabel2" style="float:left">${answeringWithDefinition ? "DEFINITION" : "TERM"}</p>
            <button style="float:right" id="dontKnowBtn" onclick="revealAnswers()">DONT KNOW</button>
        </div>
    </div>
    <button id="checkBtn" onclick="revealAnswers()" disabled=${document.getElementById("answerBox").value == ""}>SUBMIT</button>`

    document.getElementById("termArea").innerHTML = termAreaBuffer
    document.getElementById("answersContainer").innerHTML = answersContainerBuffer
}

function answerInput(self) {
    document.getElementById("checkBtn").disabled = (self.value == "")
}

function definitionToggle(caller) {
    answeringWithDefinition = caller.checked
    renderQuestion()
    /*if (caller.checked) {
        document.getElementById("typeLabel2").innerText = "TERM"
        document.getElementById("typeLabel1").innerText = "DEFINITION"
    } else {
        document.getElementById("typeLabel1").innerText = "TERM"
        document.getElementById("typeLabel2").innerText = "DEFINITION"
    }*/
}



// Everything below here is used for answer checking

function stringStrip(string) {
    //string = string.replace("  ", " ")
    string = string.replace(/[^a-zA-Z0-9 ]/g, "");
    return string
}

function validAnswer(answer, expected) {
    if (strictAnswer) {
        return (expected.replace("  ", " ") == answer.replace("  ", " "))
    } else {
        return (stringStrip(expected) == stringStrip(answer))
    }
}

// there should be some tests here for valid answer