
/// <reference types="vite/client" />

interface Window {
  sendVerificationRequest?: (type: 'verification' | 'certification') => void;
}
