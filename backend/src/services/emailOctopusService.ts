/**
 * EmailOctopus API integration service
 * Handles email subscription via EmailOctopus API
 * Per US-001 requirements
 */

// Type for the fetch API Response (not Express Response)
interface FetchResponse {
  status: number;
  json(): Promise<any>;
}

interface EmailOctopusConfig {
  apiKey: string;
  listId: string;
  betaAccessTag?: string;
}

const DEFAULT_BETA_ACCESS_TAG = 'beta';

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
 * @param tag - Optional tag to apply to the subscriber (defaults to environment variable or 'beta')
 * @returns Promise with subscription result
 */
export async function subscribeToEmailList(
  email: string,
  consentTimestamp: string,
  tag?: string
): Promise<{ success: boolean; message: string; status: string; debug?: Record<string, unknown> }> {
  const config: EmailOctopusConfig = {
    apiKey: process.env.EMAILOCTOPUS_API_KEY || '',
    listId: process.env.EMAILOCTOPUS_LIST_ID || '',
    betaAccessTag: process.env.EMAILOCTOPUS_BETA_ACCESS_TAG?.trim(),
  };

  // Validate configuration
  if (!config.apiKey || !config.listId) {
    throw new Error('EmailOctopus configuration missing');
  }

  const apiUrl = `https://emailoctopus.com/api/1.6/lists/${config.listId}/contacts`;

  // Build request body per EmailOctopus API docs
  // https://emailoctopus.com/api-documentation/lists/create-contact
  const requestBody = new URLSearchParams();
  requestBody.append('api_key', config.apiKey);
  requestBody.append('email_address', email);
  requestBody.append('status', 'SUBSCRIBED');
  requestBody.append('fields[ConsentTimestamp]', consentTimestamp);
  requestBody.append('update_existing', 'true');

  // Add tag: use passed tag, or fall back to configured tag, or use default
  const resolvedTag = tag || config.betaAccessTag || DEFAULT_BETA_ACCESS_TAG;
  const tags: string[] = [resolvedTag];
  tags.forEach((tag) => requestBody.append('tags[]', tag));

  const debugEnabled = process.env.EMAILOCTOPUS_DEBUG !== 'false';

  try {
    // Using global fetch API - cast to any then to our interface to avoid type conflicts
    const response = (await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: requestBody.toString(),
    })) as any as FetchResponse;

    const data = await response.json() as EmailOctopusResponse;

    const debugPayload = debugEnabled
      ? {
          httpStatus: response.status,
          emailOctopusResponse: data,
          requestBodyPreview: requestBody
            .toString()
            .replace(/api_key=[^&]+/i, 'api_key=[REDACTED]'),
          tagsApplied: tags,
          updateExisting: true,
          configuredTag: config.betaAccessTag ?? null,
          tagFallbackUsed: !config.betaAccessTag,
        }
      : undefined;

    // Handle different response codes
    if (response.status === 200 || response.status === 201) {
      return {
        success: true,
        message: 'Thank you! Check your email to confirm your subscription.',
        status: 'pending_confirmation',
        ...(debugPayload ? { debug: debugPayload } : {}),
      };
    } else if (response.status === 409 || data.error?.code === 'MEMBER_EXISTS_WITH_EMAIL_ADDRESS') {
      return {
        success: true,
        message: 'This email is already on our list. Check your inbox for updates.',
        status: 'already_subscribed',
        ...(debugPayload ? { debug: debugPayload } : {}),
      };
    } else {
      console.error('EmailOctopus API error:', data.error);
      return {
        success: false,
        message: 'Unable to subscribe. Please try again later.',
        status: 'error',
        ...(debugPayload ? { debug: debugPayload } : {}),
      };
    }
  } catch (error) {
    console.error('EmailOctopus API request failed:', error);
    return {
      success: false,
      message: 'Unable to connect. Please try again later.',
      status: 'error',
      ...(debugEnabled
        ? {
            debug: {
              error: error instanceof Error ? error.message : 'Unknown error',
            },
          }
        : {}),
    };
  }
}
