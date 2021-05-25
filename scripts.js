let addTaskButton = document.getElementById('add-task-button');
addTaskButton.addEventListener('click', getTopicDetails);
topicListContainer = document.getElementById('topic-list-container');
let chooseTopicButton = document.getElementById('choose-topic-button');
chooseTopicButton.addEventListener('click', chooseTopic);

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

firebase.firestore().enablePersistence()
  .catch((err) => {
      if (err.code == 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          // ...
      } else if (err.code == 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          // ...
      }
  });

  
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
        // localStorage.removeItem(t.title);
        removeKeyFromFirestore(t);
        displayToDOM();
    })
    topicNode.appendChild(removeBtn);

    topicNode.appendChild(document.createElement('hr'));

    topicListContainer.appendChild(topicNode);
}

function removeKeyFromFirestore(t){
    firestore.collection('topics').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // console.log(`${doc.id} => ${doc.data().title}`);
            let title = doc.data().title;
            if(title == t.title){
                firestore.collection('topics').doc(doc.id).delete().then(()=>{
                    console.log('removal success');
                }).catch((error)=>{
                    console.error("error removing",error);
                });
            }
        })
    });
    displayToDOM();
}

function clearDOM() {
    while (topicListContainer.firstElementChild) {
        topicListContainer.removeChild(topicListContainer.firstElementChild);
    }
}

function chooseTopic() {
    let topicsList = [];
    firestore.collection('topics').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // console.log(`${doc.id} => ${doc.data().title}`);
            let title = doc.data().title;
            console.log(title);
        })
    });
    let choice = getRandomIndexFromArray(topicsList);
    alert(topicsList[choice]);
}

function getRandomIndexFromArray(topicsList) {
    return Math.floor(Math.random() * topicsList.length)
}