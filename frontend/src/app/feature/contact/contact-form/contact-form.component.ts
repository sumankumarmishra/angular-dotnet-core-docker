import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbCalendar, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ValidationService } from '../../../@core/services/validation.service';
import { ContactService } from '../contact.service';
import { errorTailorImports } from "../../../@core/components/validation";

@Component({
    selector: 'app-contact-form',
    imports: [ReactiveFormsModule, RouterModule, CommonModule, errorTailorImports, NgbDatepickerModule],
    templateUrl: './contact-form.component.html',
    styleUrl: './contact-form.component.css',
    providers: [ContactService]
})
export class ContactFormComponent implements OnInit {
    contactForm: UntypedFormGroup;
    constructor(
        private formBuilder: UntypedFormBuilder,
        private router: Router,
        private validationService: ValidationService,
        private contactService: ContactService,
        private activatedRoute: ActivatedRoute,
        private toastrService: ToastrService
    ) {}

    createForm(): void {
        this.contactForm = this.formBuilder.group({
            id: ['', []],
            firstName: [
                '',
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(35),
                ],
            ],
            lastName: [
                '',
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(35),
                ],
            ],
            dateOfBirth:[],
            email: [
                '',
                [Validators.required, this.validationService.emailValidator],
            ],
            countryCode: ['', [Validators.required]],
            mobile: ['', [Validators.required]],
            city: ['', [Validators.required]],
            postalCode: ['', [Validators.required]],
        });
    }

    reset(): void {
        const contact = this.contactForm.value;
        if (contact.id) {
            this.getContactDetails();
        } else {
            this.contactForm.reset();
        }
    }
    submit(): void {
        const contact = this.contactForm.value;
        if (contact.id) {
            this.update(contact);
        } else {
            delete contact.id;
            this.save(contact);
        }
    }

    save(contact: any): void {
        this.contactService.create(contact).subscribe(
            (data) => {
                this.toastrService.success(
                    'Contact created successfully',
                    'Success'
                );
                this.router.navigate(['/contacts']);
            },

            (error) => {}
        );
    }
    update(contact: any): void {
        this.contactService.update(contact).subscribe(
            (data) => {
                this.toastrService.success(
                    'Contact updated successfully',
                    'Success'
                );
                this.router.navigate(['/contacts']);
            },

            (error) => {}
        );
    }
    ngOnInit(): void {
        this.createForm();
        this.getContactDetails();
    }

    private getContactDetails() {
      console.log("data", this.activatedRoute.snapshot.data);
        const contactDetails = this.activatedRoute.snapshot.data.contactDetails;
        if (contactDetails) {
            this.contactForm.patchValue(contactDetails);
            this.contactForm.controls.dateOfBirth.setValue(this.formatDate(contactDetails.dateOfBirth));
        }
    }
    private formatDate(jsonDate: string): string {
      const date = new Date(jsonDate);
      return date.toISOString().split('T')[0]; // yyyy-MM-dd format
    }
}
