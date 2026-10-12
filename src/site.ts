// Site-wide settings.

/**
 * The Google Form that takes error reports. It is owned by the project's
 * Google account, needs no sign-in, and does not collect email addresses.
 * `pageField` is the form's "Which page or body is this about?" question,
 * which the report page pre-fills.
 */
export const REPORT_FORM = {
  url: 'https://docs.google.com/forms/d/e/1FAIpQLSfzMCHQuBJBW3z8rEuoiAVbFqiSqlEcGd9bcslcrt0jXhEL-Q/viewform',
  pageField: 'entry.294585413',
}

/** A fallback for anyone who would rather write. This address is public. */
export const REPORT_EMAIL = 'ehqt.github@gmail.com'
