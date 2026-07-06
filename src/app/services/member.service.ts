import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  query,
  orderBy
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { Member, Plan } from '../models/member.model';

@Injectable({ providedIn: 'root' })
export class MemberService {
  private firestore = inject(Firestore);

  // ── Plans ──────────────────────────────────────────────────────────────
  getPlans(): Observable<Plan[]> {
    const ref = collection(this.firestore, 'plans');
    return collectionData(ref, { idField: 'id' }) as Observable<Plan[]>;
  }

  addPlan(plan: Omit<Plan, 'id'>): Promise<void> {
    const ref = collection(this.firestore, 'plans');
    return addDoc(ref, plan).then(() => {});
  }

  // ── Members ────────────────────────────────────────────────────────────
  getMembers(): Observable<Member[]> {
    const ref = collection(this.firestore, 'members');
    const q = query(ref, orderBy('name'));
    return collectionData(q, { idField: 'id' }) as Observable<Member[]>;
  }

  getMember(id: string): Observable<Member | undefined> {
    const ref = doc(this.firestore, 'members', id);
    return docData(ref, { idField: 'id' }) as Observable<Member | undefined>;
  }

  addMember(member: Omit<Member, 'id'>): Promise<void> {
    const ref = collection(this.firestore, 'members');
    return addDoc(ref, member).then(() => {});
  }

  updateMember(id: string, member: Partial<Member>): Promise<void> {
    const ref = doc(this.firestore, 'members', id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return updateDoc(ref, member as any);
  }

  deleteMember(id: string): Promise<void> {
    const ref = doc(this.firestore, 'members', id);
    return deleteDoc(ref);
  }

  renewMember(id: string, months: number, currentExpiry: Timestamp): Promise<void> {
    const current = currentExpiry.toDate();
    const newExpiry = new Date(current);
    newExpiry.setMonth(newExpiry.getMonth() + months);
    const ref = doc(this.firestore, 'members', id);
    return updateDoc(ref, { expiresAt: Timestamp.fromDate(newExpiry) });
  }
}
