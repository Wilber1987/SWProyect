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
importarScript("scripts/modules/WComponentsTools.js");
importarStyle("scripts/styleModules/StyleModules.css");
//App scripts
importarScript("DatabaseScripts/MonsterDatabase.js");


function OnLoad() { 
    StartMonsterList()
}
function StartMonsterList(){
    var Table = CreateTable({TableId:"TableData", CardStyle:true});
    let ApiUrlUpdate =  "http://localhost/SWPROYECT/PHPApi/ApiSWPostUpdateMonster.php";
    let ApiUrlCreate =  "http://localhost/SWPROYECT/PHPApi/ApiSWGetMonster.php";
    let ApiUrlDelete =  "http://localhost/SWPROYECT/PHPApi/ApiSWGetMonster.php";
    let ApiUrlSelect =  "http://localhost/SWPROYECT/PHPApi/ApiSWGetMonster.php";
    var Config = {
        Table: Table,
        CardStyle: true, 
        TableContainer: false,
        Options: {
            Search: true,
            ApiSelect: {ApiUrlSelect : ApiUrlSelect, ResponseName: "Monsters"},            
            Show: true, 
            ShowOptions:{FormName: false} ,
            Edit: false,
            EditOptions:{FormName: false, ApiUrlUpdate: ApiUrlUpdate},
            Select: false
        },
    };
    let xhr
    if (window.XMLHttpRequest) xhr = new XMLHttpRequest()
    else xhr = new ActiveXObject("Microsoft.XMLHTTP")   
    xhr.open('GET', ApiUrlSelect)
    xhr.addEventListener('load', (data) => {
        const dataJSON = JSON.parse(data.target.response); 
        DrawTable(dataJSON.Monsters, Config)
        Body.appendChild(Table);       
    })
    xhr.send() 
}