import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,Platform,ToastController } from 'ionic-angular';
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

	constructor(public toastController: ToastController,private pusherNotify: PusherProvider,private localNotifications: LocalNotifications,private plt: Platform,public navCtrl: NavController, public navParams: NavParams,public httpClient: HttpClient,private alertCtrl: AlertController,public loadingController: LoadingController,private serviceUrl:ServiceUrlProvider) {
		this.warningToastDismissed = true
		this.usersServices = navParams.get('data');
		this.loading = this.loadingController.create({
			content: 'Por favor espere...'
		});
		this.url=serviceUrl.getUrl();
		this.usersArray=[];
		this.validateMT=false;

		this.plt.ready().then((readySource) => {
			this.localNotifications.on('click', (notification, state) => {
				let json = JSON.parse(notification.data);

				let alert = alertCtrl.create({
					title: notification.title,
					subTitle: json.mydata
				});
				alert.present();
			})
		});

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

		// for(let data of this.usersServices) {
			// this.averageRatingInt = data.averageRatingInt;
			// }

		}



		presentNotifications(){
			this.navCtrl.push(NotificationPage); // nav
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
			this.navCtrl.push(UserHiringPage,{data:items});
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
			.pipe(
				)
			.subscribe((res:any)=> {
				this.loading.dismiss();
				this.presentAlert();
				this.getHirings();
				this.navCtrl.push(HiringsPage); // nav

			},err => {
				this.loading.dismiss();
				this.errorAlert(err.error.errors);
			}); //subscribe
		}



		presentPrompt() {
			let alert = this.alertCtrl.create({
				title: 'Descripción',
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



		prueba(){
			console.log("lalal");
			console.log(this.usersArray);
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

	}
