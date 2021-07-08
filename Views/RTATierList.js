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
        const TierContainer = {
            type: 'div', props: { id: '', class: 'TierContainer' },
            children: []
        }
        let topScore = 50
        let buttomScore = 45
        for (let index = 0; index < 10; index++) {
            TierContainer.children.push(new TierSection(RTAPicksData, {
                topScore: topScore,
                buttomScore: buttomScore
            }, this))
            topScore = topScore - 5;
            buttomScore = buttomScore - 5;
        }
        this.shadowRoot.append(WRender.createElement(TierContainer));
        this.shadowRoot.append(WRender.createElement(this.Style));
    }
    Style = {
        type: 'w-style', props: {
            id: '', ClassList: [
                new WCssClass(".DocumentView", {
                    height: "100%",
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
class TierSection {
    constructor(TierData = [], TierScore = {}, Parent) {
        this.type = "div";
        this.props = {
            class: "TierSection"
        }
        const LabelContainer = {
            type: 'div',
            props: { id: '', class: 'LabelContainer', innerHTML: `${TierScore.topScore} - ${TierScore.buttomScore}` }
        }
        const MobContainer = {
            type: 'div',
            props: { id: '', class: 'MobContainer' },
            children: []
        }
        this.children = [this.Style, LabelContainer, MobContainer];

        TierData.forEach(Data => {
            if (Data.SeasonScore <= TierScore.topScore && Data.SeasonScore >= TierScore.buttomScore) {
                MobContainer.children.push( { type:'div', props: { onclick: ()=>{
                    const Modal = WRender.createElement({
                        type: "w-modal-form",
                        props: {
                            ObjectDetail: Data,
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
                            //ShadowRoot: false,
                            title: "Tier Data",
                            StyleForm: "columnX3"
                        }
                    });
                    Parent.shadowRoot.append(WRender.createElement(Modal));
                }}, children:[{
                    type: "img", props: {
                        src: "https://swarfarm.com/static/herders/images/monsters/"
                            + Data.image_filename
                    }
                }, {
                    type: "label",
                    props: { innerText: `${Data.name}` }
                }]} );
            }
        });
    }
    Style = {
        type: "w-style",
        props: {
            ClassList: [
                new WCssClass(".TierSection", {
                    display: "flex",
                    //"flex-wrap": "wrap",
                    "min-height": "50px",
                    border: "1px #444 solid",
                    margin: "5px",
                    overflow: "hidden",
                    "border-radius": "0.4cm",
                }), new WCssClass(".TierSection .LabelContainer", {
                    border: "1px #444 solid",
                    "min-width": "70px",
                    display: "flex",
                    "justify-content": "center",
                    "align-items": "center",
                    color: "#fff",
                    background: "#444"
                }), new WCssClass(".TierSection .MobContainer", {
                    display: "flex",
                    "flex-wrap": "wrap",
                    "min-height": "50px",
                    //border: "1px #444 solid",
                    width: "100%",
                    padding: "5px"
                }), new WCssClass(".MobContainer div", {
                    position: "relative",
                }), new WCssClass(".MobContainer div label", {
                    position: "absolute",
                    bottom: 0, left: 0, margin: "5px",
                    "background-color": "rgba(0,0,0,0.6)",
                    padding: "5px",
                    "border-radius": "0.1cm",
                    color: "#fff",
                    "font-size": "12px"
                }), new WCssClass(".MobContainer div img", {
                    height: "100px", width: "100px"
                }),
            ],MediaQuery: [{
                condicion: '(max-width: 600px)',
                ClassList: [
                    new WCssClass(".MobContainer div img", {
                        height: "60px", width: "60px"
                    }), new WCssClass(".MobContainer div label", {
                        position: "absolute",
                        bottom: 0, left: 0,
                         margin: "0px",                        
                        "font-size": "9px"
                    }),new WCssClass(".TierSection .LabelContainer", {                       
                        "min-width": "40px",
                        "font-size": "11px",
                        "align-items": "flex-start",
                        "padding-top": "15px"
                    })
                ]
            }]
        }
    };
}
customElements.define("w-rta-tier", RTATierList);

