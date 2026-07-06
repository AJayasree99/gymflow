import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Timestamp } from '@angular/fire/firestore';
import { Member, Plan } from '../../models/member.model';

@Component({
  selector: 'app-member-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.css']
})
export class MemberFormComponent implements OnInit {
  @Input() member: Member | null = null;
  @Input() plans: Plan[] = [];
  @Output() save = new EventEmitter<Omit<Member, 'id'>>();
  @Output() cancel = new EventEmitter<void>();

  name = '';
  contact = '';
  planId = '';
  startAt = '';
  saving = false;

  get isEditing(): boolean { return !!this.member; }

  ngOnInit(): void {
    if (this.member) {
      this.name = this.member.name;
      this.contact = this.member.contact;
      this.planId = this.member.planId;
      this.startAt = this.toDateInputString(this.member.startAt.toDate());
    } else {
      this.startAt = this.toDateInputString(new Date());
    }
  }

  private toDateInputString(d: Date): string {
    return d.toISOString().split('T')[0];
  }

  getExpiryPreview(): string {
    const plan = this.plans.find(p => p.id === this.planId);
    if (!plan || !this.startAt) return '—';
    const start = new Date(this.startAt);
    start.setMonth(start.getMonth() + plan.months);
    return start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  async onSubmit(): Promise<void> {
    if (!this.name || !this.contact || !this.planId || !this.startAt) return;
    this.saving = true;

    const plan = this.plans.find(p => p.id === this.planId)!;
    const startDate = new Date(this.startAt);
    const expiryDate = new Date(this.startAt);
    expiryDate.setMonth(expiryDate.getMonth() + plan.months);

    const data: Omit<Member, 'id'> = {
      name: this.name.trim(),
      contact: this.contact.trim(),
      planId: this.planId,
      startAt: Timestamp.fromDate(startDate),
      expiresAt: Timestamp.fromDate(expiryDate)
    };

    this.save.emit(data);
  }
}
