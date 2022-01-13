import { WRender, WArrayF, ComponentsManager, WAjaxTools } from '../../WDevcore/WModules/WComponentsTools.js';
import { WCssClass } from '../../WDevCore/WModules/WStyledRender.js';
import { ColumChart } from "../../WDevCore/WComponents/WChartJSComponents.js";
import { StyleScrolls, StylesControlsV1 } from "../../WDevCore/StyleModules/WStyleComponents.JS";
class DetailsRTAPicks extends HTMLElement {
    constructor(Data) {
        super();
        this.attachShadow({ mode: 'open' });
        this.ImageUrlPath = "https://swarfarm.com/static/herders/images/monsters/";
        this.shadowRoot.appendChild(WRender.createElement(this.Style()));
        this.shadowRoot.appendChild(WRender.createElement(StyleScrolls));
        WRender.SetStyle(this, {
            
        })
        this.GeneralContainer = WRender.Create({
            className: "GeneralContainer",
            children: [
                {
                    className: "imageCont", children: [
                        { tagName: "img", src: this.ImageUrlPath + Data.image_filename },
                        { tagName: "label", innerText: `${Data.name}` }
                    ]
                }, {
                    className: "details", children: [
                        { tagName: "label", innerText: `SeasonScore: ${Data.SeasonScore.toFixed(2)}` },
                        { tagName: "label", innerText: `PickRate: ${Data.Pick_Rate.toFixed(2)} %` },
                        { tagName: "label", innerText: `WinRate: ${Data.Win_Rate.toFixed(2)} %` },
                        { tagName: "label", innerText: `BannedRate: ${Data.Banned_Rate.toFixed(2)} %` },
                        { tagName: "label", innerText: `Leader: ${Data.Leader.toFixed(2)} %` },
                        { tagName: "label", innerText: `FirstPick: ${Data.FirstPick.toFixed(2)} %` },
                    ]
                }
            ]
        });
        this.Data = Data;
        this.OptionsContainer = WRender.Create({ className: "OptionsContainer" });
        this.Rendimiento = WRender.Create({ className: "Rendimiento" });
        this.CompsContainer = WRender.Create({ className: "CompsContainer" });
        this.DetailContainer = WRender.Create({
            className: "DetailContainer", style: {
                display: "grid",
                //padding: "20px",
                width: "calc(100%)",
                gridTemplateRows: "150px 50px 310px 30px 200px",
                gridTemplateColumns: "100%",
                //justifyItems: "center"
            }, children: [this.GeneralContainer, this.OptionsContainer, this.Rendimiento, WRender.Create({tagName: "h3", innerText: "RTA Teams"}) ,this.CompsContainer]
        });
        this.shadowRoot.append(this.DetailContainer);

    }
    connectedCallback() {
        this.DrawComponent();
    }
    DrawComponent = async () => {
        let Data = [];
        let DataSeason = [];
        for (let index = 0; index < SeasonList.length; index++) {
            let response = await fetch("./DataBase/RTAPicks/DataPickRate" + SeasonList[index] + ".json");
            response = await response.json();
            if (index == 0) {
                DataSeason = response;
            }
            Data = Data.concat(response);
        }
        this.Rendimiento.appendChild(new ColumChart({
            Dataset: Data.filter(x => x.com2us_id == this.Data.com2us_id),
            Colors: ["#ff6699", "#ffbb99", "#adebad"],
            TypeChart: "Line",
            ColumnLabelDisplay: 0,
            AttNameEval: "name",
            EvalValue: "SeasonScore",
            groupParams: ["Season"]
        }));
        console.log(this.Rendimiento);
        this.Data.combats.forEach(combat => {
            if (combat.count <= 1) {
                return;
            }
            const combatDiv = WRender.Create({ className: "DivCombat" });
            JSON.parse(combat.picks).forEach(pick => {
                const PickInfo = DataSeason.find(p => p.com2us_id == pick);
                console.log(PickInfo);
                if (PickInfo != null) {
                    combatDiv.append(WRender.Create({
                        className: "", children: [
                            {
                                tagName: "img", src: this.ImageUrlPath + PickInfo.image_filename,
                                className:
                                    (combat.first_pick == pick ? " isFP" : "") +
                                    (combat.leader_pick == pick ? " isLead" : "") +
                                    (combat.pick_banned == pick ? " isBAN" : "")
                            }, { tagName: "label", innerText: `${PickInfo.name}` }
                        ]
                    }))
                }
            });
            this.CompsContainer.appendChild(combatDiv);
        });
    }
    Style = () => {
        return {
            type: 'w-style', props: {
                id: '', ClassList: [
                    new WCssClass(`.GeneralContainer`, {
                        display: 'flex',
                        "justify-self": "center"
                    }), new WCssClass(`.details`, {
                        display: 'grid',
                        "grid-template-columns": "50% 50%",
                        "grid-gap": "1%"
                    }), new WCssClass(`.details label`, {
                        padding: 10,
                        background: "#4da6ff",
                        "border-radius": 5,
                        margin: 5,
                        display: "flex",
                        "align-items": "center",
                        "font-size": 10
                    }), new WCssClass(".imageCont, .CompsContainer div", {
                        position: "relative",
                    }), new WCssClass(".imageCont label, .CompsContainer div label", {
                        position: "absolute",
                        bottom: 0, left: 0, margin: "5px",
                        "background-color": "rgba(0,0,0,0.6)",
                        padding: "5px",
                        "border-radius": "0.1cm",
                        color: "#fff",
                        "font-size": "12px"
                    }), new WCssClass(".imageCont img", {
                        height: 150, width: 150
                    }), new WCssClass(".CompsContainer", {
                        display: "flex",
                        "flex-direction": "column",
                        "align-items": "center",
                        //padding: 10,
                        height: "100%",
                        overflow: "hidden",
                        "overflow-y": "auto",
                        "font-size": 10,
                    }), new WCssClass(".DivCombat", {
                        display: "flex",
                    }), new WCssClass(".isFP::after", {
                        position: "absolute",
                        content: "'FP'",
                        "border-radius": "50%",
                        top: 5,
                        right: 5,
                        "z-index": 2,
                        padding: 5,
                        "font-size": 8,
                        width: 10,
                        "text-align": "center",
                        "background-color": "#09f"
                    }), new WCssClass(".isLead::after", {
                        position: "absolute",
                        content: "'L'",
                        "border-radius": "50%",
                        top: 5,
                        left: 5,
                        "z-index": 2,
                        padding: 5,
                        "font-size": 8,
                        width: 10,
                        "text-align": "center",
                        "background-color": "#e55815"
                    }), new WCssClass(".isLead", {
                        display: "flex",
                    }), new WCssClass(".isBAN", {
                        fliter: "grayscale(100%)"
                    }), new WCssClass(".CompsContainer div img", {
                        height: 100, width: 100
                    }),new WCssClass(".CompsContainer div label", {
                        "font-size": 9
                    }), 
                ], MediaQuery: [{
                    condicion: '(max-width: 600px)',
                    ClassList: [new WCssClass(".CompsContainer div img", {
                        height: 60, width: 60
                    }),]
                },
                ]
            }
        };
    }
}
customElements.define('w-detail-rta', DetailsRTAPicks);
export { DetailsRTAPicks }