const Proyecto = require ('../model/proyecto.model');
const { errorHandler } = require ('../helpers/dbErrorHandler');
const _ = require( 'lodash');
const formidable = require ('formidable');
const fs = require ('fs');

exports.create = (req, res, next ) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
     
    form.parse(req, (err, fields, files) => {

        
        if(err){
            return res.status(400).json({
                error: 'No se pudo cargar imagen'
            })
        }
        
        let proyecto = new Proyecto (fields)

        // 1kb = 1000b
        // 1mb = 1000000b

        const {nombre, tamaño, parteCuerpo, estiloTatuaje, estado} = fields
        if(!nombre || !tamaño || !parteCuerpo || !estiloTatuaje || !estado){
            return res.status(400).json({
                error: 'Debe rellenar todos los campos Obligatorios!'
            })
        }

        if(files.img){
            //Tamaño mayor a 1mb 
            if(files.img.size > 1000000){
                return res.status(400).json({
                    error: 'La imagen no puede superar 1mb en tamaño'
                })
            }

            proyecto.img.data = fs.readFileSync(files.img.path);
            proyecto.img.contentType = files.img.type;
        }
        proyecto.creador = req.profile._id
        proyecto.save((err, result) => {
        
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            
            
            res.json({
                proyecto
            });
               
        })
    });
    
}

exports.proyectoPorId = (req, res, next, id) => {
    Proyecto.findById(id).exec((err, proyecto) => {
        if(err || !proyecto) {
            return res.status(400).json({
                error: 'proyecto no encontrado'
              }); 
        }
        req.proyecto = proyecto;
        next();
    })
};

exports.buscar = (req, res) => {
    return res.json(req.proyecto);
}

exports.listaProyectos = (req, res) => {
    Proyecto.find()
    .populate('estado', 'nombre')
    .populate('creador', 'nombre')
    .populate('estiloTatuaje')
    .populate({path:'oferta', model: 'Oferta'})
    .exec((err, data) => {
        if(err) {
            return res.status(400).json({
                error: 'No existen estados aún!'
              }); 
        }
        res.json({data})
    })
};

exports.modificar = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    
    form.parse(req, (err, fields, files) => {


        if(err){
            return res.status(400).json({
                error: 'No se pudo cargar imagen'
            })
        }
        
        let proyecto = req.proyecto
        proyecto = _.extend(proyecto, fields)
        // 1kb = 1000b
        // 1mb = 1000000b

        const {nombre, tamaño, parteCuerpo, estiloTatuaje, estado} = fields
        if(!nombre || !tamaño || !parteCuerpo || !estiloTatuaje || !estado){
            return res.status(400).json({
                error: 'Debe rellenar todos los campos Obligatorios!'
            })
        }

        if(files.img){
            //Tamaño mayor a 1mb 
            if(files.img.size > 1000000){
                return res.status(400).json({
                    error: 'La imagen no puede superar 1mb en tamaño'
                })
            }

            proyecto.img.data = fs.readFileSync(files.img.path);
            proyecto.img.contentType = files.img.type;
        }
        
        proyecto.save((err, result) => {
        
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            
            res.json({
                mensaje: 'Has modificado tu proyecto con exito!',
                resultado: result
            });
               
        })

    });
    
}

exports.eliminar = (req, res) => {
    let proyecto = req.proyecto

    proyecto.remove((err, proyectoEliminado)=>{
        if(err){
            return res.status(400).json(err);
        }
        res.json({
            mensaje: `Tú proyecto: ${proyectoEliminado.nombre}, ha sido eliminado con exito!`
        })
    }
    );
}