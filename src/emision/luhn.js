/**
 * Detección de PAN del lado del cliente. ES SOLO UN AVISO: el que decide es
 * el servidor (app/services/emision_pii.py del portal), que rechaza con 422.
 *
 * Misma regla que el backend para que el aviso y el rechazo coincidan:
 * se descartan espacios, guiones, puntos y guiones bajos; se mira cada
 * corrida de dígitos ENTERA (nunca una subsecuencia, o un CBU de 22 dígitos
 * dispararía el aviso casi siempre) y se avisa si mide 13 a 19 y cierra Luhn.
 */

const SEPARADORES = /[\s\-‐-―._]/g;

export function pasaLuhn(digitos) {
  let total = 0;
  for (let i = 0; i < digitos.length; i += 1) {
    let valor = digitos.charCodeAt(digitos.length - 1 - i) - 48;
    if (i % 2 === 1) {
      valor *= 2;
      if (valor > 9) valor -= 9;
    }
    total += valor;
  }
  return total % 10 === 0;
}

export function pareceTarjeta(texto) {
  if (typeof texto !== 'string' || !texto) return false;
  const corridas = texto.replace(SEPARADORES, '').match(/\d+/g) || [];
  return corridas.some((c) => c.length >= 13 && c.length <= 19 && pasaLuhn(c));
}
