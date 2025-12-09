export const currency = (n) =>
  n.toLocaleString("es-CL", { style: "currency", currency: "CLP" });
