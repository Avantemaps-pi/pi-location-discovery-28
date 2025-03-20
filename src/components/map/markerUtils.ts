
export function createMarkerIcon(isActive: boolean) {
  return {
    url: `data:image/svg+xml,
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="${isActive ? '%23047857' : '%238B5CF6'}" stroke="%23FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="10" r="3"/>
        <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"/>
      </svg>`,
    scaledSize: { width: 36, height: 36 },
  };
}
