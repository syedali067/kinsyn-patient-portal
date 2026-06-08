/**
 * Type definitions for the Zendesk Web Widget
 *
 * @see {@link https://developer.zendesk.com/api-reference/widget-messaging/introduction/#web-widget}
 */

/**
 * Callback function for Zendesk Web Widget events
 */
type ZendeskCallback = () => void;

/**
 * Callback function for unread messages that receives the count
 */
type ZendeskUnreadMessagesCallback = (count: number) => void;

/**
 * Valid cookie range options
 */
type ZendeskCookieRange = 'all' | 'functional' | 'none';

/**
 * Conversation field value types
 */
type ConversationFieldValue = string | number | boolean;

/**
 * Conversation field object structure
 */
type ConversationField = {
  id: string;
  value: ConversationFieldValue;
};

/**
 * Error returned when login fails
 */
type LoginFailedError = {
  /** A descriptive message that explains the error */
  message: string;
  /** Provides additional details on the cause of the login failure */
  reason: string;
  /** Identifies the error type as LoginFailedError */
  type: 'LoginFailedError';
};

/**
 * JWT callback function that provides a JWT token
 *
 * @param callback Function to call with the JWT token
 */
export type JwtCallback = (callback: (jwt: string) => void) => void;

/**
 * Login callback function that handles the result of the login attempt
 *
 * @param error null for successful login, or LoginFailedError for failed login
 */
export type LoginCallback = (error: LoginFailedError | null) => void;

/**
 * Zendesk Web Widget API interface
 */
export type ZendeskWebWidget = {
  /**
   * Main API method that accepts various commands
   */
  (command: 'messenger', action: 'show'): void;
  (command: 'messenger', action: 'hide'): void;
  (command: 'messenger', action: 'open'): void;
  (command: 'messenger', action: 'close'): void;

  /**
   * Event handling API
   */
  (command: 'messenger:on', event: 'open', callback: ZendeskCallback): void;
  (command: 'messenger:on', event: 'close', callback: ZendeskCallback): void;
  (command: 'messenger:on', event: 'unreadMessages', callback: ZendeskUnreadMessagesCallback): void;

  /**
   * Configuration API
   */
  (command: 'messenger:set', setting: 'locale', value: string): void;
  (command: 'messenger:set', setting: 'zIndex', value: number): void;
  (command: 'messenger:set', setting: 'cookies', range: ZendeskCookieRange): void;

  /**
   * Conversation metadata API
   */
  (
    command: 'messenger:set',
    setting: 'conversationFields',
    fields: ConversationField[],
    callback?: ZendeskCallback,
  ): void;
  (command: 'messenger:set', setting: 'conversationTags', tags: string[]): void;

  /**
   * Authentication API
   *
   * Login a user with JWT authentication
   *
   * @param command 'messenger'
   * @param action 'loginUser'
   * @param jwtCallback Function to handle JWT generation or refreshing
   * @param loginCallback Optional function to handle login result
   */
  (
    command: 'messenger',
    action: 'loginUser',
    jwtCallback: JwtCallback,
    loginCallback?: LoginCallback,
  ): void;

  /**
   * Logout the current user
   *
   * @param command 'messenger'
   * @param action 'logoutUser'
   */
  (command: 'messenger', action: 'logoutUser'): void;
};
