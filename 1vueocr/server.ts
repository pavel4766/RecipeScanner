namespace RecipeScanner {
    const express = require('express');
    const busboy = require('connect-busboy');
    const app = express();
    const fs = require('fs');
    const Tesseract = require('node-tesseract');
    const cors = require('cors');
    const axios = require('axios');
    const dotenv = require('dotenv').config();

    app.use(cors());
    app.use(busboy());
    app.use(express.json());

    const UPLOAD_PATH ='uploads';
    const culinaryMeasures:String[] = ["kilogram", "teaspoon", "tablespoon","g","tablespoons","ml", "cup", "cups", "litres"];
    const appId = "6df654c0";
    const appKey = "0ee19ddd17a26b8d16a75a48a1dcb1e8";
    const UriEdamamNutrients = `https://api.edamam.com/api/food-database/nutrients?app_id=${appId}&app_key=${appKey}`;


    // middleware to use for all requests
    app.use(function(req, res, next) {
        // do logging
        console.log('Something is happening!');
        next(); // make sure we go to the next routes and don't stop here
    });

    app.listen(3000);

    //upload images an return text extracted by the Tesseract OCR engine
    app.post('/uploadimage', async (req, res) => {
        try{
            let fileStream = null;
            let data = null;
            req.pipe(req.busboy);
            console.log('controller');
            req.busboy.on('file', function (fieldname, file, filename) {
                let filePath = `${__dirname}\\${UPLOAD_PATH}\\${filename}`;
                fileStream = fs.createWriteStream(filePath);
                file.pipe(fileStream);
                fileStream.on('close',  ()=> {
                    Tesseract.process(filePath,(e,t)=> {
                        processTesseractData(e,t).then((data)=>{
                            res.send(data);
                        }).catch((e)=> {
                            console.log(e);
                        });
                    });
                });
            });
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    app.post('/nutrition', async (req, res) => {
        let object = req.body;
        const uriNutritionalAnalysis = `https://api.edamam.com/api/nutrition-data?app_id=${process.env.APP_ID}&app_key=${process.env.APP_KEY}&ingr=${object.quantity}%20${object.units}%20${object.ingredient}`;
        let result = axios.get(uriNutritionalAnalysis).then((response)=> {
                console.log('edamame success',response);
                res.send(response.data);
            }
        ).catch((err)=> {
            console.log('edamame error',err);
        });
    });

    const processTesseractData = async function(err, text) {
        text = text.replace(new RegExp(/\n(?!\n)/, 'g'), " ").trim();
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
            let newLine = trimNonMetric(line, matchArray) || line;
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

        return trimmedRecipeLines.map((element, index) => {
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
                if (culinaryMeasures.includes(lineItem)) {
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

            return new RecipeLineObject(quantity, units, ingredient)
        });
    };


    function trimNonMetric (line,matchArray){
        for (let j=0; j < matchArray.length; j++) {
            let measure = matchArray[j][1];
            if (line.indexOf(measure)> -1){
                return (line.substring(line.indexOf(measure)));
            }
        }
    }


    class RecipeLineObject{
        public quantity;
        public units;
        public ingredient;
        public ingredientString;
        constructor (quantity, units, ingredient) {
            this.quantity = quantity;
            this.units = units;
            this.ingredient = ingredient.join("%20");
            this.ingredientString = ingredient.join(" ");
        }
    }
}













