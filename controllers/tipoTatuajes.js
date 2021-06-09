const TipoTatuaje = require ('../model/tipoTatuajes.model');
const { errorHandler } = require ('../helpers/dbErrorHandler');

exports.create = (req, res, next) => {
    
    const tipoTatuaje = new TipoTatuaje(req.body);
    
    const {nombre} = tipoTatuaje
    
    if(!nombre) {
        return res.status(400).json({
          error: 'Debe rellenar todos los campos'
        }); 
    }
    tipoTatuaje.save((error,data) =>{

        if(error){
            return res.status(400).json ({
                error : 'Ha ocurrido un error'
            })
        }
        res.json({ data })

  });

};

exports.tipoTatuajePorId = (req, res, next, id) => {
    TipoTatuaje.findById(id).exec((err, tipoTatuaje) => {
        if(err || !tipoTatuaje) {
            return res.status(400).json({
                error: 'Tatuaje no encontrado'
              }); 
        }
        req.tipoTatuaje = tipoTatuaje;
        next();
    })
};

exports.buscar = (req, res) => {
    return res.json(req.tipoTatuaje);
}

exports.eliminar = (req, res) => {
    let tatuaje = req.tipoTatuaje

    tatuaje.remove((err, tatuajeEliminado)=>{
        if(err){
            return res.status(400).json({error: 'Ha ocurrido un error'});
        }
        res.json({
            mensaje: `Tipo de tatuaje ${tatuajeEliminado.nombre} eliminado con exito!`
        })
    }
    );
}

exports.modificar = (req, res) => {
    
    const tatuaje = req.tipoTatuaje;
    tatuaje.nombre = req.body.nombre;

    tatuaje.save((error,data) =>{

        if(error){
            return res.status(400).json ({error: 'Ha ocurrido un error'})
        }
        res.json({ data })

  });

};

exports.listaTipoTatuajes = (req, res) => {
    TipoTatuaje.find().exec((err, data) => {
        if(err) {
            return res.status(400).json({
                error: 'No existen tipos de tatuajes aún!'
              }); 
        }
        res.json({data})
    })
};