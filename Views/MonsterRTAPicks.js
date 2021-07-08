import { ComponentsManager, WAjaxTools, WArrayF, WRender } from "../WDevCore/WModules/WComponentsTools.js";
import { WCssClass } from "../WDevCore/WModules/WStyledRender.js";
import "../WDevCore/WComponents/WTableComponents.js";
import "../WDevCore/WComponents/WFilterControls.js";

export default class MonsterRTAPicks extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.className = "DocumentView";
        this.SelectedSeason = 0;
    }
    connectedCallback() {
        if (this.shadowRoot.innerHTML != "") {
            return;
        }
        this.DrawComponent();
    }
    DrawComponent = async () => {
        this.shadowRoot.innerHTML = "";
        let GlobalData = await fetch("../DataBase/RTAPicks/GlobalData" + SeasonList[this.SelectedSeason] + ".json");
        GlobalData = await GlobalData.json();
        const DivCont = { type: 'div', props: { id: '', class: 'DataContainer' }, children: [] }
        for (const prop in GlobalData) {
            DivCont.children.push([`${prop}: ${GlobalData[prop]}`]);
        }        
        const SelectSeason = {
            type: 'select', props: {
                id: '', class: 'className', onchange: (ev) => {
                    this.SelectedSeason = ev.target.value;
                    this.DrawComponent();
                }
            }, children: []
        };
        SeasonList.forEach((element, index) => {
            SelectSeason.children.push({ type: 'option', props: { innerText: element, value: index } });
        });
        DivCont.children.push([SelectSeason])
        this.shadowRoot.appendChild(WRender.createElement(DivCont));
        //this.shadowRoot.appendChild(WRender.createElement(SelectSeason));
        let RTAPicksData = await fetch("../DataBase/RTAPicks/DataPickRate" + SeasonList[this.SelectedSeason] + ".json");
        RTAPicksData = await RTAPicksData.json();
        RTAPicksData.sort(function (a, b) {
            return b.SeasonScore - a.SeasonScore;
        });
        const UserActions = [{
            name: "Builds",
            Function: (Param) => {
                console.log(Param)
            }
        }]
        var TableConfigG = {
            Datasets: RTAPicksData,
            ImageUrlPath: "https://swarfarm.com/static/herders/images/monsters/",
            Colors: ["#ff6699", "#ffbb99", "#adebad"],
            DisplayData: [
                "image_filename",
                "name",
                "element",
                "Pick_Rate",
                "Win_Rate",
                "Banned_Rate",
                "Leader",
                "FirstPick",
                "LastPick",
                "SeasonScore"
            ],
            Options: {
                Search: true,
                UserActions: UserActions
            }
        };
        const WTableReport = WRender.createElement(WRender.createElement({
            type: "w-table",
            props: {
                id: "TableId",
                TableConfig: TableConfigG
            }
        }));
        this.shadowRoot.append(WTableReport);
        this.shadowRoot.append(WRender.createElement(this.Style));
    }
    CreateRtaPicksData = async (Season = SeasonList[this.SelectedSeason]) => {
        //TRANSFORMMMMM-----------------------------
        let MonPickData = await fetch("../DataBase/RTAPicks/MonPickData" + Season + ".json");
        MonPickData = await MonPickData.json();
        let Data = [];
        for (let index = 0; index < 18; index++) {
            let response = await fetch("../DataBase/Monsters/MonsterDataBase" + (index + 1) + ".json");
            response = await response.json();
            Data = Data.concat(response.results);
        } 
        const RTAPicksData = [];
        const NPartidos = this.GlobalData.Fight_Number;         
        Data.forEach(Mon => {  
            const MonDataPicks = MonPickData.filter( D => D.unit_master_id == Mon.com2us_id);  
            if (MonDataPicks.length != 0) {
                const Pick_Rate = MonDataPicks.length;
                const Win_Rate = MonDataPicks.filter(D => D.win == true).length;  
                const Banned_Rate = MonDataPicks.filter(D => D.banned == true).length;  
                const Leader = MonDataPicks.filter(D => D.leader == true).length;
                const FirstPick = MonDataPicks.filter(D => D.pick_slot_id == 1).length;
                const LastPick = MonDataPicks.filter(D => D.pick_slot_id == 5).length;
                Mon.Pick_Rate = (Pick_Rate / NPartidos * 100).toFixed(2) + "%";                
                Mon.Win_Rate =  (Win_Rate/Pick_Rate*100).toFixed(2) + "%";
                Mon.FirstPick =  (FirstPick/Pick_Rate*100).toFixed(2) + "%";
                Mon.LastPick =  (LastPick/Pick_Rate*100).toFixed(2) + "%";
                Mon.Banned_Rate = (Banned_Rate/Pick_Rate*100).toFixed(2) + "%";
                Mon.Leader = (Leader/Pick_Rate*100).toFixed(2) + "%";
                Mon.Season = this.SelectedSeason;
                Mon.SeasonScore = ((Pick_Rate / NPartidos * 100)*0.7 
                + (Win_Rate/Pick_Rate*100)*0.15 
                + (Banned_Rate/Pick_Rate*100)*0.15).toFixed(2);
                RTAPicksData.push(Mon);
            }          
        });
        return RTAPicksData;
   }
    Style = {
        type: "w-style",
        props: {
            ClassList: [
                new WCssClass(".DocumentView", {
                    //display: "grid",
                    height: "100%",
                    //padding: "20px",
                    //"grid-template-columns": "100%",
                    //"grid-template-rows": "50px calc(100% - 50px)"                           
                }), new WCssClass(".DataContainer", {
                    display: "flex",
                    width: "100%",                   
                }), new WCssClass(".DataContainer div", {
                    margin: "10px", "justify-content": "center", "align-items": "center", display: "flex"
                }), new WCssClass(".DataContainer select", {
                   padding: "10px"
                }), 
            ], MediaQuery: [{
                condicion: '(max-width: 600px)',
                ClassList: [
                    new WCssClass(".DataContainer", {
                        "flex-direction": "column"
                    })
                ]
            }]
        }
    };
}
customElements.define("w-rta-picks", MonsterRTAPicks);

