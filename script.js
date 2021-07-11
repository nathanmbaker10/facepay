
$(document).ready(function(){
    $("#submit-person-data").click(function(){
        const person = {
            "name":$("#inputName").val(),
            "email":$("#exampleInputEmail1").val(),
        }
        startAPImanager(person);
    })
})

const startAPImanager = async (person) => {
    const responseFromCreatePersonJSON = await createPerson(person);
    console.log(responseFromCreatePersonJSON);
}

const createPerson = async(person) => {
    event.preventDefault()
    const url = 'https://face-mvp.cognitiveservices.azure.com/face/v1.0/persongroups/everyone/persons';
    const data = {
        name: person["name"]
    }
    console.log(data["name"]);
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'no-cors', // no-cors, *cors, same-origi 
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': '36831fd5885b4c2396d0ca248e26e02e'
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    })
    .then(response => response.json())
    .then(data => console.log(data))
}