//TABLAS -------------------------------------->
function GetObj(id) {
    var Obj = document.getElementById(id)
    return Obj;
  }

var ArrayList = [];
class ConfigTable{
    constructor(Config) {        
        this.Table = Config.Table;
        this.Options = Config.Options;
        this.Del = Config.Del;
        this.Edit = Config.Edit;
        this.Show = Config.Show;
        this.Select = Config.Select;
        this.FormName = Config.FormName;
    }
}
function CreateInput(Data) {
    var InputForRT = document.createElement("input");
    InputForRT.className = Data.class;
    InputForRT.type = Data.type;
    InputForRT.value = Data.value;
    InputForRT.index = Data.value;
    return InputForRT;
}
function CreateTable(Config) {
    var Table = document.createElement('table');
    Table.append(document.createElement('thead'));
    Table.append(document.createElement('tbody'));
    Table.id = Config.TableId;
    if (Config.CardStyle === true) {
       Table.className = "CardStyleComponent";
    }else {
        Table.className = Config.className;
    }
    return Table;
}
  
  
function DrawTable(List, Config) {
   // console.log(List.length);
    ArrayList = List;
    var Config = new ConfigTable(Config);
    tbody = Config.Table.querySelector("tbody");
    tbody.innerHTML = "";
    var TableContainer = tbody.parentNode.parentNode;     
    for (var i = 0; i < ArrayList.length; i++) {
        var row = tbody.insertRow(i);
        for (var Propiedad in ArrayList[i]) {        
          if (Propiedad.includes("id_")) {
          } else {
            var TdForRow = document.createElement("td");
            TdForRow.setAttribute('name', Propiedad);
            TdForRow.innerHTML = ArrayList[i][Propiedad];
            row.appendChild(TdForRow);
          }
        }
        if (Config.Options) {
            var tdForInput = document.createElement("td");
            if (Config.Del) {
                var InputForRT = CreateInput({type:'button',value:'Del'}); 
                var DelData = {
                    Index:i,
                    Config:Config
                }
                InputForRT.setAttribute("onclick","DeleteElement("+JSON.stringify(DelData) +")");                              
                tdForInput.appendChild(InputForRT);            
           }
           if (Config.Edit) {               
                var InputForRT = CreateInput({type:'button',value:'Edit'});
                var EditData = {
                    Index:i,
                    Config:Config,
                    DataElement:ArrayList[i]
                }
                InputForRT.setAttribute("onclick","EditElement("+JSON.stringify(EditData) +")");
                tdForInput.appendChild(InputForRT);                           
            }
            if (Config.Select) {
                var InputForRT = CreateInput({type:'button',value:'Select'});
                InputForRT.addEventListener('click',function(e) {
                    
                })    
                tdForInput.appendChild(InputForRT);               
            } 
            if (Config.Show) {
                //console.log("hhh")
                const InputForRT = CreateInput({type:'button',value:'Show'});               
                InputForRT.addEventListener('click',function(){
                    ShowData = {
                        "Index":i,
                        'Config':Config,
                        'DataElement':ArrayList[i]
                    }
                    Show(ShowData);                    
                })    
                tdForInput.appendChild(InputForRT);               
            }
           row.appendChild(tdForInput);
        }
    }      
}

function Show(a){
    console.log(a);
}

function InicializePaginateTable(Config) { 
    var PaginateContainer = document.createElement('div');
    PaginateContainer.className = 'ShowPaginate';
    PaginateContainer.id = 'ShowPag_'+ Config.Name;   
    if (GetObj('ShowPag_'+ Config.Name)) {
        PaginateContainer = GetObj('ShowPag_'+ Config.Name);
        PaginateContainer.innerHTML = "";
    }    
    var Cont  = Math.round(ArrayList.length / GetObj('Show_' + Config.Name).value);
    for (let index = 0; index < Cont; index++) {
        var Link = document.createElement('a');
        Link.innerText = index + 1;
        Link.href = '#Show_' + Config.Name;
        Link.className = "ShowPaginate";
        PaginateContainer.append(Link);                       
    }
    
    return PaginateContainer;
}

function InicializeShowTable(Config) {
    var sel = document.createElement('select');
    sel.id = 'Show_' + Config.Name ;
    sel.className = 'ShowTable'
    var i = 10;
    for (let index = 0; index < 10; index++) {
        var opt = document.createElement('option');
        opt.value = i;
        opt.innerText = i;
        i = i + 10;
        sel.appendChild(opt);
    }
    return sel;
}
function DeleteElement(Data) {
    ArrayList.splice(Data.Index, 1);  
    DrawTable(ArrayList, Config);
}

function EditElement(Data) {  
    var Form;
    if (Data.Config.FormName) {
        Form = document.getElementById(Data.Config.FormName).querySelectorAll(".FormControl"); 
        if(Data.Config.FormName){
            var UpdateData = {
                Index:Data.Index,
                Config:Data.Config,
                DataElement:Data.DataElement
            }           
            var control = GetObj(Data.Config.FormName).querySelector(".BtnUpdate");
            control.setAttribute("onclick","UpdateElement("+JSON.stringify(UpdateData) +");");
        }   
        var index = 0;
        for (var Propiedad in Data.DataElement) {
            
            if (Form[index].tagName == "INPUT" || Form[index].tagName == "input") {
                console.log(Form[index].tagName)      
                if (Form[index].type != "button") {
                    Form[index].value = Data.DataElement[Propiedad];
                }
            } 
            if (Form[index].tagName == "TEXTAREA" || Form[index].tagName == "textarea") { 
                Form[index].innerText = Data.DataElement[Propiedad];                
            } 
            if (Form[index].tagName == "SELECT" || Form[index].tagName == "select") { 
                var aTags = Form[index].getElementsByTagName("option");
                var searchText = Data.DataElement[index];
                var found;
                for (var i = 0; i < aTags.length; i++) {
                    if (aTags[i].textContent == searchText) {
                      found = aTags[i].value;
                      Form[index].value = found;
                      break;
                    }
                  }
            } 
            index++;
        } 
        modalFunction(Data.Config.FormName)      
    }else{
        CreateForm(Data);
    }      
}
function CreateForm(Data) {
    if (GetObj('TempForm')) {
        return;
    }
    var FormContainer = document.createElement('div');
    FormContainer.className = 'ModalContent';
    FormContainer.id = "TempForm";
    var Form = document.createElement('div');
    Form.className = 'Container';
    var Header = document.createElement('div');
    var ControlContainer = document.createElement('div');
    ControlContainer.className = 'GrupForm';   
    for (var Prop in Data.DataElement) {
        var DivContainer = document.createElement('div');
        var ControlLabel = document.createElement('label');
        ControlLabel.innerText = Prop;
        var ControlInput = document.createElement('input');
        ControlInput.id = Prop;
        ControlInput.value = Data.DataElement[Prop];
        ControlInput.className = 'FormControl';
        if (Prop.includes("id_")) {
            DivContainer.hidden = true;
        }
        DivContainer.append(ControlLabel,ControlInput);
        ControlContainer.append(DivContainer);
    }
    var ActionsContainer = document.createElement('div');
    ActionsContainer.className = 'GrupForm';
    var InputSave = CreateInput({type:'button',value:'Guardar'});
    var UpdateData = {
        Index:Data.Index,
        Config:Data.Config,
        DataElement:Data.DataElement
    }
    InputSave.setAttribute("onclick","UpdateElement("+JSON.stringify(UpdateData) +");");
    ActionsContainer.appendChild(InputSave);
    Form.append(Header,ControlContainer,ActionsContainer);
    FormContainer.append(Form);
    document.body.append(FormContainer);
    setTimeout(function(){ modalFunction('TempForm');},100);    
}

function UpdateElement(Data) {   
    for (let index = 0; index < Object.keys(Data.DataElement).length; index++) {
      prop = Object.keys(Data.DataElement)[index];
      ArrayList[Data.Index][prop] = GetObj(prop).value;
    }    
    DrawTable(ArrayList,Data.Config);
    if (Data.Config.FormName) {
        modalFunction(Data.Config.FormName)
    } else{
        modalFunction("TempForm")
        setTimeout(function(){ 
            document.body.removeChild(GetObj("TempForm"));
        }, 1000);        
    }  
}
//MODALES-------------------------------->
function modalFunction(DivModal) {    
    var ventanaM = document.getElementById(DivModal);     
    if (ventanaM.style.opacity == 0) {
      ventanaM.style.transition = "all ease 1s";
      ventanaM.style.opacity = 1;
      ventanaM.style.pointerEvents = "all";
    } else {
      ventanaM.style.transition = "all ease 1s";
      ventanaM.style.opacity = 0;
      ventanaM.style.pointerEvents = "none";
    }
  }