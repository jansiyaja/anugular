import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  items: any[] = [];
  form = {
    name: '',
    age: '',
    education: ''
  };
  showCreateForm = false;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadItems();
  }

  toggleCreateForm() {
    this.showCreateForm = !this.showCreateForm;
  }

  loadItems() {
    this.api.getItems().subscribe((data: any[]) => this.items = data);
  }

  createCard() {
    const { name, age, education } = this.form;
    if (name && age && education) {
      this.api.addItem({ title: name, description: `${age}, ${education}` }).subscribe(() => {
        this.form = { name: '', age: '', education: '' };
        this.showCreateForm = false;
        this.loadItems();
      });
    }
  }

  editItem(item: any) {
    const name = prompt('Edit name', item.title);
    const description = prompt('Edit details', item.description);
    if (name && description) {
      this.api.updateItem(item.id, { title: name, description }).subscribe(() => this.loadItems());
    }
  }

  deleteItem(id: number) {
    this.api.deleteItem(id).subscribe(() => this.loadItems());
  }
}