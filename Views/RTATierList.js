import { ComponentsManager, WAjaxTools, WArrayF, WRender } from "../WDevCore/WModules/WComponentsTools.js";
import { WCssClass } from "../WDevCore/WModules/WStyledRender.js";
import "../WDevCore/WComponents/WTableComponents.js";
import "../WDevCore/WComponents/WFilterControls.js";

export default class RTATierList extends HTMLElement {
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
        
        // const UserActions = [{
        //     name: "Builds",
        //     Function: (Param) => {
        //         console.log(Param)
        //     }
        // }]

        // var TableConfigG = {
        //     Datasets: RTAPicksData,
        //     ImageUrlPath: "https://swarfarm.com/static/herders/images/monsters/",
        //     Colors: ["#ff6699", "#ffbb99", "#adebad"],
        //     DisplayData: [
        //         "image_filename",
        //         "name",
        //         "element",
        //         "Pick_Rate",
        //         "Win_Rate",
        //         "Banned_Rate",
        //         "Leader",
        //         "FirstPick",
        //         "LastPick",
        //         "SeasonScore"
        //     ],
        //     Options: {
        //         Search: true,
        //         UserActions: UserActions
        //     }
        // };
        // const WTableReport = WRender.createElement(WRender.createElement({
        //     type: "w-table",
        //     props: {
        //         id: "TableId",
        //         TableConfig: TableConfigG
        //     }
        // }));
        //this.shadowRoot.append(WTableReport);
        this.shadowRoot.append(WRender.createElement(this.Style));
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
            ]
        }
    };
}
customElements.define("w-rta-tier", RTATierList);

