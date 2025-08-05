# 📦 Project Name

<!-- Briefly describe your project -->
A modern web application built with [React.js](https://reactjs.org/), [Node.js](https://nodejs.org/), Express, and MySQL.
## 🚀 Features

- 🔐 Authentication (Register/Login)
- 🛒 Inventory Management
- 🧠 AI-powered search using OpenAI API
- 🗂️ Role-based Access Control (Admin & User)
- 🌐 Public viewing with restricted editing
- 📸 Image upload support
- 🌍 Multilingual interface
- 🔎 Filter & search by all product fields
- 🧩 Clean and scalable modular backend

## 🛠️ Tech Stack

**Frontend**
- React.js
- Tailwind CSS v3.3.3
- Axios
- React Router DOM

**Backend**
- Node.js
- Express.js
- MySQL (via Sequelize ORM)
- JWT for Authentication
- Multer for File Upload
- OpenAI API & NLP for AI features

## ⚙️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/JanaSaker/Inventory.git
cd JanaSakr
cd inventory-back
2. Backend Setup

cd backend
npm install
Create a .env file in the backend/ directory:


PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=inventory_db
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key

npx sequelize db:migrate
node index.js

3. Frontend Setup

cd JanaSakr
cd inventory-front
npm install
npm start
🧪 API Endpoints
Method	Endpoint	Description
POST	/api/auth/register	Register new users
POST	/api/auth/login	Login and get JWT token
GET	/api/products	Fetch all products
POST	/api/products	Add new product (admin)
PUT	/api/products/:id	Update a product
DELETE	/api/products/:id	Delete a product (admin)
POST	/api/ai-search	AI-powered search

🔐 Authentication & Roles
JWT is used to protect private routes.

Role middleware restricts admin/user access where needed.

📦 Future Improvements
📈 Product analytics dashboard

💬 Live chatbot assistant

📱 Mobile app integration

🧾 Printable reports

🙋‍♀️ Author
Jana Sakr
Full Stack Developer
📧 [janasakr2000@gmail.com]
