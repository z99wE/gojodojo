/**
 * @fileoverview Lightweight HTML sanitizer for security compliance.
 * Mitigates XSS risks and meets SoloKnuckle SAST security standards.
 */

/**
 * Dangerous tag names that must never be evaluated in dynamic DOM rendering.
 * @type {RegExp}
 */
const FORBIDDEN_TAGS = /<\s*\/?\s*(script|style|iframe|object|embed|applet|meta|link|base|form|input|textarea|button[^\w]|select)\b[^>]*>/gi;

/**
 * Event handler attributes that could trigger script execution.
 * @type {RegExp}
 */
const FORBIDDEN_HANDLERS = /\son\w+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi;

/**
 * Unsafe URL protocol schemes.
 * @type {RegExp}
 */
const DANGEROUS_PROTOCOLS = /(href|src)\s*=\s*(?:['"]\s*(?:javascript|data|vbscript):[^'"]*['"]|\s*(?:javascript|data|vbscript):[^\s>]+)/gi;

/**
 * Sanitizes input markup strings by stripping executable tags and unsafe attributes.
 * @param {string} dirty Raw HTML template string
 * @returns {string} Sanitized HTML safe for DOM insertion
 */
export function sanitizeHtml(dirty) {
  if (typeof dirty !== 'string') return '';
  return dirty
    .replace(FORBIDDEN_TAGS, '')
    .replace(FORBIDDEN_HANDLERS, '')
    .replace(DANGEROUS_PROTOCOLS, '$1=""');
}

/**
 * Escapes plain text strings to safe HTML entities.
 * @param {string} text Raw text string
 * @returns {string} Entity-escaped safe string
 */
export function escapeHtml(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
