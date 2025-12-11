export default function LogosAseguradoras() {
  const aseguradoras = ['San Cristóbal', 'Nación Seguros', 'Mapfre', 'SMG Seguros'];

  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500 mb-6">
          Trabajamos con las aseguradoras de mayor prestigio
        </p>
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
          {aseguradoras.map((nombre) => (
            <div
              key={nombre}
              className="px-6 py-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-300"
            >
              <span className="text-gray-700 font-semibold text-sm md:text-base">
                {nombre}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
