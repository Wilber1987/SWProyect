import { ComponentsManager, WAjaxTools, WArrayF, WRender } from "../WDevCore/WModules/WComponentsTools.js";
import { WCssClass } from "../WDevCore/WModules/WStyledRender.js";
import "../WDevCore/WComponents/WTableComponent.js";
import "../WDevCore/WComponents/WFilterControls.js";

export default class SiegCompsView extends HTMLElement {
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
        this.shadowRoot.append(WRender.CreateStringNode("<h2>COMING SOON!!!</h2>"));
        this.shadowRoot.append(WRender.createElement(this.Style));
    }


    Style = {
        type: "w-style",
        props: {
            ClassList: [
                new WCssClass(".DocumentView", {
                    height: "100%",
                }), new WCssClass(".DataContainer", {
                    display: "flex",
                    width: "100%",
                }), new WCssClass(".DataContainer div", {
                    margin: "10px",
                    "justify-content": "center",
                    "align-items": "center",
                    display: "flex"
                }), new WCssClass(".DataContainer select", {
                    padding: "10px"
                }), new WCssClass(".bannerImg", {
                    width: "100%",
                    "box-shadow": "0 2px 5px 0 rgb(0 0 0 / 30%)",
                    "object-fit": "cover",
                    height: "200px",
                }), new WCssClass("h2", {
                    margin: "0px",
                    color: "#999"
                }),
            ], MediaQuery: [{
                condicion: '(max-width: 600px)',
                ClassList: [
                    new WCssClass(".DataContainer", {
                        "flex-direction": "column",
                    })
                ]
            }]
        }
    };
}
customElements.define("w-siege-comps", SiegCompsView);

