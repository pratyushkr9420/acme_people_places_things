const Sequelize = require('sequelize');
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_people_places_things_db');

const Person = conn.define('person', {
    name:{
        type:Sequelize.STRING,
        unique:true,
        allowNull:false
    }
});

const Place = conn.define('place', {
    name:{
        type:Sequelize.STRING,
        unique:true,
        allowNull:false
    }
});

const Thing = conn.define('thing', {
    name:{
        type:Sequelize.STRING,
        unique:true,
        allowNull:false
    }
});

const Sovenir = conn.define('sovenir', {});

Sovenir.belongsTo(Person);
Person.hasMany(Sovenir);

Sovenir.belongsTo(Place);
Place.hasMany(Sovenir);

Sovenir.belongsTo(Thing);
Thing.hasMany(Sovenir);

const syncAndSeed = async() => {
    await conn.sync({force:true});
    const [moe,larry,lucy,ethyl] = await Promise.all([
        Person.create({name:'moe'}),
        Person.create({name:'larry'}),
        Person.create({name:'lucy'}),
        Person.create({name:'ethyl'})
    ]);
    const [paris,nyc,chicago,london] = await Promise.all([
        Place.create({name:'Paris'}),
        Place.create({name:'NYC'}),
        Place.create({name:'Chicago'}),
        Place.create({name:'London'})
    ]);
    const [hat,shirt,bag,cap] = await Promise.all([
        Thing.create({name:'hat'}),
        Thing.create({name:'shirt'}),
        Thing.create({name:'bag'}),
        Thing.create({name:'cap'})
    ]);
    await Promise.all([
        Sovenir.create({personId: moe.id,thingId: hat.id,placeId: london.id})
    ]);
}

module.exports = {
    conn,
    Person,
    Place,
    Thing,
    Sovenir,
    syncAndSeed
}