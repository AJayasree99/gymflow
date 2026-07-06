import { Timestamp } from '@angular/fire/firestore';

export interface Plan {
  id?: string;
  name: string;
  months: number;
  price: number;
}

export interface Member {
  id?: string;
  name: string;
  contact: string;
  planId: string;
  planName?: string;
  startAt: Timestamp;
  expiresAt: Timestamp;
}
