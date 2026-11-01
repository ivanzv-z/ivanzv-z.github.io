---
layout: post
title: Carpetas de Windows que niegan el acceso aunque seas administrador
date: 2026-10-31 19:00:00 +0100
description: Lo que aprendí compilando ZIntercept para Windows, cuando cada intento fallaba con "Acceso denegado" en una carpeta distinta.
---

Compilando el instalador de ZIntercept, el proceso fallaba una y otra vez con este error, cada vez en una carpeta distinta:

```text
EPERM: operation not permitted, scandir 'C:\...\site-packages\...'
```

En el Explorador, la misma carpeta decía *Acceso denegado*. Y lo raro: pasaba incluso abriendo PowerShell como administrador. Esto es lo que funcionó, en el orden en que conviene probarlo.

## 1. Ábrela desde el Explorador y pulsa Continuar

Es lo más rápido y casi siempre basta. Entra en la carpeta con doble clic desde el Explorador de archivos. Si aparece este aviso:

> Actualmente no tiene permiso de acceso a esta carpeta. Haga clic en Continuar para obtener acceso permanente a esta carpeta.

Pulsa **Continuar**. Windows añade tu usuario a los permisos de esa carpeta de forma permanente. Hay que hacerlo **carpeta por carpeta**, pero en mi caso resolvió la mayoría de los errores sin tocar nada más.

## 2. Comprueba que la carpeta sigue existiendo

Me pasé un buen rato intentando dar permisos a una carpeta que ya no estaba: un borrado anterior se había completado a medias. `icacls` y `takeown` devolvían *Acceso denegado* sobre algo que en realidad faltaba.

Si una carpeta "imposible" sigue fallando, ábrela y mira qué hay dentro. Si está vacía o le faltan archivos, la solución es reinstalar ese paquete, no pelearse con sus permisos.

## 3. Mira si algún proceso la tiene bloqueada

Un programa abierto (un Python que se quedó colgado, un editor, el propio compilador de una ejecución anterior) puede tener archivos bloqueados.

1. Abre el **Monitor de recursos** (búscalo en Inicio).
2. Ve a la pestaña **CPU**.
3. En *Identificadores asociados*, escribe el nombre de la carpeta.

Te dirá qué proceso la está usando. Ciérralo, o reinicia el equipo si no sabes cuál es.

## 4. Último recurso: takeown e icacls

Desde PowerShell **como administrador**. Ojo con un detalle que me hizo perder tiempo: en un Windows en español, la respuesta a la pregunta de `takeown` es `S` (sí), no `Y`.

```powershell
# Hacerte propietario de la carpeta y todo su contenido
takeown /F "C:\Ruta\De\La\Carpeta" /R /D S

# Darte control total, con herencia hacia dentro
icacls "C:\Ruta\De\La\Carpeta" /grant "${env:USERNAME}:(OI)(CI)F" /T
```

En PowerShell, `%USERNAME%` no funciona; por eso uso `${env:USERNAME}`.

Si incluso esto devuelve *Acceso denegado*, vuelve al punto 2 o al 3: casi seguro que la carpeta no existe tal y como crees, o que algo la tiene abierta.
