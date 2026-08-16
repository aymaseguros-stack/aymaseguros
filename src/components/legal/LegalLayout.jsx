import Footer from '../Footer';

export default function LegalLayout({ title, updated, children }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex flex-col">
            <span className="font-bold text-xl text-gray-900">AYMA</span>
            <span className="text-xs text-gray-500">Gestores de Riesgos</span>
          </a>
          <a href="/" className="text-sm font-medium text-blue-600 hover:text-blue-800">
            ← Volver al inicio
          </a>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-14 w-full">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{title}</h1>
        {updated && (
          <p className="text-sm text-gray-500 mb-8">Última actualización: {updated}</p>
        )}
        <div className="space-y-6 text-gray-700 leading-relaxed [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-gray-900 [&_h2]:mt-8 [&_h2]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_a]:text-blue-600 [&_a]:underline">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
