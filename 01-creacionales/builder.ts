// BUILDER
// Construye objetos complejos paso a paso, separando la construcción de la representación.
// Ejemplo: constructor de consultas SQL.

class QueryBuilder {
  private tabla = "";
  private campos: string[] = ["*"];
  private condiciones: string[] = [];
  private limite?: number;

  from(tabla: string) { this.tabla = tabla; return this; }
  select(...campos: string[]) { this.campos = campos; return this; }
  where(condicion: string) { this.condiciones.push(condicion); return this; }
  limit(n: number) { this.limite = n; return this; }

  build(): string {
    let sql = `SELECT ${this.campos.join(", ")} FROM ${this.tabla}`;
    if (this.condiciones.length) sql += ` WHERE ${this.condiciones.join(" AND ")}`;
    if (this.limite !== undefined) sql += ` LIMIT ${this.limite}`;
    return sql;
  }
}

const sql = new QueryBuilder()
  .from("manos")
  .select("id", "posicion", "resultado")
  .where("stake = 'NL25'")
  .where("resultado > 0")
  .limit(10)
  .build();

console.log(sql);

export {};
