# ivanzv-z.github.io

Web de Iván Z: https://ivanzv-z.github.io

GitHub Pages la compila sola con Jekyll cada vez que subes cambios. No hay que instalar nada.

## Publicar un apunte nuevo

1. Copia `_drafts/plantilla-apunte.md` a la carpeta `_posts/`.
2. Cámbiale el nombre a `AÑO-MES-DÍA-nombre-corto.md`, por ejemplo `2026-11-05-wireshark-filtros.md`.
   La parte `nombre-corto` será la dirección: `ivanzv-z.github.io/apuntes/wireshark-filtros/`.
3. Arriba del todo cambia `title`, `date` y `description`.
4. Escribe el texto debajo de la segunda línea `---`.
5. Sube los cambios (ver abajo). En uno o dos minutos aparece en la portada.

### Imágenes

1. Crea una carpeta `assets/apuntes/nombre-corto/` con el mismo nombre del apunte.
2. Mete ahí las capturas (`.png`, `.jpg` o `.webp`). Mejor nombres sin espacios ni tildes: `paso-1.png`.
3. En el apunte, ponlas así:

```markdown
![Qué se ve en la imagen](/assets/apuntes/nombre-corto/paso-1.png)
*Pie de foto opcional, en cursiva justo debajo.*
```

En la web, al pulsar una imagen se abre en grande.

Para poner una imagen grande arriba del todo del artículo, añade esto en la cabecera:

```yaml
image: /assets/apuntes/nombre-corto/portada.png
image_alt: Qué se ve en la imagen
```

## Añadir una app al taller

Edita `_data/taller.yml`, copia un bloque entero y cambia los textos. Se pinta sola en la portada.

## Cambiar el enlace de descarga de ZIntercept

Está en `_config.yml`, en `zintercept_download`.

## Subir cambios

```bash
git add .
git commit -m "Nuevo apunte: título"
git push
```

## Estructura

| Carpeta / archivo | Qué es |
| --- | --- |
| `index.html` | Portada |
| `_posts/` | Apuntes publicados |
| `_drafts/` | Borradores y plantilla (no se publican) |
| `_data/taller.yml` | Apps "En el taller" |
| `_layouts/` | Plantilla general y de artículo |
| `_includes/` | Menú, pie y piezas comunes |
| `assets/css/site.css` | Estilos |
| `assets/js/site.js` | Animaciones |
| `assets/apuntes/` | Imágenes de los apuntes |
