<img src="https://i.imgur.com/2j8Mx7w.png" alt="Zenki Logo" width="200"/> # Zenki


## 🧠 Descripción

**Zenki** es un **gestor de tareas personal inteligente**, diseñado para ayudarte a organizar tu día de forma más simple y eficiente.  
Integra un **asistente virtual** que analiza y responde basándose en la información de tus propias tareas, ofreciendo una experiencia personalizada para cada usuario.

Zenki combina productividad y tecnología conversacional para que puedas **gestionar tus tareas mediante diálogo natural**, simplificando la planificación, el seguimiento y la priorización de actividades.

---

## 🚀 Características principales

- ✅ **Gestión de tareas**: creación, edición, eliminación y visualización de tareas personales.  
- 🤖 **Asistente virtual integrado**: interactúa con tu información en tiempo real para ofrecerte recordatorios, sugerencias y resúmenes inteligentes.  
- 🧩 **Autenticación de usuarios** mediante AWS Cognito.  
- ☁️ **Backend serverless** desplegado en AWS (API Gateway + Lambda + DynamoDB).  
- 💬 **Interfaz moderna** desarrollada con Angular e integrada con Bootstrap/Tailwind.  
- 🔐 **Sesiones seguras** y tokens JWT gestionados por el front-end.  
- 📱 **Diseño responsive**: uso fluido en dispositivos móviles y escritorio.  

---

## 🛠️ Tecnologías utilizadas

| Área | Tecnologías |
|------|--------------|
| **Frontend** | Angular 17, TypeScript, Bootstrap 5, TailwindCSS |
| **Backend / API** | AWS Lambda, API Gateway, Node.js |
| **Autenticación** | Amazon Cognito |
| **Base de datos** | Amazon DynamoDB |
| **Despliegue** | AWS Amplify |
| **Control de versiones** | Git / GitHub |

---

## 🧩 Arquitectura general

[Usuario]
↓
[Frontend Angular (Zenki UI)]
↓
[AWS Amplify Hosting]
↓
[API Gateway]
↓
[Lambda Functions]
↓
[DynamoDB (Tabla de tareas por usuario)]
↕
[Cognito (Autenticación)]


## ⚙️ Instalación local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/<tu-usuario>/zenki.git
   cd zenki


# 👥 Equipo de desarrollo

Proyecto desarrollado por:

- Arthur Cañari

- Cristian Sagardia

- Daniel Anzaldo

- Melanie Zurdo

- Santiago Tortora

- Victor Cancinos



