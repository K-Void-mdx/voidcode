/**
 * Environment Loader
 * Safely injects Netlify environment variables into the app
 * This runs BEFORE config.js to ensure variables are available
 */

window.__ENV__ = {
    // Appwrite
    APPWRITE_ENDPOINT: (typeof process !== 'undefined' && process.env?.APPWRITE_ENDPOINT) 
        ? process.env.APPWRITE_ENDPOINT 
        : window.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
    
    APPWRITE_PROJECT_ID: (typeof process !== 'undefined' && process.env?.APPWRITE_PROJECT_ID) 
        ? process.env.APPWRITE_PROJECT_ID 
        : window.APPWRITE_PROJECT_ID || '',
    
    // Database
    DATABASE_ID: (typeof process !== 'undefined' && process.env?.DATABASE_ID)
        ? process.env.DATABASE_ID
        : window.DATABASE_ID || 'main',
    
    // Storage
    AVATARS_BUCKET_ID: (typeof process !== 'undefined' && process.env?.AVATARS_BUCKET_ID)
        ? process.env.AVATARS_BUCKET_ID
        : window.AVATARS_BUCKET_ID || 'avatars',
    
    // AI Provider Keys (will be injected by Netlify build)
    GROQ_API_KEY: (typeof process !== 'undefined' && process.env?.GROQ_API_KEY)
        ? process.env.GROQ_API_KEY
        : window.GROQ_API_KEY || '',
    
    GEMINI_API_KEY: (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY)
        ? process.env.GEMINI_API_KEY
        : window.GEMINI_API_KEY || '',
    
    OPENROUTER_API_KEY: (typeof process !== 'undefined' && process.env?.OPENROUTER_API_KEY)
        ? process.env.OPENROUTER_API_KEY
        : window.OPENROUTER_API_KEY || '',
    
    OPENCODE_ZEN_API_KEY: (typeof process !== 'undefined' && process.env?.OPENCODE_ZEN_API_KEY)
        ? process.env.OPENCODE_ZEN_API_KEY
        : window.OPENCODE_ZEN_API_KEY || ''
}

console.log('[ENV] Loaded environment variables:', {
    appwrite: window.__ENV__.APPWRITE_ENDPOINT ? '✓' : '✗',
    projectId: window.__ENV__.APPWRITE_PROJECT_ID ? '✓' : '✗',
    groq: window.__ENV__.GROQ_API_KEY ? '✓' : '✗',
    gemini: window.__ENV__.GEMINI_API_KEY ? '✓' : '✗',
    openrouter: window.__ENV__.OPENROUTER_API_KEY ? '✓' : '✗',
    opencodezen: window.__ENV__.OPENCODE_ZEN_API_KEY ? '✓' : '✗'
})
