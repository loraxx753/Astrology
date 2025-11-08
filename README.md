# ✨ Shimmering Stars

[![Production](https://img.shields.io/badge/Live%20Site-shimmeringstars.org-blueviolet?style=flat-square&logo=astro)](https://shimmeringstars.org)

Shimmering Stars is a modern astrology web application that provides interactive natal chart generation, astrological insights, and a beautiful, responsive user experience. Built with a focus on developer experience, accessibility, and extensibility, Shimmering Stars is open source and welcomes contributions.

---

## 🌐 Production URL

- **Live Site:** [https://shimmeringstars.org](https://shimmeringstars.org)

## 🚀 Tech Stack

- **Frontend:** React, TypeScript, Vite, TailwindCSS, Framer Motion
- **Component Framework:** MeanwhileJS (with ShadCN/UI, Animata)
- **Backend:** [astro-server](https://github.com/loraxx753/astro-server) (Node.js, TypeScript, GraphQL)
- **Hosting:** Railway

## 🪐 Features

- Interactive natal chart calculation and visualization
- Modern, accessible UI with responsive design
- Location search and timezone handling
- Extended, customizable UI components (via MeanwhileJS)
- MDX-powered documentation and content
- CLI tools for component scaffolding
- Comprehensive test coverage

## 🏗️ Project Structure

```
shimmering-stars/
  ├── src/                # Frontend source code
  ├── public/             # Static assets
  ├── data/               # Astrological data and schemas
  ├── .github/workflows/  # CI/CD workflows
  ├── bin/                # CLI tools
  ├── coverage/           # Test coverage reports
  ├── ...
```

## 🛠️ Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/loraxx753/shimmering-stars.git
   cd shimmering-stars
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in any required values.

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173` by default.

5. **Run tests:**
   ```bash
   npm test
   ```

## 🔗 Backend API

Shimmering Stars uses [astro-server](https://github.com/loraxx753/astro-server) as its backend for chart calculations and data. You can run your own instance or use the hosted API.

- **astro-server repo:** https://github.com/loraxx753/astro-server

## 🚢 Deployment

- **Hosting:** [Railway](https://railway.app/)
- **CI/CD:** GitHub Actions (see `.github/workflows/deploy.yaml`)
- **Production:** [https://shimmeringstars.org](https://shimmeringstars.org)

## 🤝 Contributing

Contributions are welcome! Please open issues or pull requests for bug fixes, features, or improvements. See the [DEPLOYMENT.md](DEPLOYMENT.md) and [MeanwhileJS documentation](https://meanwhile.github.io/meanwhilejs/docs/) for more info.

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

---

> Shimmering Stars is built with ❤️ by astrology enthusiasts and open source contributors.
