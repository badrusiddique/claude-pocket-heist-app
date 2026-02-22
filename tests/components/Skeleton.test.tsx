import { render } from '@testing-library/react'
import Skeleton from '@/components/Skeleton'

describe('Skeleton', () => {
  it('renders with default rectangular variant', () => {
    const { container } = render(<Skeleton />)
    const element = container.querySelector('div')
    expect(element).toHaveClass('bg-lighter', 'animate-pulse')
  })

  it('renders circular variant with rounded-full', () => {
    const { container } = render(<Skeleton variant="circular" />)
    const element = container.querySelector('div')
    expect(element).toHaveClass('rounded-full')
  })

  it('applies custom width and height', () => {
    const { container } = render(
      <Skeleton width="200px" height="50px" />
    )
    const element = container.querySelector('div')
    expect(element).toHaveStyle({ width: '200px', height: '50px' })
  })

  it('applies custom className', () => {
    const { container } = render(
      <Skeleton className="custom-class" />
    )
    const element = container.querySelector('div')
    expect(element).toHaveClass('custom-class')
  })
})
