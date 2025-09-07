# 🌍 Smart Travel Platform

Welcome to **Smart Travel Platform** – your modern, interactive dashboard for exploring countries, comparing destinations, and managing your travel history. Designed for travelers, students, and explorers, this platform brings together real-time data, secure authentication, and a beautiful user experience.

---

## ✨ Features

- **Country Search:** Instantly view country details, live weather, and currency exchange rates.
- **Compare Destinations:** Side-by-side comparison of two countries for smarter travel decisions.
- **Personalized History:** Save your searches and revisit them anytime.
- **User Profiles:** Manage your account, update your password, and delete your data securely.
- **Authentication:** Secure login/signup with JWT and Google OAuth.
- **Responsive UI:** Modern, mobile-friendly design powered by Tailwind CSS.
- **API Integration:** Real-time data from RestCountries, OpenWeatherMap, and ExchangeRate-API.

---

## 🗂️ Project Structure

```
client/
  ├── compare.html
  ├── history.html
  ├── login.html
  ├── profile.html
  ├── signup.html
  ├── travel.html
  ├── css/
  │    └── style.css
  └── js/
       ├── compare.js
       ├── history.js
       ├── login.js
       ├── profile.js
       ├── signup.js
       └── travel.js
server/
  ├── .env
  ├── package.json
  ├── server.js
  ├── config/
  │    ├── db.js
  │    └── passport-setup.js
  ├── middleware/
  │    ├── apiKeyMiddleware.js
  │    └── authMiddleware.js
  ├── models/
  │    ├── travelRecord.model.js
  │    └── user.model.js
  └── routes/
       ├── auth.routes.js
       └── records.routes.js
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/yourusername/smart-travel-platform.git
cd smart-travel-platform
```

### 2. Setup Server

```sh
cd server
npm install
# Add your MongoDB URI, JWT secret, Google OAuth keys, and API key to .env
npm start
```

### 3. Launch Client

Open `client/` in your browser using a local server (e.g., Live Server extension in VS Code).

---

## 🔐 Authentication

- **JWT:** Secure login and signup.
- **Google OAuth:** One-click login with Google.

---

## 🌐 APIs Used

- [RestCountries](https://restcountries.com/) – Country details
- [OpenWeatherMap](https://openweathermap.org/) – Live weather
- [ExchangeRate-API](https://www.exchangerate-api.com/) – Currency rates
- [IP-API](https://ip-api.com/) – Geolocation (optional)

---

## 🛡️ Security

- Passwords hashed with bcrypt.
- JWT for session management.
- API key middleware for backend routes.

---

## 🎨 UI/UX Highlights

- **Tailwind CSS:** Fast, responsive, and beautiful design.
- **Animations:** Smooth fade-in effects for cards and forms.
- **Mobile Friendly:** Works great on phones, tablets, and desktops.
- **Accessible:** Semantic HTML and clear navigation.

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

## 💡 Inspiration

Built for anyone who loves to travel, research, or simply explore the world from their browser. Whether you’re planning a trip or just curious, Smart Travel Platform makes global information accessible and fun.

---

**Happy Travels!** 🌏✨