function importarScript(nombre, callback) {
    var s = document.createElement("script");
    s.src = nombre;
    document.querySelector("head").appendChild(s);
}
window.onload = OnLoad;
importarScript("scripts/modules/WComponents.js");
importarScript("scripts/modules/WchartComponets.js");
importarScript("scripts/modules/WtableComponents.js");


function OnLoad() { 
    //functions
}
