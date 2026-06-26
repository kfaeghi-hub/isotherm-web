import { getSiteSettings, getServiceCategories } from '@/lib/sanity/queries'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, categories] = await Promise.all([
    getSiteSettings(),
    getServiceCategories(),
  ])

  return (
    <>
      <SiteHeader categories={categories} />
      <main className="flex-1">{children}</main>
      <SiteFooter settings={settings} />
    </>
  )
}
