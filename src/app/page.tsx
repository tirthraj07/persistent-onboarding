import { query } from "@/lib/Database/databaseConnect";

type Prop = {
  rows: any[],
  rowCount?: number | null
};

export default async function Home() {
  const result = await query('SELECT * FROM employees;');

  return (
    <>
      <pre>{JSON.stringify(result.rows, null, 2)}</pre>
    </>
  );
}
