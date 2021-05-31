const Estado = require ('../model/estado.model');
const { errorHandler } = require ('../helpers/dbErrorHandler');

exports.create = (req, res, next) => {
    
    const estado = new Estado(req.body);
    const {nombre} = estado

    if(!nombre) {
        return res.status(400).json({
          error: 'Campo nombre debe incluir datos!'
        }); 
    }
    estado.save((err,data) =>{

        if(err){
            return res.status(400).json ({
                error : errorHandler(err)
            })
        }
            res.json({ data })
        });

};

//METODO MIDDLEWARE (RUTAS)
exports.estadoPorId = (req, res, next, id) => {
    Estado.findById(id).exec((err, estado) => {
        if(err || !estado) {
            return res.status(400).json({
                error: 'Estado no encontrado'
              }); 
        }
        req.estado = estado;
        next();
    })
};

exports.buscar = (req, res) => {
    return res.json(req.estado);
}

exports.eliminar = (req, res) => {
    let estado = req.estado

    estado.remove((err, estadoEliminado)=>{
        if(err){
            return res.status(400).json(err);
        }
        res.json({
            mensaje: `Estado ${estadoEliminado.nombre} eliminado con exito!`
        })
    }
    );
}

exports.modificar = (req, res) => {
    
    const estado = req.estado;
    estado.nombre = req.body.nombre;

    estado.save((error,data) =>{

        if(error){
            return res.status(400).json (error)
        }
        res.json({ data })

  });

};

exports.listaEstados = (req, res) => {
    Estado.find().exec((err, data) => {
        if(err) {
            return res.status(400).json({
                error: 'No existen estados aún!'
              }); 
        }
        res.json({data})
    })
};