function importarScript(name) {
    var s = document.createElement("script");
    s.src = UrlPath + name;
    document.querySelector("head").appendChild(s);
}
function importarStyle(name) {
    var s = document.createElement("link");
    s.href = UrlPath + name;
    s.rel = "stylesheet";
    document.querySelector("head").appendChild(s);
}
function getAbsolutePath() {
    var loc = window.location;
    var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
    //return "https://swproyect.000webhostapp.com/";
    return  "";
    //return loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
}
window.onload = OnLoad;
var UrlPath = getAbsolutePath();
importarScript("Scripts/Modules/WComponents.js");
importarScript("Scripts/Modules/WComponentsTools.js");
importarStyle("Scripts/StyleModules/StyleModules.css");

//App scripts
importarScript("DatabaseScripts/MonsterDatabase.js");
importarStyle("Styles/AppStyles.css");

function OnLoad() { 
    StartMonsterList()   
}
function StartMonsterList(){
    var Table = CreateTable({TableId:"TableData", className : "CardStyleComponentSWMonster"});
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
            ShowOptions:{FormName: false, Actions:{btnInput:{value:"Add Build", className:"BtnSuccess", onclick:"AddBuild()"}}
            } ,
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