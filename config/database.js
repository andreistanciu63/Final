if (process.env.NODE_ENV === "production") {
    module.exports = {
        mongoURI: 'mongodb+srv://andreistanciu63:<password>@mydatabase.omcs39o.mongodb.net/?retryWrites=true&w=majority'}
} else {
    module.exports ={mongoURI: 'mongodb://0.0.0.0:27017/prebook'}
}