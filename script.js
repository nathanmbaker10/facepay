var storage = firebase.storage();
var storageReference = storage.ref();
var database = firebase.database();
var databaseReference = database.ref();


$(document).ready(function(){
    
    $("#submit-person-data").click(function(){
        console.log($("#exampleFormControlFile1").val());

        const person = {
            "name":$("#inputName").val(),
            "email":$("#exampleInputEmail1").val(),
        }
        $("#testImg").attr("src",$("#exampleFormControlFile1").val());
        // startAPImanager(person);
    })
})

const startAPImanager = async (person) => {
    try {
        const responseFromCreatePersonJSON = await createPerson(person);
        const personId = responseFromCreatePersonJSON["personId"];
        /*Must convert image to png before pushing to databasae below:
        file name is image_PNG

        */
        const image_PNG = await convertHEICtoPNGfile()
        const fireBaseImageURL = await pushDataToFireBase(person, image_PNG);



        console.log(responseFromCreatePersonJSON);
    } catch (err) {
        console.log(err);
    }
}

const createPerson = async(person) => {
    event.preventDefault()
    const url = 'https://face-mvp.cognitiveservices.azure.com/face/v1.0/persongroups/everyone/persons';
    const data = {
        name: person["name"]
    }
    console.log(data["name"]);
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

const pushDataToFireBase = async (personObject, image_PNG) => {
    var folderRef = storagReference.child(personObject["personId"]);


    //Jake I need you to get this right. What will the file name be? It doesn't really matter, but is it a property of the image_PNG object?
    var fileName = image_PNG.name


    var imageRef = folderRef.child(fileName);

    var firebaseImageURL
    //url to image is probably here in the snapshot
    await ref.put(image_PNG).then((snapshot) => {
        console.log(snapshot);

        // firebaseImageURL = snapshot.url
    });


    var databaseUserRef = databaseReference.child(personObject["personId"]);

    await databaseUserRef.set({
        name: personObject["name"],
        email: personObject["email"]
    });

    return url;




}


