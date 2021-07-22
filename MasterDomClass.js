import { ComponentsManager, WAjaxTools, WRender } from "./WDevCore/WModules/WComponentsTools.js";
import { WCssClass } from "./WDevCore/WModules/WStyledRender.js";
import "./WDevCore/WComponents/WAppNavigator.js";
import { HomeClass } from "./Views/Home.js";
import MonsterListView from "./Views/MonsterListView.js";
import MonsterETL from "./Views/MonsterETL.js";
import MonsterRTAPicks from "./Views/MonsterRTAPicks.js";
import RTATierList from "./Views/RTATierList.js";
import RTACompsView from "./Views/RTAComps.js";
import ShareBuildsView from "./Views/ShareBuild.js";
import SiegCompsView from "./Views/GuildSiegeComps.js";
import Guides from "./Views/Guides.js";
import {InfoView} from "./Views/InfoView.js";


const DOMManager = new ComponentsManager();
class MasterDomClass extends ComponentsManager {
    constructor() {
        super();
        this.props = { className: "App" }
        this.children = [
            new headerClass(),
            new AsideClass(),
            new MainClass(),
            new FooterClass(),
            new FooterNavigator(),
            this.MasterStyle,
        ];
    }
    MasterStyle = {
        type: "w-style",
        props: {
            ClassList: [
                new WCssClass(".App", {
                    display: "grid",
                    "grid-template-columns": "250px calc(100% - 250px)",
                    "grid-template-rows": "100px calc(100vh - 150px) 50px"
                }), new WCssClass(".AppHeader", {
                    "grid-column": "1/3",
                    "background-color": "#eee",
                    "border-bottom": "solid #4da6ff 10px"
                }), new WCssClass(".AppAside", {
                    "border-right": "solid #999999 1px"
                }), new WCssClass(".AppMain", {
                    overflow: "auto",
                    padding: "20px"
                }), new WCssClass(".AppFooter", {
                    "grid-column": "1/3",
                    "background-color": "#eee",
                    "border-top": "solid #4da6ff 5px"
                }), new WCssClass("body", {
                    padding: "0px",
                    margin: "0px",
                    "font-family": "Arial, Helvetica, sans-serif"
                }), new WCssClass(".FooterNav", {
                    "grid-column": "1/3",
                    display: "none",
                }),
            ], MediaQuery: [{
                condicion: "(max-width: 1200px)",
                ClassList: [
                    new WCssClass(`.App`, {
                        display: "grid",
                        "grid-template-columns": "100px calc(100% - 100px)",
                        "grid-template-rows": "100px calc(100vh - 150px) 50px"
                    }), new WCssClass(".AppAside", {
                        overflow: "hidden"
                    }),
                ]
            }, {
                condicion: "(max-width: 600px)",
                ClassList: [
                    new WCssClass(`.App`, {
                        display: "grid",
                        "grid-template-columns": "10% 90%",
                        "grid-template-rows": "70px  calc(100% - 140px) 70px",
                        position: "fixed",
                        top: 0,
                        bottom: 0
                    }), new WCssClass(".AppHeader", {
                        "grid-column": "2/3",
                        "grid-row": "1/2",
                        "background-color": "#eee",
                        "border-bottom": "solid #4da6ff 10px",
                        "justify-content": "center",
                        "align-items": "center",
                        padding: "5px"
                    }), new WCssClass(".AppAside", {
                        "grid-column": "1/2",
                        "grid-row": "1/2",
                        "border-right": "none",
                        "background-color": "#eee",
                        "border-bottom": "solid #4da6ff 10px",
                        "align-items": "center",
                        display: "flex"
                    }), new WCssClass(`.App .AppMain`, {
                        "grid-column": "1/3",
                        "font-size": "11px"
                    }), new WCssClass(".AppFooter", {
                        "grid-column": "1/auto",
                        "background-color": "#eee",
                        "border-top": "solid #4da6ff 5px",
                        display: "none"
                    }), new WCssClass(`.App .AppHeader`, {
                        //"flex-direction": "column",
                        overflow: "hidden",
                        "font-size": "8px"
                    }), new WCssClass(`.App .AppHeader h1`, {
                        display: "none"
                    }), new WCssClass(".FooterNav", {
                        "grid-column": "1/3",
                        display: "flex",                        
                    }),
                ]
            }]
        }
    };
}
class headerClass {
    constructor() {
        this.type = "header";
        this.props = { className: "AppHeader" }
        this.children = [
            this.Style,
            { type: 'img', props: { src: "./Media/logoSG.png" } },
            WRender.CreateStringNode("<h1>SummonersWar Proyect</h1>"),
            { type: 'img', props: { src: "./Media/logoSW.png" } }
        ];
    }
    Style = {
        type: "w-style",
        props: {
            ClassList: [
                new WCssClass(".AppHeader", {
                    display: "flex",
                    "justify-content": "right",
                    "align-items": "center",
                    padding: "0px 40px"
                }), new WCssClass(".AppHeader h1", {
                    color: "#444",
                    width: "100%",
                    "text-align": "center",
                }), new WCssClass(".AppHeader img", {
                    display: "block",
                    height: "100%"
                }),
            ]
        }
    };
}
class AsideClass {
    constructor() {
        this.type = "aside";
        this.props = { className: "AppAside" }
        this.children = [this.#WNav];
    }
    #WNav = {
        type: "w-app-navigator",
        props: {
            Direction: "column", id: "AppNav",
            title: "Menu",
            Elements: [
                {
                    name: "Home", url: "#",
                    action: (ev) => {
                        DOMManager.NavigateFunction("HomeClass", new HomeClass(), "AppMain");
                    }
                },
                {
                    name: "Guides", url: "#",
                    action: (ev) => {
                        DOMManager.NavigateFunction("Guides", new Guides(), "AppMain");
                    }
                }, {
                    name: "Monsters List", url: "#",
                    action: (ev) => {
                        DOMManager.NavigateFunction("MonsterList", new MonsterListView(), "AppMain");
                    }
                },
                {
                    name: "RTA Picks", url: "#",
                    action: (ev) => {
                        DOMManager.NavigateFunction("RtaPicks", new MonsterRTAPicks(), "AppMain");
                    }
                }, {
                    name: "RTA TierList", url: "#",
                    action: (ev) => {
                        DOMManager.NavigateFunction("RtaTIERList", new RTATierList(), "AppMain");
                    }
                }, {
                    name: "RTA Comps", url: "#",
                    action: (ev) => {
                        DOMManager.NavigateFunction("RTACompsView", new RTACompsView(), "AppMain");
                    }
                }, {
                    name: "Guild/Siege Comps", url: "#",
                    action: (ev) => {
                        DOMManager.NavigateFunction("SiegCompsView", new SiegCompsView(), "AppMain");
                    }
                }, {
                    name: "Share Build", url: "#",
                    action: (ev) => {
                        DOMManager.NavigateFunction("ShareBuildsView", new ShareBuildsView(), "AppMain");
                    }
                },  {
                    name: "Info", url: "#",
                    action: (ev) => {
                        DOMManager.NavigateFunction("InfoView", new InfoView(), "AppMain");
                    }
                },{
                    name: "RTA ETL", url: "#",
                    action: (ev) => {
                        DOMManager.NavigateFunction("RtaETL", new MonsterETL(), "AppMain");
                    }
                }
            ]
        }
    }
}
class MainClass {
    constructor() {
        this.type = "main";
        this.props = { className: "AppMain", id: "AppMain" }
        this.children = [
            // new Guides(),
            new HomeClass(this.ImgData)
        ];
    }
    ImgData = [
        {
            src: "./Media/Img/wall2.jpg", title: "Guides", action: () => {
                DOMManager.NavigateFunction("GuidesView", new Guides(), "AppMain");
            }
        },
        {
            src: "./Media/Img/wall12.jpg", title: "Monster List", action: () => {
                DOMManager.NavigateFunction("MonsterList", new MonsterListView(), "AppMain");
            }
        },
        {
            src: "./Media/Img/wall1.jpg", title: "RTA Picks", action: () => {
                DOMManager.NavigateFunction("RtaPicks", new MonsterRTAPicks(), "AppMain");
            }
        },
        {
            src: "./Media/Img/wall3.jpg", title: "RTA TierList", action: () => {
                DOMManager.NavigateFunction("RtaTIERList", new RTATierList(), "AppMain");
            }
        },
        {
            src: "./Media/Img/wall14.jpg", title: "RTA Comps", action: () => {
                DOMManager.NavigateFunction("RTACompsView", new RTACompsView(), "AppMain");
            }
        },
        {
            src: "./Media/Img/wall5.jpg", title: "Guild/Siege Comps", action: () => {
                DOMManager.NavigateFunction("SiegCompsView", new SiegCompsView(), "AppMain");
            }
        },
        {
            src: "./Media/Img/wall13.jpg", title: "Share Build", action: () => {
                DOMManager.NavigateFunction("ShareBuildsView", new ShareBuildsView(), "AppMain");
            }
        },
    ]
}
class FooterClass {
    constructor() {
        this.type = "footer";
        this.props = { className: "AppFooter" }
        this.children = [this.Style,
        { type: 'label', props: { innerText: "All rights reserved -" } },
        {
            type: 'label', props: {
                innerText: "Wilber Jose Matus G (SeyferXx)",
                //href: "https://github.com/Wilber1987/WExpDev.git", target: "_blank"
            }
        }
        ];
    }
    Style = {
        type: "w-style",
        props: {
            ClassList: [
                new WCssClass(".AppFooter", {
                    display: "flex",
                    "justify-content": "center",
                    "align-items": "center",
                }), new WCssClass(".AppFooter label", {
                    margin: "0px 5px",
                    "font-size": "12px"
                })
            ]
        }
    };
}
class FooterNavigator extends ComponentsManager {
    constructor() {
        super();
        this.props = {
            class: "FooterNav"
        };
    }
    type = "div";
    style = {
        type: 'w-style', props: {
            id: '', ClassList: [
                new WCssClass(".FooterNav", {
                    display: "flex",
                    "justify-content": " space-between",
                    "box-shadow": "0 2px 5px 2px rgba(0,0,0,0.5)",
                    overflow: "hidden",
                    padding: "10px 30px"
                }),
                new WCssClass(`.FooterNav img`, {
                   height: 50,
                   width: 50,
                   opacity: "0.6"
                })
            ]
        }
    }
    icons = {
        home: "data:image/png;base64,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",
        doc: "data:image/png;base64,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",
        info: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAMAAADDpiTIAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAASv2AAEr9gHm/AkHAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAvpQTFRF////AwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEweEmswAAAP10Uk5TAAECAwQFBgcICQoL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"
    }
    children = [this.style,
    {
        type: 'img', props: {
            src: this.icons.home, class: 'className', onclick: async () => {
                DOMManager.NavigateFunction("HomeClass", new HomeClass(), "AppMain");
            }
        }
    }, {
        type: 'img', props: {
            src: this.icons.doc, class: 'className', onclick: async () => {
                //code.....
            }
        }
    }, {
        type: 'img', props: {
            src: this.icons.info, class: 'className', onclick: async () => {
                DOMManager.NavigateFunction("InfoView", new InfoView(), "AppMain");
            }
        }
    }];
}
export { MasterDomClass };