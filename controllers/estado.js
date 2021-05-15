const Estado = require ('../model/estado.model');
const { errorHandler } = require ('../helpers/dbErrorHandler');

exports.create = (req, res, next) => {
    

    const estado = new Estado(req.body);
    
    estado.save((err,data) =>{

        if(err){
            return res.status(400).json ({
                error : errorHandler(err)
            })
        }
        res.json({ data })

  });

};