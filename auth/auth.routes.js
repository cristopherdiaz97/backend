const User = require ('./auth.controller');
const region = require ('../admin/admin.controller');
module.exports = (router) => {
    router.post('/register', User.createUser);
    router.post('/login', User.loginUser);
    router.post('/direccion/comuna', region.create);
    // router.post('/tipos')
}
