import { WRender, WArrayF, ComponentsManager, WAjaxTools } from '../../WDevcore/WModules/WComponentsTools.js';
import { WCssClass } from '../../WDevCore/WModules/WStyledRender.js';
import { ColumChart } from "../../WDevCore/WComponents/WChartJSComponents.js";
class DetailsRTAPicks extends HTMLElement {
    constructor(Data) {
        super();
        this.attachShadow({ mode: 'open' });       
        const ImageUrlPath = "https://swarfarm.com/static/herders/images/monsters/";
        this.shadowRoot.appendChild(WRender.createElement(this.Style()));
        this.GeneralContainer = WRender.Create({
            className: "GeneralContainer",
            children: [
                {
                    className: "imageCont", children: [
                        { tagName: "img", src: ImageUrlPath + Data.image_filename },
                        { tagName: "label", innerText: `${Data.name}` }
                    ]
                }, {
                    className: "details", children: [
                        { tagName: "label", innerText: `SeasonScore: ${Data.SeasonScore.toFixed(2)}`},
                        { tagName: "label", innerText: `PickRate: ${Data.Pick_Rate.toFixed(2)} %`},
                        { tagName: "label", innerText: `WinRate: ${Data.Win_Rate.toFixed(2)} %`},
                        { tagName: "label", innerText: `BannedRate: ${Data.Banned_Rate.toFixed(2)} %`},
                        { tagName: "label", innerText: `Leader: ${Data.Leader.toFixed(2)} %`},
                        { tagName: "label", innerText: `FirstPick: ${Data.FirstPick.toFixed(2)} %`},                       
                    ]
                }
            ]
        });
        this.Data = Data;
        this.OptionsContainer = WRender.Create({ className: "OptionsContainer" });
        this.Rendimiento = WRender.Create({ className: "Rendimiento" });
        this.CompsContainer = WRender.Create({ className: "CompsContainer" });   
        this.DetailContainer = WRender.Create({
            className: "DetailContainer", style: {
                display: "grid",
                padding: "20px",
                width: "calc(100% - 40px)",
                gridTemplateRows: "auto 50px 310px 200px"
            }, children: [this.GeneralContainer, this.OptionsContainer, this.Rendimiento, this.DetailContainer]
        });
        this.shadowRoot.append(this.DetailContainer);

    }
    connectedCallback() { 
        this.DrawComponent();         
    }
    DrawComponent = async () => {
        let Data = [];
        let DataSeason = [];
        for (let index = 0; index < SeasonList.length; index++) {
            let response = await fetch("../../DataBase/RTAPicks/DataPickRate" + SeasonList[index] + ".json");
            response = await response.json();
            if (index == 0) {
                DataSeason = response;
            }
            Data = Data.concat(response);
        }
        //console.log(Data.filter(x => x.com2us_id == this.Data.com2us_id));
        this.Rendimiento.appendChild(new ColumChart({
            Dataset: Data.filter(x => x.com2us_id == this.Data.com2us_id), 
            Colors: ["#ff6699", "#ffbb99", "#adebad"],
            TypeChart: "Line",
            ColumnLabelDisplay: 0,
            AttNameEval: "name",
            EvalValue: "SeasonScore",
            groupParams: ["Season"]
        }));
        console.log(this.Rendimiento);
        this.Data.combats.forEach(combat => {
            console.log(combat);
        });
    }
    Style = ()=>{
        return { type: 'w-style', props: {id: '', ClassList: [
                new WCssClass( `.GeneralContainer`, {
                    display: 'flex',
                }),new WCssClass( `.details`, {
                    display: 'grid',
                    "grid-template-columns": "50% 50%",
                    "grid-gap": "1%"                    
                }),new WCssClass( `.details label`, {
                    padding: 10,
                    background: "#4da6ff",
                    "border-radius": 5,
                    margin: 5, 
                    display: "flex",
                    "align-items": "center",
                    "font-size": 10
                }), new WCssClass(".imageCont", {
                    position: "relative",
                }), new WCssClass(".imageCont label", {
                    position: "absolute",
                    bottom: 0, left: 0, margin: "5px",
                    "background-color": "rgba(0,0,0,0.6)",
                    padding: "5px",
                    "border-radius": "0.1cm",
                    color: "#fff",
                    "font-size": "12px"
                }), new WCssClass(".imageCont img", {
                    height: "100px", width: "100px"
                }),
            ], MediaQuery: [ {condicion: '(max-width: 600px)',
                ClassList: []},
            ]}
        };
    }
}
customElements.define('w-detail-rta', DetailsRTAPicks);
export { DetailsRTAPicks }