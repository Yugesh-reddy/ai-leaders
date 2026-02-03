
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
        console.warn('Campaign Monitor credentials missing.');
        return;
    }

    try {
        const auth = btoa(`${apiKey}:x`);

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

        // We use a CORS proxy to allow the browser to talk to Campaign Monitor's restricted API
        const apiUrl = `https://api.createsend.com/api/v3.3/subscribers/${listId}.json`;
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(apiUrl)}`;

        const response = await fetch(proxyUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Campaign Monitor Error:', errorText);
        } else {
            console.log('Successfully synced with Campaign Monitor');
        }
    } catch (error) {
        console.error('Failed to add to Campaign Monitor:', error);
    }
};
