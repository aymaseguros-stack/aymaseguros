import PyPDF2
import json
import re

def parsear_acara_pdf():
    vehiculos = {}
    
    try:
        with open('./public/acara_precios.pdf', 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            texto_completo = ""
            
            print(f"📄 PDF: {len(pdf_reader.pages)} páginas")
            
            # Extraer texto
            for i, page in enumerate(pdf_reader.pages):
                texto = page.extract_text()
                texto_completo += texto
                
                if i < 3:  # Primeras 3 páginas para ver formato
                    print(f"\n--- Página {i+1} (primeros 500 chars) ---")
                    print(texto[:500])
            
            # Guardar texto completo
            with open('acara_completo.txt', 'w', encoding='utf-8') as f:
                f.write(texto_completo)
            
            print("\n✅ Texto guardado en acara_completo.txt")
            print(f"📊 Total caracteres: {len(texto_completo)}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    parsear_acara_pdf()
