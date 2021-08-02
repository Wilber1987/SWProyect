import { ComponentsManager, WAjaxTools, WArrayF, WRender } from "../WDevCore/WModules/WComponentsTools.js";
import { WCssClass } from "../WDevCore/WModules/WStyledRender.js";
import "../WDevCore/WComponents/WTableComponents.js";
import "../WDevCore/WComponents/WFilterControls.js";
import "../WDevCore/WComponents/WModalForm.js";
import { WSecurity } from "../WDevCore/WModules/WSecurity.js";
const DOMForoManager = new ComponentsManager();
export default class ForosView extends HTMLElement {
    constructor() {
        super();
        //this.attachShadow({ mode: "open" });
        this.className = "DocumentView";//InsertComent
        this.SelectedSeason = 0;
        this.urlGlobal = "http://seyfergames.mygamesonline.org/API/Foro.php/?function=TakePosts";
        this.urlNewPost = "http://seyfergames.mygamesonline.org/API/Foro.php/?function=NewPost";
        this.urlTakeComments = "http://seyfergames.mygamesonline.org/API/Foro.php/?function=TakePostsComents";
        this.urlNewComments = "http://seyfergames.mygamesonline.org/API/Foro.php/?function=InsertComment";
    }
    connectedCallback() {
        this.DrawComponent();
    }
    DrawComponent = async () => {
        this.innerHTML = "";
        let btnNew = [];
        btnNew = {
            type: 'input', props: {
                id: '', type: 'button', class: 'btn', value: 'New', onclick: async () => {
                    this.NewPost();
                }
            }
        }
        const ForoOptions = {
            type: 'div', props: { id: '', class: 'ForoOptions' }, children: [
                WRender.CreateStringNode("<h2>Foro</h2>"), btnNew
            ]
        };
        this.SearchControl = WRender.createElement({
            type: 'input',
            props: {
                id: '', type: 'text', class: 'txtSearch', placeholder: "Search...",
                onchange: () => {
                    this.GetPost();
                }
            }
        });
        const Search = {
            type: 'div', props: { id: '', class: 'ForoOptions' }, children: [this.SearchControl]
        };
        this.append(WRender.createElement(this.Style));
        this.append(WRender.createElement(ForoOptions));
        this.append(WRender.createElement(Search));
        this.Foros = WRender.createElement({ type: 'div', props: { id: '', class: 'ForoContainer' }, children: [] })
        this.append(this.Foros);
        this.GetPost();
    }
    GetPost = async () => {
        const Foros = await WAjaxTools.PostRequest(this.urlGlobal,
            { param: this.SearchControl.value }
        );
        this.Foros.innerHTML = "";
        if (Foros.data != undefined && Foros.data.__proto__ == Array.prototype) {
            Foros.data.forEach(Post => {
                const ForoDiv = WRender.createElement({
                    type: 'article', props: {
                        class: 'Foro', onclick: async () => {
                            console.log("open...");
                            this.ReadPost(Post);
                        }
                    }, children: [Post.title, Post.date, "Leer..."]
                });
                this.Foros.append(ForoDiv);
            });
        }
    }
    NewPost = async () => {
        if (!WSecurity.Auth()) {
            WSecurity.LoginIn();
            return;
        }
        const MyObject = {
            title: "",
            body: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`
        }
        const Modal = WRender.createElement({
            type: "w-modal-form",
            props: {
                ObjectModel: MyObject,
                ObjectOptions: {
                    AddObject: true,
                    SaveFunction: async (objParam) => {
                        const response = await WAjaxTools.PostRequest(this.urlNewPost, objParam);
                        if (response.success == "true") {
                            this.GetPost();
                        }
                    }
                }
            }
        });
        this.append(WRender.createElement(Modal))
    }
    ReadPost = async (Post) => {
        const ForoDiv = WRender.createElement({
            type: 'div', props: { id: '', class: 'PostContainer' },
            children: [WRender.CreateStringNode(`<h1>${Post.title}</h1>`), Post.body, Post.date]
        });
        const CommentContainer = WRender.createElement({
            type: 'div', props: { id: '', class: 'CommentContainer' },
            children: []
        });
        await this.TakeComments(Post, CommentContainer);
        const txtComment = WRender.createElement({ type: 'textarea', props: { class: 'txtCommet' } });
        const NewComment = WRender.createElement({
            type: 'div', props: { id: '', class: 'PostContainer' }, children: [txtComment, {
                type: 'input', props: {
                    id: '', type: 'button', class: 'btn', value: 'New comment', onclick: async () => {
                        if (txtComment.value.length < 10) {
                            alert("un comentario debe poseer al menos 10 caracteres/a comment must have at least 10 characters");
                            return;
                        }
                        this.NewComment(Post, txtComment.value, "null");
                    }
                }
            }]
        })
        const Modal = WRender.createElement({
            type: "w-modal-form",
            props: {
                ShadowRoot: false,
                ObjectModal: [ForoDiv, NewComment, CommentContainer]
            }
        });
        this.append(WRender.createElement(Modal))
    }
    NewComment = async (Post = {}, body = "", id_reply = "null") => {
        if (!WSecurity.Auth()) {
            WSecurity.LoginIn();
            return;
        }
        const comment = {
            body: body,
            id_post: Post.id_post,
            id_user: WSecurity.User().id_user,
            id_reply: id_reply
        }
        const response = await WAjaxTools.PostRequest(this.urlNewComments, comment);
        if (response.success == "true") {
            this.ReadPost(Post);
        }

    }
    TakeComments = async (Post, CommentContainer) => {
        CommentContainer.innerHTML = "";
        const Comments = await WAjaxTools.PostRequest(this.urlTakeComments,
            { param: Post.id_post }
        );        
        Comments.data.forEach(comment => {
            const txtReply = {
                type: 'textarea', props: {
                    placeholder: 'Reply...',  class: 'txtReply',
                    onchange: async (ev) => { 
                        if (txtComment.value.length < 10) {
                            alert("una respuesta debe poseer al menos 10 caracteres/a reply must have at least 10 characters");
                            return;
                        }
                        this.NewComment(Post, ev.target.value, comment.id_comment);
                    }
                }
            }
            const commentContainer = {
                type: 'div', props: { id: '', class: 'comment' },
                children: [
                    comment.id_user,
                    { type:'p', props: {  innerText: comment.body }}  ,
                    comment.date,
                    txtReply
                ]
            }
            CommentContainer.append(WRender.createElement(commentContainer))
        });
    }
    Style = {
        type: 'w-style', props: {
            id: '', ClassList: [
                new WCssClass(`.ForoOptions`, {
                    display: 'flex',
                    "justify-content": "space-between",
                    "margin-bottom": 10
                }), new WCssClass(`.txtSearch`, {
                    padding: "8px",
                    border: "none",
                    "border-bottom": "3px solid #999999",
                    width: "calc(100% - 16px)",
                    "font-size": "15px",
                    height: "20px",
                    "box-shadow": "0 0px 3px 0px rgb(0 0 0 / 30%)",
                }), new WCssClass(`.txtSearch:active, .txtSearch:focus`, {
                    "border-bottom": "3px solid #0099cc",
                    outline: "none",
                }), new WCssClass(".Foro", {
                    display: "grid",
                    "grid-template-columns": "auto auto",
                    "grid-template-rows": "auto auto",
                    padding: 10,
                    height: 50,
                    margin: 5,
                    border: "solid 1px #999",
                    "border-left": "solid 10px #999",
                }), new WCssClass(".Foro label:nth-of-type(1)", {
                    "font-weight": "bold",
                    "grid-column": "1/3",
                    overflow: "hidden",
                    flex: 2
                }), new WCssClass(".Foro label", {
                    //padding: 5,
                    overflow: "hidden"
                }), new WCssClass(".Foro label:nth-of-type(3)", {
                    color: "blue",
                }), new WCssClass(`.btn`, {
                    "font-weight": "bold",
                    "border": "none",
                    "padding": "5px 15px",
                    "margin": "2px",
                    "text-align": "center",
                    "display": "inline-block",
                    "min-width": "30px",
                    "font-size": "12px",
                    "cursor": "pointer",
                    "background-color": "#09f",
                    "color": "#fff",
                }), new WCssClass(`.PostContainer, .CommetContainer`, {
                    margin: 20,
                    "text-align": "justify"
                }), new WCssClass(`.CommentContainer`, {
                    margin: 20,
                    "border-top": "solid 2px #999",
                    "padding-top": 10,
                    "text-align": "justify"
                }), new WCssClass(`.txtCommet`, {
                    height: 60,
                    "box-shadow": "0 0px 3px 0px rgb(0 0 0 / 30%)",
                }),new WCssClass(`.comment`, {
                    padding: 10,
                    "background-color": "#eee",
                    margin: 5,
                    display: "flex",
                    "flex-direction": "column",
                    "font-size": 12,                    
                    'align-items': "flex-end",
                    "border-radius": "0.2cm"
                }),new WCssClass(`.comment label`, {                   
                    width: "100%",
                    "border-top": "solid 1px #c6c6c6",
                    "font-size": 10,
                    margin: 5,
                 }),new WCssClass(`.comment p`, {
                   "min-height": 30,
                   width: "100%",
                   padding: "10px 0px",
                   "border-top": "solid 1px #c6c6c6",
                }),new WCssClass(`.txtReply`, {
                    height: 30,
                    width: "70%",
                    "font-size": 12,    
                    "box-shadow": "0 0px 3px 0px rgb(0 0 0 / 30%)",
                }),
            ], MediaQuery: [{
                condicion: '(max-width: 600px)',
                ClassList: [
                    new WCssClass(".DataContainer", {
                        //"flex-direction": "column"
                    })
                ]
            }]
        }
    };
}
customElements.define("w-foro", ForosView);

