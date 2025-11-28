import { useState, useEffect } from 'react';

// ============================================
// BASE DE DATOS ACARA - VEHÍCULOS ARGENTINA
// Actualizado: Noviembre 2025
// ============================================

const TIPOS_VEHICULO = [
  { value: 'auto', label: 'Auto' },
  { value: 'camioneta', label: 'Camioneta' },
  { value: 'moto', label: 'Moto' },
  { value: 'camion', label: 'Camión' }
];

const COBERTURAS_AUTO = [
  { value: 'rc', label: 'Responsabilidad Civil' },
  { value: 'terceros_completo', label: 'Terceros Completo' },
  { value: 'terceros_full', label: 'Terceros Full' },
  { value: 'todo_riesgo_franquicia', label: 'Todo Riesgo c/Franquicia' },
  { value: 'todo_riesgo', label: 'Todo Riesgo' }
];

// Base ACARA de marcas por tipo de vehículo
const MARCAS_POR_TIPO = {
  auto: [
    'ALFA ROMEO', 'AUDI', 'BMW', 'BYD', 'CHANGAN', 'CHERY', 'CHEVROLET', 
    'CHRYSLER', 'CITROEN', 'CUPRA', 'DS', 'FIAT', 'FORD', 'GEELY', 'GWM',
    'HAVAL', 'HONDA', 'HYUNDAI', 'JAC', 'JAGUAR', 'JEEP', 'JETOUR', 'KIA',
    'LAND ROVER', 'LEXUS', 'LINCOLN', 'MASERATI', 'MAZDA', 'MERCEDES-BENZ',
    'MG', 'MINI', 'MITSUBISHI', 'NISSAN', 'PEUGEOT', 'PORSCHE', 'RAM',
    'RENAULT', 'SEAT', 'SKODA', 'SSANGYONG', 'SUBARU', 'SUZUKI', 'TESLA',
    'TOYOTA', 'VOLKSWAGEN', 'VOLVO'
  ],
  camioneta: [
    'CHEVROLET', 'DODGE', 'FIAT', 'FORD', 'GWM', 'ISUZU', 'JAC', 'JEEP',
    'MAHINDRA', 'MAZDA', 'MERCEDES-BENZ', 'MITSUBISHI', 'NISSAN', 'RAM',
    'RENAULT', 'SSANGYONG', 'TOYOTA', 'VOLKSWAGEN'
  ],
  moto: [
    'APRILIA', 'BAJAJ', 'BENELLI', 'BETA', 'BMW', 'CF MOTO', 'CORVEN',
    'DUCATI', 'GILERA', 'HARLEY-DAVIDSON', 'HERO', 'HONDA', 'HUSQVARNA',
    'INDIAN', 'JAWA', 'KAWASAKI', 'KELLER', 'KTM', 'KYMCO', 'MOTOMEL',
    'MV AGUSTA', 'PIAGGIO', 'ROYAL ENFIELD', 'SUZUKI', 'SYM', 'TRIUMPH',
    'TVS', 'VOGE', 'YAMAHA', 'ZANELLA'
  ],
  camion: [
    'DAF', 'DEUTZ', 'FIAT', 'FOTON', 'FORD', 'FREIGHTLINER', 'HINO',
    'HYUNDAI', 'INTERNATIONAL', 'ISUZU', 'IVECO', 'JAC', 'JMC', 'KENWORTH',
    'MAN', 'MERCEDES-BENZ', 'PETERBILT', 'RENAULT', 'SCANIA', 'SHACMAN',
    'SINOTRUK', 'TATA', 'VOLKSWAGEN', 'VOLVO'
  ]
};

// Base ACARA de modelos por marca
const MODELOS_POR_MARCA = {
  // TOYOTA
  'TOYOTA': ['4Runner', 'Avalon', 'C-HR', 'Camry', 'Corolla', 'Corolla Cross', 'Etios', 'GR Supra', 'GR86', 'Hiace', 'Hilux', 'Land Cruiser', 'Land Cruiser Prado', 'Prius', 'RAV4', 'Supra', 'SW4', 'Tacoma', 'Yaris', 'Yaris Cross'],
  // FORD
  'FORD': ['Bronco', 'Bronco Sport', 'EcoSport', 'Edge', 'Escape', 'Explorer', 'F-150', 'Fiesta', 'Focus', 'Ka', 'Kuga', 'Maverick', 'Mondeo', 'Mustang', 'Puma', 'Ranger', 'Territory', 'Transit'],
  // VOLKSWAGEN  
  'VOLKSWAGEN': ['Amarok', 'Arteon', 'Bora', 'Caddy', 'Gol', 'Golf', 'ID.3', 'ID.4', 'ID.Buzz', 'Jetta', 'Nivus', 'Passat', 'Polo', 'Saveiro', 'Scirocco', 'T-Cross', 'Taos', 'Tiguan', 'Tiguan Allspace', 'Touareg', 'Up!', 'Vento', 'Virtus'],
  // CHEVROLET
  'CHEVROLET': ['Aveo', 'Blazer', 'Bolt', 'Camaro', 'Captiva', 'Colorado', 'Corvette', 'Cruze', 'Equinox', 'Joy', 'Malibu', 'Montana', 'Onix', 'Onix Plus', 'Orlando', 'S10', 'Silverado', 'Spin', 'Suburban', 'Tahoe', 'Tracker', 'Trailblazer', 'Traverse'],
  // FIAT
  'FIAT': ['500', '500L', '500X', 'Argo', 'Cronos', 'Doblo', 'Ducato', 'Fastback', 'Fiorino', 'Linea', 'Mobi', 'Palio', 'Pulse', 'Qubo', 'Siena', 'Strada', 'Toro', 'Tipo', 'Uno'],
  // RENAULT
  'RENAULT': ['Alaskan', 'Arkana', 'Captur', 'Clio', 'Duster', 'Fluence', 'Kangoo', 'Koleos', 'Kwid', 'Logan', 'Master', 'Megane', 'Oroch', 'Sandero', 'Sandero Stepway', 'Scenic', 'Symbol', 'Talisman', 'Trafic', 'Twingo', 'Zoe'],
  // PEUGEOT
  'PEUGEOT': ['108', '2008', '208', '3008', '301', '308', '408', '5008', '508', 'Boxer', 'Expert', 'Partner', 'Rifter', 'Traveller'],
  // HONDA
  'HONDA': ['Accord', 'BR-V', 'City', 'Civic', 'CR-V', 'Fit', 'HR-V', 'Insight', 'Odyssey', 'Passport', 'Pilot', 'Ridgeline', 'WR-V'],
  // HYUNDAI
  'HYUNDAI': ['Accent', 'Azera', 'Creta', 'Elantra', 'Genesis', 'Grand Santa Fe', 'HB20', 'i10', 'i20', 'i30', 'Ioniq', 'Ioniq 5', 'Ioniq 6', 'Kona', 'Palisade', 'Santa Cruz', 'Santa Fe', 'Sonata', 'Starex', 'Staria', 'Tucson', 'Veloster', 'Venue'],
  // NISSAN
  'NISSAN': ['370Z', 'Altima', 'Ariya', 'Frontier', 'Juke', 'Kicks', 'Leaf', 'March', 'Maxima', 'Murano', 'Navara', 'Note', 'NP300', 'Pathfinder', 'Qashqai', 'Rogue', 'Sentra', 'Tiida', 'Titan', 'Versa', 'X-Trail', 'Z'],
  // JEEP
  'JEEP': ['Cherokee', 'Commander', 'Compass', 'Gladiator', 'Grand Cherokee', 'Grand Commander', 'Grand Wagoneer', 'Patriot', 'Renegade', 'Wagoneer', 'Wrangler'],
  // BMW
  'BMW': ['i3', 'i4', 'i5', 'i7', 'i8', 'iX', 'iX1', 'iX3', 'M2', 'M3', 'M4', 'M5', 'M8', 'Serie 1', 'Serie 2', 'Serie 2 Active Tourer', 'Serie 2 Gran Coupe', 'Serie 3', 'Serie 4', 'Serie 4 Gran Coupe', 'Serie 5', 'Serie 6', 'Serie 7', 'Serie 8', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'XM', 'Z4'],
  // MERCEDES-BENZ
  'MERCEDES-BENZ': ['A 200', 'A 250', 'A 35 AMG', 'A 45 AMG', 'AMG GT', 'B 200', 'C 180', 'C 200', 'C 300', 'C 43 AMG', 'C 63 AMG', 'CLA 200', 'CLA 250', 'CLA 35 AMG', 'CLA 45 AMG', 'CLS', 'E 200', 'E 300', 'E 350', 'E 400', 'E 53 AMG', 'E 63 AMG', 'EQA', 'EQB', 'EQC', 'EQE', 'EQS', 'G 500', 'G 63 AMG', 'GLA 200', 'GLA 250', 'GLA 35 AMG', 'GLA 45 AMG', 'GLB 200', 'GLB 250', 'GLC 200', 'GLC 300', 'GLC 43 AMG', 'GLC 63 AMG', 'GLE 300d', 'GLE 350', 'GLE 450', 'GLE 53 AMG', 'GLE 63 AMG', 'GLS 450', 'GLS 580', 'GLS 63 AMG', 'Maybach', 'S 400', 'S 500', 'S 580', 'S 63 AMG', 'SL', 'SLC', 'Sprinter', 'Vito'],
  // AUDI
  'AUDI': ['A1', 'A3', 'A4', 'A5', 'A5 Sportback', 'A6', 'A7', 'A8', 'e-tron', 'e-tron GT', 'Q2', 'Q3', 'Q4 e-tron', 'Q5', 'Q7', 'Q8', 'Q8 e-tron', 'R8', 'RS3', 'RS4', 'RS5', 'RS6', 'RS7', 'RSQ3', 'RSQ8', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'SQ5', 'SQ7', 'SQ8', 'TT'],
  // KIA
  'KIA': ['Carnival', 'Cerato', 'EV6', 'EV9', 'Niro', 'Optima', 'Picanto', 'Rio', 'Seltos', 'Sorento', 'Soul', 'Sportage', 'Stinger', 'Stonic', 'Telluride'],
  // CHERY
  'CHERY': ['Arrizo 5', 'Arrizo 6', 'Omoda 5', 'Tiggo 2', 'Tiggo 3', 'Tiggo 4', 'Tiggo 5', 'Tiggo 7', 'Tiggo 8'],
  // BYD
  'BYD': ['Atto 3', 'Dolphin', 'Han', 'Seal', 'Song Plus', 'Tang', 'Yuan Plus'],
  // HAVAL
  'HAVAL': ['Dargo', 'H6', 'Jolion'],
  // GWM
  'GWM': ['Ora 03', 'Poer', 'Tank 300', 'Tank 500', 'Wingle 7'],
  // MG
  'MG': ['3', '5', 'EHS', 'HS', 'MG4', 'ZS', 'ZS EV'],
  // RAM
  'RAM': ['1500', '2500', '3500', '700', 'ProMaster'],
  // ALFA ROMEO
  'ALFA ROMEO': ['4C', 'Giulia', 'Giulietta', 'MiTo', 'Stelvio', 'Tonale'],
  // SSANGYONG
  'SSANGYONG': ['Actyon', 'Korando', 'Musso', 'Rexton', 'Tivoli', 'Torres', 'XLV'],
  // SUBARU
  'SUBARU': ['BRZ', 'Crosstrek', 'Forester', 'Impreza', 'Legacy', 'Levorg', 'Outback', 'Solterra', 'WRX', 'XV'],
  // MAZDA
  'MAZDA': ['2', '3', '6', 'CX-3', 'CX-30', 'CX-5', 'CX-50', 'CX-9', 'CX-90', 'MX-30', 'MX-5'],
  // MITSUBISHI
  'MITSUBISHI': ['ASX', 'Eclipse Cross', 'L200', 'Montero', 'Outlander', 'Pajero', 'Xpander'],
  // CITROEN
  'CITROEN': ['Berlingo', 'C3', 'C3 Aircross', 'C4', 'C4 Cactus', 'C4 Lounge', 'C5 Aircross', 'C5 X', 'Jumper', 'Jumpy', 'SpaceTourer'],
  // CUPRA
  'CUPRA': ['Ateca', 'Born', 'Formentor', 'Leon', 'Tavascan'],
  // DS
  'DS': ['3', '4', '7', '9'],
  // LAND ROVER
  'LAND ROVER': ['Defender', 'Discovery', 'Discovery Sport', 'Range Rover', 'Range Rover Evoque', 'Range Rover Sport', 'Range Rover Velar'],
  // JAGUAR
  'JAGUAR': ['E-Pace', 'F-Pace', 'F-Type', 'I-Pace', 'XE', 'XF', 'XJ'],
  // PORSCHE
  'PORSCHE': ['718 Boxster', '718 Cayman', '911', 'Cayenne', 'Macan', 'Panamera', 'Taycan'],
  // LEXUS
  'LEXUS': ['ES', 'GX', 'IS', 'LC', 'LS', 'LX', 'NX', 'RC', 'RX', 'RZ', 'UX'],
  // SUZUKI
  'SUZUKI': ['Alto', 'Baleno', 'Celerio', 'Ciaz', 'Ertiga', 'Grand Vitara', 'Ignis', 'Jimny', 'S-Cross', 'Swift', 'Vitara', 'XL7'],
  // MINI
  'MINI': ['3 Puertas', '5 Puertas', 'Cabrio', 'Clubman', 'Countryman', 'Electric'],
  // VOLVO
  'VOLVO': ['C40', 'S60', 'S90', 'V40', 'V60', 'V90', 'XC40', 'XC60', 'XC90'],
  // TESLA
  'TESLA': ['Model 3', 'Model S', 'Model X', 'Model Y', 'Cybertruck'],
  // ISUZU
  'ISUZU': ['D-Max', 'MU-X', 'NHR', 'NKR', 'NLR', 'NPR', 'NQR'],
  // Motos principales
  'HONDA_MOTO': ['Africa Twin', 'CB 125F', 'CB 190R', 'CB 250', 'CB 300R', 'CB 500F', 'CB 500X', 'CB 650R', 'CB 1000R', 'CBR 250RR', 'CBR 500R', 'CBR 600RR', 'CBR 1000RR', 'CRF 150', 'CRF 250', 'CRF 300L', 'CRF 450', 'CRF 1100', 'Forza 350', 'GL 1800 Gold Wing', 'NC 750X', 'PCX 150', 'Rebel 500', 'Wave 110', 'XR 150', 'XR 190', 'XRE 300'],
  'YAMAHA': ['Crypton 110', 'FZ 150', 'FZ 250', 'FZ 25', 'FZ-S 150', 'FZ6', 'FZ8', 'FZ-09', 'MT-03', 'MT-07', 'MT-09', 'MT-10', 'NMAX 155', 'R1', 'R15', 'R3', 'R6', 'R7', 'Ray ZR', 'Tenere 700', 'Tracer 9 GT', 'Tricity', 'XJ6', 'XMax 300', 'XSR 700', 'XSR 900', 'XTZ 125', 'XTZ 150', 'XTZ 250', 'YBR 125', 'YZF-R1', 'YZF-R3'],
  'KAWASAKI': ['ER-6N', 'KLR 650', 'KX 250', 'KX 450', 'Ninja 250', 'Ninja 300', 'Ninja 400', 'Ninja 650', 'Ninja ZX-6R', 'Ninja ZX-10R', 'Ninja H2', 'Versys 650', 'Versys 1000', 'Vulcan S', 'Z400', 'Z650', 'Z900', 'Z H2', 'ZX-4R'],
  'SUZUKI_MOTO': ['Address', 'Burgman', 'DR 650', 'Gixxer 150', 'Gixxer 250', 'GSX 150', 'GSX-R 600', 'GSX-R 750', 'GSX-R 1000', 'GSX-S 750', 'GSX-S 1000', 'Hayabusa', 'Intruder', 'SV 650', 'V-Strom 250', 'V-Strom 650', 'V-Strom 1050'],
  'KTM': ['125 Duke', '200 Duke', '250 Adventure', '250 Duke', '390 Adventure', '390 Duke', '690 Enduro', '790 Adventure', '790 Duke', '890 Adventure', '890 Duke', '1290 Super Adventure', '1290 Super Duke'],
  'BMW_MOTO': ['C 400 GT', 'C 400 X', 'F 750 GS', 'F 850 GS', 'F 900 R', 'F 900 XR', 'G 310 GS', 'G 310 R', 'K 1600 GTL', 'R 1250 GS', 'R 1250 GS Adventure', 'R 1250 R', 'R 1250 RS', 'R 1250 RT', 'R 1300 GS', 'R NineT', 'S 1000 R', 'S 1000 RR', 'S 1000 XR'],
  'DUCATI': ['Diavel', 'Hypermotard', 'Monster', 'Multistrada V4', 'Panigale V2', 'Panigale V4', 'Scrambler', 'Streetfighter V4', 'SuperSport', 'XDiavel'],
  'HARLEY-DAVIDSON': ['Breakout', 'Fat Bob', 'Fat Boy', 'Forty-Eight', 'Heritage Classic', 'Iron 883', 'LiveWire', 'Low Rider', 'Nightster', 'Pan America', 'Road Glide', 'Road King', 'Softail', 'Sport Glide', 'Sportster S', 'Street Glide', 'Street Rod', 'Ultra Limited'],
  'TRIUMPH': ['Bonneville', 'Daytona', 'Rocket 3', 'Scrambler', 'Speed Triple', 'Speed Twin', 'Street Triple', 'Thruxton', 'Tiger 900', 'Tiger 1200', 'Trident 660'],
  'BENELLI': ['180S', '302R', '302S', 'BN 302', 'Imperiale 400', 'Leoncino 250', 'Leoncino 500', 'TNT 135', 'TNT 300', 'TNT 600', 'TRK 251', 'TRK 502', 'TRK 502X', 'TRK 702'],
  'ROYAL ENFIELD': ['Bullet 350', 'Classic 350', 'Continental GT 650', 'Himalayan', 'Hunter 350', 'Interceptor 650', 'Meteor 350', 'Scram 411', 'Super Meteor 650'],
  'BAJAJ': ['Boxer 150', 'CT 100', 'Discover 125', 'Dominar 250', 'Dominar 400', 'NS 125', 'NS 160', 'NS 200', 'Platina', 'Pulsar 135', 'Pulsar 150', 'Pulsar 180', 'Pulsar 200', 'Pulsar NS 200', 'Pulsar RS 200', 'Rouser NS 200'],
  'MOTOMEL': ['Blitz 110', 'CG 150', 'Cuatri', 'DLX 110', 'Max 110', 'S2', 'S3', 'Sirius 150', 'Sirius 200', 'Skua 150', 'Skua 200', 'Skua 250', 'Strato 150', 'TCP 200'],
  'ZANELLA': ['Ceccato 150', 'Ceccato 200', 'Cruiser 150', 'Fun 110', 'Hot 90', 'MOD 150', 'Patagonian Eagle 150', 'Patagonian Eagle 250', 'RX 150', 'RX 200', 'RZ 25', 'Sapucai 125', 'Sapucai 150', 'Sapucai 200', 'Styler 150', 'ZB 110', 'ZR 150', 'ZR 200', 'ZR 250', 'ZTT 250'],
  'CORVEN': ['Energy 110', 'Expert 80', 'Hunter 150', 'Indiana 256', 'Mirage 110', 'Touring 250', 'Triax 150', 'Triax 200', 'Triax 250']
};

// ============================================
// VERSIONES ACARA POR MARCA/MODELO
// ============================================

const VERSIONES_ACARA = {
  'TOYOTA_Hilux': ["2.4 TD DX 4x2 C/S MT", "2.4 TD DX 4x2 C/D MT", "2.4 TD DX 4x4 C/D MT", "2.8 TDI SR 4x2 MT", "2.8 TDI SR 4x2 AT", "2.8 TDI SR 4x4 MT", "2.8 TDI SR 4x4 AT", "2.8 TDI SRV 4x2 AT", "2.8 TDI SRV 4x4 MT", "2.8 TDI SRV 4x4 AT", "2.8 TDI SRX 4x4 AT", "2.8 TDI GR-S 4x4 AT", "2.8 TDI Limited 4x4 AT", "4.0 V6 SR 4x4 AT", "4.0 V6 SRX 4x4 AT"],
  'TOYOTA_Corolla': ["2.0 XLI MT (170cv)", "2.0 XLI CVT (170cv)", "2.0 XEI MT (170cv)", "2.0 XEI CVT (170cv)", "2.0 SEG CVT (170cv)", "2.0 SEG Hybrid CVT", "2.0 GR-S CVT (170cv)", "2.0 GR-S Hybrid CVT", "1.8 XLI MT (140cv)", "1.8 XLI CVT (140cv)", "1.8 XEI CVT (140cv)", "1.8 SEG CVT (140cv)"],
  'TOYOTA_Corolla Cross': ["2.0 XLI CVT (170cv)", "2.0 XEI CVT (170cv)", "2.0 SEG CVT (170cv)", "1.8 XEI Hybrid CVT", "1.8 SEG Hybrid CVT", "2.0 GR-S CVT"],
  'TOYOTA_Yaris': ["1.5 XS MT (107cv)", "1.5 XS CVT (107cv)", "1.5 XLS CVT (107cv)", "1.5 XLS Pack CVT", "1.5 S CVT (107cv)"],
  'TOYOTA_Yaris Cross': ["1.5 XS CVT", "1.5 XLS CVT", "1.5 XLS Pack CVT", "1.5 S CVT", "1.5 Limited CVT"],
  'TOYOTA_Etios': ["1.5 X 5P MT (105cv)", "1.5 XS 5P MT (105cv)", "1.5 XLS 5P MT (105cv)", "1.5 X 4P MT (105cv)", "1.5 XS 4P MT (105cv)", "1.5 XLS 4P AT (105cv)", "1.5 Cross 5P MT"],
  'TOYOTA_SW4': ["2.8 TDI SR 4x2 AT", "2.8 TDI SR 4x4 AT", "2.8 TDI SRX 4x4 AT", "2.8 TDI Diamond 4x4 AT", "2.8 TDI GR-S 4x4 AT", "4.0 V6 SRX 4x4 AT"],
  'TOYOTA_RAV4': ["2.0 CVT AWD (175cv)", "2.5 XLE CVT FWD", "2.5 Limited CVT AWD", "2.5 Adventure AWD", "2.5 Hybrid XLE eCVT", "2.5 Hybrid Limited eCVT"],
  'TOYOTA_Camry': ["3.5 XLE V6 AT (301cv)", "2.5 Hybrid eCVT"],
  'TOYOTA_Land Cruiser': ["4.5 TD VX AT", "4.5 TD VX-R AT", "3.3 TD GR-S AT"],
  'TOYOTA_Land Cruiser Prado': ["2.8 TD TX AT", "2.8 TD TX-L AT", "2.8 TD VX AT", "4.0 V6 VX AT"],
  'FORD_Ranger': ["2.0 Bi-TD XL 4x2 C/S MT", "2.0 Bi-TD XL 4x2 C/D MT", "2.0 Bi-TD XL 4x4 C/D MT", "2.0 Bi-TD XLS 4x2 MT", "2.0 Bi-TD XLS 4x2 AT", "2.0 Bi-TD XLS 4x4 MT", "2.0 Bi-TD XLS 4x4 AT", "2.0 Bi-TD XLT 4x2 AT", "2.0 Bi-TD XLT 4x4 AT", "2.0 Bi-TD Limited 4x2 AT", "2.0 Bi-TD Limited 4x4 AT", "2.0 Bi-TD Wildtrak 4x4 AT", "3.0 V6 TD Raptor 4x4 AT", "3.2 TDCI XL 4x2 MT", "3.2 TDCI XL 4x4 MT", "3.2 TDCI XLS 4x4 AT", "3.2 TDCI XLT 4x4 AT", "3.2 TDCI Limited 4x4 AT", "3.2 TDCI Wildtrak 4x4 AT"],
  'FORD_Territory': ["1.5T SEL CVT (143cv)", "1.5T Titanium CVT (143cv)", "1.5T Titanium+ CVT", "1.8T SEL AT7 (190cv)", "1.8T Titanium AT7"],
  'FORD_Bronco Sport': ["1.5T Big Bend AT8", "1.5T Outer Banks AT8", "2.0T Badlands AT8", "2.0T Wildtrak AT8"],
  'FORD_Bronco': ["2.3T Base MT", "2.3T Big Bend AT", "2.3T Outer Banks AT", "2.7T V6 Badlands AT", "2.7T V6 Wildtrak AT"],
  'FORD_Explorer': ["3.0T V6 ST-Line AT 4x4", "3.0T V6 Limited AT 4x4", "3.0T V6 Platinum AT 4x4"],
  'FORD_Maverick': ["2.5 Hybrid XL eCVT", "2.0T Lariat AT AWD"],
  'FORD_F-150': ["3.5T V6 XL 4x2 AT", "3.5T V6 XLT 4x4 AT", "3.5T V6 Lariat 4x4 AT", "3.5T V6 Platinum 4x4 AT", "3.5T V6 Raptor 4x4 AT", "5.0 V8 Platinum 4x4 AT"],
  'FORD_EcoSport': ["1.5 S MT (123cv)", "1.5 SE MT (123cv)", "1.5 SE AT (123cv)", "1.5 Titanium AT (123cv)", "2.0 Storm 4x4 AT (170cv)"],
  'FORD_Ka': ["1.5 S MT", "1.5 SE MT", "1.5 SE AT", "1.5 SEL MT", "1.5 SEL AT", "1.5 Freestyle AT"],
  'FORD_Focus': ["1.6 S MT", "2.0 SE MT", "2.0 SE AT", "2.0 Titanium MT", "2.0 Titanium AT", "2.0 ST MT", "2.3T RS MT AWD"],
  'FORD_Mustang': ["2.3T EcoBoost AT", "5.0 V8 GT AT", "5.0 V8 Mach 1 MT", "5.2 V8 Shelby GT500"],
  'VOLKSWAGEN_Amarok': ["2.0 TDI Trendline 4x2 MT", "2.0 TDI Trendline 4x4 MT", "2.0 TDI Comfortline 4x2 AT", "2.0 TDI Comfortline 4x4 AT", "2.0 TDI Highline 4x2 AT", "2.0 TDI Highline 4x4 AT", "2.0 Bi-TDI Extreme 4x4 AT", "3.0 V6 TDI Comfortline 4x4 AT", "3.0 V6 TDI Highline 4x4 AT", "3.0 V6 TDI Extreme 4x4 AT", "3.0 V6 TDI Black Style 4x4 AT"],
  'VOLKSWAGEN_Taos': ["1.4 TSI Trendline MT", "1.4 TSI Comfortline AT", "1.4 TSI Highline AT", "1.4 TSI Hero AT"],
  'VOLKSWAGEN_T-Cross': ["1.6 MSI Trendline MT", "1.6 MSI Trendline AT", "1.6 MSI Comfortline AT", "1.4 TSI Highline AT", "1.4 TSI Hero AT"],
  'VOLKSWAGEN_Tiguan': ["1.4 TSI Trendline", "1.4 TSI Comfortline", "1.4 TSI Highline", "2.0 TSI R-Line", "2.0 TSI R-Line 4Motion"],
  'VOLKSWAGEN_Tiguan Allspace': ["1.4 TSI Trendline", "1.4 TSI Comfortline", "2.0 TSI Highline 4Motion", "2.0 TSI R-Line 4Motion"],
  'VOLKSWAGEN_Polo': ["1.6 MSI Track MT", "1.6 MSI Trendline MT", "1.6 MSI Comfortline MT", "1.6 MSI Comfortline AT", "1.0 TSI Comfortline AT", "1.0 TSI Highline AT", "1.4 TSI GTS AT"],
  'VOLKSWAGEN_Virtus': ["1.6 MSI Trendline MT", "1.6 MSI Comfortline MT", "1.6 MSI Comfortline AT", "1.0 TSI Comfortline AT", "1.0 TSI Highline AT", "1.4 TSI GTS AT"],
  'VOLKSWAGEN_Nivus': ["1.0 TSI Comfortline AT", "1.0 TSI Highline AT", "1.0 TSI Hero AT"],
  'VOLKSWAGEN_Golf': ["1.4 TSI Comfortline", "1.4 TSI Highline", "2.0 TSI GTI MT", "2.0 TSI GTI DSG", "2.0 TSI R 4Motion"],
  'VOLKSWAGEN_Vento': ["1.4 TSI Comfortline AT", "1.4 TSI Highline AT", "2.0 TSI GLI AT"],
  'VOLKSWAGEN_Saveiro': ["1.6 MSI Trendline C/S", "1.6 MSI Trendline C/D", "1.6 MSI Comfortline C/S", "1.6 MSI Comfortline C/D", "1.6 MSI Cross C/S", "1.6 MSI Cross C/D"],
  'CHEVROLET_S10': ["2.8 TD LS 4x2 C/S MT", "2.8 TD LS 4x2 C/D MT", "2.8 TD LS 4x4 C/D MT", "2.8 TD LT 4x2 MT", "2.8 TD LT 4x2 AT", "2.8 TD LT 4x4 MT", "2.8 TD LT 4x4 AT", "2.8 TD LTZ 4x4 AT", "2.8 TD High Country 4x4 AT", "2.8 TD Z71 4x4 AT"],
  'CHEVROLET_Montana': ["1.2T LS MT", "1.2T LT MT", "1.2T LT AT", "1.2T LTZ AT", "1.2T Premier AT"],
  'CHEVROLET_Tracker': ["1.2T LT MT", "1.2T LT AT", "1.2T LTZ AT", "1.2T Premier AT", "1.2T RS AT", "1.2T Midnight AT"],
  'CHEVROLET_Onix': ["1.2 MT LS", "1.2 MT LT", "1.2 AT LT", "1.0T MT LT", "1.0T AT LT", "1.0T AT LTZ", "1.0T AT Premier", "1.0T AT RS", "1.0T AT Midnight"],
  'CHEVROLET_Onix Plus': ["1.2 MT Joy", "1.0T MT LT", "1.0T AT LT", "1.0T AT LTZ", "1.0T AT Premier"],
  'CHEVROLET_Cruze': ["1.4T LT MT", "1.4T LT AT", "1.4T LTZ MT", "1.4T LTZ AT", "1.4T Premier AT", "1.4T RS AT", "1.4T Midnight AT"],
  'CHEVROLET_Spin': ["1.8 LT MT 5 Asientos", "1.8 LT MT 7 Asientos", "1.8 LTZ MT 5 Asientos", "1.8 LTZ MT 7 Asientos", "1.8 Premier AT 5 Asientos", "1.8 Premier AT 7 Asientos", "1.8 Activ AT"],
  'CHEVROLET_Equinox': ["1.5T LS AT FWD", "1.5T LT AT FWD", "1.5T Premier AT FWD", "1.5T RS AT AWD"],
  'FIAT_Cronos': ["1.3 GSE Like MT", "1.3 GSE Drive MT", "1.3 GSE Drive CVT", "1.3 GSE Drive Pack MT", "1.8 E.TorQ Precision MT", "1.8 E.TorQ Precision AT", "1.0T Impetus CVT"],
  'FIAT_Argo': ["1.3 Drive MT", "1.3 Drive Pack MT", "1.8 Precision MT", "1.8 Precision AT", "1.3 Trekking MT", "1.8 Trekking AT", "1.8 HGT MT"],
  'FIAT_Pulse': ["1.3 Drive MT", "1.3 Drive CVT", "1.0T Audace CVT", "1.0T Impetus CVT", "1.3T Abarth AT"],
  'FIAT_Fastback': ["1.0T Audace CVT", "1.0T Impetus CVT", "1.0T Limited CVT", "1.3T Abarth AT"],
  'FIAT_Strada': ["1.4 Endurance C/S", "1.3 Freedom C/S", "1.3 Freedom C/D", "1.3 Volcano C/D", "1.3T Volcano CVT C/D", "1.3T Ranch CVT C/D", "1.0T Ultra CVT C/D"],
  'FIAT_Toro': ["1.3T Endurance MT 4x2", "1.3T Freedom AT 4x2", "1.3T Volcano AT 4x2", "2.0 TD Freedom AT 4x4", "2.0 TD Volcano AT 4x4", "2.0 TD Ranch AT 4x4", "2.0 TD Ultra AT 4x4"],
  'FIAT_Mobi': ["1.0 Like", "1.0 Trekking", "1.0 Way"],
  'RENAULT_Sandero': ["1.6 Life MT", "1.6 Zen MT", "1.6 Intens MT", "1.6 Intens CVT"],
  'RENAULT_Sandero Stepway': ["1.6 Zen MT", "1.6 Intens MT", "1.6 Intens CVT"],
  'RENAULT_Logan': ["1.6 Life MT", "1.6 Zen MT", "1.6 Intens MT"],
  'RENAULT_Duster': ["1.6 Zen MT 4x2", "1.6 Intens MT 4x2", "1.3T Iconic CVT 4x2", "1.3T Outsider CVT 4x4"],
  'RENAULT_Captur': ["1.6 Zen CVT", "1.3T Intens CVT", "1.3T Iconic CVT"],
  'RENAULT_Koleos': ["2.5 Zen CVT 4x2", "2.5 Intens CVT 4x2", "2.5 Iconic CVT 4x4"],
  'RENAULT_Arkana': ["1.3T Zen CVT", "1.3T Intens CVT", "1.3T Iconic CVT", "1.3T RS Line CVT", "1.6 E-Tech Hybrid Intens", "1.6 E-Tech Hybrid Iconic"],
  'RENAULT_Kwid': ["1.0 Life MT", "1.0 Zen MT", "1.0 Intens MT", "1.0 Outsider MT"],
  'RENAULT_Alaskan': ["2.3 TD Confort MT 4x2", "2.3 TD Confort MT 4x4", "2.3 TD Intens MT 4x4", "2.3 TD Iconic AT 4x4"],
  'RENAULT_Kangoo': ["1.5 dCi Confort", "1.5 dCi Stepway"],
  'PEUGEOT_208': ["1.2 Like MT", "1.2 Active MT", "1.2 Active Pack MT", "1.6 Allure MT", "1.6 Allure AT", "1.6 Feline MT", "1.6 Feline AT", "1.6 THP GT AT"],
  'PEUGEOT_2008': ["1.6 Active MT", "1.6 Active Pack MT", "1.6 Allure MT", "1.6 Allure AT", "1.6 Feline AT", "1.6 THP GT AT"],
  'PEUGEOT_308': ["1.6 Active MT", "1.6 Allure MT", "1.6 Allure Pack AT", "1.6 THP Feline AT", "1.6 THP GT AT"],
  'PEUGEOT_3008': ["1.6 THP Active AT", "1.6 THP Allure AT", "1.6 THP Allure Pack AT", "1.6 THP GT AT", "1.6 THP GT Pack AT", "1.6 Hybrid4 GT AT"],
  'PEUGEOT_408': ["1.6 THP Allure AT", "1.6 THP Allure Pack AT", "1.6 THP GT AT"],
  'PEUGEOT_5008': ["1.6 THP Allure AT", "1.6 THP Allure Pack AT", "1.6 THP GT AT"],
  'PEUGEOT_Partner': ["1.6 Confort MT", "1.6 Furgón MT", "HDI Patagonica MT"],
  'HONDA_HR-V': ["1.8 LX CVT", "1.8 EX CVT", "1.8 EXL CVT", "1.5T Touring CVT"],
  'HONDA_CR-V': ["1.5T LX CVT", "1.5T EX CVT", "1.5T EXL CVT", "1.5T Touring CVT AWD"],
  'HONDA_WR-V': ["1.5 LX MT", "1.5 LX CVT", "1.5 EX CVT", "1.5 EXL CVT"],
  'HONDA_Civic': ["2.0 LX MT", "2.0 LX CVT", "2.0 EX CVT", "2.0 EXL CVT", "1.5T Si MT", "2.0T Type R MT"],
  'HONDA_City': ["1.5 LX MT", "1.5 LX CVT", "1.5 EX CVT", "1.5 EXL CVT"],
  'HONDA_Accord': ["2.0T EX CVT", "2.0T EXL CVT", "2.0T Touring CVT", "2.0 Hybrid"],
  'HYUNDAI_Tucson': ["2.0 Comfort MT", "2.0 Premium AT", "2.0 Style AT", "1.6T N Line AT", "2.0 Limited AT"],
  'HYUNDAI_Creta': ["1.6 Comfort MT", "1.6 Premium AT", "1.6 Limited AT", "1.0T Ultimate AT"],
  'HYUNDAI_Santa Fe': ["2.4 Style AT", "2.4 Premium AT", "2.5T N Line AT", "2.5T Limited AT"],
  'HYUNDAI_HB20': ["1.0 Comfort MT", "1.0 Style MT", "1.0 Premium AT"],
  'HYUNDAI_Kona': ["2.0 Comfort AT", "2.0 Premium AT", "1.6T Ultimate AT", "2.0T N AT", "Electric"],
  'HYUNDAI_Venue': ["1.6 Style MT", "1.6 Premium AT"],
  'HYUNDAI_Ioniq 5': ["Standard Range RWD", "Long Range RWD", "Long Range AWD"],
  'HYUNDAI_Elantra': ["2.0 Comfort MT", "2.0 Premium AT", "2.0T N AT"],
  'NISSAN_Frontier': ["2.3 TD S 4x2 MT", "2.3 TD SE 4x4 MT", "2.3 TD XE 4x4 MT", "2.3 TD XE 4x4 AT", "2.3 TD LE 4x4 AT", "2.3 TD Attack 4x4 AT", "2.3 TD Pro-4X 4x4 AT"],
  'NISSAN_Kicks': ["1.6 Sense CVT", "1.6 Advance CVT", "1.6 Exclusive CVT", "1.2 e-Power Advance"],
  'NISSAN_Sentra': ["2.0 Sense CVT", "2.0 Advance CVT", "2.0 Exclusive CVT", "2.0 SR CVT"],
  'NISSAN_Versa': ["1.6 Sense MT", "1.6 Sense CVT", "1.6 Advance CVT", "1.6 Exclusive CVT"],
  'NISSAN_X-Trail': ["2.5 Sense CVT", "2.5 Advance CVT", "2.5 Exclusive CVT", "1.5 e-Power Advance"],
  'JEEP_Renegade': ["1.8 Sport MT", "1.8 Sport AT", "1.8 Longitude AT", "1.3T Longitude AT", "1.3T Limited AT", "1.3T Trailhawk AT 4x4"],
  'JEEP_Compass': ["1.3T Sport MT", "1.3T Sport AT", "1.3T Longitude AT", "1.3T Limited AT", "1.3T Limited AT 4x4", "1.3T Trailhawk AT 4x4", "1.3T 4xe PHEV"],
  'JEEP_Commander': ["1.3T Limited AT", "1.3T Limited AT 4x4", "2.0 TD Overland AT 4x4"],
  'JEEP_Grand Cherokee': ["3.6 V6 Laredo AT", "3.6 V6 Limited AT", "3.6 V6 Overland AT", "5.7 V8 Summit AT", "6.4 V8 SRT AT", "6.2 V8 SC Trackhawk AT", "4xe PHEV"],
  'JEEP_Wrangler': ["3.6 V6 Sport AT", "3.6 V6 Sahara AT", "3.6 V6 Rubicon AT", "6.4 V8 Rubicon 392 AT", "2.0T 4xe PHEV"],
  'JEEP_Gladiator': ["3.6 V6 Sport AT", "3.6 V6 Overland AT", "3.6 V6 Rubicon AT"],
  'BMW_Serie 1': ["118i Sport Line", "120i M Sport", "128ti", "M135i xDrive"],
  'BMW_Serie 2 Gran Coupe': ["218i", "220i M Sport", "M235i xDrive"],
  'BMW_Serie 3': ["318i", "320i", "320i M Sport", "330i", "330i M Sport", "330e PHEV", "M340i", "M340i xDrive"],
  'BMW_Serie 4 Coupe': ["420i", "430i", "430i M Sport", "M440i xDrive"],
  'BMW_Serie 5': ["520i", "530i", "530i M Sport", "540i", "545e PHEV", "M550i xDrive"],
  'BMW_X1': ["sDrive18i", "sDrive20i", "xDrive25i", "xDrive25e PHEV"],
  'BMW_X2': ["sDrive18i", "sDrive20i", "xDrive25i", "M35i"],
  'BMW_X3': ["sDrive20i", "xDrive20i", "xDrive30i", "xDrive30e PHEV", "M40i", "M Competition"],
  'BMW_X4': ["xDrive20i", "xDrive30i", "M40i", "M Competition"],
  'BMW_X5': ["xDrive40i", "xDrive45e PHEV", "xDrive50i", "M50i", "M Competition"],
  'BMW_X6': ["xDrive40i", "M50i", "M Competition"],
  'BMW_X7': ["xDrive40i", "xDrive50i", "M60i xDrive"],
  'BMW_Z4': ["sDrive20i", "sDrive30i", "M40i"],
  'BMW_i4': ["eDrive35", "eDrive40", "M50"],
  'BMW_iX': ["xDrive40", "xDrive50", "M60"],
  'MERCEDES-BENZ_A 200': ["Progressive", "AMG Line"],
  'MERCEDES-BENZ_A 250': ["AMG Line"],
  'MERCEDES-BENZ_A 35 AMG': ["4Matic"],
  'MERCEDES-BENZ_A 45 AMG': ["S 4Matic+"],
  'MERCEDES-BENZ_C 200': ["Avantgarde", "AMG Line"],
  'MERCEDES-BENZ_C 300': ["AMG Line"],
  'MERCEDES-BENZ_C 43 AMG': ["4Matic"],
  'MERCEDES-BENZ_CLA 200': ["Progressive", "AMG Line"],
  'MERCEDES-BENZ_CLA 250': ["AMG Line"],
  'MERCEDES-BENZ_CLA 35 AMG': ["4Matic"],
  'MERCEDES-BENZ_CLA 45 AMG': ["S 4Matic+"],
  'MERCEDES-BENZ_GLA 200': ["Progressive", "AMG Line"],
  'MERCEDES-BENZ_GLA 250': ["4Matic AMG Line"],
  'MERCEDES-BENZ_GLA 35 AMG': ["4Matic"],
  'MERCEDES-BENZ_GLA 45 AMG': ["S 4Matic+"],
  'MERCEDES-BENZ_GLB 200': ["Progressive", "AMG Line"],
  'MERCEDES-BENZ_GLB 250': ["4Matic AMG Line"],
  'MERCEDES-BENZ_GLC 200': ["Avantgarde", "AMG Line"],
  'MERCEDES-BENZ_GLC 300': ["4Matic AMG Line"],
  'MERCEDES-BENZ_GLC 43 AMG': ["4Matic"],
  'MERCEDES-BENZ_GLE 300d': ["4Matic"],
  'MERCEDES-BENZ_GLE 450': ["4Matic AMG Line"],
  'MERCEDES-BENZ_GLE 53 AMG': ["4Matic+"],
  'MERCEDES-BENZ_GLE 63 AMG': ["S 4Matic+"],
  'MERCEDES-BENZ_G 500': ["AMG Line"],
  'MERCEDES-BENZ_G 63 AMG': ["4Matic"],
  'MERCEDES-BENZ_Sprinter': ["311 CDI Furgón Corto", "314 CDI Furgón Mediano", "316 CDI Furgón Largo", "416 CDI Furgón", "516 CDI Furgón XL", "311 CDI Combi", "416 CDI Combi"],
  'MERCEDES-BENZ_Vito': ["111 CDI Furgón", "114 CDI Furgón", "116 CDI Mixto", "116 CDI Tourer"],
  'KIA_Seltos': ["1.6 LX MT", "1.6 EX AT", "1.6 EX Premium AT", "1.6T SX AT", "1.6T GT-Line AT"],
  'KIA_Sportage': ["2.0 LX MT", "2.0 EX AT", "2.0 EX Pack AT", "2.0T SX AT", "2.0T GT-Line AT"],
  'KIA_Sorento': ["2.5 LX AT", "2.5 EX AT", "2.5 EX Pack AT", "2.5T SX AT", "2.5T GT-Line AT"],
  'KIA_Cerato': ["2.0 LX MT", "2.0 EX AT", "2.0 SX AT", "2.0 GT-Line AT", "1.6T GT AT"],
  'KIA_Carnival': ["3.5 V6 LX AT", "3.5 V6 EX AT", "3.5 V6 SX AT"],
  'KIA_Picanto': ["1.0 LX MT", "1.0 EX AT", "1.0T GT-Line AT"],
  'KIA_Rio': ["1.4 LX MT", "1.4 EX AT", "1.4 SX AT"],
  'KIA_Stonic': ["1.4 LX MT", "1.4 EX AT", "1.0T GT-Line AT"],
  'KIA_EV6': ["Standard RWD", "Long Range RWD", "Long Range AWD", "GT AWD"],
  'AUDI_A1': ["30 TFSI S-tronic", "35 TFSI S-tronic", "40 TFSI S-tronic"],
  'AUDI_A3': ["35 TFSI S-tronic", "40 TFSI quattro", "S3 quattro", "RS3 quattro"],
  'AUDI_A4': ["40 TFSI", "40 TFSI S line", "45 TFSI quattro", "S4 TDI", "RS4 Avant"],
  'AUDI_A5 Sportback': ["40 TFSI", "45 TFSI quattro", "S5 TDI", "RS5"],
  'AUDI_Q2': ["35 TFSI", "35 TFSI S line", "40 TFSI quattro"],
  'AUDI_Q3': ["35 TFSI", "35 TFSI S line", "40 TFSI quattro", "RSQ3"],
  'AUDI_Q5': ["40 TFSI", "45 TFSI quattro", "55 TFSIe quattro PHEV", "SQ5 TDI"],
  'AUDI_Q7': ["45 TFSI", "55 TFSI quattro", "SQ7 TDI"],
  'AUDI_Q8': ["55 TFSI quattro", "SQ8 TDI", "RSQ8"],
  'AUDI_e-tron': ["50 quattro", "55 quattro", "S quattro"],
  'SSANGYONG_Korando': ["2.0 LX MT", "2.0 EX AT", "2.0 Limited AT"],
  'SSANGYONG_Rexton': ["2.2 TD RX MT", "2.2 TD RX7 AT", "2.2 TD Platinum AT"],
  'SSANGYONG_Musso': ["2.2 TD LX MT", "2.2 TD EX AT", "2.2 TD Limited AT"],
  'SUBARU_Forester': ["2.0i", "2.0i-L", "2.0i-S", "2.0i-S EyeSight", "2.5 Sport"],
  'SUBARU_Outback': ["2.5i", "2.5i-S", "2.5i-S EyeSight", "2.4 XT"],
  'SUBARU_XV': ["1.6i", "2.0i", "2.0i-S", "2.0i-S EyeSight"],
  'SUBARU_WRX': ["2.0T Base", "2.0T Premium", "2.0T Limited", "2.5T STI"],
  'MAZDA_CX-30': ["2.0 i", "2.0 i Grand Touring", "2.5 i Signature"],
  'MAZDA_CX-5': ["2.0 i", "2.5 i Sport", "2.5 i Grand Touring", "2.5 i Signature"],
  'MAZDA_CX-50': ["2.5 Preferred", "2.5 Premium", "2.5 Premium Plus", "2.5T Turbo"],
  'MAZDA_3': ["2.0 i", "2.5 i Sport", "2.5 i Grand Touring", "2.5 i Signature"],
  'MAZDA_MX-5': ["2.0 i Sport", "2.0 i Grand Touring", "RF 2.0 Grand Touring"],
  'MG_ZS': ["1.5 Style MT", "1.5 Comfort AT", "1.5 Luxury AT", "1.3T Excite AT"],
  'MG_ZS EV': ["Standard Range", "Long Range", "Exclusive"],
  'MG_HS': ["1.5T Style AT", "1.5T Comfort AT", "2.0T Luxury AT AWD", "1.5T PHEV"],
  'MG_MG4': ["Standard", "Comfort", "Luxury", "XPOWER"],
  'CHERY_Tiggo 4': ["Comfort MT", "Luxury AT", "Pro Comfort MT", "Pro Luxury AT"],
  'CHERY_Tiggo 7': ["Comfort MT", "Luxury AT", "Pro Comfort MT", "Pro Luxury AT"],
  'CHERY_Tiggo 8': ["Comfort AT", "Luxury AT", "Pro Comfort AT", "Pro Luxury AT"],
  'CHERY_Omoda 5': ["Comfort AT", "Luxury AT", "GT AT"],
  'BYD_Dolphin': ["Standard", "Comfort", "Design"],
  'BYD_Seal': ["Dynamic", "Premium", "Performance"],
  'BYD_Song Plus': ["Comfort", "Flagship"],
  'HAVAL_H6': ["Comfort AT", "Supreme AT", "Supreme+ AT", "GT AT", "Hybrid AT"],
  'HAVAL_Jolion': ["Comfort AT", "Premium AT", "Luxury AT", "Hybrid AT"],
  'HAVAL_Dargo': ["Supreme AT", "Supreme+ AT"],
  'GWM_Tank 300': ["Luxury AT", "Flagship AT"],
  'GWM_Tank 500': ["Hybrid AT", "Hybrid Flagship AT"],
  'GWM_Ora 03': ["Standard", "Luxury", "GT"],
  'CUPRA_Formentor': ["1.4 TSI", "2.0 TSI VZ", "2.5 TSI VZ5", "1.4 e-Hybrid"],
  'CUPRA_Leon': ["2.0 TSI VZ", "1.4 e-Hybrid VZ"],
  'CUPRA_Born': ["58 kWh", "77 kWh", "VZ 77 kWh"],
  'CITROEN_C3': ["1.2 Live", "1.2 Feel", "1.6 Feel Pack", "1.6 Shine"],
  'CITROEN_C3 Aircross': ["1.6 Live", "1.6 Feel", "1.6 Feel Pack", "1.6 Shine", "1.6 Shine Pack"],
  'CITROEN_C4 Cactus': ["1.6 Live", "1.6 Feel", "1.6 Feel Pack", "1.6 Shine"],
  'CITROEN_C5 Aircross': ["1.6 THP Feel", "1.6 THP Feel Pack", "1.6 THP Shine", "1.6 Hybrid"],
  'GENERICA_AUTO': ["Base", "Comfort", "Style", "Premium", "Luxury", "Sport", "Active", "Trend", "Life", "Titanium", "Limited", "Highline", "Intense", "Sense", "Full"],
  'GENERICA_MOTO': ["Standard", "Base", "Plus", "Sport", "Racing", "Adventure", "Touring", "Custom", "Café Racer", "Scrambler", "Pro", "R", "S"],
  'GENERICA_CAMION': ["4x2 Tractor", "4x2 Chasis", "6x2 Tractor", "6x4 Tractor", "6x4 Volcador", "8x4 Mixer", "8x4 Volcador", "Chasis Largo", "Chasis Corto", "Furgón", "Volcador"],
};

// Función para obtener versiones según marca/modelo
const getVersiones = (marca, modelo, tipoVehiculo) => {
  // 1. Buscar versión específica marca_modelo
  const key = `${marca}_${modelo}`;
  if (VERSIONES_ACARA[key]) {
    return VERSIONES_ACARA[key];
  }
  
  // 2. Buscar solo por marca (para motos y camiones)
  const keyMarca = `${marca}_MOTO`;
  if (tipoVehiculo === 'moto' && VERSIONES_ACARA[keyMarca]) {
    return VERSIONES_ACARA[keyMarca];
  }
  
  // 3. Fallback por tipo de vehículo
  if (tipoVehiculo === 'moto') {
    return VERSIONES_ACARA['GENERICA_MOTO'] || ['Standard', 'Sport', 'Touring', 'Adventure'];
  }
  if (tipoVehiculo === 'camion') {
    return VERSIONES_ACARA['GENERICA_CAMION'] || ['4x2', '6x2', '6x4', 'Chasis', 'Tractor'];
  }
  
  // 4. Fallback genérico para autos/camionetas
  return VERSIONES_ACARA['GENERICA_AUTO'] || ['Base', 'Comfort', 'Premium', 'Full'];
};

// Generar años disponibles (últimos 30 años)
const AÑOS = Array.from({ length: 31 }, (_, i) => 2025 - i);

// ============================================
// COMPONENTE HEROSECTION
// ============================================

const HeroSection = () => {
  const [activeTab, setActiveTab] = useState('vehiculos');
  
  // Estado para vehículos
  const [vehiculo, setVehiculo] = useState({
    tipo: '',
    marca: '',
    modelo: '',
    version: '',
    año: '',
    cobertura: ''
  });
  
  // Estados derivados
  const [marcasDisp, setMarcasDisp] = useState([]);
  const [modelosDisp, setModelosDisp] = useState([]);
  const [versionesDisp, setVersionesDisp] = useState([]);

  // Estado para otros formularios
  const [hogar, setHogar] = useState({ tipo: '', metros: '', ubicacion: '', cobertura: '' });
  const [art, setArt] = useState({ empresa: '', empleados: '', actividad: '', cuit: '' });
  const [comercio, setComercio] = useState({ tipo: '', metros: '', ubicacion: '', rubro: '' });
  const [vida, setVida] = useState({ edad: '', cobertura: '', fumador: '', monto: '' });

  // Actualizar marcas cuando cambia el tipo
  useEffect(() => {
    if (vehiculo.tipo) {
      const marcas = MARCAS_POR_TIPO[vehiculo.tipo] || [];
      setMarcasDisp(marcas.sort());
      setVehiculo(prev => ({ ...prev, marca: '', modelo: '', version: '', año: '', cobertura: '' }));
      setModelosDisp([]);
      setVersionesDisp([]);
    }
  }, [vehiculo.tipo]);

  // Actualizar modelos cuando cambia la marca
  useEffect(() => {
    if (vehiculo.marca) {
      let modelos = MODELOS_POR_MARCA[vehiculo.marca] || [];
      // Para motos, buscar también con sufijo _MOTO
      if (vehiculo.tipo === 'moto' && !modelos.length) {
        modelos = MODELOS_POR_MARCA[vehiculo.marca + '_MOTO'] || [];
      }
      // Si no hay modelos específicos, usar genéricos
      if (!modelos.length) {
        modelos = ['Modelo 1', 'Modelo 2', 'Modelo 3', 'Otro'];
      }
      setModelosDisp(modelos.sort());
      setVehiculo(prev => ({ ...prev, modelo: '', version: '', año: '', cobertura: '' }));
      setVersionesDisp([]);
    }
  }, [vehiculo.marca, vehiculo.tipo]);

  // Actualizar versiones cuando cambia el modelo
  useEffect(() => {
    if (vehiculo.modelo && vehiculo.marca) {
      const versiones = getVersiones(vehiculo.marca, vehiculo.modelo, vehiculo.tipo);
      setVersionesDisp(versiones);
      setVehiculo(prev => ({ ...prev, version: '' }));
    }
  }, [vehiculo.modelo, vehiculo.marca, vehiculo.tipo]);

  // Enviar cotización por WhatsApp
  const enviarWhatsApp = (tipo) => {
    let mensaje = '';
    const telefono = '5493415854220';
    
    switch(tipo) {
      case 'vehiculo':
        if (!vehiculo.tipo || !vehiculo.marca || !vehiculo.modelo || !vehiculo.año || !vehiculo.cobertura) {
          alert('Por favor completá todos los campos obligatorios');
          return;
        }
        const coberturaLabel = COBERTURAS_AUTO.find(c => c.value === vehiculo.cobertura)?.label || vehiculo.cobertura;
        mensaje = `🚗 *COTIZACIÓN VEHÍCULO*

*Tipo:* ${vehiculo.tipo.charAt(0).toUpperCase() + vehiculo.tipo.slice(1)}
*Marca:* ${vehiculo.marca}
*Modelo:* ${vehiculo.modelo}${vehiculo.version ? `
*Versión:* ${vehiculo.version}` : ''}
*Año:* ${vehiculo.año}
*Cobertura:* ${coberturaLabel}

Solicito cotización para mi vehículo.`;
        break;
        
      case 'hogar':
        if (!hogar.tipo || !hogar.metros || !hogar.ubicacion) {
          alert('Por favor completá todos los campos obligatorios');
          return;
        }
        mensaje = `🏠 *COTIZACIÓN HOGAR*

*Tipo:* ${hogar.tipo}
*Metros²:* ${hogar.metros}
*Ubicación:* ${hogar.ubicacion}
*Cobertura:* ${hogar.cobertura || 'A definir'}

Solicito cotización para mi hogar.`;
        break;
        
      case 'art':
        if (!art.empresa || !art.empleados || !art.actividad) {
          alert('Por favor completá todos los campos obligatorios');
          return;
        }
        mensaje = `👷 *COTIZACIÓN ART*

*Empresa:* ${art.empresa}
*CUIT:* ${art.cuit || 'A informar'}
*Empleados:* ${art.empleados}
*Actividad:* ${art.actividad}

Solicito cotización de ART para mi empresa.`;
        break;
        
      case 'comercio':
        if (!comercio.tipo || !comercio.metros || !comercio.ubicacion) {
          alert('Por favor completá todos los campos obligatorios');
          return;
        }
        mensaje = `🏪 *COTIZACIÓN COMERCIO*

*Tipo:* ${comercio.tipo}
*Metros²:* ${comercio.metros}
*Ubicación:* ${comercio.ubicacion}
*Rubro:* ${comercio.rubro || 'A definir'}

Solicito cotización para mi comercio.`;
        break;
        
      case 'vida':
        if (!vida.edad || !vida.cobertura) {
          alert('Por favor completá todos los campos obligatorios');
          return;
        }
        mensaje = `❤️ *COTIZACIÓN VIDA/SALUD*

*Edad:* ${vida.edad} años
*Tipo:* ${vida.cobertura}
*Fumador:* ${vida.fumador || 'No'}
*Monto:* ${vida.monto || 'A definir'}

Solicito cotización de seguro de vida.`;
        break;
        
      default:
        return;
    }
    
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  // Estilos
  const inputClass = "w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:border-transparent text-sm";
  const labelClass = "block text-white/80 text-xs font-medium mb-1";
  const buttonClass = "w-full bg-gradient-to-r from-[#C9A227] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#E5C158] text-[#1a1a2e] font-bold py-2.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg text-sm";
  const tabClass = (isActive) => `px-4 py-2 rounded-t-lg font-medium text-sm transition-all ${isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80'}`;

  return (
    <section id="cotizar" className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
            Protegé lo que más <span className="text-[#C9A227]">importa</span>
          </h1>
          <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto">
            Cotizá tu seguro en segundos. Asesoramiento personalizado y las mejores coberturas del mercado.
          </p>
        </div>

        {/* Formulario Principal */}
        <div className="max-w-5xl mx-auto">
          {/* Tabs */}
          <div className="flex flex-wrap gap-1 mb-4 justify-center">
            <button onClick={() => setActiveTab('vehiculos')} className={tabClass(activeTab === 'vehiculos')}>
              🚗 Vehículos
            </button>
            <button onClick={() => setActiveTab('hogar')} className={tabClass(activeTab === 'hogar')}>
              🏠 Hogar
            </button>
            <button onClick={() => setActiveTab('art')} className={tabClass(activeTab === 'art')}>
              👷 ART
            </button>
            <button onClick={() => setActiveTab('comercio')} className={tabClass(activeTab === 'comercio')}>
              🏪 Comercio
            </button>
            <button onClick={() => setActiveTab('vida')} className={tabClass(activeTab === 'vida')}>
              ❤️ Vida/Salud
            </button>
          </div>

          {/* Panel de contenido */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-2xl">
            
            {/* TAB: VEHÍCULOS */}
            {activeTab === 'vehiculos' && (
              <div>
                <h3 className="text-white font-semibold mb-4 text-lg">Cotizá tu seguro de vehículo</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                  {/* Tipo */}
                  <div>
                    <label className={labelClass}>Tipo *</label>
                    <select 
                      value={vehiculo.tipo} 
                      onChange={(e) => setVehiculo({...vehiculo, tipo: e.target.value})}
                      className={inputClass}
                    >
                      <option value="">Seleccionar</option>
                      {TIPOS_VEHICULO.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Marca */}
                  <div>
                    <label className={labelClass}>Marca *</label>
                    <select 
                      value={vehiculo.marca} 
                      onChange={(e) => setVehiculo({...vehiculo, marca: e.target.value})}
                      className={inputClass}
                      disabled={!vehiculo.tipo}
                    >
                      <option value="">Seleccionar</option>
                      {marcasDisp.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  {/* Modelo */}
                  <div>
                    <label className={labelClass}>Modelo *</label>
                    <select 
                      value={vehiculo.modelo} 
                      onChange={(e) => setVehiculo({...vehiculo, modelo: e.target.value})}
                      className={inputClass}
                      disabled={!vehiculo.marca}
                    >
                      <option value="">Seleccionar</option>
                      {modelosDisp.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  {/* VERSIÓN - NUEVO CAMPO ACARA */}
                  <div>
                    <label className={labelClass}>Versión</label>
                    <select 
                      value={vehiculo.version} 
                      onChange={(e) => setVehiculo({...vehiculo, version: e.target.value})}
                      className={inputClass}
                      disabled={!vehiculo.modelo}
                    >
                      <option value="">Opcional</option>
                      {versionesDisp.map(v => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>

                  {/* Año */}
                  <div>
                    <label className={labelClass}>Año *</label>
                    <select 
                      value={vehiculo.año} 
                      onChange={(e) => setVehiculo({...vehiculo, año: e.target.value})}
                      className={inputClass}
                      disabled={!vehiculo.modelo}
                    >
                      <option value="">Seleccionar</option>
                      {AÑOS.map(a => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>

                  {/* Cobertura */}
                  <div>
                    <label className={labelClass}>Cobertura *</label>
                    <select 
                      value={vehiculo.cobertura} 
                      onChange={(e) => setVehiculo({...vehiculo, cobertura: e.target.value})}
                      className={inputClass}
                      disabled={!vehiculo.año}
                    >
                      <option value="">Seleccionar</option>
                      {COBERTURAS_AUTO.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Botón */}
                  <div className="flex items-end">
                    <button onClick={() => enviarWhatsApp('vehiculo')} className={buttonClass}>
                      Cotizar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: HOGAR */}
            {activeTab === 'hogar' && (
              <div>
                <h3 className="text-white font-semibold mb-4 text-lg">Cotizá tu seguro de hogar</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div>
                    <label className={labelClass}>Tipo *</label>
                    <select value={hogar.tipo} onChange={(e) => setHogar({...hogar, tipo: e.target.value})} className={inputClass}>
                      <option value="">Seleccionar</option>
                      <option value="casa">Casa</option>
                      <option value="departamento">Departamento</option>
                      <option value="ph">PH</option>
                      <option value="country">Country/Barrio Cerrado</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Metros² *</label>
                    <input type="number" value={hogar.metros} onChange={(e) => setHogar({...hogar, metros: e.target.value})} placeholder="Ej: 80" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Ubicación *</label>
                    <input type="text" value={hogar.ubicacion} onChange={(e) => setHogar({...hogar, ubicacion: e.target.value})} placeholder="Ciudad, Barrio" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Cobertura</label>
                    <select value={hogar.cobertura} onChange={(e) => setHogar({...hogar, cobertura: e.target.value})} className={inputClass}>
                      <option value="">Seleccionar</option>
                      <option value="basica">Básica</option>
                      <option value="intermedia">Intermedia</option>
                      <option value="premium">Premium</option>
                      <option value="todo_riesgo">Todo Riesgo</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button onClick={() => enviarWhatsApp('hogar')} className={buttonClass}>Cotizar</button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: ART */}
            {activeTab === 'art' && (
              <div>
                <h3 className="text-white font-semibold mb-4 text-lg">Cotizá tu ART (Riesgos del Trabajo)</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div>
                    <label className={labelClass}>Empresa *</label>
                    <input type="text" value={art.empresa} onChange={(e) => setArt({...art, empresa: e.target.value})} placeholder="Nombre empresa" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>CUIT</label>
                    <input type="text" value={art.cuit} onChange={(e) => setArt({...art, cuit: e.target.value})} placeholder="XX-XXXXXXXX-X" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Empleados *</label>
                    <select value={art.empleados} onChange={(e) => setArt({...art, empleados: e.target.value})} className={inputClass}>
                      <option value="">Seleccionar</option>
                      <option value="1-5">1 a 5</option>
                      <option value="6-10">6 a 10</option>
                      <option value="11-25">11 a 25</option>
                      <option value="26-50">26 a 50</option>
                      <option value="51-100">51 a 100</option>
                      <option value="100+">Más de 100</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Actividad *</label>
                    <input type="text" value={art.actividad} onChange={(e) => setArt({...art, actividad: e.target.value})} placeholder="Rubro principal" className={inputClass} />
                  </div>
                  <div className="flex items-end">
                    <button onClick={() => enviarWhatsApp('art')} className={buttonClass}>Cotizar</button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: COMERCIO */}
            {activeTab === 'comercio' && (
              <div>
                <h3 className="text-white font-semibold mb-4 text-lg">Cotizá tu seguro de comercio</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div>
                    <label className={labelClass}>Tipo *</label>
                    <select value={comercio.tipo} onChange={(e) => setComercio({...comercio, tipo: e.target.value})} className={inputClass}>
                      <option value="">Seleccionar</option>
                      <option value="local">Local comercial</option>
                      <option value="oficina">Oficina</option>
                      <option value="deposito">Depósito</option>
                      <option value="fabrica">Fábrica</option>
                      <option value="galpon">Galpón</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Metros² *</label>
                    <input type="number" value={comercio.metros} onChange={(e) => setComercio({...comercio, metros: e.target.value})} placeholder="Ej: 150" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Ubicación *</label>
                    <input type="text" value={comercio.ubicacion} onChange={(e) => setComercio({...comercio, ubicacion: e.target.value})} placeholder="Ciudad, Barrio" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Rubro</label>
                    <input type="text" value={comercio.rubro} onChange={(e) => setComercio({...comercio, rubro: e.target.value})} placeholder="Actividad" className={inputClass} />
                  </div>
                  <div className="flex items-end">
                    <button onClick={() => enviarWhatsApp('comercio')} className={buttonClass}>Cotizar</button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: VIDA/SALUD */}
            {activeTab === 'vida' && (
              <div>
                <h3 className="text-white font-semibold mb-4 text-lg">Cotizá tu seguro de vida</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div>
                    <label className={labelClass}>Edad *</label>
                    <input type="number" value={vida.edad} onChange={(e) => setVida({...vida, edad: e.target.value})} placeholder="Años" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Tipo *</label>
                    <select value={vida.cobertura} onChange={(e) => setVida({...vida, cobertura: e.target.value})} className={inputClass}>
                      <option value="">Seleccionar</option>
                      <option value="vida">Vida</option>
                      <option value="sepelio">Sepelio</option>
                      <option value="accidentes">Accidentes Personales</option>
                      <option value="salud">Salud</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Fumador</label>
                    <select value={vida.fumador} onChange={(e) => setVida({...vida, fumador: e.target.value})} className={inputClass}>
                      <option value="">Seleccionar</option>
                      <option value="no">No</option>
                      <option value="si">Sí</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Monto</label>
                    <select value={vida.monto} onChange={(e) => setVida({...vida, monto: e.target.value})} className={inputClass}>
                      <option value="">Seleccionar</option>
                      <option value="10000">USD 10.000</option>
                      <option value="25000">USD 25.000</option>
                      <option value="50000">USD 50.000</option>
                      <option value="100000">USD 100.000</option>
                      <option value="otro">Otro monto</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button onClick={() => enviarWhatsApp('vida')} className={buttonClass}>Cotizar</button>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-6 text-white/60 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-[#C9A227]">✓</span> Sin compromiso
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#C9A227]">✓</span> Respuesta en 24hs
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#C9A227]">✓</span> Mejores precios
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#C9A227]">✓</span> +17 años de experiencia
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
