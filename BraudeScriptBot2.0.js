// ==UserScript==
// @name         Auto Course Selector
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       AxFisr
// @match        https://info.braude.ac.il/yedion/fireflyweb.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ac.il
// @grant GM.getValue
// @grant GM.setValue
// @grant GM.getTab
// @grant GM.saveTab

// ==/UserScript==
(async function() {
    'use strict';
    // Your code here...
    thisTab = await GM.getTab();
    if (thisTab.selectStage === undefined){
        thisTab.selectStage = 0;
        thisTab.CourseId ="";
        thisTab.CourseNum = "1";
        thisTab.SelectExercise = true;
        thisTab.SelectLab = true;
        thisTab.ExerciseNum = "1";
        thisTab.LabNum = "1";
    }

    var myDiv = document.createElement("div");
    myDiv.style.position = "absolute";
    myDiv.style.left = "0";
    myDiv.style.top = "0";
    myDiv.style.zIndex = 999;
    myDiv.style.color = "white";

    var checked = thisTab.SelectExercise?" checked":"";
    var running = thisTab.selectStage != 0;

    var checked1 = thisTab.SelectLab?" checked":"";
    var startDisable = running?" disabled":"";
    var runningText = running?"Selectro running...":"";


    myDiv.innerHTML = `<div style='background:rgba(100,100,100,.7);border-radius:1em;margin:1em;padding:1em;'>
Course ID:<br>
<input id="inputCourseID" value="${thisTab.CourseId}"/><br>
Course Number:<br>
<input id="inputCourseNum" value="${thisTab.CourseNum}"/><br>
<input type="checkbox"${checked} id="inputSelectExercise" value="true"/> Select Exercise<br>
Exercise Number:<br>
<input id="inputExerciseNum" value="${thisTab.ExerciseNum}"/><br>

<input type="checkbox"${checked1} id="inputSelectLab" value="true"/> Select Lab<br>
Lab Number:<br>
<input id="inputLabNum" value="${thisTab.LabNum}"/><br>


<input type="button"${startDisable} id="startCourse" value="Start"/>${runningText}
    </div>`;
    document.body.appendChild(myDiv);

    document.getElementById("startCourse").addEventListener('click', event => {
        thisTab.CourseId = document.getElementById("inputCourseID").value;
        thisTab.CourseNum = document.getElementById("inputCourseNum").value;
        thisTab.SelectExercise = document.getElementById("inputSelectExercise").checked;
        thisTab.ExerciseNum = document.getElementById("inputExerciseNum").value;
        thisTab.SelectLab = document.getElementById("inputSelectLab").checked;
        thisTab.LabNum = document.getElementById("inputLabNum").value;
        thisTab.selectStage = 1;

        GM.saveTab(thisTab);
        Run();
    });
    if(thisTab.selectStage != 0){
        Run();
    }
})();

var thisTab,selectStage;

function Run(){
    switch(thisTab.selectStage){
        case 1:
            MoveToSearchPage();

            thisTab.selectStage = 2;
            GM.saveTab(thisTab);
            break;
        case 2:
            SelectCourse(thisTab.CourseId);

            thisTab.selectStage = 3;
            GM.saveTab(thisTab);
            break;
        case 3:
            ClickOnFather(thisTab.CourseNum);

            thisTab.selectStage = thisTab.SelectExercise ? 4 : 0;

            GM.saveTab(thisTab);
            break;
        case 4:
            ClickOnFather(thisTab.ExerciseNum);

            thisTab.selectStage = thisTab.SelectLab ? 5 : 0;
            GM.saveTab(thisTab);
            break;
        case 5:
            ClickOnFather(thisTab.LabNum);

            thisTab.selectStage = 0;

            GM.saveTab(thisTab);
            break;

    }
}

function MoveToSearchPage(){
    let menuItems = document.querySelector(".menu-item");
    let buttons = menuItems.querySelectorAll(".menu-item .me-lg-1");
    let link = buttons[7].querySelectorAll(".menu-link")[1];
    link.click();
}

function SelectCourse(courseID){
     let radio = document.querySelector("#searchType1");
    radio.checked = true;
    radio.checked1 = true;

    let idInput = document.querySelector("#SubjectCode");
    idInput.value = courseID;

    let search = document.querySelector("#searchButton");
    search.disabled = false;
    search.click();
}
function ClickOnFather(fatherID){
    let father = document.querySelector("#MyFather"+fatherID);

    let firstButton = father.querySelector(".btn");
    firstButton.click();
}
