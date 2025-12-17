# Configuración de EmailJS para Contact Support

## Pasos para configurar EmailJS:

1. **Crear cuenta en EmailJS**:
   - Ve a https://www.emailjs.com/
   - Crea una cuenta gratuita

2. **Configurar el servicio de email**:
   - En el dashboard, ve a "Email Services"
   - Añade un servicio (Gmail, Outlook, etc.)
   - Copia el **Service ID** (ejemplo: `service_abc123`)

3. **Crear plantilla de email**:
   - Ve a "Email Templates"
   - Crea una nueva plantilla con estos campos:
     ```
     Subject: {{subject}}
     
     From: {{from_name}} ({{from_email}})
     Category: {{category}}
     
     Message:
     {{message}}
     ```
   - Copia el **Template ID** (ejemplo: `template_xyz789`)

4. **Obtener Public Key**:
   - Ve a "Account" → "General"
   - Copia tu **Public Key** (ejemplo: `user_123abc456def`)

5. **Actualizar el código**:
   - Abre `Contact-support.jsx`
   - Reemplaza en la línea 50-52:
     ```javascript
     await emailjs.send(
       'service_neighborhelp',  // ← Reemplaza con tu Service ID
       'template_contact',      // ← Reemplaza con tu Template ID
       templateParams,
       'YOUR_PUBLIC_KEY'        // ← Reemplaza con tu Public Key
     );
     ```

## Cómo funciona:

1. El usuario llena el formulario de contacto
2. Al hacer clic en "Send Message":
   - Se envía el email automáticamente a support@neighbourlyhelp.com
   - Se muestra el alert: "Thank you for contacting us! We'll respond within 24-48 hours."
   - El formulario se resetea
3. El usuario NO necesita abrir su cliente de correo
4. Todo sucede en segundo plano

## Plan gratuito de EmailJS:
- 200 emails por mes gratis
- Perfecto para un sitio de soporte

## Alternativa sin EmailJS:
Si prefieres no usar EmailJS, necesitarás crear un endpoint en tu backend que envíe los emails usando un servicio como SendGrid, Mailgun, o el SMTP de tu servidor.
