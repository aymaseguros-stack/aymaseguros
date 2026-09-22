import { useRef } from 'react';
import { pareceTarjeta } from './luhn';
import { OPCIONES } from './modelo';

const claseInput = (conError) =>
  `w-full rounded-xl border bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-400 ` +
  `focus:outline-none focus:ring-2 focus:ring-ayma-blue-light ` +
  (conError ? 'border-red-500' : 'border-slate-300');

const AVISO_TARJETA =
  'Esto parece un número de tarjeta completo. No lo cargues: solo necesitamos los últimos 4 dígitos.';

export function Mensaje({ id, error, aviso }) {
  if (error) return <p id={id} role="alert" className="mt-1.5 text-sm text-red-600">{error}</p>;
  if (aviso) return <p id={id} className="mt-1.5 text-sm text-amber-700">{aviso}</p>;
  return null;
}

/** Un input de texto con label, ayuda, error del server y aviso Luhn. */
export function CampoTexto({
  nombre, titulo, valor, onChange, error, ayuda, requerido, tipo = 'text',
  inputMode, autoComplete, maxLength, placeholder, pattern,
}) {
  const id = `campo-${nombre}`;
  const aviso = pareceTarjeta(valor) ? AVISO_TARJETA : null;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
        {titulo}{requerido && <span className="text-red-500"> *</span>}
      </label>
      {tipo === 'textarea' ? (
        <textarea
          id={id} name={nombre} rows={3} value={valor ?? ''}
          onChange={(e) => onChange(nombre, e.target.value)}
          className={claseInput(!!error)} aria-invalid={!!error} aria-describedby={`${id}-msg`}
        />
      ) : (
        <input
          id={id} name={nombre} type={tipo} value={valor ?? ''}
          onChange={(e) => onChange(nombre, e.target.value)}
          inputMode={inputMode} autoComplete={autoComplete} maxLength={maxLength}
          placeholder={placeholder} pattern={pattern}
          className={claseInput(!!error)} aria-invalid={!!error} aria-describedby={`${id}-msg`}
        />
      )}
      {ayuda && !error && !aviso && <p className="mt-1.5 text-sm text-slate-500">{ayuda}</p>}
      <Mensaje id={`${id}-msg`} error={error} aviso={aviso} />
    </div>
  );
}

export function CampoOpcion({ nombre, titulo, valor, onChange, error, requerido, opciones, ayuda }) {
  const id = `campo-${nombre}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
        {titulo}{requerido && <span className="text-red-500"> *</span>}
      </label>
      <select
        id={id} name={nombre} value={valor ?? ''} onChange={(e) => onChange(nombre, e.target.value)}
        className={claseInput(!!error)} aria-invalid={!!error} aria-describedby={`${id}-msg`}
      >
        <option value="">Elegí una opción</option>
        {opciones.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
      </select>
      {ayuda && !error && <p className="mt-1.5 text-sm text-slate-500">{ayuda}</p>}
      <Mensaje id={`${id}-msg`} error={error} />
    </div>
  );
}

export function CampoSiNo({ nombre, titulo, valor, onChange, error, requerido }) {
  return (
    <fieldset>
      <legend className="mb-1.5 block text-sm font-medium text-slate-700">
        {titulo}{requerido && <span className="text-red-500"> *</span>}
      </legend>
      <div className="grid grid-cols-2 gap-2">
        {[[true, 'Sí'], [false, 'No']].map(([v, t]) => (
          <button
            key={t} type="button" onClick={() => onChange(nombre, v)} aria-pressed={valor === v}
            className={`rounded-xl border px-4 py-3 text-base font-medium ${
              valor === v ? 'border-ayma-blue bg-blue-50 text-ayma-blue' : 'border-slate-300 bg-white text-slate-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <Mensaje error={error} />
    </fieldset>
  );
}

const PROPS_POR_CAMPO = {
  numero_documento: { inputMode: 'numeric', autoComplete: 'off' },
  cuit: { inputMode: 'numeric', autoComplete: 'off', placeholder: '20-12345678-9' },
  nombre: { autoComplete: 'given-name' },
  apellido: { autoComplete: 'family-name' },
  localidad: { autoComplete: 'address-level2' },
  provincia: { autoComplete: 'address-level1' },
  codigo_postal: { inputMode: 'numeric', autoComplete: 'postal-code' },
  codigo_postal_guarda: { inputMode: 'numeric', autoComplete: 'off' },
  kilometraje: { inputMode: 'numeric', autoComplete: 'off', placeholder: 'Aproximado, por ejemplo 45000' },
};

/** Un campo del catálogo del backend, dibujado según su `tipo`. */
export function CampoCatalogo({ campo, datos, errores, onChange }) {
  const comun = {
    nombre: campo.nombre, titulo: campo.titulo, valor: datos[campo.nombre],
    onChange, error: errores[campo.nombre], requerido: campo.requerido, ayuda: campo.ayuda,
  };

  if (campo.nombre === 'domicilio') {
    return (
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <CampoTexto
            {...comun} nombre="domicilio_calle" titulo="Calle" valor={datos.domicilio_calle}
            error={errores.domicilio_calle || errores.domicilio} autoComplete="address-line1" ayuda={null}
          />
        </div>
        <CampoTexto
          {...comun} nombre="domicilio_numero" titulo="Número" valor={datos.domicilio_numero}
          error={errores.domicilio_numero} inputMode="numeric" autoComplete="off" ayuda={null}
        />
      </div>
    );
  }

  switch (campo.tipo) {
    case 'opcion':
      return OPCIONES[campo.nombre]
        ? <CampoOpcion {...comun} opciones={OPCIONES[campo.nombre]} />
        : <CampoTexto {...comun} />;
    case 'booleano':
      return <CampoSiNo {...comun} />;
    case 'fecha':
      return <CampoTexto {...comun} tipo="date" autoComplete={campo.nombre === 'fecha_nacimiento' ? 'bday' : 'off'} />;
    case 'email':
      return <CampoTexto {...comun} tipo="email" inputMode="email" autoComplete="email" />;
    case 'telefono':
      return <CampoTexto {...comun} tipo="tel" inputMode="tel" autoComplete="tel" />;
    case 'numero':
      return <CampoTexto {...comun} {...PROPS_POR_CAMPO[campo.nombre]} inputMode="numeric" />;
    case 'texto_largo':
      return <CampoTexto {...comun} tipo="textarea" />;
    case 'archivo':
      return null; // los archivos se dibujan en sus casilleros
    default:
      return <CampoTexto {...comun} {...PROPS_POR_CAMPO[campo.nombre]} />;
  }
}

function IconoDoc() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 text-slate-500" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" />
    </svg>
  );
}

function IconoCamara() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}

/**
 * Casillero de un archivo: elegir/sacar foto, barra de progreso, miniatura
 * y reintento. `foto` agrega capture="environment" (cámara trasera).
 */
export function CasilleroArchivo({ slot, titulo, requerido, foto, estado, error, onElegir, onReintentar }) {
  const ref = useRef(null);
  const e = estado || {};
  const id = `archivo-${slot}`;
  const mensaje = error || (e.estado === 'error' ? e.error : null);

  return (
    <div className={`rounded-xl border bg-white p-3 ${mensaje ? 'border-red-400' : 'border-slate-200'}`}>
      <div className="flex items-center gap-3">
        <div className="flex h-16 w-16 flex-none items-center justify-center overflow-hidden rounded-lg bg-slate-100">
          {e.preview ? (
            <img src={e.preview} alt="" className="h-full w-full object-cover" />
          ) : e.estado === 'hecho' ? (
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12l5 5 9-10" /></svg>
          ) : foto ? (
            <span className="text-slate-400"><IconoCamara /></span>
          ) : (
            <IconoDoc />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-800">
            {titulo}{requerido && <span className="text-red-500"> *</span>}
          </p>
          {e.estado === 'subiendo' && (
            <div className="mt-2" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={e.progreso || 0} aria-label={`Subiendo ${titulo}`}>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-ayma-blue-light transition-all" style={{ width: `${e.progreso || 0}%` }} />
              </div>
              <p className="mt-1 text-xs text-slate-500">Subiendo… {e.progreso || 0}%</p>
            </div>
          )}
          {e.estado === 'hecho' && <p className="mt-0.5 text-xs text-green-700">Cargado</p>}
          {!e.estado && <p className="mt-0.5 text-xs text-slate-500">{foto ? 'Sacá la foto con buena luz' : 'Foto o PDF, hasta 10 MB'}</p>}
        </div>

        <div className="flex flex-none flex-col gap-1.5">
          {e.estado === 'error' && e.archivo && (
            <button type="button" onClick={onReintentar} className="rounded-lg bg-ayma-blue px-3 py-2 text-sm font-medium text-white">
              Reintentar
            </button>
          )}
          {e.estado !== 'subiendo' && (
            <label
              htmlFor={id}
              className={`cursor-pointer rounded-lg px-3 py-2 text-center text-sm font-medium ${
                e.estado === 'hecho' || e.estado === 'error' ? 'border border-slate-300 text-slate-700' : 'bg-ayma-blue text-white'
              }`}
            >
              {e.estado === 'hecho' || e.estado === 'error' ? 'Cambiar' : foto ? 'Sacar foto' : 'Subir'}
            </label>
          )}
          <input
            ref={ref} id={id} type="file" className="sr-only"
            accept="image/*,application/pdf"
            {...(foto ? { capture: 'environment' } : {})}
            onChange={(ev) => {
              const archivo = ev.target.files?.[0];
              ev.target.value = '';
              if (archivo) onElegir(archivo);
            }}
          />
        </div>
      </div>
      <Mensaje error={mensaje} />
    </div>
  );
}
