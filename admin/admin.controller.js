const Region = require ('../model/region.model');
const { response } = require('express');

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

    // region.createRegion ( newRegion, (err, region) => {
    //     re
    //     if(!region) {
    //         console.log("Region no fue guardada", err);
    //     } 
    //     else{
    //         // const region2 = {
    //         //     nombre : region.nombre
    //         // };
    //         res.send({region});
    //     }
    // })

};


