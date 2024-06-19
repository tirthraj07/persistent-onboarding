import { Pool, QueryResult } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
})


const query = (text: string, params?:any[]):Promise<QueryResult<any>> => {
    return pool.query(text,params);
}

export { query }