import { Component, OnInit, signal } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch, faHome, faList, faCutlery } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [FormsModule, FontAwesomeModule]
})
export class HeaderComponent implements OnInit {
  searchTerm = signal("");
  faSearch = faSearch;
  faHome = faHome;
  faList = faList;
  faCutlery = faCutlery;
  constructor() { }

  ngOnInit(): void {
    console.log("HeaderComponent initialized");
  }

  onSearch() {

  }
}
