// PROXY
// Un sustituto que controla el acceso a otro objeto (caché, permisos, carga perezosa...).
// Ejemplo: proxy con caché delante de una API lenta.

interface ServicioCuotas {
  getCuota(partido: string): Promise<number>;
}

class ApiCuotas implements ServicioCuotas {
  async getCuota(partido: string) {
    console.log(`  🐢 Llamada real a la API para "${partido}"`);
    await new Promise((r) => setTimeout(r, 300));
    return 1.85;
  }
}

class ApiCuotasProxy implements ServicioCuotas {
  private cache = new Map<string, number>();
  constructor(private real: ServicioCuotas) {}

  async getCuota(partido: string) {
    if (this.cache.has(partido)) {
      console.log(`  ⚡ Desde caché "${partido}"`);
      return this.cache.get(partido)!;
    }
    const cuota = await this.real.getCuota(partido);
    this.cache.set(partido, cuota);
    return cuota;
  }
}

async function main() {
  const servicio: ServicioCuotas = new ApiCuotasProxy(new ApiCuotas());
  console.log(await servicio.getCuota("Nadal vs Alcaraz"));
  console.log(await servicio.getCuota("Nadal vs Alcaraz"));
}

main();

export {};
