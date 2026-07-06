import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';
import { Timestamp } from '@angular/fire/firestore';
import { MemberService } from '../../services/member.service';
import { AuthService } from '../../services/auth.service';
import { Member, Plan } from '../../models/member.model';
import { MemberFormComponent } from '../../components/member-form/member-form.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MemberFormComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private memberService = inject(MemberService);
  private authService = inject(AuthService);
  private router = inject(Router);

  members: Member[] = [];
  plans: Plan[] = [];
  filteredMembers: Member[] = [];
  loading = true;

  searchQuery = '';
  selectedPlanFilter = '';
  selectedExpiryFilter = '';

  showForm = false;
  editingMember: Member | null = null;
  deleteConfirmId: string | null = null;

  private sub?: Subscription;

  get totalMembers(): number { return this.members.length; }
  get expiringCount(): number { return this.members.filter(m => this.isExpiringSoon(m)).length; }
  get expiredCount(): number { return this.members.filter(m => this.isExpired(m)).length; }
  get activeCount(): number { return this.members.filter(m => !this.isExpired(m) && !this.isExpiringSoon(m)).length; }

  ngOnInit(): void {
    this.sub = combineLatest([
      this.memberService.getMembers(),
      this.memberService.getPlans()
    ]).subscribe(([members, plans]) => {
      this.members = members;
      this.plans = plans;
      this.loading = false;
      this.applyFilters();
    });
  }

  ngOnDestroy(): void { this.sub?.unsubscribe(); }

  applyFilters(): void {
    let result = [...this.members];

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(m => m.name.toLowerCase().includes(q));
    }

    if (this.selectedPlanFilter) {
      result = result.filter(m => m.planId === this.selectedPlanFilter);
    }

    if (this.selectedExpiryFilter === 'expiring') {
      result = result.filter(m => this.isExpiringSoon(m));
    } else if (this.selectedExpiryFilter === 'expired') {
      result = result.filter(m => this.isExpired(m));
    } else if (this.selectedExpiryFilter === 'active') {
      result = result.filter(m => !this.isExpired(m) && !this.isExpiringSoon(m));
    }

    this.filteredMembers = result;
  }

  isExpired(member: Member): boolean {
    return member.expiresAt.toDate() < new Date();
  }

  isExpiringSoon(member: Member): boolean {
    const exp = member.expiresAt.toDate();
    const now = new Date();
    const sevenDays = new Date();
    sevenDays.setDate(sevenDays.getDate() + 7);
    return exp >= now && exp <= sevenDays;
  }

  getDaysLeft(member: Member): number {
    const diff = member.expiresAt.toDate().getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  getPlanName(planId: string): string {
    return this.plans.find(p => p.id === planId)?.name ?? planId;
  }

  getPlanMonths(planId: string): number {
    return this.plans.find(p => p.id === planId)?.months ?? 1;
  }

  openAddForm(): void {
    this.editingMember = null;
    this.showForm = true;
  }

  openEditForm(member: Member): void {
    this.editingMember = { ...member };
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingMember = null;
  }

  async onFormSave(data: Omit<Member, 'id'>): Promise<void> {
    if (this.editingMember?.id) {
      await this.memberService.updateMember(this.editingMember.id, data);
    } else {
      await this.memberService.addMember(data);
    }
    this.closeForm();
  }

  async renewMember(member: Member): Promise<void> {
    if (!member.id) return;
    const months = this.getPlanMonths(member.planId);
    await this.memberService.renewMember(member.id, months, member.expiresAt);
  }

  confirmDelete(id: string): void {
    this.deleteConfirmId = id;
  }

  async deleteMember(): Promise<void> {
    if (this.deleteConfirmId) {
      await this.memberService.deleteMember(this.deleteConfirmId);
      this.deleteConfirmId = null;
    }
  }

  cancelDelete(): void { this.deleteConfirmId = null; }

  async logout(): Promise<void> {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
