import { query } from "@/lib/Database/databaseConnect";

type SQLResult = {
  rows: any[],
  rowCount?: number | null
};

export const dynamic = "force-dynamic";

export default async function Home() {
  const queryStatement = `SELECT * FROM employees;`
  const result = await query(queryStatement);
  const data: SQLResult = {
    rows : result.rows,
    rowCount : result.rowCount
  }

  return (
    <>
      <p>Query: {queryStatement}</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
}
