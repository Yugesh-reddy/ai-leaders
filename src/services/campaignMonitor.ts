
export interface CampaignMonitorData {
    email: string;
    firstName: string;
    lastName: string;
    linkedin?: string;
    affiliation?: string;
    response?: string;
    orientation?: string;
}

export const addToMailingList = async (data: CampaignMonitorData) => {
    const apiKey = import.meta.env.VITE_CAMPAIGN_MONITOR_API_KEY;
    const listId = import.meta.env.VITE_CAMPAIGN_MONITOR_LIST_ID;

    if (import.meta.env.VITE_DISABLE_CAMPAIGN_MONITOR === 'true') {
        console.info('Campaign Monitor subscription is disabled (VITE_DISABLE_CAMPAIGN_MONITOR=true). Skipping.');
        return;
    }

    if (!apiKey || !listId) {
        console.warn('Campaign Monitor credentials missing. Please check your GitHub secrets and deploy workflow.');
        return;
    }

    try {
        console.log(`[Campaign Monitor] Initializing sync for ${data.email}...`);

        // Ensure we're using string values for the Auth header
        const authHeader = btoa(`${apiKey}:x`);

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

        const apiUrl = `https://api.createsend.com/api/v3.3/subscribers/${listId}.json`;

        // Use a different proxy to see if it resolves the hang/CORS issue
        // AllOrigins is generally very reliable for headers
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`;

        console.log(`[Campaign Monitor] Sending request via proxy...`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

        const response = await fetch(proxyUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${authHeader}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        console.log(`[Campaign Monitor] Response received with status: ${response.status}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[Campaign Monitor] API Error (${response.status}):`, errorText);

            if (response.status === 401) {
                console.warn('[Campaign Monitor] Unauthorized: Check if your API Key is correct in GitHub Secrets. (Note: It should be a 32-char hex string)');
            }
        } else {
            console.log('[Campaign Monitor] Successfully synced applicant data.');
        }
    } catch (error: any) {
        if (error.name === 'AbortError') {
            console.error('[Campaign Monitor] Request timed out. This may be a proxy or API connectivity issue.');
        } else {
            console.error('[Campaign Monitor] Unexpected Error:', error);
        }
    }
};
