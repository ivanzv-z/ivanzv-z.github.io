---
layout: post
title: Dónde instalar el certificado de un proxy de interceptación
date: 2026-10-31 20:00:00 +0100
description: Para ver tráfico HTTPS el navegador tiene que confiar en la CA del proxy. Hazlo en un navegador de pruebas, nunca en todo el sistema.
---

Un proxy de interceptación como ZIntercept, Burp Suite o mitmproxy se pone en medio entre tu navegador y la web. Con HTTP eso basta. Con HTTPS, no: el tráfico va cifrado y el navegador solo acepta conexiones firmadas por una autoridad de certificación (CA) en la que confía.

Por eso el proxy genera **su propia CA** y firma con ella certificados falsos para cada web que visitas. Si el navegador confía en esa CA, puedes ver y modificar el tráfico. Si no, verás avisos de seguridad en cada página.

## El riesgo de hacerlo mal

Quien tenga la clave privada de esa CA puede firmar certificados válidos para **cualquier** web: tu banco, tu correo, lo que sea. Si la instalas en el almacén de confianza de todo el sistema, cualquier programa del equipo pasa a confiar en ella, y eso dura hasta que te acuerdes de quitarla.

La regla es sencilla: **la CA del proxy, solo en un navegador dedicado a las pruebas.**

## Cómo lo hace ZIntercept

ZIntercept ni siquiera te pide instalar nada. Al pulsar *abrir navegador de pruebas* (o la tecla `B`):

- Arranca un Chrome, Edge o Brave con **su propio perfil**, separado del tuyo: ni tus contraseñas, ni tu historial, ni tus sesiones abiertas.
- Le pasa la huella de su CA para que **solo esa ventana** confíe en ella.
- Lo dirige al proxy automáticamente.

Cuando cierras ese navegador, tu navegador normal sigue exactamente igual que antes.

## Si usas otra herramienta: un perfil aparte de Firefox

Firefox tiene su propio almacén de certificados por perfil, lo que lo hace ideal para esto:

1. Escribe `about:profiles` en la barra de direcciones y crea un perfil nuevo, por ejemplo *pruebas*.
2. Ábrelo y ve a **Ajustes → Privacidad & Seguridad → Certificados → Ver certificados**.
3. En la pestaña **Autoridades**, pulsa **Importar** y elige el certificado de la CA del proxy.
4. Marca **Confiar en esta CA para identificar sitios web**.
5. Configura el proxy en ese mismo perfil (**Ajustes → Configuración de red**).

Así tu Firefox de siempre no se entera de nada.

## Lo que no debes hacer

- Instalar la CA en *Entidades de certificación raíz de confianza* de Windows "para que funcione en todo".
- Usar el navegador de pruebas para tu correo o tu banco.
- Compartir los archivos de la CA. La clave privada es lo que hace peligrosa a la CA.
