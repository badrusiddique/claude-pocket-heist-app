interface SkeletonProps {
  variant?: 'circular' | 'rectangular' | 'text'
  width?: string
  height?: string
  className?: string
}

export default function Skeleton({
  variant = 'rectangular',
  width = '100%',
  height = '1rem',
  className = '',
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-lighter rounded'

  const variantClasses = {
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    text: 'rounded',
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
    />
  )
}
