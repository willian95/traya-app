import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';

/**
 * Generated class for the ModalContactReviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-contact-review',
  templateUrl: 'modal-contact-review.html',
})
export class ModalContactReviewPage {

  user:any
  contactReview:any
  url:any
  showSecondQuestion:any = null
  showLastScreen:any = null
  service:any

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, private serviceUrl: ServiceUrlProvider) {
    this.user = this.navParams.get('userReceiver');
    this.service = this.navParams.get('service');
    this.contactReview = this.navParams.get("contactReview")
    this.url=serviceUrl.getUrl();
    
  }

  ionViewDidEnter() {
    this.user = this.navParams.get('userReceiver');
    this.contactReview = this.navParams.get("contactReview")
    this.service = this.navParams.get('service');
   
  }

  firstQuestionAnswer(answer){
    this.showSecondQuestion = answer
    this.httpClient.post(this.url+"/api/contact-review/first-question-answer", {answer: answer, contact_review_id: this.contactReview.id})
    .subscribe((res:any) => {

      

    })

  }

  secondQuestionAnswer(answer){
    
    this.showLastScreen = answer

    if(answer == true){
      this.httpClient.post(this.url+"/api/contact-review/second-question-answer", {answer: answer, contact_review_id: this.contactReview.id})
      .subscribe((res:any) => {


        localStorage.setItem("contactReviewId", res.hiring.id)
        this.navCtrl.pop()


      })
    }

  }

  hideModal(){
    this.navCtrl.pop()
  }

}
