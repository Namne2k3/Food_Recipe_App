import { Component, input } from "@angular/core";
import { Meal } from "../../../core/models/meal.type";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-meal-card',
  imports: [RouterLink],
  templateUrl: './meal-card.component.html',
})
export class MealCardComponent {
  meal = input.required<Meal>()
}
