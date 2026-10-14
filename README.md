This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

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

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Profile data

The profile reads the signed-in user from Redux (`auth.user`), including contact
details and the nested `profile` fields for bio, skills, photo, and resume.
The navbar also uses the Redux user's photo and name in its profile menu, with
an initial fallback when the photo is unavailable.
Its Profile link opens `/profile`. The Logout button sends a credentialed POST
to `${USER_API_ENDPOINT}/logout` so the backend can clear the session cookie.
Successful logout clears Redux and redirects to the home page (`/`), replacing
the current history entry. Redux is cleared only when the response contains `success: true`; failed
requests show an error and keep the user signed in.
The edit modal starts with the current user's full name, email, phone, and bio.
Saving sends a credentialed POST to
`${USER_API_ENDPOINT}/profile/updateProfile` with a flat JSON body containing
`fullName`, `email`, `phoneNumber`, and `bio`. A successful response must include
`success: true` and the updated `user`, which replaces the Redux user. Failed
requests leave the modal open and show an error notification. Cancelling does
not change Redux.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
