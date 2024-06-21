import { Pool, QueryResult } from 'pg';

// Initialize a connection pool for PostgreSQL database.
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
})

/**
 * Executes a SQL query on the PostgreSQL database using the connection pool.
 * 
 * @param {string} text - The SQL query string to execute.
 * @param {any[]} [params] - Optional parameters to be substituted in the query.
 * @returns {Promise<QueryResult<any>>} A promise that resolves with the query result.
 */
const query = (text: string, params?:any[]):Promise<QueryResult<any>> => {
    return pool.query(text,params);
}

export { query }