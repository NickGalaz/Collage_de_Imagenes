const express = require('express');
const app = express();
const expressFileUpload = require('express-fileupload');
const port = 3000;
const path = require('path')
const fs = require("fs");
const permitFile = ['.gif', '.png', '.jpg', '.jpeg'];



// PROPIEDADES DE EXPRESS UPLOAD
const EFU_PROPERTIES = {
    limits: { fileSize: 5000000 },
    abortOnLimit: true,
    responseOnLimit: "El peso del archivo que intentas subir supera el limite permitido",
};


// MIDDLEWARES
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(expressFileUpload(EFU_PROPERTIES));
app.use(express.static("public/img"));


// RUTA RAIZ FORMULARIO
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/formulario.html");
});


// RANDERIZADO DE RUTA COLLAGE
app.get("/collage", (req, res) => {
    res.sendFile(__dirname + "/public/collage.html");
});

// RUTA POST PARA SUBIR IMAGEN
app.post('/imagen', (req, res) => {    
        const { foto } = req.files;
        const { posicion } = req.body;
        const nombreImg = `imagen-${posicion}.jpg`
        const extension = path.extname(nombreImg);

        if (!posicion) {
            console.log('Ingrese la posición.')
            return res.status(400).send('Ingrese la posición.');
        }
        if (!req.files) {
            return res.status(400).send('No se han enviado imágenes.');
        }
        if (!permitFile.includes(extension)) {
            return res.status(403).send('Formato inválido.')
        }

        foto.mv(`${__dirname}/public/img/${nombreImg}`, (err) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('http://localhost:3000/collage');
        });

});

// RUTA PARA BORRAR FOTOS DE COLLAGE
app.get("/deleteImg/:pos", (req, res) => {
    const { pos } = req.params;

    fs.unlink(`${__dirname}/public/img/${pos}`, (err) => {
        if (err) {
            res.status(404).send('No existe la imagen' + pos)
            console.log('No existe la imagen ' + pos)
        }
        else
        {
            res.redirect('http://localhost:3000/collage');
        }
    });
});


app.listen(port, () => console.log('Iniciando en puerto: ' + port));