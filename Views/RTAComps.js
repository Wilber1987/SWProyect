import { WRender, WArrayF, ComponentsManager, WAjaxTools } from '../WDevcore/WModules/WComponentsTools.js';
import { WCssClass } from '../WDevCore/WModules/WStyledRender.js';
import { ColumChart } from "../WDevCore/WComponents/WChartJSComponents.js";
import { StyleScrolls, StylesControlsV1 } from "../WDevCore/StyleModules/WStyleComponents.JS";
import { WModalForm } from "../WDevCore/WComponents/WModalForm.js";

export default class RTACompsView extends HTMLElement {
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
        this.shadowRoot.appendChild(WRender.createElement(StylesControlsV1));
        WRender.SetStyle(this, {
            height: "100%",
            //display: "block",
            overflow: "hidden"
        });
        this.shadowRoot.append(WRender.createElement(this.Style));
        this.shadowRoot.append(WRender.CreateStringNode("<h2>RTA Combats</h2>"));
        let MonsterList = await fetch("./DataBase/MonsterList.json");        
        MonsterList = await MonsterList.json();        
        let RTAPicksData = await fetch("./DataBase/RTAPicks/DataPickComps"+ SeasonList[this.SelectedSeason] +".json");        
        RTAPicksData = await RTAPicksData.json();
        //RTAPicksData = await WAjaxTools.PostRequest("http://localhost/SWProyect/API/RTAPicksData.php?function=RTCombats");
        this.MonsterListFilt = WRender.Create({
            style: {
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center"
            }
        });
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
        const CompsB = new DetailCombats(RTAPicksData, MonsterList);
        const DivCont = WRender.Create({
            class: 'DataContainer', children: [
                {
                    children: [WRender.createElement(SelectSeason), {
                        tagName: 'input',
                        type: 'text',
                        class: 'className',
                        placeholder: "Search by Monster Name",
                        onchange: async (ev) => {
                            if (ev.target.value.length < 3) {
                                CompsB.Data = RTAPicksData;
                                CompsB.DrawComponent();
                                return;
                            } 
                            const val = ev.target.value.toUpperCase();
                            const mobs = MonsterList.filter(x => x.name.toUpperCase().includes(val));
                            this.MonsterListFilt.innerHTML = "";
                            if (mobs.length == 0) {
                                return;
                            }
                            mobs.forEach(mob => {
                                const NNode = WRender.CreateStringNode(`<div class="imageCont">
                                    <img onclick="" src="https://swarfarm.com/static/herders/images/monsters/${mob.image_filename}">
                                    <label>${mob.name}</label>
                                </div>`);
                                NNode.onclick = () => {
                                    Modal.close();
                                    const RtaP = RTAPicksData.filter(x => x.picks.includes(mob.com2us_id) || x.picks_2.includes(mob.com2us_id));
                                    if (RtaP.length != 0) {
                                        CompsB.Data = RtaP;
                                    } 
                                    CompsB.DrawComponent(mob);
                                }
                                this.MonsterListFilt.append(NNode);
                            });
                            const Modal = new WModalForm({
                                ObjectModal: this.MonsterListFilt,
                                DarkMode: true,
                                ShadowRoot: false,
                                title: "Select Monster",
                            });
                            this.shadowRoot.append(Modal);                            
                        }
                    }, {
                        tagName: "label", innerText: "Win", style: {
                            padding: "10px",
                            margin: "5px",
                            width: "100px",
                            borderRadius: "10px",
                            background: "#4da6ff"
                        }
                    }, {
                        tagName: "label", innerText: "Lose", style: {
                            padding: "10px",
                            margin: "5px",
                            width: "100px",
                            borderRadius: "10px",
                            background: "#f50000"
                        }
                    }]
                }, CompsB
            ]
        });     
        this.shadowRoot.appendChild(DivCont);
    }
    Style = {
        type: "w-style",
        props: {
            ClassList: [
                new WCssClass(".DocumentView", {
                }), new WCssClass(".DataContainer", {
                    display: "flex",
                    width: "100%",
                    height: "100%",
                    overflow: "auto",
                    "flex-direction": "column"
                }), new WCssClass(".DataContainer div", {
                    margin: "10px", "justify-content": "center", "align-items": "center", display: "flex"
                }), new WCssClass(".DataContainer select", {
                    padding: "10px"
                }), new WCssClass("h2", {
                    margin: "0px",
                    color: "#999"
                }), new WCssClass(".imageCont", {
                    position: "relative",
                }), new WCssClass(".imageCont label", {
                    position: "absolute",
                    bottom: 0, left: 0, margin: "5px",
                    "background-color": "rgba(0,0,0,0.6)",
                    padding: "5px",
                    "border-radius": "0.1cm",
                    color: "#fff",
                    "font-size": 9
                }), new WCssClass(".imageCont img", {
                    cursor: "pointer"
                })
            ], MediaQuery: [{
                condicion: '(max-width: 600px)',
                ClassList: [
                    new WCssClass(".DataContainer", {
                    })
                ]
            }]
        }
    };
}
customElements.define("w-rta-comps", RTACompsView);


class DetailCombats extends HTMLElement {
    constructor(Data, MonsterList) {
        super();
        this.attachShadow({ mode: 'open' });
        this.ImageUrlPath = "https://swarfarm.com/static/herders/images/monsters/";
        this.shadowRoot.appendChild(WRender.createElement(this.Style()));
        this.shadowRoot.appendChild(WRender.createElement(StyleScrolls));
        WRender.SetStyle(this, {
            height: "100%",
            display: "block",
            overflow: "auto"
        });
        this.Data = Data;
        this.MonsterList = MonsterList;
        this.CompsContainer = WRender.Create({ className: "CompsContainer" });
        this.DetailContainer = WRender.Create({
            className: "DetailContainer", style: {
                display: "grid",
                height: "calc(100% - 40px)",
                gridTemplateRows: "50px calc(100% - 50px)",
                overflow: "hidden",
                gridTemplateColumns: "100%",
            }, children: [WRender.Create({ tagName: "h3", innerText: "RTA Teams" }), this.CompsContainer]
        });
        this.shadowRoot.append(this.DetailContainer);

    }
    connectedCallback() {
        this.DrawComponent();
    }
    DrawComponent = async (unit = {}) => {
        this.CompsContainer.innerHTML = "";
        this.Data.forEach((combat, index) => {
            if (index > 50) {
                return;
            }
            const combatDiv = WRender.Create({ className: "DivCombat" });
            const combatDiv1 = WRender.Create({
                className: "DivCombat1 " + (combat.win == 1 ? "teamW" : "teamL")
            });
            const combatDiv2 = WRender.Create({
                className: "DivCombat2 " + (combat.win_2 == 1 ? "teamW" : "teamL")
            });
            JSON.parse(combat.picks).forEach(pick => {
                const PickInfo = this.MonsterList.find(p => p.com2us_id == pick);
                if (PickInfo != null) {
                    combatDiv1.append(WRender.Create({
                        className: "imageCont" +
                            (combat.first_pick == pick ? " isFP" : "") +
                            (combat.leader_pick == pick ? " isLead" : "") +
                            (unit.com2us_id == pick ? " isSelected" : "") +
                            (combat.pick_banned == pick ? " isBAN" : ""), children: [
                                { tagName: "img", src: this.ImageUrlPath + PickInfo.image_filename },
                                { tagName: "label", innerText: `${PickInfo.name}` }
                            ]
                    }));
                }
            });
            JSON.parse(combat.picks_2).forEach(pick => {
                const PickInfo = this.MonsterList.find(p => p.com2us_id == pick);
                if (PickInfo != null) {
                    combatDiv2.append(WRender.Create({
                        className: "imageCont" +
                            (combat.first_pick_2 == pick ? " isFP" : "") +
                            (combat.leader_pick_2 == pick ? " isLead" : "") +
                            (unit.com2us_id == pick ? " isSelected" : "") +
                            (combat.pick_banned_2 == pick ? " isBAN" : ""), children: [
                                { tagName: "img", src: this.ImageUrlPath + PickInfo.image_filename },
                                { tagName: "label", innerText: `${PickInfo.name}` }
                            ]
                    }));
                }
            });
            combatDiv.append(combatDiv1, "VS", combatDiv2)
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
                    }), new WCssClass(".imageCont", {
                        position: "relative",
                    }), new WCssClass(".imageCont label", {
                        position: "absolute",
                        bottom: 0, left: 0, margin: "5px",
                        "background-color": "rgba(0,0,0,0.6)",
                        padding: "5px",
                        "border-radius": "0.1cm",
                        color: "#fff",
                        "font-size": 9
                    }), new WCssClass(".imageCont img", {
                        height: 80, width: 80
                    }), new WCssClass(".CompsContainer", {
                        display: "flex",
                        "flex-direction": "column",
                        "align-items": "center",
                        //padding: 10,
                        height: "100%",
                        overflow: "hidden",
                        "overflow-y": "auto",
                        "font-size": 10,
                        "padding-bottom": 30
                    }), new WCssClass(".DivCombat, .DivCombat1, .DivCombat2", {
                        display: "flex",
                        "align-items": "center",
                        "justify-content": "center",
                        margin: 5
                    }), new WCssClass(".DivCombat", {
                        border: "solid 2px #444",
                        "border-radius": 10
                    }), new WCssClass(".teamL", {
                        "border-bottom": "5px #f50000 solid"
                    }), new WCssClass(".teamW", {
                        "border-bottom": "5px #4da6ff solid"
                    }), new WCssClass(".isSelected", {
                        "box-shadow":" 0 0 10px 1px #1684ff",
                        border: "solid 2px #94c6ff"
                    }), new WCssClass(".isFP::after", {
                        position: "absolute",
                        content: "'FP'",
                        "border-radius": "50%",
                        top: 5,
                        right: 5,
                        "z-index": "2",
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
                        "z-index": "2",
                        padding: 5,
                        "font-size": 8,
                        width: 10,
                        "text-align": "center",
                        "background-color": "#e55815"
                    }), new WCssClass(".isLead", {
                        display: "flex",
                    }), new WCssClass(".isBAN", {
                        filter: "grayscale(1)"
                    })
                ], MediaQuery: [{
                    condicion: '(max-width: 600px)',
                    ClassList: [new WCssClass(".imageCont img", {
                        height: 60, width: 60
                    }), new WCssClass(".DivCombat", {
                        display: "flex",
                        "align-items": "center",
                        "justify-content": "center",
                        margin: 5,
                        "flex-direction": "column"
                    })]
                },
                ]
            }
        };
    }
}
customElements.define('w-detail-combats', DetailCombats);