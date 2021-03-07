let addTaskButton = document.getElementById('add-task-button');
addTaskButton.addEventListener('click', getTopicDetails);
topicListContainer = document.getElementById('topic-list-container');

displayToDOM();
function Topic(title, desc, tags){
    this.title = title;
    this.desc = desc;
    this.tags = tags;
}

function getTopicDetails(){
    let title = prompt('Enter the title of the topic');
    let desc = prompt('Enter the description of the topic');
    let tags = prompt('Enter tags if any');
    let topic = new Topic(title, desc, tags);
    localStorage.setItem(title,JSON.stringify(topic));
    displayToDOM();
}

function displayToDOM(){
    clearDOM();
    for(let i=0;i<localStorage.length;i++){
        let topic = JSON.parse(localStorage.getItem(localStorage.key(i)));
        let topicNode = createNode(topic,i);
    }
}

function createNode(t,i){
    //creates a node to be inserted from the topic object
    topicNode = document.createElement('div');
    
    title = document.createElement('h3');
    title.textContent = t.title;
    topicNode.appendChild(title);

    desc = document.createElement('p');
    desc.textContent = t.desc;
    topicNode.appendChild(desc);

    tags = document.createElement('p');
    tags.textContent = t.tags;
    topicNode.appendChild(tags);

    removeBtn = document.createElement('button');
    removeBtn.textContent = 'REMOVE';
    removeBtn.addEventListener('click',(e,i)=>{
        localStorage.removeItem(t.title);
        displayToDOM();
    })
    topicNode.appendChild(removeBtn);

    topicListContainer.appendChild(topicNode);


}

function clearDOM(){
    while(topicListContainer.firstElementChild){
        topicListContainer.removeChild(topicListContainer.firstElementChild);
    }
}