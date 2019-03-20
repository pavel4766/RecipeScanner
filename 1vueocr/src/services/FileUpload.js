import * as axios from 'axios';
const BASE_URL = 'http://localhost:3000';
const uploadUrl = `${BASE_URL}/uploads`;
const recipeUrl = `${BASE_URL}/recipes/`;


function upload(formData) {

    const photos = formData.getAll('image');
    let filename = null;


    axios.post(uploadUrl, formData).then(
        function (response) {
            console.log('response from server',response);
            filename = response.data.filename;
       }).catch(err => {
        console.log('error is caught', err);
        this.uploadError = err.response;
        this.currentStatus = STATUS_FAILED;
    });

    const promises = photos.map((x) => getImage(x)
        .then(img => ({
            originalName: x.name,
            filename: filename,
            url: img
        })).catch(err => {
            console.log('error is caught', err);
            //todo make more informative error messages;
            this.uploadError = err.response;
            this.currentStatus = STATUS_FAILED;
        }));

    return Promise.all(promises);
}

//data should come back as a response to the initial upload
function retrieveRecipeData(filename) {
    return new Promise( function (resolve, reject) {
        resolve(axios.get(recipeUrl+filename).then(function (response) {
            return response.data;
        }));
    })
}

function getImage(file) {
    return new Promise((resolve, reject) => {
        const fReader = new FileReader();
        const img = document.createElement('img');

        fReader.onload = () => {
            img.src = fReader.result;
            setTimeout(function () {
                resolve(getBase64Image(img));
            },3000)
        };
        fReader.readAsDataURL(file);
    })
}

function getBase64Image(img) {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const dataURL = canvas.toDataURL('image/png');
    return dataURL;
}


export { upload , retrieveRecipeData}