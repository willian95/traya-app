import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,Platform,ToastController, Events } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { UserHiringPage } from '../user-hiring/user-hiring';
import { AlertController } from 'ionic-angular';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';
import { NotificationPage } from '../notification/notification';
import { HiringsPage } from '../hirings/hirings';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { PusherProvider } from '../../providers/pusher/pusher';


@IonicPage()
@Component({
	selector: 'page-users-services',
	templateUrl: 'users-services.html',
})
export class UsersServicesPage {
	url:any;
	warningToastDismissed:boolean
	ads:any
	oddAds:any
	evenAds:any
	showUpperAds:any
	showLowerAds:any
	upperAdArray:any
	lowerAdArray:any
	upperAdWeight:any
	lowerAdWeight:any
	seenAds:any

	constructor(public toastController: ToastController,private pusherNotify: PusherProvider,private localNotifications: LocalNotifications,private plt: Platform,public navCtrl: NavController, public navParams: NavParams,public httpClient: HttpClient,private alertCtrl: AlertController,public loadingController: LoadingController,private serviceUrl:ServiceUrlProvider, public events: Events) {
		
		this.showUpperAds = true
		this.showLowerAds = true
		this.upperAdWeight = 0;
		this.lowerAdWeight = 0;
		this.upperAdArray = []
		this.lowerAdArray = [];
		this.seenAds = []

		this.warningToastDismissed = true
		this.usersServices = navParams.get('data');
		this.loading = this.loadingController.create({
			content: 'Por favor espere...'
		});
		this.url=serviceUrl.getUrl();
		this.usersArray=[];
		this.validateMT=false;

		/*this.plt.ready().then((readySource) => {
			this.localNotifications.on('click', (notification, state) => {
				let json = JSON.parse(notification.data);

				let alert = alertCtrl.create({
					title: notification.title,
					subTitle: json.mydata
				});
				alert.present();
			})
		});*/

	}
	name:any;
	usersServices:any;
	userName:any;
	userImage:any;
	userEmail:any;
	userPassword:any;
	userDescription:any;
	userPhone:any;
	services_id:any;
	loading:any;
	token:any;
	hiringsArray:any;
	tokenCode:any;
	user_id:any;
	notificationArray:any;
	notificationNumber:any;
	averageRatingInt:any;
	hiringDescription:any;
	usersArray:any;
	validateMT:any;
	currentTime:any
	noAdDueTime:any

	scheduleNotification(message,hiring_id) {
		this.localNotifications.schedule({
			id: 1,
			title: 'Atención',
			text: message,
			data: { mydata: hiring_id },
			sound: null
		});
	}


	ionViewDidLoad() {

		const channel = this.pusherNotify.init();
		let self = this;
		channel.bind('notificationUser', function(data) {
			self.scheduleNotification(data.message,data.hiring.id);
		});

		this.name = localStorage.getItem('servicesName');
		this.userName = localStorage.getItem('user');
		this.userImage = localStorage.getItem('userimage');
		this.userEmail = localStorage.getItem('useremail');
		this.userDescription = localStorage.getItem('userdescription');
		this.userPhone = localStorage.getItem('userphone');
		this.services_id = localStorage.getItem('services_id');
		this.user_id = localStorage.getItem('user_id');
		this.getNotifications();

		this.getLowerAds()
		this.getUpperAds()

		if(localStorage.getItem('noUpperAdDueTime') != null){
			let dueTime = localStorage.getItem('noUpperAdDueTime')
			let currentDate = new Date()
			let dueDate = new Date()
			
			this.currentTime = currentDate.getTime()
			this.noAdDueTime = dueDate.setTime(parseInt(dueTime))

			if(currentDate.getTime() > dueDate.setTime(parseInt(dueTime))){
				this.showUpperAds = true
			}
				
			else
				{
					this.showUpperAds = false
				}

		}else{
			this.showUpperAds = true
		}

		if(localStorage.getItem('noLowerAdDueTime') != null){
			let dueTime = localStorage.getItem('noLowerAdDueTime')
			let currentDate = new Date()
			let dueDate = new Date()
			
			this.currentTime = currentDate.getTime()
			this.noAdDueTime = dueDate.setTime(parseInt(dueTime))

			if(currentDate.getTime() > dueDate.setTime(parseInt(dueTime))){
				this.showLowerAds = true
				
			}
				
			else
				{
					this.showLowerAds = false
				}

		}else{
			this.showLowerAds = true
		}
		

		}

		ionViewDidEnter(){
			this.storeAction()
		  }
		
		  storeAction(){
			var user_id = localStorage.getItem('user_id')
			console.log(user_id)
			
			this.httpClient.post(this.url+"/api/userLastAction", {user_id: user_id} )
			.pipe(
			  )
			.subscribe((res:any)=> {
			  console.log(res)
			  
		  
			},err => {
			  
			});
		  
		   }


		presentNotifications(){
			this.navCtrl.push("NotificationPage"); // nav
		}

		   async presentAlert() {
		    const toast = await this.toastController.create({
		      message: 'Enviado con éxito.',
		      duration: 10000,
		      showCloseButton: true,
		      closeButtonText: 'Cerrar',
		      cssClass: 'urgent-notification'
		    });
		    toast.present();
  			}


		getNotifications(){
			this.httpClient.get(this.url+"/api/notification/"+this.user_id+'?filters={"read":0}')
			.pipe()
			.subscribe((res:any)=> {
				this.notificationArray=res.data;
				this.notificationNumber = this.notificationArray.length;

			});
		}

		 async errorAlert(message) {
		    const toast = await this.toastController.create({
		      message: message,
		      duration: 10000,
		      showCloseButton: true,
		      closeButtonText: 'Cerrar',
		      cssClass: 'urgent-notification'
		    });
		    toast.present();
  			}

		viewProfile(items,i){
			this.navCtrl.push("UserHiringPage",{data:items});
		}
		getHirings() {
			this.user_id = localStorage.getItem('user_id');
			// this.httpClient.get(this.url+"/api/hiring?"+"user_id="+this.user_id)
			this.httpClient.get(this.url+"/api/hiring?"+"user_id="+this.user_id+'&filters={"status_id":[1,2,3]}')
			.pipe()
			.subscribe((res:any)=> {
				this.hiringsArray=res.data;
			});
		}
		mt(){
			this.loading.present();
			var headers = new Headers();
			headers.append("Accept", 'application/json');
			headers.append('Content-Type', 'application/json' );
			this.tokenCode = localStorage.getItem('tokenCode');
			
			return  this.httpClient.post(this.url+"/api/hiring_mt4", {"description":this.hiringDescription,"service_id":this.services_id,"token":this.tokenCode,"users":this.usersArray})
			.pipe()
			.subscribe((res:any)=> {
				this.loading.dismiss();
				this.presentAlert();
				this.getHirings();
				this.events.publish("countHirings", "count")
				this.navCtrl.push("ServicesPage"); // nav
				

			},err => {
				this.loading.dismiss();
				this.errorAlert(err.error.errors);
			}); //subscribe
		}

		presentPrompt() {
			let alert = this.alertCtrl.create({
				title: 'Descripción de la multi-solicitud',
				inputs: [
				{
					name: 'descripcion',
					placeholder: 'Descripción'
				}
				],
				buttons: [
				{
					text: 'Cancelar',
					role: 'cancel',
					handler: data => {
						console.log('Cancel clicked');
					}
				},
				{
					text: 'Enviar',
					handler: data => {
						this.hiringDescription=data.descripcion;
						this.mt();
					}
				}
				]
			});
			alert.present();
		}

		addCheckbox(event, checkbox : String) {
			
			console.log(this.usersArray.length)

			let exist = false
			
				for(let i = 0; i < this.usersArray.length; i++){
					if(this.usersArray[i] == checkbox){
						exist = true
						this.usersArray.pop(checkbox)
					}
				}
			
			if(this.usersArray.length < 5){
				if(exist == false)
					this.usersArray.push(checkbox);	

			}

			else{
				if(this.warningToastDismissed == true){
					this.warningToastMessage()
				}
				event.checked = false;
			}

		}


		getCheckedBoxes() {
			//Do whatever
			console.log(this.usersArray);
		}
		showCheckbox(){
			this.validateMT=true;
			this.toastMessage();
		}

		async toastMessage() {
			const toast = await this.toastController.create({
				message: 'Por favor seleccione los trabajadores',
				duration: 2000
			});
			toast.present();
		}

		warningToastMessage() {
			const toast = this.toastController.create({
				message: 'Solo puede seleccionar un máximo de 5 trabajadores',
				duration: 2000
			});

			this.warningToastDismissed = false

			toast.onDidDismiss(() => {
				this.warningToastDismissed = true
			});

			toast.present();
		}

		getUpperAds(){

			/*return  this.httpClient.post(this.url+"/api/ads", {location_id: localStorage.getItem('user_locality_id'), seenAds: JSON.parse(localStorage.getItem('seenAds'))})
			.pipe()
			.subscribe((res:any)=> {

				if(res.destroyStorage == true){
					localStorage.removeItem('seenAds')
					this.getAds()
				}

				this.adsAssign(res.ads)
			},err => {
				
			}); //subscribe
			*/

			//console.log("upperAdArray", this.upperAdArray)

			return  this.httpClient.post(this.url+"/api/ads", {location_id: localStorage.getItem('user_locality_id'), upperAdWeight: this.upperAdWeight, seenAds: this.seenAds})
			.pipe()
			.subscribe((res:any)=> {


				
				if(res.fewerAds.length == 1){
					this.upperAdArray.push(res.fewerAds[0])
				}
				else if(res.fewerAds.length == 2){
					this.upperAdArray.push(res.fewerAds[0])
				}
				else if(res.fewerAds.length == 3){
					this.upperAdArray.push(res.fewerAds[2])
				}

				else{
					if(res.noAds == true){
						this.showUpperAds = false
					}else{
	
						if(res.ads.length > 0 && res.exists > 0){
	
							if(res.ads[0]){
								if((res.ads[0].ad_type_id + this.upperAdWeight) <= 3 && this.upperAdWeight <= 3){
								
									this.upperAdWeight = this.upperAdWeight + res.ads[0].ad_type_id
									this.upperAdArray.push(res.ads[0])
									this.seenAds.push(res.ads[0].id)
									
									this.upperAdArray.sort(function(a, b){
										//return a.ad_type_id - b.ad_type_id
										console.log("sort-a", a)
										console.log("sort-b", b)
										if (a.ad_type_id === b.ad_type_id) {
											return 0;
										}
										else {
											return (a.ad_type_id > b.ad_type_id) ? -1 : 1;
										}
									})
	
									this.getUpperAds()
				
								}else if((res.ads[0].ad_type_id + this.upperAdWeight) > 3 && this.upperAdWeight < 3){
			
									this.getUpperAds()
			
								}
							}
		
						}
	
					}
				}
				

			},err => {
				
			});


		}

		getLowerAds(){

			/*return  this.httpClient.post(this.url+"/api/ads", {location_id: localStorage.getItem('user_locality_id'), seenAds: JSON.parse(localStorage.getItem('seenAds'))})
			.pipe()
			.subscribe((res:any)=> {

				if(res.destroyStorage == true){
					localStorage.removeItem('seenAds')
					this.getAds()
				}

				this.adsAssign(res.ads)
			},err => {
				
			}); //subscribe
			*/

			return  this.httpClient.post(this.url+"/api/ads", {location_id: localStorage.getItem('user_locality_id'), upperAdWeight: this.lowerAdWeight, seenAds: this.seenAds})
			.pipe()
			.subscribe((res:any)=> {
				
				console.log("lower", res)
				if(res.fewerAds.length == 1){
					
				}
				else if(res.fewerAds.length == 2){

					this.lowerAdArray.push(res.fewerAds[1])
				}else if(res.fewerAds.length == 3){
					this.lowerAdArray.push(res.fewerAds[1])
				}
				else{

					if(res.noAds == true){
						this.showLowerAds = false
					}else{
	
						if(res.ads.length > 0 && res.exists > 0){
	
							if(res.ads[0]){
		
								if((res.ads[0].ad_type_id + this.lowerAdWeight) <= 3 && this.lowerAdWeight <= 3){
								
									this.lowerAdWeight = this.lowerAdWeight + res.ads[0].ad_type_id
									this.lowerAdArray.push(res.ads[0])
									this.seenAds.push(res.ads[0].id)
	
									this.lowerAdArray.sort(function(a, b){
										//return a.ad_type_id - b.ad_type_id
										//console.log("sort-a", a)
										//console.log("sort-b", b)
										if (a.ad_type_id === b.ad_type_id) {
											return 0;
										}
										else {
											return (a.ad_type_id > b.ad_type_id) ? -1 : 1;
										}
									})
			
									this.getLowerAds()
				
								}else if((res.ads[0].ad_type_id + this.lowerAdWeight) > 3 && this.lowerAdWeight < 3){
			
									this.getLowerAds()
			
								}
		
							}
		
						}
	
					}

				}
				

			},err => {
				
			});

		}


		adsAssign(ads){
			
			var evenAds = []
			var oddAds = []
			var evenAdsCount = 0
			var oddAdsCount = 0
			var totalWeight = 0

			for(let i = 0; i < ads.length; i++){
				
				if((i+1) % 2 == 0){

					if(evenAdsCount < 3 && evenAdsCount + parseInt(ads[i].ad_type_id) <= 3){
						evenAdsCount += parseInt(ads[i].ad_type_id)
						evenAds.push(ads[i])
						this.storeSeenAds(ads[i].id)
						totalWeight += parseInt(ads[i].ad_type_id)
					}
					
				}else{
					if(oddAdsCount < 3 && oddAdsCount + parseInt(ads[i].ad_type_id) <= 3){
						oddAdsCount += parseInt(ads[i].ad_type_id)
						oddAds.push(ads[i])
						this.storeSeenAds(ads[i].id)
						totalWeight += parseInt(ads[i].ad_type_id)
					}
				}

			}

			
			this.removeAdsFromStorage()
			

			this.evenAds = evenAds
			this.oddAds = oddAds

		}

		removeAdsFromStorage(){


			let items = JSON.parse(localStorage.getItem('seenAds'))

			if(items.length > 5){
				//items.shift()
				items.splice(Math.floor(Math.random() * items.length) + 1, 1)
			}

			if(items.length > 8){
				//items.shift()
				items.splice(Math.floor(Math.random() * items.length) + 1, 1)
			}

			items.shift()
			localStorage.setItem('seenAds', JSON.stringify(items))

		}

		storeSeenAds(id){

			if(localStorage.getItem('seenAds') == null){
				localStorage.setItem('seenAds', JSON.stringify([id]))
			}else{

				let items = JSON.parse(localStorage.getItem('seenAds'))
				items.push(id)
				localStorage.setItem('seenAds', JSON.stringify(items))
			}

		}

		askForDeleteAds(type){
			
			const confirm = this.alertCtrl.create({
				title: '¿Deseas no ver más anuncios en esta sección?',
				message: 'Pasarán 15 minutos hasta que puedas volver a verlos',
				buttons: [
					{
						text: 'No',
						handler: () => {
							console.log('Disagree clicked');
						}
					},
					{
						text: 'Sí',
						handler: () => {
							
							this.noAds(type)

						}
					}
				]
			});
			confirm.present();

		}

		noAds(type){
			var d = new Date();
			let minutes = 15

			this.currentTime = d.getTime()

			var dueTime = d.getTime() + minutes *60000
			localStorage.setItem('no'+type+'AdDueTime', dueTime+"")

			this.noAdDueTime = d.getTime() + minutes *60000

			if(type == 'Upper'){
				this.showUpperAds = false
			}else if(type == 'Lower'){
				this.showLowerAds = false
			}

		}


	}
