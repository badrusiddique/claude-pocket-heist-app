import styles from "./Avatar.module.css"

interface AvatarProps {
  name: string
}

export default function Avatar({ name }: AvatarProps) {
  // Find all uppercase letters
  const uppercaseLetters = name.match(/[A-Z]/g) || []

  // If there are 2 or more uppercase letters (PascalCase), use first 2
  // Otherwise, use just the first letter (uppercase)
  const initials =
    uppercaseLetters.length >= 2
      ? uppercaseLetters.slice(0, 2).join("")
      : name.charAt(0).toUpperCase()

  return (
    <div className={styles.avatar} role="img" aria-label={`Avatar for ${name}`}>
      {initials}
    </div>
  )
}
