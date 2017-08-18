import { Component, ViewChild } from '@angular/core';
import { NavParams, ToastController, App, Content, LoadingController } from 'ionic-angular';

//Other Plugins
import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  selector: 'page-exam',
  templateUrl: 'exam.html',
})
export class ExamPage {

  @ViewChild(Content) content: Content;

  childColor       = this.navParams.get('childColor');
  tutorialOn       = true;
  hideExam         = false;
  showOrientation  = false;
  showHelpMap      = false;
  showOkResult     = false;
  buttonText       = "Continuar";
  stepTitle        = "Passo 1 - Exame Extraoral";
  actualExamPhoto  = 0;
  defaultPhoto     = "./assets/images/default-image.jpg";
  tookPhoto        = "";
  examPhotos       = [
    "./assets/images/exam/exam-1.jpg",
    "./assets/images/exam/exam-2.jpg",
  ];
  questionsKeys    = [
    "questionOne", 
    "questionTwo", 
    "questionThree", 
    "questionFour", 
    "questionFive", 
    "questionSix", 
    "questionSeven", 
    "questionEight"
  ];
  choosedQuestions = {
    questionOne:   "",
    questionTwo:   "",
    questionThree: "",
    questionFour:  "",
    questionFive:  "",
    questionSix:   "",
    questionSeven: "",
    questionEight: ""
  };
  savedQuestions   = [];

  constructor(public navParams: NavParams, public toastCtrl: ToastController,
  public app: App, public loadCtrl: LoadingController, public camera: Camera) {}

  public saveQuestions() {
    let empty        = this._checkFields();
    let choosedClone = Object.assign({}, this.choosedQuestions);

    if(empty) {
      let toastPortal = this.app._appRoot._toastPortal.getActive();

      if(toastPortal){
        toastPortal.dismiss();
      }

      this.toastCtrl.create({
        position: "bottom",
        message:  "Você deve responder todas as perguntas",
        duration: 2000
      }).present();

      return false;
    }

    this.savedQuestions.push(choosedClone);
    this.actualExamPhoto++;
    this._uncheckFields();

    if(this.actualExamPhoto === 1) {
      this.buttonText = "Finalizar autoexame";
      this.stepTitle  = "Passo 2 - Exame Intraoral"; 
    }

    if(this.actualExamPhoto === 2) {
      this._calculateResult();

      return false;
    }

    this.toastCtrl.create({
      position: "bottom",
      message:  "Etapa " + (this.actualExamPhoto) + " de 2 concluída",
      duration: 1500
    }).present();

    this._scrollToTop();
  }

  private _calculateResult() {
    let load           = this.loadCtrl.create({content: "Obtendo resultado..."});
    let totalQuestions = 16;
    let yesCount       = 0;
    let calc           = 0;
    let keys           = this.questionsKeys;

    load.present();
    this.savedQuestions.forEach((value, index) => {
      keys.forEach((key, index) => {
        if(value[key] === "1")
          yesCount++;
      });
    });

    calc = (yesCount * 100)/totalQuestions;

    if (calc == 0) {
      this.showOkResult = true;
    }

    if (calc > 0 && calc <= 30) {
      this.showOrientation = true;
    }

    if(calc > 30) {
      this.showHelpMap = true;
    }

    this.hideExam = true;
    load.dismiss();
  }

  private _checkFields() {
    let empty  = false;
    let fields = this.choosedQuestions;

    if(!fields.questionOne || !fields.questionTwo || !fields.questionThree ||
    !fields.questionFour || !fields.questionFive || !fields.questionSix ||
    !fields.questionSeven || !fields.questionEight) {
      empty = true;
    }

    return empty;
  }

  private _uncheckFields() {
    let choosedQuestions = this.choosedQuestions;
    let keys             = this.questionsKeys;

    keys.forEach((key, index) => {
      choosedQuestions[key] = "";
    });

    this.tookPhoto = "";
  }

  public doItAgain() {
    this.savedQuestions.splice(0);
    this.actualExamPhoto = 0;
    this.buttonText      = "Continuar";
    this.tookPhoto       = "";
    this.hideExam        = false;
  }

  public choosePhoto() {
    let options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true
    }

    this.camera.getPicture(options).then((imageData) => {
      this.tookPhoto = 'data:image/jpeg;base64,' + imageData;
    }, (err) => console.log(err));
  }

  private _scrollToTop() {
    this.content.scrollToTop();
  }
}
