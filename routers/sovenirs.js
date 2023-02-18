const express = require('express');
const app = express.Router();
const {conn, Person, Place, Thing, Sovenir,syncAndSeed} = require('../db');

app.post('/',async(req,res,next) => {
    try{
        const sovenir = await Sovenir.create(req.body);
        res.redirect('/');
    }
    catch(ex){
        next(ex)
    }
})

app.delete('/:id',async(req,res,next)=>{
    try{
        const sovenir = await Sovenir.findByPk(req.params.id);
        await sovenir.destroy();
        res.redirect('/')

    }
    catch(ex){
        next(ex);
    }
});

app.get('/', async(req,res,next) => {
    try{
        const people = await Person.findAll();
        const places = await Place.findAll();
        const things = await Thing.findAll();
        const sovenirs = await Sovenir.findAll({
            include:[Person,Place,Thing]
        });
        res.send(`
        <html>
         <head>
          <link rel='stylesheet' href='/public/design.css' >
          <title>'Acme People, Places and Things'</title>
         </head>
         <body>
          <h1>Acme Peoplem Places and Things<h1>
          <h2>People</h2>
           ${
            people.map(person => {
                return `<li>${person.name}</li>`
            }).join(" ")
           }
         <br>
         <h2>Places</h2>
           ${
            places.map(place => {
                return `<li>${place.name}</li>`
            }).join(" ")
           }
         <br>
         <h2>Things</h2>
         ${
          things.map(thing => {
              return `<li>${thing.name}</li>`
          }).join(" ")
         }
         <h2>Sovenir purchases</h2>
         <p>Create a new Sovenir Purchase by selecting a Person, the Place they purchased the Sovenir, and the thing they bought.</p>
         <form method='POST' action = '/sovenirs'>
          Person
          <select name='personId'>
           ${
            people.map(person => {
                return `<option value='${person.id}'>${person.name}</option>`
            })
           }
          </select>
          Place
          <select name='placeId'>
           ${
            places.map(place => {
                return `<option value='${place.id}'>${place.name}</option>`
            })
           }
          </select>
          Things
          <select name='thingId'>
           ${
            things.map(thing => {
                return `<option value='${thing.id}'>${thing.name}</option>`
            })
           }
          </select>
          <button>Create</button>
         </form>
         ${
            sovenirs.map(sovenir => {
                return `<li>
                ${sovenir.person ? sovenir.person.name:'nobody'} purchased a ${sovenir.thing ? sovenir.thing.name:"nothing"} in ${sovenir.place ? sovenir.place.name:'nowhere'}
                <form method = 'POST' action='/sovenirs/${sovenir.id}?_method=delete'>
                 <button>Delete</button>
                </form>
                </li>`
            }).join(" ")

         }

         </body>
        </html>
        `);
    }
    catch(ex){
        next(ex);
    }
})

module.exports = app;