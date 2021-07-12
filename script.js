var storage = firebase.storage();
var storageReference = storage.ref();
var database = firebase.database();
var databaseReference = database.ref();


$(document).ready(function(){

    $("#submit-person-data").click(function(){
        event.preventDefault()
        
        // file metadata (or data?)
        const photo = $("#exampleFormControlFile1")[0]["files"][0];

        const person = {
            "name":$("#inputName").val(),
            "email":$("#exampleInputEmail1").val()
        }
        
        startAPImanager(person, photo);
    })
})

const startAPImanager = async (personData, image_PNG) => {
    try {
        const responseFromCreatePersonJSON = await createPerson(personData);
        const personId = responseFromCreatePersonJSON["personId"];
        // assuming iPhone converts to png, we won't need to conversion ourselves
        // const image_PNG = await convertHEICtoPNGfile()
        
        const fireBaseImageURL = await pushDataToFireBase(personData, personId, image_PNG);
        await addFaceToPerson(personId, fireBaseImageURL);


    } catch (err) {
        console.log(err);
    }
}

const addFaceToPerson = async(personId, fireBaseImageURL) => {
    const url = 'https://face-mvp.cognitiveservices.azure.com/face/v1.0/persongroups/everyone/persons/' + personId + '/persistedFaces';
    const data = {
        url: fireBaseImageURL
    }
    await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': '36831fd5885b4c2396d0ca248e26e02e'
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    })
    .then(response => response.json())
    .then(responseJSON => {
        console.log(responseJSON)
    }).catch(err => console.log(err))
}

const createPerson = async(person) => {
    event.preventDefault()
    const url = 'https://face-mvp.cognitiveservices.azure.com/face/v1.0/persongroups/everyone/persons';
    const data = {
        name: person["name"]
    }
    return response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': '36831fd5885b4c2396d0ca248e26e02e'
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    })
    .then(response => response.json())
    .then(responseJSON => {
        return responseJSON;
    }).catch(err => console.log(err))
}

const pushDataToFireBase = async (personData, personId, image_PNG) => {
    var folderRef = storageReference.child(personId);


    //Jake I need you to get this right. What will the file name be? It doesn't really matter, but is it a property of the image_PNG object?
    var fileName = image_PNG.name


    var imageRef = folderRef.child(fileName);

    var firebaseImageURL
    var dataBaseSnapshot
    //url to image is probably here in the snapshot
    await imageRef.put(image_PNG).then((snapshot) => {
        dataBaseSnapshot = snapshot;
    });

    await dataBaseSnapshot.ref.getDownloadURL().then((downloadURL) => {
    
        firebaseImageURL = downloadURL;
    })


    

    await database.ref(personId).set(personData);

    
    return firebaseImageURL;
}
