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
                            <ul>
                                <li v-for="object in tesseractResult">
                                    <label>
                                        <input type="checkbox"/>
                                        <input type="number" v-bind:value="object.quantity">
                                        <span>
                                            {{object.units}}
                                        </span>

                                        <span>
                                        {{object.ingredient}}
                                        </span>

                                    </label>
                                </li>
                            </ul>
                        </div>
                    </div>


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
        .recipe-text {
            text-align: left;

        }
        li {
            list-style-type: none;
        }
    }


</style>

<script>
    import { upload, retrieve } from '../services/FileUpload';
    import * as axios from 'axios';


    const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3;

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
        methods: {
            reset() {
                // reset form to initial state
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
            }
        },
        mounted() {
            this.reset();

        },
    }

</script>