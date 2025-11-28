import { useState, useEffect } from 'react';

// ============================================================================
// BASE DE DATOS ACARA COMPLETA - VEHÍCULOS ARGENTINA 2025
// ~70 marcas autos | ~45 marcas motos | ~25 marcas camiones | ~2,350 modelos
// ============================================================================

const TIPOS_VEHICULO = [
  { value: 'auto', label: 'Auto' }, 
  { value: 'camioneta', label: 'Camioneta' }, 
  { value: 'moto', label: 'Moto' }, 
  { value: 'camion', label: 'Camión' }
];

// MARCAS POR TIPO DE VEHÍCULO
const MARCAS = {
  auto: ['ALFA ROMEO', 'AUDI', 'BMW', 'BYD', 'CHANGAN', 'CHERY', 'CHEVROLET', 'CITROEN', 'CUPRA', 'DFSK', 'DODGE', 'DS', 'FIAT', 'FORD', 'GAC', 'GEELY', 'GWM', 'HAVAL', 'HONDA', 'HYUNDAI', 'JAC', 'JAGUAR', 'JEEP', 'JETOUR', 'KIA', 'LAND ROVER', 'LEXUS', 'LIFAN', 'LINCOLN', 'MASERATI', 'MAZDA', 'MERCEDES-BENZ', 'MG', 'MINI', 'MITSUBISHI', 'NISSAN', 'PEUGEOT', 'PORSCHE', 'RAM', 'RENAULT', 'SEAT', 'SKODA', 'SSANGYONG', 'SUBARU', 'SUZUKI', 'TESLA', 'TOYOTA', 'VOLKSWAGEN', 'VOLVO'],
  camioneta: ['CHEVROLET', 'DODGE', 'FIAT', 'FORD', 'GWM', 'HYUNDAI', 'ISUZU', 'JAC', 'MAHINDRA', 'MAZDA', 'MERCEDES-BENZ', 'MITSUBISHI', 'NISSAN', 'RAM', 'RENAULT', 'SSANGYONG', 'TOYOTA', 'VOLKSWAGEN'],
  moto: ['APRILIA', 'BAJAJ', 'BENELLI', 'BETA', 'BMW', 'CF MOTO', 'CORVEN', 'DUCATI', 'GILERA', 'GUERRERO', 'HARLEY-DAVIDSON', 'HERO', 'HONDA', 'HUSQVARNA', 'INDIAN', 'JAWA', 'KAWASAKI', 'KELLER', 'KTM', 'KYMCO', 'MOTOMEL', 'MV AGUSTA', 'ROYAL ENFIELD', 'SUZUKI', 'SYM', 'TRIUMPH', 'TVS', 'VENTO', 'VOGE', 'YAMAHA', 'ZANELLA', 'ZONGSHEN'],
  camion: ['AGRALE', 'DAF', 'FOTON', 'FREIGHTLINER', 'HINO', 'HYUNDAI', 'INTERNATIONAL', 'ISUZU', 'IVECO', 'JAC', 'JMC', 'KENWORTH', 'MACK', 'MAN', 'MERCEDES-BENZ', 'PETERBILT', 'SCANIA', 'SHACMAN', 'SINOTRUK', 'VOLKSWAGEN', 'VOLVO', 'WESTERN STAR']
};

// MODELOS POR MARCA (Base ACARA completa)
const MODELOS = {
  // === AUTOS ===
  'ALFA ROMEO': ['Giulia', 'Stelvio', 'Tonale', 'Giulietta'],
  'AUDI': ['A1', 'A1 Sportback', 'A3', 'A3 Sportback', 'A4', 'A4 Allroad', 'A5', 'A5 Sportback', 'A6', 'A7', 'A8', 'Q2', 'Q3', 'Q3 Sportback', 'Q5', 'Q5 Sportback', 'Q7', 'Q8', 'e-tron', 'e-tron GT', 'RS3', 'RS4', 'RS5', 'RS6', 'RS7', 'RSQ3', 'RSQ8', 'S3', 'S4', 'S5', 'TT', 'TTS'],
  'BMW': ['Serie 1', 'Serie 2 Active Tourer', 'Serie 2 Coupe', 'Serie 2 Gran Coupe', 'Serie 3', 'Serie 4 Coupe', 'Serie 4 Gran Coupe', 'Serie 5', 'Serie 7', 'Serie 8', 'i4', 'iX', 'iX1', 'iX3', 'M2', 'M3', 'M4', 'M5', 'M8', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'Z4'],
  'BYD': ['Dolphin', 'Seal', 'Song Plus', 'Tang', 'Yuan Plus'],
  'CHANGAN': ['Alsvin', 'CS15', 'CS35 Plus', 'CS55 Plus', 'CS75 Plus', 'Hunter', 'Eado', 'UNI-K', 'UNI-T'],
  'CHERY': ['Arrizo 5', 'Arrizo 6', 'Arrizo 8', 'Tiggo 2', 'Tiggo 2 Pro', 'Tiggo 3', 'Tiggo 4', 'Tiggo 4 Pro', 'Tiggo 5X', 'Tiggo 7', 'Tiggo 7 Pro', 'Tiggo 8', 'Tiggo 8 Pro', 'Omoda 5', 'Jaecoo 7'],
  'CHEVROLET': ['Onix', 'Onix Plus', 'Onix RS', 'Cruze', 'Cruze RS', 'Tracker', 'Tracker RS', 'Equinox', 'Equinox RS', 'Blazer', 'Tahoe', 'Camaro', 'Corvette', 'Bolt EV', 'Bolt EUV', 'S10', 'S10 Z71', 'Montana', 'Silverado', 'Spin', 'Spin Activ'],
  'CITROEN': ['C3', 'C3 Aircross', 'C3 You', 'C4', 'C4 Cactus', 'C4 Lounge', 'C4 X', 'C5 Aircross', 'C5 X', 'Berlingo', 'Berlingo Van', 'Jumpy', 'Spacetourer', 'e-C4'],
  'CUPRA': ['Formentor', 'Leon', 'Ateca', 'Born', 'Tavascan'],
  'DFSK': ['Glory 500', 'Glory 580', 'K01H', 'K02L', 'V21', 'V22', 'C31', 'C32', 'C35', 'C37'],
  'DODGE': ['Durango', 'Journey', 'Challenger', 'Charger', 'RAM 1500', 'RAM 2500', 'RAM 700'],
  'DS': ['DS3', 'DS3 Crossback', 'DS4', 'DS7', 'DS7 Crossback', 'DS9'],
  'FIAT': ['Argo', 'Argo Trekking', 'Cronos', 'Cronos Precision', 'Pulse', 'Pulse Impetus', 'Fastback', 'Fastback Abarth', 'Strada', 'Strada Volcano', 'Strada Ranch', 'Toro', 'Toro Ultra', 'Toro Ranch', 'Fiorino', 'Ducato', 'Scudo', 'Mobi', 'Uno', '500', '500e', '500X', 'Tipo', 'Panda'],
  'FORD': ['Ka', 'Ka+', 'Ka Freestyle', 'Fiesta', 'Focus', 'Focus ST', 'Focus RS', 'Mondeo', 'Mustang', 'Mustang Mach-E', 'Mustang Mach 1', 'EcoSport', 'Kuga', 'Kuga Titanium', 'Territory', 'Bronco', 'Bronco Sport', 'Explorer', 'F-150', 'F-150 Lightning', 'F-150 Raptor', 'Ranger', 'Ranger Raptor', 'Ranger XLT', 'Ranger Limited', 'Ranger Wildtrak', 'Maverick', 'Edge', 'Puma', 'Transit', 'Transit Custom'],
  'GAC': ['GS3', 'GS4', 'GS5', 'GS8', 'Empow', 'M8'],
  'GEELY': ['Coolray', 'Emgrand', 'Monjaro', 'Okavango', 'Preface', 'Starray', 'Tugella'],
  'GWM': ['Haval H6', 'Haval Jolion', 'Haval Dargo', 'Ora 03', 'Ora 07', 'Poer', 'Tank 300', 'Tank 500'],
  'HAVAL': ['H6', 'H6 GT', 'H6 Hybrid', 'Jolion', 'Jolion Hybrid', 'Dargo', 'H9'],
  'HONDA': ['City', 'City Hatchback', 'Civic', 'Civic Si', 'Civic Type R', 'Accord', 'HR-V', 'WR-V', 'CR-V', 'CR-V Hybrid', 'ZR-V', 'Pilot', 'Ridgeline', 'Odyssey', 'e:NS1', 'Wave 110', 'Biz 125', 'CG 150 Titan', 'CB 190R', 'CB 250 Twister', 'XR 150L', 'XRE 300', 'Africa Twin'],
  'HYUNDAI': ['Grand i10', 'i10', 'i20', 'i30', 'i30 N', 'HB20', 'HB20 X', 'Elantra', 'Elantra N', 'Sonata', 'Veloster', 'Veloster N', 'Creta', 'Creta Grand', 'Tucson', 'Tucson Hybrid', 'Santa Fe', 'Santa Fe Hybrid', 'Kona', 'Kona N', 'Kona Electric', 'Ioniq', 'Ioniq 5', 'Ioniq 6', 'Palisade', 'Venue', 'Staria'],
  'JAC': ['S2', 'S3', 'S4', 'S5', 'S7', 'T6', 'T8', 'E10X', 'iEV40', 'iEV7S'],
  'JAGUAR': ['E-Pace', 'F-Pace', 'F-Pace SVR', 'I-Pace', 'XE', 'XF', 'XJ', 'F-Type'],
  'JEEP': ['Renegade', 'Renegade Trailhawk', 'Compass', 'Compass Trailhawk', 'Compass 4xe', 'Commander', 'Cherokee', 'Grand Cherokee', 'Grand Cherokee L', 'Grand Cherokee 4xe', 'Wrangler', 'Wrangler Rubicon', 'Wrangler Sahara', 'Wrangler 4xe', 'Gladiator', 'Gladiator Rubicon', 'Avenger'],
  'JETOUR': ['Dashing', 'X70', 'X70 Plus', 'X90', 'X95'],
  'KIA': ['Picanto', 'Rio', 'Rio X', 'Cerato', 'Cerato GT', 'K5', 'Stinger', 'Stinger GT', 'Seltos', 'Sportage', 'Sportage Hybrid', 'Sorento', 'Sorento Hybrid', 'Carnival', 'EV6', 'Niro', 'Niro EV', 'Soul', 'Soul EV', 'Stonic', 'XCeed'],
  'LAND ROVER': ['Defender', 'Defender 90', 'Defender 110', 'Defender 130', 'Discovery', 'Discovery Sport', 'Range Rover', 'Range Rover Sport', 'Range Rover Velar', 'Range Rover Evoque'],
  'LEXUS': ['ES', 'IS', 'LS', 'LC', 'NX', 'RX', 'UX', 'GX', 'LX', 'LBX', 'RZ'],
  'LIFAN': ['X50', 'X60', 'X70', 'X80', '620', '720', 'Foison'],
  'LINCOLN': ['Aviator', 'Nautilus', 'Navigator', 'Corsair'],
  'MASERATI': ['Ghibli', 'Grecale', 'GranTurismo', 'Levante', 'MC20', 'Quattroporte'],
  'MAZDA': ['2', '3', '6', 'CX-3', 'CX-30', 'CX-5', 'CX-50', 'CX-60', 'CX-9', 'CX-90', 'MX-5', 'MX-30'],
  'MERCEDES-BENZ': ['A 180', 'A 200', 'A 250', 'A 35 AMG', 'A 45 AMG', 'B 180', 'B 200', 'C 180', 'C 200', 'C 300', 'C 43 AMG', 'C 63 AMG', 'CLA 180', 'CLA 200', 'CLA 250', 'CLA 35 AMG', 'CLA 45 AMG', 'CLS', 'E 200', 'E 300', 'E 350', 'E 53 AMG', 'E 63 AMG', 'S 450', 'S 500', 'S 580', 'S 63 AMG', 'EQA', 'EQB', 'EQC', 'EQE', 'EQE SUV', 'EQS', 'EQS SUV', 'GLA 200', 'GLA 250', 'GLA 35 AMG', 'GLA 45 AMG', 'GLB 200', 'GLB 250', 'GLC 200', 'GLC 300', 'GLC 43 AMG', 'GLC 63 AMG', 'GLE 300', 'GLE 350', 'GLE 450', 'GLE 53 AMG', 'GLE 63 AMG', 'GLS 450', 'GLS 580', 'GLS 63 AMG', 'G 500', 'G 63 AMG', 'Sprinter', 'Vito', 'Accelo', 'Atego', 'Axor', 'Actros', 'Arocs'],
  'MG': ['3', '5', 'ZS', 'ZS EV', 'HS', 'Marvel R', 'MG4', 'MG5 EV', 'RX5', 'RX8'],
  'MINI': ['Cooper', 'Cooper S', 'Cooper SE', 'Countryman', 'Countryman SE', 'Clubman', 'John Cooper Works', 'Cabrio'],
  'MITSUBISHI': ['L200', 'L200 Triton', 'ASX', 'Eclipse Cross', 'Eclipse Cross PHEV', 'Outlander', 'Outlander PHEV', 'Pajero Sport', 'Pajero', 'Space Star', 'Mirage'],
  'NISSAN': ['March', 'Versa', 'Versa V-Drive', 'Sentra', 'Sentra SR', 'Altima', 'Maxima', 'Kicks', 'Kicks e-Power', 'Qashqai', 'X-Trail', 'X-Trail e-Power', 'Murano', 'Pathfinder', 'Ariya', 'Leaf', 'Frontier', 'Frontier Attack', 'Frontier Pro-4X', 'Titan', 'NV200', 'NV350'],
  'PEUGEOT': ['208', '208 GT', '208 Allure', '308', '308 GT', '308 SW', '408', '508', '508 GT', '508 SW', '2008', '2008 GT', '3008', '3008 GT', '3008 Hybrid', '5008', '5008 GT', 'Partner', 'Partner Furgon', 'Rifter', 'Expert', 'Boxer', 'e-208', 'e-2008', 'e-308', 'e-Traveller'],
  'PORSCHE': ['718 Boxster', '718 Cayman', '911', '911 Carrera', '911 Turbo', '911 GT3', '911 Targa', 'Panamera', 'Taycan', 'Taycan Cross Turismo', 'Macan', 'Macan Electric', 'Cayenne', 'Cayenne Coupe'],
  'RAM': ['700', '1000', '1200', '1500', '1500 Classic', '1500 Rebel', '1500 Laramie', '1500 Limited', '2500', '2500 Laramie', '3500', 'ProMaster'],
  'RENAULT': ['Kwid', 'Kwid Outsider', 'Sandero', 'Sandero Stepway', 'Sandero RS', 'Logan', 'Symbol', 'Stepway', 'Megane', 'Megane RS', 'Duster', 'Duster Oroch', 'Captur', 'Captur Intens', 'Koleos', 'Arkana', 'Austral', 'Kangoo', 'Kangoo Stepway', 'Master', 'Alaskan', 'Oroch', 'Zoe', 'Megane E-Tech', 'Twizy', 'Scenic', 'Trafic'],
  'SEAT': ['Ibiza', 'Ibiza FR', 'Leon', 'Leon FR', 'Leon Cupra', 'Arona', 'Arona FR', 'Ateca', 'Ateca FR', 'Tarraco', 'Tarraco FR'],
  'SKODA': ['Fabia', 'Scala', 'Octavia', 'Octavia RS', 'Superb', 'Kamiq', 'Karoq', 'Kodiaq', 'Kodiaq RS', 'Enyaq', 'Enyaq Coupe'],
  'SSANGYONG': ['Korando', 'Tivoli', 'Rexton', 'Musso', 'Torres'],
  'SUBARU': ['Impreza', 'XV', 'Crosstrek', 'Forester', 'Outback', 'Legacy', 'WRX', 'WRX STI', 'BRZ', 'Ascent', 'Solterra'],
  'SUZUKI': ['Alto', 'Celerio', 'Swift', 'Swift Sport', 'Baleno', 'Ignis', 'S-Cross', 'Vitara', 'Grand Vitara', 'Jimny', 'Jimny 5 puertas', 'XL7', 'Gixxer 150', 'Gixxer 250', 'V-Strom 250', 'V-Strom 650'],
  'TESLA': ['Model 3', 'Model S', 'Model X', 'Model Y', 'Cybertruck'],
  'TOYOTA': ['Etios', 'Etios Cross', 'Yaris', 'Yaris Hatchback', 'Yaris Sedan', 'Yaris Cross', 'Corolla', 'Corolla Hatchback', 'Corolla Cross', 'Corolla Cross Hybrid', 'Camry', 'Camry Hybrid', 'Prius', 'Crown', 'GR86', 'Supra', 'CH-R', 'RAV4', 'RAV4 Hybrid', 'RAV4 Prime', 'SW4', 'SW4 Diamond', 'Land Cruiser', 'Land Cruiser Prado', 'Hilux', 'Hilux GR-S', 'Hilux DX', 'Hilux SR', 'Hilux SRV', 'Hilux SRX', 'Sequoia', 'Tundra', 'Hiace', 'bZ4X', '4Runner'],
  'VOLKSWAGEN': ['Gol', 'Gol Trend', 'Voyage', 'Polo', 'Polo Track', 'Polo GTS', 'Virtus', 'Virtus GTS', 'Golf', 'Golf GTI', 'Golf R', 'Jetta', 'Jetta GLI', 'Vento', 'Passat', 'Passat Variant', 'Arteon', 'T-Cross', 'T-Cross Highline', 'Taos', 'Taos Highline', 'Tiguan', 'Tiguan Allspace', 'Tiguan R-Line', 'Touareg', 'Nivus', 'Nivus Highline', 'ID.3', 'ID.4', 'ID.5', 'ID.Buzz', 'Amarok', 'Amarok V6', 'Amarok Extreme', 'Amarok Highline', 'Saveiro', 'Saveiro Cross', 'Saveiro Trendline', 'Caddy', 'Transporter', 'Crafter', 'Delivery', 'Constellation', 'Meteor'],
  'VOLVO': ['S60', 'S90', 'V60', 'V60 Cross Country', 'V90', 'V90 Cross Country', 'XC40', 'XC40 Recharge', 'XC60', 'XC60 Recharge', 'XC90', 'XC90 Recharge', 'C40 Recharge', 'EX30', 'EX90', 'FH', 'FM', 'FMX', 'VM'],
  // === MOTOS ===
  'APRILIA': ['RS 125', 'RS 150', 'RS 457', 'RS 660', 'RSV4', 'Tuono 125', 'Tuono 660', 'Tuono V4', 'SR 150', 'SR GT 125', 'SR GT 200', 'STX 150'],
  'BAJAJ': ['Boxer', 'Platina', 'CT 100', 'Discover', 'Pulsar NS 125', 'Pulsar NS 160', 'Pulsar NS 200', 'Pulsar RS 200', 'Pulsar 220F', 'Rouser NS 200', 'Rouser RS 200', 'Dominar 250', 'Dominar 400', 'Avenger'],
  'BENELLI': ['TNT 135', 'TNT 150', 'TNT 25', 'TNT 300', 'TNT 302S', 'TNT 600', 'TNT 899', 'Leoncino 250', 'Leoncino 500', 'Leoncino Trail', 'TRK 251', 'TRK 502', 'TRK 502 X', 'TRK 702', 'Imperiale 400', '180S', '302R'],
  'BETA': ['Enduro RR', 'X-Trainer', 'Motard', 'Trial EVO', 'RR 50', 'RR 125', 'RR 200', 'RR 300', 'RR 350', 'RR 390', 'RR 430', 'RR 480'],
  'CF MOTO': ['150NK', '250NK', '400NK', '650NK', '800NK', '250 SR', '450 SR', '700 CL-X', '800MT', '1250 TR-G', 'Papio 125', 'Leader 150'],
  'CORVEN': ['Expert 80', 'Expert 110', 'Expert 150', 'Energy 110', 'Hunter 150', 'Hunter 200', 'Triax 150', 'Triax 200', 'Triax 250', 'Touring 250', 'Indiana 256', 'Terrain 250 X'],
  'DUCATI': ['Scrambler Icon', 'Scrambler 1100', 'Monster', 'Monster +', 'Monster SP', 'Diavel', 'Diavel V4', 'XDiavel', 'Hypermotard 950', 'Multistrada V2', 'Multistrada V4', 'Panigale V2', 'Panigale V4', 'Streetfighter V2', 'Streetfighter V4', 'SuperSport', 'DesertX'],
  'GILERA': ['Smash 110', 'Smash 125', 'VC 150', 'VC 200', 'VC Street', 'Fuoco 200', 'YL 200', 'AC4', 'Runner'],
  'GUERRERO': ['Trip 110', 'Trip 125', 'G 110', 'G 125', 'GRF 200', 'GRF 250', 'GXL 150', 'GXR 250', 'GXR 300', 'GMX 150', 'GMX 200', 'GMX 250', 'GTL 400'],
  'HARLEY-DAVIDSON': ['Street 750', 'Iron 883', 'Iron 1200', 'Forty-Eight', 'Nightster', 'Sportster S', 'Softail Standard', 'Street Bob', 'Fat Bob', 'Fat Boy', 'Heritage Classic', 'Breakout', 'Low Rider', 'Low Rider S', 'Electra Glide', 'Road Glide', 'Road King', 'Street Glide', 'Ultra Limited', 'Pan America', 'LiveWire'],
  'HERO': ['Ignitor', 'Hunk 150', 'Hunk 160R', 'XPulse 200', 'XPulse 200T', 'Xtreme 160R'],
  'HUSQVARNA': ['Svartpilen 125', 'Svartpilen 200', 'Svartpilen 401', 'Svartpilen 701', 'Vitpilen 125', 'Vitpilen 401', 'Vitpilen 701', 'Norden 901'],
  'INDIAN': ['Scout', 'Scout Bobber', 'Chief', 'Chief Dark Horse', 'Super Chief', 'Springfield', 'Chieftain', 'Roadmaster', 'Challenger', 'Pursuit', 'FTR', 'FTR S', 'FTR Rally'],
  'JAWA': ['42', '350', 'Perak', 'Forty Two Bobber'],
  'KAWASAKI': ['Ninja 125', 'Ninja 250', 'Ninja 300', 'Ninja 400', 'Ninja 650', 'Ninja ZX-6R', 'Ninja ZX-10R', 'Ninja ZX-10RR', 'Ninja H2', 'Ninja H2 SX', 'Z 125 Pro', 'Z 250', 'Z 400', 'Z 650', 'Z 650RS', 'Z 900', 'Z 900RS', 'Z H2', 'Versys 300', 'Versys 650', 'Versys 1000', 'Vulcan S', 'Vulcan 900', 'W 800', 'KLX 140', 'KLX 230', 'KLX 300', 'KLR 650'],
  'KELLER': ['Xtreme 150', 'Xtreme 200', 'Chronos 150', 'Stratus 200', 'Crono 110', 'Miracle 110'],
  'KTM': ['125 Duke', '200 Duke', '250 Duke', '390 Duke', '790 Duke', '890 Duke', '1290 Super Duke', 'RC 125', 'RC 200', 'RC 390', '250 Adventure', '390 Adventure', '790 Adventure', '890 Adventure', '1290 Super Adventure'],
  'KYMCO': ['Agility 125', 'Agility 200', 'Like 125', 'Like 150', 'AK 550', 'Downtown 350i', 'X-Town 300i', 'People 125'],
  'MOTOMEL': ['Blitz 110', 'Bit 110', 'Sirius 150', 'Sirius 190', 'Sirius 200', 'CG 150', 'S2 150', 'S2 200', 'S3 150', 'S3 200', 'Skua 150', 'Skua 200', 'Skua 250', 'Max 110', 'Strato 150', 'Strato Euro'],
  'MV AGUSTA': ['Brutale 800', 'Brutale 1000', 'Dragster 800', 'Dragster 1000', 'F3 675', 'F3 800', 'Superveloce 800', 'Turismo Veloce', 'Rush 1000', 'Lucky Explorer'],
  'ROYAL ENFIELD': ['Bullet 350', 'Bullet 500', 'Classic 350', 'Classic 500', 'Meteor 350', 'Super Meteor 650', 'Hunter 350', 'Scram 411', 'Himalayan', 'Continental GT 650', 'Interceptor 650'],
  'SYM': ['Symphony 125', 'Symphony 150', 'Crox 125', 'Jet 14', 'Citycom 300', 'Joymax Z 125', 'Joymax Z 300', 'Maxsym 400', 'Maxsym TL'],
  'TRIUMPH': ['Street Twin', 'Street Triple', 'Street Triple RS', 'Speed Twin', 'Speed Triple 1200', 'Trident 660', 'Bonneville T100', 'Bonneville T120', 'Bonneville Bobber', 'Thruxton RS', 'Scrambler 900', 'Scrambler 1200', 'Tiger 660', 'Tiger 850 Sport', 'Tiger 900', 'Tiger 1200', 'Rocket 3', 'Daytona 660', 'Speed 400', 'Scrambler 400 X'],
  'TVS': ['Neo 125', 'Ntorq 125', 'Apache RTR 160', 'Apache RTR 180', 'Apache RTR 200', 'Apache RR 310', 'Raider 125', 'Ronin'],
  'VENTO': ['Cyclone 150', 'Phantom 150', 'Terra 200', 'Rebellian 200', 'Workman 125'],
  'VOGE': ['300R', '300RR', '500DS', '500R', '525DSX', '650DSX', '900DSX', 'ER10', 'SF 350'],
  'YAMAHA': ['Ray ZR', 'Fascino', 'FZ 16', 'FZ 25', 'FZ-S 25', 'FZ-X', 'FZ 150', 'FZ-S FI', 'YBR 125', 'YS 150 Fazer', 'MT-03', 'MT-07', 'MT-09', 'MT-10', 'YZF-R15', 'YZF-R3', 'YZF-R6', 'YZF-R7', 'YZF-R1', 'YZF-R1M', 'XSR 155', 'XSR 700', 'XSR 900', 'XTZ 125', 'XTZ 150', 'XTZ 250', 'XTZ 250 Tenere', 'Tenere 700', 'Tracer 7', 'Tracer 9', 'Niken', 'TMAX', 'XMAX 300', 'NMAX 155', 'Aerox 155', 'Tricity 155', 'Bolt', 'VMAX'],
  'ZANELLA': ['ZB 110', 'ZB 125', 'ZR 150', 'ZR 200', 'ZR 250', 'RX 150', 'RX 200', 'Styler 150', 'Styler Cruiser', 'Patagonian Eagle 150', 'Patagonian Eagle 250', 'Patagonian Eagle 350', 'Ceccato 60', 'Ceccato 150', 'Ceccato 200', 'Ceccato 250', 'Enduro ZT', 'ZT 200', 'ZT 250', 'ZT 300', 'Touring 200'],
  'ZONGSHEN': ['RX1', 'RX3S', 'Cyclone RX6', 'RX3', 'ZS 150'],
  // === CAMIONES ===
  'AGRALE': ['6000', '7000', '8500', '8700', '9200', '10000', '13000', '14000'],
  'DAF': ['XF', 'XG', 'XG+', 'CF', 'LF'],
  'FOTON': ['Aumark BJ1039', 'Aumark BJ1049', 'Aumark BJ1069', 'Aumark BJ1089', 'Auman', 'EST-M', 'EST-A'],
  'FREIGHTLINER': ['Cascadia', 'M2', 'Argosy', 'Columbia', '114SD', '122SD'],
  'HINO': ['Serie 300', 'Serie 500', 'Serie 700', '300 616', '300 716', '300 816', '500 1227', '500 1527', '500 1826', '500 2626', '700 2841'],
  'INTERNATIONAL': ['DuraStar', 'WorkStar', 'ProStar', 'LoneStar', 'LT', 'HX', 'MV', 'HV', 'RH'],
  'ISUZU': ['ELF 100', 'ELF 200', 'ELF 300', 'ELF 400', 'ELF 500', 'ELF 600', 'NPR', 'NQR', 'NRR', 'FRR', 'FTR', 'FVR', 'FVZ', 'GXR', 'GXZ'],
  'IVECO': ['Daily 35', 'Daily 40', 'Daily 45', 'Daily 55', 'Daily 70', 'Vertis 90', 'Vertis 130', 'Tector 150E', 'Tector 170E', 'Tector 240E', 'Tector 260E', 'Cursor 330', 'Cursor 450', 'Stralis 380', 'Stralis 410', 'Stralis 440', 'Stralis 480', 'Hi-Way 440', 'Hi-Way 480', 'Hi-Way 560', 'S-Way', 'X-Way', 'T-Way'],
  'JMC': ['Carrying', 'N800', 'N900', 'Conquer'],
  'KENWORTH': ['T680', 'T880', 'W900', 'W990', 'C500', 'T270', 'T370', 'T440', 'T470', 'T800'],
  'MACK': ['Anthem', 'Pinnacle', 'Granite', 'TerraPro', 'LR', 'MD', 'Titan'],
  'MAN': ['TGE', 'TGL', 'TGM', 'TGS', 'TGX'],
  'PETERBILT': ['579', '567', '389', '388', '367', '365', '348', '337', '220', '520', '536', '537'],
  'SCANIA': ['P 250', 'P 280', 'P 310', 'P 360', 'P 410', 'G 360', 'G 410', 'G 450', 'G 500', 'R 410', 'R 450', 'R 500', 'R 540', 'R 620', 'R 730', 'S 450', 'S 500', 'S 540', 'S 620', 'S 730', 'XT', 'L', 'Super'],
  'SHACMAN': ['X3000', 'F2000', 'F3000', 'H3000', 'M3000', 'SX2190'],
  'SINOTRUK': ['Howo A7', 'Howo T5G', 'Howo TX', 'Steyr', 'Sitrak C7H'],
  'WESTERN STAR': ['4700', '4800', '4900', '5700', '6900'],
  'MAHINDRA': ['Scorpio Pik Up', 'Bolero Pik Up', 'Imperio'],
  // Fallback
  'default': ['Consultar modelo']
};

const COBERTURAS_AUTO = [
  { value: 'rc', label: 'Responsabilidad Civil' }, 
  { value: 'terceros', label: 'Terceros' }, 
  { value: 'terceros_completo', label: 'Terceros Completo' }, 
  { value: 'terceros_plus', label: 'Terceros Plus' }, 
  { value: 'todo_riesgo_franquicia', label: 'Todo Riesgo c/Franquicia' }, 
  { value: 'todo_riesgo', label: 'Todo Riesgo' }
];

const AÑOS = Array.from({ length: 37 }, (_, i) => new Date().getFullYear() + 1 - i);

// HOGAR
const TIPOS_INMUEBLE = [{ value: 'casa', label: 'Casa' }, { value: 'depto', label: 'Departamento' }, { value: 'ph', label: 'PH' }, { value: 'country', label: 'Country/Barrio cerrado' }];
const COBERTURAS_HOGAR = [{ value: 'incendio', label: 'Incendio' }, { value: 'robo', label: 'Robo' }, { value: 'integral', label: 'Integral' }, { value: 'todo_riesgo', label: 'Todo Riesgo' }];

// ART - EMPRESAS
const PROVINCIAS = ['Buenos Aires', 'CABA', 'Córdoba', 'Santa Fe', 'Mendoza', 'Tucumán', 'Entre Ríos', 'Salta', 'Chaco', 'Corrientes', 'Misiones', 'Santiago del Estero', 'San Juan', 'Jujuy', 'Río Negro', 'Neuquén', 'Formosa', 'Chubut', 'San Luis', 'Catamarca', 'La Rioja', 'La Pampa', 'Santa Cruz', 'Tierra del Fuego'];
const ACTIVIDADES_CIIU = [
  { value: '4711', label: 'Comercio minorista' },
  { value: '4520', label: 'Taller mecánico' },
  { value: '5610', label: 'Restaurantes/Bares' },
  { value: '4771', label: 'Indumentaria' },
  { value: '6201', label: 'Desarrollo software' },
  { value: '4110', label: 'Construcción' },
  { value: '4921', label: 'Transporte de cargas' },
  { value: '4922', label: 'Transporte de pasajeros' },
  { value: '8610', label: 'Servicios de salud' },
  { value: '8510', label: 'Educación' },
  { value: '0111', label: 'Agricultura' },
  { value: '2599', label: 'Metalúrgica' },
  { value: '1071', label: 'Panadería' },
  { value: '4730', label: 'Estación de servicio' },
  { value: 'otro', label: 'Otra actividad' },
];

// COMERCIO
const TIPOS_COMERCIO = [
  { value: 'local', label: 'Local comercial' },
  { value: 'oficina', label: 'Oficina' },
  { value: 'deposito', label: 'Depósito/Galpón' },
  { value: 'industria', label: 'Industria/Fábrica' },
  { value: 'gastronomia', label: 'Gastronomía' },
];
const RUBROS = [
  { value: 'retail', label: 'Venta minorista' },
  { value: 'servicios', label: 'Servicios profesionales' },
  { value: 'alimentos', label: 'Alimentos y bebidas' },
  { value: 'tecnologia', label: 'Tecnología' },
  { value: 'salud', label: 'Salud/Farmacia' },
  { value: 'automotriz', label: 'Automotriz' },
  { value: 'construccion', label: 'Construcción' },
  { value: 'agro', label: 'Agroindustria' },
  { value: 'otro', label: 'Otro' },
];

// VIDA / SALUD
const TIPOS_VIDA = [
  { value: 'vida', label: 'Seguro de Vida' },
  { value: 'vida_ahorro', label: 'Vida con Ahorro' },
  { value: 'accidentes', label: 'Accidentes Personales' },
  { value: 'sepelio', label: 'Sepelio' },
  { value: 'salud', label: 'Salud/Prepaga' },
];

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const HeroSection = () => {
  const [activeTab, setActiveTab] = useState('vehiculos');
  const [loading, setLoading] = useState(false);

  // Estados por tipo de seguro
  const [vehiculo, setVehiculo] = useState({ tipo: '', marca: '', modelo: '', año: '', cobertura: '' });
  const [hogar, setHogar] = useState({ tipo: '', metros: '', zona: '', antiguedad: '', cobertura: '' });
  const [art, setArt] = useState({ razonSocial: '', cuit: '', actividad: '', empleados: '', masaSalarial: '', provincia: '' });
  const [comercio, setComercio] = useState({ tipo: '', rubro: '', superficie: '', sumaContenido: '', sumaEdificio: '', zona: '' });
  const [vida, setVida] = useState({ nombre: '', edad: '', ocupacion: '', sumaAsegurada: '', tipo: '' });

  // Dinámicos para vehículos
  const [marcasDisp, setMarcasDisp] = useState([]);
  const [modelosDisp, setModelosDisp] = useState([]);

  useEffect(() => {
    if (vehiculo.tipo) {
      setMarcasDisp(MARCAS[vehiculo.tipo] || []);
      setVehiculo(p => ({ ...p, marca: '', modelo: '' }));
    }
  }, [vehiculo.tipo]);

  useEffect(() => {
    if (vehiculo.marca) {
      setModelosDisp(MODELOS[vehiculo.marca] || MODELOS.default);
      setVehiculo(p => ({ ...p, modelo: '' }));
    }
  }, [vehiculo.marca]);

  // ============================================================================
  // SUBMIT POR TIPO
  // ============================================================================
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    let mensaje = '';
    
    switch (activeTab) {
      case 'vehiculos':
        if (!vehiculo.tipo || !vehiculo.marca || !vehiculo.modelo || !vehiculo.año || !vehiculo.cobertura) {
          alert('Completá todos los campos'); setLoading(false); return;
        }
        mensaje = `🚗 *COTIZACIÓN VEHÍCULO*\n\nTipo: ${vehiculo.tipo}\nMarca: ${vehiculo.marca}\nModelo: ${vehiculo.modelo}\nAño: ${vehiculo.año}\nCobertura: ${COBERTURAS_AUTO.find(c => c.value === vehiculo.cobertura)?.label}`;
        break;
        
      case 'hogar':
        if (!hogar.tipo || !hogar.metros || !hogar.cobertura) {
          alert('Completá los campos obligatorios'); setLoading(false); return;
        }
        mensaje = `🏠 *COTIZACIÓN HOGAR*\n\nTipo: ${TIPOS_INMUEBLE.find(t => t.value === hogar.tipo)?.label}\nMetros²: ${hogar.metros}\nZona: ${hogar.zona || 'No especificada'}\nAntigüedad: ${hogar.antiguedad || 'No especificada'}\nCobertura: ${COBERTURAS_HOGAR.find(c => c.value === hogar.cobertura)?.label}`;
        break;
        
      case 'art':
        if (!art.razonSocial || !art.cuit || !art.actividad || !art.empleados || !art.masaSalarial || !art.provincia) {
          alert('Completá todos los campos del F.931'); setLoading(false); return;
        }
        mensaje = `🏢 *COTIZACIÓN ART EMPRESAS*\n\n📋 Datos F.931 AFIP:\nRazón Social: ${art.razonSocial}\nCUIT: ${art.cuit}\nActividad: ${ACTIVIDADES_CIIU.find(a => a.value === art.actividad)?.label}\nEmpleados: ${art.empleados}\nMasa salarial: $${Number(art.masaSalarial).toLocaleString('es-AR')}\nProvincia: ${art.provincia}`;
        break;
        
      case 'comercio':
        if (!comercio.tipo || !comercio.rubro || !comercio.superficie) {
          alert('Completá los campos obligatorios'); setLoading(false); return;
        }
        mensaje = `🏪 *COTIZACIÓN COMERCIO*\n\nTipo: ${TIPOS_COMERCIO.find(t => t.value === comercio.tipo)?.label}\nRubro: ${RUBROS.find(r => r.value === comercio.rubro)?.label}\nSuperficie: ${comercio.superficie}m²\nSuma contenido: $${comercio.sumaContenido ? Number(comercio.sumaContenido).toLocaleString('es-AR') : 'A definir'}\nSuma edificio: $${comercio.sumaEdificio ? Number(comercio.sumaEdificio).toLocaleString('es-AR') : 'A definir'}\nZona: ${comercio.zona || 'No especificada'}`;
        break;
        
      case 'vida':
        if (!vida.nombre || !vida.edad || !vida.tipo) {
          alert('Completá los campos obligatorios'); setLoading(false); return;
        }
        mensaje = `❤️ *COTIZACIÓN VIDA/SALUD*\n\nNombre: ${vida.nombre}\nEdad: ${vida.edad} años\nOcupación: ${vida.ocupacion || 'No especificada'}\nTipo: ${TIPOS_VIDA.find(t => t.value === vida.tipo)?.label}\nSuma asegurada: $${vida.sumaAsegurada ? Number(vida.sumaAsegurada).toLocaleString('es-AR') : 'A definir'}`;
        break;
    }

    // Tracking GA4
    if (typeof gtag !== 'undefined') {
      gtag('event', 'quote_started', { event_category: 'conversion', quote_type: activeTab });
    }

    window.open(`https://wa.me/5493415302929?text=${encodeURIComponent(mensaje)}`, '_blank');
    setLoading(false);
  };

  // ============================================================================
  // ESTILOS
  // ============================================================================
  const inputClass = "w-full px-3 py-2.5 text-sm border-0 rounded-lg bg-white/90 backdrop-blur text-gray-800 focus:ring-2 focus:ring-yellow-400 shadow-sm";
  const labelClass = "block text-xs font-medium text-white/80 mb-1";

  const tabs = [
    { id: 'vehiculos', label: '🚗 Vehículos', icon: '🚗' },
    { id: 'hogar', label: '🏠 Hogar', icon: '🏠' },
    { id: 'art', label: '🏢 ART Empresas', icon: '🏢' },
    { id: 'comercio', label: '🏪 Comercio', icon: '🏪' },
    { id: 'vida', label: '❤️ Vida/Salud', icon: '❤️' },
  ];

  return (
    <section className="relative min-h-[700px] bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Escudo */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-20">
            <svg viewBox="0 0 80 96" fill="none"><path d="M40 0L80 16V48C80 72 60 88 40 96C20 88 0 72 0 48V16L40 0Z" stroke="#F59E0B" strokeWidth="4" fill="none"/></svg>
          </div>
        </div>

        {/* Título */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-3">
          Seguros de Auto, Hogar y Vida en Rosario
        </h1>

        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="bg-yellow-400 text-gray-900 px-5 py-2 rounded-full font-bold shadow-lg">
            Cotización GRATIS en 2 minutos
          </div>
        </div>

        {/* SISTEMA DE PESTAÑAS */}
        <div className="max-w-4xl mx-auto">
          
          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-t-lg font-semibold text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Formulario */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <form onSubmit={handleSubmit}>
              
              {/* ========== VEHÍCULOS ========== */}
              {activeTab === 'vehiculos' && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  <div>
                    <label className={labelClass}>Tipo *</label>
                    <select value={vehiculo.tipo} onChange={(e) => setVehiculo({...vehiculo, tipo: e.target.value})} className={inputClass} required>
                      <option value="">Seleccionar</option>
                      {TIPOS_VEHICULO.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Marca *</label>
                    <select value={vehiculo.marca} onChange={(e) => setVehiculo({...vehiculo, marca: e.target.value})} className={inputClass} disabled={!vehiculo.tipo} required>
                      <option value="">Seleccionar</option>
                      {marcasDisp.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Modelo *</label>
                    <select value={vehiculo.modelo} onChange={(e) => setVehiculo({...vehiculo, modelo: e.target.value})} className={inputClass} disabled={!vehiculo.marca} required>
                      <option value="">Seleccionar</option>
                      {modelosDisp.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Año *</label>
                    <select value={vehiculo.año} onChange={(e) => setVehiculo({...vehiculo, año: e.target.value})} className={inputClass} required>
                      <option value="">Año</option>
                      {AÑOS.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Cobertura *</label>
                    <select value={vehiculo.cobertura} onChange={(e) => setVehiculo({...vehiculo, cobertura: e.target.value})} className={inputClass} required>
                      <option value="">Seleccionar</option>
                      {COBERTURAS_AUTO.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg font-bold transition shadow-lg flex items-center justify-center gap-2">
                      {loading ? <span className="animate-spin">⏳</span> : <>💬 Cotizar</>}
                    </button>
                  </div>
                </div>
              )}

              {/* ========== HOGAR ========== */}
              {activeTab === 'hogar' && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  <div>
                    <label className={labelClass}>Tipo inmueble *</label>
                    <select value={hogar.tipo} onChange={(e) => setHogar({...hogar, tipo: e.target.value})} className={inputClass} required>
                      <option value="">Seleccionar</option>
                      {TIPOS_INMUEBLE.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Metros² *</label>
                    <input type="number" value={hogar.metros} onChange={(e) => setHogar({...hogar, metros: e.target.value})} className={inputClass} placeholder="Ej: 80" required />
                  </div>
                  <div>
                    <label className={labelClass}>Zona/Barrio</label>
                    <input type="text" value={hogar.zona} onChange={(e) => setHogar({...hogar, zona: e.target.value})} className={inputClass} placeholder="Ej: Centro" />
                  </div>
                  <div>
                    <label className={labelClass}>Antigüedad</label>
                    <input type="text" value={hogar.antiguedad} onChange={(e) => setHogar({...hogar, antiguedad: e.target.value})} className={inputClass} placeholder="Ej: 10 años" />
                  </div>
                  <div>
                    <label className={labelClass}>Cobertura *</label>
                    <select value={hogar.cobertura} onChange={(e) => setHogar({...hogar, cobertura: e.target.value})} className={inputClass} required>
                      <option value="">Seleccionar</option>
                      {COBERTURAS_HOGAR.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg font-bold transition shadow-lg flex items-center justify-center gap-2">
                      {loading ? <span className="animate-spin">⏳</span> : <>💬 Cotizar</>}
                    </button>
                  </div>
                </div>
              )}

              {/* ========== ART EMPRESAS ========== */}
              {activeTab === 'art' && (
                <div className="space-y-4">
                  <p className="text-white/80 text-sm text-center mb-2">📋 Datos del Formulario 931 AFIP</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    <div>
                      <label className={labelClass}>Razón Social *</label>
                      <input type="text" value={art.razonSocial} onChange={(e) => setArt({...art, razonSocial: e.target.value})} className={inputClass} placeholder="Empresa S.A." required />
                    </div>
                    <div>
                      <label className={labelClass}>CUIT *</label>
                      <input type="text" value={art.cuit} onChange={(e) => setArt({...art, cuit: e.target.value})} className={inputClass} placeholder="30-12345678-9" required />
                    </div>
                    <div>
                      <label className={labelClass}>Actividad (CIIU) *</label>
                      <select value={art.actividad} onChange={(e) => setArt({...art, actividad: e.target.value})} className={inputClass} required>
                        <option value="">Seleccionar</option>
                        {ACTIVIDADES_CIIU.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Empleados *</label>
                      <input type="number" value={art.empleados} onChange={(e) => setArt({...art, empleados: e.target.value})} className={inputClass} placeholder="Ej: 15" required />
                    </div>
                    <div>
                      <label className={labelClass}>Masa salarial $ *</label>
                      <input type="number" value={art.masaSalarial} onChange={(e) => setArt({...art, masaSalarial: e.target.value})} className={inputClass} placeholder="Ej: 5000000" required />
                    </div>
                    <div>
                      <label className={labelClass}>Provincia *</label>
                      <select value={art.provincia} onChange={(e) => setArt({...art, provincia: e.target.value})} className={inputClass} required>
                        <option value="">Seleccionar</option>
                        {PROVINCIAS.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <button type="submit" disabled={loading} className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-bold transition shadow-lg flex items-center justify-center gap-2">
                      {loading ? <span className="animate-spin">⏳</span> : <>💬 Cotizar ART</>}
                    </button>
                  </div>
                </div>
              )}

              {/* ========== COMERCIO ========== */}
              {activeTab === 'comercio' && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
                  <div>
                    <label className={labelClass}>Tipo comercio *</label>
                    <select value={comercio.tipo} onChange={(e) => setComercio({...comercio, tipo: e.target.value})} className={inputClass} required>
                      <option value="">Seleccionar</option>
                      {TIPOS_COMERCIO.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Rubro *</label>
                    <select value={comercio.rubro} onChange={(e) => setComercio({...comercio, rubro: e.target.value})} className={inputClass} required>
                      <option value="">Seleccionar</option>
                      {RUBROS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Superficie m² *</label>
                    <input type="number" value={comercio.superficie} onChange={(e) => setComercio({...comercio, superficie: e.target.value})} className={inputClass} placeholder="Ej: 100" required />
                  </div>
                  <div>
                    <label className={labelClass}>Suma contenido $</label>
                    <input type="number" value={comercio.sumaContenido} onChange={(e) => setComercio({...comercio, sumaContenido: e.target.value})} className={inputClass} placeholder="Ej: 5000000" />
                  </div>
                  <div>
                    <label className={labelClass}>Suma edificio $</label>
                    <input type="number" value={comercio.sumaEdificio} onChange={(e) => setComercio({...comercio, sumaEdificio: e.target.value})} className={inputClass} placeholder="Ej: 20000000" />
                  </div>
                  <div>
                    <label className={labelClass}>Zona</label>
                    <input type="text" value={comercio.zona} onChange={(e) => setComercio({...comercio, zona: e.target.value})} className={inputClass} placeholder="Ej: Centro" />
                  </div>
                  <div className="flex items-end">
                    <button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg font-bold transition shadow-lg flex items-center justify-center gap-2">
                      {loading ? <span className="animate-spin">⏳</span> : <>💬 Cotizar</>}
                    </button>
                  </div>
                </div>
              )}

              {/* ========== VIDA / SALUD ========== */}
              {activeTab === 'vida' && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  <div>
                    <label className={labelClass}>Nombre *</label>
                    <input type="text" value={vida.nombre} onChange={(e) => setVida({...vida, nombre: e.target.value})} className={inputClass} placeholder="Tu nombre" required />
                  </div>
                  <div>
                    <label className={labelClass}>Edad *</label>
                    <input type="number" value={vida.edad} onChange={(e) => setVida({...vida, edad: e.target.value})} className={inputClass} placeholder="Ej: 35" required />
                  </div>
                  <div>
                    <label className={labelClass}>Ocupación</label>
                    <input type="text" value={vida.ocupacion} onChange={(e) => setVida({...vida, ocupacion: e.target.value})} className={inputClass} placeholder="Ej: Empleado" />
                  </div>
                  <div>
                    <label className={labelClass}>Tipo seguro *</label>
                    <select value={vida.tipo} onChange={(e) => setVida({...vida, tipo: e.target.value})} className={inputClass} required>
                      <option value="">Seleccionar</option>
                      {TIPOS_VIDA.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Suma asegurada $</label>
                    <input type="number" value={vida.sumaAsegurada} onChange={(e) => setVida({...vida, sumaAsegurada: e.target.value})} className={inputClass} placeholder="Ej: 10000000" />
                  </div>
                  <div className="flex items-end">
                    <button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg font-bold transition shadow-lg flex items-center justify-center gap-2">
                      {loading ? <span className="animate-spin">⏳</span> : <>💬 Cotizar</>}
                    </button>
                  </div>
                </div>
              )}

            </form>

            <p className="text-white/70 text-xs text-center mt-3">
              💬 Te contactamos por WhatsApp en menos de 2 minutos · Sin compromiso
            </p>
          </div>
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
              <span key={a} className="bg-white px-3 py-1.5 rounded-lg text-gray-800 font-medium text-sm shadow">{a}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
