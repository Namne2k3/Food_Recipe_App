import { Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { MealSummary } from "../../../core/models/meal.type";

@Component({
  selector: 'app-meal-summary-card',
  imports: [RouterLink],
  templateUrl: './meal-summary-card.component.html',
})
export class MealSummaryCard {
  meal = input.required<MealSummary>()
}
