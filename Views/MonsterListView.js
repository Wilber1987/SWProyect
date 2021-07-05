import { ComponentsManager, WAjaxTools, WRender } from "../WDevCore/WModules/WComponentsTools.js";
import { WCssClass } from "../WDevCore/WModules/WStyledRender.js";
import "../WDevCore/WComponents/WTableComponents.js";

export default class MonsterListView extends HTMLElement {
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
        let Data = [];
        for (let index = 0; index < 18; index++) {
            let response = await fetch("../DataBase/Monsters/MonsterDataBase" + (index + 1) + ".json");
            response = await response.json();
            Data = Data.concat(response.results);
        }       
        // Data.forEach(Mon => {         
        // });
        const UserActions = [{
            name: "Builds",
            Function: (Param) => {                
                console.log(Param)
            }
        },{
            name: "RTA Info",
            Function: (Param) => {                
                console.log(Param)
            }
        },{
            name: "ARENA Info",
            Function: (Param) => {                
                console.log(Param)
            }
        },{
            name: "GUILD Info",
            Function: (Param) => {                
                console.log(Param)
            }
        }]
        var TableConfigG = {
            Datasets: Data,
            ImageUrlPath: "https://swarfarm.com/static/herders/images/monsters/",
            Colors: ["#ff6699", "#ffbb99", "#adebad"],
            DisplayData: [
                "image_filename",
                "name",
                "element",
                "archetype", 
                "base_stars", 
                "natural_stars",
                /*"base_hp", 
                "base_attack", 
                "base_defense",
                "speed", 
                "crit_rate", 
                "resistance", 
                "accuracy"*/
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
                    display: "grid",
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
customElements.define("w-monster-list", MonsterListView);

