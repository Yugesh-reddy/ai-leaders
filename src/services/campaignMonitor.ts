
export interface CampaignMonitorData {
    email: string;
    firstName: string;
    lastName: string;
    linkedin?: string;
    affiliation?: string;
    response?: string;
    orientation?: string;
}

/**
 * Robust Campaign Monitor Sync
 * Attempts multiple methods to ensure the data reaches the list from a static host like GitHub Pages.
 */
export const addToMailingList = async (data: CampaignMonitorData) => {
    const apiKey = import.meta.env.VITE_CAMPAIGN_MONITOR_API_KEY?.trim();
    const listId = import.meta.env.VITE_CAMPAIGN_MONITOR_LIST_ID?.trim();

    if (import.meta.env.VITE_DISABLE_CAMPAIGN_MONITOR === 'true') return;

    console.log(`[CM Debug] Sync initiation for ${data.email}`);

    // Method 1: Standard API via CORS Proxies (Best for custom fields)
    if (apiKey && listId) {
        await tryApiSync(data, apiKey, listId);
    }

    // Method 2: Public Form Submission (Fallback - No API Key or Proxy needed)
    // This uses a "simple request" that bypasses CORS pre-flight checks.
    if (listId) {
        await tryPublicFormSync(data, listId);
    }
};

const tryApiSync = async (data: CampaignMonitorData, apiKey: string, listId: string) => {
    const PROXIES = [
        { name: 'CorsProxy.io', url: (target: string) => `https://corsproxy.io/?${encodeURIComponent(target)}` },
        { name: 'AllOrigins', url: (target: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(target)}` }
    ];

    const payload = {
        "EmailAddress": data.email,
        "Name": `${data.firstName} ${data.lastName}`,
        "CustomFields": [
            { "Key": "linkedIn", "Value": data.linkedin || "" },
            { "Key": "affiliation", "Value": data.affiliation || "" },
            { "Key": "task", "Value": data.response || "" },
            { "Key": "orientation", "Value": data.orientation || "" }
        ],
        "Resubscribe": true,
        "RestartSubscriptionBasedAutoresponders": true,
        "ConsentToTrack": "Yes"
    };

    // OAuth vs API Key detection
    const isOAuth = apiKey.length > 50 || apiKey.includes('+') || apiKey.includes('/');
    const authHeader = isOAuth ? `Bearer ${apiKey}` : `Basic ${btoa(`${apiKey}:x`)}`;
    const targetUrl = `https://api.createsend.com/api/v3.3/subscribers/${listId}.json`;

    for (const proxy of PROXIES) {
        try {
            console.log(`[CM Debug] API Attempt: ${proxy.name} (${isOAuth ? 'Bearer' : 'Basic'})`);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

            const response = await fetch(proxy.url(targetUrl), {
                method: 'POST',
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
                signal: controller.signal
            });

            const text = await response.text();
            clearTimeout(timeoutId);

            console.log(`[CM Debug] ${proxy.name} Status: ${response.status} | Body: ${text.substring(0, 500)}`);
            if (response.ok) {
                console.log(`[CM Debug] API SUCCESS via ${proxy.name}`);
                return true;
            }
        } catch (err: any) {
            console.log(`[CM Debug] ${proxy.name} failed: ${err.message}`);
        }
    }
    return false;
};

/**
 * Fallback to standard form submission.
 * This does not require an API key and is much more likely to bypass CORS and ad-blockers.
 * It uses 'no-cors' so it's a "silent" submission.
 */
const tryPublicFormSync = async (data: CampaignMonitorData, listId: string) => {
    console.log(`[CM Debug] Attempting Public Form Sync (Proxy-less Fallback)...`);

    try {
        // Most CM lists can be subscribed to via this endpoint
        const formUrl = `https://createsend.com/t/subscribe`;

        const params = new URLSearchParams();
        // Standard CM field names for public forms
        params.append(`cm-${listId}-${listId}`, data.email);
        params.append('cm-name', `${data.firstName} ${data.lastName}`);

        // We attempt to pass custom fields; these may or may not work depending on field IDs,
        // but it's our best shot at a proxy-less fallback.
        if (data.linkedin) params.append('linkedIn', data.linkedin);
        if (data.affiliation) params.append('affiliation', data.affiliation);
        if (data.response) params.append('task', data.response);
        if (data.orientation) params.append('orientation', data.orientation);

        // This is a "simple request" - it bypasses CORS pre-flight entirely.
        await fetch(formUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params.toString()
        });

        console.log(`[CM Debug] Public Form Sync Sent (Silent Fallback). Check CM List.`);
    } catch (err: any) {
        console.log(`[CM Debug] Public Form Sync Failed: ${err.message}`);
    }
};
