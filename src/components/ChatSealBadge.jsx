/**
 * Sello alrededor del logo del chat: el círculo queda sólido y limpio (sin
 * texto encima), y "ONLINE 24/7" orbita por fuera, sobre el arco inferior,
 * separado del borde del círculo. El círculo siempre es azul; el color del
 * texto exterior es lo único que invierte con isScrolled para contrastar
 * contra el fondo del header.
 *
 * viewBox fijo en 64x64: el <button> que lo contiene define el tamaño real
 * en cada breakpoint (ver Header.jsx), y todo escala proporcionalmente
 * porque las coordenadas de acá adentro son relativas al viewBox, no a px.
 */
const ChatSealBadge = ({ isScrolled }) => {
  const textColor = isScrolled ? '#1e40af' : '#ffffff';

  return (
    <svg
      viewBox="0 0 64 64"
      className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="16" fill="#1e40af" />
      <path id="chatSealCurve" d="M 5.5,32 A 26.5 26.5 0 0 0 58.5,32" fill="none" />
      <text
        fill={textColor}
        className="transition-colors duration-300"
        style={{ fontSize: '9.2px', fontWeight: 700, letterSpacing: '0.3px' }}
      >
        <textPath href="#chatSealCurve" startOffset="50%" textAnchor="middle" textLength="76" lengthAdjust="spacingAndGlyphs">
          ONLINE 24/7
        </textPath>
      </text>
    </svg>
  );
};

export default ChatSealBadge;
