const BASE_URL = "http://localhost:3000";

const EndPoints = {
  alimentador: "/moduloMestre/alimentador",
  alimentador_escrita: "/moduloMestre/alimentador-escrita",
  alimentador_download_manual: "/moduloMestre/exportar/alimentador_manual",
  alimentador_download_automatico: "/moduloMestre/exportar/alimentador_automatico",
  alimentador: "/moduloMestre/alimentador",
  alimentador_escrita: "/moduloMestre/alimentador-escrita",
  historicoID: "/moduloMestre/ultimo-por-id",
  Ip: "/moduloMestre/ip",
  resgistraTemperatura: "/moduloMestre/registraTemperatura",
};

export async function EnviarModoAlimentador(modo: number, id: number) {
  try {
    await fetch(`${BASE_URL}${EndPoints.alimentador}/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ modo }),
    });
  } catch (err) {
    console.error("Erro ao enviar modo", err);
  }
}
export async function PararAlimentador(id: number) {
  try {
    await fetch(`${BASE_URL}${EndPoints.alimentador}/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ setPointManual: 150, modo: 2 }),
    });
  } catch (err) {
    console.error("Erro ao enviar a parada alimentador", err);
  }
}
export async function AlimentadorEscrita(id: number) {
  try {
    const response = await fetch(
      `${BASE_URL}${EndPoints.alimentador_escrita}/${id}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    return await response.json();
  } catch (err) {
    console.error("Erro de conexão escrita alimentador", err);
  }
}

export async function AtualizaAlimentador(id: number, modo: number) {
  try {
    await fetch(`http://localhost:3000/moduloMestre/alimentador/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Modo: modo }),
    });
  } catch (err) {
    console.error(`Erro ao enviar o modo ${modo} para id:${id}`, err);
  }
}

export async function AlimentadorAutomatico(
  id: number,
  formData: Record<string, string | number>
) {
  try {
    await fetch(`http://localhost:3000/moduloMestre/alimentador/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
  } catch (err) {
    console.error("Erro ao Enviar Config Automatica", err);
  }
}

export async function EnviarSetpointDispositivo(
  id: number,
  { setPointManual, modo }: { setPointManual: number; modo: number }
) {
  try {
    await fetch(`${BASE_URL}${EndPoints.alimentador}/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ setPointManual: setPointManual, modo }),
    });
  } catch (err) {
    console.error(`Erro ao enviar ${setPointManual} no id ${id}`, err);
  }
}
export async function AtualizaIP(ip: string) {
  try {
    const response = await fetch(`${BASE_URL}${EndPoints.Ip}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ip }),
    });
    const data = await response.json();
    return data.message;
  } catch (err) {
    return `Erro ao enviar o IP ${ip}` + err;
  }
}
export async function ultimoID() {
  try {
    const response = await fetch(`${BASE_URL}${EndPoints.historicoID}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.log("Erro ao trazer dados por ID ", err);
  }
}
export async function registraTemperatura(
  id: number,
  temperatura: number,
  modo: number
) {
  try {
    await fetch(`${BASE_URL}${EndPoints.resgistraTemperatura}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, temperatura, modo }),
    });
  } catch {
    console.log("Erro ao enviar nova temperatura");
  }
}

// Alimentador functions
export async function EnviarModoAlimentador(modo: number, id: number) {
  try {
    await fetch(`${BASE_URL}${EndPoints.alimentador}/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ modo }),
    });
  } catch (err) {
    console.error("Erro ao enviar modo alimentador", err);
  }
}

export async function PararAlimentador(id: number) {
  try {
    await fetch(`${BASE_URL}${EndPoints.alimentador}/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ modo: 0 }),
    });
  } catch (err) {
    console.error("Erro ao parar alimentador", err);
  }
}

export async function AlimentadorEscrita(id: number) {
  try {
    const response = await fetch(
      `${BASE_URL}${EndPoints.alimentador_escrita}/${id}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    return await response.json();
  } catch (err) {
    console.error("Erro de conexão escrita alimentador", err);
  }
}

