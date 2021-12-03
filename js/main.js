
// #1
function createElemWithText(tagName = "p", textContent = "", className = undefined){
    let element = document.createElement(tagName);
    element.textContent = textContent;
    if (className) {
        element.classList.add(className);
    }
    return element;
}

// #2
function createSelectOptions(users){
    if (!users){
        return undefined;
    }

    return users.map(user => {
        let optionElement = document.createElement("option");
        optionElement.value = user.id;
        optionElement.textContent = user.name;
        return optionElement;
    })
}

//#3
function toggleCommentSection(postId){
    if (!postId){
        return undefined;
    }
    let sectionElement = document.querySelector(`section[data-post-id="${postId}"]`);
    if (sectionElement){
        sectionElement.classList.toggle("hide")
        return sectionElement;
        
    }
    else {
        return null;
    }
}

//#4
function toggleCommentButton(postId){
    if (!postId){
        return undefined;
    }
    let buttonElement = document.querySelector(`button[data-post-id="${postId}"]`);
    if (buttonElement){
        buttonElement.textContent = buttonElement.textContent === "Show Comments" ? "Hide Comments" : "Show Comments";
    return buttonElement;
    }
    else {
        return null;
    }
}

// #5
function deleteChildElements(parentElement){
    if (!parentElement || !(parentElement instanceof HTMLElement)){
        return undefined;
    }
    let childVar = parentElement.lastElementChild;
    while (childVar){
        parentElement.removeChild(childVar);
        childVar = parentElement.lastElementChild;
    }
    return parentElement;


}

// #6
function addButtonListeners(){
    let myButtons = document.querySelectorAll("main button");
    if (myButtons){
        for (let button of myButtons){
            const postId = button.dataset.postId;
            button.addEventListener("click", function (event){
                toggleComments(event, postId);
            });
        }
    }
    return myButtons;
}

// #7
function removeButtonListeners(){
    let myButtons = document.querySelectorAll("main button");
    if (myButtons){
        for (let button of myButtons){
            const postId = button.dataset.postId;
            button.removeEventListener("click", function (event){
                toggleComments(event, postId);
            }, false);
        }
    }
    return myButtons;

}

// #8
function createComments(comments){
    if (!comments){
        return undefined;
    }
    let fragment = document.createDocumentFragment();
    for (let comment of comments){
        let myArticle = document.createElement("article");
        let myHeader = createElemWithText('h3', comment.name);
        let myParagraph1 = createElemWithText('p', comment.body);
        let myParagraph2 = createElemWithText('p', `From: ${comment.email}`);
        myArticle.append(myHeader, myParagraph1, myParagraph2);
        fragment.append(myArticle);
    }
    return fragment;
}

// #9
function populateSelectMenu(users){
    if (!users){
        return undefined;
    }
    let selectMenu = document.getElementById("selectMenu");
    let options = createSelectOptions(users);
    for (let option of options){
        selectMenu.append(option);
    }
    return selectMenu;
}

// #10
const getUsers = async () => {
    try {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        return await res.json();
    } catch(err) {
        console.error(err);
    }
}

// #11
const getUserPosts =  async (userId) => {
    if (!userId){
        return undefined;
    }
    try {
        const res = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        return await res.json();
    } catch(err) {
        console.error(err);
    }
}

// #12
const getUser =  async (userId) => {
    if (!userId){
        return undefined;
    }
    try {
        const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        return await res.json();
    } catch(err) {
        console.error(err);
    }
}

// #13
const getPostComments =  async (postId) => {
    if (!postId){
        return undefined;
    }
    try {
        const res = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
        return await res.json();
    } catch(err) {
        console.error(err);
    }
}

// #14
const displayComments = async (postId) => {
    if (!postId){
        return undefined;
    }
    let mySection = document.createElement("section");
    mySection.dataset.postId = postId;
    mySection.classList.add("comments", "hide");
    let comments = await getPostComments(postId);
    let fragment = createComments(comments);
    mySection.append(fragment);
    return mySection;
}


// #15 
const createPosts = async (posts) => {
    if (!posts){
        return undefined;
    }
    let fragment = document.createDocumentFragment();
    for (let post of posts){
        let myArticle = document.createElement("article");
        let myHeader = createElemWithText("h2", post.title);
        let myParagraph1 = createElemWithText("p", post.body);
        let myParagraph2 = createElemWithText("p", `Post ID: ${post.id}`);
        let author = await getUser(post.userId);
        let myParagraph3 = createElemWithText("p", `Author: ${author.name} with ${author.company.name}`);
        let myParagraph4 = createElemWithText("p", author.company.catchPhrase);
        let myButton = createElemWithText("button", "Show Comments");
        myButton.dataset.postId = post.id;
        myArticle.append(myHeader, myParagraph1, myParagraph2, myParagraph3, myParagraph4, myButton);
        let section = await displayComments(post.id);
        myArticle.append(section);
        fragment.append(myArticle);
    }
    return fragment;
}

// #16
const displayPosts = async (posts) => {
    let myMain = document.querySelector("main");
    let element = (posts) ? await createPosts(posts) : document.querySelector("main p");
    myMain.append(element);
    return element;
}


// #17
function toggleComments(event, postId){
    if (!event || !postId){
        return undefined;
    }
    event.target.listener = true;
    let section  = toggleCommentSection(postId);
    let button = toggleCommentButton(postId);
    return [section, button];
}

// #18
const refreshPosts = async (posts) => {
    if (!posts){
        return undefined;
    }
    let buttons = removeButtonListeners();
    let myMain = deleteChildElements(document.querySelector("main"));
    let fragment = await displayPosts(posts);
    let button = addButtonListeners();
    return [buttons, myMain, fragment, button];
}

// #19
const selectMenuChangeEventHandler = async (e) => {
    let userId = e?.target?.value || 1;
    let posts = await getUserPosts(userId);
    let refreshPostsArray = await refreshPosts(posts);
    return [userId, posts, refreshPostsArray];
}

// #20
const initPage = async() => {
    let users = await getUsers();
    let select = populateSelectMenu(users);
    return [users, select];
}

// #21
function initApp(){
    initPage();
    let select = document.getElementById("selectMenu");
    select.addEventListener("change", selectMenuChangeEventHandler, false);
}

document.addEventListener("DOMContentLoaded", initApp, false);