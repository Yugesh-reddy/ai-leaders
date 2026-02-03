
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
    const rawApiKey = import.meta.env.VITE_CAMPAIGN_MONITOR_API_KEY;
    const rawListId = import.meta.env.VITE_CAMPAIGN_MONITOR_LIST_ID;

    const apiKey = rawApiKey?.trim();
    const listId = rawListId?.trim();

    if (import.meta.env.VITE_DISABLE_CAMPAIGN_MONITOR === 'true') return;

    console.log(`[CM Debug] Sync initiation: ${data.email}`);

    if (!apiKey || !listId) {
        console.log(`[CM Debug] ABORT: Missing credentials.`);
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

    // OAuth tokens (long, contain + or /) use "Bearer" auth. 
    // Standard API Keys (32 hex chars) use "Basic" auth.
    const isOAuth = apiKey.length > 50 || apiKey.includes('+') || apiKey.includes('/');
    const authHeader = isOAuth ? `Bearer ${apiKey}` : `Basic ${btoa(`${apiKey}:x`)}`;

    console.log(`[CM Debug] Auth Mode: ${isOAuth ? 'Bearer (OAuth)' : 'Basic (API Key)'}`);

    const targetUrl = `https://api.createsend.com/api/v3.3/subscribers/${listId}.json`;

    for (const proxy of PROXIES) {
        console.log(`[CM Debug] Trying: ${proxy.name}`);

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const headers: HeadersInit = {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
                ...proxy.headers
            };

            const response = await fetch(proxy.url(targetUrl), {
                method: 'POST',
                headers,
                body: JSON.stringify(payload),
                signal: controller.signal
            });

            const text = await response.text();
            clearTimeout(timeoutId);

            console.log(`[CM Debug] ${proxy.name} Result -> Status: ${response.status}`);
            console.log(`[CM Debug] Response: ${text.substring(0, 300)}`);

            if (response.ok) {
                console.log(`[CM Debug] SUCCESS: Synced successfully.`);
                return;
            }

            if (response.status === 401) {
                console.log(`[CM Debug] AUTH FAILED. If using a long key, ensure it is a valid Access Token.`);
                // If OAuth failed, many proxies might be stripping the Bearer header.
                // We'll continue to the next proxy just in case.
            }

        } catch (err: any) {
            console.log(`[CM Debug] ${proxy.name} Network/CORS Error: ${err.message}`);
        }
    }

    console.log(`[CM Debug] FAILED: All proxies exhausted.`);
};
