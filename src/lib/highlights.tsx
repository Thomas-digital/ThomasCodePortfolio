/**
 * Utility to highlight text between backslashes: \word\ → gold text
 * Also converts <strong> tags to gold text
 */
export function parseHighlight(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  
  // First, convert <strong> tags to \word\ format for consistent styling
  let processedText = text.replace(/<strong>(.*?)<\/strong>/g, '\\$1\\')
  
  const regex = /\\([^\\]+)\\/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(processedText)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      const slice = processedText.slice(lastIndex, match.index)
      // Render any remaining HTML tags
      if (slice) {
        parts.push(
          <span key={`text-${lastIndex}`} dangerouslySetInnerHTML={{ __html: slice }} />
        )
      }
    }
    // Add gold text
    parts.push(
      <span
        key={`highlight-${match.index}`}
        style={{
          color: 'var(--gold)',
          fontWeight: 600,
        }}
      >
        {match[1]}
      </span>
    )
    lastIndex = regex.lastIndex
  }

  // Add remaining text
  if (lastIndex < processedText.length) {
    const remaining = processedText.slice(lastIndex)
    if (remaining) {
      parts.push(
        <span key={`text-end`} dangerouslySetInnerHTML={{ __html: remaining }} />
      )
    }
  }

  return parts.length > 0 ? parts : [text]
}
