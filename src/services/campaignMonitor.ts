
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

    // Try proxies sequentially
    for (const proxy of PROXIES) {
        try {
            console.log(`[Campaign Monitor] Attempting sync via ${proxy.name}...`);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout per proxy

            const headers: HeadersInit = {
                'Authorization': `Basic ${authHeader}`,
                'Content-Type': 'application/json',
                ...proxy.headers
            };

            const response = await fetch(proxy.url(targetUrl), {
                method: 'POST',
                headers,
                body: JSON.stringify(payload),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                console.log(`[Campaign Monitor] Success via ${proxy.name}!`);
                return; // Success! Exit immediately
            }

            // Log specific API errors but continue if it's a 5xx from the proxy itself
            if (response.status === 400 || response.status === 401) {
                const errorText = await response.text();
                console.error(`[Campaign Monitor] API Rejected Request (${response.status}):`, errorText);
                if (response.status === 401) {
                    console.warn('[Campaign Monitor] Check your API Key. It should be a 32-char hex string.');
                }
                return; // Stop trying if the API itself rejected us (auth/validation error)
            }

            console.warn(`[Campaign Monitor] ${proxy.name} failed with status: ${response.status}. Trying next...`);

        } catch (error: any) {
            console.warn(`[Campaign Monitor] ${proxy.name} error:`, error.name === 'AbortError' ? 'Timeout' : error.message);
        }
    }

    console.error('[Campaign Monitor] All proxy attempts failed.');
};
