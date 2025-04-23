import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  imports: [RouterLink, CommonModule]
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();

  constructor() { }
}
