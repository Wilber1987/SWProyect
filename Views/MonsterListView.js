import { ComponentsManager, type, WAjaxTools, WRender } from "../WDevCore/WModules/WComponentsTools.js";
import { WCssClass } from "../WDevCore/WModules/WStyledRender.js";
import "../WDevCore/WComponents/WTableComponents.js";
import "../WDevCore/WComponents/WModalForm.js";
import "../WDevCore/WComponents/WFilterControls.js";

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
        this.shadowRoot.append(WRender.createElement(this.Style));
        this.append(WRender.createElement(this.Style));
        this.shadowRoot.append(WRender.CreateStringNode("<h2>Monster List</h2>"));
        let Data = [];
        for (let index = 0; index < 19; index++) {
            let response = await fetch("../DataBase/Monsters/MonsterDataBase" + (index + 1) + ".json");
            response = await response.json();
            Data = Data.concat(response.results);
        }
        // Data.forEach(Mon => {         
        // });
        const UserActions = [{
            name: "Builds",
            Function: async (Param) => {
                let response = await fetch("../DataBase/Monsters/Builds.json");
                response = await response.json();
                const Builds = response.filter((item) => item.monsterId == Param.com2us_id);
                const BuildView = new BuildsView(Param, Builds);
                const Modal = WRender.createElement({
                    type: "w-modal-form",
                    props: {
                        ObjectModal: BuildView,
                        ShadowRoot: false,
                        title: "Builds",
                        StyleForm: "columnX3"
                    }
                });
                this.shadowRoot.append(WRender.createElement(Modal))
            }
        }]
        Data = Data.filter(x=> x.awakens_from != null);
        Data.sort(function (a, b) {
            return b.natural_stars - a.natural_stars;
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
                //"base_stars",
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
                Show: true,
                UserActions: UserActions
            }
        };
        const WTableReport = WRender.createElement({
            type: "w-table",
            props: {
                id: "TableId",
                TableConfig: TableConfigG
            }
        });
        const filtOptions = {
            type: "w-filter-option", props: {Config: {
                Dataset: Data,
                DisplayOption: [ 
                    "element",
                    "archetype",
                    //"base_stars",
                    "natural_stars",                   
                ],
            }, FilterFunction : async (FilterData)=>{
                //WTableReport.Dataset = FilterData;
                WTableReport.DefineTable(FilterData);
            }}
        }
        this.shadowRoot.append(WRender.createElement(filtOptions))
        this.shadowRoot.append(WTableReport);
    }
    Style = {
        type: "w-style",
        props: {
            ClassList: [
                new WCssClass(".DocumentView", {
                   // display: "grid",
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
                }),new WCssClass("h2", {
                    margin: "0px",
                    color: "#999"
                }),
            ]
        }
    };
}
customElements.define("w-monster-list", MonsterListView);
class BuildsView {
    constructor(MobsData, BuildsData = []) {
        this.type = "div";
        this.props = {
            class: "BuildsContainer"
        }
        this.children = [this.Style];
        const DetailMonster = {
            type: "div",
            props: {
                class: "DetailMonster"
            },
            children: []
        };
        DetailMonster.children = [{
            type: "img", props: {
                src: "https://swarfarm.com/static/herders/images/monsters/"
                    + MobsData.image_filename
            }
        }, {
            type: "h4",
            props: { innerText: `${MobsData.name}` }
        },
        {
            type: "label",
            props: { innerText: `Element: ${MobsData.element}` }
        }, {
            type: "label",
            props: { innerText: `Type: ${MobsData.archetype}` }
        }, {
            type: "label",
            props: { innerText: `Natural Stars: ${MobsData.natural_stars}` }
        },
        //styles
        {
            type: "w-style",
            props: {
                ClassList: [
                    new WCssClass(`.DetailMonster`, {
                        //height: "230px",
                        padding: "10px",
                        width: "calc(100% - 30px)",
                        border: "solid 1px #cbcbcb",
                        padding: "10px",
                        display: "grid",
                        margin: "auto",
                        "border-radius": "0.3cm",
                        "grid-template-rows": "auto auto auto auto",
                        "grid-template-columns": "220px calc(100% - 220px)",
                        "margin-bottom": "20px",
                    }), new WCssClass(`.DetailMonster img`, {
                        "grid-row": "1/5",
                        width: "200px",
                        height: "200px",
                        "object-fit": "cover",
                        "border-radius": "0.3cm",
                        "box-shadow": "0 2px 5px 0 rgb(0 0 0 / 30%)"
                    }), new WCssClass(`.DetailMonster h4`, {
                        margin: "0px",
                    }),
                ]
            }
        }
        ];
        this.children.push(DetailMonster)
        if (BuildsData.length == 0) {
            BuildsData.push({                
                "set1": "",
                "set2": "",
                "set3": "",
                "Stats":"withont builds",
                "Subs-stats":"withont builds",
                "ArtType": "withont builds",
                "ArtElement": "withont builds",
                "Description": "withont builds"
              });
        }
        BuildsData.forEach(Data => {
            Data.Set1_image =  `./Media/RuneIcons/${Data.set1}Icon.png`;
            Data.Set2_image =  `./Media/RuneIcons/${Data.set2}Icon.png`;
            Data.Set3_image =  `./Media/RuneIcons/${Data.set3}Icon.png`;
        });
        const TableConfigG = {
            Datasets: BuildsData,
            //ImageUrlPath: "https://swarfarm.com/static/herders/images/monsters/",
            //Colors: ["#ff6699", "#ffbb99", "#adebad"],
             DisplayData: [
                 "Set1_image",
                 "Set2_image",
                 "Set3_image",
                 "archetype", 
                 "Description", 
                 "Stats",
                 "Subs-stats",
                 "ArtType",
                 "ArtElement"
            ],
            Options: {
                Search: true,                
            }
        };
        const WTableBuilds = WRender.createElement({
            type: "w-table",
            props: {
                id: "TableId",
                TableConfig: TableConfigG
            }
        });
        this.children.push(WTableBuilds);
    }
    Style = {
        type: "w-style",
        props: {
            ClassList: [
                new WCssClass(".BuildsContainer", {
                    height: "100%",
                    padding: "20px",
                })
            ]
        }
    };
    RuneIcons = {
        Energy: "",
        Fatal: "",
        Blade: "",
        Swift: "",
        Focus: "",
        Despair: "",
        Guard: "",
        Endure: "",
        Revenge: "",
        Rage: "",
        Violent: "",
        Will: "",
        Nemesis: "",
        Shield: "",
        Vampire: "",
        Destroy: "",
    }
}

