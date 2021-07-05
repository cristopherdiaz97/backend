const Region = require ('../model/region.model');


exports.regionPorId = (req, res, next, id) => {
    Region.findById(id).exec((err, region) => {
        if(err || !region) {
            return res.status(400).json({
                error: 'Region no encontrada!'
              }); 
        }
        req.region = region;
        next();
    })
};

exports.buscar = (req, res) => {
    return res.json(req.region);
}

exports.create = (req, res, next) => {
    

    const region = new Region(req.body);
    
    const {nombre} = region
    
    if(!nombre) {
        return res.status(400).json({
          error: 'Debe rellenar todos los campos'
        }); 
    }

    region.save((error,data) =>{

        if(error){
            return res.status(400).json ({error: 'Ha ocurrido un error!'})
        }
        res.json({ data })

  });

};

exports.eliminar = (req, res) => {
    let region = req.region

    region.remove((err, regionEliminada)=>{
        if(err){
            return res.status(400).json({error: 'Ha ocurrido un error'});
        }
        res.json({
            mensaje: `Region ${regionEliminada.nombre} eliminada con exito!`
        })
    }
    );
}

exports.modificar = (req, res) => {
    
    const region = req.region;
    region.nombre = req.body.nombre;

    region.save((error,data) =>{

        if(error){
            return res.status(400).json ({error: 'Ha ocurrido un error'})
        }
        res.json({ data })

  });

};

exports.listaRegiones = (req, res) => {
    Region.find().exec((err, data) => {
        if(err) {
            return res.status(400).json({
                error: 'No existen regiones aún!'
              }); 
        }
        if(data.length === 0) {
            return res.status(400).json({
                error: 'Aún no existen regiones'
            })
        }
        res.json({data})
    })
};
