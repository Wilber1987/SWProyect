import { ComponentsManager, WAjaxTools, WArrayF, WRender } from "../WDevCore/WModules/WComponentsTools.js";
import { WCssClass } from "../WDevCore/WModules/WStyledRender.js";
import "../WDevCore/WComponents/WTableComponent.js";
import "../WDevCore/WComponents/WFilterControls.js";

const DOMManager = new ComponentsManager();
const URLApiPath = "./API/Guides.php";
const PdfPath = "./Media/Docs";
const ImgPath = "./Media/GuidesImg/";
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
        this.append(this.GuideNav);
        this.append(WRender.createElement({
            type: 'div',
            props: { id: 'MainGuides', class: 'className' },
            children: []
        }));
        this.DataGuides = await WAjaxTools.GetRequest("../DataBase/Guides/GuideList.json");
        this.GuideNav.InitialNav()
    }
    GuideNav = WRender.createElement({
        type: "w-app-navigator",
        props: {
            NavStyle: "tab",
            id: "GuidesNav",
            title: "Menu",
            Elements: [
                {
                    name: "Cairos Dungeon", url: "#",
                    action: async (ev) => {
                        const DataGuideIn = this.DataGuides.filter(d => d.categ == "Initial" && d.place == "Cairos");
                        const DataGuideAd = this.DataGuides.filter(d => d.categ == "Advanced" && d.place == "Cairos");
                        DOMManager.NavigateFunction("Cairos", new GuidesContainer(DataGuideIn, DataGuideAd), "MainGuides");
                    }
                },
                {
                    name: "Rift of Worlds", url: "#",
                    action: async (ev) => {
                        const DataGuideIn = this.DataGuides.filter(d => d.categ == "Initial" && d.place == "RW");
                        const DataGuideAd = this.DataGuides.filter(d => d.categ == "Advanced" && d.place == "RW");
                        DOMManager.NavigateFunction("Rift", new GuidesContainer(DataGuideIn, DataGuideAd), "MainGuides");
                    }
                }, {
                    name: "TOA", url: "#",
                    action: async (ev) => {
                        const DataGuideIn = this.DataGuides.filter(d => d.categ == "Initial" && d.place == "TOA");
                        const DataGuideAd = this.DataGuides.filter(d => d.categ == "Advanced" && d.place == "TOA");
                        DOMManager.NavigateFunction("TOA", new GuidesContainer(DataGuideIn, DataGuideAd), "MainGuides");
                    }
                },
                {
                    name: "Dimension Hole", url: "#",
                    action: async (ev) => {
                        const DataGuideIn = this.DataGuides.filter(d => d.categ == "Initial" && d.place == "DH");
                        const DataGuideAd = this.DataGuides.filter(d => d.categ == "Advanced" && d.place == "DH");
                        DOMManager.NavigateFunction("DH", new GuidesContainer(DataGuideIn, DataGuideAd), "MainGuides");
                    }
                }
            ]
        }
    });
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
    constructor(InitialGuides = [], AdvanceGuides = []) {
        //console.log(InitialGuides);
        //console.log(AdvanceGuides);
        this.type = "div"
        this.props = {
            className: "",
        }
        this.children = [this.Style];
        if (InitialGuides.length != 0) {
            const Label1 = { type: 'h3', props: { innerText: 'Initial Guides', class: 'className' } };
            const Intials = { type: 'div', props: { id: '', class: 'GuidesContainer' }, children: [] };
            InitialGuides.forEach(G => {
                Intials.children.push(this.GDiv(G));
            });
            this.children.push(Label1);
            this.children.push(Intials);
        }
        if (AdvanceGuides.length != 0) {
            const Label2 = { type: 'h3', props: { innerText: 'Avanced Guides', class: 'className' } };
            const Avanceds = { type: 'div', props: { id: '', class: 'GuidesContainer' }, children: [] };
            AdvanceGuides.forEach(G => {
                Avanceds.children.push(this.GDiv(G));
            });
            this.children.push(Label2);
            this.children.push(Avanceds);
        }
        if (AdvanceGuides.length == 0 && InitialGuides.length == 0) {
            this.children.push("No guides registered!");
        }
        this.ModalContainer = WRender.createElement({ type: 'div', props: { id: '', class: 'className' } })
        this.children.push(this.ModalContainer)

    }
    GDiv = (G) => {
        const GDiv = {
            type: 'div', props: { id: '', class: 'Guide' }, children: [
                { type: 'h4', props: { innerText: G.title } },
                { type: 'img', props: { src: ImgPath + G.img, class: 'className' } },
                //{ type: 'p', props: { innerText: G.description } },
                {
                    type: 'input',
                    props: {
                        id: '', type: 'button', value: "View",
                        onclick: async () => {
                            this.ModalContainer.append(WRender.createElement({
                                type: "w-modal-form",
                                props: {
                                    ObjectModal: this.Navigate(G.doc),
                                    ShadowRoot: false,
                                    title: "Guide: " + G.title,
                                    StyleForm: "columnX3"
                                }
                            }));
                        }
                    }
                }
            ]
        };
        return GDiv;
    }
    Navigate = (pdf) => {
        const DocURL = "./Media/DOCS/" + pdf;
        //const DocURL = pdf;
        const PDF2 = WRender.createElement({
            type: "object", props: {
                type: "application/pdf",
                data: DocURL
            }
        });
        const iframe = WRender.createElement({
            type: "embed", props: {
                src: DocURL
            }
        });
        return [iframe, {
            type: 'w-style', props: {
                id: '', ClassList: [
                    new WCssClass(`embed`, {
                        width: "100%",
                        "min-height": "600px",
                        //"height": "calc(100% - 50px)"
                    }),
                ]
            }
        }];
    }
    Style = {
        type: "w-style",
        props: {
            ClassList: [
                new WCssClass(".GuidesContainer", {
                    display: "grid",
                    "grid-template-columns": "30% 30% 30%"
                }), new WCssClass(".GuidesContainer .Guide", {
                    display: "flex",
                    "flex-direction": "column",
                    margin: "5px",
                    position: "relative",
                    overflow: "hidden",
                    "border-radius": "0.2cm",
                    "box-shadow": "0 2px 5px 2px rgba(0,0,0,0.2)"
                }), new WCssClass(".GuidesContainer h4", {
                    position: "absolute",
                    color: "#fff",
                    "background-color": "rgba(0,0,0,0.5)",
                    padding: "10px"
                }), new WCssClass(".GuidesContainer input", {
                    color: "#fff",
                    "background-color": "#4da6ff",
                    padding: "10px",
                    border: "none",
                    cursor: "pointer"
                }), new WCssClass(".GuidesContainer p", {
                    padding: "10px",
                    margin: "0px"
                }),
            ], MediaQuery: [{
                condicion: '(max-width: 1200px)',
                ClassList: [
                    new WCssClass(".GuidesContainer", {
                        "grid-template-columns": "50% 50%"
                    }),
                ]
            }]
        }
    };
}
customElements.define("w-guide", Guides);

