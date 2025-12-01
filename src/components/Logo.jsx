import React from 'react'

const AymaLogo = ({ size = "normal" }) => {
  const sizes = {
    small: { circle: 40, text: "text-lg", subtext: "text-[6px]" },
    normal: { circle: 64, text: "text-3xl", subtext: "text-[8px]" },
    large: { circle: 80, text: "text-4xl", subtext: "text-[10px]" }
  }
  const s = sizes[size]

  return (
    <div
      className={`bg-ayma-blue rounded-full flex items-center justify-center shadow-xl border-4 border-white`}
      style={{width: s.circle + 'px', height: s.circle + 'px'}}
    >
      <div className="text-center">
        <div className={`${s.text} font-black text-white leading-none`}>A</div>
        <div className={`${s.subtext} text-white uppercase tracking-wider font-bold opacity-90`}>SEGUROS</div>
      </div>
    </div>
  )
}

export default AymaLogo
