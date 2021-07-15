import { WRender, WArrayF, ComponentsManager, WAjaxTools } from "../WModules/WComponentsTools.js";
import { WCssClass } from "../WModules/WStyledRender.js";
import "./WChartJSComponent.js";
import "./WModalForm.js";
class WTableComponent extends HTMLElement {
    constructor() {
        super();
        this.TableClass = "WTable WScroll";
        this.Dataset = [];
        this.selectedItems = [];
        this.ModelObject = {};
        this.paginate = true;
        this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
        if (this.shadowRoot.innerHTML != "") {
            return;
        }
        this.shadowRoot.append(WRender.createElement(this.PaginateTOptionsStyle()));
        switch (this.TableConfig.StyleType) {
            case "Cards":
                this.shadowRoot.append(WRender.createElement(this.TableCardStyle()));
                break;
            case "Cards2":
                this.shadowRoot.append(WRender.createElement(this.TableCardStyle2()));
                break;
            case "Cards3":
                this.shadowRoot.append(WRender.createElement(this.TableCardStyle3()));
                break;
            case "Cards2-ColumnX2":
                this.shadowRoot.append(WRender.createElement(this.TableCardStyle2()));
                this.shadowRoot.append(WRender.createElement(this.TableCardStyle2ColumnX2()));
                break;
            case "Grid":
                this.shadowRoot.append(WRender.createElement(this.TableGridStyle()));
                break;
            default:
                this.shadowRoot.append(WRender.createElement(this.TableStyle()));
                break;
        }
        //PAGINACION
        if (this.TableConfig.maxElementByPage == undefined) {
            this.maxElementByPage = 10;
        } else {
            this.maxElementByPage = this.TableConfig.maxElementByPage;
        }
        this.AddItemsFromApi = this.TableConfig.AddItemsFromApi;
        this.SearchItemsFromApi = this.TableConfig.SearchItemsFromApi;
        //this.TableConfig.MasterDetailTable = true
        if (this.TableConfig != undefined && this.TableConfig.MasterDetailTable == true) {
            this.Dataset = this.TableConfig.Datasets;
            if (this.Dataset == undefined) {
                this.Dataset = [];
            }
            if (this.TableConfig.Options) {
                this.Options = this.TableConfig.Options;
            } else {
                this.Options = {
                    Search: true,
                    Add: true,
                    Edit: true,
                    Show: true,
                };
            }
            if (this.TableConfig.ModelObject) {
                this.ModelObject = this.TableConfig.ModelObject;
            }
            if (this.TableConfig.selectedItems == undefined) {
                this.selectedItems = [];
            } else {
                this.selectedItems = this.TableConfig.selectedItems;
            }
            this.DrawTable();
            return;
        } else if (typeof this.TableConfig.Datasets === "undefined" || this.TableConfig.Datasets.length == 0) {
            this.innerHTML = "Defina un Dataset en formato JSON";
            return;
        }
        this.Dataset = this.TableConfig.Datasets;
        this.Colors = ["#ff6699", "#ffbb99", "#adebad"];
        this.AttNameEval = this.TableConfig.AttNameEval;
        this.AttNameG1 = this.TableConfig.AttNameG1;
        this.AttNameG2 = this.TableConfig.AttNameG2;
        this.AttNameG3 = this.TableConfig.AttNameG3;
        this.EvalValue = this.TableConfig.EvalValue;
        this.Options = this.TableConfig.Options;
        if (this.TableConfig.paginate != undefined) {
            this.paginate = this.TableConfig.paginate;
        }
        if (this.TableConfig.TableClass) {
            this.TableClass = this.TableConfig.TableClass + " WScroll";
        }
        this.RunTable();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        console.log('Custom attributes changed.' + oldValue + "  -  " + newValue);
    }
    static get observedAttributes() {
        //return ["id", "Dataset"];
    }
    RunTable() {
        this.GroupsData = [];
        this.ProcessData = [];
        this.EvalArray = WArrayF.ArrayUnique(this.TableConfig.Datasets, this.AttNameEval);
        if (this.TableConfig.Dinamic == true) {
            this.className = "DinamicContainer";
            this.append(WRender.createElement({
                type: 'w-style', props: {
                    id: '', ClassList: [
                        new WCssClass(`.DinamicContainer`, {
                            overflow: "hidden",
                            height: "700px",
                            display: "grid",
                            border: "solid 1px #d1cfcf",
                            "border-radius": "0.2cm",
                            "grid-template-columns": "calc(100% - 250px) 250px",
                            "grid-template-rows": "280px 40px calc(100% - 320px)",
                            "font-size": "12px",
                            "grid-gap": "5px",
                            padding: "10px"
                        }),
                    ]
                }
            }))
            this.AttNameEval = null;
            this.EvalValue = null;
            this.groupParams = [];
            this.EvalArray = [];
            this.shadowRoot.append(WRender.createElement(this.TableStyleDinamic()));
            this.shadowRoot.append(WRender.createElement(this.TableOptions()));
            this.DrawTable();
            if (this.TableConfig.AddChart == true) {
                if (this.shadowRoot.querySelector("#Chart" + this.id)) {
                    let ChartContainer = this.shadowRoot.querySelector("#Chart" + this.id);
                    ChartContainer.innerHTML = "";
                    ChartContainer.append(WRender.createElement(this.DrawChart()));
                } else {
                    let ChartContainer = {
                        type: "div",
                        props: { id: "Chart" + this.id, className: "CharttableReport" }, children: [this.DrawChart()]
                    }
                    this.shadowRoot.append(WRender.createElement(ChartContainer));
                }
            }
            return;
        }
        if (!this.groupParams || typeof this.groupParams !== "object") {
            this.groupParams = [];
            if (this.AttNameG1) {
                this.groupParams.push(this.AttNameG1)
            }
            if (this.AttNameG2) {
                this.groupParams.push(this.AttNameG2)
            }
            if (this.AttNameG3) {
                this.groupParams.push(this.AttNameG3)
            }
            if (this.groupParams.length > 0 && this.AttNameEval !== undefined && this.EvalValue !== undefined) {
                this.DrawGroupTable();
                if (this.TableConfig.AddChart == true) {
                    if (this.shadowRoot.querySelector("#Chart" + this.id)) {
                        let ChartContainer = this.shadowRoot.querySelector("#Chart" + this.id);
                        ChartContainer.innerHTML = "";
                        ChartContainer.append(WRender.createElement(this.DrawChart()));
                    } else {
                        let ChartContainer = { type: "div", props: { id: "Chart" + this.id }, children: [this.DrawChart()] }
                        this.shadowRoot.append(WRender.createElement(ChartContainer));
                    }
                }
            } else {
                this.DrawTable();
            }
            return;
        }
    }
    //BASIC TABLE-----------------------------------------------------------------------
    //#region tabla basica --------------------------------------------------------------
    DefineObjectModel(Dataset = this.Dataset) {
        if (this.TableConfig.ModelObject == undefined) {
            for (const prop in Dataset[0]) {
                this.ModelObject[prop] = Dataset[0][prop];
            }
        } else {
            this.ModelObject = this.TableConfig.ModelObject;
        }
    }
    DrawTable(Dataset = this.Dataset) {
        let ChartContainer = this.shadowRoot.querySelector("#Chart" + this.id);
        if (ChartContainer) {
            ChartContainer.innerHTML = "";
        }
        this.DefineObjectModel(Dataset);
        let table = this.shadowRoot.querySelector("#MainTable" + this.id);
        const TOptions = this.DrawHeadOptions();
        if (TOptions != null) {
            this.shadowRoot.append(WRender.createElement(TOptions));
        }
        if (typeof table === "undefined" || table == null) {
            table = { type: "table", props: { class: this.TableClass, id: "MainTable" + this.id }, children: [] };
            table.children.push(this.DrawTHead());
            const tbody = this.DrawTBody(Dataset);
            if (this.paginate == true && Dataset.length > this.maxElementByPage) {
                tbody.children.forEach(tb => {
                    table.children.push(tb);
                });
            } else {
                table.children.push(tbody);
            }
            let divTableCntainer = { type: "div", props: { class: "tableContainer" }, children: [table] }
            this.shadowRoot.append(WRender.createElement(divTableCntainer));
            if (this.paginate == true) {
                this.shadowRoot.append(WRender.createElement({
                    type: "div",
                    props: { class: "tfooter" },
                    children: this.DrawTFooter(tbody.children)
                }));
            }
        } else {
            table.style.display = "table";
            table.innerHTML = "";
            table.append(WRender.createElement(this.DrawTHead()));
            const tbody = this.DrawTBody(Dataset);
            if (this.paginate == true && Dataset.length > this.maxElementByPage) {
                tbody.children.forEach(tb => {
                    table.append(WRender.createElement(tb));
                });
            } else {
                table.append(WRender.createElement(tbody));
            }
            let footer = this.shadowRoot.querySelector(".tfooter");
            if (typeof footer !== "undefined" && footer != null) {
                footer.innerHTML = "";
                if (this.paginate == true) {
                    this.DrawTFooter(tbody.children).forEach(element => {
                        footer.append(WRender.createElement(element));
                    });
                }
            }
        }
    }
    DrawHeadOptions() {
        if (this.shadowRoot.querySelector(".thOptions")) {
            this.shadowRoot.querySelector(".thOptions").style.display = "flex";
            return "";
        }
        if (this.Options != undefined) {
            console.log(this.Options);
            if (this.Options.Search != undefined || this.Options.Add != undefined) {
                const trOptions = { type: "div", props: { class: "thOptions" }, children: [] }
                if (this.Options.Search != undefined) {
                    const InputOptions = {
                        type: "input",
                        props: {
                            class: "txtControl",
                            type: "text",
                            placeholder: "Buscar...",
                            onchange: async (ev) => {
                                if (this.SearchItemsFromApi != undefined) {
                                    if (this.SearchItemsFromApi.Function != undefined) {
                                        const Dataset = await this.SearchItemsFromApi.Function(ev.target.value);
                                        this.DrawTable(Dataset);
                                    } else {
                                        const Dataset = await WAjaxTools.PostRequest(
                                            this.SearchItemsFromApi.ApiUrl, { Param: ev.target.value }
                                        );
                                        this.DrawTable(Dataset.data);
                                    }
                                } else {
                                    const Dataset = this.Dataset.filter((element) => {
                                        for (const prop in element) {
                                            try {
                                                if (element[prop] != null) {
                                                    if (element[prop].toString().includes(ev.target.value)) {
                                                        return element;
                                                    }
                                                }
                                            } catch (error) {
                                                console.log(element);
                                            }

                                        }
                                    })
                                    if (Dataset.length == 0 && this.Options.UrlSearch != undefined) {
                                        const DataUrlSearch = await WAjaxTools.PostRequest(
                                            this.Options.UrlSearch, { Param: ev.target.value }
                                        );
                                        this.DrawTable(DataUrlSearch);
                                        return;
                                    }
                                    this.DrawTable(Dataset);
                                }
                            }
                        }
                    }
                    trOptions.children.push(InputOptions);
                }
                if (this.Options.Add != undefined) {
                    const BtnOptions = {
                        type: "button",
                        props: {
                            class: "Btn",
                            type: "button",
                            innerText: "Add+",
                            onclick: async () => {
                                this.shadowRoot.append(WRender.createElement({
                                    type: "w-modal-form",
                                    props: {
                                        ObjectModel: this.ModelObject,
                                        AddItemsFromApi: this.AddItemsFromApi,
                                        Dataset: this.Dataset,
                                        icon: this.TableConfig.icon,
                                        title: "Nuevo",
                                        ValidateFunction: this.TableConfig.ValidateFunction,
                                        ObjectOptions: {
                                            Url: this.Options.UrlAdd,
                                            AddObject: true,
                                            SaveFunction: (NewObject) => {
                                                if (this.AddItemsFromApi == null) {
                                                    this.Dataset.push(NewObject);
                                                }
                                                this.DrawTable();
                                            }
                                        }
                                    }
                                }));
                            }
                        }
                    }
                    trOptions.children.push(BtnOptions);
                }
                return trOptions;
            }
            return null;
        }
        return null;
    }
    checkDisplay(prop) {
        let flag = true
        if (this.TableConfig.DisplayData != undefined &&
            this.TableConfig.DisplayData.__proto__ == Array.prototype) {
            const findProp = this.TableConfig.DisplayData.find(x => x == prop);
            if (!findProp) {
                flag = false;
            }
        }
        return flag;
    }
    DrawTHead = (element = this.ModelObject) => {
        const thead = { type: "thead", props: {}, children: [] };
        //const element = this.Dataset[0];
        let tr = { type: "tr", children: [] }
        for (const prop in element) {
            const flag = this.checkDisplay(prop);
            if (flag) {
                if (!prop.includes("_hidden")) {
                    tr.children.push({
                        type: "th",
                        children: [prop.replaceAll("_operationValue", "").replaceAll("_", " ")]
                    });
                }
            }

        }
        if (this.Options != undefined) {
            if (this.Options.Select != undefined ||
                this.Options.Show != undefined ||
                this.Options.Edit != undefined ||
                this.Options.Delete != undefined ||
                this.Options.UserActions != undefined) {
                const Options = { type: "th", props: { class: "" }, children: ["Options"] };
                tr.children.push(Options);
            }
        }
        thead.children.push(tr);
        return thead;
    }
    DrawTBody = (Dataset = this.Dataset) => {
        let tbody = { type: "tbody", props: {}, children: [] };
        if (this.paginate == true && Dataset.length > this.maxElementByPage) {
            this.numPage = Dataset.length / this.maxElementByPage;
            if (Dataset.length > 100) {
                this.numPage = 100 / this.maxElementByPage;
            }
            for (let index = 0; index < this.numPage; index++) {
                let tBodyStyle = "display:none";
                if (index == 0) {
                    //tBodyStyle = "display:table-row-group";
                    if (this.TableConfig.StyleType != undefined && this.TableConfig.StyleType.includes("Cards")) {
                        tBodyStyle = "display:flex";
                    } else if (this.TableConfig.StyleType != undefined && this.TableConfig.StyleType == "Grid") {
                        tBodyStyle = "display:grid";
                    } else {
                        //tBodyStyle = "display:table-row-group";
                        tBodyStyle = "display:contents";
                    }
                }
                tbody.children.push({ type: "tbody", props: { class: "tbodyChild", style: tBodyStyle }, children: [] });
            }
        } else {
            this.numPage = 1;
        }
        let page = 0;
        Dataset.forEach((element, DatasetIndex) => {
            if (DatasetIndex >= 100) {
                return;
            }
            let tr = { type: "tr", props: {}, children: [] };
            for (const prop in element) {
                const flag = this.checkDisplay(prop);
                if (flag) {
                    if (!prop.includes("_hidden")) {
                        let value = "";
                        if (element[prop] != null) {
                            value = element[prop].toString();
                        }
                        //DEFINICION DE VALORES-------------
                        if (prop.includes("img") || prop.includes("pict") ||
                            prop.includes("Pict") || prop.includes("image") || prop.includes("Image") ||
                            prop.includes("Photo")) {
                            let cadenaB64 = "";
                            //console.log(this.TableConfig)
                            var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
                            if (base64regex.test(value)) {
                                cadenaB64 = "data:image/png;base64,";
                            } else if (this.TableConfig.ImageUrlPath != undefined) {
                                cadenaB64 = this.TableConfig.ImageUrlPath + "/";
                            }
                            tr.children.push({
                                type: "td",
                                props: { class: "tdImage" },
                                children: [{
                                    type: "img",
                                    props: {
                                        src: cadenaB64 + value,
                                        class: "imgPhoto",
                                        height: 50,
                                        width: 50
                                    }
                                }]
                            });
                        } else if (prop.toUpperCase().includes("TOTAL")
                            || prop.toUpperCase().includes("MONTO")
                            || prop.toUpperCase().includes("SUBTOTAL")
                            || prop.toUpperCase().includes("SUB-TOTAL")
                            || prop.toUpperCase().includes("SUB TOTAL")
                            || prop.toUpperCase().includes("IMPUESTO")
                            || prop.toUpperCase().includes("IVA")
                            || prop.toUpperCase().includes("TAXT")
                            || prop.toUpperCase().includes("P/U")
                            || prop.toUpperCase().includes("P-U")) {
                            tr.children.push({
                                type: "td", props: {
                                    style: "text-align: right",
                                    innerHTML: `${Money["Euro"]} ${value}`
                                }
                            });
                        } else {
                            tr.children.push({ type: "td", props: { innerHTML: value } });
                        }
                    }
                }
            }
            if (this.Options != undefined) {
                if (this.Options.Select != undefined ||
                    this.Options.Show != undefined ||
                    this.Options.Edit != undefined ||
                    this.Options.Delete != undefined ||
                    this.Options.UserActions != undefined) {
                    const Options = { type: "td", props: { class: "tdAction" }, children: [] };
                    if (this.Options.Select != undefined && this.Options.Select == true) {
                        let Checked = WArrayF.FindInArray(element, this.selectedItems);
                        Options.children.push({
                            type: "input",
                            props: {
                                class: "Btn",
                                type: "checkbox",
                                innerText: "Select",
                                checked: Checked,
                                onclick: async (ev) => {
                                    const control = ev.target;
                                    const index = this.selectedItems.indexOf(element);
                                    if (index == -1 && control.checked == true) {
                                        if (WArrayF.FindInArray(element, this.selectedItems) == false) {
                                            this.selectedItems.push(element)
                                        } else {
                                            console.log("Item Existente")
                                        }
                                    } else {
                                        this.selectedItems.splice(index, 1)
                                    }
                                }
                            }
                        })
                    }
                    if (this.Options.Show != undefined && this.Options.Show == true) {
                        Options.children.push({
                            type: "button",
                            children: [{ type: 'img', props: { class: "icon", src: WIcons["show2"] } }],
                            props: {
                                class: "BtnTable",
                                type: "button",
                                onclick: async () => {
                                    this.shadowRoot.append(WRender.createElement({
                                        type: "w-modal-form",
                                        props: {
                                            icon: this.TableConfig.icon,
                                            ImageUrlPath: this.TableConfig.ImageUrlPath,
                                            title: "Detalle",
                                            ObjectDetail: element,
                                        }
                                    }));
                                }
                            }
                        })
                    }
                    if (this.Options.Edit != undefined && this.Options.Edit == true) {
                        Options.children.push({
                            type: "button",
                            children: [{ type: 'img', props: { class: "icon", src: WIcons["edit"] } }],
                            props: {
                                class: "BtnTableS",
                                type: "button",
                                onclick: async () => {
                                    this.shadowRoot.append(WRender.createElement({
                                        type: "w-modal-form",
                                        props: {
                                            ObjectModel: this.ModelObject,
                                            EditObject: element,
                                            icon: this.TableConfig.icon,
                                            ImageUrlPath: this.TableConfig.ImageUrlPath,
                                            title: "Editar",
                                            ValidateFunction: this.TableConfig.ValidateFunction,
                                            ObjectOptions: {
                                                Url: this.Options.UrlUpdate,
                                                SaveFunction: () => {
                                                    this.DrawTable();
                                                }
                                            }
                                        }
                                    }));
                                }
                            }
                        })
                    }
                    if (this.Options.Delete != undefined && this.Options.Delete == true) {
                        Options.children.push({
                            type: "button",
                            children: [{ type: 'img', props: { class: "icon", src: WIcons["delete"] } }],
                            props: {
                                class: "BtnTableA",
                                type: "button",
                                onclick: async () => {
                                    this.shadowRoot.append(WRender.createElement({
                                        type: "w-modal-form",
                                        props: {
                                            icon: this.TableConfig.icon,
                                            title: "Eliminar",
                                            id: "Alert" + this.id,
                                            ObjectModal: { type: "h5", children: ["¿Esta seguro de eliminar este elemento?"] },
                                            ObjectOptions: {
                                                Url: this.Options.UrlDelete,
                                                SaveFunction: () => {
                                                    const index = Dataset.indexOf(element);
                                                    if (WArrayF.FindInArray(element, Dataset) == true) {
                                                        ;
                                                        Dataset.splice(index, 1);
                                                        this.DrawTable();
                                                    } else { console.log("No Object") }
                                                }
                                            }
                                        }
                                    }));
                                }
                            }
                        })
                    }
                    if (this.Options.UserActions != undefined) {
                        this.Options.UserActions.forEach(Action => {
                            Options.children.push({
                                type: "button",
                                props: {
                                    class: "BtnTableSR",
                                    type: "button",
                                    innerText: Action.name,
                                    onclick: async (ev) => {
                                        Action.Function(element, ev.target);
                                    }
                                }
                            })
                        });
                    }
                    tr.children.push(Options);
                }
            }

            if (this.numPage > 1 && tbody.children[page] &&
                (this.paginate == true && Dataset.length > this.maxElementByPage)) {
                tbody.children[page].children.push(tr);
                if (tbody.children[page].children.length == this.maxElementByPage) {
                    page++;
                }
            } else {
                tbody.children.push(tr);
            }
        });
        if (tbody.children.length == 0) {
            tbody.children.push({ type: "h5", props: { innerText: "No hay elementos que mostrar" } });
        }
        this.shadowRoot.append(WRender.createElement(this.MediaStyleResponsive()));
        return tbody;
    }
    DrawTFooter(tbody) {
        let tfooter = [];
        this.ActualPage = 0;
        const SelectPage = (index) => {
            let bodys = this.shadowRoot.querySelectorAll("#MainTable" + this.id + " tbody");
            bodys.forEach((body, indexBody) => {
                if (indexBody == index) {
                    if (this.TableConfig.StyleType == "Cards") {
                        body.style.display = "flex";
                    } else if (this.TableConfig.StyleType == "Grid") {
                        body.style.display = "grid";
                    } else {
                        body.style.display = "contents";
                    }
                } else {
                    body.style.display = "none";
                }
            });
            let buttons = this.shadowRoot.querySelectorAll(".tfooter a");
            this.ActualPage = index;
            buttons.forEach((button, indexBtn) => {
                if (indexBtn == index) {
                    button.className = "paginateBTN paginateBTNActive";
                } else if (index > 8 && indexBtn < (index - 7)) {
                    button.className = "paginateBTN paginateBTNHidden";
                } else {
                    button.className = "paginateBTN";
                }
            });
        }
        /*if (tbody.length == 0) {
            return tfooter;
        }*/
        tfooter.push({
            type: "label",
            props: {
                innerText: "<<",
                class: "pagBTN",
                onclick: () => {
                    this.ActualPage = this.ActualPage - 1;
                    if (this.ActualPage < 0) {
                        this.ActualPage = tbody.length - 1;
                    }
                    SelectPage(this.ActualPage);
                }
            }
        });
        const tfooterNumbers = { type: 'div', props: { class: 'tfooterNumbers' }, children: [] }
        for (let index = 0; index < this.numPage; index++) {
            let btnClass = "paginateBTN";
            if (index == 0) {
                btnClass = "paginateBTN paginateBTNActive";
            } else if ((index) > 20) {
                btnClass = "paginateBTN paginateBTNHidden";
            } else {
                btnClass = "paginateBTN";
            }
            tfooterNumbers.children.push({
                type: "a",
                props: {
                    id: "footBtn" + (index + 1),
                    innerText: index + 1,
                    class: btnClass,
                    onclick: () => {
                        SelectPage(index);
                    }
                }
            });
        }
        tfooter.push(tfooterNumbers);
        tfooter.push({
            type: "label",
            props: {
                innerText: ">>",
                class: "pagBTN",
                onclick: () => {
                    this.ActualPage = this.ActualPage + 1;
                    if (this.ActualPage > tbody.length - 1) {
                        this.ActualPage = 0;
                    }
                    SelectPage(this.ActualPage);
                }
            }
        });
        return tfooter;
    }
    //#endregion fin tabla basica
    //FIN BASIOC TABLE-------------------------------------------------------------------
    //#region TABLA DINAMICA-------------------------------------------------------------
    DrawGroupTable() {
        this.groupParams.forEach(groupParam => {
            this.GroupsData.push(WArrayF.ArrayUnique(this.TableConfig.Datasets, groupParam))
        });
        this.table = { type: "div", props: { id: "MainTable" + this.id, class: this.TableClass }, children: [] };
        let div = this.DrawGroupDiv(this.ChargeGroup(this.GroupsData))
        this.table.children.push(div);
        let divTableCntainer = { type: "div", props: { class: "tableContainer" }, children: [this.table] };
        this.shadowRoot.append(WRender.createElement(div));
    }
    ChargeGroup = (Groups, inicio = 0) => {
        if (!Groups[inicio]) {
            return null;
        }
        let ObjGroup = {
            data: Groups[inicio],
            groupParam: this.groupParams[inicio],
            children: this.ChargeGroup(Groups, inicio + 1)
        }
        return ObjGroup;
    }
    AttEval = () => {
        let div = { type: "div", props: { class: "TContainerBlockL" }, children: [] };
        div.children.push({ type: "Tlabel", children: [this.AttNameEval] });
        if (this.EvalArray != null) {
            this.EvalArray.forEach(evalValue => {
                div.children.push({ type: "TData", children: [evalValue[this.AttNameEval]] });
            });
            div.children.push({ type: "TDataTotal", children: ["Total"] });
        }
        return div;
    }
    DrawGroupDiv = (Groups, div = { type: "div", props: { class: "TContainer" }, children: [this.AttEval()] }, arrayP = {}) => {
        //console.log(Groups)
        if (Groups == null) {
            return "";
        }
        Groups.data.forEach((Group) => {
            let trGroup = { type: "div", props: { class: "TContainerBlock" }, children: [] };
            trGroup.children.push({ type: "Tlabel", children: [Group[Groups.groupParam]] });
            /////
            let dataGroup = { type: "div", props: { class: "Cajon" }, children: [] };
            trGroup.children.push(dataGroup);
            arrayP[Groups.groupParam] = Group[Groups.groupParam];
            if (Groups.children != null) {
                if (Groups.children.children == null) {
                    trGroup.props.class = "flexChild";
                }
                this.DrawGroupDiv(Groups.children, dataGroup, arrayP);
            } else {
                trGroup.props.class = "TContainerBlockData";
                //let dataGroupeV = { type: "div", props: { class: "Cajon" }, children: [] };
                if (this.EvalArray != null) {
                    this.EvalArray.forEach(Eval => {
                        arrayP[this.AttNameEval] = Eval[this.AttNameEval];
                        const Data = this.FindData(arrayP)
                        dataGroup.children.push({ type: "TData", children: [Data] });
                        let NewObject = {};
                        for (const prop in arrayP) {
                            NewObject[prop] = arrayP[prop];
                        }
                        if (parseFloat(Data).toString() != "NaN") {
                            NewObject[this.EvalValue] = Data;
                            this.ProcessData.push(NewObject)
                        }
                    });
                    let sum = 0;
                    dataGroup.children.forEach(element => {
                        //console.log(element.children[0])
                        const value = parseFloat(element.children[0]);
                        if (typeof value === "number" && value.toString() != "NaN") {
                            sum = sum + value;
                        }
                    });
                    dataGroup.children.push({ type: "TDataTotal", children: [sum] });
                }
            }
            div.children.push(trGroup);
        });
        return div;
    }
    DefineTable(Dataset = this.Dataset) {
        this.ProcessData = [];
        this.TableConfig.Datasets = Dataset;
        let table = this.shadowRoot.querySelector("#MainTable" + this.id);
        let footer = this.shadowRoot.querySelector(".tfooter");
        if (typeof footer !== "undefined" && footer != null) {
            footer.innerHTML = "";
        }
        let thOptions = this.shadowRoot.querySelector(".thOptions");
        if (typeof thOptions !== "undefined" && thOptions != null) {
            thOptions.style.display = "none"
        }
        if (this.EvalValue == null) {
            //table.innerHTML = "Agregue un Value";
            this.DrawTable(Dataset);
        } else {
            this.EvalArray = WArrayF.ArrayUnique(Dataset, this.AttNameEval);
            table.innerHTML = "";
            this.GroupsData = [];
            table.style.display = "flex";
            //console.log(Dataset)
            //console.log(this.Dataset)
            this.groupParams.forEach(groupParam => {
                this.GroupsData.push(WArrayF.ArrayUnique(Dataset, groupParam))
            });
            let div = this.DrawGroupDiv(this.ChargeGroup(this.GroupsData))
            table.append(WRender.createElement(div));
        }
        if (this.TableConfig.AddChart == true && this.EvalValue != null) {
            let ChartContainer = this.shadowRoot.querySelector("#Chart" + this.id);
            ChartContainer.innerHTML = "";
            ChartContainer.append(WRender.createElement(this.DrawChart()));
        }
    }
    TableOptions = () => {
        if (this.shadowRoot.querySelector("#TableOptionstable")) {
            return "";
        }
        const drop = (ev) => {
            ev.preventDefault();
            var data = ev.dataTransfer.getData("text");
            let target = ev.target;
            let control = this.shadowRoot.querySelector("#" + data);
            //console.log(control.parentNode);
            const OriginalParent = control.parentNode.id;
            if (control == null) {
                console.log("error", target.parentNode.id, "TableOptions" + this.id)
                return;
            }
            if (target.className == "TableOptionsAtribs") {
                if (target.id.includes("ListEval")) {
                    if (target.children.length == 2) {
                        console.log("entro1");
                        return;
                    }
                    this.AttNameEval = this.shadowRoot.querySelector("#" + data).innerText;
                    this.EvalArray = WArrayF.ArrayUnique(this.TableConfig.Datasets, this.AttNameEval);
                    let find = this.groupParams.find(a => a == this.shadowRoot.querySelector("#" + data).innerText);
                    if (find) {
                        this.groupParams.splice(this.groupParams.indexOf(find), 1);
                    }
                } else if (target.id.includes("ListValue")) {
                    if (target.children.length == 2) {
                        //console.log("entro1");
                        return;
                    }
                    this.EvalValue = this.shadowRoot.querySelector("#" + data).innerText;
                    let find = this.groupParams.find(a => a == this.shadowRoot.querySelector("#" + data).innerText);
                    if (find) {
                        this.groupParams.splice(this.groupParams.indexOf(find), 1);
                    }
                } else if (target.id.includes("ListGroups")) {
                    if (target.children.length == 4) {
                        console.log("Grupos excedidos");
                        return;
                    }
                    let find = this.groupParams.find(a => a == this.shadowRoot.querySelector("#" + data).innerText);
                    if (!find) {
                        this.groupParams.push(this.shadowRoot.querySelector("#" + data).innerText);
                    }
                } else if (target.id.includes("ListAtribs")) {
                    let find = this.groupParams.find(a => a == this.shadowRoot.querySelector("#" + data).innerText);
                    if (find) {
                        this.groupParams.splice(this.groupParams.indexOf(find), 1);
                    }
                }
                target.appendChild(this.shadowRoot.querySelector("#" + data));
                if (OriginalParent.includes("ListEval")) {
                    this.AttNameEval = null;
                    this.EvalArray = null;
                }
                if (OriginalParent.includes("ListValue")) {
                    this.EvalValue = null;
                }
                if (OriginalParent.includes("ListGroups")) {
                    this.groupParams = [];
                    const Parent = this.shadowRoot.querySelector("#" + OriginalParent);
                    Parent.querySelectorAll(".labelParam").forEach(element => {
                        this.groupParams.push(element.innerText);
                    });
                }
                this.DefineTable();
            } else {
                console.log("error")
            }
        }
        const allowDrop = (ev) => { ev.preventDefault(); }
        const drag = (ev) => { ev.dataTransfer.setData("text", ev.target.id); }
        let divAtt = {
            type: "div",
            props: {
                class: "TableOptionsAtribs",
                id: this.id + "ListAtribs",
                ondrop: drop,
                ondragover: allowDrop
            },
            children: [{
                type: "label",
                props: { innerText: "Parametros", class: "titleParam" }
            }]
        };
        let model = this.Dataset[0];
        for (const props in model) {
            divAtt.children.push({
                type: "label",
                children: [props],
                props: {
                    id: props + this.id,
                    class: "labelParam",
                    draggable: true,
                    ondragstart: drag
                }
            });
        }
        let divEvalAttib = {
            type: "div",
            props: {
                class: "TableOptionsAtribs",
                id: this.id + "ListEval",
                ondrop: drop,
                ondragover: allowDrop
            },
            children: [{
                type: "label",
                props: { innerText: "Evaluación", class: "titleParam" }
            }]
        };
        let select = {
            type: "select",
            props: {
                id: "Select" + this.id,
                class: "titleParam",
                onchange: () => { this.DefineTable(); }
            },
            children: [
                { type: "option", props: { innerText: "Value - Suma", value: "sum" } },
                { type: "option", props: { innerText: "Value - Count", value: "count" } }
            ]
        }
        let divEvalValue = {
            type: "div",
            props: {
                class: "TableOptionsAtribs",
                id: this.id + "ListValue",
                ondrop: drop,
                ondragover: allowDrop
            },
            children: [select]
        };
        let divEvalGroups = {
            type: "div",
            props: {
                class: "TableOptionsAtribs",
                id: this.id + "ListGroups",
                ondrop: drop,
                ondragover: allowDrop
            },
            children: [{
                type: "label",
                props: { innerText: "Agrupaciones", class: "titleParam" },
                children: [/*{
                    type: "label",
                    props: {
                        innerText: "»",
                        class: "btn",
                        onclick: () => {
                            const elementS = this.shadowRoot.querySelector("#TableOptions" + this.id)
                            ComponentsManager.DisplayAcorden(elementS, 38);
                        }
                    }
                }*/]
            }]
        };
        return {
            type: "div",
            props: { class: "TableOptions", id: "TableOptions" + this.id },
            children: [divAtt, divEvalAttib, divEvalValue, divEvalGroups]
        };
    }
    DrawChart() {
        /*if (this.shadowRoot.querySelector("#TableOptionstable")) {
            return "";
        }*/
        if (this.groupParams.length > 0 && this.EvalArray != null) {
            let GroupLabelsData = [];
            this.EvalArray.forEach(element => {
                GroupLabelsData.push({
                    id_: element[this.AttNameEval],
                    Descripcion: element[this.AttNameEval]
                });
            });
            if (this.TableConfig.TypeChart == undefined) {// bar or staked
                this.TableConfig.TypeChart = "bar";
            }
            var CharConfig = {
                ContainerName: "MyChart",
                Title: "MyChart",
                TypeChart: this.TableConfig.TypeChart,
                GroupLabelsData: GroupLabelsData,
                GroupDataset: this.EvalArray,
                Datasets: this.ProcessData,
                Colors: this.Colors,
                ContainerSize: 400,
                ColumnLabelDisplay: 0,
                AttNameEval: this.AttNameEval,
                AttNameG1: this.groupParams[0],
                AttNameG2: this.groupParams[1],
                AttNameG3: this.groupParams[2],
                EvalValue: this.EvalValue,
            };

            return { type: 'w-colum-chart', props: { data: CharConfig } };
        }
        return "No hay agrupaciones";
    }
    FindData(arrayP) {
        let val = false;
        let nodes = [];
        this.TableConfig.Datasets.forEach(Data => {
            val = WArrayF.compareObj(arrayP, Data)
            if (val == true) {
                nodes.push(Data)
            }
        });
        if (nodes.length != []) {
            let Operations = this.shadowRoot.querySelector("#Select" + this.id);
            let value = "fail!";
            if (Operations != null) {
                if (Operations.value == "sum") {
                    value = WArrayF.SumValAtt(nodes, this.EvalValue);
                } else if (Operations.value == "count") {
                    value = nodes.length;
                }
            } else {
                value = WArrayF.SumValAtt(nodes, this.EvalValue);
            }
            return value;
        } else {
            return "n/a";
        }
    }
    //#endregion FIN TABLA DINAMICA---------------------------------------------------------------------------
    //ESTILOS-------------------------------------------------------###################
    //#region ESTILOS-------------------------------------------------------------------------------------------
    MediaStyleResponsive() {
        if (this.shadowRoot.querySelector("MediaStyleResponsive" + this.id)) {
            this.removeChild(this.shadowRoot.querySelector("MediaStyleResponsive" + this.id));
        }
        const ClassList = [];
        let index = 1;
        for (const prop in this.ModelObject) {
            const flag = this.checkDisplay(prop);
            if (flag) {
                if (!prop.includes("Photo") &&
                    !prop.includes("img") &&
                    !prop.includes("image") &&
                    !prop.includes("Image") &&
                    !prop.includes("Pict") &&
                    !prop.includes("_hidden")) {
                    ClassList.push(new WCssClass(`td:nth-of-type(${index}):before`, {
                        content: `"${prop}:"`,
                        "margin-right": "10px"
                    }))
                }
                index++;
            }
        }
        if (this.TableConfig.StyleType != undefined
            && this.TableConfig.StyleType.includes("Cards")) {
            return {
                type: "w-style",
                props: { ClassList: ClassList }
            }
        }
        return {
            type: "w-style",
            props: {
                id: "MediaStyleResponsive" + this.id,
                MediaQuery: [{
                    condicion: "(max-width: 600px)",
                    ClassList: ClassList
                }]
            }
        }
    }
    TableStyle() {
        const style = this.shadowRoot.querySelector("#TableStyle" + this.id);
        if (style) {
            style.parentNode.removeChild(style);
        }
        const WTableStyle = {
            type: "w-style",
            props: {
                id: "TableStyle" + this.id,
                ClassList: [
                    //ESTILOS GENERALES-----------------------------------
                    new WCssClass(`#${this.id}`, {
                        border: "#999999 2px solid",
                        overflow: "hidden",
                        display: "block",
                        "border-radius": "0.2cm",
                        "min-height": "50px",
                    }),
                    //ESTILO DE LA TABLA BASICA----------------------------tableContainer
                    new WCssClass(`.tableContainer`, {
                        overflow: "auto"
                    }), new WCssClass(`.WTable`, {
                        "font-family": "Verdana, sans-serif",
                        width: "100%",
                        "border-collapse": "collapse",
                        "font-size": "12px",
                        position: "relative"
                    }), new WCssClass(`.WTable th`, {
                        padding: "0.5rem",
                        "text-align": "left",
                        border: "1px #ccc solid"
                    }), new WCssClass(`.WTable td`, {
                        padding: "0.25rem",
                        "text-align": "left",
                        border: "1px #ccc solid"
                    }), new WCssClass(`.WTable .tdAction`, {
                        "text-align": "center",
                        "width": "120px",
                    }), new WCssClass(`.WTable tbody tr:nth-child(odd)`, {
                        "background-color": "#f5f4f4"
                    }), new WCssClass(`.icon`, {
                        height: "16px", width: "16px", filter: "invert(1)",
                    })
                ],
                MediaQuery: [{
                    condicion: "(max-width: 600px)",
                    ClassList: [
                        new WCssClass(`divForm div`, {
                            width: "calc(100% - 10px)",
                            margin: "5px"
                        }), new WCssClass(`.WTable`, {
                            display: "block ", //width: "100%"
                        }), new WCssClass(`.WTable tbody`, {
                            display: "block ", //width: "100%"
                        }), new WCssClass(`.WTable thead`, {
                            display: "none ", //width: "100%"
                        }), new WCssClass(`.WTable tr`, {
                            display: "block ",
                            //border: "1px solid #999",
                            margin: "10px",
                            "border-radius": "0.3cm",
                            overflow: "hidden",
                            "box-shadow": "0 2px 5px 2px rgba(0,0,0,0.2)"
                        }), new WCssClass(`.WTable td`, {
                            display: "flex ",
                            "border-bottom": "1px solid #c5c5c5",
                            padding: "10px"
                            //width: "100%"
                        }), new WCssClass(`.WTable .tdAction`, {
                            display: "block ",
                            "justify-content": "center",
                            "align-items": "center",
                            width: "auto",
                            padding: "10px"
                        }) , new WCssClass(`.WTable tbody tr:nth-child(odd)`, {
                            "background-color": "#fff"
                        }),

                    ]
                }]
            }
        }
        return WTableStyle;
    }
    TableStyleDinamic() {
        const style = this.shadowRoot.querySelector("#TableStyleDinamic" + this.id);
        if (style) {
            style.parentNode.removeChild(style);
        }
        const WTableStyle = {
            type: "w-style",
            props: {
                id: "TableStyleDinamic" + this.id,
                ClassList: [
                    //ESTILO DE LA TABLA BASICA----------------------------tableContainer
                    new WCssClass(`.tableContainer`, {
                        overflow: "auto",
                        "grid-row": "1/2",
                    }), new WCssClass(`.WTable`, {
                        "font-family": "Verdana, sans-serif",
                        width: "100%",
                        "border-collapse": "collapse",
                        "font-size": "12px",
                        // "border-top": "solid 1px #999999",
                        position: "relative"
                    }), new WCssClass(`.WTable th`, {
                        padding: "0.5rem",
                        "text-align": "left",
                        border: "1px #ccc solid"
                    }), new WCssClass(`.WTable td`, {
                        padding: "0.25rem",
                        "text-align": "left",
                        border: "1px #ccc solid"
                    }), new WCssClass(`.WTable .tdAction`, {
                        "text-align": "center",
                        "width": "250px",
                    }), new WCssClass(`.WTable tbody tr:nth-child(odd)`, {
                        "background-color": "#f5f4f4"
                    }),
                    //FIN ESTILO TABLA BASICAA------------------------------
                    //flexcajones TABLA DINAMICA----------------------------
                    new WCssClass(`.TContainer`, {
                        padding: "0px",
                        display: "flex",
                        "flex-grow": 1,
                    }), new WCssClass(`.TContainerBlock`, {
                        width: "100%"
                    }), new WCssClass(" .TContainerBlockL", {
                        display: "flex",
                        "flex-direction": "column",
                        "justify-content": "flex-end",
                        "background-color": "rgb(236, 235, 235)",
                        "font-weight": "bold",
                    }), new WCssClass(" .TContainerBlockData", {
                        width: "100%"
                    }), new WCssClass(` Tlabel`, {
                        display: "block",
                        //padding: "5px",
                        "border-bottom": "1px solid #000",
                        //height: "30px",
                        "overflow-y": "hidden",
                        "white-space": "nowrap",
                        "overflow": "hidden",
                        "text-overflow": "ellipsis",
                        "min-width": "60px",
                        "background-color": "#d4d4d4",
                        color: "#000",
                        padding: "0.5rem",
                        "text-align": "left",
                        "font-weight": "bold",
                        border: "1px rgb(185, 185, 185) solid",
                    }), new WCssClass(`.TContainerBlockData .Cajon`, {
                        overflow: "hidden",
                        display: "flex",
                        "flex-direction": "column",
                    }), new WCssClass(`.flexChild`, {
                        padding: "0px",
                        width: "100%"
                    }), new WCssClass(`TData`, {
                        //padding: "5px",
                        //height: "30px",
                        "overflow-y": "hidden",
                        "white-space": "nowrap",
                        "overflow": "hidden",
                        "text-overflow": "ellipsis",
                        "min-width": "60px",
                        padding: "0.5rem",
                        "text-align": "left",
                        border: "1px #ccc solid"
                    }), new WCssClass(`TDataTotal`, {
                        "overflow-y": "hidden",
                        "white-space": "nowrap",
                        "overflow": "hidden",
                        "text-overflow": "ellipsis",
                        "min-width": "60px",
                        "border-top": "solid 1px #000",
                        "border-bottom": "solid 1px #000",
                        padding: "0.5rem",
                        "text-align": "left",
                        "font-weight": "bold",
                        border: "1px #ccc solid",
                    }), new WCssClass(`.Cajon`, {
                        display: "flex"
                    }),
                    //tABLA DINAMICA OPCIONES ------------------------------
                    new WCssClass(`.TableOptions`, {
                        display: "grid",
                        transition: "all 1s",
                        overflow: "hidden",
                        "grid-column": "2/3",
                        "grid-row": "1/4",
                        "grid-template-columns": "49% 49%",
                        "grid-template-rows": "49% 49%",
                    }), new WCssClass(`.TableOptionsAtribs`, {
                        display: "flex",
                        width: "100%",
                        "flex-direction": "column",
                        "padding-bottom": "20px",
                        "background-color": "#efefef",
                        "border": "1px #cbc9c9 solid"
                    }), new WCssClass(`.titleParam`, {
                        display: "flex",
                        "background-color": "#4da6ff",
                        color: "#fff",
                        "margin-bottom": "10px",
                        cursor: "pointer",
                        "text-align": "center",
                        position: "relative",
                        height: "30px",
                        "min-height": "30px",
                        "max-height": "30px",
                        "align-items": "center",
                        "justify-content": "center",
                    }), new WCssClass(`select.titleParam, select.titleParam:focus, select.titleParam:active`, {
                        cursor: "pointer",
                        "background-color": "#4da6ff",
                        border: "none",
                        color: "#fff",
                        outline: "none", padding: "5px",
                        "outline-width": "0",
                        margin: "0px",
                        font: "400 12px Arial",
                        "margin-bottom": "10px",
                    }), new WCssClass(`.labelParam`, {
                        display: "block",
                        padding: "5px",
                        "background-color": "#fff",
                        cursor: "pointer",
                        border: "solid 3px #efefef"
                    }), new WCssClass(`.btn`, {
                        "margin-left": "10px",
                        cursor: "pointer",
                        display: "inline-block",
                        "font-weight": "bold",
                        position: "absolute",
                        transform: "rotate(90deg)"
                    }), new WCssClass(`.txtControl`, {
                        "display": "block",
                        "width": "100%",
                        "padding": ".375rem .75rem",
                        "font-size": "1rem",
                        "line-height": "1.5",
                        "color": "#495057",
                        "background-color": "#fff",
                        "background-clip": "padding-box",
                        "border": "1px solid #ced4da !important",
                        "border-radius": ".25rem",
                        "transition": "border-color .15s ease-in-out,box-shadow .15s ease-in-out",
                    }), new WCssClass(`.tfooter`, {
                        "grid-row": "2/3",
                        height: "40px"
                    }), new WCssClass(`.CharttableReport`, {
                        "grid-row": "3/4",
                    }),

                ],
                MediaQuery: [{
                    condicion: "(max-width: 600px)",
                    ClassList: [
                        new WCssClass(`divForm div`, {
                            width: "calc(100% - 10px)",
                            margin: "5px"
                        }), new WCssClass(`.WTable`, {
                            display: "block ", //width: "100%"
                        }), new WCssClass(`.WTable tbody`, {
                            display: "block ", //width: "100%"
                        }), new WCssClass(`.WTable thead`, {
                            display: "none ", //width: "100%"
                        }), new WCssClass(`.WTable tr`, {
                            display: "block ",
                            border: "5px solid #808080"
                        }), new WCssClass(`.WTable td`, {
                            display: "flex ",
                            //width: "100%"
                        }), new WCssClass(`.WTable .tdAction`, {
                            display: "flex ",
                            width: "calc(98% - 0.25rem)",
                            "justify-content": "center",
                            "align-items": "center"
                        }), new WCssClass(`.WTable tbody tr:nth-child(odd)`, {
                            "background-color": "#f9f9f9"
                        }),

                    ]
                }]
            }
        }
        return WTableStyle;
    }
    TableCardStyle() {
        const style = this.shadowRoot.querySelector("#TableCardStyle" + this.id);
        if (style) {
            style.parentNode.removeChild(style);
        }
        const WTableStyle = {
            type: "w-style",
            props: {
                id: "TableCardStyle" + this.id,
                ClassList: [
                    //ESTILOS GENERALES-----------------------------------
                    new WCssClass(`#${this.id}`, {
                        //border: "#999999 2px solid",
                        overflow: "hidden",
                        display: "block",
                        "border-radius": "0.2cm",
                        "min-height": "50px",
                    }),
                    new WCssClass(`.tableContainer`, {
                        overflow: "auto"
                    }), new WCssClass(`.WTable`, {
                        "font-family": "Verdana, sans-serif",
                        width: "100%",
                        "border-collapse": "collapse",
                        //"border-top": "solid 1px #999999",
                        position: "relative",
                        display: "flex !important",
                        "flex-direction": "column"
                    }), new WCssClass(`.tableContainer thead`, {
                        display: "none",
                    }), new WCssClass(`.tableContainer tbody`, {
                        display: "flex",
                        padding: "20px"
                    }),
                    new WCssClass(`.tableContainer tbody tr`, {
                        //display: "inline-block !important",
                        display: "grid !important",
                        "grid-template-rows": "auto",
                        overflow: "hidden",
                        width: "250px",
                        border: "solid 1px #cbcbcb",
                        "border-radius": "0.2cm",
                        height: "300px",
                        padding: "10px",
                        margin: "10px",
                        "min-width": "220px",
                        position: "relative",
                        "box-shadow": "1px 2px 3px 0px rgb(0 0 0 / 10%)",
                    }), new WCssClass(`.tableContainer td`, {
                        "white-space": "nowrap",
                        "overflow": "hidden",
                        "text-overflow": "ellipsis",
                        //display: "block",
                    }), new WCssClass(`.tableContainer .tdImage`, {
                        "width": "100%",
                        "overflow": "hidden",
                        "grid-row": "1/2",
                    }), new WCssClass(`.tableContainer .tdAction`, {
                        display: "block",
                        //position: "absolute",
                        bottom: 0,
                        padding: "10px 0px",
                        "text-align": "center",
                        "width": "100%",
                        "left": "0",
                        "background-color": "#eee",
                        "border-top": "solid 3px #cbcbcb",
                        //height: "35px"
                    })
                    //TOPCION
                ],
            }
        }
        return WTableStyle;
    }
    TableCardStyle2() {
        const style = this.shadowRoot.querySelector("#TableCardStyle2" + this.id);
        if (style) {
            style.parentNode.removeChild(style);
        }
        const WTableStyle = {
            type: "w-style",
            props: {
                id: "TableCardStyle2" + this.id,
                ClassList: [
                    //ESTILOS GENERALES-----------------------------------
                    new WCssClass(`#${this.id}`, {
                        //border: "#999999 2px solid",
                        overflow: "hidden",
                        display: "block",
                        "border-radius": "0.2cm",
                        "min-height": "50px",
                    }),
                    new WCssClass(`.tableContainer`, {
                        overflow: "auto"
                    }), new WCssClass(`.WTable`, {
                        "font-family": "Verdana, sans-serif",
                        width: "100%",
                        "border-collapse": "collapse",
                        "border-top": "solid 1px #999999",
                        position: "relative",
                        display: "flex !important",
                        "flex-direction": "column"
                    }), new WCssClass(`.tableContainer thead`, {
                        display: "none",
                    }), new WCssClass(`.tableContainer tbody`, {
                        display: "grid",
                        padding: "20px"
                    }),
                    new WCssClass(`.tableContainer tbody tr`, {
                        display: "grid !important",
                        overflow: "hidden",
                        "grid-template-columns": "auto auto auto auto",
                        "grid-template-rows": "auto",
                        //width: "250px", 
                        border: "solid 1px #999",
                        "border-radius": "0.2cm",
                        //height: "360px",
                        padding: "10px",
                        margin: "10px",
                        "min-width": "200px",
                        position: "relative"
                    }), new WCssClass(`.tableContainer td`, {
                        display: "block",
                        "grid-column": "2/5",
                        padding: "8px",
                        "text-align": "justify",
                    }), new WCssClass(`.tableContainer .tdAction`, {
                        padding: "10px 0px",
                        "text-align": "center",
                        "background-color": "#eee",
                        "border-top": "solid 3px #999999",
                        "grid-column": "1/5",
                    }), new WCssClass(`.tableContainer tr .tdImage`, {
                        "grid-row": "1/6",
                        "grid-column": "1/2",
                        height: "100% !important",
                        //"min-height": "400px"
                        padding: "0px"
                    }),
                    //TOPCION

                ],
            }
        }
        return WTableStyle;
    }
    TableCardStyle3() {
        const style = this.shadowRoot.querySelector("#TableCardStyle3" + this.id);
        if (style) {
            style.parentNode.removeChild(style);
        }
        const WTableStyle = {
            type: "w-style",
            props: {
                id: "TableCardStyle3" + this.id,
                ClassList:  [
                    new WCssClass(`divForm div`, {
                        width: "calc(100% - 10px)",
                        margin: "5px"
                    }), new WCssClass(`.WTable`, {
                        display: "block ", //width: "100%"
                    }), new WCssClass(`.WTable tbody`, {
                        "font-size": "12px",
                        display: "flex",
                        "overflow-x": "scroll"
                    }), new WCssClass(`.WTable thead`, {
                        display: "none ", //width: "100%"
                    }), new WCssClass(`.WTable tr`, {
                        display: "grid",
                        "grid-template-columns": "auto auto",
                        width: "23%",
                        "min-width": "340px",
                        margin: "10px",
                        "border-radius": "0.3cm",
                        overflow: "hidden",
                        "box-shadow": "0 2px 5px 2px rgba(0,0,0,0.2)"
                    }),  new WCssClass(`.WTable td`, {
                        //"grid-column": "2/3"
                    }),new WCssClass(`.WTable .tdImage`, {
                        "grid-column": "1/2"
                    }),new WCssClass(`.WTable td`, {
                        display: "flex ",
                        "border-bottom": "1px solid #c5c5c5",
                        padding: "10px"
                        //width: "100%"
                    }), new WCssClass(`.WTable .tdAction`, {
                        display: "block ",
                        "justify-content": "center",
                        "align-items": "center",
                        width: "auto",
                        padding: "10px"
                    }), , new WCssClass(`.WTable tbody tr:nth-child(odd)`, {
                        "background-color": "#fff"
                    }),

                ]
            }
        }
        return WTableStyle;
    }
    TableCardStyle2ColumnX2() {
        const style = this.shadowRoot.querySelector("#TableCardStyle2ColumnX2" + this.id);
        if (style) {
            style.parentNode.removeChild(style);
        }
        const WTableStyle = {
            type: "w-style",
            props: {
                id: "TableCardStyle2" + this.id,
                ClassList: [
                    //ESTILOS GENERALES-----------------------------------
                    new WCssClass(`.tableContainer tbody`, {
                        display: "grid",
                        padding: "20px",
                        "grid-template-columns": "auto auto"
                    })
                    //TOPCION
                ],
            }
        }
        return WTableStyle;
    }
    TableGridStyle() {
        const style = this.shadowRoot.querySelector("#TableGridStyle" + this.id);
        if (style) {
            style.parentNode.removeChild(style);
        }
        const WTableStyle = {
            type: "w-style",
            props: {
                id: "TableGridStyle" + this.id,
                ClassList: [
                    //ESTILOS GENERALES-----------------------------------
                    new WCssClass(`#${this.id}`, {
                        // border: "#999999 2px solid",
                        overflow: "hidden",
                        display: "block",
                        //"border-radius": "0.2cm",
                        "min-height": "50px",
                    }),
                    new WCssClass(`.tableContainer`, {
                        overflow: "auto",
                    }), new WCssClass(`.WTable`, {
                        "font-family": "Verdana, sans-serif",
                        width: "100%",
                        "border-collapse": "collapse",
                        position: "relative",
                        display: "flex !important",
                        "flex-direction": "column"
                    }), new WCssClass(`.tableContainer thead`, {
                        display: "none",
                    }), new WCssClass(`.tableContainer tbody`, {
                        display: "grid",
                        "grid-template-columns": "auto auto auto auto",
                        "grid-gap": "20px",
                        padding: "20px"
                    }),
                    new WCssClass(`.tableContainer tbody tr`, {
                        display: "inline-block !important",
                        overflow: "hidden",
                        width: "100%",
                        height: "250px",
                        position: "relative",
                    }), new WCssClass(`.firstTR`, {
                        "grid-row": "1/3",
                        "grid-column": "1/3",
                        height: "100% !important",
                        "min-height": "400px"
                    }), new WCssClass(`.tbodyChild tr:nth-of-type(1)`, {
                        "grid-row": "1/3",
                        "grid-column": "1/3",
                        height: "100% !important",
                        "min-height": "400px"
                    }),
                    new WCssClass(`.tableContainer td`, {
                        display: "block",
                        "z-index": 2,
                        position: "absolute",
                        "background-color": "rgba(0,0,0,0.5)",
                        color: "#fff",
                        padding: "10px",
                    }),
                    new WCssClass(`.tableContainer tr .tdImage`, {
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        "z-index": 0,
                        //display: "block",
                        padding: "0px"
                    }),
                    new WCssClass(`.tableContainer .tdAction`, {
                        display: "block",
                        position: "absolute",
                        bottom: 0,
                        padding: "10px 0px",
                        "text-align": "center",
                        "width": "100%",
                        "left": "0",
                        "background-color": "rgba(0,0,0,0.5)",
                        //"border-top": "solid 3px #999999"
                    }), new WCssClass(`.imgPhoto`, {
                        "width": "120px",
                        "border-radius": "0.2cm",
                        "height": "120px",
                        "size": "100%",
                        "object-fit": "cover",
                    })
                    //TOPCION

                ],
                MediaQuery: [{
                    condicion: "(max-width: 1100px)",
                    ClassList: [
                        new WCssClass(`.tableContainer tbody`, {
                            display: "grid",
                            "grid-template-columns": "auto auto auto"
                        }),
                    ]
                }, {
                    condicion: "(max-width: 700px)",
                    ClassList: [
                        new WCssClass(`.tableContainer tbody`, {
                            display: "grid",
                            "grid-template-columns": "auto auto"
                        }),
                    ]
                },]
            }
        }
        return WTableStyle;
    }
    PaginateTOptionsStyle() {
        const style = this.shadowRoot.querySelector("#PaginateTOptionsStyle" + this.id);
        if (style) {
            style.parentNode.removeChild(style);
        }
        const WTableStyle = {
            type: "w-style",
            props: {
                id: "PaginateTOptionsStyle" + this.id,
                ClassList: [
                    new WCssClass(`.thOptions`, {
                        display: "flex",
                        //width: "100%",
                        overflow: "hidden",
                        border: "solid #d4d4d4 1px",
                        "margin-bottom": "10px",
                    }), new WCssClass(`input[type=text], 
                                        input[type=string], 
                                        input[type=number],
                                        input[type=date]`, {
                        padding: "8px",
                        border: "none",
                        "border-bottom": "3px solid #999999",
                        width: "calc(100% - 16px)",
                        "font-size": "15px",
                        height: "20px"
                    }), new WCssClass(`input:active, input:focus`, {
                        "border-bottom": "3px solid #0099cc",
                        outline: "none",
                    }), new WCssClass(`input[type=button]`, {
                        cursor: "pointer",
                        width: "calc(100% - 0px)",
                        height: "initial"
                    }),
                    //PAGINACION****************************************************
                    new WCssClass(`.paginateBTN`, {
                        display: "inline-block",
                        padding: "5px",
                        //"background-color": "#09f",
                        color: "#888888",
                        "margin": "5px",
                        cursor: "pointer",
                        "border-radius": "0.2cm",
                        //"font-weight": "bold",
                        transition: "all 0.6s"
                    }), new WCssClass(`.paginateBTNHidden`, {
                        display: "none",
                    }), new WCssClass(`.paginateBTNActive`, {
                        //"background-color": "rgb(3, 106, 175)",
                        "font-weight": "bold",
                        color: "#444444",
                    }), new WCssClass(`.pagBTN`, {
                        display: "inline-block",
                        padding: "5px",
                        //"background-color": "rgb(3, 106, 175)",
                        color: "#888888",
                        "margin": "5px",
                        cursor: "pointer",
                        "border-radius": "0.2cm",
                        "font-weight": "bold",
                        transition: "all 0.6s",
                        //width: "80px",
                        "text-align": "center",
                    }), new WCssClass(`.tfooter`, {
                        display: "flex",
                        "border-bottom": "1px rgb(185, 185, 185) solid",
                        "justify-content": "flex-end",
                        "padding-left": "20px",
                        "padding-right": "20px",
                    }), new WCssClass(`.tfooterNumbers`, {
                        overflow: "hidden",
                        "max-width": "390px",
                        "text-overflow": "ellipsis",
                        "white-space": "nowrap",
                    }), new WCssClass(`h5`, {
                        padding: "0.25rem 5px",
                        "padding-left": "20px",
                        "padding-right": "20px",
                        margin: "0px",
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
                    //BOTONES
                    new WCssClass(`.BtnAlert,.BtnPrimary,
                                    .BtnSuccess,.BtnSecundary,.Btn`, {
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
                        "border-right": "rgb(3, 106, 175) 5px solid",
                    }), new WCssClass(`.BtnPrimary`, {
                        "color": "#fff",
                        "background-color": "007bff",
                        "border-right": "rgb(3, 106, 175) 5px solid",
                    }), new WCssClass(`.BtnAlert`, {
                        "color": "#fff",
                        "background-color": "#dc3545",
                        "border-right": "#7e1b25 5px solid",
                    }), new WCssClass(`.BtnSuccess`, {
                        "color": "#fff",
                        "background-color": "#28a745",
                        "border-right": "#165c26 5px solid",
                    }), new WCssClass(`.BtnSecundary`, {
                        "color": "#fff",
                        "background-color": "#17a2b8",
                        "border-right": "#0f5964 5px solid",
                    }), new WCssClass(`.Btn[type=checkbox]`, {
                        "height": "20px",
                        "min-width": "20px",
                        "margin": "5px",
                    }), new WCssClass(`.imgPhoto`, {
                        "width": "80px",
                        "border-radius": "50%",
                        "height": "80px",
                        "size": "100%",
                        display: "block",
                        margin: "auto",
                        "object-fit": "cover",
                        "box-shadow": "0 2px 5px 0 rgb(0 0 0 / 30%)",
                    }),
                    //SCROLLLLSSSSSSSSSS
                    new WCssClass("*::-webkit-scrollbar-thumb", {
                        "background": " #ccc",
                        "border-radius": " 4px",
                    }),
                    new WCssClass("*::-webkit-scrollbar-thumb:hover", {
                        "background": " #b3b3b3",
                        "box-shadow": " 0 0 3px 2px rgba(0, 0, 0, 0.2)",
                    }),
                    new WCssClass("*::-webkit-scrollbar-thumb:active ", {
                        "background-color": " #999999",
                    }),

                    new WCssClass("*::-webkit-scrollbar ", {
                        "width": " 8px",
                        "height": " 10px",
                        "margin": " 10px",
                    }),

                    new WCssClass("*::-webkit-scrollbar-track ", {
                        "background": " #e1e1e1",
                        "border-radius": " 4px",
                    }),
                    new WCssClass("*::-webkit-scrollbar-track:active ,*::-webkit-scrollbar-track:hover", {
                        "background": " #d4d4d4",
                    }),

                ]
            }
        }
        return WTableStyle;

    }
    //#endregion FIN ESTILOS-----------------------------------------------------------------------------------
}
const WIcons = {
    show2: "data:image/png;base64,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",
    delete: "data:image/png;base64,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",
    edit: "data:image/png;base64,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"
}
const Money = {
    Euro: "€",
    Dollar: "$",
    Cordoba: "C$"
}
customElements.define("w-table", WTableComponent);