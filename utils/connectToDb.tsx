//creates a connection to our mysql database
import mysql from "mysql2/promise";

export const connectToDb = async () => {
    try {
        const con = await mysql.createConnection({
            host: "localhost",
            user: 'root',
            password: 'eygwa', //<-this is a real password on my system
            database: 'dayratereport',
        });
        return con;
    } catch (error) {
        //console.error('Error creating MySQL connection:', error);
        throw error;
    }
};
