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
       }
    );

    const promises = photos.map((x) => getImage(x)
        .then(img => ({
            originalName: x.name,
            filename: filename,
            url: img
        })));

    return Promise.all(promises);
}

function retrieve(filename) {
    return new Promise( function (resolve, reject) {
        resolve(axios.get(recipeUrl+filename).then(function (response) {
            console.log('resonse from retrieve', response);
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


export { upload , retrieve}