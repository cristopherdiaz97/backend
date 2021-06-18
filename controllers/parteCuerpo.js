const Parte = require ('../model/parteCuerpo.model');


exports.partePorId = (req, res, next, id) => {
    Parte.findById(id).exec((err, parte) => {
        if(err || !parte) {
            return res.status(400).json({
                error: 'Parte del cuerpo no encontrada!'
              }); 
        }
        req.parte = parte;
        next();
    })
};

exports.buscar = (req, res) => {
    return res.json(req.parte);
}

exports.create = (req, res, next) => {
    

    const parte = new Parte(req.body);
    
    const {nombre} = parte
    
    if(!nombre) {
        return res.status(400).json({
          error: 'Debe rellenar todos los campos'
        }); 
    }

    parte.save((error,data) =>{

        if(error){
            return res.status(400).json ({error: 'Ha ocurrido un error!'})
        }
        res.json({ data })

  });

};

exports.eliminar = (req, res) => {
    let parte = req.parte

    parte.remove((err, parteEliminada)=>{
        if(err){
            return res.status(400).json({error: 'Ha ocurrido un error'});
        }
        res.json({
            mensaje: `${parteEliminada.nombre} eliminada con exito!`
        })
    }
    );
}

exports.modificar = (req, res) => {
    
    const parte = req.parte;
    parte.nombre = req.body.nombre;

    parte.save((error,data) =>{

        if(error){
            return res.status(400).json ({error: 'Ha ocurrido un error'})
        }
        res.json({ data })

  });

};

exports.listaPartes= (req, res) => {
    Parte.find().exec((err, data) => {
        if(err) {
            return res.status(400).json({
                error: 'No existen partes del cuerpo aún!'
              }); 
        }
        res.json({data})
    })
};
