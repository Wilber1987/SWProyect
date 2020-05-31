function importarScript(name) {
    var s = document.createElement("script");
    s.src = name;
    document.querySelector("head").appendChild(s);
}
function importarStyle(name) {
    var s = document.createElement("link");
    s.href = name;
    s.rel = "stylesheet";
    document.querySelector("head").appendChild(s);
}
window.onload = OnLoad;
importarScript("scripts/modules/WComponents.js");
importarStyle("scripts/styleModules/StyleModules.css");
//App scripts
importarScript("DatabaseScripts/MonsterDatabase.js");


function OnLoad() { 
    StartMonsterList()
}
function StartMonsterList(){
    var Table = CreateTable({TableId:"TableData", CardStyle:true});
    var Config = {
        Table: Table,
        Options: true,
        Show: true  
    };
    let xhr
    if (window.XMLHttpRequest) xhr = new XMLHttpRequest()
    else xhr = new ActiveXObject("Microsoft.XMLHTTP") 
    url = "http://localhost:8820/SWPROYECT/PHPApi/ApiSWGetMonster.php";
    xhr.open('GET', url)
    xhr.addEventListener('load', (data) => {
        const dataJSON = JSON.parse(data.target.response); 
        //console.log(dataJSON.Monsters);    
        DrawTable(dataJSON.Monsters, Config)
        Body.appendChild(Table);       
    })
    xhr.send()   
    
}