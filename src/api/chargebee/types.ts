export interface BeRightBackPayload {
  app_id: string;
  email: string;
  subscription_id?: string;
  save_return_url?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  cancel_confirmation_url?: string;
  account: {
    internal_id: string;
  };
  context?: {
    locale: string;
    timezone: string;
    user_agent: string;
    url: string;
    referrer: string;
  };
  custom?: {
    offer_accept_url: string;
  };
  timestamp?: string;
}

export interface BeRightBackResponse {
  url: string;
}
