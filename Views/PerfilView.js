import { ComponentsManager, WAjaxTools, WRender, WArrayF } from "../WDevCore/WModules/WComponentsTools.js";
import { WCssClass } from "../WDevCore/WModules/WStyledRender.js";
import "../WDevCore/WComponents/WTableComponents.js";

class PerfilView {
    constructor(UserSeasonParam = {}) {
        this.MyLoginData = UserSeasonParam;
        this.type = "div";
        const Info = ``;
        this.props = { id: "DocClass", className: "DocClass DivContainer", innerHTML: Info }
        this.children = [
            this.Style,
            {
                type: 'h1', props: { id: "", class: "" },
                children: ["Mi Perfil"]
            }
        ];
        this.children.push({
            type: "div", props: { class: "perfilContainer" }, children: [
                {
                    type: 'img', props: {
                        src: "data:image/png;base64," + this.MyLoginData.Photo,
                        class: "imgPhoto"
                    }
                },
                { type: 'label', props: { innerText: "Usuario: " + this.MyLoginData.Username } },
                { type: 'label', props: { innerText: "Nombres: " + this.MyLoginData.Name } },
                { type: 'label', props: { innerText: "Apellidos: " + this.MyLoginData.LastName } },
                { type: 'label', props: { innerText: "Correo: " + this.MyLoginData.Mail } },
            ]
        })

    }
    Style = {
        type: "w-style",
        props: {
            ClassList: [
                new WCssClass(".perfilContainer", {
                    display: "flex",                   
                    overflow: "hidden",
                }),new WCssClass(".perfilContainer label", {
                    margin: 5,
                    "font-size": 12
                }), new WCssClass(".DocClass", {
                    //display: "flex",
                    "text-align": "justify",
                    overflow: "hidden"
                }), new WCssClass(".imgPhoto", {
                    width: "200px",
                    height: "200px",
                    "object-fit": "cover",
                    "border-radius": "0.3cm",
                    "box-shadow": "0 2px 5px 0 rgb(0 0 0 / 30%)"
                }),
            ], MediaQuery: [{
                condicion: "(max-width: 600px)",
                ClassList: [
                    new WCssClass(".perfilContainer", {
                       "flex-direction": "column"
                    })
                ]
            }]
        }
    };
}
export { PerfilView }
