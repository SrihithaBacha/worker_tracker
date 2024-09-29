const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors');
const {login}=require('./controllers/authController');

const app = express();

app.use(cors({
    origin: '*'
}));
app.use(express.json());
dotenv.config({path : "./config/.env"});
app.use(express.json({ limit: '10mb' }));

// Increase URL-encoded payload limit to 10MB
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.post('/api/login',login);
//app.use( require("./controllers/employee") );
app.use( require("./controllers/siteadmin") );
//app.use( require("./controllers/superadmin") );
app.listen(5000, () => {
    console.log("running on port 5000");
});
