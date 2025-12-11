export default function LogosAseguradoras() {
  const aseguradoras = ['San Cristóbal', 'Nación Seguros', 'Mapfre', 'SMG Seguros'];

  return (
    <section className="py-6 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500 mb-6">
          Nos respaldan las siguientes empresas
        </p>
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
          {aseguradoras.map((nombre) => (
            <div key={nombre} className="px-6 py-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all">
              <span className="text-gray-600 font-medium text-sm">{nombre}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
