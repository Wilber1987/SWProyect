import { ComponentsManager, WAjaxTools, WRender, WArrayF } from "../WDevCore/WModules/WComponentsTools.js";
import { WCssClass } from "../WDevCore/WModules/WStyledRender.js";
import "../WDevCore/WComponents/WTableComponents.js";

export default class MonsterETL extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.className = "DocumentView";
        this.SelectedSeason = SeasonList[0];
    }
    connectedCallback() {
        if (this.shadowRoot.innerHTML != "") {
            return;
        }
        this.shadowRoot.append(WRender.CreateStringNode("<h2>Data Export</h2>"));
        this.DrawComponent();
    }
    DrawComponent = async () => {    
        const SelectSeason = {
            type: 'select', props: {
                id: '', class: 'className', onchange: (ev) => {
                    this.SelectedSeason = ev.target.value;
                }
            }, children: []
        };
        SeasonList.forEach((element, index) => {
            SelectSeason.children.push({ type: 'option', props: { innerText: element, value: index } });
        });
        this.shadowRoot.append(WRender.createElement([
            SelectSeason,
            {
                type: 'input', props: {
                    id: '', type: 'button', class: 'className', value: 'CreateData',
                    onclick: async () => {
                        this.CreateRTAData();
                    }
                }
            },
            {
                type: 'input', props: {
                    id: '', type: 'button', class: 'className', value: 'CreateDataRtaPicks',
                    onclick: async () => {
                        this.CreateRtaPicksData();
                    }
                }
            }, {
                type: 'input', props: {
                    id: '', type: 'button', class: 'className', value: 'CreateDataRtaComps',
                    onclick: async () => {
                        this.CreateRtaPicksDataComps();
                    }
                }
            }
        ]));
        this.append(WRender.createElement(this.Style));
        console.log("cargando...");
    }
    CreateRTAData = async () => {
        let RTAData = await fetch("./DataBase/full_log" + this.SelectedSeason + ".json");
        RTAData = await RTAData.json();
        const MonPickData = [];
        RTAData.forEach(dat => {
            if (!dat.ranker_replay_list) {
                return;
            }
            dat.ranker_replay_list.forEach((RepList) => {
                //PRIMER
                const BattleId = RepList.opp_wizard_name + "_" + RepList.wizard_name + "_" + RepList.date_add;
                if (MonPickData.find(d => d.id_battle == BattleId)) {
                    return;
                }
                RepList.pick_info.unit_list.forEach(pick => {
                    //banned
                    if (RepList.pick_info.banned_slot_ids[0] == pick.pick_slot_id) {
                        pick.banned = true;
                    } else {
                        pick.banned = false;
                    }
                    //leader
                    if (RepList.pick_info.leader_slot_id == pick.pick_slot_id) {
                        pick.leader = true;
                    } else {
                        pick.leader = false;
                    }
                    //win
                    if (RepList.slot_id == RepList.win_lose && pick.banned == false) {
                        pick.win = true;
                    } else {
                        pick.win = false;
                    }
                    pick.user = RepList.wizard_name;
                    pick.rank = RepList.rank;
                    pick.id_battle = BattleId;
                    pick.date = RepList.date_add,
                        pick.temp = this.SelectedSeason;
                    MonPickData.push(pick);
                });
                //OPONENTE
                RepList.opp_pick_info.unit_list.forEach(pick => {

                    if (RepList.opp_pick_info.banned_slot_ids[0] == pick.pick_slot_id) {
                        pick.banned = true;
                    } else {
                        pick.banned = false;
                    }
                    if (RepList.opp_pick_info.leader_slot_id == pick.pick_slot_id) {
                        pick.leader = true;
                    } else {
                        pick.leader = false;
                    }
                    //win
                    if (RepList.opp_slot_id == RepList.win_lose && pick.banned == false) {
                        pick.win = true;
                    } else {
                        pick.win = false;
                    }

                    pick.user = RepList.opp_wizard_name;
                    pick.rank = RepList.opp_rank;
                    pick.id_battle = BattleId;
                    pick.date = RepList.date_add,
                        pick.temp = this.SelectedSeason;
                    MonPickData.push(pick);
                });
            });
        });
        const GlobalData = {
            Season: this.SelectedSeason,
            Fight_Number: WArrayF.ArrayUnique(MonPickData, "id_battle").length
        } 
        this.GlobalData = GlobalData;
        this.MonPickData = MonPickData;
        /*
        //REQUEST   
        //SETGLOBAL DATA...   
        const urlGlobal = "./API/CreateRTAData.php/?function=GlobalData"
               
        await WAjaxTools.PostRequest(urlGlobal, GlobalData);
        //SETGLOBAL MonPickData... 
        //console.log(MonPickData );
        const url = "./API/CreateRTAData.php/?function=MonPickData"
        await WAjaxTools.PostRequest(url,{ });
        //FIN REQUEST 
        */   

        const dataStr = "data:text/json;charset=utf-8,"
            + encodeURIComponent(JSON.stringify(MonPickData));

        const DownLoadData = WRender.createElement({
            type: 'a', props: {
                href: dataStr, download: "MonPickData" + this.SelectedSeason + ".json", innerText: "Descargar..."
            }
        });
        this.shadowRoot.append(DownLoadData);

        const dataStr2 = "data:text/json;charset=utf-8,"
            + encodeURIComponent(JSON.stringify(GlobalData));

        const DownLoadData2 = WRender.createElement({
            type: 'a', props: {
                href: dataStr, download: "GlobalData" + this.SelectedSeason + ".json", innerText: "Descargar Global Data..."
            }
        });
        this.shadowRoot.append(DownLoadData2);
    }
    
    CreateRtaPicksData = async () => {
        //TRANSFORMMMMM-----------------------------
        const MonPickData = this.MonPickData;
        let Data = [];
        for (let index = 0; index < 19; index++) {
            let response = await fetch("../DataBase/Monsters/MonsterDataBase" + (index + 1) + ".json");
            response = await response.json();
            Data = Data.concat(response.results);
        }
        const RTAPicksData = [];
        const NPartidos = this.GlobalData.Fight_Number;
        Data.forEach(Mon => {
            const MonDataPicks = MonPickData.filter(D => D.unit_master_id == Mon.com2us_id);
            if (MonDataPicks.length != 0) {
                const Pick_Rate = MonDataPicks.length;
                const Win_Rate = MonDataPicks.filter(D => D.win == true).length;
                const Banned_Rate = MonDataPicks.filter(D => D.banned == true).length;
                const Leader = MonDataPicks.filter(D => D.leader == true).length;
                const FirstPick = MonDataPicks.filter(D => D.pick_slot_id == 1).length;
                const LastPick = MonDataPicks.filter(D => D.pick_slot_id == 5).length;
                Mon.Pick_Rate = (Pick_Rate / NPartidos * 100).toFixed(2) + "%";
                Mon.Win_Rate = (Win_Rate / (Pick_Rate - Banned_Rate) * 100).toFixed(2) + "%";
                Mon.FirstPick = (FirstPick / Pick_Rate * 100).toFixed(2) + "%";
                Mon.LastPick = (LastPick / Pick_Rate * 100).toFixed(2) + "%";
                Mon.Banned_Rate = (Banned_Rate / Pick_Rate * 100).toFixed(2) + "%";
                Mon.Leader = (Leader / Pick_Rate * 100).toFixed(2) + "%";
                Mon.Season = this.SelectedSeason;

                let SeasonScore = 0;
                if ((Pick_Rate / NPartidos * 100) > 1) {
                    SeasonScore = (
                        (Pick_Rate / NPartidos * 100) * 0.2
                        + (FirstPick / Pick_Rate * 100) * 0.1
                        + (LastPick / Pick_Rate * 100) * 0.05
                        + (Win_Rate / (Pick_Rate - Banned_Rate) * 100) * 0.4
                        + (Banned_Rate / Pick_Rate * 100) * 0.25
                    )
                    if (SeasonScore > 50) {
                        SeasonScore = 50;
                    }
                }
                Mon.SeasonScore = SeasonScore.toFixed(2);
                RTAPicksData.push(Mon);
            }
        });
        const dataStr2 = "data:text/json;charset=utf-8,"
            + encodeURIComponent(JSON.stringify(RTAPicksData));
        const DownLoadDataTranform = WRender.createElement({
            type: 'a', props: {
                href: dataStr2, download: "DataPickRate" + this.SelectedSeason + ".json", innerText: "Descargar full Picks..."
            }
        });
        this.shadowRoot.append(DownLoadDataTranform);
    }
    CreateRtaPicksDataComps = async (Season = SeasonList[this.SelectedSeason]) => {
        //TRANSFORMMMMM-----------------------------
        let MonPickData = await fetch("../DataBase/RTAPicks/MonPickData" + this.SelectedSeason + ".json");
        MonPickData = await MonPickData.json();
        let RTAPicksData = await fetch("../DataBase/RTAPicks/DataPickRate" + this.SelectedSeason + ".json");
        RTAPicksData = await RTAPicksData.json();
        RTAPicksData.sort(function (a, b) {
            return b.SeasonScore - a.SeasonScore;
        });
        console.log(MonPickData);
        console.log(RTAPicksData);
        const DataComps = [];
        //RTAPicksData.forEach(mob => {
        const Battles = WArrayF.ArrayUnique(MonPickData, "id_battle"); //MonPickData.filter(x=> x.unit_master_id == mob.com2us_id);
        Battles.forEach(battle => {
            const Comp = MonPickData.filter(x => x.id_battle == battle.id_battle);
            const users = WArrayF.ArrayUnique(Comp, "user")
            const Composition1 = {
                id_battle: battle.id_battle,
                user: users[0].user
            };
            const Composition2 = {
                id_battle: battle.id_battle,
                user: users[1].user
            };
            Comp.forEach(comp => {
                const mob = RTAPicksData.find(x => x.com2us_id == comp.unit_master_id)
                //console.log(comp.unit_master_id);
                //console.log(mob);
                if (comp.user == Composition1.user) {
                    Composition1["Pick" + comp.pick_slot_id] = comp.unit_master_id;
                    Composition1["Pick_Name" + comp.pick_slot_id] = mob.name;
                    Composition1["Pick_Image_" + comp.pick_slot_id] = mob.image_filename;
                }
                if (comp.user == Composition2.user) {
                    Composition2["Pick" + comp.pick_slot_id] = comp.unit_master_id;
                    Composition2["Pick_Name" + comp.pick_slot_id] = mob.name;
                    Composition2["Pick_Image_" + comp.pick_slot_id] = mob.image_filename;
                }
            });
            if (DataComps.find(x => x.id_battle == battle.id_battle) == null) {
                DataComps.push(Composition1);
                DataComps.push(Composition2);
            }
        });
        //});
        //console.log(MonPickData);
        //console.log(RTAPicksData);
        console.log(DataComps);
        const DataCompsUnique = this.ArrayUniqueByObject(DataComps, {
            Pick1: 1, Pick2: 1, Pick3: 1,Pick4: 1,Pick5: 1
        });
        console.log(DataCompsUnique);
        //return DataComps;
        const dataStr2 = "data:text/json;charset=utf-8,"
            + encodeURIComponent(JSON.stringify(DataComps));
        const DownLoadDataTranform = WRender.createElement({
            type: 'a', props: {
                href: dataStr2, download: "DataPickComps" + this.SelectedSeason + ".json", innerText: "Descargar full Comps Picks..."
            }
        });
        this.shadowRoot.append(DownLoadDataTranform);
    }
    ArrayUniqueByObject(DataArray, param = {}) { 
        let DataArraySR = [];         
        DataArray.forEach(element => {  
            const comps = [];
            for (const prop in param) {
                comps.push(element[prop])
            } 
            //console.log(comps);
            const DFilt =  DataArraySR.find( obj => {
                let flagObj = false;  
                //let flagObj2 = false;              
                /* for (let index = 0; index < comps.length; index++) {                    
                    const comp = comps[index];
                                 
                } */
                let sumFlag = 0;
                comps.forEach(comp => {                    
                    for (const prop in obj) {
                        if (comp == obj[prop]) {
                            sumFlag++;
                            break;
                        }
                    }       
                });
                if (sumFlag == 5) {
                    flagObj = true;
                }
                return flagObj;
            });  
            if (!DFilt) { 
                element.count = 1;
                element.rate = ((1/DataArray.length)*100).toFixed(2) + "%";              
                DataArraySR.push(element)
            } else {
                
                DFilt.count = DFilt.count +1;
                DFilt.rate = ((DFilt.count/DataArray.length)*100).toFixed(2) + "%";
            }
        });
        return DataArraySR;        
    }
    Style = {
        type: "w-style",
        props: {
            ClassList: [
                new WCssClass(".DocumentView", {
                    display: "flex",
                    "flex-direction": "column"
                }), new WCssClass("h2", {
                    margin: "0px",
                    color: "#999"
                }),
            ]
        }
    };
}
customElements.define("w-monster-etl", MonsterETL);

