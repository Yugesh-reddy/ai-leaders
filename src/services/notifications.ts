export interface NotificationData {
    firstName: string;
    lastName: string;
    email: string;
    linkedin: string;
    affiliation: string;
    affiliationOther?: string;
    response: string;
    scores: {
        curiosity: number;
        clarity: number;
        motivation: number;
        experience: number;
    };
    status: 'ACCEPTED' | 'MAX_ATTEMPTS_REACHED';
}

export const sendNotification = async (data: NotificationData): Promise<boolean> => {
    const webhookUrl = import.meta.env.VITE_SLACK_WEBHOOK_URL;

    if (!webhookUrl) {
        console.warn('Slack Webhook URL not configured (VITE_SLACK_WEBHOOK_URL)');
        return false;
    }

    try {
        const payload = {
            blocks: [
                {
                    type: "header",
                    text: {
                        type: "plain_text",
                        text: data.status === 'ACCEPTED' ? "🎉 New Qualified Applicant!" : "⚠️ Applicant Reached Max Attempts",
                        emoji: true
                    }
                },
                {
                    type: "section",
                    fields: [
                        {
                            type: "mrkdwn",
                            text: `*Name:*\n${data.firstName} ${data.lastName}`
                        },
                        {
                            type: "mrkdwn",
                            text: `*Email:*\n${data.email}`
                        }
                    ]
                },
                {
                    type: "section",
                    fields: [
                        {
                            type: "mrkdwn",
                            text: `*Affiliation:*\n${data.affiliation === 'Other' ? data.affiliationOther : data.affiliation}`
                        },
                        {
                            type: "mrkdwn",
                            text: `*LinkedIn:*\n${data.linkedin}`
                        }
                    ]
                },
                {
                    type: "divider"
                },
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: `*Scores:*`
                    }
                },
                {
                    type: "section",
                    fields: [
                        {
                            type: "mrkdwn",
                            text: `*Curiosity:* ${data.scores.curiosity}/100`
                        },
                        {
                            type: "mrkdwn",
                            text: `*Clarity:* ${data.scores.clarity}/100`
                        },
                        {
                            type: "mrkdwn",
                            text: `*Motivation:* ${data.scores.motivation}/100`
                        },
                        {
                            type: "mrkdwn",
                            text: `*Experience:* ${data.scores.experience}/100`
                        }
                    ]
                },
                {
                    type: "divider"
                },
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: `*Response:*\n>${data.response.replace(/\n/g, "\n>")}`
                    }
                }
            ]
        };

        const response = await fetch(webhookUrl, {
            method: 'POST',
            // Slack webhooks usually expect simple JSON body.
            // 'no-cors' mode might be needed if calling directly from browser due to CORS,
            // but standard Slack webhooks usually don't support CORS for direct browser calls securely without proxy.
            // However, Zapier webhooks often do allow CORS.
            // Assuming the user might use Zapier or a proxy. IF direct Slack, might fail CORS in browser.
            // To be safe for Zapier/modern hooks, usually standard POST is fine.
            // If CORS is an issue, we'd need a backend, but for this "client-side only" app request, we try best effort.
            headers: {
                'Content-Type': 'application/json' // pure text/plain is sometimes safer for "no-cors" but we want json
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            console.error('Failed to send notification:', response.statusText);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error sending notification:', error);
        return false;
    }
};
