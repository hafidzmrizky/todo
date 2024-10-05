const { Pool } = require('pg');
import dotenv from "dotenv";

dotenv.config({ path: 'secret/.env'  });

const pgdb = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

export default pgdb;