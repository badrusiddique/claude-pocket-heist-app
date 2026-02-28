// preview page for newly created UI components
import Skeleton from '@/components/Skeleton'
import SkeletonCard from '@/components/Skeleton/SkeletonCard'
import Avatar from '@/components/Avatar'

export default function PreviewPage() {
  return (
    <div className="page-content space-y-12">
      <div>
        <h2>Preview</h2>
      </div>

      {/* Skeleton Component Variants */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Skeleton Variants</h3>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-light p-6 rounded-lg">
            <p className="text-sm text-body mb-4">Rectangular (default)</p>
            <Skeleton width="100%" height="1.5rem" />
          </div>

          <div className="bg-light p-6 rounded-lg">
            <p className="text-sm text-body mb-4">Circular</p>
            <div className="flex justify-center">
              <Skeleton variant="circular" width="80px" height="80px" />
            </div>
          </div>

          <div className="bg-light p-6 rounded-lg">
            <p className="text-sm text-body mb-4">Text variant</p>
            <div className="space-y-2">
              <Skeleton variant="text" width="100%" height="1rem" />
              <Skeleton variant="text" width="90%" height="1rem" />
              <Skeleton variant="text" width="75%" height="1rem" />
            </div>
          </div>
        </div>
      </section>

      {/* Skeleton Card */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Skeleton Card</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-light p-6 rounded-lg">
            <SkeletonCard />
          </div>
          <div className="bg-light p-6 rounded-lg">
            <SkeletonCard />
          </div>
        </div>
      </section>

      {/* Avatar Component */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Avatar</h3>

        <div className="bg-light p-6 rounded-lg">
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <Avatar name="alice" />
              <p className="text-xs text-body">alice</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Avatar name="john" />
              <p className="text-xs text-body">john</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Avatar name="JohnDoe" />
              <p className="text-xs text-body">JohnDoe</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Avatar name="AliceSmith" />
              <p className="text-xs text-body">AliceSmith</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Avatar name="SarahJones" />
              <p className="text-xs text-body">SarahJones</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
