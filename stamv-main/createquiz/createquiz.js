//There should be a function to fill in previous questions witht he same id im thinking base 64 8 digit thing

let quizId = 1234 //This is temporary
let QuizName = ""
let Description = ""
let Visibility = "Public" 
let amount = 0
var permissions = {
    "canView":[],
    "canEdit":[]
}

/* 



Fetch Data Here


*/

document.getElementById("quizName").value = QuizName
document.getElementById("quizDescription").value = Description
document.getElementById("visiblityDropdown").value = Visibility


let addQuestionTemplate = `      
<div id="question/num/" class="questions">
    <div class="top-area">
        <h3>/num/.</h3>
        <button class="deleteQuestion" onclick="removeQuestion(/num/)"></button>
    </div>

    <div class="terms">
        <textarea onkeypress="textAreaUpdater(this)" type="text"  class="term" name="term//num/" id="term/num/">/term/</textarea>
        <label class="fakeLabel" for="term/num/">Term</label> 
    </div>

    <div class="definitions">
        <textarea onkeypress="textAreaUpdater(this)" type="text" class="term" name="definition/num/" id="definition/num/">/def/</textarea>
        <label class="fakeLabel" for="definition/num/">Definition</label> 
    </div> 
</div>
`;

let questionsListProper = []

/* 

Fill in already written questions from fetched data here using a for loop it should set the amount variable as well

*/

document.getElementById("saveQuestions").onclick = exportData
document.getElementById("addQuestion").onclick = addQuestion;



//Export Data
function exportData() {
    var data = {
        "title": QuizName,
        "description":Description,
        "visiblity":Visibility,
        "questions":questionsListProper,
        "id": quizId,
        "permissions":permissions
    }
    console.log(JSON.stringify(data))
}

//Add Question
function addQuestion() {
    refillList()
    amount++
    questionsListProper.push({"term":"", "definitions":[""]})
     
    render()
}

//Remove Definition
function removeDefinition(question, definition) {
    if (questionsListProper[question].definitions.length >= 2) {
        refillList()
        questionsListProper[question].definitions.splice(definition, 1)
        render()
    }
    else {
        console.log("Cannot remove only definition")
    }
}

//Add definition
function addDefinition(question) {
    refillList()
    questionsListProper[question].definitions.push('')
    render()
}

//Remove question
function removeQuestion(pos) {
    refillList()

    questionsListProper.splice(pos, 1)
    render()
}

function refillList() {
    let term = ""
    let definitions = []
    let templist = []
    for (let i = 0; i < questionsListProper.length; i++) {
        definitions = []
        term = document.getElementById(`term${i}`).value.trim()
        for (let j = 0; j < questionsListProper[i].definitions.length; j++) {
            let temp = document.getElementById(`definition${i}_${j}`).value.trim()
            temp = temp.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            definitions.push(temp)
        }
        term = term.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        templist.push({"term": term, "definitions": definitions})
    }
    questionsListProper = templist
}

function render() {
    let buffer = ""
    let begginning =  `
    <div id="question/num/" class="questions">
        <div class="top-area">
            <h3>/num/.</h3>
            <button class="deleteQuestion" onclick="removeQuestion(/num/)"></button>
        </div>
        <hr class="topSeperator" />
        <div class="termDefContainer">
            <div class="terms">
                <textarea onkeypress="textAreaUpdater(this)" type="text"  class="term" name="term//num/" id="term/num/">/term/</textarea>
                <label class="fakeLabel" for="term/num/">Term</label> 
            </div>
            <div class="definitions">`
    definition_template = `
                <textarea onkeypress="textAreaUpdater(this)" type="text" class="term" name="definition/num/_/num2/" id="definition/num/_/num2/">/def/</textarea>
                <div class="removeAndLabel">
                    <label class="definitionLabel fakeLabel inline" for="definition/num/_/num2/">Definition</label> 
                    <label class="removeDefinition fakeLabel" onclick="removeDefinition(/num/, /num2/)">Remove</label>
                </div>
                `
    end = `
                <button class="addDefinition smallbtn" onclick="addDefinition(/num/)">+</button>
            </div> 
        </div>
    </div>`
    //Generate buffer
    for (let i = 0; i < questionsListProper.length; i++) {
        //This adds the term and numbers 
        buffer += begginning.replaceAll("/num/", i).replaceAll("/term/", questionsListProper[i].term) 
        //This adds the definitions
        for (let j = 0; j < questionsListProper[i].definitions.length; j++) {
            buffer += definition_template.replaceAll("/num/", i).replaceAll("/num2/", j).replaceAll("/def/", questionsListProper[i].definitions[j]) 
        }
        //This adds the ending html
        buffer += end.replaceAll("/num/", i)
    }
    //Insert the bffer into the html
    document.getElementById("listOfQuestions").innerHTML = buffer;
}
