import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ImageModule } from 'primeng/image';
import { AdminService } from '../../_services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { CreateHomeImage } from '../../_models/createhomeimage';
import { ImageDTO } from '../../_models/image';
import { ImageService } from '../../_services/image.service';
import { ButtonModule } from 'primeng/button';
import { NgFor } from '@angular/common';
@Component({
  selector: 'app-admin-images',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    ImageModule,
    ButtonModule,
    NgFor
  ],
  templateUrl: './admin-images.component.html',
  styleUrl: './admin-images.component.css'
})
export class AdminImagesComponent implements OnInit {
  uploadForm!: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string = '';
  isSubmitting: boolean = false;
  images: ImageDTO[] = [];

  constructor(
    private adminService: AdminService,
    private imageService: ImageService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.uploadForm = new FormGroup({
      title: new FormControl('', Validators.required)
    });
    this.loadImages();
  }

  loadImages(): void {
    this.imageService.getImages().subscribe({
      next: (imgs: ImageDTO[]) => {
        this.images = imgs;
      },
      error: (err) => {
        console.error('Error loading images:', err);
        this.toastr.error('Failed to load images');
      }
    });
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      if (this.selectedFile) {
        reader.readAsDataURL(this.selectedFile);
      }
    }
  }

  // Trigger the hidden file input.
  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  // Combined button action: if no file is selected, open file dialog; if file selected, upload it.
  handleButtonClick(): void {
    if (!this.selectedFile) {
      this.triggerFileInput();
    } else {
      this.onSubmit();
    }
  }

  // Remove selected file and preview.
  removeSelectedImage(): void {
    this.selectedFile = null;
    this.imagePreview = '';
  }

  onSubmit(): void {
    if (this.uploadForm.invalid || !this.selectedFile) {
      this.uploadForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    const formData = new FormData();
    formData.append('Title', this.uploadForm.get('title')?.value);
    formData.append('File', this.selectedFile);

    this.adminService.uploadHomeImage(formData).subscribe({
      next: (response: CreateHomeImage) => {
        this.toastr.success('Image uploaded successfully');
        this.isSubmitting = false;
        this.uploadForm.reset();
        this.removeSelectedImage();
        // Reload gallery after successful upload.
        this.loadImages();
      },
      error: (error) => {
        console.error('Upload error:', error);
        this.toastr.error('Failed to upload image');
        this.isSubmitting = false;
      }
    });
  }

  deleteImage(publicId: string): void {
    if (confirm('Are you sure you want to delete this image?')) {
      this.imageService.deleteImage(publicId).subscribe({
        next: () => {
          this.toastr.success('Image deleted successfully');
          // Remove the deleted image from the local gallery.
          this.images = this.images.filter(img => img.publicId !== publicId);
        },
        error: (error) => {
          console.error('Deletion error:', error);
          this.toastr.error('Failed to delete image');
        }
      });
    }
  }
}
