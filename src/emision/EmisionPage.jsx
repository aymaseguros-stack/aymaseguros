/**
 * C-6b · /emision/:token — el cliente carga los datos para emitir su póliza.
 *
 * Mobile-first: un bloque por pantalla, progreso arriba, y al completar
 * cada bloque se guarda el borrador (PUT) para poder volver dentro de las
 * 72 h y seguir donde quedó.
 *
 * SEGURIDAD: el token vive en props y en memoria. No se escribe en
 * localStorage, no se loguea y no sale en ningún mensaje de error.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ErrorApi, WHATSAPP_AYMA, campoDelError, enviarFormulario, esPan, guardarBorrador,
  mensajeGeneral, obtenerFormulario, subirArchivo,
} from './api';
import {
  MEDIOS, OPCIONES, archivosDesdeServidor, armarBloques, armarPayload, bloqueCompleto,
  bloqueDelCampo, camposCobroVisibles, datosDesdeBorrador, errorDeArchivo, nombreParaSubir,
  problemasDelBloque,
} from './modelo';
import {
  CampoCatalogo, CampoOpcion, CampoTexto, CasilleroArchivo, Mensaje,
} from './componentes';

const MENSAJE_PAN_CAMPO =
  'Esto parece un número de tarjeta completo. No lo guardamos: cargá solo los últimos 4 dígitos.';

/** Un 404 (o cualquier rechazo del token) es la pantalla genérica. */
const tokenRechazado = (e) => e instanceof ErrorApi && [400, 401, 403, 404, 410].includes(e.status);

function Logo() {
  return <img src="/LOGO_AYMA_II.png" alt="AYMA Advisors" className="h-9 w-auto" />;
}

function Marco({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-lg items-center px-4 py-3"><Logo /></div>
      </header>
      <main className="mx-auto max-w-lg px-4 pb-16 pt-5">{children}</main>
    </div>
  );
}

export function PantallaInvalida() {
  return (
    <Marco>
      <div className="mt-10 rounded-2xl bg-white p-6 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">
          Este link no es válido o ya venció. Pedile uno nuevo a tu asesor.
        </h1>
        <a
          href={`https://wa.me/${WHATSAPP_AYMA}`}
          target="_blank" rel="noopener noreferrer"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3.5 text-base font-semibold text-white"
        >
          Escribir a AYMA por WhatsApp
        </a>
      </div>
    </Marco>
  );
}

function PantallaEnviada() {
  return (
    <Marco>
      <div className="mt-10 rounded-2xl bg-white p-6 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <svg viewBox="0 0 24 24" className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M5 12l5 5 9-10" /></svg>
        </div>
        <h1 className="text-xl font-semibold text-slate-900">Recibimos tus datos. Tu asesor los revisa y te avisa.</h1>
      </div>
    </Marco>
  );
}

function Progreso({ bloques, paso, completos, alcanzado, onIr }) {
  return (
    <nav aria-label="Progreso" className="mb-5">
      <div className="mb-2 flex items-baseline justify-between">
        <p className="text-sm font-medium text-slate-700">Paso {paso + 1} de {bloques.length} · {bloques[paso].titulo}</p>
        <p className="text-xs text-slate-500">{completos.filter(Boolean).length} de {bloques.length - 1} listos</p>
      </div>
      <ol className="flex gap-1.5">
        {bloques.map((b, i) => (
          <li key={b.id} className="flex-1">
            <button
              type="button" disabled={i > alcanzado} onClick={() => onIr(i)}
              aria-label={`${b.titulo}${completos[i] ? ' (completo)' : ''}`}
              aria-current={i === paso ? 'step' : undefined}
              className={`block h-2 w-full rounded-full ${
                i === paso ? 'bg-ayma-blue' : completos[i] ? 'bg-green-500' : i <= alcanzado ? 'bg-blue-200' : 'bg-slate-200'
              }`}
            />
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default function EmisionPage({ token }) {
  const [fase, setFase] = useState(token ? 'cargando' : 'invalido');
  const [errorCarga, setErrorCarga] = useState(null);
  const [form, setForm] = useState(null);
  const [datos, setDatos] = useState({});
  const [archivos, setArchivos] = useState({});
  const [cedulaTipo, setCedulaTipo] = useState('CEDULA_VERDE');
  const [errores, setErrores] = useState({});
  const [paso, setPaso] = useState(0);
  const [alcanzado, setAlcanzado] = useState(0);
  const [ocupado, setOcupado] = useState(false);
  const [aviso, setAviso] = useState(null);
  const [consentimiento, setConsentimiento] = useState(false);
  const previews = useRef([]);

  const bloques = useMemo(() => (form ? armarBloques(form) : []), [form]);

  const cargar = useCallback(async () => {
    if (!token) return;
    setFase('cargando');
    setErrorCarga(null);
    try {
      const f = await obtenerFormulario(token);
      const bs = armarBloques(f);
      const d = datosDesdeBorrador(f.borrador);
      const { archivos: a, cedulaTipo: ct } = archivosDesdeServidor(f.archivos_cargados, bs);
      setForm(f);
      setDatos(d);
      setArchivos(a);
      if (ct) setCedulaTipo(ct);
      // Retoma en el primer bloque sin completar.
      const primero = bs.findIndex((b, i) => i < bs.length - 1 && !bloqueCompleto(b, d, a));
      const inicio = primero === -1 ? bs.length - 1 : primero;
      setPaso(inicio);
      setAlcanzado(inicio);
      setFase('listo');
    } catch (e) {
      if (tokenRechazado(e)) setFase('invalido');
      else {
        setErrorCarga(mensajeGeneral(e));
        setFase('error');
      }
    }
  }, [token]);

  useEffect(() => { cargar(); }, [cargar]);

  useEffect(() => () => previews.current.forEach((u) => URL.revokeObjectURL(u)), []);

  const irA = (i) => {
    setPaso(i);
    setAviso(null);
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch { /* sin scroll en tests */ }
  };

  const cambiar = (nombre, valor) => {
    setDatos((d) => ({ ...d, [nombre]: valor }));
    setAviso(null);
    setErrores((e) => {
      if (!e[nombre] && !(nombre.startsWith('domicilio_') && e.domicilio)) return e;
      const { [nombre]: _, ...resto } = e;
      if (nombre.startsWith('domicilio_')) delete resto.domicilio;
      return resto;
    });
  };

  const actualizarArchivo = (slot, cambios) =>
    setArchivos((a) => ({ ...a, [slot]: { ...a[slot], ...cambios } }));

  const subir = async (slot, categoria, archivo) => {
    const invalido = errorDeArchivo(archivo);
    setErrores(({ [`archivo:${slot}`]: _, ...resto }) => resto);
    if (invalido) {
      actualizarArchivo(slot, { estado: 'error', error: invalido, archivo: null, preview: null });
      return;
    }
    const esHeic = /heic|heif/i.test(archivo.type) || /\.(heic|heif)$/i.test(archivo.name);
    let preview = null;
    if (archivo.type.startsWith('image/') && !esHeic && typeof URL.createObjectURL === 'function') {
      preview = URL.createObjectURL(archivo);
      previews.current.push(preview);
    }
    actualizarArchivo(slot, { estado: 'subiendo', progreso: 0, archivo, categoria, preview, error: null });
    try {
      await subirArchivo(token, archivo, nombreParaSubir(slot, archivo.name), categoria,
        (p) => actualizarArchivo(slot, { progreso: p }));
      actualizarArchivo(slot, { estado: 'hecho', progreso: 100 });
    } catch (e) {
      if (tokenRechazado(e)) { setFase('invalido'); return; }
      actualizarArchivo(slot, { estado: 'error', error: mensajeGeneral(e) });
    }
  };

  /** Traduce un 422 del backend al campo que lo causó. true si lo ubicó. */
  const ubicarError = (e) => {
    if (!(e instanceof ErrorApi) || e.status !== 422) return false;
    const campo = campoDelError(e.detalle);
    if (!campo) return false;
    const destino = campo === 'domicilio' ? 'domicilio_calle' : campo;
    setErrores((prev) => ({ ...prev, [destino]: esPan(e.detalle) ? MENSAJE_PAN_CAMPO : e.detalle }));
    const i = bloqueDelCampo(bloques, destino);
    if (i >= 0) irA(i);
    return true;
  };

  const continuar = async () => {
    const bloque = bloques[paso];
    const problemas = problemasDelBloque(bloque, datos, archivos);
    if (Object.keys(problemas).length) {
      setErrores((prev) => ({ ...prev, ...problemas }));
      setAviso('Revisá los datos marcados en rojo.');
      return;
    }
    setOcupado(true);
    setAviso(null);
    try {
      await guardarBorrador(token, armarPayload(datos));
      const siguiente = Math.min(paso + 1, bloques.length - 1);
      setAlcanzado((a) => Math.max(a, siguiente));
      irA(siguiente);
    } catch (e) {
      if (tokenRechazado(e)) setFase('invalido');
      else if (!ubicarError(e)) setAviso(mensajeGeneral(e));
    } finally {
      setOcupado(false);
    }
  };

  const enviar = async () => {
    if (!consentimiento) {
      setErrores((prev) => ({ ...prev, consentimiento: 'Para enviar tenés que marcar esta casilla.' }));
      return;
    }
    const pendiente = bloques.findIndex((b, i) => i < bloques.length - 1 && !bloqueCompleto(b, datos, archivos));
    if (pendiente !== -1) {
      setErrores((prev) => ({ ...prev, ...problemasDelBloque(bloques[pendiente], datos, archivos) }));
      irA(pendiente);
      setAviso('Te falta completar este paso antes de enviar.');
      return;
    }
    setOcupado(true);
    setAviso(null);
    try {
      await enviarFormulario(token, armarPayload(datos), form.consentimiento_version);
      setFase('enviado');
    } catch (e) {
      if (tokenRechazado(e)) setFase('invalido');
      else if (e instanceof ErrorApi && e.status === 422 && /consentimiento|casilla/i.test(String(e.detalle))) {
        setErrores((prev) => ({ ...prev, consentimiento: e.detalle }));
      } else if (!ubicarError(e)) setAviso(mensajeGeneral(e));
    } finally {
      setOcupado(false);
    }
  };

  if (fase === 'invalido') return <PantallaInvalida />;
  if (fase === 'enviado') return <PantallaEnviada />;
  if (fase === 'cargando') {
    return (
      <Marco>
        <div className="mt-10 flex flex-col items-center gap-3 text-slate-500" role="status">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-ayma-blue" />
          <p>Cargando tu formulario…</p>
        </div>
      </Marco>
    );
  }
  if (fase === 'error') {
    return (
      <Marco>
        <div className="mt-10 rounded-2xl bg-white p-6 text-center shadow-sm">
          <p className="text-slate-800">{errorCarga}</p>
          <button type="button" onClick={cargar} className="mt-5 w-full rounded-xl bg-ayma-blue px-5 py-3.5 font-semibold text-white">
            Probar de nuevo
          </button>
        </div>
      </Marco>
    );
  }

  const bloque = bloques[paso];
  const completos = bloques.map((b, i) => i < bloques.length - 1 && bloqueCompleto(b, datos, archivos));
  const esUltimo = paso === bloques.length - 1;
  const v = form.vehiculo;
  const vehiculo = v ? [v.marca, v.modelo, v.anio].filter(Boolean).join(' ') : '';
  const hayConsentimiento = !!(form.consentimiento_texto && form.consentimiento_version);

  const casillero = (s) => (
    <CasilleroArchivo
      key={s.slot} slot={s.slot} titulo={s.titulo} requerido={s.requerido} foto={s.foto}
      estado={archivos[s.slot]} error={errores[`archivo:${s.slot}`]}
      onElegir={(f) => subir(s.slot, s.categoria, f)}
      onReintentar={() => subir(s.slot, archivos[s.slot].categoria, archivos[s.slot].archivo)}
    />
  );

  return (
    <Marco>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-slate-900">Hola{form.nombre ? ` ${form.nombre}` : ''}</h1>
        {vehiculo && <p className="mt-1 text-slate-600">{vehiculo}</p>}
      </div>

      {form.observacion && (
        <div className="mb-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold">Tu asesor te pidió corregir esto:</p>
          <p className="mt-1 whitespace-pre-line">{form.observacion}</p>
        </div>
      )}

      <Progreso bloques={bloques} paso={paso} completos={completos} alcanzado={alcanzado} onIr={irA} />

      <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">{bloque.titulo}</h2>

        <div className="space-y-4">
          {bloque.campos.map((c) => (
            <CampoCatalogo key={c.nombre} campo={c} datos={datos} errores={errores} onChange={cambiar} />
          ))}

          {bloque.archivos.length > 0 && (
            <div className="space-y-3 pt-1">
              {bloque.id === 'inspeccion' && (
                <p className="text-sm text-slate-600">Sacá cada foto con el auto entero en cuadro y buena luz.</p>
              )}
              {bloque.archivos.map(casillero)}
            </div>
          )}

          {bloque.cedula && (
            <fieldset className="space-y-3 pt-1">
              <legend className="mb-1.5 text-sm font-medium text-slate-700">
                {bloque.cedula.titulo}{bloque.cedula.requerido && <span className="text-red-500"> *</span>}
              </legend>
              <div className="grid grid-cols-2 gap-2">
                {[['CEDULA_VERDE', 'Cédula verde'], ['TARJETA_AZUL', 'Cédula azul']].map(([cat, t]) => (
                  <button
                    key={cat} type="button" aria-pressed={cedulaTipo === cat}
                    onClick={() => setCedulaTipo(cat)} disabled={archivos.CEDULA?.estado === 'subiendo'}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-medium ${
                      cedulaTipo === cat ? 'border-ayma-blue bg-blue-50 text-ayma-blue' : 'border-slate-300 text-slate-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {casillero({ ...bloque.cedula, categoria: cedulaTipo, titulo: cedulaTipo === 'CEDULA_VERDE' ? 'Cédula verde' : 'Cédula azul' })}
            </fieldset>
          )}

          {bloque.cobro && (
            <BloqueCobro bloque={bloque} datos={datos} errores={errores} onChange={cambiar} />
          )}

          {esUltimo && (
            <div>
              {hayConsentimiento ? (
                <label className={`flex gap-3 rounded-xl border p-4 ${errores.consentimiento ? 'border-red-400' : 'border-slate-200'}`}>
                  <input
                    type="checkbox" name="consentimiento" checked={consentimiento}
                    onChange={(e) => {
                      setConsentimiento(e.target.checked);
                      setErrores(({ consentimiento: _, ...resto }) => resto);
                    }}
                    className="mt-1 h-5 w-5 flex-none accent-ayma-blue"
                  />
                  <span className="text-sm text-slate-700">
                    {form.consentimiento_texto}
                    <span className="mt-1 block text-xs text-slate-400">Versión {form.consentimiento_version}</span>
                  </span>
                </label>
              ) : (
                <p role="alert" className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800">
                  No pudimos cargar el texto de consentimiento. Escribile a tu asesor para completar el envío.
                </p>
              )}
              <Mensaje error={errores.consentimiento} />
            </div>
          )}
        </div>

        {aviso && <p role="alert" className="mt-4 text-sm text-red-600">{aviso}</p>}

        <div className="mt-6 flex gap-3">
          {paso > 0 && (
            <button
              type="button" onClick={() => irA(paso - 1)} disabled={ocupado}
              className="rounded-xl border border-slate-300 px-5 py-3.5 font-medium text-slate-700"
            >
              Atrás
            </button>
          )}
          {esUltimo ? (
            <button
              type="button" onClick={enviar}
              disabled={ocupado || !consentimiento || !hayConsentimiento}
              className="flex-1 rounded-xl bg-green-600 px-5 py-3.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {ocupado ? 'Enviando…' : 'Enviar mis datos'}
            </button>
          ) : (
            <button
              type="button" onClick={continuar} disabled={ocupado}
              className="flex-1 rounded-xl bg-ayma-blue px-5 py-3.5 font-semibold text-white disabled:opacity-60"
            >
              {ocupado ? 'Guardando…' : 'Guardar y seguir'}
            </button>
          )}
        </div>
        {!esUltimo && <p className="mt-3 text-center text-xs text-slate-500">Guardamos tu avance: podés volver a este link y seguir.</p>}
      </section>
    </Marco>
  );
}

/**
 * Cobro. NO HAY CAMPO PARA EL NÚMERO COMPLETO DE TARJETA NI PARA EL CVV:
 * solo marca, últimos 4 (exactamente 4 dígitos), titular y vencimiento.
 */
function BloqueCobro({ bloque, datos, errores, onChange }) {
  const { titulo, ayuda } = bloque.cobro;
  const visibles = camposCobroVisibles(datos.medio);
  const comun = (nombre) => ({
    nombre, titulo: titulo(nombre), valor: datos[nombre], onChange, error: errores[nombre], requerido: true,
  });

  return (
    <div className="space-y-4">
      <fieldset>
        <legend className="mb-1.5 block text-sm font-medium text-slate-700">
          {titulo('medio')}<span className="text-red-500"> *</span>
        </legend>
        <div className="space-y-2">
          {MEDIOS.map(([valor, t, sub]) => (
            <label
              key={valor}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 ${
                datos.medio === valor ? 'border-ayma-blue bg-blue-50' : 'border-slate-300 bg-white'
              }`}
            >
              <input
                type="radio" name="medio" value={valor} checked={datos.medio === valor}
                onChange={() => onChange('medio', valor)} className="h-5 w-5 accent-ayma-blue"
              />
              <span>
                <span className="block text-base font-medium text-slate-800">{t}</span>
                <span className="block text-sm text-slate-500">{sub}</span>
              </span>
            </label>
          ))}
        </div>
        <Mensaje error={errores.medio} />
      </fieldset>

      {visibles.includes('cbu_o_alias') && (
        <>
          <CampoTexto {...comun('cbu_o_alias')} ayuda={ayuda('cbu_o_alias')} autoComplete="off" />
          <CampoTexto {...comun('titular_cuenta')} autoComplete="name" />
        </>
      )}

      {visibles.includes('tarjeta_ultimos4') && (
        <>
          <p className="rounded-xl bg-blue-50 p-3 text-sm text-blue-900">
            Nunca te vamos a pedir el número completo de la tarjeta ni el código de seguridad.
          </p>
          <CampoOpcion {...comun('tarjeta_marca')} opciones={OPCIONES.tarjeta_marca} />
          <CampoTexto
            {...comun('tarjeta_ultimos4')}
            valor={datos.tarjeta_ultimos4}
            onChange={(n, val) => onChange(n, val.replace(/\D/g, '').slice(0, 4))}
            inputMode="numeric" maxLength={4} pattern="\d{4}" autoComplete="off" placeholder="1234"
            ayuda="Solo los últimos 4 números de la tarjeta."
          />
          <CampoTexto {...comun('tarjeta_titular')} autoComplete="off" ayuda="Como figura en la tarjeta." />
          <CampoTexto
            {...comun('tarjeta_vencimiento')}
            onChange={(n, val) => {
              const d = val.replace(/\D/g, '').slice(0, 4);
              onChange(n, d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d);
            }}
            inputMode="numeric" maxLength={5} autoComplete="off" placeholder="MM/AA"
          />
        </>
      )}

      {datos.medio === 'efectivo_transferencia' && (
        <p className="rounded-xl bg-slate-100 p-3 text-sm text-slate-700">
          Listo: tu asesor te pasa los datos para pagar cuando la póliza esté emitida.
        </p>
      )}
    </div>
  );
}
