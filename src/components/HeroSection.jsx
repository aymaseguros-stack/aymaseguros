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

// ============================================================================
// BASE DE DATOS DE VERSIONES POR MARCA/MODELO
// Versiones reales del mercado argentino
// ============================================================================

const VERSIONES = {
  // ========== TOYOTA ==========
  'TOYOTA_Hilux': ['DX 4x2 SC', 'DX 4x2 DC', 'DX 4x4 DC', 'SR 4x2 MT', 'SR 4x2 AT', 'SR 4x4 MT', 'SR 4x4 AT', 'SRV 4x2 AT', 'SRV 4x4 MT', 'SRV 4x4 AT', 'SRX 4x4 AT', 'GR-S 4x4 AT', 'Limited 4x4 AT'],
  'TOYOTA_Hilux GR-S': ['4x4 AT V6', '4x4 AT'],
  'TOYOTA_Hilux DX': ['4x2 SC', '4x2 DC', '4x4 DC'],
  'TOYOTA_Hilux SR': ['4x2 MT', '4x2 AT', '4x4 MT', '4x4 AT'],
  'TOYOTA_Hilux SRV': ['4x2 AT', '4x4 MT', '4x4 AT'],
  'TOYOTA_Hilux SRX': ['4x4 AT'],
  'TOYOTA_Corolla': ['XLI MT', 'XLI CVT', 'XEI CVT', 'SEG CVT', 'SEG Hybrid', 'GR-S Hybrid'],
  'TOYOTA_Corolla Cross': ['XLI CVT', 'XEI CVT', 'SEG CVT', 'SEG Hybrid'],
  'TOYOTA_Corolla Cross Hybrid': ['XEI', 'SEG'],
  'TOYOTA_Yaris': ['XS MT', 'XS CVT', 'XLS CVT', 'XLS Pack CVT', 'S CVT'],
  'TOYOTA_Yaris Cross': ['XS CVT', 'XLS CVT', 'XLS Pack CVT', 'S CVT', 'Limited'],
  'TOYOTA_Etios': ['X 5P', 'XS 5P', 'XLS 5P', 'X 4P', 'XS 4P', 'XLS 4P', 'Cross'],
  'TOYOTA_SW4': ['SR 4x2 AT', 'SR 4x4 AT', 'SRX 4x4 AT', 'Diamond 4x4 AT', 'GR-S 4x4 AT'],
  'TOYOTA_RAV4': ['XLE CVT', 'Limited CVT', 'Adventure AWD'],
  'TOYOTA_RAV4 Hybrid': ['XLE', 'Limited'],
  'TOYOTA_Camry': ['3.5 V6 AT'],
  'TOYOTA_Land Cruiser': ['VX AT', 'VX-R AT', 'GR-S AT'],
  'TOYOTA_Land Cruiser Prado': ['TX AT', 'TX-L AT', 'VX AT'],

  // ========== FORD ==========
  'FORD_Ranger': ['XL 4x2 SC MT', 'XL 4x2 DC MT', 'XL 4x4 DC MT', 'XLS 4x2 MT', 'XLS 4x2 AT', 'XLS 4x4 MT', 'XLS 4x4 AT', 'XLT 4x2 AT', 'XLT 4x4 AT', 'Limited 4x2 AT', 'Limited 4x4 AT', 'Wildtrak 4x4 AT', 'Raptor 4x4 AT'],
  'FORD_Ranger Raptor': ['3.0 V6 AT'],
  'FORD_Ranger XLT': ['4x2 AT', '4x4 AT'],
  'FORD_Ranger Limited': ['4x2 AT', '4x4 AT'],
  'FORD_Ranger Wildtrak': ['4x4 AT'],
  'FORD_Territory': ['Trend 1.5T', 'Titanium 1.5T'],
  'FORD_Bronco Sport': ['Big Bend', 'Outer Banks', 'Badlands', 'Wildtrak'],
  'FORD_Bronco': ['Base', 'Big Bend', 'Black Diamond', 'Outer Banks', 'Badlands', 'Wildtrak', 'Raptor'],
  'FORD_Explorer': ['XLT 4x4', 'Limited 4x4', 'ST-Line 4x4', 'Platinum 4x4'],
  'FORD_Mustang': ['EcoBoost 2.3T', 'GT 5.0 V8', 'Mach 1', 'Shelby GT500'],
  'FORD_Mustang Mach-E': ['Standard Range', 'Extended Range', 'GT'],
  'FORD_EcoSport': ['SE 1.5 MT', 'SE 1.5 AT', 'Titanium 1.5 AT', 'Storm 2.0 4x4 AT'],
  'FORD_Kuga': ['SEL 1.5T', 'Titanium 1.5T', 'ST-Line 2.5 Hybrid'],
  'FORD_F-150': ['XL 4x2', 'XLT 4x4', 'Lariat 4x4', 'Platinum 4x4', 'Limited 4x4', 'Raptor 4x4'],

  // ========== VOLKSWAGEN ==========
  'VOLKSWAGEN_Amarok': ['Trendline 4x2 MT', 'Trendline 4x4 MT', 'Comfortline 4x2 AT', 'Comfortline 4x4 AT', 'Highline 4x2 AT', 'Highline 4x4 AT', 'Extreme 4x4 AT', 'V6 Comfortline 4x4', 'V6 Highline 4x4', 'V6 Extreme 4x4', 'V6 Black Style'],
  'VOLKSWAGEN_Amarok V6': ['Comfortline 4x4', 'Highline 4x4', 'Extreme 4x4', 'Black Style'],
  'VOLKSWAGEN_Taos': ['Trendline 1.4T MT', 'Comfortline 1.4T AT', 'Highline 1.4T AT', 'Hero Edition 1.4T AT'],
  'VOLKSWAGEN_T-Cross': ['Trendline 1.6 MT', 'Trendline 1.6 AT', 'Comfortline 1.6 AT', 'Highline 1.4T AT', 'Hero 1.4T AT'],
  'VOLKSWAGEN_Tiguan': ['Trendline 1.4T', 'Comfortline 1.4T', 'Highline 1.4T', 'R-Line 2.0T'],
  'VOLKSWAGEN_Tiguan Allspace': ['Trendline 1.4T', 'Comfortline 1.4T', 'Highline 2.0T', 'R-Line 2.0T'],
  'VOLKSWAGEN_Polo': ['Track 1.6 MSI', 'Trendline 1.6 MSI', 'Comfortline 1.6 MSI', 'Comfortline 1.0 TSI', 'Highline 1.0 TSI', 'GTS 1.4 TSI'],
  'VOLKSWAGEN_Polo Track': ['1.6 MSI MT'],
  'VOLKSWAGEN_Polo GTS': ['1.4 TSI AT'],
  'VOLKSWAGEN_Virtus': ['Trendline 1.6 MSI', 'Comfortline 1.6 MSI', 'Comfortline 1.0 TSI', 'Highline 1.0 TSI', 'GTS 1.4 TSI'],
  'VOLKSWAGEN_Virtus GTS': ['1.4 TSI AT'],
  'VOLKSWAGEN_Nivus': ['Comfortline 1.0 TSI', 'Highline 1.0 TSI', 'Hero 1.0 TSI'],
  'VOLKSWAGEN_Golf': ['250 TSI Comfortline', '250 TSI Highline', 'GTI 2.0 TSI', 'R 2.0 TSI 4Motion'],
  'VOLKSWAGEN_Golf GTI': ['2.0 TSI MT', '2.0 TSI DSG'],
  'VOLKSWAGEN_Golf R': ['2.0 TSI 4Motion'],
  'VOLKSWAGEN_Vento': ['Comfortline 1.4 TSI', 'Highline 1.4 TSI', 'GLI 2.0 TSI'],
  'VOLKSWAGEN_Saveiro': ['Trendline CS', 'Trendline CD', 'Comfortline CS', 'Comfortline CD', 'Cross CS', 'Cross CD'],
  'VOLKSWAGEN_Saveiro Cross': ['CS', 'CD'],

  // ========== FIAT ==========
  'FIAT_Cronos': ['Like 1.3 MT', 'Drive 1.3 MT', 'Drive 1.3 AT', 'Drive 1.8 MT', 'Drive 1.8 AT', 'Precision 1.8 AT', 'Impetus 1.3T AT'],
  'FIAT_Argo': ['Like 1.3', 'Drive 1.3', 'Drive 1.8', 'Precision 1.8', 'Trekking 1.3', 'Trekking 1.8', 'HGT 1.8'],
  'FIAT_Argo Trekking': ['1.3 MT', '1.8 MT', '1.8 AT'],
  'FIAT_Pulse': ['Drive 1.3 MT', 'Drive 1.3 AT', 'Drive 1.3 CVT', 'Audace 1.0T AT', 'Impetus 1.0T AT'],
  'FIAT_Pulse Impetus': ['1.0T AT'],
  'FIAT_Fastback': ['Audace 1.0T AT', 'Impetus 1.0T AT', 'Limited 1.0T AT', 'Abarth 1.3T AT'],
  'FIAT_Fastback Abarth': ['1.3T AT'],
  'FIAT_Strada': ['Endurance 1.4 CS', 'Freedom 1.3 CS', 'Freedom 1.3 CD', 'Volcano 1.3 CD', 'Volcano 1.3T CD', 'Ranch 1.3T CD', 'Ultra 1.3T CD'],
  'FIAT_Strada Volcano': ['1.3 MT CD', '1.3T MT CD'],
  'FIAT_Strada Ranch': ['1.3T MT CD'],
  'FIAT_Toro': ['Endurance 1.3T MT', 'Freedom 1.3T AT', 'Volcano 1.3T AT', 'Ranch 2.0TD AT 4x4', 'Ultra 2.0TD AT 4x4'],
  'FIAT_Toro Ultra': ['2.0 TD AT 4x4'],
  'FIAT_Toro Ranch': ['2.0 TD AT 4x4'],
  'FIAT_Mobi': ['Like', 'Trekking', 'Way'],
  'FIAT_500': ['Pop', 'Lounge', 'Cult', 'Abarth'],

  // ========== CHEVROLET ==========
  'CHEVROLET_S10': ['LS 4x2 SC MT', 'LS 4x2 DC MT', 'LS 4x4 DC MT', 'LT 4x2 MT', 'LT 4x2 AT', 'LT 4x4 MT', 'LT 4x4 AT', 'LTZ 4x4 AT', 'High Country 4x4 AT', 'Z71 4x4 AT'],
  'CHEVROLET_S10 Z71': ['4x4 AT'],
  'CHEVROLET_Montana': ['LS 1.2T MT', 'LT 1.2T MT', 'LT 1.2T AT', 'LTZ 1.2T AT', 'Premier 1.2T AT'],
  'CHEVROLET_Tracker': ['LT 1.2T MT', 'LT 1.2T AT', 'LTZ 1.2T AT', 'Premier 1.2T AT', 'RS 1.2T AT', 'Midnight 1.2T AT'],
  'CHEVROLET_Tracker RS': ['1.2T AT'],
  'CHEVROLET_Onix': ['Joy 1.0', 'Joy Plus 1.0', 'LT 1.0T MT', 'LT 1.0T AT', 'LTZ 1.0T AT', 'Premier 1.0T AT', 'Premier II 1.0T AT', 'RS 1.0T AT', 'Midnight 1.0T AT'],
  'CHEVROLET_Onix Plus': ['Joy', 'LT MT', 'LT AT', 'LTZ AT', 'Premier AT'],
  'CHEVROLET_Onix RS': ['1.0T AT'],
  'CHEVROLET_Cruze': ['LT 1.4T MT', 'LT 1.4T AT', 'LTZ 1.4T AT', 'Premier 1.4T AT', 'RS 1.4T AT', 'Midnight 1.4T AT'],
  'CHEVROLET_Cruze RS': ['1.4T AT'],
  'CHEVROLET_Spin': ['LT 1.8 MT', 'LT 1.8 AT', 'LTZ 1.8 AT', 'Premier 1.8 AT', 'Activ 1.8 AT'],
  'CHEVROLET_Equinox': ['LT 1.5T AT', 'Premier 1.5T AT', 'RS 1.5T AT'],
  'CHEVROLET_Equinox RS': ['1.5T AT AWD'],
  'CHEVROLET_Tahoe': ['LT 4x4', 'Premier 4x4', 'RST 4x4', 'High Country 4x4'],
  'CHEVROLET_Camaro': ['LT 2.0T', 'SS 6.2 V8', 'ZL1 6.2 V8 SC'],

  // ========== PEUGEOT ==========
  'PEUGEOT_208': ['Like 1.6', 'Active 1.6', 'Active Pack 1.6', 'Allure 1.6', 'Feline 1.6', 'GT 1.6 THP'],
  'PEUGEOT_208 GT': ['1.6 THP AT'],
  'PEUGEOT_208 Allure': ['1.6 MT', '1.6 AT'],
  'PEUGEOT_2008': ['Active 1.6', 'Active Pack 1.6', 'Allure 1.6', 'Allure Pack 1.6', 'Feline 1.6 THP', 'GT 1.6 THP'],
  'PEUGEOT_2008 GT': ['1.6 THP AT'],
  'PEUGEOT_308': ['Active 1.6', 'Allure 1.6', 'Allure Pack 1.6', 'Feline 1.6 THP', 'GT 1.6 THP'],
  'PEUGEOT_308 GT': ['1.6 THP AT'],
  'PEUGEOT_3008': ['Active 1.6 THP', 'Allure 1.6 THP', 'Allure Pack 1.6 THP', 'GT 1.6 THP', 'GT Pack 1.6 THP', 'Hybrid4'],
  'PEUGEOT_3008 GT': ['1.6 THP AT', 'Hybrid4'],
  'PEUGEOT_408': ['Allure 1.6 THP', 'Allure Pack 1.6 THP', 'GT 1.6 THP'],
  'PEUGEOT_5008': ['Allure 1.6 THP', 'Allure Pack 1.6 THP', 'GT 1.6 THP'],
  'PEUGEOT_Partner': ['Confort 1.6', 'Furgon 1.6', 'Patagonica 1.6'],

  // ========== RENAULT ==========
  'RENAULT_Sandero': ['Life 1.6', 'Zen 1.6', 'Intens 1.6', 'Intens CVT'],
  'RENAULT_Sandero Stepway': ['Zen 1.6', 'Intens 1.6', 'Intens CVT'],
  'RENAULT_Logan': ['Life 1.6', 'Zen 1.6', 'Intens 1.6'],
  'RENAULT_Duster': ['Zen 1.6', 'Intens 1.6', 'Iconic 1.3T CVT', 'Outsider 1.3T CVT 4x4'],
  'RENAULT_Captur': ['Zen 1.6', 'Intens 1.3T CVT', 'Iconic 1.3T CVT'],
  'RENAULT_Koleos': ['Zen 2.5', 'Intens 2.5', 'Iconic 2.5 4x4'],
  'RENAULT_Arkana': ['Zen 1.3T', 'Intens 1.3T', 'Iconic 1.3T', 'RS Line 1.3T'],
  'RENAULT_Kwid': ['Life 1.0', 'Zen 1.0', 'Intens 1.0', 'Outsider 1.0'],
  'RENAULT_Kwid Outsider': ['1.0 MT'],
  'RENAULT_Alaskan': ['Confort 2.3 4x2', 'Confort 2.3 4x4', 'Intens 2.3 4x4', 'Iconic 2.3 4x4'],
  'RENAULT_Kangoo': ['Express Confort 1.5 dCi', 'Stepway 1.5 dCi'],

  // ========== HYUNDAI ==========
  'HYUNDAI_Tucson': ['Comfort 2.0', 'Premium 2.0', 'Style 2.0', 'N Line 1.6T', 'Limited 2.0'],
  'HYUNDAI_Creta': ['Comfort 1.6', 'Premium 1.6', 'Limited 1.6', 'Ultimate 1.0T'],
  'HYUNDAI_Santa Fe': ['Style 2.4', 'Premium 2.4', 'N Line 2.5T', 'Limited 2.5T'],
  'HYUNDAI_Kona': ['Comfort 2.0', 'Premium 2.0', 'Ultimate 1.6T', 'N 2.0T', 'Electric'],
  'HYUNDAI_HB20': ['Comfort 1.0', 'Style 1.0', 'Premium 1.0', 'X Premium 1.0'],
  'HYUNDAI_HB20 X': ['Premium 1.0'],
  'HYUNDAI_Elantra': ['Comfort 2.0', 'Premium 2.0', 'N 2.0T'],
  'HYUNDAI_i30': ['Style 2.0', 'N 2.0T', 'N Performance 2.0T'],
  'HYUNDAI_Venue': ['Style 1.6', 'Premium 1.6'],
  'HYUNDAI_Ioniq 5': ['Standard Range', 'Long Range', 'Long Range AWD'],
  'HYUNDAI_Grand i10': ['Base 1.2', 'GL 1.2', 'GLS 1.2'],

  // ========== KIA ==========
  'KIA_Seltos': ['LX 1.6', 'EX 1.6', 'EX Premium 1.6', 'SX 1.6T', 'GT-Line 1.6T'],
  'KIA_Sportage': ['LX 2.0', 'EX 2.0', 'EX Pack 2.0', 'SX 2.0T', 'GT-Line 2.0T', 'X-Line 2.0T'],
  'KIA_Sorento': ['LX 2.5', 'EX 2.5', 'EX Pack 2.5', 'SX 2.5T', 'GT-Line 2.5T'],
  'KIA_Cerato': ['LX 2.0', 'EX 2.0', 'SX 2.0', 'GT-Line 2.0', 'GT 1.6T'],
  'KIA_Cerato GT': ['1.6T AT'],
  'KIA_Carnival': ['LX 3.5 V6', 'EX 3.5 V6', 'SX 3.5 V6'],
  'KIA_Picanto': ['LX 1.0', 'EX 1.0', 'GT-Line 1.0T'],
  'KIA_Rio': ['LX 1.4', 'EX 1.4', 'SX 1.4'],
  'KIA_Stonic': ['LX 1.4', 'EX 1.4', 'GT-Line 1.0T'],
  'KIA_EV6': ['Standard', 'Long Range', 'Long Range AWD', 'GT'],
  'KIA_Stinger': ['GT-Line 2.0T', 'GT 3.3T V6'],

  // ========== HONDA ==========
  'HONDA_HR-V': ['LX CVT', 'EX CVT', 'EXL CVT', 'Touring CVT'],
  'HONDA_CR-V': ['LX CVT', 'EX CVT', 'EXL CVT', 'Touring CVT'],
  'HONDA_WR-V': ['LX MT', 'LX CVT', 'EX CVT', 'EXL CVT'],
  'HONDA_Civic': ['LX CVT', 'EX CVT', 'EXL CVT', 'Touring CVT', 'Si 1.5T', 'Type R 2.0T'],
  'HONDA_Civic Si': ['1.5T MT'],
  'HONDA_Civic Type R': ['2.0T MT'],
  'HONDA_City': ['LX CVT', 'EX CVT', 'EXL CVT'],
  'HONDA_City Hatchback': ['LX CVT', 'EX CVT', 'EXL CVT'],
  'HONDA_Accord': ['EX CVT', 'EXL CVT', 'Touring CVT', 'Hybrid'],

  // ========== NISSAN ==========
  'NISSAN_Frontier': ['S 4x2 MT', 'SE 4x4 MT', 'XE 4x4 MT', 'XE 4x4 AT', 'LE 4x4 AT', 'Attack 4x4 AT', 'Pro-4X 4x4 AT'],
  'NISSAN_Frontier Attack': ['4x4 AT'],
  'NISSAN_Frontier Pro-4X': ['4x4 AT'],
  'NISSAN_Kicks': ['Sense 1.6', 'Advance 1.6', 'Exclusive 1.6', 'e-Power'],
  'NISSAN_Sentra': ['Sense 2.0', 'Advance 2.0', 'Exclusive 2.0', 'SR 2.0'],
  'NISSAN_Sentra SR': ['2.0 CVT'],
  'NISSAN_Versa': ['Sense 1.6', 'Advance 1.6', 'Exclusive 1.6'],
  'NISSAN_X-Trail': ['Sense 2.5', 'Advance 2.5', 'Exclusive 2.5', 'e-Power'],
  'NISSAN_Qashqai': ['Sense 2.0', 'Advance 2.0', 'Exclusive 2.0'],

  // ========== JEEP ==========
  'JEEP_Renegade': ['Sport 1.8 MT', 'Sport 1.8 AT', 'Longitude 1.8 AT', 'Longitude 1.3T AT', 'Limited 1.3T AT', 'Trailhawk 1.3T AT 4x4'],
  'JEEP_Renegade Trailhawk': ['1.3T AT 4x4'],
  'JEEP_Compass': ['Sport 1.3T MT', 'Sport 1.3T AT', 'Longitude 1.3T AT', 'Limited 1.3T AT', 'Limited 1.3T AT 4x4', 'Trailhawk 1.3T AT 4x4', '4xe PHEV'],
  'JEEP_Compass Trailhawk': ['1.3T AT 4x4'],
  'JEEP_Commander': ['Limited 1.3T AT', 'Limited 1.3T AT 4x4', 'Overland 2.0TD AT 4x4'],
  'JEEP_Grand Cherokee': ['Laredo 3.6 V6', 'Limited 3.6 V6', 'Overland 3.6 V6', 'Summit 5.7 V8', 'SRT 6.4 V8', 'Trackhawk 6.2 V8 SC', '4xe PHEV'],
  'JEEP_Grand Cherokee L': ['Laredo 3.6 V6', 'Limited 3.6 V6', 'Overland 3.6 V6', 'Summit 5.7 V8'],
  'JEEP_Wrangler': ['Sport 3.6 V6', 'Sahara 3.6 V6', 'Rubicon 3.6 V6', 'Rubicon 392 6.4 V8', '4xe PHEV'],
  'JEEP_Wrangler Rubicon': ['3.6 V6', '392 6.4 V8'],
  'JEEP_Gladiator': ['Sport 3.6 V6', 'Overland 3.6 V6', 'Rubicon 3.6 V6'],
  'JEEP_Gladiator Rubicon': ['3.6 V6 MT', '3.6 V6 AT'],

  // ========== BMW ==========
  'BMW_Serie 1': ['118i', '120i', '128ti', 'M135i xDrive'],
  'BMW_Serie 2 Gran Coupe': ['218i', '220i', '220i M Sport', 'M235i xDrive'],
  'BMW_Serie 3': ['318i', '320i', '320i M Sport', '330i', '330i M Sport', '330e', 'M340i', 'M340i xDrive'],
  'BMW_Serie 4 Coupe': ['420i', '430i', '430i M Sport', 'M440i xDrive'],
  'BMW_Serie 4 Gran Coupe': ['420i', '430i', '430i M Sport', 'M440i xDrive'],
  'BMW_Serie 5': ['520i', '530i', '530i M Sport', '540i', '545e', 'M550i xDrive'],
  'BMW_Serie 7': ['740i', '750i xDrive', '760i xDrive', 'i7 xDrive60'],
  'BMW_X1': ['sDrive18i', 'sDrive20i', 'xDrive25i', 'xDrive25e'],
  'BMW_X2': ['sDrive18i', 'sDrive20i', 'xDrive25i', 'M35i'],
  'BMW_X3': ['sDrive20i', 'xDrive20i', 'xDrive30i', 'xDrive30e', 'M40i', 'M Competition'],
  'BMW_X4': ['xDrive20i', 'xDrive30i', 'M40i', 'M Competition'],
  'BMW_X5': ['xDrive40i', 'xDrive45e', 'xDrive50i', 'M50i', 'M Competition'],
  'BMW_X6': ['xDrive40i', 'M50i', 'M Competition'],
  'BMW_X7': ['xDrive40i', 'xDrive50i', 'M60i xDrive'],
  'BMW_Z4': ['sDrive20i', 'sDrive30i', 'M40i'],
  'BMW_M2': ['Competition', 'CS'],
  'BMW_M3': ['Competition', 'CS', 'Competition xDrive'],
  'BMW_M4': ['Competition', 'Competition xDrive', 'CSL'],
  'BMW_M5': ['Competition', 'CS'],
  'BMW_i4': ['eDrive35', 'eDrive40', 'M50'],
  'BMW_iX': ['xDrive40', 'xDrive50', 'M60'],
  'BMW_iX3': ['eDrive'],

  // ========== MERCEDES-BENZ ==========
  'MERCEDES-BENZ_A 200': ['Progressive', 'AMG Line'],
  'MERCEDES-BENZ_A 250': ['Progressive', 'AMG Line'],
  'MERCEDES-BENZ_A 35 AMG': ['4Matic'],
  'MERCEDES-BENZ_A 45 AMG': ['S 4Matic+'],
  'MERCEDES-BENZ_C 200': ['Avantgarde', 'AMG Line'],
  'MERCEDES-BENZ_C 300': ['Avantgarde', 'AMG Line'],
  'MERCEDES-BENZ_C 43 AMG': ['4Matic'],
  'MERCEDES-BENZ_C 63 AMG': ['S'],
  'MERCEDES-BENZ_CLA 200': ['Progressive', 'AMG Line'],
  'MERCEDES-BENZ_CLA 250': ['AMG Line'],
  'MERCEDES-BENZ_CLA 35 AMG': ['4Matic'],
  'MERCEDES-BENZ_CLA 45 AMG': ['S 4Matic+'],
  'MERCEDES-BENZ_E 200': ['Avantgarde', 'AMG Line'],
  'MERCEDES-BENZ_E 300': ['Avantgarde', 'AMG Line'],
  'MERCEDES-BENZ_E 53 AMG': ['4Matic+'],
  'MERCEDES-BENZ_GLA 200': ['Progressive', 'AMG Line'],
  'MERCEDES-BENZ_GLA 250': ['4Matic AMG Line'],
  'MERCEDES-BENZ_GLA 35 AMG': ['4Matic'],
  'MERCEDES-BENZ_GLA 45 AMG': ['S 4Matic+'],
  'MERCEDES-BENZ_GLB 200': ['Progressive', 'AMG Line'],
  'MERCEDES-BENZ_GLB 250': ['4Matic AMG Line'],
  'MERCEDES-BENZ_GLC 200': ['Avantgarde', 'AMG Line'],
  'MERCEDES-BENZ_GLC 300': ['4Matic AMG Line'],
  'MERCEDES-BENZ_GLC 43 AMG': ['4Matic'],
  'MERCEDES-BENZ_GLE 300': ['d 4Matic'],
  'MERCEDES-BENZ_GLE 350': ['d 4Matic', '4Matic'],
  'MERCEDES-BENZ_GLE 450': ['4Matic AMG Line'],
  'MERCEDES-BENZ_GLE 53 AMG': ['4Matic+'],
  'MERCEDES-BENZ_GLE 63 AMG': ['S 4Matic+'],
  'MERCEDES-BENZ_G 500': ['AMG Line'],
  'MERCEDES-BENZ_G 63 AMG': ['4Matic'],

  // ========== AUDI ==========
  'AUDI_A3': ['35 TFSI', '35 TFSI S line', '40 TFSI quattro', 'S3 quattro'],
  'AUDI_A3 Sportback': ['35 TFSI', '35 TFSI S line', '40 TFSI quattro', 'S3 quattro', 'RS3 quattro'],
  'AUDI_A4': ['40 TFSI', '40 TFSI S line', '45 TFSI quattro', 'S4 TDI', 'RS4 Avant'],
  'AUDI_A5 Sportback': ['40 TFSI', '40 TFSI S line', '45 TFSI quattro', 'S5 TDI', 'RS5'],
  'AUDI_A6': ['45 TFSI', '45 TFSI S line', '55 TFSI quattro', 'S6 TDI', 'RS6 Avant'],
  'AUDI_A7': ['55 TFSI quattro', 'S7 TDI', 'RS7'],
  'AUDI_Q2': ['35 TFSI', '35 TFSI S line', '40 TFSI quattro'],
  'AUDI_Q3': ['35 TFSI', '35 TFSI S line', '40 TFSI quattro', 'RSQ3'],
  'AUDI_Q3 Sportback': ['35 TFSI', '35 TFSI S line', '40 TFSI quattro', 'RSQ3'],
  'AUDI_Q5': ['40 TFSI', '45 TFSI quattro', '55 TFSIe quattro', 'SQ5 TDI'],
  'AUDI_Q7': ['45 TFSI', '55 TFSI quattro', 'SQ7 TDI'],
  'AUDI_Q8': ['55 TFSI quattro', 'SQ8 TDI', 'RSQ8'],
  'AUDI_e-tron': ['50 quattro', '55 quattro', 'S quattro'],
  'AUDI_TT': ['45 TFSI', '45 TFSI quattro', 'TTS'],

  // ========== MITSUBISHI ==========
  'MITSUBISHI_L200': ['GLX 4x2 SC', 'GLX 4x2 DC', 'GLX 4x4 DC', 'GLS 4x4 MT', 'GLS 4x4 AT', 'HPE 4x4 AT', 'HPE-S 4x4 AT'],
  'MITSUBISHI_L200 Triton': ['GLS 4x4 MT', 'GLS 4x4 AT', 'HPE 4x4 AT', 'HPE-S 4x4 AT'],
  'MITSUBISHI_Outlander': ['ES', 'SE', 'SEL', 'GT', 'PHEV'],
  'MITSUBISHI_Outlander PHEV': ['GT-S', 'Instyle'],
  'MITSUBISHI_Eclipse Cross': ['ES', 'SE', 'SEL', 'SEL S-AWC', 'PHEV'],
  'MITSUBISHI_ASX': ['ES', 'SE', 'SEL'],
  'MITSUBISHI_Pajero Sport': ['GLS', 'HPE', 'HPE-S'],

  // ========== RAM ==========
  'RAM_1500': ['Big Horn 5.7 V8', 'Laramie 5.7 V8', 'Limited 5.7 V8', 'Rebel 5.7 V8', 'TRX 6.2 V8 SC'],
  'RAM_1500 Classic': ['Express 5.7 V8', 'SLT 5.7 V8', 'Warlock 5.7 V8'],
  'RAM_1500 Rebel': ['5.7 V8 4x4'],
  'RAM_1500 Laramie': ['5.7 V8 4x4'],
  'RAM_1500 Limited': ['5.7 V8 4x4'],
  'RAM_2500': ['Laramie 6.7 TD', 'Limited 6.7 TD', 'Power Wagon 6.4 V8'],
  'RAM_2500 Laramie': ['6.7 TD 4x4'],

  // ========== OTROS ==========
  'SSANGYONG_Korando': ['LX', 'EX', 'Limited'],
  'SSANGYONG_Rexton': ['RX 2.2 TD', 'RX7 2.2 TD', 'Platinum 2.2 TD'],
  'SSANGYONG_Musso': ['LX', 'EX', 'Limited', 'Grand Musso'],

  'SUBARU_Forester': ['2.0i', '2.0i-L', '2.0i-S', '2.0i-S EyeSight', 'Sport'],
  'SUBARU_Outback': ['2.5i', '2.5i-S', '2.5i-S EyeSight', 'XT'],
  'SUBARU_XV': ['1.6i', '2.0i', '2.0i-S', '2.0i-S EyeSight'],
  'SUBARU_WRX': ['Base', 'Premium', 'Limited', 'STI'],
  'SUBARU_BRZ': ['Base', 'Premium', 'tS'],

  'MAZDA_CX-30': ['i 2.0', 'i Grand Touring 2.0', 'i Signature 2.5'],
  'MAZDA_CX-5': ['i 2.0', 'i Sport 2.5', 'i Grand Touring 2.5', 'i Signature 2.5'],
  'MAZDA_CX-50': ['Preferred', 'Premium', 'Premium Plus', 'Turbo'],
  'MAZDA_3': ['i 2.0', 'i Sport 2.5', 'i Grand Touring 2.5', 'i Signature 2.5'],
  'MAZDA_MX-5': ['i Sport', 'i Grand Touring', 'RF Grand Touring'],

  'MG_ZS': ['Style 1.5', 'Comfort 1.5', 'Luxury 1.5', 'Excite 1.3T'],
  'MG_ZS EV': ['Standard', 'Luxury', 'Exclusive'],
  'MG_HS': ['Style 1.5T', 'Comfort 1.5T', 'Luxury 2.0T', 'PHEV'],
  'MG_MG4': ['Standard', 'Comfort', 'Luxury', 'XPOWER'],

  'CHERY_Tiggo 4': ['Comfort', 'Luxury', 'Pro Comfort', 'Pro Luxury'],
  'CHERY_Tiggo 7': ['Comfort', 'Luxury', 'Pro Comfort', 'Pro Luxury'],
  'CHERY_Tiggo 8': ['Comfort', 'Luxury', 'Pro Comfort', 'Pro Luxury'],
  'CHERY_Omoda 5': ['Comfort', 'Luxury', 'GT'],

  'BYD_Dolphin': ['Standard', 'Comfort', 'Design'],
  'BYD_Seal': ['Dynamic', 'Premium', 'Performance'],
  'BYD_Song Plus': ['Comfort', 'Flagship'],
  'BYD_Yuan Plus': ['GL', 'GS'],

  'HAVAL_H6': ['Comfort', 'Supreme', 'Supreme+', 'GT', 'Hybrid'],
  'HAVAL_Jolion': ['Comfort', 'Premium', 'Luxury', 'Hybrid'],
  'HAVAL_Dargo': ['Supreme', 'Supreme+'],

  'GWM_Ora 03': ['Standard', 'Luxury', 'GT'],
  'GWM_Ora 07': ['Standard', 'Performance'],
  'GWM_Tank 300': ['Luxury', 'Flagship'],
  'GWM_Tank 500': ['Hybrid', 'Hybrid Flagship'],

  'CUPRA_Formentor': ['VZ 2.0 TSI', 'VZ5 2.5 TSI', 'e-Hybrid'],
  'CUPRA_Leon': ['VZ 2.0 TSI', 'VZ e-Hybrid'],
  'CUPRA_Born': ['58 kWh', '77 kWh', 'VZ 77 kWh'],

  'CITROEN_C3': ['Live 1.2', 'Feel 1.2', 'Feel Pack 1.6', 'Shine 1.6'],
  'CITROEN_C3 Aircross': ['Live 1.6', 'Feel 1.6', 'Feel Pack 1.6', 'Shine 1.6', 'Shine Pack 1.6'],
  'CITROEN_C4 Cactus': ['Live 1.6', 'Feel 1.6', 'Feel Pack 1.6', 'Shine 1.6'],
  'CITROEN_C5 Aircross': ['Feel 1.6 THP', 'Feel Pack 1.6 THP', 'Shine 1.6 THP', 'Hybrid'],

  // === VERSIONES GENÉRICAS PARA FALLBACK ===
  'GENERICA_AUTO': ['Base', 'Comfort', 'Style', 'Premium', 'Luxury', 'Sport', 'Active', 'Trend', 'Life', 'Titanium', 'Limited', 'Highline', 'Intense', 'Sense', 'Full'],
  'GENERICA_MOTO': ['Standard', 'Base', 'Plus', 'Sport', 'Racing', 'Adventure', 'Touring', 'Custom', 'Café Racer', 'Scrambler', 'Pro', 'R', 'S'],
  'GENERICA_CAMION': ['4x2 Tractor', '4x2 Chasis', '6x2 Tractor', '6x4 Tractor', '6x4 Volcador', '8x4 Mixer', '8x4 Volcador', 'Chasis Largo', 'Chasis Corto', 'Cabina Simple', 'Cabina Doble', 'Furgón', 'Volcador', 'Hormigonero']
};

// Función para obtener versiones según marca/modelo o genéricas
const getVersiones = (marca, modelo, tipoVehiculo) => {
  // 1. Buscar versión específica marca_modelo
  const key = `${marca}_${modelo}`;
  if (VERSIONES[key]) {
    return VERSIONES[key];
  }
  
  // 2. Buscar versión genérica por tipo
  if (tipoVehiculo === 'moto') {
    return VERSIONES['GENERICA_MOTO'];
  }
  if (tipoVehiculo === 'camion') {
    return VERSIONES['GENERICA_CAMION'];
  }
  
  // 3. Fallback: versiones genéricas auto/camioneta
  return VERSIONES['GENERICA_AUTO'];
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
  const [vehiculo, setVehiculo] = useState({ tipo: '', marca: '', modelo: '', version: '', año: '', cobertura: '' });
  const [hogar, setHogar] = useState({ tipo: '', metros: '', zona: '', antiguedad: '', cobertura: '' });
  const [art, setArt] = useState({ razonSocial: '', cuit: '', actividad: '', empleados: '', masaSalarial: '', provincia: '' });
  const [comercio, setComercio] = useState({ tipo: '', rubro: '', superficie: '', sumaContenido: '', sumaEdificio: '', zona: '' });
  const [vida, setVida] = useState({ nombre: '', edad: '', ocupacion: '', sumaAsegurada: '', tipo: '' });

  // Dinámicos para vehículos
  const [marcasDisp, setMarcasDisp] = useState([]);
  const [modelosDisp, setModelosDisp] = useState([]);
  const [versionesDisp, setVersionesDisp] = useState([]);

  useEffect(() => {
    if (vehiculo.tipo) {
      setMarcasDisp(MARCAS[vehiculo.tipo] || []);
      setVehiculo(p => ({ ...p, marca: '', modelo: '', version: '' }));
    }
  }, [vehiculo.tipo]);

  useEffect(() => {
    if (vehiculo.marca) {
      setModelosDisp(MODELOS[vehiculo.marca] || MODELOS.default);
      setVehiculo(p => ({ ...p, modelo: '', version: '' }));
    }
  }, [vehiculo.marca]);

  // NUEVO: Actualizar versiones cuando cambia el modelo
  useEffect(() => {
    if (vehiculo.modelo && vehiculo.marca) {
      const versiones = getVersiones(vehiculo.marca, vehiculo.modelo, vehiculo.tipo);
      setVersionesDisp(versiones);
      setVehiculo(p => ({ ...p, version: '' }));
    }
  }, [vehiculo.modelo, vehiculo.marca, vehiculo.tipo]);

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
        mensaje = `🚗 *COTIZACIÓN VEHÍCULO*\n\nTipo: ${vehiculo.tipo}\nMarca: ${vehiculo.marca}\nModelo: ${vehiculo.modelo}${vehiculo.version ? `\nVersión: ${vehiculo.version}` : ''}\nAño: ${vehiculo.año}\nCobertura: ${COBERTURAS_AUTO.find(c => c.value === vehiculo.cobertura)?.label}`;
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
        <div className="max-w-5xl mx-auto">
          
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
              
              {/* ========== VEHÍCULOS (CON VERSIÓN) ========== */}
              {activeTab === 'vehiculos' && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
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
                  {/* NUEVO: CAMPO VERSIÓN */}
                  <div>
                    <label className={labelClass}>Versión</label>
                    <select value={vehiculo.version} onChange={(e) => setVehiculo({...vehiculo, version: e.target.value})} className={inputClass} disabled={!vehiculo.modelo}>
                      <option value="">Opcional</option>
                      {versionesDisp.map(v => <option key={v} value={v}>{v}</option>)}
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
