<template>
    <div id="app">
        <div class="container">
            <!--UPLOAD-->
            <form enctype="multipart/form-data" novalidate v-if="status === 0 || status === 1">
                <h1>Upload images</h1>
                <div class="dropbox">
                    <input type="file" multiple :name="uploadFieldName" :disabled="status === 1"
                           @change="filesChange($event.target.name, $event.target.files);
                           fileCount = $event.target.files.length" accept="image/*" class="input-file">
                    <p v-if="status === 0">
                        Drag your file(s) here to begin<br> or click to browse
                    </p>
                    <p v-if="status === 1">
                        Uploading {{ fileCount }} files...
                    </p>
                </div>
            </form>

            <div v-if="status === 2" >
                <h2>Uploaded {{ uploadedFiles.length }} file(s) successfully.</h2>
                <p>
                    <a href="javascript:void(0)" @click="reset()">Upload again</a>
                </p>

                <div v-for="item in uploadedFiles" class="recipe-container">
                    <img v-on:load="imgChange($event)" id="toTesseract" :src="item.url" class="img-responsive recipe-image photo-image img-thumbnail" :alt="item.originalName">
                    <div class="recipe-text" v-if="tesseractResult">
                        <div class="line-item-wrapper" v-for="object in tesseractResult">
                            <div class="ingredient-item">
                                    <input type="number" class="quantity" v-bind:value="object.quantity">
                                    <div class="units">
                                        {{object.units}}
                                    </div>

                                    <div class="ingredient-name">
                                    {{object.ingredient}}
                                    </div>
                            </div>
                            <div class="add-btn" @click="getParsed(object)">
                                Add
                            </div>
                        </div>
                    </div>
                </div>

                <!--<div class="buttons">-->
                    <!--<button>-->
                        <!--Show Nutritional Information-->
                    <!--</button>-->
                <!--</div>-->
                <section class="performance-facts">
                    <header class="performance-facts__header">
                        <h1 class="performance-facts__title">Nutrition Facts</h1>
                        <p>Serving Size 1/2 cup (about 82g)
                        <p>Serving Per Container 8</p>
                    </header>
                    <table class="performance-facts__table">
                        <thead>
                        <tr>
                            <th colspan="3" class="small-info">
                                Amount Per Serving
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th colspan="2">
                                <b>Calories</b>
                                200
                            </th>
                            <td>
                                Calories from Fat
                                130
                            </td>
                        </tr>
                        <tr class="thick-row">
                            <td colspan="3" class="small-info">
                                <b>% Daily Value*</b>
                            </td>
                        </tr>
                        <tr>
                            <th colspan="2">
                                <b>Total Fat</b>
                                14g
                            </th>
                            <td>
                                <b>22%</b>
                            </td>
                        </tr>
                        <tr>
                            <td class="blank-cell">
                            </td>
                            <th>
                                Saturated Fat
                                9g
                            </th>
                            <td>
                                <b>22%</b>
                            </td>
                        </tr>
                        <tr>
                            <td class="blank-cell">
                            </td>
                            <th>
                                Trans Fat
                                0g
                            </th>
                            <td>
                            </td>
                        </tr>
                        <tr>
                            <th colspan="2">
                                <b>Cholesterol</b>
                                55mg
                            </th>
                            <td>
                                <b>18%</b>
                            </td>
                        </tr>
                        <tr>
                            <th colspan="2">
                                <b>Sodium</b>
                                40mg
                            </th>
                            <td>
                                <b>2%</b>
                            </td>
                        </tr>
                        <tr>
                            <th colspan="2">
                                <b>Total Carbohydrate</b>
                                17g
                            </th>
                            <td>
                                <b>6%</b>
                            </td>
                        </tr>
                        <tr>
                            <td class="blank-cell">
                            </td>
                            <th>
                                Dietary Fiber
                                1g
                            </th>
                            <td>
                                <b>4%</b>
                            </td>
                        </tr>
                        <tr>
                            <td class="blank-cell">
                            </td>
                            <th>
                                Sugars
                                14g
                            </th>
                            <td>
                            </td>
                        </tr>
                        <tr class="thick-end">
                            <th colspan="2">
                                <b>Protein</b>
                                3g
                            </th>
                            <td>
                            </td>
                        </tr>
                        </tbody>
                    </table>

                    <table class="performance-facts__table--grid">
                        <tbody>
                        <tr>
                            <td colspan="2">
                                Vitamin A
                                10%
                            </td>
                            <td>
                                Vitamin C
                                0%
                            </td>
                        </tr>
                        <tr class="thin-end">
                            <td colspan="2">
                                Calcium
                                10%
                            </td>
                            <td>
                                Iron
                                6%
                            </td>
                        </tr>
                        </tbody>
                    </table>

                    <p class="small-info">* Percent Daily Values are based on a 2,000 calorie diet. Your daily values may be higher or lower depending on your calorie needs:</p>

                    <table class="performance-facts__table--small small-info">
                        <thead>
                        <tr>
                            <td colspan="2"></td>
                            <th>Calories:</th>
                            <th>2,000</th>
                            <th>2,500</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th colspan="2">Total Fat</th>
                            <td>Less than</td>
                            <td>65g</td>
                            <td>80g</td>
                        </tr>
                        <tr>
                            <td class="blank-cell"></td>
                            <th>Saturated Fat</th>
                            <td>Less than</td>
                            <td>20g</td>
                            <td>25g</td>
                        </tr>
                        <tr>
                            <th colspan="2">Cholesterol</th>
                            <td>Less than</td>
                            <td>300mg</td>
                            <td>300 mg</td>
                        </tr>
                        <tr>
                            <th colspan="2">Sodium</th>
                            <td>Less than</td>
                            <td>2,400mg</td>
                            <td>2,400mg</td>
                        </tr>
                        <tr>
                            <th colspan="3">Total Carbohydrate</th>
                            <td>300g</td>
                            <td>375g</td>
                        </tr>
                        <tr>
                            <td class="blank-cell"></td>
                            <th colspan="2">Dietary Fiber</th>
                            <td>25g</td>
                            <td>30g</td>
                        </tr>
                        </tbody>
                    </table>

                    <p class="small-info">
                        Calories per gram:
                    </p>
                    <p class="small-info text-center">
                        Fat 9
                        &bull;
                        Carbohydrate 4
                        &bull;
                        Protein 4
                    </p>

                </section>



            </div>

            <!--FAILED-->
            <div v-if="currentStatus === 3">
                <h2>Upload failed.</h2>
                <p>
                    <a href="javascript:void(0)" @click="reset()">Try again</a>
                </p>
                <pre>{{ uploadError }}</pre>
            </div>
        </div>
    </div>
</template>

<style lang="scss">


    .image {
        width: 250px;
        float: left;
        margin: 20px;
    }
    body {
        font-size: small;
        line-height: 1.4;
    }
    p {
        margin: 0;
    }

    .performance-facts {
        border: 1px solid black;
        margin: 20px;
        float: left;
        width: 280px;
        padding: 0.5rem;
        table {
            border-collapse: collapse;
        }
    }
    .performance-facts__title {
        font-weight: bold;
        font-size: 2rem;
        margin: 0 0 0.25rem 0;
    }
    .performance-facts__header {
        border-bottom: 10px solid black;
        padding: 0 0 0.25rem 0;
        margin: 0 0 0.5rem 0;
        p {
            margin: 0;
        }
    }
    .performance-facts__table {
        width: 100%;
        thead tr {
            th, td {
                border: 0;
            }
        }
        th, td {
            font-weight: normal;
            text-align: left;
            padding: 0.25rem 0;
            border-top: 1px solid black;
            white-space: nowrap;
        }
        td {
            &:last-child {
                text-align: right;
            }
        }
        .blank-cell {
            width: 1rem;
            border-top: 0;
        }
        .thick-row {
            th, td {
                border-top-width: 5px;
            }
        }
    }
    .small-info {
        font-size: 0.7rem;
    }

    .performance-facts__table--small {
        @extend .performance-facts__table;
        border-bottom: 1px solid #999;
        margin: 0 0 0.5rem 0;
        thead {
            tr {
                border-bottom: 1px solid black;
            }
        }
        td {
            &:last-child {
                text-align: left;
            }
        }
        th, td {
            border: 0;
            padding: 0;
        }
    }

    .performance-facts__table--grid {
        @extend .performance-facts__table;
        margin: 0 0 0.5rem 0;
        td {
            &:last-child {
                text-align: left;
                &::before {
                    content: "•";
                    font-weight: bold;
                    margin: 0 0.25rem 0 0;
                }
            }
        }
    }

    .text-center {
        text-align: center;
    }
    .thick-end {
        border-bottom: 10px solid black;
    }
    .thin-end {
        border-bottom: 1px solid black;
    }

    .dropbox {
        outline: 2px dashed grey; /* the dash box */
        outline-offset: -10px;
        background: lightcyan;
        color: dimgray;
        padding: 10px 10px;
        min-height: 200px; /* minimum height */
        position: relative;
        cursor: pointer;
    }

    .input-file {
        opacity: 0; /* invisible but it's there! */
        width: 100%;
        height: 200px;
        position: absolute;
        cursor: pointer;
    }

    .dropbox:hover {
        background: lightblue; /* when mouse over to the drop zone, change color */
    }

    .dropbox p {
        font-size: 1.2em;
        text-align: center;
        padding: 50px 0;
    }

    .recipe-container {
        display: flex;
        justify-content: center;
        .photo-image {
            max-height: 500px;
            max-width: 500px;
        }

        .line-item-wrapper {
            display: flex;
            justify-content: space-between;

            .ingredient-item{
                display: flex;
                width: 500px;

                .recipe-text {
                    text-align: left;
                }

                .quantity {
                    width: 20%;
                    height: fit-content;
                }

                .units {
                    display: inline-block;
                    width: 30%;
                }
                .ingredient-name {
                    display: inline-block;
                    width: 50%;
                    word-break: break-all;
                }
            }

            .add-btn {
                display: inline-block;
                background: #3498db;
                background-image: linear-gradient(to bottom, #3498db, #2980b9);
                border-radius: 28px;
                font-family: Arial;
                color: #ffffff;
                font-size: 15px;
                padding: 5px 10px 5px 10px;
                text-decoration: none;

                & :hover {
                    background: #3cb0fd;
                    background-image: linear-gradient(to bottom, #3cb0fd, #3498db);
                    text-decoration: none;
                }

            }
        }

    }


</style>

<script>
    import { upload, retrieve } from '../services/FileUpload';
    import * as axios from 'axios';



    const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3;
    const appId = "6df654c0";
    const appKey = "0ee19ddd17a26b8d16a75a48a1dcb1e8";
    const UriEdamamNutrients = `https://api.edamam.com/api/food-database/nutrients?app_id=${appId}&app_key=${appKey}`;

    export default {
        name: 'ocr',
        data() {
            return {
                uploadedFiles: [],
                uploadError: null,
                currentStatus: STATUS_INITIAL,
                uploadFieldName: 'image',
                tesseractResult: ''
            }
        },
        computed: {
            status() {
                return this.currentStatus;
            }
        },
        directives: {
            forCallback(el, binding) {
                let element = binding.value
                var key = element.key
                var len = 0

                if (Array.isArray(element.array)) {
                    len = element.array.length
                }

                else if (typeof element.array === 'object') {
                    var keys = Object.keys(element.array)
                    key = keys.indexOf(key)
                    len = keys.length
                }

                if (key == len - 1) {
                    if (typeof element.callback === 'function') {
                        element.callback()
                    }
                }
            }
        },
        methods: {
            reset() {
                this.currentStatus = STATUS_INITIAL;
                this.uploadedFiles = [];
                this.uploadError = null;
                this.tesseractResult = '';
            },

            imgChange(event) {
                console.log('from image changed', this.tesseractResult);
            },
            save(formData) {
                this.currentStatus = STATUS_SAVING;

                upload(formData)
                    .then((x) => {
                        this.uploadedFiles = [].concat(x);
                        this.currentStatus = STATUS_SUCCESS;
                        this.getText(x[0].filename);
                    })
                    .catch(err => {
                        console.log('error is caught', err);
                        this.uploadError = err.response;
                        this.currentStatus = STATUS_FAILED;
                    });


            },


            getText(filename) {
                retrieve(filename).then(
                    (response) => {
                        this.tesseractResult = response;
                        console.log('this tesseract result from get text', this.tesseractResult);
                        window.result = response;
                    }
                );
            },


            filesChange(fieldName, fileList) {
                // handle file changes
                const formData = new FormData();

                if (!fileList.length) return;

                // append the files to FormData
                Array
                    .from(Array(fileList.length).keys())
                    .map(x => {
                        formData.append(fieldName, fileList[x], fileList[x].name);
                    });

                // save it
                this.save(formData);
            },

            getParsed(object){
                let UriEdamamParser = `https://api.edamam.com/api/food-database/parser?ingr=${object.quantity}%20${object.units}%20${object.ingredient}&app_id=${appId}&app_key=${appKey}&page=1`;
                let UriTextAnalysis = `https://api.edamam.com/api/nutrition-data?app_id=${appId}&app_key=${appKey}&ingr=${object.quantity}%20${object.units}%20${object.ingredient}`;
                let foodUri;
                let measureUri;
                let quantity = object.quantity;
                let parseCallObject = axios.get(UriTextAnalysis).then(
                    response => {
                      console.log('response', response);

                        // this.getNuts(foodUri,measureUri,quantity);
                    }
                ).catch(
                    (err) => console.log('error happened with the parse call',err)
                );
            },

            getNuts(foodUri, measureUri, quantity) {

                let postData =   {
                    "yield": 1,
                    "ingredients": [
                        {
                            "quantity": quantity,
                            "measureURI": measureUri,
                            "foodURI": foodUri
                        }
                    ]
                };

                let config = {
                    headers: {
                        'Content-Type': 'application/json',
                        "Access-Control-Allow-Origin": "*",
                    }
                };

                    // this.$http.post(UriEdamamNutrients,postData).then(response=>console.log(response)).catch(err=>console.log('error',err));

                // axios({
                //     method: 'post',
                //     url: UriEdamamNutrients,
                //     data: postData,
                // }).then(
                //     response=>{
                //         console.log('response from nutrition api', response);
                //     }
                // ).catch(err=>console.log('error from nutrition API',err))



                // axios.post(UriEdamamNutrients,postData).then(
                //     response=>{
                //         console.log('response from nutrition api', response);
                //     }
                // ).catch(err=>console.log('error from nutrition API',err))

                function postAjax(url, data, success) {
                    // let params = typeof data == 'string' ? data : Object.keys(data).map(
                    //     function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
                    // ).join('&');

                    let params = data;

                    let xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
                    xhr.open('POST', url);
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState>3 && xhr.status==200) { success(xhr.responseText); }
                    };
                    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.send(params);
                    return xhr;
                }

                postAjax(UriEdamamNutrients,postData,function(data){ console.log('data',data);})
            },

            drawGraph () {

            }
        },
        mounted() {
            this.reset();

        },
    }

</script>