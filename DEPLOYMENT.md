# Deployment Guide

## Deploying to Vercel

### 1. Prepare Your Repository

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/portfolio-platform.git
git push -u origin main
```

### 2. Set Up Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 3. Environment Variables

Add these environment variables in Vercel:

```
DATABASE_URL=your_postgresql_database_url
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_random_secret_key
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=your-secure-password
```

### 4. Database Setup

You need a PostgreSQL database. Options:

#### Option A: Vercel Postgres (Recommended)
1. In Vercel dashboard, go to "Storage"
2. Create a new Postgres database
3. Connect it to your project
4. Copy the connection string to `DATABASE_URL`

#### Option B: Supabase
1. Create a project at [supabase.com](https://supabase.com)
2. Get your connection string from Settings > Database
3. Add it to `DATABASE_URL`

#### Option C: Railway/Render
1. Create a PostgreSQL database
2. Copy the connection string

### 5. Run Migrations

After deployment, run migrations:

```bash
# Using Vercel CLI
vercel --prod

# Then run migrations (locally with production DB)
DATABASE_URL=your_production_db_url npx prisma migrate deploy
```

Or use the Vercel Console:
1. Go to your project
2. Click "Console"
3. Run: `npx prisma migrate deploy`

### 6. Seed Database (Optional)

To add initial data:

```bash
# Using Vercel Console
npx prisma db seed
```

## Deploying to Other Platforms

### Railway

1. Create a new project
2. Add PostgreSQL database
3. Connect GitHub repo
4. Add environment variables
5. Deploy

### Render

1. Create a new Web Service
2. Connect GitHub repo
3. Add PostgreSQL database
4. Configure environment variables
5. Deploy

## Post-Deployment Checklist

- [ ] Website loads correctly
- [ ] Admin login works
- [ ] Can create/edit projects
- [ ] Can create/edit blog posts
- [ ] Theme customization works
- [ ] Contact form works
- [ ] Analytics tracking works
- [ ] Resume upload works

## Custom Domain Setup

### Vercel

1. Go to Project Settings > Domains
2. Add your domain
3. Configure DNS records as instructed
4. Wait for SSL certificate

### Environment Variables for Custom Domain

Update `NEXTAUTH_URL` to your custom domain:
```
NEXTAUTH_URL=https://www.yourdomain.com
```

## Troubleshooting

### Build Errors

1. Check Node.js version (should be 18+)
2. Ensure all dependencies are installed
3. Check for TypeScript errors: `npx tsc --noEmit`

### Database Connection Issues

1. Verify `DATABASE_URL` is correct
2. Check if database is accessible from deployment
3. Ensure migrations are run

### Authentication Issues

1. Verify `NEXTAUTH_SECRET` is set
2. Check `NEXTAUTH_URL` matches your domain
3. Ensure admin user exists in database

## Updating Your Deployment

Simply push to your GitHub repository:

```bash
git add .
git commit -m "Update content"
git push
```

Vercel will automatically redeploy.

## Backup Strategy

1. Regular database backups via your provider
2. Keep code in version control (GitHub)
3. Document any manual changes

## Security Considerations

1. Use strong passwords
2. Keep dependencies updated
3. Enable 2FA on your accounts
4. Regularly rotate secrets
5. Monitor for suspicious activity
