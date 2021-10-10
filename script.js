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
    let success;
    try {
        const responseFromCreatePersonJSON = await createPerson(personData);
        const personId = responseFromCreatePersonJSON["personId"];
        const fireBaseImageURL = await pushDataToFireBase(personData, personId, image_PNG);
        await addFaceToPerson(personId, fireBaseImageURL);
        await trainPersonGroup();
    } catch (err) {
        console.log(err);
    }
}

const trainPersonGroup = async () => {
    const url = 'https://face-api-iphone.cognitiveservices.azure.com/face/v1.0/persongroups/everyone/train';
    await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Ocp-Apim-Subscription-Key': '60d4a2f41bc642ca8611384a99df4594'
        }
    })
    .then(response => console.log(response)).catch(err => console.log(err))
}

const addFaceToPerson = async(personId, fireBaseImageURL) => {
    const url = 'https://face-api-iphone.cognitiveservices.azure.com/face/v1.0/persongroups/everyone/persons/' + personId + '/persistedFaces';
    const data = {
        url: fireBaseImageURL
    }
    await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': '60d4a2f41bc642ca8611384a99df4594'
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
    const url = 'https://face-api-iphone.cognitiveservices.azure.com/face/v1.0/persongroups/everyone/persons';
    const data = {
        name: person["name"]
    }
    return response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': '60d4a2f41bc642ca8611384a99df4594'
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    })
    .then(response => response.json())
    .then(responseJSON => {
        return responseJSON;
    }).catch(err => console.log(err))
}
