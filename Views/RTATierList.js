import { ComponentsManager, WAjaxTools, WArrayF, WRender } from "../WDevCore/WModules/WComponentsTools.js";
import { WCssClass } from "../WDevCore/WModules/WStyledRender.js";
import { WTableComponent } from "../WDevCore/WComponents/WTableComponent.js";
import "../WDevCore/WComponents/WFilterControls.js";
import { StyleScrolls, StylesControlsV1 } from "../WDevCore/StyleModules/WStyleComponents.JS";

const EvaluacionWR = [
    { WinRate: ">= 45", PickRate: ">= 40", Value: "WinRate * 0.75" },
    { WinRate: ">= 45", PickRate: ">= 25", Value: "WinRate * 0.70" },
    { WinRate: ">= 45", PickRate: "< 25 AND >= 10", Value: "WinRate * 0.65" },
    { WinRate: ">= 45", PickRate: "< 10 AND >= 5", Value: "WinRate * 0.60" },
    //
    { WinRate: ">= 40", PickRate: ">= 25", Value: "WinRate * 0.65" },
    { WinRate: ">= 40", PickRate: "< 25 AND >= 10", Value: "WinRate * 0.60" },
    { WinRate: ">= 40", PickRate: "< 10 AND >= 5", Value: "WinRate * 0.55" },
    { WinRate: "-", PickRate: ">= 2", Value: "WinRate * 0.50" },
    { WinRate: "-", PickRate: ">= .4", Value: "WinRate * 0.40" },
    { WinRate: "-", PickRate: ">= .1", Value: "WinRate * 0.30" },
]
const EvaluacionBR = [
    { BannedRate: ">= 30", PickRate: ">= 25", Value: "BannedRate * 0.35" },
    { BannedRate: ">= 30", PickRate: "< 25 AND >= 10", Value: "BannedRate * 0.25" },
    { BannedRate: ">= 30", PickRate: "< 10 AND >= 5", Value: "BannedRate * 0.20" },
    //
    { BannedRate: ">= 25", PickRate: ">= 25", Value: "BannedRate * 0.30" },
    { BannedRate: ">= 25", PickRate: "< 25 AND >= 10", Value: "BannedRate * 0.25" },
    { BannedRate: ">= 25", PickRate: "< 10 AND >= 5", Value: "BannedRate * 0.15" },
    //
    { BannedRate: ">= 15", PickRate: ">= 25", Value: "BannedRate * 0.20" },
    { BannedRate: ">= 15", PickRate: "< 25 AND >= 10", Value: "BannedRate * 0.15" },
    { BannedRate: ">= 15", PickRate: "< 10 AND >= 5", Value: "BannedRate * 0.10" },
    //
    { BannedRate: "-", PickRate: ">= 1", Value: "BannedRate * 0.05" },
]
const EvaluacionFR = "0.05 del FirstPickRate"
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
        this.shadowRoot.append(WRender.createElement(StyleScrolls));
        this.shadowRoot.append(WRender.createElement(StylesControlsV1));
        this.shadowRoot.append(WRender.createElement(this.Style));
        this.shadowRoot.append(WRender.CreateStringNode("<h2>RTA TierList</h2>"));
        let RTAPicksData = await fetch("./DataBase/RTAPicks/DataPickRate" + SeasonList[this.SelectedSeason] + ".json");
        RTAPicksData = await RTAPicksData.json();
        //RTAPicksData = await WAjaxTools.PostRequest("http://localhost/SWProyect/API/RTAPicksData.php?function=RTAData"); 
        //console.log(RTAPicksData.find(x => x.com2us_id == 25613));     
        //console.log(RTAPicksData.find(x => x.com2us_id == "25613"));  
        //console.log(RTAPicksData);
        RTAPicksData.sort(function (a, b) {
            return b.SeasonScore - a.SeasonScore;
        });
        let GlobalData = {
            Fight_Number: RTAPicksData[0].countFilter
        };
        const DivCont = { type: 'div', props: { id: '', class: 'DataContainer' }, children: [] };
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
            const option = { type: 'option', props: { innerText: element, value: index } };
            if (SeasonList[this.SelectedSeason] == element) {
                option.props.selected = true;
            }
            SelectSeason.children.push(option);
        });
        DivCont.children.push([SelectSeason])
        DivCont.children.push({//Data
            type: 'button', props: {
                class: 'Btn', innerText: 'Evaluation Params', onclick: async () => {
                    this.shadowRoot.append(WRender.createElement({
                        type: "w-modal-form",
                        props: {
                            title: "Datos",
                            ObjectModal: [
                                WRender.CreateStringNode(`<h3>${EvaluacionFR}</h3>`) ,
                                new WTableComponent({
                                    Dataset: EvaluacionWR,
                                }), new WTableComponent({
                                    Dataset: EvaluacionBR,
                                })
                            ]
                        }
                    }));
                }
            }
        })
        this.shadowRoot.appendChild(WRender.createElement(DivCont));
        const TierContainer = {
            type: 'div', props: { id: '', class: 'TierContainer' },
            children: []
        }
        TierContainer.children.push(new TierSection(RTAPicksData, {
            topScore: 100,
            buttomScore: 90
        }, this));
        TierContainer.children.push(new TierSection(RTAPicksData, {
            topScore: 90,
            buttomScore: 80
        }, this));
        TierContainer.children.push(new TierSection(RTAPicksData, {
            topScore: 80,
            buttomScore: 70
        }, this));
        TierContainer.children.push(new TierSection(RTAPicksData, {
            topScore: 70,
            buttomScore: 60
        }, this));
        TierContainer.children.push(new TierSection(RTAPicksData, {
            topScore: 60,
            buttomScore: 50
        }, this));
        TierContainer.children.push(new TierSection(RTAPicksData, {
            topScore: 50,
            buttomScore: 40
        }, this));
        TierContainer.children.push(new TierSection(RTAPicksData, {
            topScore: 40,
            buttomScore: 30
        }, this));
        TierContainer.children.push(new TierSection(RTAPicksData, {
            topScore: 30,
            buttomScore: 0
        }, this));
        this.shadowRoot.append(WRender.createElement(TierContainer));
    }
    Style = {
        type: 'w-style', props: {
            id: '', ClassList: [
                new WCssClass(".DocumentView", {
                    height: "100%",
                }), new WCssClass(".DataContainer", {
                    display: "flex",
                    width: "100%",
                    "align-items": "center"
                }), new WCssClass(".DataContainer div", {
                    margin: "10px", "justify-content": "center", "align-items": "center", display: "flex"
                }), new WCssClass(".DataContainer select", {
                    padding: "10px"
                }), new WCssClass("h2", {
                    margin: "0px",
                    color: "#999"
                }),
            ], MediaQuery: [{
                condicion: '(max-width: 600px)',
                ClassList: [
                    new WCssClass(".DataContainer", {
                        //"flex-direction": "column"
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
            if (Data.SeasonScore <= TierScore.topScore && Data.SeasonScore > TierScore.buttomScore) {
                MobContainer.children.push({
                    type: 'div', props: {
                        onclick: () => {
                            console.log(Data);
                            const Modal = WRender.createElement({
                                type: "w-modal-form",
                                props: {
                                    ObjectDetail: Data,
                                    ImageUrlPath: "https://swarfarm.com/static/herders/images/monsters/",
                                    DisplayData: [
                                        "image_filename",
                                        //"name",
                                        "element",
                                        "Pick_Rate",
                                        "Win_Rate",
                                        "Banned_Rate",
                                        "Leader",
                                        "FirstPick",
                                        //"FirstPickInTeam",
                                        //"LastPick",
                                        "SeasonScore"
                                    ],
                                    //ShadowRoot: false,
                                    title: "Tier Data",
                                    StyleForm: "columnX2"
                                }
                            });
                            Parent.shadowRoot.append(WRender.createElement(Modal));
                        }
                    }, children: [{
                        type: "img", props: {
                            src: "https://swarfarm.com/static/herders/images/monsters/"
                                + Data.image_filename
                        }
                    }, {
                        type: "label",
                        props: { innerText: `${Data.name}` }
                    }]
                });
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
            ], MediaQuery: [{
                condicion: '(max-width: 600px)',
                ClassList: [
                    new WCssClass(".MobContainer div img", {
                        height: "60px", width: "60px"
                    }), new WCssClass(".MobContainer div label", {
                        position: "absolute",
                        bottom: 0, left: 0,
                        margin: "0px",
                        "font-size": "9px"
                    }), new WCssClass(".TierSection .LabelContainer", {
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

