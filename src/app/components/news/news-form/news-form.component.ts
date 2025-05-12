import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NewsService } from '../../../services/news.service';
import { CreateNews, News } from '../../../models/news';

@Component({
  selector: 'app-news-form',
  imports: [ReactiveFormsModule],
  templateUrl: './news-form.component.html',
  styleUrl: './news-form.component.css'
})
export class NewsFormComponent {

  newsForm: FormGroup;
  selectedFile: File | null = null;

  private newsService = inject(NewsService);

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


    const news: CreateNews = {
  title: this.newsForm.get('title')?.value,
  summary: this.newsForm.get('summary')?.value,
  content: this.newsForm.get('content')?.value,
  date: this.newsForm.get('date')?.value,
};

if (this.selectedFile) {
  this.newsService.createNews(news, this.selectedFile).subscribe({
    next: (res) => console.log('Éxito:', res),
    error: (err) => console.error('Error:', err)
  });
}
  }
}
