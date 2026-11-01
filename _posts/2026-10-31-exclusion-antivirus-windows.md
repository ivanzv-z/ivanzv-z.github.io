---
layout: post
title: Añadir una exclusión en el antivirus de Windows
date: 2026-10-31 18:00:00 +0100
description: Cuando Microsoft Defender bloquea un programa en el que confías, puedes excluir solo esa carpeta en lugar de apagar la protección entera.
---

Las herramientas de seguridad ofensiva hacen cosas que, vistas desde fuera, se parecen mucho a lo que haría un malware: interceptan tráfico, cargan controladores de red o generan certificados. Es normal que Microsoft Defender las bloquee o borre alguno de sus archivos.

La solución **no** es desactivar el antivirus. Es decirle que ignore una carpeta concreta y nada más.

## Desde la interfaz de Windows

1. Abre el menú Inicio, escribe **Seguridad de Windows** y ábrelo.
2. Entra en **Protección antivirus y contra amenazas**.
3. En el apartado *Configuración de antivirus y protección contra amenazas*, pulsa **Administrar la configuración**.
4. Baja hasta **Exclusiones** y pulsa **Agregar o quitar exclusiones**. Windows te pedirá permiso de administrador.
5. Pulsa **Agregar una exclusión** y elige **Carpeta**.
6. Selecciona la carpeta del programa y confirma.

Además de carpetas puedes excluir un archivo suelto, un tipo de archivo (por extensión) o un proceso. Para un programa, lo habitual es la carpeta donde está instalado.

## Desde PowerShell

Si prefieres la terminal, abre PowerShell **como administrador**:

```powershell
# Añadir la exclusión
Add-MpPreference -ExclusionPath "C:\Ruta\Del\Programa"

# Ver qué carpetas tienes excluidas
(Get-MpPreference).ExclusionPath

# Quitarla cuando ya no la necesites
Remove-MpPreference -ExclusionPath "C:\Ruta\Del\Programa"
```

## Antes de hacerlo

- **Excluye lo mínimo.** Una carpeta concreta, nunca `C:\` ni toda la carpeta de Descargas.
- **Solo programas de los que te fíes.** Una exclusión es una puerta abierta: lo que entre ahí no lo va a revisar nadie.
- **Quítala cuando acabes.** Si era para una prueba puntual, no la dejes puesta para siempre.
- **No es lo mismo que el acceso controlado a carpetas.** Esa es otra protección de Windows contra ransomware y se configura en otro sitio, en *Protección contra ransomware*.
