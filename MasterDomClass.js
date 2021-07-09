import { ComponentsManager, WAjaxTools, WRender } from "./WDevCore/WModules/WComponentsTools.js";
import { WCssClass } from "./WDevCore/WModules/WStyledRender.js";
import "./WDevCore/WComponents/WAppNavigator.js";
import {HomeClass} from "./Views/Home.js";
import MonsterListView from "./Views/MonsterListView.js";
import MonsterETL from "./Views/MonsterETL.js";
import MonsterRTAPicks from "./Views/MonsterRTAPicks.js";
import RTATierList from "./Views/RTATierList.js";
import RTACompsView from "./Views/RTAComps.js";
import ShareBuildsView from "./Views/ShareBuild.js";
import SiegCompsView from "./Views/GuildSiegeComps.js";

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
            this.MasterStyle
        ];
    }
    MasterStyle = {
        type: "w-style",
        props: {
            ClassList: [
                new WCssClass(".App", {
                    display: "grid",
                    "grid-template-columns": "250px calc(100% - 250px)",
                    "grid-template-rows": "70px calc(100vh - 120px) 50px"
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
                }),
            ], MediaQuery: [{
                condicion: "(max-width: 1400px)",
                ClassList: [
                    new WCssClass(`.App`, {
                        display: "grid",
                        "grid-template-columns": "0px calc(100% - 0px)",
                        "grid-template-rows": "70px calc(100vh - 120px) 50px"
                    }), new WCssClass(".AppAside", {
                        overflow: "hidden"
                    }),
                ]
            }, {
                condicion: "(max-width: 600px)",
                ClassList: [
                    new WCssClass(`.App`, {
                        display: "grid",
                        "grid-template-columns": "100%",
                        "grid-template-rows": "70px auto calc(100vh - 160px) 50px"
                    }), new WCssClass(".AppHeader", {
                        "grid-column": "1/auto",
                        "background-color": "#eee",
                        "border-bottom": "solid #4da6ff 10px",
                    }), new WCssClass(".AppAside", {   
                        "border-bottom": "solid #999 1px",
                    }),new WCssClass(".AppFooter", {
                        "grid-column": "1/auto",
                        "background-color": "#eee",
                        "border-top": "solid #4da6ff 5px"
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
            WRender.CreateStringNode("<h1>SeyferGames Proyect</h1>")
            //{ type: 'img', props: { src: "./Media/logo.png" } },
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
                }),new WCssClass(".AppHeader img", {
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
                },{
                    name: "RTA TierList", url: "#",
                    action: (ev) => {
                        DOMManager.NavigateFunction("RtaTIERList", new RTATierList(), "AppMain");
                    }
                },{
                    name: "RTA Comps", url: "#",
                    action: (ev) => {
                        DOMManager.NavigateFunction("RTACompsView", new RTACompsView(), "AppMain");
                    }
                },{
                    name: "Guild/Siege Comps", url: "#",
                    action: (ev) => {
                        DOMManager.NavigateFunction("SiegCompsView", new SiegCompsView(), "AppMain");
                    }
                },{
                    name: "Share Build", url: "#",
                    action: (ev) => {
                        DOMManager.NavigateFunction("ShareBuildsView", new ShareBuildsView(), "AppMain");
                    }
                }, {
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
            //new ShareBuildsView(),
            new HomeClass(this.ImgData)          
        ];
    }
    ImgData = [
        { src: "./Media/Img/wall12.jpg", title: "Monster List", action: ()=>{
            DOMManager.NavigateFunction("MonsterList", new MonsterListView(), "AppMain");
        }},
        { src: "./Media/Img/wall1.jpg", title: "RTA Picks", action: ()=>{
            DOMManager.NavigateFunction("RtaPicks", new MonsterRTAPicks(), "AppMain");
        }},
        { src: "./Media/Img/wall5.jpg", title: "RTA TierList", action: ()=>{
            DOMManager.NavigateFunction("RtaTIERList", new RTATierList(), "AppMain");
        }},
        { src: "./Media/Img/wall14.jpg", title: "RTA Comps", action: ()=>{
            DOMManager.NavigateFunction("RTACompsView", new RTACompsView(), "AppMain");
        }},
        { src: "./Media/Img/wall3.jpg", title: "Guild/Siege Comps", action: ()=>{
            DOMManager.NavigateFunction("SiegCompsView", new SiegCompsView(), "AppMain");
        }},
        { src: "./Media/Img/wall13.jpg", title: "Share Build", action: ()=>{
            DOMManager.NavigateFunction("ShareBuildsView", new ShareBuildsView(), "AppMain");
        }},
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
                }),new WCssClass(".AppFooter label", {
                    margin: "0px 5px",
                    "font-size": "12px"
                })
            ]
        }
    };
}
class MyNavigator extends ComponentsManager {
    constructor(props) {
        super();
        this.props = props;
    }
    type = "div";
    children = [{
        type: "ul",
        children: [{
            type: "li",
            props: {
                onclick: () => {
                    this._DispalNav("MyLateralNav", "SlideLeft");
                }
            },
            children: [{ type: "a", props: { href: "#" }, children: ["Perfil"] }]
        },
        {
            type: "li",
            props: {
                onclick: () => {
                    this._DispalNav("MyLateralNav", "SlideLeft");
                }
            },
            children: [{ type: "a", props: { href: "#" }, children: ["Notificaciones"] }]
        },
        {
            type: "li",
            props: {
                onclick: () => {
                    this._DispalNav("MyLateralNav", "SlideLeft");
                }
            },
            children: [{ type: "a", props: { href: "#" }, children: ["Mensajes"] }]
        },
        {
            type: "li",
            props: {
                onclick: () => {
                    this._DispalNav("MyLateralNav", "SlideLeft");
                }
            },
            children: [{ type: "a", props: { href: "#" }, children: ["Cerrar Sesión"] }]
        },
        ]
    }];
}
class FooterNavigator extends ComponentsManager {
    constructor(props) {
        super();
        this.props = props;
    }
    type = "div";
    children = [{
        type: "ul",
        children: [{
            type: "li",
            props: {
                onclick: async () => {
                    const { Modules } = await
                        import("./Views/Modules.js.js");
                    this.NavigateFunction("Modules", new Modules({ class: "DivContainer", id: "Modules", Foros: Foros }));
                }
            },
            children: [{
                type: "button",
                props: {
                    type: "button",
                    style: `background: url('./Media/icons/modules2.png') no-repeat;background-size: 100% 100%;`
                }
            }]
        },
        {
            type: "li",
            props: {
                onclick: async () => {
                    const { ForosView } = await
                        import("./Views/ForosView.js.js");
                    let MyModules = await WAjaxTools.PostRequest("http://localhost:6601/" + 'api/User/PostTakeUsers', { IdUsers: 1 });
                    // let OModules = await WAjaxTools.PostRequest("http://localhost:6601/" + 'api/module/PostModules', { IdUsers: 1 });
                    this.NavigateFunction("ForosView", new ForosView({
                        class: "DivContainer DivSection", id: "ForosView", Users: MyModules
                    }));
                }
            },
            children: [{
                type: "button",
                props: {
                    type: "button",
                    style: `background: url('./Media/icons/foro2.png') no-repeat;background-size: 100% 100%;`
                }
            }]
        },
        {
            type: "li",
            props: {
                onclick: async () => {
                    const { ReportView } = await
                        import("./Views/ReportView.js.js");
                    this.NavigateFunction("ReportView", new ReportView({ class: "DivContainer DivSection", id: "ReportView" }));
                }
            },
            children: [{
                type: "button",
                props: {
                    type: "button",
                    style: `background: url('./Media/icons/bar.png') no-repeat;background-size: 100% 100%;`
                }
            }]
        }
        ]
    }];
}
export { MasterDomClass };