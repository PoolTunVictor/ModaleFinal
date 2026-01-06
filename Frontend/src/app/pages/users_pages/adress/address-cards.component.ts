import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AddressService } from '../../../core/service/address.service';

@Component({
  selector: 'app-address-cards',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './address-cards.component.html',
  styleUrls: ['./address-cards.component.css']
})
export class AddressCardsComponent implements OnInit {

  addresses: any[] = [];
  showForm = false;
  editMode = false;
  editingId: number | null = null;

  addressForm!: FormGroup;

  constructor(
    private addressService: AddressService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadAddresses();

    this.addressForm = this.fb.group({
      receiver_name: ['', Validators.required],
      phone: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postal_code: ['', Validators.required],
      references: [''],
      is_default: [false]
    });
  }

  loadAddresses(): void {
    this.addressService.getAddresses().subscribe({
      next: (data) => this.addresses = data
    });
  }

  /* ========= CREAR ========= */
  openAddAddress(): void {
    this.editMode = false;
    this.editingId = null;
    this.addressForm.reset({ is_default: false });
    this.showForm = true;
  }

  /* ========= EDITAR ========= */
  openEditAddress(address: any): void {
    this.editMode = true;
    this.editingId = address.id;

    this.addressForm.patchValue({
      receiver_name: address.receiver_name,
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      references: address.references,
      is_default: address.is_default
    });

    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

  /* ========= SUBMIT ========= */
  submitAddress(): void {
    if (this.addressForm.invalid) return;

    const data = this.addressForm.value;

    if (this.editMode && this.editingId !== null) {
      // 🟡 UPDATE
      this.addressService.updateAddress(this.editingId, data)
        .subscribe(() => {
          this.closeForm();
          this.loadAddresses();
        });
    } else {
      // 🟢 CREATE
      this.addressService.createAddress(data)
        .subscribe(() => {
          this.closeForm();
          this.loadAddresses();
        });
    }
  }

  setDefault(address: any): void {
    this.addressService.updateAddress(address.id, {
      ...address,
      is_default: true
    }).subscribe(() => this.loadAddresses());
  }

  deleteAddress(id: number): void {
    if (!confirm('¿Seguro que deseas eliminar esta dirección?')) return;

    this.addressService.deleteAddress(id)
      .subscribe(() => this.loadAddresses());
  }
}
