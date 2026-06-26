import { PortableText as SanityPortableText } from '@portabletext/react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Block = any

const components = {
  types: {
    image: ({ value }: { value: Block }) => {
      if (!value?.asset) return null
      return (
        <figure className="my-8">
          <div className="relative w-full aspect-video rounded overflow-hidden">
            <Image
              src={urlFor(value).width(1200).url()}
              alt={value.alt ?? ''}
              fill
              className="object-cover"
            />
          </div>
          {value.caption && (
            <figcaption className="mt-2 text-sm text-ink/50 text-center">{value.caption}</figcaption>
          )}
        </figure>
      )
    },
  },
  block: {
    normal:     ({ children }: { children?: React.ReactNode }) => <p className="mb-5 leading-relaxed text-ink/80">{children}</p>,
    h2:         ({ children }: { children?: React.ReactNode }) => <h2 className="font-heading text-2xl font-semibold text-navy mt-10 mb-4">{children}</h2>,
    h3:         ({ children }: { children?: React.ReactNode }) => <h3 className="font-heading text-xl font-semibold text-navy mt-8 mb-3">{children}</h3>,
    h4:         ({ children }: { children?: React.ReactNode }) => <h4 className="font-heading text-lg font-semibold text-navy mt-6 mb-2">{children}</h4>,
    blockquote: ({ children }: { children?: React.ReactNode }) => <blockquote className="border-l-4 border-steel pl-6 my-6 text-ink/70 italic">{children}</blockquote>,
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => <ul className="list-disc pl-6 mb-5 space-y-1 text-ink/80">{children}</ul>,
    number: ({ children }: { children?: React.ReactNode }) => <ol className="list-decimal pl-6 mb-5 space-y-1 text-ink/80">{children}</ol>,
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => <strong className="font-semibold text-ink">{children}</strong>,
    em:     ({ children }: { children?: React.ReactNode }) => <em className="italic">{children}</em>,
    link:   ({ value, children }: { value?: { href: string }; children?: React.ReactNode }) => (
      <a href={value?.href} className="text-steel underline underline-offset-2 hover:text-steel/80 transition-colors">{children}</a>
    ),
  },
}

export function PortableText({ value }: { value: Block[] }) {
  if (!value?.length) return null
  return <SanityPortableText value={value} components={components} />
}
