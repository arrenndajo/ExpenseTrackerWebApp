// Haptic feedback utility for mobile devices
export const triggerHapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'light') => {
  // Check if the device supports haptic feedback
  if ('vibrate' in navigator) {
    // Different vibration patterns for different feedback types
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30]
    };
    
    navigator.vibrate(patterns[type]);
  }
  
  // For iOS devices with haptic feedback support
  if ('hapticFeedback' in window) {
    try {
      // @ts-ignore - hapticFeedback is not in TypeScript definitions
      window.hapticFeedback.impact({ style: type });
    } catch (error) {
      // Fallback to vibration if haptic feedback fails
      if ('vibrate' in navigator) {
        navigator.vibrate([15]);
      }
    }
  }
};

// Check if device supports haptic feedback
export const supportsHapticFeedback = (): boolean => {
  return 'vibrate' in navigator || 'hapticFeedback' in window;
};

// Trigger different types of haptic feedback for different actions
export const hapticFeedback = {
  // Light feedback for navigation
  navigation: () => triggerHapticFeedback('light'),
  
  // Medium feedback for button presses
  button: () => triggerHapticFeedback('medium'),
  
  // Heavy feedback for important actions
  action: () => triggerHapticFeedback('heavy'),
  
  // Success feedback
  success: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 50, 50]);
    }
  },
  
  // Error feedback
  error: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
  }
};