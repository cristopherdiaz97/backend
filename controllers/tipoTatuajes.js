const TipoTatuaje = require ('../model/tipoTatuajes.model');
const { errorHandler } = require ('../helpers/dbErrorHandler');

exports.create = (req, res, next) => {
    
    const tipoTatuaje = new TipoTatuaje(req.body);
    
    tipoTatuaje.save((error,data) =>{

        if(error){
            return res.status(400).json ({
                error : errorHandler(error)
            })
        }
        res.json({ data })

  });

};