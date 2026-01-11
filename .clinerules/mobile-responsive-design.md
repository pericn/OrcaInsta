## Brief overview
This rule captures mobile-first responsive design practices for React/TypeScript applications, emphasizing dynamic viewport handling, conditional rendering, and progressive enhancement across device breakpoints.

## Mobile-first development
- Prioritize mobile user experience in all design decisions
- Implement touch-friendly interactions with appropriate sizing (44px minimum touch targets)
- Test keyboard show/hide behavior and viewport height changes on actual mobile devices
- Use safe area insets for modern mobile devices with notches and rounded corners

## Dynamic viewport management
- Replace static `window.innerWidth` checks with reactive state-based solutions
- Implement `useEffect` with `resize` event listeners for responsive conditional rendering
- Use `visualViewport` API for accurate mobile viewport height tracking during keyboard interactions
- Create custom hooks for viewport state management to avoid repeated implementation

## Conditional rendering patterns
- Use reactive window dimensions instead of static breakpoint checks
- Implement feature gating based on viewport size with smooth transitions
- Ensure conditional UI elements maintain proper z-index stacking and accessibility
- Test breakpoint transitions thoroughly to prevent layout shifts or broken interactions

## Progressive enhancement
- Implement parallel solutions (A and B approaches) for complex features
- Provide fallbacks for older browsers and devices
- Gracefully degrade functionality rather than failing completely
- Use feature detection over browser detection

## Performance considerations
- Debounce resize event handlers to prevent excessive re-renders
- Use CSS containment and transform-based animations for smooth interactions
- Optimize bundle size by lazy-loading device-specific components
- Implement virtual scrolling for long content on mobile devices

## Testing strategies
- Test on actual mobile devices, not just browser dev tools
- Verify touch interactions, swipe gestures, and multi-touch support
- Test orientation changes and app switching scenarios
- Validate accessibility with screen readers on mobile platforms
