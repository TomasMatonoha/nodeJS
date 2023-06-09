const express = require("express");
const bodyParser = require("body-parser");
const moment = require("moment");
const csvtojson = require("csvtojson")
const fs = require("fs");
const path = require("path");
const urlencodedParser = bodyParser.urlencoded({extended: false});
const app = express();
const port = 3000;

app.use(express.static("public"));
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.get("/todolist", (req, res) => {
    csvtojson({headers:['kapela', 'skladba']}).fromFile(path.join(__dirname, 'data/udaje.csv'))
    .then(data => {
        console.log(data);
        res.render('index', {nadpis: "Hudební vkusy", udaje: data});
    })
    .catch(err => {
        console.log(err);
        res.render('error', {nadpis: "Chyba v aplikaci", chyba: err});
    })
})

app.post('/data', urlencodedParser, (req, res) => {
    let str = `"${req.body.kapela}", "${req.body.skladba}",\n`;
    fs.appendFile(path.join(__dirname, 'data/udaje.csv'), str, function (err) {
        if(err){
            console.error(err);
            return res.status(400).json({
                success: false,
                message: "Nastala chyba během ukládání souboru"
            });
        }
    });
    res.redirect(301, '/');
});

app.listen(port, () => {
console.log(`Server naslouchá na portu ${port}`);
})