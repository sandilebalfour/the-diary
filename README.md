This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# THE DIARY — Wear Your Story

The Diary is a fashion marketplace for Johannesburg's local brands.
Brands post their drops and specials. Customers shop, try on at home
with Try & Decide delivery, and only pay for what they keep.

Built with Next.js, TypeScript & Tailwind CSS.

---

## 1. What you need before you start

- **Node.js v22** (not v18 from apt)
- **npm** (comes with Node)
- **Git**

Check you have it:
```bash
node -v
# should say v22.xxx
npm -v

- How to run it
cd fashion-marketplace
npm install
npm run dev

## then open browser

http://localhost:3000

## how to run for production

npm run build
npm start

## how to kill server

# Kill anything on port 3000
lsof -ti:3000 | xargs kill -9
npm run dev