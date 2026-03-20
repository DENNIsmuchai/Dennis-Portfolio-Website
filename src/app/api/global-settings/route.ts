import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let settings = await prisma.globalSettings.findFirst();
    
    if (!settings) {
      settings = await prisma.globalSettings.create({
        data: {
          siteTitle: 'My Portfolio',
          defaultLanguage: 'en',
          locale: 'en-US',
          twitterCardType: 'summary_large_image',
          analyticsEnabled: true,
        }
      });
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching global settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const existingSettings = await prisma.globalSettings.findFirst();
    
    if (existingSettings) {
      const settings = await prisma.globalSettings.update({
        where: { id: existingSettings.id },
        data: {
          siteTitle: body.siteTitle,
          siteTagline: body.siteTagline,
          metaDescription: body.metaDescription,
          metaKeywords: body.metaKeywords,
          ogImage: body.ogImage,
          twitterCardType: body.twitterCardType,
          defaultLanguage: body.defaultLanguage,
          locale: body.locale,
          customCss: body.customCss,
          favicon: body.favicon,
          appleTouchIcon: body.appleTouchIcon,
          maintenanceMode: body.maintenanceMode,
          analyticsEnabled: body.analyticsEnabled,
        }
      });
      return NextResponse.json(settings);
    } else {
      const settings = await prisma.globalSettings.create({
        data: {
          siteTitle: body.siteTitle || 'My Portfolio',
          siteTagline: body.siteTagline,
          metaDescription: body.metaDescription,
          metaKeywords: body.metaKeywords,
          ogImage: body.ogImage,
          twitterCardType: body.twitterCardType || 'summary_large_image',
          defaultLanguage: body.defaultLanguage || 'en',
          locale: body.locale || 'en-US',
          customCss: body.customCss,
          favicon: body.favicon,
          appleTouchIcon: body.appleTouchIcon,
          maintenanceMode: body.maintenanceMode || false,
          analyticsEnabled: body.analyticsEnabled ?? true,
        }
      });
      return NextResponse.json(settings);
    }
  } catch (error) {
    console.error('Error updating global settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
