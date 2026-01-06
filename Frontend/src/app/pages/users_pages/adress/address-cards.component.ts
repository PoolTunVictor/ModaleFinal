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
  loading = false;

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

  openAddAddress(): void {
    this.addressForm.reset({ is_default: false });
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

  submitAddress(): void {
    if (this.addressForm.invalid) return;

    this.addressService.createAddress(this.addressForm.value)
      .subscribe({
        next: () => {
          this.closeForm();
          this.loadAddresses();
        }
      });
  }

  setDefault(address: any): void {
    this.addressService.updateAddress(address.id, {
      ...address,
      is_default: true
    }).subscribe(() => this.loadAddresses());
  }

 deleteAddress(id: number): void {
  if (!confirm('¿Seguro que deseas eliminar esta dirección?')) {
    return;
  }

  this.addressService.deleteAddress(id).subscribe({
    next: () => {
      console.log('Dirección eliminada');
      this.loadAddresses(); // 🔄 refresca la lista
    },
    error: (err) => {
      console.error('Error eliminando dirección', err);
    }
  });
}
}
