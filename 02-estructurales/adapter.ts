// ADAPTER
// Convierte la interfaz de una clase en otra que el cliente espera.
// Ejemplo: una API antigua devuelve céntimos en un formato raro; la app trabaja en euros.

// Interfaz que espera nuestra app
interface ProveedorSaldo {
  getSaldoEuros(usuario: string): number;
}

// API heredada que no podemos tocar
class ApiLegacy {
  fetchBalance(userId: string): { uid: string; cents: number } {
    return { uid: userId, cents: 125050 };
  }
}

// Adaptador
class ApiLegacyAdapter implements ProveedorSaldo {
  constructor(private api: ApiLegacy) {}

  getSaldoEuros(usuario: string): number {
    const { cents } = this.api.fetchBalance(usuario);
    return cents / 100;
  }
}

function mostrarSaldo(proveedor: ProveedorSaldo) {
  console.log(`Saldo: ${proveedor.getSaldoEuros("josan").toFixed(2)} €`);
}

mostrarSaldo(new ApiLegacyAdapter(new ApiLegacy()));

export {};
