import { ComponentsManager, WAjaxTools, WArrayF, WRender } from "../WDevCore/WModules/WComponentsTools.js";
import { WCssClass } from "../WDevCore/WModules/WStyledRender.js";
import "../WDevCore/WComponents/WTableComponents.js";
import "../WDevCore/WComponents/WFilterControls.js";

export default class MonsterRTAPicks extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.className = "DocumentView";
    }
    connectedCallback() {
        if (this.shadowRoot.innerHTML != "") {
            return;
        }
        this.DrawComponent();
    }
    DrawComponent = async () => {
        // let responsePicks = await fetch("../DataBase/RTAPicks/MonPickData.json");
        // responsePicks = await responsePicks.json();
        let RTAPicksData =await fetch("../DataBase/RTAPicks/DataPickRate.json");      
        RTAPicksData = await RTAPicksData.json();
        const UserActions = [{
            name: "Builds",
            Function: (Param) => {                
                console.log(Param)
            }
        }]
        RTAPicksData.sort(function (a, b) {
            if (a.Win_Rate < b.Win_Rate) {
              return 1;
            }
            if (a.Win_Rate > b.Win_Rate) {
              return -1;
            }
            return 0;
        });
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
        this.append(WRender.createElement(this.Style));

        console.log("cargando...");
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
                }), new WCssClass(".DocumentView label", {
                    display: "flex",
                    height: "100%",
                    "font-size": "20px",
                    "justify-content": "center",
                    "align-items": "center"
                }), new WCssClass(".DocumentView embed, .DocumentView object", {
                    display: "block",
                    width: "100%",
                    height: "100%"
                }),
            ]
        }
    };
}
customElements.define("w-rta-picks", MonsterRTAPicks);

