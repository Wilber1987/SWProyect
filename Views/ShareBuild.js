import { ComponentsManager, WAjaxTools, WArrayF, WRender } from "../WDevCore/WModules/WComponentsTools.js";
import { WCssClass } from "../WDevCore/WModules/WStyledRender.js";
import "../WDevCore/WComponents/WTableComponent.js";
import "../WDevCore/WComponents/WFilterControls.js";

export default class ShareBuildsView extends HTMLElement {
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
        this.append(WRender.CreateStringNode("<h2>Share your build</h2>"));
        let Data = [];
        const ModelObject = {
            // buildId: 1,
            monsterId: [],
            set1: [],
            set2: [],
            set3: [],
            slot_2: ["SPD", "HP%", "DEF%", "ATK%"],
            slot_4: ["CRT DMG","CRT RATE", "HP%", "DEF%", "ATK%"],
            slot_6: ["ACC", "RES", "HP%", "DEF%", "ATK%"],            
            "Subs-stats": "Example: focus in Def%, Acc, Hp%",
            ArtType: [],
            ArtElement: [],
            Description: "Excelente para RTA"
        };
        for (let index = 0; index < 19; index++) {
            let response = await fetch("./DataBase/Monsters/MonsterDataBase" + (index + 1) + ".json");
            response = await response.json();
            Data = Data.concat(response.results);
        }
        Data = Data.filter(x=> x.awakens_from != null);
        Data.forEach(D => {
            ModelObject.monsterId.push({
                id: D.com2us_id, desc: D.name
            });
        });
        this.RuneList.forEach(element => {
            ModelObject.set1.push({
                id: element, desc: element
            });
            ModelObject.set2.push({
                id: element, desc: element
            });
            ModelObject.set3.push({
                id: element, desc: element
            });
        });
        this.ArtType.forEach(element => {
            ModelObject.ArtType.push({
                id: element, desc: element
            });
            ModelObject.ArtElement.push({
                id: element, desc: element
            });
        });
        const Modal = WRender.createElement({
            type: "w-modal-form",
            props: {
                ObjectModel: ModelObject,
                title: "Share Your Build",
                StyleForm: "columnX2",
                NoModal: true,
                ObjectOptions: {
                    AddObject: true,
                    SaveFunction: (obj) => {
                        console.log(obj);
                        this.SaveBuild(obj)
                    }
                }
            }
        });
        this.shadowRoot.append(WRender.createElement({
            type: 'img', 
            props: { class: 'bannerImg', src: "./Media/img/wall10.jpg" }
        }))
        this.shadowRoot.append(WRender.createElement(Modal))
        //this.SaveBuild(ModelObject)
        //this.shadowRoot.append(WTableReport);
        this.shadowRoot.append(WRender.createElement(this.Style));
    }
    SaveBuild = async (Build = {}) => {
        const url = "https://docs.google.com/forms/d/1Z4N9K6HP6-_BF0Oyned1e4K81qoactgY4M5mqXvXnTk/formResponse";
        const data = {
            "entry.1650689494": Build.monsterId,
            "entry.949748321": Build.set1,
            "entry.90022714": Build.set2,
            "entry.1814828266": Build.set3,
            "entry.538323684": `${Build.slot_2}, ${Build.slot_4}, ${Build.slot_5}` ,
            "entry.715275418": Build["Sub-stats"],
            "entry.123631978": Build.ArtType,
            "entry.630505179": Build.ArtElement,
            "entry.739031166": Build.Description,
        }
        const dataPost = {
            monsterId: Build.monsterId,
            set1: Build.set1,
            set2: Build.set2,
            set3: Build.set3,
            stats: `Slot 2: ${Build.slot_2}, Slot 4: ${Build.slot_4}, Slot 6: ${Build.slot_5}` ,
            "Sub-stats": Build["Sub-stats"],
            ArtType: Build.ArtType,
            ArtElement: Build.ArtElement,
            Description: Build.Description,
        }
        $.ajax({
            url: url,
            data: data,
            type: "POST",
            dataType: "xml",
            statusCode: {
                0: function () {
                    alert("success 0")
                    location.reload();
                },
                200: function () {
                    alert("success 200")
                    //     window.location.replace("Success.html");
                }
            }
        });
    }
    RuneList = [
        "none",
        "energy",
        "fatal",
        "blade",
        "swift",
        "focus",
        "despair",
        "guard",
        "endure",
        "revenge",
        "rage",
        "violent",
        "will",
        "nemesis",
        "shield",
        "vampire",
        "destroy",
    ];
    ArtType = [
        "Atk",
        "Def",
        "Hp"
    ];

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
                    margin: "10px", "justify-content": "center", "align-items": "center", display: "flex"
                }), new WCssClass(".DataContainer select", {
                    padding: "10px"
                }),new WCssClass(".bannerImg", {
                    width: "100%",                    
                    "box-shadow": "0 2px 5px 0 rgb(0 0 0 / 30%)",                    
                    "object-fit": "cover",
                    height: "200px",
                }),new WCssClass("h2", {
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
customElements.define("w-share-comps", ShareBuildsView);

