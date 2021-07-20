import { ComponentsManager, WAjaxTools, WArrayF, WRender } from "../WDevCore/WModules/WComponentsTools.js";
import { WCssClass } from "../WDevCore/WModules/WStyledRender.js";
import "../WDevCore/WComponents/WTableComponents.js";
import "../WDevCore/WComponents/WFilterControls.js";
import "../WDevCore/WComponents/WReportsView.js";

export default class RTADashboard extends HTMLElement {
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
        let FullLogData = await fetch("../DataBase/RTAPicks/MonPickData" + SeasonList[this.SelectedSeason] + ".json");
        FullLogData = await FullLogData.json();
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
        let GlobalData = await fetch("../DataBase/RTAPicks/GlobalData" + SeasonList[this.SelectedSeason] + ".json");
        GlobalData = await GlobalData.json();
        this.GlobalData = GlobalData;
        const DivCont = { type: 'div', props: { id: '', class: 'DataContainer' }, children: [] }
        for (const prop in GlobalData) {
            DivCont.children.push([`${prop}: ${GlobalData[prop]}`]);
        }
        DivCont.children.push([SelectSeason])
        this.shadowRoot.appendChild(WRender.createElement(DivCont));
        console.log(FullLogData);
        const ConfigG = {
            Dataset: FullLogData,
            GroupParam: "id_battle",
            ReportList: false,
            DisplayData: [],
            Options: {
                Search: true,
                //Show: true
                //UserActions: UserActions
            }
        };
        const Report = {
            type: 'w-report-view', props:
            {
                id: '',
                Config: ConfigG,
                class: ''
            }
        }
        this.shadowRoot.append(WRender.createElement(Report));
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
                }), new WCssClass("h2", {
                    margin: "0px",
                    color: "#999"
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
customElements.define("w-rta-dashboard", RTADashboard);

