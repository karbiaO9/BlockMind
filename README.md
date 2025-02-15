# BlockMind

BlockMind is a Next.js-based cryptocurrency trading platform with AI-powered insights and real-time market analysis.

## Features

- 🤖 AI Trading Assistant
- 📊 Real-time Market Analysis
- 💼 Portfolio Management
- 🔐 Secure Authentication
- 🌙 Dark/Light Mode
- 🌐 Multi-language Support

## Prerequisites

Make sure you have the following installed:

- Node.js (v18 or higher)
- Yarn package manager
- Git

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/BlockMind.git
cd BlockMind
```

2. Install dependencies:

```bash
yarn install
```

3. Set up Prisma:

```bash
yarn add prisma @prisma/client
npx prisma generate
```

4. Create a `.env` file in the root directory and add your environment variables:

```env
DATABASE_URL="your_database_url"
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
```

5. Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
BlockMind/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # Reusable UI components
│   ├── lib/             # Utility functions and configurations
│   └── prisma/          # Database schema and migrations
├── public/              # Static files
└── ...config files
```

## Technologies Used

- [Next.js 14](https://nextjs.org/) - React Framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI Components

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@blockmind.com or join our Discord channel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
"# BlockMind"