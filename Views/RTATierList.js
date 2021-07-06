import { ComponentsManager, WAjaxTools, WRender } from "../WDevCore/WModules/WComponentsTools.js";
import { WCssClass } from "../WDevCore/WModules/WStyledRender.js";
import "../WDevCore/WComponents/WTableComponents.js";

export default class MonsterDetail extends HTMLElement {
    constructor(MonsterId) {
        super();
        this.attachShadow({ mode: "open" });
        this.className = "DocumentView";
        this.MonsterId = MonsterId;
    }
    connectedCallback() {
        if (this.shadowRoot.innerHTML != "") {
            return;
        }
        this.DrawComponent();
    }
    DrawComponent = async () => {
        let RTAPicksData = await fetch("../DataBase/RTAPicks/MonPickData" + SeasonList[IndexSeason] + ".json");
        RTAPicksData = await RTAPicksData.json();
        const RTABattles = RTAPicksData.filter((item) =>
            item.com2us_id == this.MonsterId
        );
        RTABattles.forEach(bat => {
            const RTAPic = RTAPicksData.filter((item) =>
                item.id_battle == bat.id_battle
            );
        });
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
            ],
            Options: {
                Search: true,
                //UserActions: UserActions
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
customElements.define("w-monster-detail", MonsterDetail);

