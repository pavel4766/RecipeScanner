import {isRegExp} from "util";

const express = require('express');
const multer  = require('multer');
const app = express();
const fs = require('fs');
const Loki = require('lokijs');
const Tesseract = require('node-tesseract');
const path = require('path');
const url = require('url');
const cors = require('cors');
const axios = require('axios');

// const collection = require('utils');
const culinaryMeasures = ["kilogram", "teaspoon", "tablespoon","g","tablespoons","ml", "cup", "cups", "litres"];

const appId = "6df654c0";
const appKey = "0ee19ddd17a26b8d16a75a48a1dcb1e8";
const UriEdamamNutrients = `https://api.edamam.com/api/food-database/nutrients?app_id=${appId}&app_key=${appKey}`;

import {
    loadCollection
} from './utils';
import {raw} from "body-parser";
// import {request} from "https";

app.use(cors());


//setup
const DB_NAME = 'db.json';
const COLLECTION_NAME ='images';
const UPLOAD_PATH ='uploads';
const upload = multer({dest: UPLOAD_PATH});
const db = new Loki(`${UPLOAD_PATH}/${DB_NAME}`, { persistenceMethod: 'fs' });
const router = express.Router();

// middleware to use for all requests
app.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});


app.get('/recipes/:filename', async function(req, res) {
    const col = await loadCollection(COLLECTION_NAME, db);
    let file = col.find({"filename": req.params.filename});
    let filePath = './' + file[0].destination + '/' + file[0].filename;
    let arrayOfIngredientObjects = [];

    Tesseract.process(filePath, function (err, text) {

        text = replaceAll(text, /\n(?!\n)/, " ").trim();
        let measures = /\(([^)]+)\)/g;
        let match = measures.exec(text);
        let matchArray = [];

        while (match != null) {
            matchArray.push(match);
            text = text.replace(match[0], match[1]);
            match = measures.exec(text);
        }

        let rawRecipeLines = text.split(/\n/);
        let trimmedRecipeLines = [];

        //this function trims all the alternative measures before quantity of metric measures
        for (let i = 0; i < rawRecipeLines.length; i++) {
            let line = rawRecipeLines[i].trim();
            let newLine = trimNonMetric(line, matchArray) ? trimNonMetric(line, matchArray) : line;
            trimmedRecipeLines.push(newLine);
        }

        // recipes sometimes have multiple ingredients on the same line
        // ex: 1 teaspoon sugar, 1 tablespoon salt
        // we need to split this up recursively until there is only one ingredient per line
        trimmedRecipeLines.forEach((element, index) => {
            let words = element.split(" ");
            words.forEach((e, i) => {
                if (i > 0 && !isNaN(e)) {
                    let subLineOne = words.slice(0, i).join(" ");
                    let subLineTwo = words.slice(i).join(" ");
                    trimmedRecipeLines.splice(index, 1, subLineOne);
                    trimmedRecipeLines.splice(index + 1, 0, subLineTwo);
                }
            });
        });

        let recipeObjectsArray = trimmedRecipeLines.map((element, index) => {
            //here you need to take a line and convert it into an object
            // console.log('element', element);
            let line = element.split(" ");
            let quantity: number = null;
            let units: string = null;
            let ingredient: string = element;
            let indexOfMeasure: number;
            let indexOfQuantity: number;


            for (let i = 0; i < line.length; i++) {
                let lineItem = line[i];
                //first we check if the line has any measuring units in it
                if (culinaryMeasures.indexOf(lineItem) > -1) {
                    indexOfMeasure = i;
                    units = lineItem;
                    quantity = line[i - 1];
                }
                //then we identify the index of quantity
                if (!isNaN(lineItem)) {
                    quantity = line[i];
                    indexOfQuantity = i;
                }
            }

            if (indexOfMeasure && quantity) {
                ingredient = line.slice(indexOfMeasure + 1);
            } else if (quantity) {
                ingredient = line.slice(indexOfQuantity + 1);
            } else {
                ingredient = line;
            }

            return new RecipeLineObject(quantity,units,ingredient)

            // const UriEdamamParser = `https://api.edamam.com/api/food-database/parser?ingr=${ingredient}&app_id=${appId}&app_key=${appKey}&page=1`;
            // console.log("URI PARSER", UriEdamamParser);
            // let object = axios.get(UriEdamamParser).then(), function (err, data) {
            //     if (data) {
            //         // console.log('data hints',data.body);
            //         // ingredient = data.body.hints.food.uri;
            //         // data.body.hints[0].measures.forEach(
            //         //     (x,i)=>{
            //         //         if (x.label && line.indexOf(x.label.toLowerCase()) >-1) {
            //         //             units = x.uri;
            //         //         }});
            //         return data.body;
            //         // return new RecipeLineObject(quantity,units,ingredient)
            //     } else if (err) {
            //         console.log('err', err);
            //     } else {
            //         console.log('some other error',err)
            //     }
            //
            // });


            // res.json(promiseObjects);

        });

        res.json(recipeObjectsArray);

    });
});



app.post('/uploads', upload.single('image'), async (req, res) => {
    try{
        const col = await loadCollection(COLLECTION_NAME,db);
        const data =  await col.insert(req.file);
        db.saveDatabase();
        res.json(
            data
        )
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }});



app.listen(3000, () => {
    console.log('app listening on port 3000!');
});




/*
*================================================================================================
 */


// let filePath =  './' + 'uploads' + '/' + '5b9e2790a6ede8cc3676e91bd7958dd8';
//
//
// Tesseract.process(filePath, function (err, text) {
//     text = replaceAll(text,/\n(?!\n)/, " ").trim();
//     let measures = /\(([^)]+)\)/g;
//     let match = measures.exec(text);
//     let matchArray = [];
//
//     while (match != null) {
//         matchArray.push(match);
//         text = text.replace(match[0], match[1]);
//         match = measures.exec(text);
//     }
//
//     let rawRecipeLines = text.split(/\n/);
//     let trimmedRecipeLines = [];
//
//     //this function trims all the alternative measures before quantity of metric measures
//     for (let i=0; i< rawRecipeLines.length; i++) {
//         let line = rawRecipeLines[i].trim();
//         let newLine = trimNonMetric(line, matchArray) ? trimNonMetric(line, matchArray) : line;
//         trimmedRecipeLines.push(newLine);
//         console.log(trimmedRecipeLines)
//     }
//
//     trimmedRecipeLines.forEach((element,index)=>{
//         let words = element.split(" ");
//         words.forEach((e,i) => {
//             if (i > 0 && !isNaN(e)){
//                 let subLineOne = words.slice(0,i).join(" ");
//                 let subLineTwo = words.slice(i).join(" ");
//                 trimmedRecipeLines.splice(index,1,subLineOne);
//                 trimmedRecipeLines.splice(index+1,0,subLineTwo);
//             }
//         });
//     });
//
//
//     let arrayOfIngredientObjects = trimmedRecipeLines.map((element,index) => {
//         //here you need to take a line and convert it into an object
//         // console.log('element', element);
//         let line = element.split(" ");
//         console.log("LINE", line);
//         let quantity:number = null;
//         let units:string = null;
//         let ingredient:string = element;
//         let indexOfMeasure:number;
//         let indexOfQuantity:number;
//
//         for (let i = 0; i < line.length; i++) {
//             let lineItem = line[i];
//             //first we check if the line has any measuring units in it
//             if (culinaryMeasures.indexOf(lineItem)>-1){
//                 indexOfMeasure = i;
//                 units = lineItem;
//                 quantity = line[i-1];
//             }
//             //then we identify the index of quantity
//             if ( !isNaN(lineItem)) {
//                 quantity = line[i];
//                 indexOfQuantity = i;
//             }
//         }
//
//         if (indexOfMeasure && quantity) {
//             ingredient = line.slice(indexOfMeasure+1).join("%20");
//         } else if (quantity) {
//             ingredient = line.slice(indexOfQuantity+1).join("%20");
//         } else {
//             ingredient = line.join("%20");
//         }
//
//
//         const UriEdamamParser = `https://api.edamam.com/api/food-database/parser?ingr=${ingredient}&app_id=${appId}&app_key=${appKey}&page=0`;
//
//
//         // request(UriEdamamParser, function (err, data) {
//         //     ingredient = data.body.hints[0].food.uri
//         //     measure = data.body.hints[0].measures.forEach(
//         //     (x,i)=>{
//         //         if (x.label && line.indexOf(x.label.toLowerCase()) >-1) {
//         //             return x.uri;
//         //         }})
//         // })
//
//         let object = new RecipeLineObject(quantity,units,ingredient);
//
//         return object;
//
//     });
//
//     console.log('array of ingredient objects', arrayOfIngredientObjects);
//
//     // sendEdamameRequest(arrayOfIngredientObjects[0]);
//
//
// });
//

// let sampleObject = {
//         "yield": 1,
//         "ingredients": [
//             {
//                 "quantity": 1,
//                 "measureURI": "http://www.edamam.com/ontologies/edamam.owl#Measure_unit",
//                 "foodURI": "http://www.edamam.com/ontologies/edamam.owl#Food_11529"
//             }
//         ]
//     };



// function sendEdamamIngredientRequest(postData) {
//     let clientServerOptions = {
//         uri : UriEdamamNutrients,
//         body: JSON.stringify(postData),
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         }
//
//     };
//
//     request(clientServerOptions, function (error, response) {
//         console.log(error,response.body);
//         return;
//     });
// }


function trimNonMetric (line,matchArray){
    for (let j=0; j < matchArray.length; j++) {
        let measure = matchArray[j][1];
        if (line.indexOf(measure)> -1){
            return (line.substring(line.indexOf(measure)));
        }
    }
}


function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function splitRecipeLine(line) {
    let object;
    let lineItems = line.split(" ");

    for (let j = 0; j < lineItems.length; j++ ) {
        let measure = culinaryMeasures[j];
        let index = line.indexOf(culinaryMeasures[j]);

        if (index > -1){
            let units = measure;
            let quantity = line.substring(0,index).trimLeft();
            let ingredients = line.substring(index+measure.length);
            object = new RecipeLineObject(quantity,units,ingredients);
            return object;
        } else {
            object = new RecipeLineObject(null, null, line);
        }
    }
    return object;
}


function RecipeLineObject (quantity, units, ingredient) {
    this.quantity = quantity;
    this.units = units;
    this.ingredient = ingredient.join("%20");
    this.ingredientString = ingredient.join(" ");
}











