import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FavoritePage } from './favorite';
import { StarRatingModule } from 'ionic3-star-rating';

@NgModule({
  declarations: [
    FavoritePage,
  ],
  imports: [
    StarRatingModule,
    IonicPageModule.forChild(FavoritePage),
  ],
})
export class FavoritePageModule {}
