/**
 * EmailOctopus API integration service
 * Handles email subscription via EmailOctopus API
 * Per US-001 requirements
 */

interface EmailOctopusConfig {
  apiKey: string;
  listId: string;
}

interface EmailOctopusResponse {
  id?: string;
  email_address?: string;
  status?: string;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Subscribe a user to the EmailOctopus mailing list
 * @param email - User's email address
 * @param consentTimestamp - ISO 8601 timestamp of consent
 * @returns Promise with subscription result
 */
export async function subscribeToEmailList(
  email: string,
  consentTimestamp: string
): Promise<{ success: boolean; message: string; status: string }> {
  const config: EmailOctopusConfig = {
    apiKey: process.env.EMAILOCTOPUS_API_KEY || '',
    listId: process.env.EMAILOCTOPUS_LIST_ID || '',
  };

  // Validate configuration
  if (!config.apiKey || !config.listId) {
    throw new Error('EmailOctopus configuration missing');
  }

  const apiUrl = `https://emailoctopus.com/api/1.6/lists/${config.listId}/contacts`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: config.apiKey,
        email_address: email,
        status: 'SUBSCRIBED',
        fields: {
          ConsentTimestamp: consentTimestamp,
        },
      }),
    });

    const data = await response.json() as EmailOctopusResponse;

    // Handle different response codes
    if (response.status === 200 || response.status === 201) {
      return {
        success: true,
        message: 'Thank you! Check your email to confirm your subscription.',
        status: 'pending_confirmation',
      };
    } else if (response.status === 409 || data.error?.code === 'MEMBER_EXISTS_WITH_EMAIL_ADDRESS') {
      return {
        success: true,
        message: 'This email is already on our list. Check your inbox for updates.',
        status: 'already_subscribed',
      };
    } else {
      console.error('EmailOctopus API error:', data.error);
      return {
        success: false,
        message: 'Unable to subscribe. Please try again later.',
        status: 'error',
      };
    }
  } catch (error) {
    console.error('EmailOctopus API request failed:', error);
    return {
      success: false,
      message: 'Unable to connect. Please try again later.',
      status: 'error',
    };
  }
}
