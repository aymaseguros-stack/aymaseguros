import { useSEO } from '../hooks/useSEO';

export default function NotFound() {
  useSEO({
    title: 'Página no encontrada | AYMA Advisors',
    description: 'La página que buscás no existe o fue movida.',
    path: typeof window !== 'undefined' ? window.location.pathname : '/404',
    noindex: true,
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-white">
      <span className="text-6xl font-bold text-blue-600 mb-4">404</span>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Página no encontrada</h1>
      <p className="text-gray-600 mb-6 max-w-md">
        La página que buscás no existe o fue movida. Volvé al inicio para cotizar tu seguro.
      </p>
      <a href="/" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
        Volver al inicio
      </a>
    </div>
  );
}
