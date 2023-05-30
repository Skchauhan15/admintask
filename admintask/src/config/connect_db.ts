import db_config from "./db_config";
import mongoose  from "mongoose";

const connect_to_db = async () => {
    let { URI } = db_config

    let options:any = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
    mongoose.set("strictQuery",false)
    mongoose.connect(URI, options);
    mongoose.connection.on("connected",(data: any) => {
        console.log("Server load")
        console.log("connected to db")
    })
    mongoose.connection.on('error', (error: any) => {
        console.log(error)
    });
}   

export default connect_to_db;