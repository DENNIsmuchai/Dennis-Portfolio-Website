# Portfolio Platform

A modern, full-stack personal portfolio platform with a built-in CMS. Built with Next.js, TypeScript, TailwindCSS, Prisma, and PostgreSQL.

## Features

### Public Website
- **Dynamic Sections**: All sections are configurable via the admin dashboard
- **Responsive Design**: Mobile-first, fully responsive layout
- **Dark/Light Mode**: Theme switching support
- **Smooth Animations**: Framer Motion powered animations
- **SEO Optimized**: Built-in SEO best practices
- **Fast Performance**: Optimized for Core Web Vitals

### Admin Dashboard (CMS)
- **Website Editor**: Drag-and-drop section management
- **Projects Manager**: Add, edit, and manage portfolio projects
- **Blog Manager**: Rich text editor for blog posts with Markdown support
- **Skills Manager**: Organize skills by category with proficiency levels
- **Experience Manager**: Add work experience with highlights
- **Education Manager**: Add educational background
- **Theme Customizer**: Customize colors, fonts, and appearance
- **Analytics**: Track page views and visitor statistics
- **Resume Manager**: Upload and manage resume PDF

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: TailwindCSS, shadcn/ui components
- **Animations**: Framer Motion
- **Backend**: Next.js API Routes, Server Actions
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js with JWT
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd portfolio-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/portfolio_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key"

# Admin Credentials
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="your-secure-password"
```

4. Set up the database:
```bash
npx prisma migrate dev
npx prisma generate
npx prisma db seed
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) to view the website

7. Access the admin dashboard at [http://localhost:3000/admin](http://localhost:3000/admin)
   - Default credentials: `admin@example.com` / `admin123` (or your configured password)

## Project Structure

```
portfolio-platform/
├── prisma/                 # Database schema and migrations
│   ├── schema.prisma      # Prisma schema
│   └── seed.ts            # Database seed script
├── public/                # Static assets
│   ├── uploads/           # Uploaded files
│   └── resume/            # Resume PDFs
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── (admin)/       # Admin dashboard routes
│   │   │   ├── admin/     # Main admin pages
│   │   │   └── login/     # Admin login
│   │   ├── (public)/      # Public website routes
│   │   │   ├── page.tsx   # Home page
│   │   │   └── layout.tsx # Public layout
│   │   ├── api/           # API routes
│   │   ├── globals.css    # Global styles
│   │   ├── layout.tsx     # Root layout
│   │   └── providers.tsx  # Context providers
│   ├── components/        # React components
│   │   ├── admin/         # Admin components
│   │   ├── public/        # Public website components
│   │   ├── shared/        # Shared components
│   │   └── ui/            # UI components (shadcn)
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── types/             # TypeScript types
│   └── utils/             # Helper functions
├── .env.example           # Example environment variables
├── next.config.js         # Next.js configuration
├── package.json           # Dependencies
├── tailwind.config.ts     # TailwindCSS configuration
└── tsconfig.json          # TypeScript configuration
```

## Admin Dashboard Features

### Website Editor
- Create, edit, and delete sections
- Reorder sections with drag-and-drop
- Toggle section visibility
- Customize navigation labels

### Projects Manager
- Add projects with title, description, images
- Link to GitHub and live demo
- Tag with tech stack
- Mark as featured
- Publish/unpublish projects

### Blog Manager
- Rich text editor for blog posts
- Markdown support
- Cover image upload
- Tagging system
- Publish scheduling

### Theme Customizer
- Customize brand colors (primary, secondary, accent)
- Background and surface colors
- Font selection
- Dark/light mode toggle
- Animation intensity settings
- Live preview

### Analytics
- Page view statistics
- Unique visitor count
- Popular projects
- Daily/weekly/monthly reports

## API Routes

- `GET/POST /api/sections` - Manage sections
- `GET/POST /api/projects` - Manage projects
- `GET/POST /api/blog` - Manage blog posts
- `GET/POST /api/skills` - Manage skills
- `GET/POST /api/experience` - Manage experience
- `GET/POST /api/education` - Manage education
- `GET/POST /api/theme` - Manage theme
- `GET/POST /api/contact` - Contact form submissions
- `GET/POST /api/analytics` - Analytics tracking

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Environment Variables for Production

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-production-secret"
ADMIN_EMAIL="your-email@example.com"
ADMIN_PASSWORD="your-secure-password"
```

## Customization

### Adding New Sections

1. Create a new section component in `src/components/public/sections/`
2. Add the section type to the Prisma schema
3. Update the section mapping in `src/app/(public)/page.tsx`

### Customizing Themes

Use the Theme Customizer in the admin dashboard, or modify the default theme in the database.

### Adding New Skills Categories

Update the `SkillCategory` enum in `prisma/schema.prisma` and regenerate the client.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues and feature requests, please open an issue on GitHub.

---

Built with ❤️ using Next.js, TypeScript, and TailwindCSS.
