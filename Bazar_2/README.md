# Verde Limón - Panel Administrativo

Aplicación administrativa construida con React, TypeScript y Vite.
Utiliza Firebase Authentication para el login y Firestore para almacenar productos y solicitudes de contacto.

## Estado de Firebase

- src/firebase.ts inicializa Firebase usando las variables de entorno.
- src/context/AuthContext.tsx usa Firebase Auth para login y logout.
- src/hooks/useProducts.ts y src/hooks/useContacts.ts usan Firestore para CRUD.

> Antes de iniciar la aplicación, crea un archivo .env con las credenciales de Firebase.

## Configuración de Firebase

1. Crea un proyecto nuevo en [Firebase Console](https://console.firebase.google.com/).
2. En  Authentication, habilita el método de correo/contraseña.
3. En Firestore Database, crea una base de datos.
4. En Project settings > General, copia la configuración de Firebase.
5. Crea un archivo .env en la raíz del proyecto con los valores:

```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
# VITE_FIREBASE_MEASUREMENT_ID=tu_measurement_id (opcional)
```

6. Reinicia el servidor de Vite después de crear o actualizar .env.

## Archivo de ejemplo de variables de entorno

Se incluye .env.example con todas las variables necesarias.
Copia su contenido a .env y completa los valores:

```bash
cp .env.example .env
```

## Reglas recomendadas de Firestore

En Firebase Console > Firestore > Rules, usa al menos:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Esto asegura que solo usuarios autenticados puedan leer y escribir datos.

## Uso

Instala dependencias e inicia la app:

```bash
npm install
npm run dev
```

Abre la app en http://localhost:5173/ o en el puerto que indique Vite.

## Estructura principal

- src/firebase.ts: inicializa Firebase.
- src/context/AuthContext.tsx: administra autenticación con Firebase.
- src/hooks/useProducts.ts: operaciones de productos en Firestore.
- src/hooks/useContacts.ts: operaciones de solicitudes de contacto en Firestore.
- src/pages/Login.tsx: formulario de login.

## Notas importantes

- Los datos de productos y contactos se almacenan en Firestore.
- El proyecto no usa localStorage para persistir esos datos.
- Si Firebase no está configurado correctamente, el login fallará hasta que el archivo .env esté completo.
- Para la demo en vivo, usa credenciales reales de Firebase y un usuario registrado.
