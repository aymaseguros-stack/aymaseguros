import { useSEO } from '../hooks/useSEO';
import LegalLayout from '../components/legal/LegalLayout';

export default function Terminos() {
  useSEO({
    title: 'Términos y Condiciones | AYMA Advisors',
    description: 'Términos y condiciones de uso del sitio web de AYMA Advisors, Productor Asesor de Seguros matrícula SSN N° 68323 en Rosario, Santa Fe.',
    path: '/terminos',
  });

  return (
    <LegalLayout title="Términos y Condiciones" updated="15 de agosto de 2026">
      <p>
        Este sitio web (<a href="https://aymaseguros.com.ar">aymaseguros.com.ar</a>) es
        operado por <strong>AYMA Advisors</strong>, Productor Asesor de Seguros — Matrícula
        SSN N° 68323, con domicilio en Rosario, provincia de Santa Fe, Argentina. El uso de
        este sitio implica la aceptación de los presentes Términos y Condiciones.
      </p>

      <h2>1. Naturaleza del servicio</h2>
      <p>
        AYMA Advisors actúa como intermediario en la contratación de seguros, asesorando a
        personas y empresas en la selección de coberturas entre distintas compañías
        aseguradoras. No somos una compañía aseguradora: no emitimos pólizas ni asumimos
        riesgos por cuenta propia.
      </p>

      <h2>2. Cotizaciones</h2>
      <p>
        Los valores, coberturas y condiciones informados a través del chatbot de cotización,
        WhatsApp, teléfono o cualquier otro canal de este sitio son <strong>estimativos y no
        vinculantes</strong>. La cotización definitiva, el valor de la prima y las condiciones
        de cobertura quedan sujetas a la evaluación de riesgo y aprobación de la compañía
        aseguradora correspondiente, y se formalizan únicamente mediante la emisión de la
        póliza y sus condiciones particulares y generales.
      </p>

      <h2>3. Datos suministrados por el usuario</h2>
      <p>
        Al completar el formulario de cotización u otros formularios del sitio, el usuario
        declara que los datos proporcionados (nombre, código postal, datos del vehículo u
        otros bienes a asegurar, etc.) son exactos. El tratamiento de estos datos se rige por
        nuestra <a href="/privacidad">Política de Privacidad</a>.
      </p>

      <h2>4. Uso del sitio</h2>
      <p>
        El usuario se compromete a utilizar el sitio de forma lícita, sin vulnerar derechos
        de terceros ni interferir con su funcionamiento normal. Los contenidos, marcas y logo
        de AYMA Advisors no pueden reproducirse sin autorización previa.
      </p>

      <h2>5. Enlaces a terceros</h2>
      <p>
        Este sitio puede incluir enlaces a sitios de terceros (compañías aseguradoras,
        WhatsApp, redes sociales, portal de clientes). AYMA Advisors no se responsabiliza por
        el contenido o las políticas de privacidad de esos sitios externos.
      </p>

      <h2>6. Limitación de responsabilidad</h2>
      <p>
        AYMA Advisors realiza sus mejores esfuerzos para mantener la información del sitio
        actualizada, pero no garantiza la ausencia de errores u omisiones. La información
        publicada tiene carácter informativo y no reemplaza el asesoramiento personalizado ni
        las condiciones contractuales de cada póliza.
      </p>

      <h2>7. Ley aplicable y jurisdicción</h2>
      <p>
        Estos Términos y Condiciones se rigen por las leyes de la República Argentina. Para
        cualquier controversia derivada de su interpretación o aplicación, las partes se
        someten a los tribunales ordinarios de la ciudad de Rosario, provincia de Santa Fe.
      </p>

      <h2>8. Contacto</h2>
      <p>
        Ante cualquier consulta sobre estos términos, podés escribirnos a{' '}
        <a href="mailto:aymaseguros@hotmail.com">aymaseguros@hotmail.com</a> o al{' '}
        <a href="https://wa.me/5493416952259">+54 9 341 695-2259</a>.
      </p>
    </LegalLayout>
  );
}
