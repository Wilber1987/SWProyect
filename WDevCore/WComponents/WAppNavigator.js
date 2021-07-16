import { WRender, ComponentsManager } from "../WModules/WComponentsTools.js";
import { WCssClass } from "../WModules/WStyledRender.js";
import { WIcons } from "../WModules/WIcons.js";
class WAppNavigator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }
    attributeChangedCallBack() {
        this.DrawAppNavigator();
    }
    connectedCallback() {
        if (this.shadowRoot.innerHTML != "") {
            return;
        }
        if (this.id == undefined) {
            const Rand = Math.random();
            this.id = "Menu" + Rand;
        }
        this.DrawAppNavigator();
    }
    ActiveMenu = (ev) => {
        this.shadowRoot.querySelectorAll("label.elementNavActive").forEach(elementNavActive => {
            elementNavActive.className = "elementNav";
        });
        this.shadowRoot.querySelectorAll("h4.elementNavActive").forEach(elementNavActive => {
            elementNavActive.className = "elementNavMedia";
        });
        ev.target.className =  "elementNavActive";
        if ( this.NavStyle != "tab") {
            this.shadowRoot.querySelector("#MainNav").className = "navInactive";
        }        
    }
    DrawAppNavigator() {
        this.shadowRoot.append(WRender.createElement(this.Style()));
        if (this.NavStyle == undefined) {
            this.NavStyle = "nav";
        }
        if (this.NavStyle == "nav") {
            const header = {
                type: "header", props: {
                    onclick: () => {
                        const nav = this.shadowRoot.querySelector("#MainNav");
                        if (nav.className == "navActive") {
                            nav.className = "navInactive";
                        } else {
                            nav.className = "navActive";
                        }
                    }
                }, children: [{
                    type: "img", props: {
                        src: WIcons.Menu ,
                        class: "DisplayBtn",
                    }, children: []
                }]
            }
            if (typeof this.title === "string") {
                header.children.push({
                    type: "label", props: { class: "title", innerText: this.title }
                });
            }
            this.shadowRoot.appendChild(WRender.createElement(header));
        }
        
        
        if (this.Elements == undefined) {
            this.Elements = [];
        }
       
        const Nav = { type: "nav", props: { id: "MainNav", className: this.NavStyle }, children: [] };
        this.Elements.forEach((element, Index) => {
            if (element.url == undefined) {
                element.url = "#" + this.id;
            }
            const elementNav = {
                type: "a",
                props: { class: "",  href: element.url },
                children: [  {
                    type: "label",
                    props: { class: "elementNav", innerText: element.name },
                },  {
                    type: "h4",
                    props: { class: "elementNavMedia", innerText: element.name.charAt(0) },
                } ]
            }
            elementNav.props.onclick = async (ev) => {
                this.ActiveMenu(ev);
                if (element.action != undefined) {
                    element.action(ev);
                }
            }
            Nav.children.push(elementNav);
            if (element.SubNav != undefined) {
                elementNav.href = null;
                const SubMenuId = "SubMenu" + Index + this.id;
                const SubNav = {
                    type: "section",
                    props: {
                        id: SubMenuId,  href: element.url,  className: "UnDisplayMenu"
                    },
                    children: []
                }
                if (element.SubNav.Elements != undefined) {
                    element.SubNav.Elements.forEach(SubElement => {
                        SubNav.children.push({
                            type: "a",
                            props: {
                                innerText: SubElement.name, href: SubElement.url,
                                onclick: async (ev) => {
                                    if (SubElement.action != undefined) {
                                        SubElement.action(ev);
                                    }
                                }
                            }
                        });
                    });
                    elementNav.props.onclick = (ev) => {
                        this.ActiveMenu(ev);
                        const MenuSelected = this.shadowRoot.querySelector("#" + SubMenuId);
                        if (MenuSelected.className == "UnDisplayMenu") {
                            MenuSelected.className = "DisplayMenu"
                        } else {
                            MenuSelected.className = "UnDisplayMenu"
                        }
                    }
                    Nav.children.push(SubNav);
                }
            }            
        });
        
        this.shadowRoot.append(WRender.createElement(Nav));        
    }
    Style() {
        const style = this.querySelector("#NavStyle" + this.id);
        if (style) {
            style.parentNode.removeChild(style);
        }
        let navDirection = "row";
        if (this.Direction == "column") {
            navDirection = "column";
        }
        const Style = {
            type: "w-style",
            props: {
                id: "NavStyle" + this.id,
                ClassList: [
                    new WCssClass(`.nav, .navInactive`, {
                        display: "flex",
                        "flex-direction": navDirection,
                        padding: "0px 10px",
                        transition: "all 1s",
                    }), new WCssClass(`.tab`, {
                        display: "flex",
                        "flex-direction": navDirection,
                        //padding: "0px 10px",
                        transition: "all 1s",
                        "justify-content": "center"
                    }), new WCssClass(`.tab .elementNavActive`, {
                        "border-top": "solid 1px #dedddd",
                        "border-left": "solid 1px #dedddd",
                        "border-right": "solid 1px #dedddd",
                        "border-radius": "0.1cm",
                    }), new WCssClass(`a`, {
                        "text-decoration": "none",                        
                        cursor: "pointer"
                    }), new WCssClass(`.elementNav`, {
                        "text-decoration": "none",
                        color: "#444444",
                        padding: "10px",
                        "border-bottom": "solid 2px #eee",
                        transition: "all 0.6s",
                        display: "flex", "align-items": "center",
                        cursor: "pointer"
                    }), new WCssClass(`.elementNavActive`, {
                        "text-decoration": "none",
                        color: "#444444",
                        padding: "10px",
                        "border-bottom": "solid 2px #4da6ff",
                        transition: "all 0.6s",
                        display: "flex", "align-items": "center",
                    }),new WCssClass(`h4.elementNavActive`, {
                        display: "none", 
                    }), new WCssClass(`.elementNav:hover`, {
                        "border-bottom": "solid 2px #444444"
                    }), new WCssClass(`header`, {
                        display: "flex",
                        "align-items": "center",
                        "justify-content": "left",
                        "box-shadow": "0 1px 1px 0 rgba(0,0,0,0.3)"
                    }),
                    new WCssClass(`.title`, {
                        "font-size": "1.1rem",
                        padding: "10px",
                        color: "#888888",
                        cursor: "pointer"
                    }),
                    //Estilos de submenu
                    new WCssClass(` .UnDisplayMenu`, {
                        overflow: "hidden",
                        "max-height": "0px",
                    }), new WCssClass(` .DisplayMenu`, {
                        overflow: "hidden",
                        "padding-left": "10px",
                        "max-height": "1000px",
                        display: "flex",
                        "flex-direction": "column"
                    }), new WCssClass(`a`, {
                        "text-decoration": "none",                        
                        color: "#8e8e8e",
                        //padding: "10px",
                    }),
                    //ocultacion. 
                    new WCssClass(`.DisplayBtn`, {                       
                        margin: "10px",
                        display: "none",                           
                        height: "15px", width:  "15px", 
                        cursor: "pointer"
                    }), new WCssClass(`.navActive`, {
                        overflow: "hidden",
                        "max-height": "5000px"
                    }),new WCssClass(`.elementNavMedia`, {
                        display: "none",
                        
                    })
                ],
                MediaQuery: [{
                    condicion: "(max-width: 1200px)",
                    ClassList: [
                        // new WCssClass(`.elementNav`, {
                        //     display: "none",
                        // }),new WCssClass(`.elementNavMedia` , {
                        //     display: "block",
                        //     "font-size": "26px",                        
                        //     "text-align": "center",
                        //     padding: "10px",
                        //     "text-decoration": "none",
                        //     "font-weight": "bold",
                        //     cursor: "pointer",
                        //     "border-bottom": "solid 2px #eee",
                        //     margin: "0px"
                        // }),  new WCssClass(`.elementNavActive` , {
                        //     display: "block",
                        //     "font-size": "26px",                        
                        //     "text-align": "center",
                        //     padding: "10px",
                        //     "text-decoration": "none",
                        //     "font-weight": "bold",
                        //     cursor: "pointer",
                        //     "border-bottom": "solid 2px #eee",
                        //     margin: "0px"
                        // }),  new WCssClass(`label.elementNavActive` , {
                        //     display: "none",
                        // })
                    ]
                },{
                    condicion: "(max-width: 800px)",
                    ClassList: [
                        new WCssClass(`.DisplayBtn`, {
                            display: "initial",
                        }),new WCssClass(`.nav`, {
                            "flex-direction": "column",
                            overflow: "hidden",
                            "max-height": "0px"
                        }), new WCssClass(`nav`, {
                           
                        }), new WCssClass(`.navActive`, {
                            overflow: "hidden",
                            "max-height": "5000px"
                        }),new WCssClass(`.navInactive`, {
                            overflow: "hidden",
                            "max-height": "0px",
                            transition: "all 0.6s",
                        }),
                    ]
                }]
            }
        }
        return Style;
    }
}
customElements.define("w-app-navigator", WAppNavigator);