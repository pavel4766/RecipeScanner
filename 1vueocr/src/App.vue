<!--<template>-->
    <!--<div id="app">-->
      <!--<ocr></ocr>-->
    <!--</div>-->
<!--</template>-->

<!--<script>-->
    <!--import ocr from  "./components/OCR"-->


    <!--export default {-->
        <!--name: 'App',-->
        <!--components: {-->
            <!--ocr-->
        <!--}-->
    <!--}-->


<!--</script>-->

<!--<style>-->
<!--#app {-->
    <!--font-family: 'Avenir', Helvetica, Arial, sans-serif;-->
    <!-- -webkit-font-smoothing: antialiased;-->
    <!-- -moz-osx-font-smoothing: grayscale;-->
    <!--text-align: center;-->
    <!--color: #2c3e50;-->
    <!--margin-top: 60px;-->
<!--}-->
<!--</style>-->

<template>
    <div id="app">
        <div class="container">
            <!--UPLOAD-->
            <form enctype="multipart/form-data" novalidate v-if="status === 0 || status === 1">
                <h1>Upload images</h1>
                <div class="dropbox">
                    <input type="file" :name="uploadFieldName" :disabled="status === 1"
                           @change="filesChange($event.target.name, $event.target.files)"
                            accept="image/*" class="input-file">
                    <p v-if="status === 0">
                        Drag your file here to begin<br> or click to browse
                    </p>
                    <p v-if="status === 1">
                        Uploading file...
                    </p>
                </div>
            </form>

            <div v-if="status === 2" >
                <h2>Uploaded file successfully.</h2>
                <p>
                    <a href="javascript:void(0)" @click="reset()">Upload again</a>
                </p>

                <div class="recipe-container">
                    <div class="recipe-img-frame">
                        <img v-on:load="imgChange($event)" id="toTesseract" :src="uploadedFile.url" class="img-responsive recipe-image photo-image img-thumbnail" :alt="uploadedFile.originalName">
                    </div>
                    <div class="recipe-text" v-if="tesseractResult">
                        <div class="line-item-wrapper" v-for="(object, index) in tesseractResult">
                            <div class="ingredient-item">
                                <input type="number" class="quantity" v-bind:value="object.quantity">
                                <div class="units">
                                    {{object.units}}
                                </div>

                                <div class="ingredient-name">
                                    {{object.ingredientString}}
                                </div>
                            </div>
                            <div class="add-btn line-item-btn enabled" :addBtnId="index" @click="getItemInfo(object,index)">
                                Add
                            </div>

                            <!--<div class="remove-btn disabled line-item-btn" :removeBtnId="index" @click="removeItem(object,index)">-->
                                <!--Remove-->
                            <!--</div>-->

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
                        <!--<p>Serving Size 1/2 cup (about 82g)-->
                        <!--<p>Serving Per Container 8</p>-->
                    </header>
                    <table class="performance-facts__table">
                        <!--<thead>-->
                        <!--<tr>-->
                        <!--<th colspan="3" class="small-info">-->
                        <!--Amount Per Serving-->
                        <!--</th>-->
                        <!--</tr>-->
                        <!--</thead>-->
                        <tbody>
                        <tr>
                            <th colspan="2">
                                <b>Calories</b>
                                {{this.nutrients.cal}}
                            </th>
                            <!--<td>-->
                            <!--Calories from Fat-->
                            <!--{{this.nutrients.fatCal}}-->
                            <!--</td>-->
                        </tr>
                        <tr class="thick-row">
                            <td colspan="3" class="small-info">
                                <!--<b>% Daily Value*</b>-->
                            </td>
                        </tr>
                        <tr>
                            <th colspan="2">
                                <b>Total Fat</b>
                            </th>
                            <td>
                                {{this.nutrients.fatTotal}}g
                            </td>
                        </tr>
                        <tr>
                            <td class="blank-cell">
                            </td>
                            <th>
                                Saturated Fat
                            </th>
                            <td>
                                {{this.nutrients.fatSaturated}}g
                            </td>
                        </tr>
                        <tr>
                            <td class="blank-cell">
                            </td>
                            <th>
                                Trans Fat
                            </th>
                            <td>
                                {{this.nutrients.fatTrans}}g
                            </td>
                        </tr>
                        <tr>
                            <th colspan="2">
                                <b>Cholesterol</b>
                            </th>
                            <td>
                                {{this.nutrients.cholesterol}}mg
                            </td>
                        </tr>
                        <tr>
                            <th colspan="2">
                                <b>Sodium</b>
                            </th>
                            <td>
                                {{this.nutrients.sodium}}mg
                            </td>
                        </tr>
                        <tr>
                            <th colspan="2">
                                <b>Total Carbohydrate</b>
                            </th>
                            <td>
                                {{this.nutrients.carbsTotal}}g
                            </td>
                        </tr>
                        <tr>
                            <td class="blank-cell">
                            </td>
                            <th>
                                Dietary Fiber
                            </th>
                            <td>
                                {{this.nutrients.carbsDietaryFiber}}g
                            </td>
                        </tr>
                        <tr>
                            <td class="blank-cell">
                            </td>
                            <th>
                                Sugars
                            </th>
                            <td>
                                {{this.nutrients.carbsSugar}}g
                            </td>
                        </tr>
                        <tr class="thick-end">
                            <th colspan="2">
                                <b>Protein</b>
                            </th>
                            <td>
                                {{this.nutrients.protein}}g
                            </td>
                        </tr>
                        </tbody>
                    </table>

                    <table class="performance-facts__table--grid">
                        <tbody>
                        <tr>
                            <td colspan="2">
                                Vitamin A
                                {{this.nutrients.vitaminA}}
                            </td>
                            <td>
                                Vitamin C
                                {{this.nutrients.vitaminC}}
                            </td>
                        </tr>
                        <tr class="thin-end">
                            <td colspan="2">
                                Calcium
                                {{this.nutrients.calcium}}

                            </td>
                            <td>
                                Iron
                                {{this.nutrients.iron}}
                            </td>
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

<style lang="scss" src="./styles/styles.scss">

</style>

<script>
    import {retrieveRecipeData,upload}  from './services/FileUpload';
    import * as axios from 'axios';
    require('dotenv').config();

    const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3;
    const uriEdamamNutrients = `https://api.edamam.com/api/food-database/nutrients?app_id=${process.env.APP_ID}&app_key=${process.env.APP_KEY}`;
    let nutsObjectsArray = [];

    let nutrients = {
        cal: null,
        fatTotal: null,
        fatSaturated:null,
        fatTrans:null,
        cholesterol:null,
        sodium:null,
        carbsTotal:null,
        carbsDietaryFiber:null,
        carbsSugar:null,
        protein:null,
        vitaminA:null,
        vitaminC:null,
        calcium:null,
        iron:null,
    };

    export default {

        name: 'ocr',

        data() {
            return {
                uploadedFile: null,
                uploadError: null,
                currentStatus: STATUS_INITIAL,
                uploadFieldName: 'image',
                tesseractResult: '',
                nutrients: nutrients
            }
        },

        computed: {
            status() {
                return this.currentStatus;
            }
        },

        directives: {
            forCallback(el, binding) {
                let element = binding.value;
                let key = element.key;
                let len = 0;

                if (Array.isArray(element.array)) {
                    len = element.array.length
                }

                else if (typeof element.array === 'object') {
                    var keys = Object.keys(element.array);
                    key = keys.indexOf(key);
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
                this.uploadedFile = null;
                this.uploadError = null;
                this.tesseractResult = '';
            },

            imgChange(event) {
                // console.log('from image changed', this.tesseractResult);
            },
            save(formData) {
                this.currentStatus = STATUS_SAVING;
                //todo import properly and make sure this is not a global
                //send image to server and render the blob in a canvas element
                upload(formData)
                    .then(((imgFile) => {
                        this.uploadedFile = imgFile[0];
                        this.currentStatus = STATUS_SUCCESS;
                        this.getRecipeText(this.uploadedFile.filename);
                    }).bind(this));


            },

            getRecipeText(filename) {
                retrieveRecipeData(filename).then(
                    (response) => {
                        this.tesseractResult = response;
                        // console.log('this tesseract result from get text', this.tesseractResult);
                        //why are we setting the result on the window???
                        window.result = response;
                    }
                ).catch(err => {
                    console.log('error is caught', err);
                    //todo make more informative error messages;
                    this.uploadError = err.response;
                    this.currentStatus = STATUS_FAILED;
                });
            },

            //todo check if we need this ... and if yes, do we need it in the current form
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
                this.save(formData);
            },

            removeItem( object, itemIndex ) {
                // console.log('removing button index', itemIndex)
                let location = nutsObjectsArray.find((element,index)=>{
                    if(element.id === itemIndex) return index;
                });
                nutsObjectsArray.splice(location,1);
                console.log('nutsObjectArray after splice', nutsObjectsArray);
                this.updateNutritionLabel();
                document.querySelectorAll('[addbtnid="'+itemIndex+'"]')[0].classList.add("enabled");
                document.querySelectorAll('[addbtnid="'+itemIndex+'"]')[0].classList.remove("disabled");
                document.querySelectorAll('[removebtnid="'+itemIndex+'"]')[0].classList.add("disabled");
                document.querySelectorAll('[removebtnid="'+itemIndex+'"]')[0].classList.remove("enabled");
            },

            //todo move this to the back end  and have it execute as soon as you upload that image
            //call to the backend which should give you an object with the nutritional info
            getItemInfo(object, index){
                // console.log(object);
                let quantity = object.quantity || null;
                let UriEdamamParser = `https://api.edamam.com/api/food-database/parser?ingr=${object.quantity}%20${object.units}%20${object.ingredient}&app_id=${process.env.APP_ID}&app_key=${process.env.SECRET_KEY}&page=1`;
                let UriTextAnalysis = `https://api.edamam.com/api/nutrition-data?app_id=${process.env.APP_ID}&app_key=${process.env.SECRET_KEY}&ingr=${object.quantity}%20${object.units}%20${object.ingredient}`;
                let parseCallObject = axios.get(UriTextAnalysis).then(
                    (response,error) => {
                        console.log('What edamam gives us', response);
                        this.addNutrients(response, index);
                        document.querySelectorAll('[addbtnid="'+index+'"]')[0].classList.add("disabled");
                        document.querySelectorAll('[addbtnid="'+index+'"]')[0].classList.remove("enabled");
                        document.querySelectorAll('[removebtnid="'+index+'"]')[0].classList.add("enabled");
                        document.querySelectorAll('[removebtnid="'+index+'"]')[0].classList.remove("disabled");
                    }
                );
                return null;
            },



            addNutrients (response, index) {
                let nuts = response.data.totalNutrients;

                console.log('line item', index);
                console.log('nuts', nuts);

                let nutsObject = {
                    id : index,
                    cal : response.data.calories || 0,
                    carbsTotal :  nuts.CHOCDF ? nuts.CHOCDF.quantity : 0,
                    carbsDietaryFiber :  (nuts.FIBTG) ? nuts.FIBTG.quantity : 0,
                    carbsSugar :  nuts.SUGAR ? nuts.SUGAR.quantity : 0,
                    fatTotal :  nuts.FAT ? nuts.FAT.quantity : 0,
                    fatSaturated :  nuts.FASAT ? nuts.FASAT.quantity : 0,
                    fatTrans :  nuts.FATRN ? nuts.FATRN.quantity : 0,
                    cholesterol :  nuts.CHOLE ? nuts.CHOLE.quantity : 0,
                    sodium :  nuts.NA ? nuts.NA.quantity : 0,
                    protein :  nuts.PROCNT ? nuts.PROCNT.quantity : 0,
                    vitaminA : nuts.VITA_RAE ? nuts.VITA_RAE.quantity : 0,
                    vitaminC : nuts.VCITC ? nuts.VITC.quantity : 0,
                    calcium : nuts.CA ? nuts.CA.quantity : 0,
                    iron : nuts.FE ? nuts.FE.quantity : 0,
                };

                for (let p in nutsObject) {
                    nutsObject[p] = parseFloat(nutsObject[p]);
                };
                //
                // function precisionRound(number, precision) {
                //     let factor = Math.pow(10, precision);
                //     return Math.round(number * factor) / factor;
                // }

                nutsObjectsArray.push(nutsObject);

                this.updateNutritionLabel();


            },

            updateNutritionLabel(){
                if (nutsObjectsArray.length) {
                    this.nutrients = nutsObjectsArray.reduce((accumulator, currentValue) => {
                        for (let p in currentValue) {
                            let accFloat = parseFloat(accumulator[p]);
                            accumulator[p] = accFloat + currentValue[p];
                        }
                        return accumulator;
                    });

                    for (let p in this.nutrients) {
                        this.nutrients[p] = parseFloat(this.nutrients[p]).toFixed(1);
                    }
                }  else {
                    console.log('we are clearing the nutrients object');
                    for(let key in this.nutrients) {
                        this.nutrients[key] = 0;
                    }
                }

                console.log('this.nutrients after reduce', this.nutrients);
            }
        },
        mounted() {
            this.reset();
        },
    }

</script>
