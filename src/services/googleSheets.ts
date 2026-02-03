export interface GoogleSheetData {
    email: string;
    firstName: string;
    lastName: string;
    linkedin?: string;
    affiliation?: string;
    response?: string;
    orientation?: string;
}

/**
 * Native Form Submission for Google Sheets
 * This method is the most reliable for GitHub Pages as it uses the browser's 
 * native engine, bypassing strict security/ad-block policies that block 'fetch'.
 */
export const syncToGoogleSheet = async (data: GoogleSheetData) => {
    if (import.meta.env.VITE_DISABLE_GOOGLE_SHEETS === 'true') return;

    // Clean the URL to ensure no whitespace or newlines from secrets
    const scriptUrl = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL?.trim();

    if (!scriptUrl) {
        console.warn('[Google Sheets] Missing Webhook URL.');
        return;
    }

    console.log(`[Google Sheets] Initiating native sync for ${data.email}`);

    try {
        // 1. Create a hidden iframe to catch the response (prevents page refresh)
        const iframeName = 'gs_sync_iframe_' + Date.now();
        const iframe = document.createElement('iframe');
        iframe.name = iframeName;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        // 2. Create a hidden form
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = scriptUrl;
        form.target = iframeName;
        form.style.display = 'none';

        // 3. Add data to form
        Object.entries(data).forEach(([key, value]) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = value || '';
            form.appendChild(input);
        });

        // 4. Submit and Cleanup
        document.body.appendChild(form);
        form.submit();

        setTimeout(() => {
            document.body.removeChild(form);
            document.body.removeChild(iframe);
            console.log('[Google Sheets] Native submission sent.');
        }, 2000);

    } catch (error) {
        console.error('[Google Sheets] Native sync failed:', error);
    }
};
