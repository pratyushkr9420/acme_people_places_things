const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const {conn, Person, Place, Thing, Sovenir,syncAndSeed} = require('./db');

app.use('/public',express.static('public'));
app.use(require('method-override')("_method"));
app.use(express.urlencoded({extended:false}));
app.use('/sovenirs',require('./routers/sovenirs'));

app.get('/', async(req,res,next) => {
    res.redirect('/sovenirs');
})


app.listen(port, async() => {
    try{
        console.log(`listening at port ${port}`);
        syncAndSeed();
    }
    catch(ex){
        console.log(ex);
    }
});




