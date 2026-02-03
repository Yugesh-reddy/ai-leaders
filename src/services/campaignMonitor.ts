
export interface CampaignMonitorData {
    email: string;
    firstName: string;
    lastName: string;
    linkedin?: string;
    affiliation?: string;
    response?: string;
    orientation?: string;
}

const PROXIES: { name: string; url: (t: string) => string; headers: Record<string, string> }[] = [
    {
        name: 'CorsProxy.io',
        url: (target: string) => `https://corsproxy.io/?${encodeURIComponent(target)}`,
        headers: {}
    },
    {
        name: 'AllOrigins',
        url: (target: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(target)}`,
        headers: {}
    },
    {
        name: 'ThingProxy',
        url: (target: string) => `https://thingproxy.freeboard.io/fetch/${target}`,
        headers: { 'Accept': 'application/json' }
    }
];

export const addToMailingList = async (data: CampaignMonitorData) => {
    // Trim credentials to avoid common whitespace issues
    const apiKey = import.meta.env.VITE_CAMPAIGN_MONITOR_API_KEY?.trim();
    const listId = import.meta.env.VITE_CAMPAIGN_MONITOR_LIST_ID?.trim();

    if (import.meta.env.VITE_DISABLE_CAMPAIGN_MONITOR === 'true') {
        return;
    }

    if (!apiKey || !listId) {
        console.warn('[Campaign Monitor] Missing credentials. Check GitHub Secrets.');
        return;
    }

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

    const authHeader = btoa(`${apiKey}:x`);
    const targetUrl = `https://api.createsend.com/api/v3.3/subscribers/${listId}.json`;

    console.log(`[Campaign Monitor] Starting sync process for ${data.email}`);

    // Try proxies sequentially
    for (const proxy of PROXIES) {
        const fullProxyUrl = proxy.url(targetUrl);
        try {
            console.log(`[Campaign Monitor] Attempting via ${proxy.name}...`);
            console.log(`[Campaign Monitor] Request URL: ${fullProxyUrl}`);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 12000); // 12 second timeout per proxy

            const headers: HeadersInit = {
                'Authorization': `Basic ${authHeader}`,
                'Content-Type': 'application/json',
                ...proxy.headers
            };

            const response = await fetch(fullProxyUrl, {
                method: 'POST',
                headers,
                body: JSON.stringify(payload),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            const responseText = await response.text();
            console.log(`[Campaign Monitor] Proxy: ${proxy.name} | Status: ${response.status}`);
            console.log(`[Campaign Monitor] Raw Response: ${responseText.substring(0, 1000)}`);

            if (response.ok) {
                console.log(`[Campaign Monitor] SUCCESS via ${proxy.name}!`);
                return; // Success! Exit immediately
            }

            // If the API itself rejected us, stop retrying unless it's a 5xx from the proxy
            if (response.status === 400 || response.status === 401) {
                console.error(`[Campaign Monitor] API REJECTED: ${response.status}`);
                if (response.status === 401) {
                    console.warn('[Campaign Monitor] AUTH ERROR: Check your API Key.');
                }
                return;
            }

            console.warn(`[Campaign Monitor] ${proxy.name} failed with status ${response.status}. trying next...`);

        } catch (error: any) {
            console.error(`[Campaign Monitor] ${proxy.name} ERROR:`, error.name === 'AbortError' ? 'TIMEOUT (12s)' : error.message);
        }
    }

    console.error('[Campaign Monitor] FATAL: All proxies failed.');
};
