import { ComponentsManager, WAjaxTools, WArrayF, WRender } from "../WDevCore/WModules/WComponentsTools.js";
import { WCssClass } from "../WDevCore/WModules/WStyledRender.js";
import "../WDevCore/WComponents/WTableComponents.js";
import "../WDevCore/WComponents/WFilterControls.js";

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
        this.shadowRoot.append(WRender.createElement(this.Style));
        this.shadowRoot.append(WRender.CreateStringNode("<h2>RTA Teams Info</h2>"));
        let GlobalData = await fetch("../DataBase/RTAPicks/GlobalData" + SeasonList[this.SelectedSeason] + ".json");
        GlobalData = await GlobalData.json();
        this.GlobalData = GlobalData;
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
            const option = { type: 'option', props: { innerText: element, value: index } };
            if (SeasonList[this.SelectedSeason] == element) {
                option.props.selected = true;
            }
            SelectSeason.children.push(option);
        });
        DivCont.children.push([SelectSeason])
        this.shadowRoot.appendChild(WRender.createElement(DivCont));       
        const RTAPicksData = await this.CreateRtaPicksData(SeasonList[this.SelectedSeason]);
        RTAPicksData.sort(function (a, b) {
            return b.rate - a.rate;
        });
        const UserActions = [{
            name: "Builds",
            Function: (Param) => {
                console.log(Param)
            }
        }]
        var TableConfigG = {
            Datasets: RTAPicksData,
            //StyleType:"Cards3",
            ImageUrlPath: "https://swarfarm.com/static/herders/images/monsters/",
            Colors: ["#ff6699", "#ffbb99", "#adebad"],
             DisplayData: [
                 "Pick_Image_1",
                 "Pick_Image_2",
                 "Pick_Image_3",
                 "Pick_Image_4",
                 "Pick_Image_5",
                 "Win_Rate" ,
                 //"Pick_Name1",
                 //"Pick_Name2",
                 //"Pick_Name3",
                 //"Pick_Name4",
                 //"Pick_Name5",
                 "count"
             ],
             
            Options: {
                Search: true, 
                //Show: true
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
    }
    CreateRtaPicksData = async (Season = SeasonList[this.SelectedSeason]) => {
        //TRANSFORMMMMM-----------------------------
        let DataComps = await fetch("../DataBase/RTAPicks/DataPickComps" + Season + ".json");
        DataComps = await DataComps.json();        
        return DataComps;
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
customElements.define("w-rta-comps", RTACompsView);

