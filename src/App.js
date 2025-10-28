import React, { useState } from 'react';
import { Copy, Download, Trash2, Plus, Eye, EyeOff } from 'lucide-react';

const MonitoringChecklist = () => {
  const [activePhase, setActivePhase] = useState('colonization');
  const [batchInfo, setBatchInfo] = useState({
    tentId: '',
    species: '',
    startDate: '',
    sterilization: ''
  });
  const [currentEntry, setCurrentEntry] = useState({});
  const [savedEntries, setSavedEntries] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [notification, setNotification] = useState('');

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const saveEntry = () => {
    const hasData = Object.keys(currentEntry).length > 0;
    if (!hasData) {
      showNotification('⚠️ Please fill out at least one field!');
      return;
    }

    const newEntry = {
      ...currentEntry,
      date: new Date().toISOString().split('T')[0],
      batchInfo: {...batchInfo}
    };

    setSavedEntries([...savedEntries, newEntry]);
    setCurrentEntry({});
    showNotification('✓ Entry saved! Now copy it to Google Sheets');
  };

  const deleteEntry = (index) => {
    setSavedEntries(savedEntries.filter((_, i) => i !== index));
    showNotification('✓ Entry deleted');
  };

  const clearAllData = () => {
    if (window.confirm('Delete ALL entries? This cannot be undone!')) {
      setSavedEntries([]);
      setCurrentEntry({});
      setBatchInfo({ tentId: '', species: '', startDate: '', sterilization: '' });
      showNotification('✓ All data cleared');
    }
  };

  const copyLastEntryForGoogleSheets = () => {
    if (savedEntries.length === 0) {
      showNotification('⚠️ No saved entries! Click "Save Entry" first');
      return;
    }

    const lastEntry = savedEntries[savedEntries.length - 1];
    const columns = phases[activePhase].columns;
    
    const headers = ['Date', 'Phase', 'Tent ID', 'Species', 'Start Date', ...columns.map(c => c.label)];
    const row = [
      lastEntry.date,
      phases[activePhase].title,
      lastEntry.batchInfo.tentId || '',
      lastEntry.batchInfo.species || '',
      lastEntry.batchInfo.startDate || '',
      ...columns.map(c => lastEntry[c.key] || '')
    ];
    
    const tsvData = headers.join('\t') + '\n' + row.join('\t');
    
    navigator.clipboard.writeText(tsvData).then(() => {
      showNotification('✓ Entry with headers copied! Paste into Google Sheets');
    }).catch(() => {
      showNotification('✗ Copy failed. Check browser permissions.');
    });
  };

  const copyAllForGoogleSheets = () => {
    if (savedEntries.length === 0) {
      showNotification('⚠️ No entries to export!');
      return;
    }

    const columns = phases[activePhase].columns;
    const headers = ['Date', 'Phase', 'Tent ID', 'Species', 'Start Date', ...columns.map(c => c.label)];
    
    const rows = savedEntries.map(entry => [
      entry.date,
      phases[activePhase].title,
      entry.batchInfo.tentId || '',
      entry.batchInfo.species || '',
      entry.batchInfo.startDate || '',
      ...columns.map(c => entry[c.key] || '')
    ]);

    const allRows = [headers, ...rows];
    const tsvData = allRows.map(row => row.join('\t')).join('\n');

    navigator.clipboard.writeText(tsvData).then(() => {
      showNotification(`✓ Copied ${savedEntries.length} entries with headers!`);
    }).catch(() => {
      showNotification('✗ Copy failed. Try CSV download instead.');
    });
  };

  const downloadCSV = () => {
    if (savedEntries.length === 0) {
      showNotification('⚠️ No entries to download!');
      return;
    }

    const columns = phases[activePhase].columns;
    const headers = ['Date', 'Phase', 'Tent ID', 'Species', 'Start Date', ...columns.map(c => c.label)];
    
    const rows = savedEntries.map(entry => [
      entry.date,
      phases[activePhase].title,
      entry.batchInfo.tentId || '',
      entry.batchInfo.species || '',
      entry.batchInfo.startDate || '',
      ...columns.map(c => entry[c.key] || '')
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monitoring-${activePhase}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showNotification('✓ CSV downloaded!');
  };

  const phases = {
    colonization: {
      title: 'Spore & Grain Colonization (Spawn Preparation)',
      targets: {
        temp: '25–28 °C',
        humidity: '70–80%',
        light: 'Dark / OFF',
        airflow: 'Minimal (sealed or filtered vents)'
      },
      columns: [
        { key: 'temp', label: 'Temperature (°C)', type: 'number', hint: 'Actual thermometer reading' },
        { key: 'humidity', label: 'Humidity (%)', type: 'number', hint: 'Actual hygrometer reading' },
        { key: 'light', label: 'Light Status', type: 'text', hint: 'OFF, Dark, or Covered' },
        { key: 'airflow', label: 'Airflow/Fan', type: 'text', hint: 'Sealed, Filtered, or OFF' },
        { key: 'bagIntegrity', label: 'Bag/Jar Integrity', type: 'text', hint: 'No leaks? Y/N + notes' },
        { key: 'contamination', label: 'Contamination', type: 'text', hint: 'Green/yellow mold? Y/N + color' },
        { key: 'odor', label: 'Odor', type: 'text', hint: 'Earthy=good, Sour=bad' },
        { key: 'growth', label: 'Colonization %', type: 'text', hint: '% coverage, whiteness' },
        { key: 'sterilization', label: 'Sterilization', type: 'text', hint: 'Batch ID verified?' },
        { key: 'action', label: 'Action Taken', type: 'text', hint: 'What did you do?' },
        { key: 'initials', label: 'Initials', type: 'text', hint: 'Your initials' }
      ]
    },
    fruiting: {
      title: 'Fruiting Phase (Mushroom Production)',
      targets: {
        temp: '18–24 °C',
        humidity: '90–95%',
        light: '12h ON / 12h OFF',
        airflow: 'ON gently for FAE'
      },
      columns: [
        { key: 'temp', label: 'Temperature (°C)', type: 'number', hint: 'Actual thermometer reading' },
        { key: 'humidity', label: 'Humidity (%)', type: 'number', hint: 'Actual hygrometer reading' },
        { key: 'light', label: 'Light Hours', type: 'number', hint: 'Hours ON (e.g., 12)' },
        { key: 'airflow', label: 'Airflow/Fan', type: 'text', hint: 'ON gentle, OFF, minutes' },
        { key: 'co2', label: 'CO₂ Levels', type: 'text', hint: 'PPM or condensation notes' },
        { key: 'moisture', label: 'Surface Wetness', type: 'text', hint: 'Moist? No pooling?' },
        { key: 'contamination', label: 'Contamination', type: 'text', hint: 'Mold? Y/N + description' },
        { key: 'odor', label: 'Odor', type: 'text', hint: 'Mushroomy=good, Sour=bad' },
        { key: 'pins', label: 'Pins', type: 'text', hint: 'Count, size, distribution' },
        { key: 'growth', label: 'Growth', type: 'text', hint: 'Size, cap opening, color' },
        { key: 'action', label: 'Action Taken', type: 'text', hint: 'Misting, FAE, harvest?' },
        { key: 'initials', label: 'Initials', type: 'text', hint: 'Your initials' }
      ]
    },
    leather: {
      title: 'Mycelium Leather Growth (Tray-Based Mat Formation)',
      targets: {
        temp: '25–28 °C',
        humidity: '85–90%',
        light: 'Dark / OFF',
        airflow: 'Minimal or OFF'
      },
      columns: [
        { key: 'temp', label: 'Temperature (°C)', type: 'number', hint: 'Actual thermometer reading' },
        { key: 'humidity', label: 'Humidity (%)', type: 'number', hint: 'Actual hygrometer reading' },
        { key: 'light', label: 'Light Status', type: 'text', hint: 'OFF, Dark, Covered' },
        { key: 'airflow', label: 'Airflow/Fan', type: 'text', hint: 'Minimal, OFF, Sealed' },
        { key: 'moisture', label: 'Surface Moisture', type: 'text', hint: 'Even? No pooling?' },
        { key: 'contamination', label: 'Contamination', type: 'text', hint: 'Discoloration? Y/N + notes' },
        { key: 'odor', label: 'Odor', type: 'text', hint: 'Earthy=healthy' },
        { key: 'thickness', label: 'Thickness (mm)', type: 'number', hint: 'Measure with ruler' },
        { key: 'texture', label: 'Texture', type: 'text', hint: 'Velvety? Cohesive?' },
        { key: 'growth', label: 'Mat Formation', type: 'text', hint: 'Coverage %, density' },
        { key: 'action', label: 'Action Taken', type: 'text', hint: 'Substrate adjustments?' },
        { key: 'initials', label: 'Initials', type: 'text', hint: 'Your initials' }
      ]
    }
  };

  const currentPhase = phases[activePhase];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {notification && (
          <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            {notification}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🍄 Mushroom Monitoring System
          </h1>
          <p className="text-gray-600 mb-4">
            Fill → Save → Copy to Google Sheets
          </p>
          
          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={() => setActivePhase('colonization')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activePhase === 'colonization'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Colonization
            </button>
            <button
              onClick={() => setActivePhase('fruiting')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activePhase === 'fruiting'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Fruiting
            </button>
            <button
              onClick={() => setActivePhase('leather')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activePhase === 'leather'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Mycelium Leather
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              {showHistory ? <EyeOff size={18} /> : <Eye size={18} />}
              {showHistory ? 'Hide' : 'Show'} History ({savedEntries.length})
            </button>
            <button
              onClick={copyLastEntryForGoogleSheets}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              disabled={savedEntries.length === 0}
            >
              <Copy size={18} />
              Copy Last Entry
            </button>
            <button
              onClick={copyAllForGoogleSheets}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              disabled={savedEntries.length === 0}
            >
              <Copy size={18} />
              Copy All Entries
            </button>
            <button
              onClick={downloadCSV}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              disabled={savedEntries.length === 0}
            >
              <Download size={18} />
              Download CSV
            </button>
            <button
              onClick={clearAllData}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 ml-auto"
            >
              <Trash2 size={18} />
              Clear All
            </button>
          </div>
        </div>

        {showHistory && savedEntries.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Saved Entries - {currentPhase.title}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2">Date</th>
                    {currentPhase.columns.map(col => (
                      <th key={col.key} className="border border-gray-300 p-2">{col.label}</th>
                    ))}
                    <th className="border border-gray-300 p-2">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {savedEntries.map((entry, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-2 font-semibold">{entry.date}</td>
                      {currentPhase.columns.map(col => (
                        <td key={col.key} className="border border-gray-300 p-2">
                          {entry[col.key] || '—'}
                        </td>
                      ))}
                      <td className="border border-gray-300 p-2 text-center">
                        <button
                          onClick={() => deleteEntry(idx)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">
            Today's Entry - {currentPhase.title}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-blue-50 rounded-lg">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Tent ID / Batch ID:
              </label>
              <input
                type="text"
                value={batchInfo.tentId}
                onChange={(e) => setBatchInfo({...batchInfo, tentId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="e.g., TENT-A-001"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Species / Strain:
              </label>
              <input
                type="text"
                value={batchInfo.species}
                onChange={(e) => setBatchInfo({...batchInfo, species: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="e.g., Pleurotus ostreatus"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Phase Start Date:
              </label>
              <input
                type="date"
                value={batchInfo.startDate}
                onChange={(e) => setBatchInfo({...batchInfo, startDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            {activePhase === 'colonization' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Sterilization:
                </label>
                <input
                  type="text"
                  value={batchInfo.sterilization}
                  onChange={(e) => setBatchInfo({...batchInfo, sterilization: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  placeholder="Time, Pressure, Batch"
                />
              </div>
            )}
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mb-6">
            <h3 className="font-bold text-gray-800 mb-3">🎯 TARGET PARAMETERS</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-semibold">Temp:</span> {currentPhase.targets.temp}
              </div>
              <div>
                <span className="font-semibold">Humidity:</span> {currentPhase.targets.humidity}
              </div>
              <div>
                <span className="font-semibold">Light:</span> {currentPhase.targets.light}
              </div>
              <div>
                <span className="font-semibold">Airflow:</span> {currentPhase.targets.airflow}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {currentPhase.columns.map(col => (
              <div key={col.key}>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {col.label}
                </label>
                <input
                  type={col.type}
                  value={currentEntry[col.key] || ''}
                  onChange={(e) => setCurrentEntry({...currentEntry, [col.key]: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder={col.hint}
                />
                <p className="text-xs text-gray-500 mt-1 italic">{col.hint}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={saveEntry}
              className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold text-lg"
            >
              <Plus size={24} />
              Save Today's Entry
            </button>
          </div>

          <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded">
            <h3 className="font-bold text-gray-800 mb-2">📋 Simple Workflow:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
              <li><strong>Fill out</strong> the monitoring data above</li>
              <li><strong>Click "Save Today's Entry"</strong> (stores in memory)</li>
              <li><strong>Click "Copy Last Entry"</strong></li>
              <li><strong>Open Google Sheets</strong> → Click next empty row</li>
              <li><strong>Paste (Ctrl+V)</strong> → Done! ✓</li>
            </ol>
            <p className="text-sm text-gray-600 mt-2">
              ⚠️ <strong>Note:</strong> Data only saved during this session. Download CSV backup regularly!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringChecklist;
