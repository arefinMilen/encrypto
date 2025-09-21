import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
}
const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("=> using existing database connection");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {})
        connection.isConnected =  db.connections[0].readyState;
        console.log("=> using new database connection");
        console.log("db informations: ", db);
        console.log("db.connections info : ", db.connections);

    } catch (error) {
        
        console.log("Error connecting to the database", error);
        process.exit(1);
    }
}

export default dbConnect;
