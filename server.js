'user strict' 
const cors = require ('cors');
const authRoutes = require('./auth/auth.routes');
const express = require ('express');
const properties = require('./config/properties');
const app = express();
const router = express.Router();
const DB = require ('./config/db');
//init
DB();


app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api', router);
authRoutes(router);
router.get('/', (req, res) => {
    res.send('Hello from home');
});

// app.use(router);
app.listen(properties.PORT, () => console.log(`Server running on port ${properties.PORT}`));
