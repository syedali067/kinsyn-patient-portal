export interface State {
  label: string;
  value: number;
}

interface CollaboratingUser {
  email: string;
  id: number;
  firstName: string;
  lastName: string | null;
  avatarUrl: string;
}

export interface License {
  id: number;
  state: State;
  stateType: string;
  collaboratingUserId: number;
  number: string;
  dateExpired: string;
  collaboratingUser: CollaboratingUser;
  status: string;
  provider: CollaboratingUser;
}
