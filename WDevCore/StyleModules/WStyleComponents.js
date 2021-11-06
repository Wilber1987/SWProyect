import { WRender, WArrayF, ComponentsManager, WAjaxTools } from "../WModules/WComponentsTools.js";
import { WCssClass } from "../WModules/WStyledRender.js";
//#region  GENERIC STYLESSS#####################################################################################
const StyleScrolls = {
    type: 'w-style', props: {
        id: '', ClassList: [
            new WCssClass("*::-webkit-scrollbar-thumb", {
                "background": " #ccc",
                "border-radius": " 4px",
            }), new WCssClass("*::-webkit-scrollbar-thumb:hover", {
                "background": " #b3b3b3",
                "box-shadow": " 0 0 3px 2px rgba(0, 0, 0, 0.2)",
            }), new WCssClass("*::-webkit-scrollbar-thumb:active ", {
                "background-color": " #999999",
            }), new WCssClass("*::-webkit-scrollbar ", {
                "width": " 8px",
                "height": " 10px",
                "margin": " 10px",
            }), new WCssClass("*::-webkit-scrollbar-track ", {
                "background": " #e1e1e1",
                "border-radius": " 4px",
            }),  new WCssClass("*::-webkit-scrollbar-track:active ,*::-webkit-scrollbar-track:hover", {
                "background": " #d4d4d4",
            })
        ]
    }
};
const StylesControlsV1 = {
    type: 'w-style', props: {
        id: '', ClassList: [
            //BOTONES
            new WCssClass(`.BtnAlert,.BtnPrimary, .BtnSuccess,.BtnSecundary,.Btn`, {
                "font-weight": "bold",
                "border": "none",
                "padding": "10px",
                "text-align": "center",
                "display": "inline-block",
                "min-width": "100px",
                "cursor": "pointer",
                "background-color": "#09f",
                "font-size": "12px",
                "color": "#fff",
                //"border-right": "rgb(3, 106, 175) 5px solid",
                "border-radius": "0.2cm",
                "max-height": 40
            }), new WCssClass(`.BtnPrimary`, {
                "color": "#fff",
                "background-color": "007bff",
                //"border-right": "rgb(3, 106, 175) 5px solid",
            }), new WCssClass(`.BtnAlert`, {
                "color": "#fff",
                "background-color": "#dc3545",
                //"border-right": "#7e1b25 5px solid",
            }), new WCssClass(`.BtnSuccess`, {
                "color": "#fff",
                "background-color": "#28a745",
                //"border-right": "#165c26 5px solid",
            }), new WCssClass(`.BtnSecundary`, {
                "color": "#fff",
                "background-color": "#17a2b8",
                //"border-right": "#0f5964 5px solid",
            }), new WCssClass(`.Btn[type=checkbox]`, {
                "height": "20px",
                "min-width": "20px",
                "margin": "5px",
            }), new WCssClass(`.BtnTable, .BtnTableA, .BtnTableS, .BtnTableSR`, {
                "font-weight": "bold",
                "border": "none",
                "padding": "5px",
                "margin": "2px",
                "text-align": "center",
                "display": "inline-block",
                "min-width": "30px",
                "font-size": "12px",
                "cursor": "pointer",
                "background-color": "#09f",
                "color": "#fff",
                //"border-right": "rgb(3, 106, 175) 5px solid",
            }), new WCssClass(`.BtnTableS`, {
                "background-color": "#106705",
                //"border-right": "#0a3e03 5px solid"
            }), new WCssClass(`.BtnTableSR`, {
                "background-color": "#ff8080",
                //"border-right": "#d86060 5px solid",
                width: "100%",
            }), new WCssClass(`.BtnTableA`, {
                "background-color": "#af0909",
                //"border-right": "#670505 5px solid"
            }),
            //INPUTS
            new WCssClass(`input[type=text], 
            input[type=string], 
            input[type=number],
            input[type=date]`, {
                padding: 10,
                border: "none",
                border: "2px solid #dddada",
                width: "calc(100% - 24px)",
                "font-size": "15px",
                height: 20,
                "border-radius": "0.2cm"
            }), new WCssClass(`input:active, input:focus`, {
                "border-bottom": "2px solid #0099cc",
                outline: "none",
            }), new WCssClass(`input[type=button]`, {
                cursor: "pointer",
                width: "calc(100% - 0px)",
                height: "initial"
            }),
        ]
    }
}
//#endregion  #################################################################################################

export { StyleScrolls , StylesControlsV1}