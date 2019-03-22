<style lang="scss" src="./styles/styles.scss">

</style>

<script>
    import {drawFormImage, retrieveRecipeData, upload} from './services/FileUpload';
    import * as axios from 'axios';
    require('dotenv').config();

    const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3;
    let nutsObjectsArray = [];
    const BASE_URL = 'http://localhost:3000';
    const uploadUrl = `${BASE_URL}/uploadimage`;
    const nutritionalInfoUrl = `${BASE_URL}/nutrition`;


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

        template:require("./Views/homePageTemplate"),

        data() {
            return {
                uploadError: null,
                uploadedFile: null,
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
                // draw image to canvas and then send it to the server to get OCR response
                drawFormImage(formData).then((response)=> {
                    this.uploadedFile = response[0];
                    axios.post(uploadUrl, formData).then((response)=>{
                        let promises = response;
                        this.currentStatus = STATUS_SUCCESS;
                        this.tesseractResult = response.data;
                    }).catch((e) => console.log(e));
                }).catch(err => {
                    this.uploadError = err.response;
                    this.currentStatus = STATUS_FAILED;
                });
            },


            filesChange(fieldName, fileList) {
                // handle file changes
                const formData = new FormData();
                if (fileList.length) {
                    formData.append(fieldName, fileList[0], fileList[0].name);
                    this.save(formData);
                }
            },

            removeItem( object, itemIndex ) {
                // console.log('removing button index', itemIndex)
                let location = nutsObjectsArray.find((element,index)=>{
                    if(element.id === itemIndex) return index;
                });
                nutsObjectsArray.splice(location,1);
                this.updateNutritionLabel();
                document.querySelectorAll('[addbtnid="'+itemIndex+'"]')[0].classList.add("enabled");
                document.querySelectorAll('[addbtnid="'+itemIndex+'"]')[0].classList.remove("disabled");
                document.querySelectorAll('[removebtnid="'+itemIndex+'"]')[0].classList.add("disabled");
                document.querySelectorAll('[removebtnid="'+itemIndex+'"]')[0].classList.remove("enabled");
            },

            getItemInfo(object, index){
                const nurtitionalObject = JSON.stringify(object);
                console.log('object', object);
                console.log('nurtitionalObject', nurtitionalObject);
                axios.post(nutritionalInfoUrl, object).then((response)=> {
                    console.log('What edamam gives us', response);
                    this.addNutrients(response, index);
                    document.querySelectorAll('[addbtnid="'+index+'"]')[0].classList.add("disabled");
                    document.querySelectorAll('[addbtnid="'+index+'"]')[0].classList.remove("enabled");
                    document.querySelectorAll('[removebtnid="'+index+'"]')[0].classList.add("enabled");
                    document.querySelectorAll('[removebtnid="'+index+'"]')[0].classList.remove("disabled");
                }).catch((e)=> {
                    console.log('could not retrieve nutritional information', e);
                });


                //
                // let quantity = object.quantity || null;
                // let UriEdamamParser = `https://api.edamam.com/api/food-database/parser?ingr=${object.quantity}%20${object.units}%20${object.ingredient}&app_id=${process.env.APP_ID}&app_key=${process.env.SECRET_KEY}&page=1`;
                // let UriTextAnalysis = `https://api.edamam.com/api/nutrition-data?app_id=${process.env.APP_ID}&app_key=${process.env.SECRET_KEY}&ingr=${object.quantity}%20${object.units}%20${object.ingredient}`;
                // let parseCallObject = axios.get(UriTextAnalysis).then(
                //     (response,error) => {
                //         console.log('What edamam gives us', response);
                //         this.addNutrients(response, index);
                //         document.querySelectorAll('[addbtnid="'+index+'"]')[0].classList.add("disabled");
                //         document.querySelectorAll('[addbtnid="'+index+'"]')[0].classList.remove("enabled");
                //         document.querySelectorAll('[removebtnid="'+index+'"]')[0].classList.add("enabled");
                //         document.querySelectorAll('[removebtnid="'+index+'"]')[0].classList.remove("disabled");
                //     }
                // );
                // return null;
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
