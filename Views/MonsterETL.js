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
        this.DrawComponent();
    }
    DrawComponent = async () => {   
        const SelectSeason = { type:'select', props: { id: '', class: 'className', onchange: (ev)=>{            
            this.SelectedSeason = ev.target.value;
        }}, children:[]};
        SeasonList.forEach((element, index) => {
            SelectSeason.children.push( {type:'option', props: {innerText:element, value: index}});
        });
        this.shadowRoot.append(WRender.createElement([
            SelectSeason,
            { type:'input', props: { id: '', type:'button', class: 'className', value: 'Global Data',
             onclick: async ()=>{
                this.RTAData();
            }}},
            { type:'input', props: { id: '', type:'button', class: 'className', value: 'CreateData',
            onclick: async ()=>{
               this.CreateRTAData();
           }}},
           { type:'input', props: { id: '', type:'button', class: 'className', value: 'CreateDataRtaPicks',
           onclick: async ()=>{
              this.CreateRtaPicksData();
          }}}
        ]));       
        this.append(WRender.createElement(this.Style));
        console.log("cargando...");
    } 
    CreateRTAData = async () => {
        let RTAData = await fetch("../DataBase/full_log"+this.SelectedSeason+".json");
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
                    }else {
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
                    }else {
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
        this.MonPickData = MonPickData;
        const dataStr = "data:text/json;charset=utf-8," 
            + encodeURIComponent(JSON.stringify(MonPickData));
        
        const DownLoadData = WRender.createElement({ type:'a', props: {
            href: dataStr, download: "MonPickData"+this.SelectedSeason+".json", innerText: "Descargar..."
        }});        
        this.shadowRoot.append(DownLoadData);
    }
    RTAData = async () => {
        let RTAData = await fetch("../DataBase/full_log"+this.SelectedSeason+".json");
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
                    }else {
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
                    }else {
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
        this.MonPickData = MonPickData;
        const GlobalData = {
            Season: this.SelectedSeason,
            Fight_Number: WArrayF.ArrayUnique(MonPickData, "id_battle").length
        }
        this.GlobalData = GlobalData;
        const dataStr = "data:text/json;charset=utf-8," 
            + encodeURIComponent(JSON.stringify(GlobalData));
        
        const DownLoadData = WRender.createElement({ type:'a', props: {
            href: dataStr, download: "GlobalData"+this.SelectedSeason+".json", innerText: "Descargar Global Data..."
        }});        
        this.shadowRoot.append(DownLoadData);
    }
    CreateRtaPicksData = async () => {
         //TRANSFORMMMMM-----------------------------
         const MonPickData = this.MonPickData;
         let Data = [];
         for (let index = 0; index < 18; index++) {
             let response = await fetch("../DataBase/Monsters/MonsterDataBase" + (index + 1) + ".json");
             response = await response.json();
             Data = Data.concat(response.results);
         } 
         const RTAPicksData = [];
         const NPartidos = this.GlobalData.Fight_Number;         
         Data.forEach(Mon => {  
             const MonDataPicks = MonPickData.filter( D => D.unit_master_id == Mon.com2us_id);  
             if (MonDataPicks.length != 0) {
                 const Pick_Rate = MonDataPicks.length;
                 const Win_Rate = MonDataPicks.filter(D => D.win == true).length;  
                 const Banned_Rate = MonDataPicks.filter(D => D.banned == true).length;  
                 const Leader = MonDataPicks.filter(D => D.leader == true).length;
                 const FirstPick = MonDataPicks.filter(D => D.pick_slot_id == 1).length;
                 const LastPick = MonDataPicks.filter(D => D.pick_slot_id == 5).length;
                 Mon.Pick_Rate = (Pick_Rate / NPartidos * 100).toFixed(2) + "%";                
                 Mon.Win_Rate =  (Win_Rate/Pick_Rate*100).toFixed(2) + "%";
                 Mon.FirstPick =  (FirstPick/Pick_Rate*100).toFixed(2) + "%";
                 Mon.LastPick =  (LastPick/Pick_Rate*100).toFixed(2) + "%";
                 Mon.Banned_Rate = (Banned_Rate/Pick_Rate*100).toFixed(2) + "%";
                 Mon.Leader = (Leader/Pick_Rate*100).toFixed(2) + "%";
                 Mon.Season = this.SelectedSeason;
                 Mon.SeasonScore = ((Pick_Rate / NPartidos * 100)*0.7 
                 + (Win_Rate/Pick_Rate*100)*0.15 
                 + (Banned_Rate/Pick_Rate*100)*0.15).toFixed(2);
                 RTAPicksData.push(Mon);
             }          
         });
         const dataStr2 = "data:text/json;charset=utf-8," 
         + encodeURIComponent(JSON.stringify(RTAPicksData)); 
         const DownLoadDataTranform = WRender.createElement({ type:'a', props: {
             href: dataStr2, download: "DataPickRate"+this.SelectedSeason+".json", innerText: "Descargar full Picks..."
         }});        
         this.shadowRoot.append(DownLoadDataTranform);
    }
    Style = {
        type: "w-style",
        props: {
            ClassList: [
                new WCssClass(".DocumentView", {
                    display: "flex",
                   "flex-direction": "column"                        
                })
            ]
        }
    };
}
customElements.define("w-monster-etl", MonsterETL);

