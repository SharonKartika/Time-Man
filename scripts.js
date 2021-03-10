let addTaskButton = document.getElementById('add-task-button');
addTaskButton.addEventListener('click', getTopicDetails);
topicListContainer = document.getElementById('topic-list-container');
let chooseTopicButton = document.getElementById('choose-topic-button');
chooseTopicButton.addEventListener('click', chooseTopic);
let topicsList = [];

// firebase config
var firebaseConfig = {
    apiKey: "AIzaSyACt7LWDcQ4LuMvuTNrh91_62pSbljaC_0",
    authDomain: "time-man-c9f06.firebaseapp.com",
    projectId: "time-man-c9f06",
    storageBucket: "time-man-c9f06.appspot.com",
    messagingSenderId: "637096490383",
    appId: "1:637096490383:web:4e71cd01adceba1d4987fa"
};

firebase.initializeApp(firebaseConfig);
var firestore = firebase.firestore();
var docRef = firestore.doc("topics/topicList");

displayToDOM();
function Topic(title, desc, tags) {
    this.title = title;
    this.desc = desc;
    this.tags = tags;
}

function getTopicDetails() {
    let title = prompt('Enter the title of the topic');
    let desc = prompt('Enter the description of the topic');
    let tags = prompt('Enter tags if any');
    let topic = new Topic(title, desc, tags);
    // localStorage.setItem(title,JSON.stringify(topic));
    // store to firebase
    addKeyValueToFireStore(topic);
    displayToDOM();
}

function addKeyValueToFireStore(topic) {
    //adds a key value pair to firestore
    let title = topic.title;
    let topicString = JSON.stringify(topic);
    console.log(topicString);
    //adds a key value pair
    firestore.collection('topics').add({
        title: topic.title,
        desc: topic.desc,
        tags: topic.tags

    }).then(function () {
        console.log('done!');
    }).catch(function (error) {
        console.log('got an error lmao', error);
    });
}

function displayToDOM() {
    clearDOM();
    firestore.collection('topics').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // console.log(`${doc.id} => ${doc.data().title}`);
            let title = doc.data().title;
            let desc = doc.data().desc;
            let tags = doc.data().tags;
            let topic = new Topic(title, desc, tags);             
            createNode(topic,1);
        })
    });
    // let topic = JSON.parse(localStorage.getItem(localStorage.key(i)));

}


function createNode(t, i) {
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
    removeBtn.addEventListener('click', (e, i) => {
        localStorage.removeItem(t.title);
        displayToDOM();
    })
    topicNode.appendChild(removeBtn);

    topicNode.appendChild(document.createElement('hr'));

    topicListContainer.appendChild(topicNode);


}

function clearDOM() {
    while (topicListContainer.firstElementChild) {
        topicListContainer.removeChild(topicListContainer.firstElementChild);
    }
}

function chooseTopic() {
    topicsList = [];
    for (let i = 0; i < localStorage.length; i++) {
        topicsList.push(localStorage.key(i));
    }
    let choice = getRandomIndexFromArray(topicsList);
    alert(topicsList[choice]);
}

function getRandomIndexFromArray(topicsList) {
    return Math.floor(Math.random() * topicsList.length)
}