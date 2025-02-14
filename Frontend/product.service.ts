import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product, SearchResult } from '../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;
  
  // Inefficient local cache
  private productCache = new Map<string, Product>();
  private productsSubject = new BehaviorSubject<Product[]>([]);

  constructor(private http: HttpClient) {}

  // Problem: Loads all products at once
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  // Problem: No pagination
  searchProducts(term: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/search?term=${term}`);
  }

  // Problem: Inefficient caching
  getProduct(id: string): Observable<Product> {
    const cached = this.productCache.get(id);
    if (cached) {
      return new Observable(observer => {
        observer.next(cached);
        observer.complete();
      });
    }
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }
}