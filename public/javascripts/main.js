/**
 * Created by dennismcdaid on 7/10/16.
 */
/**
 * BEFORE RUNNING:
 * Navigate to the overarching Sungear folder, then run:
 * browserify public/javascripts/main.js -o public/javascripts/out.js -d
 */


var p5 = require('p5');
var geneTest= require('./test/geneTest');

geneTest.testVessel();

// var aPls = document.getElementsByTagName("a")[0];
//
// aPls.addEventListener("click", function() {
//     alert("OH NO! IT WORKED!");
// });

/* When the user clicks on the button,
 toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {

        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
};

function Potato() {
    // build GUI
    this.desk = document.createElement("div");
    this.desk.id = "desk";

    var bar = document.createElement("div");
    bar.id = "navbar";

    var fileM = document.createElement("div");
    fileM.id = "fileM";
    fileM.class = "dropdown";  // TODO: Maybe change?

    var fileBtn = document.createElement("button");
    fileBtn.innerHTML = "File";
    fileBtn.onclick = "myFunction()";
    fileBtn.class = "dropbtn";

    var loadI = document.createElement("a");
    var screenI = document.createElement("a");
    loadI.innerHTML = "Load...";
    screenI.innerHTML = "Screen Shot";
    // TODO: @Dennis add keyboard shortcuts.

    var fileDropDown = document.createElement("div");
    fileDropDown.class = "dropdown-content";
    fileDropDown.id = "myDropdown";
    fileDropDown.appendChild(loadI);
    fileDropDown.appendChild(screenI);

    fileM.appendChild(fileBtn);
    fileM.appendChild(fileDropDown);
    bar.appendChild(fileM);
    this.desk.appendChild(bar);
    document.body.appendChild(this.desk);
}

Potato();
