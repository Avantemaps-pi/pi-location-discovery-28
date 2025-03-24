
// A list of inappropriate words to filter
// In a real production app, this would be more comprehensive
// and potentially use a third-party service or API
const inappropriateWords = [
  'badword1',
  'badword2',
  'badword3',
  // Add more inappropriate words here
];

/**
 * Filter inappropriate content from a string
 * @param content The content to filter
 * @returns Filtered content with inappropriate words replaced by asterisks
 */
export const filterInappropriateContent = (content: string): string => {
  if (!content) return content;
  
  let filteredContent = content;
  
  // Simple implementation that replaces inappropriate words with asterisks
  inappropriateWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    filteredContent = filteredContent.replace(regex, '*'.repeat(word.length));
  });
  
  return filteredContent;
};

/**
 * Check if content contains inappropriate language
 * @param content The content to check
 * @returns Boolean indicating if inappropriate content was found
 */
export const containsInappropriateContent = (content: string): boolean => {
  if (!content) return false;
  
  // Check if any inappropriate words are present
  return inappropriateWords.some(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    return regex.test(content);
  });
};
