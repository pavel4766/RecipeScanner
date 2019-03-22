module.exports = `
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

                            <div class="remove-btn disabled line-item-btn" :removeBtnId="index" @click="removeItem(object,index)">
                            Remove
                            </div>

                        </div>
                    </div>
                </div>

                <section class="performance-facts">
                    <header class="performance-facts__header">
                        <h1 class="performance-facts__title">Nutrition Facts</h1>
                    </header>
                    <table class="performance-facts__table">
                        <tbody>
                        <tr>
                            <th colspan="2">
                                <b>Calories</b>
                                {{this.nutrients.cal}}
                            </th>
                        </tr>
                        <tr class="thick-row">
                            <td colspan="3" class="small-info">
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

            <div v-if="currentStatus === 3">
                <h2>Upload failed.</h2>
                <p>
                    <a href="javascript:void(0)" @click="reset()">Try again</a>
                </p>
                <pre>{{ uploadError }}</pre>
            </div>
        </div>
    </div>
`;