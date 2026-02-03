
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

    console.log(`[CM Debug] Starting sync for: ${data.email}`);

    if (!apiKey || !listId) {
        console.log(`[CM Debug] FAILED: Missing credentials. Key exists: ${!!apiKey}, List exists: ${!!listId}`);
        return;
    }

    // Heuristic check for API Key format
    if (apiKey.length > 40) {
        console.log(`[CM Debug] WARNING: Your API Key is ${apiKey.length} chars long. Campaign Monitor keys are typically exactly 32 hex characters. Please verify you are using the 'API Key' from Account Settings, not an OAuth token or encrypted string.`);
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

    for (const proxy of PROXIES) {
        const fullProxyUrl = proxy.url(targetUrl);
        console.log(`[CM Debug] TRYING PROXY: ${proxy.name}`);

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 12000);

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

            const responseText = await response.text();
            clearTimeout(timeoutId);

            console.log(`[CM Debug] PROXY: ${proxy.name} | STATUS: ${response.status}`);
            console.log(`[CM Debug] RESPONSE (first 500 chars): ${responseText.substring(0, 500)}`);

            if (response.ok) {
                console.log(`[CM Debug] SUCCESS: Synced via ${proxy.name}`);
                return;
            }

            if (response.status === 401) {
                console.log(`[CM Debug] STOP: API returned 401 Unauthorized. This definitively means the API KEY is wrong.`);
                return;
            }

            if (response.status === 400) {
                console.log(`[CM Debug] STOP: API returned 400 Bad Request. Check your Custom Field keys (linkedIn, affiliation, task, orientation).`);
                return;
            }

        } catch (err: any) {
            console.log(`[CM Debug] PROXY ${proxy.name} THREW ERROR: ${err.name} - ${err.message}`);
        }
    }

    console.log(`[CM Debug] FATAL: All proxies failed to reach Campaign Monitor.`);
};
