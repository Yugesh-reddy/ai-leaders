
export const addToMailingList = async (email: string, firstName: string, lastName: string) => {
    const apiKey = import.meta.env.VITE_CAMPAIGN_MONITOR_API_KEY;
    const listId = import.meta.env.VITE_CAMPAIGN_MONITOR_LIST_ID;

    if (!apiKey || !listId) {
        console.warn('Campaign Monitor credentials missing.');
        return;
    }

    try {
        // Campaign Monitor API uses Basic Auth with API Key as username
        // Note: Client-side calls to the REST API will likely trigger CORS issues.
        // This is implemented as requested, but a backend proxy is recommended for production.
        const auth = btoa(`${apiKey}:x`);

        const payload = {
            "EmailAddress": email,
            "Name": `${firstName} ${lastName}`,
            "Resubscribe": true,
            "RestartSubscriptionBasedAutoresponders": true,
            "ConsentToTrack": "Yes"
        };

        const response = await fetch(`https://api.createsend.com/api/v3.3/subscribers/${listId}.json`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Campaign Monitor Error:', errorData);
        }
    } catch (error) {
        console.error('Failed to add to Campaign Monitor:', error);
    }
};
