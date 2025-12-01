import React, { useState, useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

export default function Admin() {
    const [isAuth, setIsAuth] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [quotes, setQuotes] = useState([]);
    const [view, setView] = useState('dashboard');
    const [selectedQuote, setSelectedQuote] = useState(null);
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [noteText, setNoteText] = useState('');
    const [showReminderModal, setShowReminderModal] = useState(false);
    const [reminderDate, setReminderDate] = useState('');
    const [reminderTime, setReminderTime] = useState('');
    const [reminderType, setReminderType] = useState('llamada');
    const [reminderNotes, setReminderNotes] = useState('');

    // Refs para los gráficos
    const pieChartRef = useRef(null);
    const barChartRef = useRef(null);
    const lineChartRef = useRef(null);
    const pieChartInstance = useRef(null);
    const barChartInstance = useRef(null);
    const lineChartInstance = useRef(null);

    useEffect(() => {
        if (isAuth) {
            loadData();
            const interval = setInterval(loadData, 5000);
            return () => clearInterval(interval);
        }
    }, [isAuth]);

    // Actualizar gráficos cuando cambien los datos o la vista
    useEffect(() => {
        if (view === 'dashboard' && quotes.length > 0) {
            setTimeout(() => {
                updateCharts();
            }, 100);
        }
    }, [view, quotes]);

    function loadData() {
        const data = localStorage.getItem('ayma_quotes');
        if (data) {
            const parsed = JSON.parse(data);
            setQuotes(parsed.sort((a, b) => b.id - a.id));
        }
    }

    function saveData(newQuotes) {
        localStorage.setItem('ayma_quotes', JSON.stringify(newQuotes));
        setQuotes(newQuotes.sort((a, b) => b.id - a.id));

        // BACKUP AUTOMÁTICO A GOOGLE SHEETS
        sendToGoogleSheets(newQuotes);
    }

    // BACKUP AUTOMÁTICO A GOOGLE SHEETS
    async function sendToGoogleSheets(quotesData) {
        try {
            // Reemplazar con tu URL de Google Apps Script
            const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyswrAaKIMFD6_cKmj74RcPggQJUVf_m7fvRFZzSgseVUl1RGr7Au_4dlPUu5CXLf_5/exec';

            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    quotes: quotesData,
                    timestamp: new Date().toISOString()
                })
            });

            console.log('✅ Backup en Google Sheets exitoso');
        } catch (error) {
            console.error('❌ Error en backup:', error);
        }
    }

    function handleLogin(e) {
        e.preventDefault();
        if (username === 'ayma' && password === 'Mimamamemima14') {
            setIsAuth(true);
            setLoginError('');
        } else {
            setLoginError('Usuario o contraseña incorrectos');
        }
    }

    function changeStatus(id, status) {
        const updated = quotes.map(q => q.id === id ? {...q, status} : q);
        saveData(updated);
    }

    function addNote(id) {
        if (!noteText.trim()) return;
        const updated = quotes.map(q => {
            if (q.id === id) {
                const note = {
                    text: noteText,
                    timestamp: new Date().toISOString(),
                    id: Date.now()
                };
                return {...q, contactHistory: [...(q.contactHistory || []), note]};
            }
            return q;
        });
        saveData(updated);
        setNoteText('');
        setShowNoteModal(false);
    }

    function addReminder(id) {
        if (!reminderDate || !reminderTime) {
            alert('Completá fecha y hora');
            return;
        }
        const updated = quotes.map(q => {
            if (q.id === id) {
                const reminder = {
                    date: reminderDate,
                    time: reminderTime,
                    type: reminderType,
                    notes: reminderNotes,
                    completed: false,
                    id: Date.now()
                };
                return {...q, reminders: [...(q.reminders || []), reminder]};
            }
            return q;
        });
        saveData(updated);
        setShowReminderModal(false);
    }

    function toggleReminder(qid, rid) {
        const updated = quotes.map(q => {
            if (q.id === qid && q.reminders) {
                return {
                    ...q,
                    reminders: q.reminders.map(r =>
                        r.id === rid ? {...r, completed: !r.completed} : r
                    )
                };
            }
            return q;
        });
        saveData(updated);
    }

    function getPendingReminders() {
        const today = new Date().toISOString().split('T')[0];
        return quotes.flatMap(q =>
            (q.reminders || [])
                .filter(r => !r.completed && r.date <= today)
                .map(r => ({...r, quote: q}))
        ).sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time));
    }

    function getTodayReminders() {
        const today = new Date().toISOString().split('T')[0];
        return quotes.flatMap(q =>
            (q.reminders || [])
                .filter(r => r.date === today)
                .map(r => ({...r, quote: q}))
        ).sort((a, b) => a.time.localeCompare(b.time));
    }

    function updateCharts() {
        if (!quotes.length) return;

        const statusCounts = {
            nueva: quotes.filter(q => q.status === 'nueva').length,
            cotizada: quotes.filter(q => q.status === 'cotizada').length,
            vendida: quotes.filter(q => q.status === 'vendida').length,
            perdida: quotes.filter(q => q.status === 'perdida').length
        };

        // Pie Chart - Distribución por estado
        if (pieChartRef.current) {
            const ctx = pieChartRef.current.getContext('2d');
            if (pieChartInstance.current) {
                pieChartInstance.current.destroy();
            }
            pieChartInstance.current = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Nuevas', 'Cotizadas', 'Vendidas', 'Perdidas'],
                    datasets: [{
                        data: [statusCounts.nueva, statusCounts.cotizada, statusCounts.vendida, statusCounts.perdida],
                        backgroundColor: ['#3b82f6', '#eab308', '#16a34a', '#ef4444']
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        },
                        title: {
                            display: true,
                            text: 'Distribución por Estado'
                        }
                    }
                }
            });
        }

        // Bar Chart - Conversión por mes
        if (barChartRef.current) {
            const ctx = barChartRef.current.getContext('2d');
            if (barChartInstance.current) {
                barChartInstance.current.destroy();
            }

            // Agrupar por mes
            const monthlyData = {};
            quotes.forEach(q => {
                const month = new Date(q.createdAt).toLocaleDateString('es-AR', { month: 'short', year: 'numeric' });
                if (!monthlyData[month]) {
                    monthlyData[month] = { total: 0, vendidas: 0 };
                }
                monthlyData[month].total++;
                if (q.status === 'vendida') {
                    monthlyData[month].vendidas++;
                }
            });

            const months = Object.keys(monthlyData).slice(-6);
            const totals = months.map(m => monthlyData[m].total);
            const vendidas = months.map(m => monthlyData[m].vendidas);

            barChartInstance.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: months,
                    datasets: [
                        {
                            label: 'Total',
                            data: totals,
                            backgroundColor: '#3b82f6'
                        },
                        {
                            label: 'Vendidas',
                            data: vendidas,
                            backgroundColor: '#16a34a'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        },
                        title: {
                            display: true,
                            text: 'Cotizaciones por Mes'
                        }
                    }
                }
            });
        }

        // Line Chart - Tendencia de conversión
        if (lineChartRef.current) {
            const ctx = lineChartRef.current.getContext('2d');
            if (lineChartInstance.current) {
                lineChartInstance.current.destroy();
            }

            // Calcular conversión por mes
            const monthlyConversion = {};
            quotes.forEach(q => {
                const month = new Date(q.createdAt).toLocaleDateString('es-AR', { month: 'short', year: 'numeric' });
                if (!monthlyConversion[month]) {
                    monthlyConversion[month] = { total: 0, vendidas: 0 };
                }
                monthlyConversion[month].total++;
                if (q.status === 'vendida') {
                    monthlyConversion[month].vendidas++;
                }
            });

            const months = Object.keys(monthlyConversion).slice(-6);
            const conversion = months.map(m => {
                const data = monthlyConversion[m];
                return data.total > 0 ? ((data.vendidas / data.total) * 100).toFixed(1) : 0;
            });

            lineChartInstance.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: months,
                    datasets: [{
                        label: 'Conversión (%)',
                        data: conversion,
                        borderColor: '#8b5cf6',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        },
                        title: {
                            display: true,
                            text: 'Tendencia de Conversión'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                callback: function(value) {
                                    return value + '%';
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    function exportToCSV() {
        if (quotes.length === 0) {
            alert('No hay datos para exportar');
            return;
        }

        const headers = ['ID', 'Fecha', 'Nombre', 'Email', 'Teléfono', 'CP', 'Marca', 'Modelo', 'Año', 'Cobertura', 'Estado', 'Notas'];
        const rows = quotes.map(q => [
            q.id,
            new Date(q.createdAt).toLocaleDateString('es-AR'),
            q.nombre,
            q.email,
            q.telefono,
            q.codigoPostal,
            q.marca,
            q.modelo,
            q.anio,
            q.cobertura,
            q.status,
            (q.contactHistory || []).map(n => n.text).join(' | ')
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `cotizaciones_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const getReminderIcon = (type) => {
        const icons = {
            llamada: '📞',
            email: '📧',
            whatsapp: '💬',
            reunion: '🤝',
            cotizacion: '📋',
            seguimiento: '🔄'
        };
        return icons[type] || '📌';
    };

    if (!isAuth) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-800 to-blue-700 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ayma Advisors</h1>
                        <p className="text-gray-600">Panel de Administración</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Usuario</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700"
                                required
                            />
                        </div>
                        {loginError && (
                            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                                {loginError}
                            </div>
                        )}
                        <button
                            type="submit"
                            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-xl transition"
                        >
                            Iniciar Sesión
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const total = quotes.length;
    const nuevas = quotes.filter(q => q.status === 'nueva').length;
    const cotizadas = quotes.filter(q => q.status === 'cotizada').length;
    const vendidas = quotes.filter(q => q.status === 'vendida').length;
    const conv = total > 0 ? ((vendidas / total) * 100).toFixed(1) : 0;
    const pendingReminders = getPendingReminders();
    const todayReminders = getTodayReminders();

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow-md border-b-4 border-blue-700">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
                            <p className="text-sm text-gray-600">Ayma Advisors - CRM Completo</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setView('dashboard')}
                                className={'px-4 py-2 rounded-lg font-semibold ' + (view === 'dashboard' ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700')}
                            >
                                📊 Dashboard
                            </button>
                            <button
                                onClick={() => setView('calendar')}
                                className={'px-4 py-2 rounded-lg font-semibold ' + (view === 'calendar' ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700')}
                            >
                                📅 Calendario
                                {pendingReminders.length > 0 && (
                                    <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                        {pendingReminders.length}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={exportToCSV}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold"
                            >
                                📥 Exportar CSV
                            </button>
                            <button
                                onClick={() => setIsAuth(false)}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {view === 'calendar' ? (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">📅 Calendario de Seguimientos</h2>

                        {pendingReminders.length > 0 && (
                            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6 mb-6">
                                <h3 className="text-xl font-bold text-red-800 mb-4">⚠️ Recordatorios Vencidos ({pendingReminders.length})</h3>
                                <div className="space-y-3">
                                    {pendingReminders.map(r => (
                                        <div key={r.id} className="bg-white rounded-lg p-4 shadow flex justify-between items-center">
                                            <div>
                                                <div className="font-bold">{getReminderIcon(r.type)} {r.quote.nombre}</div>
                                                <p className="text-sm text-gray-700">{r.notes || 'Sin notas'}</p>
                                                <p className="text-xs text-red-600">📅 {r.date} ⏰ {r.time}</p>
                                            </div>
                                            <button
                                                onClick={() => toggleReminder(r.quote.id, r.id)}
                                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                                            >
                                                ✓ Completar
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-xl font-bold mb-4">📌 Hoy ({todayReminders.length})</h3>
                            {todayReminders.length === 0 ? (
                                <p className="text-gray-500">No hay recordatorios para hoy</p>
                            ) : (
                                <div className="space-y-3">
                                    {todayReminders.map(r => (
                                        <div key={r.id} className={'rounded-lg p-4 ' + (r.completed ? 'bg-gray-100' : 'bg-blue-50 border-2 border-blue-200')}>
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <div className={'font-bold ' + (r.completed ? 'text-gray-500 line-through' : 'text-gray-900')}>
                                                        {getReminderIcon(r.type)} {r.quote.nombre}
                                                    </div>
                                                    <p className="text-sm">{r.notes || 'Sin notas'}</p>
                                                    <p className="text-xs text-gray-600">⏰ {r.time}</p>
                                                </div>
                                                <button
                                                    onClick={() => toggleReminder(r.quote.id, r.id)}
                                                    className={'px-4 py-2 rounded-lg text-sm font-semibold ' + (r.completed ? 'bg-gray-300 text-gray-600' : 'bg-green-500 text-white')}
                                                >
                                                    {r.completed ? '↻ Reabrir' : '✓ Completar'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <p className="text-sm text-gray-600 font-semibold">Total</p>
                                <p className="text-3xl font-bold text-gray-900">{total}</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <p className="text-sm text-blue-600 font-semibold">Nuevas</p>
                                <p className="text-3xl font-bold text-blue-700">{nuevas}</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <p className="text-sm text-yellow-600 font-semibold">Cotizadas</p>
                                <p className="text-3xl font-bold text-yellow-700">{cotizadas}</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <p className="text-sm text-green-600 font-semibold">Vendidas</p>
                                <p className="text-3xl font-bold text-green-700">{vendidas}</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <p className="text-sm text-blue-700 font-semibold">Conversión</p>
                                <p className="text-3xl font-bold text-blue-800">{conv}%</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <p className="text-sm text-purple-600 font-semibold">Recordatorios</p>
                                <p className="text-3xl font-bold text-purple-700">{pendingReminders.length}</p>
                            </div>
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <canvas ref={pieChartRef}></canvas>
                            </div>
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <canvas ref={barChartRef}></canvas>
                            </div>
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <canvas ref={lineChartRef}></canvas>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {quotes.length === 0 ? (
                                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                                    <p className="text-gray-500 text-lg">No hay cotizaciones</p>
                                </div>
                            ) : (
                                quotes.map(q => {
                                    const pendingQuoteReminders = q.reminders?.filter(r => !r.completed) || [];
                                    return (
                                        <div key={q.id} className="bg-white rounded-xl shadow-md p-6">
                                            <div className="flex justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <h3 className="text-xl font-bold">{q.nombre}</h3>
                                                        {pendingQuoteReminders.length > 0 && (
                                                            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold">
                                                                📅 {pendingQuoteReminders.length} recordatorio{pendingQuoteReminders.length > 1 ? 's' : ''}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div><span className="text-gray-600">CP:</span> <span className="font-semibold">{q.codigoPostal}</span></div>
                                                        <div><span className="text-gray-600">Vehículo:</span> <span className="font-semibold">{q.marca} {q.modelo} ({q.anio})</span></div>
                                                        <div><span className="text-gray-600">Cobertura:</span> <span className="font-semibold">{q.cobertura}</span></div>
                                                        <div><span className="text-gray-600">Fecha:</span> <span className="font-semibold">{new Date(q.createdAt).toLocaleString('es-AR')}</span></div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedQuote(q);
                                                            setReminderDate('');
                                                            setReminderTime('');
                                                            setReminderType('llamada');
                                                            setReminderNotes('');
                                                            setShowReminderModal(true);
                                                        }}
                                                        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                                                    >
                                                        📅 Recordatorio
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedQuote(q);
                                                            setNoteText('');
                                                            setShowNoteModal(true);
                                                        }}
                                                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                                                    >
                                                        📝 Nota
                                                    </button>
                                                    <button
                                                        onClick={() => changeStatus(q.id, 'nueva')}
                                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                                                    >
                                                        🆕 Nueva
                                                    </button>
                                                    <button
                                                        onClick={() => changeStatus(q.id, 'cotizada')}
                                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                                                    >
                                                        📧 Cotizada
                                                    </button>
                                                    <button
                                                        onClick={() => changeStatus(q.id, 'vendida')}
                                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                                                    >
                                                        💰 Vendida
                                                    </button>
                                                    <button
                                                        onClick={() => changeStatus(q.id, 'perdida')}
                                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                                                    >
                                                        ❌ Perdida
                                                    </button>
                                                </div>
                                            </div>

                                            {pendingQuoteReminders.length > 0 && (
                                                <div className="mt-4 pt-4 border-t">
                                                    <h4 className="font-semibold mb-2">📅 Recordatorios Pendientes:</h4>
                                                    <div className="space-y-2">
                                                        {pendingQuoteReminders.map(r => (
                                                            <div key={r.id} className="bg-purple-50 p-3 rounded-lg flex justify-between items-center">
                                                                <div>
                                                                    <p className="text-sm font-semibold">{getReminderIcon(r.type)} {r.type}</p>
                                                                    <p className="text-sm text-gray-700">{r.notes || 'Sin notas'}</p>
                                                                    <p className="text-xs text-gray-600">📅 {r.date} ⏰ {r.time}</p>
                                                                </div>
                                                                <button
                                                                    onClick={() => toggleReminder(q.id, r.id)}
                                                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-semibold"
                                                                >
                                                                    ✓
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {q.contactHistory && q.contactHistory.length > 0 && (
                                                <div className="mt-4 pt-4 border-t">
                                                    <h4 className="font-semibold mb-2">📋 Historial:</h4>
                                                    <div className="space-y-2">
                                                        {q.contactHistory.map(note => (
                                                            <div key={note.id} className="bg-gray-50 p-3 rounded-lg text-sm">
                                                                <p>{note.text}</p>
                                                                <p className="text-gray-500 text-xs mt-1">
                                                                    {new Date(note.timestamp).toLocaleString('es-AR')}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </>
                )}
            </div>

            {showNoteModal && selectedQuote && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl">
                        <h3 className="text-2xl font-bold mb-4">📝 Agregar Nota - {selectedQuote.nombre}</h3>
                        <textarea
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            placeholder="Escribe tu nota aquí..."
                            className="w-full h-32 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 resize-none"
                        />
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={() => addNote(selectedQuote.id)}
                                className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-xl"
                            >
                                Guardar
                            </button>
                            <button
                                onClick={() => setShowNoteModal(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-xl"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showReminderModal && selectedQuote && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl">
                        <h3 className="text-2xl font-bold mb-4">📅 Programar Recordatorio - {selectedQuote.nombre}</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Fecha</label>
                                    <input
                                        type="date"
                                        value={reminderDate}
                                        onChange={(e) => setReminderDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Hora</label>
                                    <input
                                        type="time"
                                        value={reminderTime}
                                        onChange={(e) => setReminderTime(e.target.value)}
                                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2">Tipo</label>
                                <select
                                    value={reminderType}
                                    onChange={(e) => setReminderType(e.target.value)}
                                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
                                >
                                    <option value="llamada">📞 Llamada</option>
                                    <option value="email">📧 Email</option>
                                    <option value="whatsapp">💬 WhatsApp</option>
                                    <option value="reunion">🤝 Reunión</option>
                                    <option value="cotizacion">📋 Enviar Cotización</option>
                                    <option value="seguimiento">🔄 Seguimiento</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2">Notas</label>
                                <textarea
                                    value={reminderNotes}
                                    onChange={(e) => setReminderNotes(e.target.value)}
                                    placeholder="Notas del recordatorio..."
                                    className="w-full h-24 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 resize-none"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => addReminder(selectedQuote.id)}
                                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-4 rounded-xl"
                            >
                                Programar
                            </button>
                            <button
                                onClick={() => setShowReminderModal(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-xl"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
