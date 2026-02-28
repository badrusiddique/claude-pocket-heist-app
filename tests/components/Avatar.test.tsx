import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import Avatar from "@/components/Avatar"

describe("Avatar", () => {
  it("renders successfully with a single letter for simple names", () => {
    render(<Avatar name="john" />)
    const avatar = screen.getByRole("img", { hidden: true })
    expect(avatar).toBeInTheDocument()
    expect(avatar).toHaveTextContent("J")
  })

  it("renders with first 2 uppercase letters for PascalCase names", () => {
    render(<Avatar name="JohnDoe" />)
    const avatar = screen.getByRole("img", { hidden: true })
    expect(avatar).toHaveTextContent("JD")
  })

  it("renders with single letter for names with only one uppercase letter", () => {
    render(<Avatar name="alice" />)
    const avatar = screen.getByRole("img", { hidden: true })
    expect(avatar).toHaveTextContent("A")
  })
})
