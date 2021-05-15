const Region = require ('../model/region.model');
const { errorHandler } = require ('../helpers/dbErrorHandler');

exports.create = (req, res, next) => {
    

    const region = new Region(req.body);
    
    region.save((error,data) =>{

        if(error){
            return res.status(400).json ({
                error : errorHandler(error)
            })
        }
        res.json({ data })

  });

};


