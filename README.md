
# DJ MK • Loja de Beats (público)

Site estático em HTML/CSS/JS puro, estilo streaming (Netflix).
- Player modal, busca e carrosséis.
- Catálogo lido de `beats.json` (edite esse arquivo ou substitua pelo export do Admin).

## Como publicar no GitHub Pages

### 1) Criar repositório
No GitHub, crie um repositório **público** chamado, por exemplo, `djmk-beats-site` (sem README).

### 2) Subir os arquivos
No seu terminal:
```bash
git clone https://github.com/SEU_USUARIO/djmk-beats-site.git
cd djmk-beats-site

# Copie os 4 arquivos para cá (ou descompacte o ZIP neste diretório):
# index.html, style.css, script.js, beats.json

git add .
git commit -m "Site público de beats"
git push origin main
```

### 3) Ativar GitHub Pages
No repositório, vá em **Settings → Pages** e selecione:
- **Build and deployment**: Source = **Deploy from a branch**
- **Branch**: `main` (pasta `/root`)

Aguarde 1–2 minutos. O site ficará em:
`https://SEU_USUARIO.github.io/djmk-beats-site/`

> Quando criarmos o Admin, ele ficará em outro repositório **privado** (ex.: `djmk-beats-admin`) que exporta o `beats.json` para você baixar e substituir aqui.
