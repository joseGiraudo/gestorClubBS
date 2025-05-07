import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-news-form',
  imports: [ReactiveFormsModule],
  templateUrl: './news-form.component.html',
  styleUrl: './news-form.component.css'
})
export class NewsFormComponent {

  newsForm: FormGroup;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder) {
    this.newsForm = this.fb.group({
      title: ['', Validators.required],
      summary: ['', Validators.required],
      content: ['', Validators.required],
      date: ['', Validators.required]
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit() {
    if (this.newsForm.invalid || !this.selectedFile) return;

    const formData = new FormData();
    formData.append('title', this.newsForm.value.title);
    formData.append('summary', this.newsForm.value.summary);
    formData.append('content', this.newsForm.value.content);
    formData.append('date', this.newsForm.value.date);
    formData.append('image', this.selectedFile); // importante que coincida con el nombre esperado por el backend

    console.log(formData);
    
  }
}
