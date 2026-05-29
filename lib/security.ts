/**
 * Security utilities for NXRSCRIPTS
 */

/**
 * Validates a redirect URL to prevent Open Redirect vulnerabilities.
 * A valid redirect must start with a single '/' and not contain protocol schemes.
 */
export const validateRedirect = (url: string | null, fallback = '/'): string => {
    if (!url) return fallback;

    // Ensure it's a relative path and doesn't try to use protocol
    // Prevents: //evil.com, http://evil.com, javascript:alert(1)
    const isRelative = url.startsWith('/') && !url.startsWith('//');

    if (!isRelative) {
        console.warn(`[Security] Blocked potential Open Redirect attempt to: ${url}`);
        return fallback;
    }

    return url;
};

/**
 * Basic UUID validation regex to prevent IDOR attempts with malformed IDs.
 */
export const isValidUUID = (id: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
};
