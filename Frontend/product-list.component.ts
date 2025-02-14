import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../shared/services/product.service';
import { Product } from '../../shared/models/product.model';

@Component({
  selector: 'app-product-list',
  template: `
    <div class="search-container">
      <input 
        type="text" 
        [(ngModel)]="searchTerm" 
        (input)="onSearch()"
        placeholder="Search products...">
    </div>

    <!-- Problem: Loads all products at once -->
    <div class="products-grid">
      <div *ngFor="let product of products" class="product-card">
        <h3>{{product.name}}</h3>
        <p>{{product.description}}</p>
        <span>{{product.price | currency}}</span>
      </div>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  searchTerm: string = '';

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  // Problem: No debounce on search
  onSearch() {
    if (this.searchTerm) {
      this.productService.searchProducts(this.searchTerm)
        .subscribe(products => this.products = products);
    } else {
      this.loadProducts();
    }
  }

  private loadProducts() {
    this.productService.getAllProducts()
      .subscribe(products => this.products = products);
  }
}