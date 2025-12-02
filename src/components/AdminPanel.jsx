// src/components/AdminPanel.jsx
// Panel de Administración AYMA Advisors

import { useState, useEffect } from 'react';

const BACKEND_URL = 'https://ayma-portal-backend.onrender.com/api/v1';

const AdminPanel = () => {
  const [token, setToken] = useState(localStorage.getItem('ayma_token') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Data states
  const [metricas, setMetricas] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [leads, setLeads] = useState([]);
  const [tendencias, setTendencias] = useState(null);
  
  // Login form
  const [email, setEmail] = useState('aymaseguros@hotmail.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ username: email, password })
      });
      
      if (!res.ok) throw new Error('Credenciales inválidas');
      
      const data = await res.json();
      localStorage.setItem('ayma_token', data.access_token);
      setToken(data.access_token);
      setIsLoggedIn(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch con auth
  const fetchWithAuth = async (endpoint) => {
    const res = await fetch(`${BACKEND_URL}${endpoint}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.status === 401) {
      setIsLoggedIn(false);
      localStorage.removeItem('ayma_token');
      throw new Error('Sesión expirada');
    }
    if (!res.ok) throw new Error('Error en petición');
    return res.json();
  };

  // Cargar datos
  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [m, c, l, t] = await Promise.all([
        fetchWithAuth('/admin/metricas'),
        fetchWithAuth('/admin/clientes?limit=50'),
        fetchWithAuth('/leads/'),
        fetchWithAuth('/admin/tendencias?dias=30')
      ]);
      setMetricas(m);
      setClientes(c);
      setLeads(l);
      setTendencias(t);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Verificar token al iniciar
  useEffect(() => {
    if (token) {
      fetchWithAuth('/admin/metricas')
        .then(() => {
          setIsLoggedIn(true);
          loadDashboard();
        })
        .catch(() => setIsLoggedIn(false));
    }
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('ayma_token');
    setToken('');
    setIsLoggedIn(false);
  };

  // ===== LOGIN SCREEN =====
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md">
          <div className="text-center mb-8">
            <img src="/LOGO_AYMA_II.png" alt="AYMA" className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            <p className="text-gray-400">AYMA Advisors</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ===== ADMIN DASHBOARD =====
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/LOGO_AYMA_II.png" alt="AYMA" className="w-10 h-10" />
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
          <button onClick={handleLogout} className="text-gray-400 hover:text-white transition">
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Tabs */}
      <nav className="bg-gray-800 border-b border-gray-700 px-6">
        <div className="flex gap-4">
          {['dashboard', 'clientes', 'leads', 'scoring'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-4 font-medium transition border-b-2 ${
                activeTab === tab 
                  ? 'border-blue-500 text-blue-400' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="p-6">
        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && metricas && (
          <div className="space-y-6">
            {/* Métricas principales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard title="Clientes" value={metricas.total_clientes} icon="👥" color="blue" />
              <MetricCard title="Pólizas" value={metricas.total_polizas} icon="📄" color="green" />
              <MetricCard title="Vigentes" value={metricas.polizas_vigentes} icon="✅" color="emerald" />
              <MetricCard title="Por Vencer" value={metricas.polizas_por_vencer} icon="⚠️" color="yellow" />
            </div>
            
            {/* Scoring */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Scoring Total</h3>
              <p className="text-4xl font-bold text-blue-400">{metricas.scoring_total?.toFixed(0) || 0} pts</p>
              <p className="text-gray-400 mt-2">Meta semanal: 840 pts</p>
              <div className="mt-4 bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-blue-500 h-3 rounded-full transition-all"
                  style={{ width: `${Math.min((metricas.scoring_total / 840) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Leads recientes */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Leads Recientes</h3>
              <div className="space-y-3">
                {leads.slice(0, 5).map(lead => (
                  <div key={lead.id} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                    <div>
                      <p className="font-medium">{lead.nombre}</p>
                      <p className="text-sm text-gray-400">{lead.tipo_seguro} · {lead.origen}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      lead.estado === 'cliente' ? 'bg-green-600' :
                      lead.estado === 'potencial' ? 'bg-yellow-600' : 'bg-gray-600'
                    }`}>
                      {lead.estado}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CLIENTES TAB */}
        {activeTab === 'clientes' && (
          <div className="bg-gray-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="text-left p-4">Cliente</th>
                  <th className="text-left p-4">Documento</th>
                  <th className="text-left p-4">Teléfono</th>
                  <th className="text-left p-4">Scoring</th>
                  <th className="text-left p-4">Estado</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map(c => (
                  <tr key={c.id} className="border-t border-gray-700 hover:bg-gray-750">
                    <td className="p-4">
                      <p className="font-medium">{c.nombre} {c.apellido}</p>
                      <p className="text-sm text-gray-400">{c.email}</p>
                    </td>
                    <td className="p-4 text-gray-400">{c.documento}</td>
                    <td className="p-4 text-gray-400">{c.telefono}</td>
                    <td className="p-4">
                      <span className="text-blue-400 font-bold">{c.scoring} pts</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs ${c.activo ? 'bg-green-600' : 'bg-red-600'}`}>
                        {c.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* LEADS TAB */}
        {activeTab === 'leads' && (
          <div className="bg-gray-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="text-left p-4">Lead</th>
                  <th className="text-left p-4">Tipo Seguro</th>
                  <th className="text-left p-4">Vehículo</th>
                  <th className="text-left p-4">Origen</th>
                  <th className="text-left p-4">Estado</th>
                  <th className="text-left p-4">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {leads.map(l => (
                  <tr key={l.id} className="border-t border-gray-700 hover:bg-gray-750">
                    <td className="p-4">
                      <p className="font-medium">{l.nombre}</p>
                      <p className="text-sm text-gray-400">{l.telefono}</p>
                    </td>
                    <td className="p-4 text-gray-400">{l.tipo_seguro}</td>
                    <td className="p-4 text-gray-400">
                      {l.vehiculo_marca} {l.vehiculo_modelo} {l.vehiculo_anio}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-blue-600/30 text-blue-300 rounded text-xs">
                        {l.origen}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        l.estado === 'cliente' ? 'bg-green-600' :
                        l.estado === 'potencial' ? 'bg-yellow-600' :
                        l.estado === 'prospecto' ? 'bg-blue-600' : 'bg-gray-600'
                      }`}>
                        {l.estado}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400 text-sm">
                      {new Date(l.created_at).toLocaleDateString('es-AR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SCORING TAB */}
        {activeTab === 'scoring' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-gray-400 mb-2">Meta Diaria</h3>
                <p className="text-3xl font-bold">130 pts</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-gray-400 mb-2">Meta Semanal</h3>
                <p className="text-3xl font-bold">840 pts</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-gray-400 mb-2">Acumulado</h3>
                <p className="text-3xl font-bold text-blue-400">{metricas?.scoring_total?.toFixed(0) || 0} pts</p>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Tabla de Puntuación</h3>
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400">
                    <th className="p-2">Acción</th>
                    <th className="p-2">Puntos</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    ['Login', '+1'],
                    ['Ver póliza', '+2'],
                    ['Descargar PDF', '+3'],
                    ['Llamado nuevo', '+5.9'],
                    ['Llamado seguimiento', '+2'],
                    ['Cotizado', '+13'],
                    ['Propuesta entregada', '+25'],
                    ['Cierre cliente', '+50'],
                    ['Cliente perdido', '-50'],
                  ].map(([accion, pts]) => (
                    <tr key={accion} className="border-t border-gray-700">
                      <td className="p-2">{accion}</td>
                      <td className={`p-2 font-bold ${pts.startsWith('-') ? 'text-red-400' : 'text-green-400'}`}>
                        {pts}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Componente MetricCard
const MetricCard = ({ title, value, icon, color }) => (
  <div className={`bg-gray-800 rounded-xl p-4 border-l-4 border-${color}-500`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <span className="text-3xl">{icon}</span>
    </div>
  </div>
);

export default AdminPanel;
