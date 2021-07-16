import { ComponentsManager, WAjaxTools, WArrayF, WRender } from "../WDevCore/WModules/WComponentsTools.js";
import { WCssClass } from "../WDevCore/WModules/WStyledRender.js";
import "../WDevCore/WComponents/WTableComponents.js";
import "../WDevCore/WComponents/WFilterControls.js";

const DOMManager = new ComponentsManager();
export default class Guides extends HTMLElement {
    constructor() {
        super();
        //this.attachShadow({ mode: "open" });
        this.className = "DocumentView";
        this.SelectedSeason = 0;
    }
    connectedCallback() {
        if (this.innerHTML != "") {
            return;
        }
        this.DrawComponent();
    }
    DrawComponent = async () => {
        this.append(WRender.createElement(this.GuideNav));
        this.append(WRender.createElement({
            type: 'div',
            props: { id: 'MainGuides', class: 'className' },
            children: []
        }));
    }
    GuideNav = {
        type: "w-app-navigator",
        props: {
            NavStyle: "tab",
            id: "AppNav",
            title: "Menu",
            Elements: [
                {
                    name: "Cairos Dungeon", url: "#",
                    action: (ev) => {
                        DOMManager.NavigateFunction("Cairos", new GuidesContainer(), "MainGuides");
                    }
                },
                {
                    name: "Rift of Worlds", url: "#",
                    action: (ev) => {
                        DOMManager.NavigateFunction("Rift", new GuidesContainer(), "MainGuides");
                    }
                }, {
                    name: "TOA", url: "#",
                    action: (ev) => {
                        DOMManager.NavigateFunction("TOA", new GuidesContainer(), "MainGuides");
                    }
                },
                {
                    name: "Dimension Hole", url: "#",
                    action: (ev) => {
                        DOMManager.NavigateFunction("DH", new GuidesContainer(), "MainGuides");
                    }
                }
            ]
        }
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
class GuidesContainer {
    constructor(TierData = [], TierScore = {}, Parent) {
        this.props = {
            className: "GuidesContainer",
        }
        const Label1 = { type:'h2', props: { innerText: 'Initial Guides', class: 'className'}};
        const Intials = { type:'div', props: { id: '', class: 'className'}, children:[]};
        const Label2 = { type:'h2', props: { innerText: 'Avanced Guides', class: 'className'}};
        const Avanceds = { type:'div', props: { id: '', class: 'className'}, children:[]};
        this.children = [
            Label1,
            Intials,
            Label2,
            Avanceds,
        ];
    }
    Style = {
        type: "w-style",
        props: {
            ClassList: [
                new WCssClass(".GuidesContainer", {
                   
                }),
            ], MediaQuery: [{
                condicion: '(max-width: 600px)',
                ClassList: [
                    new WCssClass(".GuidesContainer", {
                       
                    }),
                ]
            }]
        }
    };
}
customElements.define("w-guide", Guides);

