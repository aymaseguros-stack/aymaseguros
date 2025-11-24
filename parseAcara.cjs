const fs = require('fs');
const pdf = require('pdf-parse');

const parsearAcara = async () => {
  try {
    const dataBuffer = fs.readFileSync('./public/acara_precios.pdf');
    const data = await pdf(dataBuffer);
    
    console.log('📄 PDF cargado:', data.numpages, 'páginas');
    console.log('📝 Primeras 2000 caracteres:');
    console.log(data.text.substring(0, 2000));
    
    fs.writeFileSync('./acara_text.txt', data.text);
    console.log('✅ Texto guardado en acara_text.txt');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

parsearAcara();
