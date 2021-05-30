const Oferta = require ('../model/ofertas.model');
const { errorHandler } = require ('../helpers/dbErrorHandler');
const Proyecto = require ('../model/proyecto.model')

exports.create = (req, res, next) => {
    const proyecto = req.proyecto
    const perfil = req.profile
    const oferta = new Oferta(req.body)
    const {descripcion, valor, estado} = oferta
    oferta.ofertante = perfil._id
    if(!descripcion, !valor, !estado) {
        return res.status(400).json({
          error: 'Debe ingresar todos los campos obligatorios!'
        }); 
    }

    if(!proyecto, !perfil){
        return res.status(400).json({
            mensaje: 'Oops! ha ocurrido un error'
        })
    }
    
    if(proyecto.creador._id.equals(perfil._id) ){
        return res.status(400).json({
            mensaje: 'No puedes realizar ofertas a tu propio proyecto!'
        })
    }
    
    oferta.save((err, ofertaIngresada) => {
        
        if(err){
            return res.status(400).json ({
                error : errorHandler(err)
            })
        }
        Proyecto.updateOne({ _id: proyecto._id}, 
            {
                $push: { 
                    oferta: ofertaIngresada._id
            }
            })
            .exec( (err, result) => {
                if(err){
                    return res.status(400).json({error : err})
                }else{
                    res.json({
                        text: `Tu oferta ha sido ingresada con exito al proyecto: ${proyecto.nombre}`,
                       
                    })
                }
            })
    })
        
    
    

};

// exports.estadoPorId = (req, res, next, id) => {
//     Estado.findById(id).exec((err, estado) => {
//         if(err || !estado) {
//             return res.status(400).json({
//                 error: 'Estado no encontrado'
//               }); 
//         }
//         req.estado = estado;
//         next();
//     })
// };

// exports.buscar = (req, res) => {
//     return res.json(req.estado);
// }

// exports.eliminar = (req, res) => {
//     let estado = req.estado

//     estado.remove((err, estadoEliminado)=>{
//         if(err){
//             return res.status(400).json(err);
//         }
//         res.json({
//             mensaje: `Estado ${estadoEliminado.nombre} eliminado con exito!`
//         })
//     }
//     );
// }

// exports.modificar = (req, res) => {
    
//     const estado = req.estado;
//     estado.nombre = req.body.nombre;

//     estado.save((error,data) =>{

//         if(error){
//             return res.status(400).json (error)
//         }
//         res.json({ data })

//   });

// };

// exports.listaEstados = (req, res) => {
//     Estado.find().exec((err, data) => {
//         if(err) {
//             return res.status(400).json({
//                 error: 'No existen estados aún!'
//               }); 
//         }
//         res.json({data})
//     })
// };