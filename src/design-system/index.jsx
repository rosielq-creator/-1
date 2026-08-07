export function Container({ children, className = '' }) {
  return <div className={`container ${className}`.trim()}>{children}</div>
}

export function Section({ id, tone = 'light', className = '', children }) {
  return <section id={id} className={`section section--${tone} ${className}`.trim()}>{children}</section>
}

export function Eyebrow({ number, children }) {
  return <p className="eyebrow"><span>{number}</span>{children}</p>
}

export function TextLink({ href, children, className = '' }) {
  return <a className={`text-link ${className}`.trim()} href={href}>{children}<span aria-hidden="true">→</span></a>
}

export const MediaFrame = forwardRef(function MediaFrame({ src, alt = '', className = '', priority = false, fit = 'cover', decorative = false, style, ...props }, ref) {
  return <div {...props} ref={ref} style={style} className={`media-frame ${className}`.trim()}>
    <img src={src} alt={alt} aria-hidden={decorative || undefined} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} style={{ objectFit: fit }} />
  </div>
})
import { forwardRef } from 'react'
