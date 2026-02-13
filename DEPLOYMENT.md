# Guía de Deployment en Heroku

## Opción 1: Deployment con Heroku CLI

### Paso 1: Instalar Heroku CLI

**Windows:**
```bash
# Descargar desde: https://devcenter.heroku.com/articles/heroku-cli
```

**macOS:**
```bash
brew tap heroku/brew && brew install heroku
```

**Linux:**
```bash
curl https://cli-assets.heroku.com/install.sh | sh
```

### Paso 2: Autenticación

```bash
heroku login
```

### Paso 3: Crear aplicación en Heroku

```bash
# Crear app con nombre personalizado
heroku create cucei-mart-app

# O dejar que Heroku genere un nombre aleatorio
heroku create
```

### Paso 4: Configurar variables de entorno

```bash
heroku config:set NODE_ENV=production
heroku config:set NPM_CONFIG_PRODUCTION=false
```

### Paso 5: Deploy

```bash
# Asegúrate de estar en la rama main
git checkout main

# Push a Heroku
git push heroku main
```

### Paso 6: Abrir la aplicación

```bash
heroku open
```

### Paso 7: Ver logs (opcional)

```bash
heroku logs --tail
```

---

## Opción 2: Deployment con GitHub Integration

### Paso 1: Subir código a GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/tu-usuario/cucei-mart.git
git push -u origin main
```

### Paso 2: Crear app en Heroku Dashboard

1. Ir a https://dashboard.heroku.com/
2. Click en "New" → "Create new app"
3. Ingresar nombre de la app (ej: cucei-mart-app)
4. Seleccionar región (United States o Europe)
5. Click en "Create app"

### Paso 3: Conectar con GitHub

1. En la pestaña "Deploy"
2. Seleccionar "GitHub" como método de deployment
3. Conectar tu cuenta de GitHub
4. Buscar tu repositorio "cucei-mart"
5. Click en "Connect"

### Paso 4: Configurar variables de entorno

1. Ir a la pestaña "Settings"
2. Click en "Reveal Config Vars"
3. Agregar:
   - `NODE_ENV` = `production`
   - `NPM_CONFIG_PRODUCTION` = `false`

### Paso 5: Deploy

**Manual:**
1. En la pestaña "Deploy"
2. Scroll hasta "Manual deploy"
3. Seleccionar la rama "main"
4. Click en "Deploy Branch"

**Automático (recomendado):**
1. En la pestaña "Deploy"
2. En "Automatic deploys"
3. Seleccionar la rama "main"
4. Click en "Enable Automatic Deploys"

---

## Verificación del Deployment

### 1. Verificar que la app esté corriendo

```bash
heroku ps
```

Deberías ver algo como:
```
=== web (Free): node server.js (1)
web.1: up 2025/02/13 12:00:00 -0600 (~ 1m ago)
```

### 2. Verificar logs

```bash
heroku logs --tail
```

### 3. Abrir la aplicación

```bash
heroku open
```

O visitar: `https://tu-app-name.herokuapp.com`

---

## Configuración Avanzada

### Escalar dynos (para planes pagos)

```bash
# Escalar a 2 dynos
heroku ps:scale web=2

# Ver el estado actual
heroku ps
```

### Configurar dominio personalizado

```bash
# Agregar dominio
heroku domains:add www.cuceimart.com

# Ver configuración DNS
heroku domains
```

### Base de datos (para futuras implementaciones)

```bash
# Agregar PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Ver información de la DB
heroku pg:info
```

---

## Troubleshooting

### Error: "Application error"

**Solución 1: Verificar logs**
```bash
heroku logs --tail
```

**Solución 2: Verificar Procfile**
Asegúrate de que `Procfile` contenga:
```
web: node server.js
```

**Solución 3: Verificar PORT**
El servidor debe escuchar en `process.env.PORT`:
```javascript
const PORT = process.env.PORT || 3000;
```

### Error: "Cannot find module"

**Solución:**
```bash
# Verificar que package.json esté correcto
cat package.json

# Reinstalar dependencias
heroku run npm install
```

### Error: "H10 - App crashed"

**Solución 1: Verificar engines en package.json**
```json
"engines": {
  "node": "18.x",
  "npm": "9.x"
}
```

**Solución 2: Verificar start script**
```json
"scripts": {
  "start": "node server.js"
}
```

### WebSocket/Socket.io no funciona

**Solución: Habilitar session affinity**
```bash
heroku features:enable http-session-affinity
```

---

## Comandos Útiles

```bash
# Ver configuración actual
heroku config

# Abrir consola en Heroku
heroku run bash

# Reiniciar la app
heroku restart

# Ver información de la app
heroku info

# Escalar dynos a 0 (detener app)
heroku ps:scale web=0

# Eliminar app (¡cuidado!)
heroku apps:destroy --app nombre-app
```

---

## Monitoreo

### Heroku Dashboard
- Visitar: https://dashboard.heroku.com/apps/tu-app-name
- Ver métricas, logs, y configuración

### New Relic (opcional)
```bash
heroku addons:create newrelic:wayne
```

---

## Costos

### Free Tier
- 550-1000 horas dyno gratuitas por mes
- La app duerme después de 30 min de inactividad
- Limitaciones de recursos

### Hobby ($7/mes)
- Dynos siempre activos
- SSL automático
- Sin límite de horas

### Production (desde $25/mes)
- Métricas avanzadas
- Alta disponibilidad
- Soporte prioritario

---

## Recursos Adicionales

- [Documentación Heroku](https://devcenter.heroku.com/)
- [Node.js en Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Socket.io en Heroku](https://devcenter.heroku.com/articles/node-websockets)
- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

---

**Desarrollado por NEXCODE**  
Para soporte: nexcodemx@gmail.com
