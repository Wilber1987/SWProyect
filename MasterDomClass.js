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
import { InfoView } from "./Views/InfoView.js";
import { PerfilView } from "./Views/PerfilView.js";
import ForosView from "./Views/ForosView.js";
import { WSecurity } from "./WDevCore/WModules/WSecurity.js";
import "./WDevCore/WComponents/WLoginTemplate.js";
//const Auth = new WSecurity();
const DOMManager = new ComponentsManager({ SPAManage: true });
class MainClass {
    constructor() {
        this.type = "main";
        this.props = { className: "AppMain", id: "AppMain" }
        this.children = [
            //new RTATierList(),
            //new RTACompsView(),
            //new ForosView(),
            //new HomeClass(this.ImgData)
        ];
    }
}
class MasterDomClass extends ComponentsManager {
    constructor() {
        super();
        this.props = { className: "App" }
        this.children = [
            WRender.Create({
                className: "AppLogo", children: [
                    { tagName: 'img', src: "./Media/logoSG.png" }
                ]
            }),
            new headerClass(),
            new AsideClass(),
            new MainClass(),
            //new FooterClass(),
            new FooterNavigator(),
            this.MasterStyle,
        ];
    }
    MasterStyle = {
        type: "w-style",
        props: {
            ClassList: [
                new WCssClass("body", {
                    padding: "0px",
                    margin: "0px",
                    "font-family": "Arial, Helvetica, sans-serif",
                }), new WCssClass(".App", {
                    display: "grid",
                    "grid-template-columns": "250px calc(100% - 250px)",
                    "grid-template-rows": "70px calc(100vh - 70px)",
                    color: "#fff",
                    width: "100%"
                }), new WCssClass(".AppLogo", {
                    display: "flex",
                    padding: 10,
                    "background-color": "#121518",
                    "align-items": "center", "justify-content": "center",
                    "border-bottom": "solid 5px #4da6ff"
                }), new WCssClass(".AppLogo img", {
                    display: "block",
                    height: "100%"
                }), new WCssClass(".AppHeader", {
                    "background-color": "#121518",
                    "border-bottom": "solid 5px #4da6ff"
                }), new WCssClass(".AppAside", {
                    "background-color": "#121518",
                }), new WCssClass(".AppMain", {
                    overflow: "auto",
                    padding: "20px",
                    background: "#23282e"
                }), new WCssClass(".FooterNav", {
                    "grid-column": "1/3",
                    display: "none",
                }),
            ], MediaQuery: [{
                condicion: "(max-width: 600px)",
                ClassList: [
                    new WCssClass(`.App`, {
                        display: "grid",
                        "grid-template-columns": "100px calc(100% - 100px)",
                        "grid-template-rows": "70px  calc(100% - 120px) 50px",
                        position: "fixed",
                        top: 0,
                        bottom: 0
                    }), new WCssClass(".AppLogo", {
                        "align-items": "center", "justify-content": "left"
                    }), new WCssClass(`.AppMain`, {
                        "grid-column": "1/3",
                        "font-size": "11px"
                    }), new WCssClass(".AppAside", {
                        "grid-column": "1/2",
                        "grid-row": "1/2",
                        "border-right": "none",
                        "align-items": "center",
                        "border-bottom": "solid 5px #4da6ff",
                        display: "flex"
                    }), new WCssClass(".AppHeader", {
                        display: "none"
                    }), new WCssClass(".FooterNav", {
                        "grid-column": "1/3",
                        display: "flex",
                        "background-color": "#121518",                       
                    }), new WCssClass(`.FooterNav img`, {
                        height: 30,
                        width: 30,
                        opacity: "0.9",
                        filter: "invert(90%)"
                    })
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
            WRender.CreateStringNode("<h1>SummonersWar Proyect</h1>"),
            //{ type: 'img', props: { src: "./Media/logoSW.png" } }
        ];
    }
    Style = {
        type: "w-style",
        props: {
            ClassList: [
                new WCssClass(".AppHeader", {
                    padding: 20,
                    display: "flex",
                    "justify-content": "left",
                    "align-items": "center",
                    padding: "0px 40px"
                }), new WCssClass(".AppHeader h1", {
                    color: "#4da6ff",
                    "font-weight": "200",
                    "text-align": "center",
                    "font-size": 20
                })
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
            Inicialize: true,
            DarkMode: true,
            Elements: [
                {
                    name: "Home", url: "#",
                    action: (ev) => {
                        DOMManager.NavigateFunction("HomeClass", new HomeClass(ImgData), "AppMain");
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
                }, {
                    name: "Info", url: "#",
                    action: (ev) => {
                        DOMManager.NavigateFunction("InfoView", new InfoView(), "AppMain");
                    }
                }, /* {
                    name: "Foro", url: "#",
                    action: (ev) => {
                        DOMManager.NavigateFunction("ForosView", new ForosView(), "AppMain");
                    }
                }, */ {
                    name: "RTA ETL", url: "#",
                    action: (ev) => {
                        DOMManager.NavigateFunction("RtaETL", new MonsterETL(), "AppMain");
                    }
                }
            ]
        }
    }
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
                    height: 30,
                    width: 30,
                    opacity: "0.6"
                })
            ]
        }
    }
    icons = {
        home: "data:image/png;base64,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",
        perfil: "data:image/png;base64,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",
        foro: "data:image/png;base64,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",
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
            src: this.icons.foro, class: 'className', onclick: async () => {
                DOMManager.NavigateFunction("ForosView", new ForosView(), "AppMain");
            }
        }
    }, {
        type: 'img', props: {
            src: this.icons.perfil, class: 'className', onclick: async () => {
                if (!WSecurity.Auth()) {
                    WSecurity.LoginIn();
                    return;
                }
                DOMManager.NavigateFunction("PerfilView", new PerfilView(WSecurity.User()), "AppMain");
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
const ImgData = [
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
export { MasterDomClass };