// Utility functions for handling user images

/**
 * Get a fallback avatar for users without images
 * @param {string} name - User's name
 * @param {string} email - User's email
 * @returns {string} - Fallback avatar URL or initials
 */
export const getFallbackAvatar = (name, email) => {
    if (!name && !email) return 'U';
    
    const displayName = name || email.split('@')[0];
    return displayName.charAt(0).toUpperCase();
};

/**
 * Check if an image URL is valid and accessible
 * @param {string} url - Image URL to check
 * @returns {Promise<boolean>} - Whether the image is accessible
 */
export const isImageAccessible = async (url) => {
    if (!url) return false;
    
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        console.warn('Image accessibility check failed:', error);
        return false;
    }
};

/**
 * Get a reliable user image URL with fallback
 * @param {Object} user - User object
 * @returns {Object} - Object with image URL and fallback info
 */
export const getUserImage = (user) => {
    if (!user) {
        return {
            hasImage: false,
            fallback: 'U',
            url: null
        };
    }

    const { image, name, email } = user;
    
    if (!image) {
        return {
            hasImage: false,
            fallback: getFallbackAvatar(name, email),
            url: null
        };
    }

    // Check if it's a Google OAuth image URL
    const isGoogleImage = image.includes('googleusercontent.com') || image.includes('lh3.googleusercontent.com');
    
    // For Google OAuth images, we might want to use a fallback due to CORS issues
    // or use a proxy service. For now, we'll still try the original URL
    // but provide better fallback handling
    
    return {
        hasImage: true,
        fallback: getFallbackAvatar(name, email),
        url: image,
        isGoogleImage,
        // Provide alternative fallback URL for Google images
        fallbackUrl: isGoogleImage ? getUIAvatarUrl(name, email) : null
    };
};

/**
 * Generate a UI Avatars URL as fallback
 * @param {string} name - User's name
 * @param {string} email - User's email
 * @returns {string} - UI Avatars URL
 */
export const getUIAvatarUrl = (name, email) => {
    const displayName = name || email.split('@')[0];
    const encodedName = encodeURIComponent(displayName);
    return `https://ui-avatars.com/api/?name=${encodedName}&background=ffd700&color=232323&size=128`;
}; 