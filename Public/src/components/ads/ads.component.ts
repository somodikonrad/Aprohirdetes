import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-ads',
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSnackBarModule, CommonModule, MatCardModule, MatExpansionModule, MatIconModule,],  
  templateUrl: './ads.component.html',
  styleUrl: './ads.component.scss'
})
export class AdsComponent {

  advertisements = [
    {
      title: 'Luxury Apartment for Rent',
      category: 'Real Estate',
      imageUrl: 'https://m.media-amazon.com/images/I/61IGtmeRsML._AC_SL1500_.jpg',
      description: 'Beautiful apartment located in downtown.',
      user: {
        name: 'John Doe',
        
      }
    },
    {
      title: 'Luxury Apartment for Rent',
      category: 'Real Estate',
      imageUrl: 'https://m.media-amazon.com/images/I/61IGtmeRsML._AC_SL1500_.jpg',
      description: 'Beautiful apartment located in downtown.',
      user: {
        name: 'Jane Smith',
        profilePicture: 'https://randomuser.me/api/portraits/women/30.jpg',
      }
    },
    {
      title: 'Modern Office Space Available',
      category: 'Real Estate',
      imageUrl: 'https://m.media-amazon.com/images/I/61IGtmeRsML._AC_SL1500_.jpg',
      description: 'Spacious office with great amenities.',
      user: {
        name: 'Michael Johnson',
        profilePicture: 'https://randomuser.me/api/portraits/men/55.jpg',
      }
    },
    {
      title: 'Luxury Villa with Pool for Sale',
      category: 'Real Estate',
      imageUrl: 'https://m.media-amazon.com/images/I/61IGtmeRsML._AC_SL1500_.jpg',
      description: 'Private villa with an amazing pool, ideal for families.',
      user: {
        name: 'Emily Clarke',
        profilePicture: 'https://randomuser.me/api/portraits/women/12.jpg',
      }
    },
    {
      title: 'Brand New Tesla Model S for Sale',
      category: 'Vehicles',
      imageUrl: 'https://m.media-amazon.com/images/I/61IGtmeRsML._AC_SL1500_.jpg',
      description: '2022 Tesla Model S, top performance and low mileage.',
      user: {
        name: 'Oliver Stone',
        profilePicture: 'https://randomuser.me/api/portraits/men/25.jpg',
      }
    },
    {
      title: 'High-End Kitchen Appliances for Sale',
      category: 'Household Appliances',
      imageUrl: 'https://m.media-amazon.com/images/I/61IGtmeRsML._AC_SL1500_.jpg',
      description: 'Brand new, high-quality kitchen appliances including fridge, oven, and microwave.',
      user: {
        name: 'Sophia Lee',
        profilePicture: 'https://randomuser.me/api/portraits/women/40.jpg',
      }
    },
    {
      title: 'Vintage Record Player for Sale',
      category: 'Household Appliances',
      imageUrl: 'https://m.media-amazon.com/images/I/61IGtmeRsML._AC_SL1500_.jpg',
      description: 'Classic record player in great condition, perfect for music lovers.',
      user: {
        name: 'Jack Taylor',
        profilePicture: 'https://randomuser.me/api/portraits/men/8.jpg',
      }
    },
    {
      title: 'Leather Jacket for Sale',
      category: 'Clothing',
      imageUrl: 'https://m.media-amazon.com/images/I/61IGtmeRsML._AC_SL1500_.jpg',
      description: 'Stylish leather jacket, size medium, brand new.',
      user: {
        name: 'Olivia Williams',
        profilePicture: 'https://randomuser.me/api/portraits/women/28.jpg',
      }
    },
    {
      title: 'Designer Handbag for Sale',
      category: 'Clothing',
      imageUrl: 'https://m.media-amazon.com/images/I/61IGtmeRsML._AC_SL1500_.jpg',
      description: 'Exclusive designer handbag in perfect condition.',
      user: {
        name: 'Liam Brown',
        profilePicture: 'https://randomuser.me/api/portraits/men/19.jpg',
      }
    },
    {
      title: 'Electric Scooter for Sale',
      category: 'Vehicles',
      imageUrl: 'https://m.media-amazon.com/images/I/61IGtmeRsML._AC_SL1500_.jpg',
      description: 'Brand new electric scooter, perfect for city commuting.',
      user: {
        name: 'Mia Green',
        profilePicture: 'https://randomuser.me/api/portraits/women/50.jpg',
      }
    },
    {
      title: 'Luxury Yacht for Sale',
      category: 'Vehicles',
      imageUrl: 'https://m.media-amazon.com/images/I/61IGtmeRsML._AC_SL1500_.jpg',
      description: 'Top-of-the-line luxury yacht with all the features you need for a relaxing trip.',
      user: {
        name: 'Alexander White',
        profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg',
      }
    }
  ];
  
  }
  
