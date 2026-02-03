
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
 * Native Form Submission Fallback
 * This method is the most reliable for GitHub Pages as it uses the browser's 
 * native form submisson engine, which is not restricted by CORS or Fetch policies.
 */
export const addToMailingList = async (data: CampaignMonitorData) => {
    if (import.meta.env.VITE_DISABLE_CAMPAIGN_MONITOR === 'true') return;

    console.log(`[CM Sync] Triggering native form sync for ${data.email}`);

    try {
        // 1. Create a hidden iframe to catch the response (preventing page refresh)
        const iframeName = 'cm_sync_iframe_' + Date.now();
        const iframe = document.createElement('iframe');
        iframe.name = iframeName;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        // 2. Create the hidden form
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://www.createsend.com/t/subscribe';
        form.target = iframeName; // Send result to the hidden iframe
        form.style.display = 'none';

        // 3. Add the List/Form ID (data-id from your snippet)
        const formId = '5B5E7037DA78A748374AD499497E309EF16C08CED7112A9822BA32FB0DED7970821237BD9AB7F9092FDE575C05B4E60A72A9149DCB6ECA1715D0229BDF2A67E3';
        const idInput = document.createElement('input');
        idInput.type = 'hidden';
        idInput.name = 'id';
        idInput.value = formId;
        form.appendChild(idInput);

        // 4. Map the fields exactly as they appear in your HTML snippet
        const fields: Record<string, string> = {
            'cm-name': `${data.firstName} ${data.lastName}`,
            'cm-nttliki-nttliki': data.email,
            'cm-f-dkskhtu': data.linkedin || '',
            'cm-f-dkskhil': data.affiliation || '',
            'cm-f-dkskhir': data.response || '',
            'cm-f-dksurlt': data.orientation || ''
        };

        Object.entries(fields).forEach(([name, value]) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = value;
            form.appendChild(input);
        });

        // 5. Execute the submission
        document.body.appendChild(form);
        form.submit();

        // 6. Cleanup after a short delay
        setTimeout(() => {
            document.body.removeChild(form);
            document.body.removeChild(iframe);
            console.log(`[CM Sync] Native submission sent.`);
        }, 2000);

    } catch (err: any) {
        console.error(`[CM Sync] Error in native submission:`, err.message);
    }
};
