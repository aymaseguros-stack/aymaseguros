import { useSEO } from '../hooks/useSEO';
import LegalLayout from '../components/legal/LegalLayout';

export default function Privacidad() {
  useSEO({
    title: 'Política de Privacidad | AYMA Advisors',
    description: 'Cómo AYMA Advisors recolecta, usa y protege tus datos personales, conforme a la Ley 25.326 de Protección de Datos Personales (Argentina).',
    path: '/privacidad',
  });

  return (
    <LegalLayout title="Política de Privacidad" updated="15 de agosto de 2026">
      <p>
        En <strong>AYMA Advisors</strong> (Productor Asesor de Seguros, Matrícula SSN N°
        68323) respetamos tu privacidad. Esta política describe qué datos recolectamos a
        través de <a href="https://aymaseguros.com.ar">aymaseguros.com.ar</a>, con qué
        finalidad, y cuáles son tus derechos conforme a la Ley 25.326 de Protección de Datos
        Personales de la República Argentina y la autoridad de aplicación (AAIP).
      </p>

      <h2>1. Responsable del tratamiento</h2>
      <p>
        AYMA Advisors, con domicilio en Rosario, Santa Fe, Argentina, es responsable del
        tratamiento de los datos personales recolectados a través de este sitio. Contacto:{' '}
        <a href="mailto:aymaseguros@hotmail.com">aymaseguros@hotmail.com</a> —{' '}
        <a href="https://wa.me/5493416952259">+54 9 341 695-2259</a>.
      </p>

      <h2>2. Datos que recolectamos</h2>
      <ul>
        <li>Datos de contacto: nombre, código postal, teléfono, email.</li>
        <li>Datos del bien a asegurar: marca, modelo, año del vehículo u otros datos relevantes según el tipo de seguro consultado.</li>
        <li>Datos de navegación: mediante cookies y tecnologías similares (ver sección 6).</li>
      </ul>

      <h2>3. Finalidad</h2>
      <p>
        Utilizamos estos datos para: (a) elaborar y enviarte cotizaciones de seguros; (b)
        contactarte por WhatsApp, teléfono o email en relación a tu consulta; (c) dar
        seguimiento comercial a tu solicitud; y (d) mejorar nuestros servicios y campañas de
        marketing, cuando hayas dado tu consentimiento para fines analíticos o publicitarios.
      </p>

      <h2>4. Con quién compartimos tus datos</h2>
      <p>
        Podemos compartir tus datos con las compañías aseguradoras que representamos
        (Nación Seguros, San Cristóbal, Mapfre, SMG Seguros, entre otras) exclusivamente a
        los fines de gestionar tu cotización o póliza. No vendemos tus datos personales a
        terceros.
      </p>

      <h2>5. Base de datos registrada</h2>
      <p>
        Conforme al artículo 21 de la Ley 25.326, las bases de datos que contienen datos
        personales de nuestros clientes y prospectos se encuentran, o se encontrarán,
        inscriptas ante el Registro Nacional de Bases de Datos de la Agencia de Acceso a la
        Información Pública (AAIP).
      </p>

      <h2>6. Cookies</h2>
      <p>
        Utilizamos cookies propias y de terceros (Google Analytics, Google Ads, Meta) para
        analizar el tráfico del sitio y mostrarte publicidad relevante. Podés aceptar,
        rechazar o personalizar estas cookies desde el banner que se muestra en tu primera
        visita, o modificando la configuración de tu navegador en cualquier momento.
      </p>

      <h2>7. Tus derechos (Habeas Data)</h2>
      <p>
        Tenés derecho a acceder, rectificar, actualizar o solicitar la supresión de tus datos
        personales. Podés ejercer estos derechos escribiéndonos a{' '}
        <a href="mailto:aymaseguros@hotmail.com">aymaseguros@hotmail.com</a>. La Agencia de
        Acceso a la Información Pública, en su carácter de órgano de control de la Ley
        25.326, tiene la atribución de atender las denuncias y reclamos que interpongan
        quienes resulten afectados en sus derechos por incumplimiento de las normas vigentes
        en materia de protección de datos personales.
      </p>

      <h2>8. Conservación de datos</h2>
      <p>
        Conservamos tus datos durante el tiempo necesario para cumplir con la finalidad para
        la que fueron recolectados y, en caso de contratación de una póliza, durante el plazo
        exigido por la normativa de la Superintendencia de Seguros de la Nación (SSN).
      </p>

      <h2>9. Cambios a esta política</h2>
      <p>
        Podemos actualizar esta Política de Privacidad para reflejar cambios legales u
        operativos. La fecha de última actualización figura al inicio de esta página.
      </p>
    </LegalLayout>
  );
}
