# CineVers Frontend

Sistema de reserva de boletos de cine desarrollado con React + Vite.

## 🎬 Características

- **Página de inicio** con catálogo de películas
- **Selección de horarios** y salas (Premium, VIP)
- **Selección de asientos** interactiva con diferentes tipos (Regular, VIP, Ocupado)
- **Proceso de pago** con múltiples métodos (Tarjeta, PayPal, OXXO)
- **Diseño moderno** con gradientes y animaciones
- **Responsive** para dispositivos móviles

## 🚀 Tecnologías

- React 18
- Vite
- React Router DOM
- CSS moderno con gradientes y animaciones

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Eduardo20233tn109/CineVers-frontend.git

# Instalar dependencias
cd CineVers-frontend
npm install

# Ejecutar en modo desarrollo
npm run dev
```

## 🏗️ Estructura del Proyecto

```
src/
├── components/        # Componentes reutilizables
│   └── MovieCard.jsx
├── pages/            # Páginas de la aplicación
│   ├── Login.jsx
│   ├── Home.jsx
│   ├── BookTicket.jsx
│   ├── SeatSelection.jsx
│   └── Checkout.jsx
├── styles/           # Archivos CSS
│   ├── global.css
│   ├── Login.css
│   ├── Home.css
│   ├── BookTicket.css
│   ├── SeatSelection.css
│   ├── Checkout.css
│   └── MovieCard.css
└── App.jsx          # Componente principal con rutas
```

## 🎨 Flujo de Usuario

1. **Login** → Inicio de sesión
2. **Home** → Catálogo de películas
3. **Book Ticket** → Selección de horario y sala
4. **Seat Selection** → Selección de asientos
5. **Checkout** → Pago y confirmación

## 🔧 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Vista previa de la build de producción

## 📝 Notas

Este es un proyecto frontend que utiliza datos mock. Para conectarlo con un backend real, se deben actualizar las llamadas a API en los componentes.

## 👥 Autor

Eduardo - [GitHub](https://github.com/Eduardo20233tn109)
