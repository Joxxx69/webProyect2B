const Furniture = require('../models/furniture.model');
const formidable = require('formidable');// analiza datos de formularios, especialmente cargas de archivos.
const fs = require('fs');  // --> fyle system --> escoger archivos del sistema
const Category = require('../models/category.model');
const { request, response } = require('express');



const addFurniture = async(req=request, res = response) => {
    try {
        const newFurniture = new Furniture(req.body);
        const funiture = await newFurniture.save();
        res.json(funiture);
    } catch (error) {
        res.status(400).json(error);
    }
}

const updateFurni = async (req = request, res = response) => {
    const {id}=req.params
    try {
        const furniture = await Furniture.findByIdAndUpdate(id, req.body);
        res.json(furniture)
    } catch (error) {
        res.status(400).json(error);

    }
}

const registerfurniture = (req,res) => {
    console.log('se esta registrando un mueble')
    const form = new formidable.IncomingForm(); // Crea un nuevo formulario entrante
    form.keepExtensions = true;           // incluye las extenciones originales de los archivos
    // parse --> analiza la carga de un archivo entrante que contiene datos de formulario
    console.log('0')
    form.parse(req,(err,fields, files)=>{
        console.log('1')
        const { woods, nameFurniture, height,lenght,depth,weight,category,price } = fields; // los campos del esquema
        const createFurniture = new Furniture(fields);
        if(err){ 
           return res.status(400).json({error: "Imangen no se cargo"});
        }
        if(files.photo){// si el archivo para la foto exite
            if(files.photo[0].size > 1000000){// si el es mayor a 1 millon de bytes
                return res.status(400).json({error:"el tamano de la foto es mayor a 1 millon de Bytes"});
            } 
            console.log('2')      
            createFurniture.photo.data = fs.readFileSync(files.photo[0].filepath); // guardar la foto de forma sincronica 
            console.log('3');
            createFurniture.photo.contentType = files.photo[0].mimetype; // se guarda la extencion del archivo (png, jpg, etc...)
            console.log('4');
            const woodsArray = woods[0].split(','); 
            createFurniture.woods = woodsArray;
            createFurniture.nameFurniture = nameFurniture[0];
            createFurniture.category = category[0];
            createFurniture.height = Number(height[0]);
            createFurniture.depth = Number(depth[0]);
            createFurniture.weight = Number(weight[0]);
            createFurniture.price = Number(price[0]);
        }
        console.log('3')

        createFurniture.save()
        .then( furnitureSave => {res.json(furnitureSave); console.log('se creo el mueble')})
        .catch(error => res.status(400).json({msg:"existio un error al crear el mueble", error}));
    });
};

const updateFurniture =(req,res)=>{
    const { id } = req.params;
    console.log(id);
    const Form =new formidable.IncomingForm();
    Form.keepExtensions = true;
    Form.parse(req,(err,fields,files)=>{
        let { nameFurniture, woods, category, price, height, weight, depth } = fields;
        console.log(fields);
        let data;
        let contentType;
        console.log(fields);
        if(err){
            return res.status().json({msg:'there was an error', error: err});
        };
        if(files.photo){
            if(files.photo[0].size > 1000000){
                return res.status(400).json({msg:"el tamano de la foto es mayor a 1 millon de Bytes", error: err});
            };
           data = fs.readFileSync(files.photo[0].filepath);  // tengo que utilizar var
           contentType = files.photo[0].mimetype;           //  tengo que utilizar var 
            const woodsArray = woods[0].split(','); 
           woods = woodsArray;
           nameFurniture = nameFurniture[0];
           category = category[0];
           height = Number(height[0]);
           depth = Number(depth[0]);
           weight = Number(weight[0]);
            price = Number(price[0]);
        };
        Furniture.findByIdAndUpdate(id, {nameFurniture,woods,category,price,height,depth,weight, photo:{data, contentType}})
        .then(upfurniture => res.json(upfurniture))
        .catch(error => res.status(400).json({msg:"no se pudo acutalizar",error})); 
    });
};


const getAll =(req, res)=>{ 
// parametros de la consulta 
    const order =req.query.order ? req.query.order : 'asc';
    const sortBy = req.query.sortBy ? req.query.sortBy : 'nameFurniture';
    Furniture.find()
    .select('-photo')
    .populate('category')
    .sort([[sortBy,order]])
    .then(result => res.json(result))
    .catch(err => res.json({msg:"no funciona", error: err}));
};


// este metodo me eliminar un objeto, sin mostrarme la foto
const oneDelete = (req,res)=>{
    const {id}= req.params;
    Furniture.findByIdAndRemove(id)
    .select('-photo')
    .then(deleted => res.json(deleted))
    .catch(err => res.json(err));
};

// este metodo muestra solo un objeto, sin mostrarme la foto
const getOne = (req,res)=>{
    const {id}= req.params;
    Furniture.findById(id)
    // .populate('category')
    .then(one=> res.json(one))
    .catch(err => res.json(err));
};

// este metodo 
const photofurniture =(req, res, next)=>{
    const {id} = req.params;
    Furniture.findById(id)
        .then(foto => {
            console.log(foto.photo);
            res.json(foto.photo)
        })
    //.then(foto =>{
    //    res.set('Content-Type', foto.photo.contentType);
    //    res.send(foto.photo.data);
    //    next();
    //})
    .catch(err=> res.json(err));
};


const priceFurniture =(req,res, next)=>{
    const {gte, lte, categoryId}=req.params;
    const lowerLimit = parseFloat(gte);
    const upperLimit = parseFloat(lte);
    Furniture.find({$and:[{price:{$gte:lowerLimit, $lte:upperLimit}},{category:categoryId}]})
    .select('-photo')
    .then(furniture => res.json(furniture))
    .catch(err=> {console.log('exite un error',err); next()})   
}


const SearchName = (req,res,next) => {

    const { nameProduct } = req.params;    
    Furniture.find({nameFurniture:{$regex:nameProduct}})
    .select('-photo')
    .then(furniture => res.json(furniture))
    .catch(err=> {console.log('exite un error',err); next()})
}

module.exports ={registerfurniture, addFurniture, getAll, oneDelete, photofurniture, getOne,updateFurniture, updateFurni,priceFurniture, SearchName}




