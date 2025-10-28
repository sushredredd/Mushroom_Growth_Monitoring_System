# Mushroom_Growth_Monitoring_System
Daily monitoring checklist for mushroom cultivation and mycelium leather production
# 🍄 Mushroom Cultivation Monitoring System

A comprehensive daily monitoring checklist system for controlled tent setups used in mushroom cultivation and mycelium leather production.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/react-18.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📋 Features

- **Three Growth Phases**: Colonization, Fruiting, and Mycelium Leather production
- **Daily Entry Tracking**: Record temperature, humidity, contamination, growth observations
- **Google Sheets Integration**: One-click copy to spreadsheet (with headers)
- **CSV Export**: Download all data for backup
- **Historical View**: Review all saved entries
- **Target Parameters**: Visual reference for optimal conditions
- **Field Hints**: Guidance on what data to enter for each field

## 🎯 Growth Phases Covered

### 1. Spore & Grain Colonization (Spawn Preparation)
- **Temperature**: 25–28 °C
- **Humidity**: 70–80%
- **Light**: Dark / OFF
- **Airflow**: Minimal (sealed or filtered vents)

### 2. Fruiting Phase (Mushroom Production)
- **Temperature**: 18–24 °C
- **Humidity**: 90–95%
- **Light**: 12h ON / 12h OFF
- **Airflow**: ON gently for fresh air exchange (FAE)

### 3. Mycelium Leather Growth (Tray-Based Mat Formation)
- **Temperature**: 25–28 °C
- **Humidity**: 85–90%
- **Light**: Dark / OFF
- **Airflow**: Minimal or OFF

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Modern web browser
- Google Sheets account (for data export)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/mushroom-monitoring-system.git

# Navigate to project directory
cd mushroom-monitoring-system

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`

## 📖 How to Use

### Daily Workflow

1. **Select Phase**: Choose Colonization, Fruiting, or Mycelium Leather
2. **Fill Batch Info**: Enter Tent ID, Species, Start Date
3. **Record Measurements**: 
   - Temperature and humidity readings
   - Light and airflow status
   - Contamination checks
   - Growth observations
   - Actions taken
4. **Save Entry**: Click "Save Today's Entry"
5. **Export to Google Sheets**:
   - Click "Copy Last Entry" (includes headers)
   - Open your Google Sheet
   - Click the next empty row
   - Paste (Ctrl+V or Cmd+V)

### Google Sheets Setup

**First Time:**
- Create a new Google Sheet for each growth phase
- Paste your first entry → Headers and data appear

**Daily Updates:**
- Paste new entries below previous ones
- Each paste adds a new row with all data

### Data Management

- **View History**: Click "Show History" to see all saved entries
- **Copy All**: Export all entries at once with headers
- **Download CSV**: Save backup file for long-term storage
- **Clear Data**: Remove all entries (with confirmation)

## ⚠️ Important Notes

### Data Persistence
- Data is stored **in-memory during your session**
- Data is **lost when you close the browser tab**
- **Always export to Google Sheets** or download CSV for permanent storage
- Download CSV backups regularly

### Best Practices
1. Complete monitoring at the same time each day
2. Export to Google Sheets immediately after saving
3. Download CSV backup weekly
4. Keep one Google Sheet per growth phase per batch
5. Document any deviations from target parameters

## 📊 Monitored Parameters

### Common to All Phases
- Date (auto-generated)
- Temperature (°C)
- Humidity (%)
- Light status/duration
- Airflow/Fan status
- Contamination signs
- Odor/Smell notes
- Action taken
- Supervisor initials

### Phase-Specific

**Colonization:**
- Bag/Jar integrity
- Sterilization verification
- Colonization progress (%)

**Fruiting:**
- CO₂ levels
- Surface wetness
- Pin development
- Mushroom growth observations

**Mycelium Leather:**
- Mat thickness (mm)
- Surface texture
- Mat formation uniformity

## 🛠️ Technology Stack

- **React 18**: UI framework
- **Lucide React**: Icons
- **Tailwind CSS**: Styling (utility classes only)
- **Clipboard API**: Copy to clipboard functionality

## 📁 Project Structure

```
mushroom-monitoring-system/
├── public/
│   └── index.html
├── src/
│   ├── App.js                 # Main monitoring component
│   ├── index.js              # React entry point
│   └── index.css             # Tailwind imports
├── package.json
├── README.md
└── LICENSE
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Designed for mushroom cultivators and mycelium leather producers
- Built with guidance from cultivation best practices
- Inspired by the need for systematic monitoring in controlled environments

## 📧 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Refer to the built-in field hints for data entry guidance

## 🔄 Changelog

### Version 1.0.0 (2025-10-28)
- Initial release
- Three growth phase monitoring
- Google Sheets integration
- CSV export functionality
- Historical data view
- In-memory data storage

---

Made with 🍄 for the mycology community
