/**
 * Anillo tipo sello alrededor del logo del chat: el texto "ONLINE 24/7"
 * corre curvado sobre el arco inferior, como una palabra estampada en un
 * sello redondo. El propio anillo es el contraste del widget: invierte
 * color con isScrolled igual que el resto del header.
 */
const ChatSealBadge = ({ isScrolled }) => {
  const ringColor = isScrolled ? '#1e40af' : '#ffffff';
  const textColor = isScrolled ? '#ffffff' : '#1e40af';

  return (
    <svg
      viewBox="0 0 100 100"
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="48" fill={ringColor} className="transition-colors duration-300" />
      <path id="chatSealCurve" d="M 14.3,63 A 38 38 0 0 0 85.7,63" fill="none" />
      <text
        fill={textColor}
        className="transition-colors duration-300"
        style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.5px' }}
      >
        <textPath href="#chatSealCurve" startOffset="50%" textAnchor="middle" textLength="86" lengthAdjust="spacingAndGlyphs">
          • ONLINE 24/7 •
        </textPath>
      </text>
    </svg>
  );
};

export default ChatSealBadge;
