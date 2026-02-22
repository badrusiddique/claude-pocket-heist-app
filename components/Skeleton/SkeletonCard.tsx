import Skeleton from './Skeleton'

/**
 * A pre-composed skeleton card matching the design from skeleton.png
 * Shows a circular avatar placeholder with text content lines
 */
export default function SkeletonCard() {
  return (
    <div className="space-y-6">
      {/* Header with avatar and title */}
      <div className="flex gap-4">
        <Skeleton variant="circular" width="80px" height="80px" />
        <div className="flex-1 space-y-2">
          <Skeleton height="1.25rem" width="70%" />
          <Skeleton height="1rem" width="50%" />
        </div>
      </div>

      {/* Content lines */}
      <div className="space-y-3">
        <Skeleton height="1rem" width="100%" />
        <Skeleton height="1rem" width="100%" />
        <Skeleton height="1rem" width="65%" />
      </div>
    </div>
  )
}
