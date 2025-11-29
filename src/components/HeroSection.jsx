import { useState, useEffect } from 'react';

// ============================================================================
// BASE DE DATOS ACARA - VEHÍCULOS ARGENTINA 2025
// Estructura: TIPO > MARCA > MODELO > VERSIÓN
// ============================================================================

const TIPOS_VEHICULO = [
  { value: 'auto', label: 'Auto' }, 
  { value: 'camioneta', label: 'Camioneta' }, 
  { value: 'moto', label: 'Moto' }, 
  { value: 'camion', label: 'Camión' }
];

const AÑOS = Array.from({length: 47}, (_, i) => 2025 - i); // 2025 a 1979

const COBERTURAS_AUTO = [
  { value: 'rc', label: 'Resp. Civil (RC)' },
  { value: 'terceros_completo', label: 'Terceros Completo' },
  { value: 'terceros_full', label: 'Terceros Full' },
  { value: 'todo_riesgo', label: 'Todo Riesgo' }
];

// MARCAS POR TIPO DE VEHÍCULO
const MARCAS = {
  auto: ['ALFA ROMEO', 'AUDI', 'BMW', 'BYD', 'CHANGAN', 'CHERY', 'CHEVROLET', 'CITROEN', 'CUPRA', 'DFSK', 'DODGE', 'DS', 'FIAT', 'FORD', 'GAC', 'GEELY', 'GWM', 'HAVAL', 'HONDA', 'HYUNDAI', 'JAC', 'JAGUAR', 'JEEP', 'JETOUR', 'KIA', 'LAND ROVER', 'LEXUS', 'LIFAN', 'LINCOLN', 'MASERATI', 'MAZDA', 'MERCEDES-BENZ', 'MG', 'MINI', 'MITSUBISHI', 'NISSAN', 'PEUGEOT', 'PORSCHE', 'RAM', 'RENAULT', 'SEAT', 'SKODA', 'SSANGYONG', 'SUBARU', 'SUZUKI', 'TESLA', 'TOYOTA', 'VOLKSWAGEN', 'VOLVO'],
  camioneta: ['CHEVROLET', 'DODGE', 'FIAT', 'FORD', 'GWM', 'HYUNDAI', 'ISUZU', 'JAC', 'MAHINDRA', 'MAZDA', 'MERCEDES-BENZ', 'MITSUBISHI', 'NISSAN', 'RAM', 'RENAULT', 'SSANGYONG', 'TOYOTA', 'VOLKSWAGEN'],
  moto: ['APRILIA', 'BAJAJ', 'BENELLI', 'BETA', 'BMW', 'CF MOTO', 'CORVEN', 'DUCATI', 'GILERA', 'GUERRERO', 'HARLEY-DAVIDSON', 'HERO', 'HONDA', 'HUSQVARNA', 'INDIAN', 'JAWA', 'KAWASAKI', 'KELLER', 'KTM', 'KYMCO', 'MOTOMEL', 'MV AGUSTA', 'ROYAL ENFIELD', 'SUZUKI', 'SYM', 'TRIUMPH', 'TVS', 'VENTO', 'VOGE', 'YAMAHA', 'ZANELLA', 'ZONGSHEN'],
  camion: ['AGRALE', 'DAF', 'FOTON', 'FREIGHTLINER', 'HINO', 'HYUNDAI', 'INTERNATIONAL', 'ISUZU', 'IVECO', 'JAC', 'JMC', 'KENWORTH', 'MACK', 'MAN', 'MERCEDES-BENZ', 'PETERBILT', 'SCANIA', 'SHACMAN', 'SINOTRUK', 'VOLKSWAGEN', 'VOLVO', 'WESTERN STAR']
};

// MODELOS POR MARCA
const MODELOS = {
  'ALFA ROMEO': ['Giulia', 'Stelvio', 'Tonale'],
  'AUDI': ['A1', 'A3', 'A4', 'A5', 'A6', 'A7', 'Q2', 'Q3', 'Q5', 'Q7', 'Q8', 'e-tron', 'RS3', 'RS4', 'RS5', 'RS6', 'TT'],
  'BMW': ['Serie 1', 'Serie 2', 'Serie 3', 'Serie 4', 'Serie 5', 'Serie 7', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'i4', 'iX', 'M2', 'M3', 'M4', 'Z4'],
  'BYD': ['Dolphin', 'Seal', 'Song Plus', 'Tang', 'Yuan Plus', 'Han'],
  'CHANGAN': ['Alsvin', 'CS35 Plus', 'CS55 Plus', 'CS75 Plus', 'Hunter'],
  'CHERY': ['Arrizo 5', 'Tiggo 2', 'Tiggo 3', 'Tiggo 4', 'Tiggo 5X', 'Tiggo 7', 'Tiggo 8', 'Omoda 5'],
  'CHEVROLET': ['Onix', 'Onix Plus', 'Cruze', 'Tracker', 'Equinox', 'S10', 'Montana', 'Silverado', 'Spin', 'Camaro'],
  'CITROEN': ['C3', 'C3 Aircross', 'C4 Cactus', 'C5 Aircross', 'Berlingo'],
  'CUPRA': ['Formentor', 'Leon', 'Born'],
  'DFSK': ['Glory 500', 'Glory 580', 'K01H', 'K02L'],
  'DODGE': ['Durango', 'Journey', 'Challenger', 'Charger'],
  'DS': ['DS3', 'DS4', 'DS7'],
  'FIAT': ['Argo', 'Cronos', 'Pulse', 'Fastback', 'Strada', 'Toro', 'Mobi', 'Fiorino', '500', 'Titano'],
  'FORD': ['Ka', 'Fiesta', 'Focus', 'Mondeo', 'Mustang', 'EcoSport', 'Kuga', 'Territory', 'Bronco', 'Bronco Sport', 'Explorer', 'F-150', 'Ranger', 'Maverick'],
  'GAC': ['GS3', 'GS4', 'GS5', 'Empow'],
  'GEELY': ['Coolray', 'Emgrand', 'Monjaro'],
  'GWM': ['Haval H6', 'Haval Jolion', 'Ora 03', 'Poer', 'Tank 300'],
  'HAVAL': ['H6', 'Jolion', 'Dargo'],
  'HONDA': ['City', 'Civic', 'Accord', 'HR-V', 'WR-V', 'CR-V', 'ZR-V'],
  'HYUNDAI': ['HB20', 'i30', 'Elantra', 'Creta', 'Tucson', 'Santa Fe', 'Kona', 'Ioniq 5'],
  'JAC': ['S2', 'S3', 'S4', 'S7', 'T6', 'T8'],
  'JAGUAR': ['E-Pace', 'F-Pace', 'I-Pace', 'XE', 'XF', 'F-Type'],
  'JEEP': ['Renegade', 'Compass', 'Commander', 'Cherokee', 'Grand Cherokee', 'Wrangler', 'Gladiator'],
  'JETOUR': ['Dashing', 'X70', 'X90'],
  'KIA': ['Picanto', 'Rio', 'Cerato', 'Seltos', 'Sportage', 'Sorento', 'Carnival', 'Stinger', 'EV6'],
  'LAND ROVER': ['Defender', 'Discovery', 'Discovery Sport', 'Range Rover', 'Range Rover Sport', 'Range Rover Evoque', 'Range Rover Velar'],
  'LEXUS': ['ES', 'IS', 'NX', 'RX', 'UX', 'LX'],
  'LIFAN': ['X50', 'X60', 'X70'],
  'LINCOLN': ['Aviator', 'Nautilus', 'Navigator'],
  'MASERATI': ['Ghibli', 'Grecale', 'GranTurismo', 'Levante', 'Quattroporte'],
  'MAZDA': ['2', '3', '6', 'CX-3', 'CX-30', 'CX-5', 'CX-9', 'MX-5'],
  'MERCEDES-BENZ': ['Clase A', 'Clase C', 'Clase E', 'Clase S', 'CLA', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'Clase G', 'EQA', 'EQB', 'EQC', 'EQE', 'EQS', 'Sprinter', 'Vito'],
  'MG': ['MG3', 'MG5', 'ZS', 'HS', 'MG4'],
  'MINI': ['Cooper', 'Countryman', 'Clubman'],
  'MITSUBISHI': ['L200', 'ASX', 'Eclipse Cross', 'Outlander', 'Pajero Sport'],
  'NISSAN': ['March', 'Versa', 'Sentra', 'Kicks', 'Qashqai', 'X-Trail', 'Murano', 'Pathfinder', 'Frontier', 'Leaf'],
  'PEUGEOT': ['208', '308', '408', '508', '2008', '3008', '5008', 'Partner', 'Expert', 'Landtrek'],
  'PORSCHE': ['718', '911', 'Panamera', 'Taycan', 'Macan', 'Cayenne'],
  'RAM': ['700', '1000', '1200', '1500', '2500', '3500'],
  'RENAULT': ['Kwid', 'Sandero', 'Logan', 'Stepway', 'Duster', 'Captur', 'Koleos', 'Arkana', 'Kangoo', 'Master', 'Alaskan', 'Oroch'],
  'SEAT': ['Ibiza', 'Leon', 'Arona', 'Ateca', 'Tarraco'],
  'SKODA': ['Fabia', 'Scala', 'Octavia', 'Superb', 'Kamiq', 'Karoq', 'Kodiaq'],
  'SSANGYONG': ['Korando', 'Tivoli', 'Rexton', 'Musso'],
  'SUBARU': ['Impreza', 'XV', 'Crosstrek', 'Forester', 'Outback', 'Legacy', 'WRX', 'BRZ'],
  'SUZUKI': ['Alto', 'Celerio', 'Swift', 'Baleno', 'Ignis', 'S-Cross', 'Vitara', 'Grand Vitara', 'Jimny'],
  'TESLA': ['Model 3', 'Model S', 'Model X', 'Model Y', 'Cybertruck'],
  'TOYOTA': ['Etios', 'Yaris', 'Yaris Cross', 'Corolla', 'Corolla Cross', 'Camry', 'Prius', 'GR86', 'Supra', 'C-HR', 'RAV4', 'SW4', 'Land Cruiser', 'Hilux', 'Hiace'],
  'VOLKSWAGEN': ['Gol', 'Polo', 'Virtus', 'Golf', 'Jetta', 'Vento', 'Passat', 'T-Cross', 'Taos', 'Tiguan', 'Touareg', 'Nivus', 'ID.4', 'Amarok', 'Saveiro'],
  'VOLVO': ['S60', 'S90', 'V60', 'V90', 'XC40', 'XC60', 'XC90', 'C40', 'EX30'],
  // MOTOS
  'APRILIA': ['RS 125', 'RS 660', 'RSV4', 'Tuono 660', 'Tuono V4'],
  'BAJAJ': ['Boxer', 'Pulsar NS 125', 'Pulsar NS 200', 'Pulsar RS 200', 'Dominar 250', 'Dominar 400'],
  'BENELLI': ['TNT 150', 'TNT 300', 'Leoncino 250', 'Leoncino 500', 'TRK 502'],
  'BETA': ['RR 125', 'RR 200', 'RR 300', 'RR 390'],
  'BMW': ['G 310 R', 'G 310 GS', 'F 750 GS', 'F 850 GS', 'R 1250 GS', 'S 1000 RR', 'R nineT'],
  'CF MOTO': ['250NK', '400NK', '650NK', '700 CL-X', '800MT'],
  'CORVEN': ['Energy 110', 'Hunter 150', 'Triax 150', 'Triax 200'],
  'DUCATI': ['Scrambler', 'Monster', 'Diavel', 'Multistrada', 'Panigale', 'Streetfighter'],
  'GILERA': ['Smash 110', 'VC 150', 'VC 200'],
  'GUERRERO': ['Trip 110', 'G 110', 'GRF 200', 'GXL 150', 'GMX 150'],
  'HARLEY-DAVIDSON': ['Iron 883', 'Sportster S', 'Street Bob', 'Fat Boy', 'Road Glide', 'Pan America'],
  'HERO': ['Ignitor 125', 'Hunk 150', 'XPulse 200'],
  'HONDA': ['Wave 110', 'Biz 125', 'CG 150 Titan', 'CB 190R', 'CB 250 Twister', 'CB 500F', 'CBR 250RR', 'XR 150L', 'XRE 300', 'CRF 250F', 'CRF 300L', 'Africa Twin', 'PCX 150', 'Elite 125'],
  'HUSQVARNA': ['Svartpilen 401', 'Vitpilen 401', 'Norden 901'],
  'INDIAN': ['Scout', 'Chief', 'Chieftain', 'Roadmaster', 'FTR'],
  'JAWA': ['42', '350', 'Perak'],
  'KAWASAKI': ['Ninja 300', 'Ninja 400', 'Ninja 650', 'Ninja ZX-6R', 'Ninja ZX-10R', 'Z400', 'Z650', 'Z900', 'Versys 650', 'Vulcan S', 'KLX 230'],
  'KELLER': ['Xtreme 150', 'Xtreme 200', 'Crono 110'],
  'KTM': ['125 Duke', '200 Duke', '390 Duke', '790 Duke', '890 Duke', 'RC 390', '390 Adventure', '890 Adventure'],
  'KYMCO': ['Agility 125', 'Like 125', 'Downtown 350i'],
  'MOTOMEL': ['Blitz 110', 'Sirius 150', 'Sirius 200', 'CG 150', 'S2 150', 'S3 200', 'Skua 150', 'Skua 250'],
  'MV AGUSTA': ['Brutale 800', 'F3 800', 'Superveloce', 'Turismo Veloce'],
  'ROYAL ENFIELD': ['Classic 350', 'Meteor 350', 'Hunter 350', 'Himalayan', 'Continental GT 650', 'Interceptor 650'],
  'SUZUKI': ['AX 100', 'GN 125', 'Gixxer 150', 'Gixxer 250', 'GSX-R600', 'GSX-R1000', 'V-Strom 650', 'V-Strom 1050', 'Hayabusa'],
  'SYM': ['Symphony 125', 'Crox 125', 'Citycom 300'],
  'TRIUMPH': ['Street Twin', 'Street Triple', 'Speed Triple', 'Trident 660', 'Tiger 900', 'Rocket 3'],
  'TVS': ['Ntorq 125', 'Apache RTR 160', 'Apache RTR 200', 'Apache RR 310'],
  'VENTO': ['Cyclone 150', 'Terra 200'],
  'VOGE': ['300R', '500R', '500DS', '650DS'],
  'YAMAHA': ['Ray ZR 125', 'FZ 16', 'FZ 25', 'MT-03', 'MT-07', 'MT-09', 'YZF-R3', 'YZF-R6', 'YZF-R1', 'XSR 700', 'XSR 900', 'Tenere 700', 'Tracer 9', 'NMAX 155'],
  'ZANELLA': ['ZB 110', 'RX 150', 'RX 200', 'Patagonian Eagle'],
  'ZONGSHEN': ['RX3', 'ZS150'],
  // CAMIONES
  'AGRALE': ['8500', '9200', '10000', '13000', '14000'],
  'DAF': ['CF', 'XF', 'XG'],
  'FOTON': ['Aumark', 'Auman', 'EST'],
  'FREIGHTLINER': ['Cascadia', 'M2 106'],
  'HINO': ['300 Series', '500 Series', '700 Series'],
  'INTERNATIONAL': ['CV', 'HV', 'LT'],
  'ISUZU': ['NHR', 'NKR', 'NPR', 'NQR', 'FRR', 'FSR'],
  'IVECO': ['Daily', 'Eurocargo', 'Tector', 'Stralis', 'S-Way'],
  'JMC': ['Carrying', 'N800', 'N900'],
  'KENWORTH': ['T680', 'T880', 'W900'],
  'MACK': ['Anthem', 'Pinnacle', 'Granite'],
  'MAN': ['TGL', 'TGM', 'TGS', 'TGX'],
  'PETERBILT': ['579', '389', '367'],
  'SCANIA': ['G Series', 'R Series', 'S Series', 'P Series'],
  'SHACMAN': ['X3000', 'F3000'],
  'SINOTRUK': ['Howo', 'Sitrak'],
  'WESTERN STAR': ['4700', '4900', '5700'],
  // CAMIONETAS
  'MAHINDRA': ['Pik Up S6', 'Pik Up S10', 'Scorpio Pik Up'],
  // DEFAULT
  'default': ['Consultar modelo']
};

// ============================================================================
// VERSIONES POR MODELO - BASE ACARA ARGENTINA
// ============================================================================

const VERSIONES = {
  // BMW
  'Serie 1': ['116i', '118i', '118i M Sport', '120i', '120i M Sport', 'M135i xDrive'],
  'Serie 2': ['218i', '220i', '220i M Sport', 'M235i xDrive'],
  'Serie 3': ['318i', '320i', '320i M Sport', '330i', '330i M Sport', '330e', 'M340i xDrive'],
  'Serie 4': ['420i', '420i M Sport', '430i', '430i M Sport', 'M440i xDrive'],
  'Serie 5': ['520i', '520i M Sport', '530i', '530i M Sport', '530e', '540i xDrive'],
  'Serie 7': ['735i', '740i', '750i xDrive', '760i xDrive'],
  'X1': ['sDrive18i', 'sDrive20i', 'xDrive20i', 'xDrive25i'],
  'X2': ['sDrive18i', 'sDrive20i', 'xDrive20i', 'M35i'],
  'X3': ['sDrive20i', 'xDrive20i', 'xDrive30i', 'M40i', 'M Competition'],
  'X4': ['xDrive20i', 'xDrive30i', 'M40i', 'M Competition'],
  'X5': ['xDrive40i', 'xDrive45e', 'xDrive50i', 'M50i', 'M Competition'],
  'X6': ['xDrive40i', 'xDrive50i', 'M50i', 'M Competition'],
  'X7': ['xDrive40i', 'xDrive40d', 'M60i xDrive'],
  'i4': ['eDrive35', 'eDrive40', 'xDrive40', 'M50'],
  'iX': ['xDrive40', 'xDrive50', 'M60'],
  'M2': ['M2', 'M2 Competition'],
  'M3': ['M3', 'M3 Competition', 'M3 CS'],
  'M4': ['M4', 'M4 Competition', 'M4 CS', 'M4 CSL'],
  'Z4': ['sDrive20i', 'sDrive30i', 'M40i'],
  
  // MERCEDES-BENZ
  'Clase A': ['A 200', 'A 200 Style', 'A 200 Progressive', 'A 200 AMG Line', 'A 250', 'A 35 AMG', 'A 45 AMG'],
  'Clase C': ['C 200', 'C 200 Avantgarde', 'C 200 AMG Line', 'C 300', 'C 300 AMG Line', 'C 43 AMG', 'C 63 AMG'],
  'Clase E': ['E 200', 'E 300', 'E 350', 'E 53 AMG', 'E 63 AMG'],
  'Clase S': ['S 450', 'S 500', 'S 580', 'S 63 AMG'],
  'CLA': ['CLA 200', 'CLA 250', 'CLA 35 AMG', 'CLA 45 AMG'],
  'GLA': ['GLA 200', 'GLA 200 Style', 'GLA 200 AMG Line', 'GLA 250', 'GLA 35 AMG', 'GLA 45 AMG'],
  'GLB': ['GLB 200', 'GLB 250', 'GLB 35 AMG'],
  'GLC': ['GLC 200', 'GLC 300', 'GLC 300 4MATIC', 'GLC 43 AMG', 'GLC 63 AMG'],
  'GLE': ['GLE 300', 'GLE 350', 'GLE 450', 'GLE 53 AMG', 'GLE 63 AMG'],
  'GLS': ['GLS 450', 'GLS 580', 'GLS 63 AMG'],
  'Clase G': ['G 500', 'G 63 AMG'],
  
  // AUDI
  'A1': ['25 TFSI', '30 TFSI', '35 TFSI'],
  'A3': ['30 TFSI', '35 TFSI', '35 TFSI S line', '40 TFSI quattro'],
  'A4': ['35 TFSI', '40 TFSI', '40 TFSI quattro', '45 TFSI quattro S line'],
  'A5': ['40 TFSI', '45 TFSI', '45 TFSI quattro S line'],
  'A6': ['45 TFSI', '55 TFSI quattro', '55 TFSI quattro S line'],
  'A7': ['55 TFSI quattro', '55 TFSI quattro S line'],
  'Q2': ['30 TFSI', '35 TFSI', '35 TFSI S line'],
  'Q3': ['35 TFSI', '35 TFSI S line', '40 TFSI quattro', '45 TFSI quattro'],
  'Q5': ['40 TFSI', '45 TFSI quattro', '45 TFSI quattro S line', '55 TFSI e'],
  'Q7': ['45 TFSI', '55 TFSI quattro', '55 TFSI quattro S line'],
  'Q8': ['55 TFSI quattro', '55 TFSI quattro S line'],
  'e-tron': ['50 quattro', '55 quattro', 'S quattro'],
  'RS3': ['RS3 Sedan', 'RS3 Sportback'],
  'RS4': ['RS4 Avant'],
  'RS5': ['RS5 Coupe', 'RS5 Sportback'],
  'RS6': ['RS6 Avant'],
  'TT': ['40 TFSI', '45 TFSI quattro', 'TTS'],
  
  // VOLKSWAGEN
  'Gol': ['Trend', 'Trendline', 'Comfortline'],
  'Polo': ['MSI', 'Comfortline', 'Highline', 'GTS'],
  'Virtus': ['MSI', 'Comfortline', 'Highline', 'GTS'],
  'Golf': ['250 TSI', '250 TSI Comfortline', '250 TSI Highline', 'GTI', 'R'],
  'Jetta': ['Trendline', 'Comfortline', 'Highline', 'GLI'],
  'Vento': ['Trendline', 'Comfortline', 'Highline'],
  'Passat': ['Comfortline', 'Highline', 'R-Line'],
  'T-Cross': ['170 TSI', '200 TSI', '200 TSI Comfortline', '200 TSI Highline'],
  'Taos': ['200 TSI', '250 TSI', '250 TSI Comfortline', '250 TSI Highline'],
  'Tiguan': ['250 TSI', '350 TSI', '350 TSI R-Line'],
  'Touareg': ['V6', 'V8', 'R', 'eHybrid'],
  'Nivus': ['200 TSI', '200 TSI Comfortline', '200 TSI Highline'],
  'ID.4': ['Pro', 'Pro S', 'GTX'],
  'Amarok': ['2.0 TDI', '3.0 V6', '3.0 V6 Highline', '3.0 V6 Extreme', 'V6 258cv'],
  'Saveiro': ['MSI', 'Trendline', 'Cross'],
  
  // TOYOTA
  'Etios': ['X', 'XS', 'XLS', 'Cross'],
  'Yaris': ['XS', 'XLS', 'XLS CVT', 'S CVT'],
  'Yaris Cross': ['XS', 'XLS', 'XLS CVT', 'S CVT', 'Hybrid'],
  'Corolla': ['XLi', 'XEi', 'XEi CVT', 'SEG CVT', 'Hybrid', 'GR-S'],
  'Corolla Cross': ['XLi', 'XEi CVT', 'SEG CVT', 'Hybrid XEi', 'Hybrid SEG', 'GR-S'],
  'Camry': ['XLE', 'XSE', 'Hybrid'],
  'Prius': ['LE', 'XLE', 'Prime'],
  'GR86': ['Premium', 'Limited'],
  'Supra': ['2.0', '3.0', '3.0 Premium', 'GR'],
  'C-HR': ['LE', 'XLE', 'Limited'],
  'RAV4': ['LE', 'XLE', 'XLE Premium', 'Adventure', 'TRD', 'Limited', 'Hybrid', 'Prime'],
  'SW4': ['SRX', 'SRX 4x4', 'Diamond', 'Diamond 4x4', 'GR-S'],
  'Land Cruiser': ['VX', 'VX-R', 'GR-S'],
  'Hilux': ['DX', 'DX 4x4', 'SR', 'SRV', 'SRV 4x4', 'SRX', 'SRX 4x4', 'GR-S', 'GR-S 4x4'],
  
  // FORD
  'Ka': ['S', 'SE', 'SEL', 'Freestyle'],
  'Fiesta': ['S', 'SE', 'Titanium', 'ST'],
  'Focus': ['SE', 'SE Plus', 'Titanium', 'ST-Line', 'ST'],
  'Mondeo': ['SE', 'SEL', 'Titanium', 'Vignale'],
  'Mustang': ['EcoBoost', 'GT', 'GT Premium', 'Mach 1', 'Dark Horse'],
  'EcoSport': ['S', 'SE', 'Titanium', 'Storm'],
  'Kuga': ['SE', 'Titanium', 'ST-Line', 'Vignale'],
  'Territory': ['1.5T', '1.5T Titanium'],
  'Bronco': ['Base', 'Big Bend', 'Black Diamond', 'Outer Banks', 'Badlands', 'Wildtrak', 'Raptor'],
  'Bronco Sport': ['Base', 'Big Bend', 'Outer Banks', 'Badlands', 'Wildtrak'],
  'Explorer': ['XLT', 'Limited', 'ST-Line', 'Platinum'],
  'F-150': ['XL', 'XLT', 'Lariat', 'King Ranch', 'Platinum', 'Limited', 'Raptor'],
  'Ranger': ['XL', 'XLS', 'XLT', 'Limited', 'Wildtrak', 'Raptor'],
  'Maverick': ['XL', 'XLT', 'Lariat', 'Tremor'],
  
  // CHEVROLET
  'Onix': ['1.0', '1.0 LT', '1.0 LTZ', '1.0 Turbo', '1.0 Turbo Premier'],
  'Onix Plus': ['1.0', '1.0 LT', '1.0 LTZ', '1.0 Turbo', '1.0 Turbo Premier'],
  'Cruze': ['LT', 'LTZ', 'Premier', 'RS'],
  'Tracker': ['1.0 Turbo', '1.0 Turbo LT', '1.2 Turbo', '1.2 Turbo Premier', 'RS'],
  'Equinox': ['LT', 'Premier', 'RS'],
  'S10': ['LS', 'LT', 'LTZ', 'High Country', 'Z71'],
  'Montana': ['LS', 'LT', 'LTZ'],
  'Silverado': ['LT', 'LTZ', 'High Country', 'ZR2', 'Trail Boss'],
  'Spin': ['LT', 'LTZ', 'Premier', 'Activ'],
  'Camaro': ['LT', 'SS', 'ZL1'],
  
  // FIAT
  'Argo': ['Like', 'Drive', 'Precision', 'Trekking'],
  'Cronos': ['Like', 'Drive', 'Precision'],
  'Pulse': ['Drive', 'Audace', 'Impetus'],
  'Fastback': ['Audace', 'Impetus', 'Abarth'],
  'Strada': ['Endurance', 'Freedom', 'Volcano', 'Ranch', 'Ultra'],
  'Toro': ['Endurance', 'Freedom', 'Volcano', 'Ranch', 'Ultra'],
  'Mobi': ['Easy', 'Like', 'Trekking'],
  'Titano': ['Endurance', 'Volcano', 'Ranch'],
  '500': ['Pop', 'Lounge', 'Sport', 'Abarth'],
  
  // PEUGEOT
  '208': ['Like', 'Active', 'Allure', 'Feline', 'GT'],
  '308': ['Active', 'Allure', 'GT'],
  '408': ['Allure', 'GT'],
  '508': ['Allure', 'GT'],
  '2008': ['Active', 'Allure', 'GT', 'GT Pack'],
  '3008': ['Active', 'Allure', 'Allure Pack', 'GT', 'GT Pack'],
  '5008': ['Allure', 'Allure Pack', 'GT', 'GT Pack'],
  'Partner': ['Furgon', 'Confort', 'Patagonica'],
  'Landtrek': ['Active', 'Allure', 'GT'],
  
  // RENAULT
  'Kwid': ['Life', 'Zen', 'Intens', 'Outsider'],
  'Sandero': ['Life', 'Zen', 'Intens', 'Stepway'],
  'Logan': ['Life', 'Zen', 'Intens'],
  'Stepway': ['Zen', 'Intens', 'Iconic'],
  'Duster': ['Life', 'Zen', 'Intens', 'Iconic'],
  'Captur': ['Life', 'Zen', 'Intens', 'Iconic'],
  'Koleos': ['Zen', 'Intens', 'Iconic'],
  'Arkana': ['Zen', 'Intens', 'Iconic', 'RS Line'],
  'Kangoo': ['Express', 'Confort', 'Stepway'],
  'Master': ['Furgon', 'Minibus', 'Chasis'],
  'Alaskan': ['Confort', 'Intens', 'Iconic'],
  'Oroch': ['Life', 'Zen', 'Intens', 'Outsider'],
  
  // HYUNDAI
  'HB20': ['Comfort', 'Premium', 'Limited'],
  'i30': ['Style', 'Premium', 'N Line', 'N'],
  'Elantra': ['GL', 'Limited', 'N Line', 'N'],
  'Creta': ['Comfort', 'Limited', 'Ultimate'],
  'Tucson': ['Style', 'Premium', 'Limited', 'N Line'],
  'Santa Fe': ['Style', 'Limited', 'Calligraphy'],
  'Kona': ['Style', 'Premium', 'N Line', 'Electric'],
  'Ioniq 5': ['Standard', 'Long Range', 'Long Range AWD'],
  
  // KIA
  'Picanto': ['LX', 'EX', 'GT Line'],
  'Rio': ['LX', 'EX', 'GT Line'],
  'Cerato': ['LX', 'EX', 'GT'],
  'Seltos': ['LX', 'EX', 'EX Premium', 'GT Line'],
  'Sportage': ['LX', 'EX', 'EX Pack', 'GT Line', 'X Line'],
  'Sorento': ['LX', 'EX', 'EX Pack', 'GT Line'],
  'Carnival': ['LX', 'EX', 'SX'],
  'Stinger': ['GT', 'GT Line'],
  'EV6': ['Standard', 'Long Range', 'Long Range AWD', 'GT'],
  
  // JEEP
  'Renegade': ['Sport', 'Longitude', 'Limited', 'Trailhawk'],
  'Compass': ['Sport', 'Longitude', 'Limited', 'Trailhawk', 'S'],
  'Commander': ['Limited', 'Overland', 'Summit'],
  'Cherokee': ['Latitude', 'Limited', 'Trailhawk'],
  'Grand Cherokee': ['Laredo', 'Limited', 'Overland', 'Summit', 'SRT', 'Trackhawk'],
  'Wrangler': ['Sport', 'Sport S', 'Sahara', 'Rubicon'],
  'Gladiator': ['Sport', 'Overland', 'Rubicon'],
  
  // NISSAN
  'March': ['Active', 'Advance', 'Exclusive'],
  'Versa': ['Sense', 'Advance', 'Exclusive'],
  'Sentra': ['Sense', 'Advance', 'Exclusive', 'SR'],
  'Kicks': ['Sense', 'Advance', 'Exclusive', 'e-Power'],
  'Qashqai': ['Sense', 'Advance', 'Exclusive'],
  'X-Trail': ['Sense', 'Advance', 'Exclusive', 'e-Power'],
  'Murano': ['Advance', 'Exclusive'],
  'Pathfinder': ['Sense', 'Advance', 'Exclusive', 'Platinum'],
  'Frontier': ['S', 'SE', 'LE', 'Attack', 'X-Gear', 'Pro-4X'],
  
  // HONDA
  'City': ['DX', 'LX', 'EX', 'EXL'],
  'Civic': ['LX', 'EX', 'EXL', 'Touring', 'Si', 'Type R'],
  'Accord': ['LX', 'EX', 'EXL', 'Touring'],
  'HR-V': ['DX', 'LX', 'EX', 'EXL', 'Touring'],
  'WR-V': ['DX', 'LX', 'EX', 'EXL'],
  'CR-V': ['LX', 'EX', 'EXL', 'Touring', 'Hybrid'],
  'ZR-V': ['Sport', 'Touring', 'Sport Hybrid', 'Touring Hybrid'],
  
  // RAM
  '700': ['Club Cab', 'SLT'],
  '1000': ['SLT', 'Laramie'],
  '1200': ['SLT', 'Laramie'],
  '1500': ['Big Horn', 'Laramie', 'Limited', 'Rebel', 'TRX'],
  '2500': ['Big Horn', 'Laramie', 'Limited', 'Power Wagon'],
  '3500': ['Big Horn', 'Laramie', 'Limited'],
  
  // CITROËN
  'C3': ['Live', 'Feel', 'Shine', 'You!'],
  'C3 Aircross': ['Live', 'Feel', 'Shine'],
  'C4 Cactus': ['Live', 'Feel', 'Shine'],
  'C5 Aircross': ['Feel', 'Shine', 'Shine Pack'],
  'Berlingo': ['Business', 'Feel', 'XTR'],
  
  // SUZUKI
  'Alto': ['GA', 'GL'],
  'Celerio': ['GA', 'GL'],
  'Swift': ['GL', 'GLX', 'Sport'],
  'Baleno': ['GL', 'GLX'],
  'Ignis': ['GL', 'GLX'],
  'S-Cross': ['GL', 'GLX', 'Hybrid'],
  'Vitara': ['GL', 'GLX', 'Hybrid'],
  'Grand Vitara': ['GL', 'GLX', 'Hybrid'],
  'Jimny': ['GL', 'GLX'],
  
  // MITSUBISHI
  'L200': ['GL', 'GLX', 'GLS', 'High Power'],
  'ASX': ['GL', 'GLS', 'GT'],
  'Eclipse Cross': ['GL', 'GLS', 'GT', 'PHEV'],
  'Outlander': ['GL', 'GLS', 'GT', 'PHEV'],
  'Pajero Sport': ['GL', 'GLS', 'GT'],
  
  // SUBARU
  'Impreza': ['2.0i', '2.0i-S', 'WRX'],
  'XV': ['2.0i', '2.0i-S', '2.0i Limited'],
  'Crosstrek': ['Base', 'Premium', 'Limited', 'Sport'],
  'Forester': ['2.0i', '2.0i-L', '2.0i-S', '2.5 Sport'],
  'Outback': ['2.5i', '2.5i-S', '2.5i Limited', 'XT'],
  'Legacy': ['2.5i', '2.5i-S', '2.5i Limited'],
  'WRX': ['Base', 'Premium', 'Limited', 'GT'],
  'BRZ': ['Base', 'Premium', 'Limited'],
  
  // LAND ROVER
  'Defender': ['90', '110', '130', 'V8'],
  'Discovery': ['S', 'SE', 'HSE', 'R-Dynamic'],
  'Discovery Sport': ['S', 'SE', 'R-Dynamic', 'HSE'],
  'Range Rover': ['SE', 'HSE', 'Autobiography', 'SV'],
  'Range Rover Sport': ['SE', 'HSE', 'Autobiography', 'SVR'],
  'Range Rover Evoque': ['S', 'SE', 'R-Dynamic', 'HSE'],
  'Range Rover Velar': ['S', 'SE', 'R-Dynamic', 'HSE'],
  
  // PORSCHE
  '718': ['Boxster', 'Cayman', 'Boxster S', 'Cayman S', 'GTS', 'Spyder'],
  '911': ['Carrera', 'Carrera S', 'Carrera 4S', 'Targa', 'Turbo', 'Turbo S', 'GT3', 'GT3 RS'],
  'Panamera': ['4', '4S', 'GTS', 'Turbo', 'Turbo S'],
  'Taycan': ['4S', 'GTS', 'Turbo', 'Turbo S'],
  'Macan': ['Base', 'S', 'GTS', 'Turbo'],
  'Cayenne': ['Base', 'S', 'GTS', 'Turbo', 'Turbo GT', 'E-Hybrid'],
  
  // VOLVO
  'S60': ['T4', 'T5', 'T6', 'T8', 'Polestar'],
  'S90': ['T5', 'T6', 'T8', 'Recharge'],
  'V60': ['T4', 'T5', 'T6', 'T8', 'Cross Country'],
  'V90': ['T5', 'T6', 'T8', 'Cross Country'],
  'XC40': ['T3', 'T4', 'T5', 'Recharge', 'Recharge Pure Electric'],
  'XC60': ['T5', 'T6', 'T8', 'Recharge', 'Polestar'],
  'XC90': ['T5', 'T6', 'T8', 'Recharge', 'Excellence'],
  'C40': ['Recharge', 'Recharge Pure Electric'],
  'EX30': ['Single Motor', 'Twin Motor'],
  
  // MOTOS - Principales
  'Wave 110': ['Base', 'S'],
  'CG 150 Titan': ['ES', 'ESD'],
  'CB 190R': ['Base', 'Repsol'],
  'CB 250 Twister': ['Base', 'ABS'],
  'XR 150L': ['Base', 'Rally'],
  'Africa Twin': ['Base', 'Adventure Sports', 'Adventure Sports ES'],
  'Gixxer 150': ['Fi', 'SF Fi'],
  'Gixxer 250': ['SF', 'SF ABS'],
  'FZ 16': ['Fi', 'Fi V3.0'],
  'FZ 25': ['Base', 'ABS'],
  'MT-03': ['Base', 'Race Blue'],
  'MT-07': ['Base', 'ABS'],
  'MT-09': ['Base', 'SP'],
  'YZF-R3': ['Base', 'Monster Energy'],
  'Pulsar NS 125': ['Base'],
  'Pulsar NS 200': ['Fi', 'Fi ABS'],
  'Pulsar RS 200': ['Fi', 'Fi ABS'],
  'Dominar 250': ['Base', 'ABS'],
  'Dominar 400': ['Base', 'ABS', 'Touring'],
  '125 Duke': ['Base'],
  '200 Duke': ['Base', 'ABS'],
  '390 Duke': ['Base', 'ABS'],
  '790 Duke': ['Base', 'L'],
  '890 Duke': ['Base', 'R'],
  'TNT 150': ['Base', 'i'],
  'TNT 300': ['Base', 'ABS'],
  'Leoncino 250': ['Base', 'Trail'],
  'Leoncino 500': ['Base', 'Trail'],
  'TRK 502': ['Base', 'X'],
  
  // DEFAULT - Para modelos sin versiones específicas
  'default': ['Versión base', 'Versión media', 'Versión full', 'Otra versión']
};

// ============================================================================
// DATOS PARA OTRAS PESTAÑAS
// ============================================================================

const TIPOS_INMUEBLE = [
  { value: 'casa', label: 'Casa' },
  { value: 'departamento', label: 'Departamento' },
  { value: 'ph', label: 'PH' },
  { value: 'country', label: 'Country/Barrio cerrado' }
];

const COBERTURAS_HOGAR = [
  { value: 'basica', label: 'Básica (Incendio)' },
  { value: 'intermedia', label: 'Intermedia (+ Robo)' },
  { value: 'completa', label: 'Completa (Todo Riesgo)' }
];

const ACTIVIDADES_CIIU = [
  { value: '4711', label: 'Comercio minorista' },
  { value: '5610', label: 'Restaurantes/Bares' },
  { value: '4520', label: 'Taller mecánico' },
  { value: '4771', label: 'Farmacia' },
  { value: '8610', label: 'Clínica/Consultorio' },
  { value: '4110', label: 'Construcción' },
  { value: '0111', label: 'Agricultura' },
  { value: '2599', label: 'Metalúrgica' },
  { value: '4730', label: 'Estación de servicio' },
  { value: 'otro', label: 'Otra actividad' }
];

const PROVINCIAS = ['Buenos Aires', 'CABA', 'Córdoba', 'Santa Fe', 'Mendoza', 'Tucumán', 'Entre Ríos', 'Salta', 'Misiones', 'Chaco', 'Corrientes', 'Santiago del Estero', 'San Juan', 'Jujuy', 'Río Negro', 'Neuquén', 'Formosa', 'Chubut', 'San Luis', 'Catamarca', 'La Rioja', 'La Pampa', 'Santa Cruz', 'Tierra del Fuego'];

const TIPOS_COMERCIO = [
  { value: 'local', label: 'Local comercial' },
  { value: 'oficina', label: 'Oficina' },
  { value: 'deposito', label: 'Depósito/Galpón' },
  { value: 'industria', label: 'Industria/Fábrica' },
  { value: 'gastronomia', label: 'Gastronomía' }
];

const RUBROS = [
  { value: 'retail', label: 'Venta minorista' },
  { value: 'servicios', label: 'Servicios profesionales' },
  { value: 'alimentos', label: 'Alimentos y bebidas' },
  { value: 'tecnologia', label: 'Tecnología' },
  { value: 'salud', label: 'Salud/Farmacia' },
  { value: 'automotriz', label: 'Automotriz' },
  { value: 'construccion', label: 'Construcción' },
  { value: 'otro', label: 'Otro' }
];

const TIPOS_VIDA = [
  { value: 'vida', label: 'Seguro de Vida' },
  { value: 'vida_ahorro', label: 'Vida con Ahorro' },
  { value: 'accidentes', label: 'Accidentes Personales' },
  { value: 'sepelio', label: 'Sepelio' },
  { value: 'salud', label: 'Salud/Prepaga' }
];

// ============================================================================
// COMPONENTE PRINCIPAL - COINCIDE CON IMAGEN 1
// ============================================================================

const HeroSection = () => {
  const [activeTab, setActiveTab] = useState('vehiculos');
  const [loading, setLoading] = useState(false);

  // Estados por tipo de seguro
  const [vehiculo, setVehiculo] = useState({ tipo: '', marca: '', modelo: '', version: '', año: '', cobertura: '' });
  const [hogar, setHogar] = useState({ tipo: '', metros: '', zona: '', antiguedad: '', cobertura: '' });
  const [art, setArt] = useState({ razonSocial: '', cuit: '', actividad: '', empleados: '', masaSalarial: '', provincia: '' });
  const [comercio, setComercio] = useState({ tipo: '', rubro: '', superficie: '', sumaContenido: '', sumaEdificio: '', zona: '' });
  const [vida, setVida] = useState({ nombre: '', edad: '', tipo: '', fumador: '', monto: '' });

  // Dinámicos para vehículos
  const [marcasDisp, setMarcasDisp] = useState([]);
  const [modelosDisp, setModelosDisp] = useState([]);
  const [versionesDisp, setVersionesDisp] = useState([]);

  // Cuando cambia el tipo de vehículo
  useEffect(() => {
    if (vehiculo.tipo) {
      setMarcasDisp(MARCAS[vehiculo.tipo] || []);
      setVehiculo(p => ({ ...p, marca: '', modelo: '', version: '' }));
      setModelosDisp([]);
      setVersionesDisp([]);
    }
  }, [vehiculo.tipo]);

  // Cuando cambia la marca
  useEffect(() => {
    if (vehiculo.marca) {
      setModelosDisp(MODELOS[vehiculo.marca] || MODELOS.default);
      setVehiculo(p => ({ ...p, modelo: '', version: '' }));
      setVersionesDisp([]);
    }
  }, [vehiculo.marca]);

  // Cuando cambia el modelo - CARGAR VERSIONES
  useEffect(() => {
    if (vehiculo.modelo) {
      const versiones = VERSIONES[vehiculo.modelo] || VERSIONES.default;
      setVersionesDisp(versiones);
      setVehiculo(p => ({ ...p, version: '' }));
    } else {
      setVersionesDisp([]);
    }
  }, [vehiculo.modelo]);

  // SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    let mensaje = '';
    
    switch (activeTab) {
      case 'vehiculos':
        if (!vehiculo.tipo || !vehiculo.marca || !vehiculo.modelo || !vehiculo.año || !vehiculo.cobertura) {
          alert('Completá todos los campos obligatorios'); setLoading(false); return;
        }
        mensaje = `🚗 *COTIZACIÓN VEHÍCULO*

Tipo: ${TIPOS_VEHICULO.find(t => t.value === vehiculo.tipo)?.label || vehiculo.tipo}
Marca: ${vehiculo.marca}
Modelo: ${vehiculo.modelo}
Versión: ${vehiculo.version || 'No especificada'}
Año: ${vehiculo.año}
Cobertura: ${COBERTURAS_AUTO.find(c => c.value === vehiculo.cobertura)?.label || vehiculo.cobertura}

📍 Origen: Landing Web AYMA`;
        break;
        
      case 'hogar':
        if (!hogar.tipo || !hogar.metros || !hogar.cobertura) {
          alert('Completá los campos obligatorios'); setLoading(false); return;
        }
        mensaje = `🏠 *COTIZACIÓN HOGAR*

Tipo: ${TIPOS_INMUEBLE.find(t => t.value === hogar.tipo)?.label}
Metros²: ${hogar.metros}
Zona: ${hogar.zona || 'No especificada'}
Antigüedad: ${hogar.antiguedad || 'No especificada'}
Cobertura: ${COBERTURAS_HOGAR.find(c => c.value === hogar.cobertura)?.label}

📍 Origen: Landing Web AYMA`;
        break;
        
      case 'art':
        if (!art.razonSocial || !art.cuit || !art.actividad || !art.empleados || !art.masaSalarial || !art.provincia) {
          alert('Completá todos los campos del F.931'); setLoading(false); return;
        }
        mensaje = `🏢 *COTIZACIÓN ART EMPRESAS*

📋 Datos F.931 AFIP:
Razón Social: ${art.razonSocial}
CUIT: ${art.cuit}
Actividad: ${ACTIVIDADES_CIIU.find(a => a.value === art.actividad)?.label}
Empleados: ${art.empleados}
Masa salarial: $${Number(art.masaSalarial).toLocaleString('es-AR')}
Provincia: ${art.provincia}

📍 Origen: Landing Web AYMA`;
        break;
        
      case 'comercio':
        if (!comercio.tipo || !comercio.rubro || !comercio.superficie) {
          alert('Completá los campos obligatorios'); setLoading(false); return;
        }
        mensaje = `🏪 *COTIZACIÓN COMERCIO*

Tipo: ${TIPOS_COMERCIO.find(t => t.value === comercio.tipo)?.label}
Rubro: ${RUBROS.find(r => r.value === comercio.rubro)?.label}
Superficie: ${comercio.superficie}m²
Suma contenido: $${comercio.sumaContenido ? Number(comercio.sumaContenido).toLocaleString('es-AR') : 'A definir'}
Suma edificio: $${comercio.sumaEdificio ? Number(comercio.sumaEdificio).toLocaleString('es-AR') : 'A definir'}
Zona: ${comercio.zona || 'No especificada'}

📍 Origen: Landing Web AYMA`;
        break;
        
      case 'vida':
        if (!vida.edad || !vida.tipo) {
          alert('Completá los campos obligatorios'); setLoading(false); return;
        }
        mensaje = `❤️ *COTIZACIÓN VIDA/SALUD*

Edad: ${vida.edad} años
Tipo: ${TIPOS_VIDA.find(t => t.value === vida.tipo)?.label}
Fumador: ${vida.fumador || 'No especificado'}
Monto: ${vida.monto || 'A definir'}

📍 Origen: Landing Web AYMA`;
        break;
    }

    // Tracking GA4
    if (typeof gtag !== 'undefined') {
      gtag('event', 'quote_started', { 
        event_category: 'conversion', 
        quote_type: activeTab,
        vehicle_brand: vehiculo.marca,
        vehicle_model: vehiculo.modelo
      });
    }

    // WhatsApp - NÚMERO CORRECTO: 341 695-2259
    window.open(`https://wa.me/5493416952259?text=${encodeURIComponent(mensaje)}`, '_blank');
    setLoading(false);
  };

  // Estilos
  const inputClass = "w-full px-3 py-2 text-sm border-0 rounded-lg bg-white/95 text-gray-800 focus:ring-2 focus:ring-yellow-400 shadow-sm";
  const labelClass = "block text-xs font-medium text-white/80 mb-1";

  const tabs = [
    { id: 'vehiculos', label: '🚗 Vehículos' },
    { id: 'hogar', label: '🏠 Hogar' },
    { id: 'art', label: '🏢 ART Empresas' },
    { id: 'comercio', label: '🏪 Comercio' },
    { id: 'vida', label: '❤️ Vida/Salud' }
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-400 to-blue-300 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Escudo */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-20">
            <svg viewBox="0 0 80 96" fill="none">
              <path d="M40 0L80 16V48C80 72 60 88 40 96C20 88 0 72 0 48V16L40 0Z" stroke="#F59E0B" strokeWidth="4" fill="none"/>
            </svg>
          </div>
        </div>

        {/* Título */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-4 italic">
          Seguros de Auto, Hogar y Vida en Rosario
        </h1>

        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-full font-bold shadow-lg text-sm md:text-base">
            Cotización GRATIS en 2 minutos
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all border-2 ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 border-white shadow-lg'
                  : 'bg-transparent text-white border-white/50 hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Formulario */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          <form onSubmit={handleSubmit}>
            
            {/* VEHÍCULOS */}
            {activeTab === 'vehiculos' && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
                <div>
                  <label className={labelClass}>Tipo *</label>
                  <select 
                    className={inputClass} 
                    value={vehiculo.tipo}
                    onChange={e => setVehiculo(p => ({...p, tipo: e.target.value}))}
                  >
                    <option value="">Seleccionar</option>
                    {TIPOS_VEHICULO.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Marca *</label>
                  <select 
                    className={inputClass} 
                    value={vehiculo.marca}
                    onChange={e => setVehiculo(p => ({...p, marca: e.target.value}))}
                    disabled={!vehiculo.tipo}
                  >
                    <option value="">Seleccionar</option>
                    {marcasDisp.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Modelo *</label>
                  <select 
                    className={inputClass} 
                    value={vehiculo.modelo}
                    onChange={e => setVehiculo(p => ({...p, modelo: e.target.value}))}
                    disabled={!vehiculo.marca}
                  >
                    <option value="">Seleccionar</option>
                    {modelosDisp.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Versión</label>
                  <select 
                    className={inputClass} 
                    value={vehiculo.version}
                    onChange={e => setVehiculo(p => ({...p, version: e.target.value}))}
                    disabled={!vehiculo.modelo}
                  >
                    <option value="">Opcional</option>
                    {versionesDisp.map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Año *</label>
                  <select 
                    className={inputClass} 
                    value={vehiculo.año}
                    onChange={e => setVehiculo(p => ({...p, año: e.target.value}))}
                  >
                    <option value="">Año</option>
                    {AÑOS.map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Cobertura *</label>
                  <select 
                    className={inputClass} 
                    value={vehiculo.cobertura}
                    onChange={e => setVehiculo(p => ({...p, cobertura: e.target.value}))}
                  >
                    <option value="">Seleccionar</option>
                    {COBERTURAS_AUTO.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold transition shadow-lg flex items-center justify-center gap-2"
                  >
                    {loading ? '⏳' : '💬'} Cotizar
                  </button>
                </div>
              </div>
            )}

            {/* HOGAR */}
            {activeTab === 'hogar' && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <div>
                  <label className={labelClass}>Tipo inmueble *</label>
                  <select className={inputClass} value={hogar.tipo} onChange={e => setHogar({...hogar, tipo: e.target.value})}>
                    <option value="">Seleccionar</option>
                    {TIPOS_INMUEBLE.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Metros² *</label>
                  <input type="number" className={inputClass} placeholder="Ej: 80" value={hogar.metros} onChange={e => setHogar({...hogar, metros: e.target.value})} />
                </div>
                <div>
                  <label className={labelClass}>Zona/Barrio</label>
                  <input type="text" className={inputClass} placeholder="Ej: Centro" value={hogar.zona} onChange={e => setHogar({...hogar, zona: e.target.value})} />
                </div>
                <div>
                  <label className={labelClass}>Antigüedad</label>
                  <input type="text" className={inputClass} placeholder="Ej: 10 años" value={hogar.antiguedad} onChange={e => setHogar({...hogar, antiguedad: e.target.value})} />
                </div>
                <div>
                  <label className={labelClass}>Cobertura *</label>
                  <select className={inputClass} value={hogar.cobertura} onChange={e => setHogar({...hogar, cobertura: e.target.value})}>
                    <option value="">Seleccionar</option>
                    {COBERTURAS_HOGAR.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div className="flex items-end">
                  <button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold transition shadow-lg">
                    {loading ? '⏳' : '💬'} Cotizar
                  </button>
                </div>
              </div>
            )}

            {/* ART EMPRESAS */}
            {activeTab === 'art' && (
              <div className="space-y-4">
                <p className="text-white/80 text-sm text-center">📋 Datos del Formulario 931 AFIP</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  <div>
                    <label className={labelClass}>Razón Social *</label>
                    <input type="text" className={inputClass} placeholder="Empresa S.A." value={art.razonSocial} onChange={e => setArt({...art, razonSocial: e.target.value})} />
                  </div>
                  <div>
                    <label className={labelClass}>CUIT *</label>
                    <input type="text" className={inputClass} placeholder="30-12345678-9" value={art.cuit} onChange={e => setArt({...art, cuit: e.target.value})} />
                  </div>
                  <div>
                    <label className={labelClass}>Actividad (CIIU) *</label>
                    <select className={inputClass} value={art.actividad} onChange={e => setArt({...art, actividad: e.target.value})}>
                      <option value="">Seleccionar</option>
                      {ACTIVIDADES_CIIU.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Empleados *</label>
                    <input type="number" className={inputClass} placeholder="Ej: 15" value={art.empleados} onChange={e => setArt({...art, empleados: e.target.value})} />
                  </div>
                  <div>
                    <label className={labelClass}>Masa salarial $ *</label>
                    <input type="number" className={inputClass} placeholder="5000000" value={art.masaSalarial} onChange={e => setArt({...art, masaSalarial: e.target.value})} />
                  </div>
                  <div>
                    <label className={labelClass}>Provincia *</label>
                    <select className={inputClass} value={art.provincia} onChange={e => setArt({...art, provincia: e.target.value})}>
                      <option value="">Seleccionar</option>
                      {PROVINCIAS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex justify-center">
                  <button type="submit" disabled={loading} className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-bold transition shadow-lg">
                    {loading ? '⏳' : '💬'} Cotizar ART
                  </button>
                </div>
              </div>
            )}

            {/* COMERCIO */}
            {activeTab === 'comercio' && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
                <div>
                  <label className={labelClass}>Tipo comercio *</label>
                  <select className={inputClass} value={comercio.tipo} onChange={e => setComercio({...comercio, tipo: e.target.value})}>
                    <option value="">Seleccionar</option>
                    {TIPOS_COMERCIO.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Rubro *</label>
                  <select className={inputClass} value={comercio.rubro} onChange={e => setComercio({...comercio, rubro: e.target.value})}>
                    <option value="">Seleccionar</option>
                    {RUBROS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Superficie m² *</label>
                  <input type="number" className={inputClass} placeholder="Ej: 100" value={comercio.superficie} onChange={e => setComercio({...comercio, superficie: e.target.value})} />
                </div>
                <div>
                  <label className={labelClass}>Suma contenido $</label>
                  <input type="number" className={inputClass} placeholder="5000000" value={comercio.sumaContenido} onChange={e => setComercio({...comercio, sumaContenido: e.target.value})} />
                </div>
                <div>
                  <label className={labelClass}>Suma edificio $</label>
                  <input type="number" className={inputClass} placeholder="20000000" value={comercio.sumaEdificio} onChange={e => setComercio({...comercio, sumaEdificio: e.target.value})} />
                </div>
                <div>
                  <label className={labelClass}>Zona</label>
                  <input type="text" className={inputClass} placeholder="Ej: Centro" value={comercio.zona} onChange={e => setComercio({...comercio, zona: e.target.value})} />
                </div>
                <div className="flex items-end">
                  <button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold transition shadow-lg">
                    {loading ? '⏳' : '💬'} Cotizar
                  </button>
                </div>
              </div>
            )}

            {/* VIDA / SALUD */}
            {activeTab === 'vida' && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                <div>
                  <label className={labelClass}>Edad *</label>
                  <input type="number" className={inputClass} placeholder="Años" value={vida.edad} onChange={e => setVida({...vida, edad: e.target.value})} />
                </div>
                <div>
                  <label className={labelClass}>Tipo *</label>
                  <select className={inputClass} value={vida.tipo} onChange={e => setVida({...vida, tipo: e.target.value})}>
                    <option value="">Seleccionar</option>
                    {TIPOS_VIDA.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Fumador</label>
                  <select className={inputClass} value={vida.fumador} onChange={e => setVida({...vida, fumador: e.target.value})}>
                    <option value="">Seleccionar</option>
                    <option value="no">No</option>
                    <option value="si">Sí</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Monto</label>
                  <select className={inputClass} value={vida.monto} onChange={e => setVida({...vida, monto: e.target.value})}>
                    <option value="">Seleccionar</option>
                    <option value="5M">$5.000.000</option>
                    <option value="10M">$10.000.000</option>
                    <option value="20M">$20.000.000</option>
                    <option value="50M">$50.000.000</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold transition shadow-lg">
                    {loading ? '⏳' : '💬'} Cotizar
                  </button>
                </div>
              </div>
            )}

          </form>

          <p className="text-white/70 text-xs text-center mt-4">
            💬 Te contactamos por WhatsApp en menos de 2 minutos · Sin compromiso
          </p>
        </div>

        {/* Teléfono */}
        <div className="text-center mt-6">
          <p className="text-white/90">
            📞 O llamanos: <a href="tel:+5493416952259" className="text-yellow-300 font-bold hover:underline">341 695-2259</a>
          </p>
        </div>

        {/* Aseguradoras */}
        <div className="text-center mt-6">
          <p className="text-white/80 font-semibold mb-3">Trabajamos con las mejores aseguradoras</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['San Cristóbal', 'Nación Seguros', 'Mapfre', 'SMG Seguros'].map(a => (
              <span key={a} className="bg-white px-4 py-2 rounded-lg text-gray-800 font-medium text-sm shadow">{a}</span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
