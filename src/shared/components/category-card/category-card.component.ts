import { Component, input } from "@angular/core";
import { Category } from "../../../core/models/category.type";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-category-card',
  templateUrl: './category-card.component.html',
  imports: [RouterLink]
})
export class CategoryCardComponent {
  category = input<Category>();
}
