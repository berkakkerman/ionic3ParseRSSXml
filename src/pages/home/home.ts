import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import xml2js from 'xml2js';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

   public xmlItems : any;
   public csvItems : any;
   public tsvItems : any;

   constructor(public navCtrl: NavController,
               public http   : Http)
   {

   }



   ionViewWillEnter()
   {
      this.loadXML();
   }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
      this.loadXML();
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

   loadXML()
   {
      this.http.get('http://www.eyefootball.com/rss_news_transfers.xml')
      .map(res => res.text())
      .subscribe((data)=>
      {
         this.parseXML(data)
         .then((data)=>
         {
            this.xmlItems = data;
         });
      });
   }

   parseXML(data)
   {
      return new Promise(resolve =>
      {
         var k,
             arr    = [],
             parser = new xml2js.Parser({
                         trim: true,
                         explicitArray: true
                      });

         parser.parseString(data, function (err, result)
         {
            var obj = result.rss.channel[0].item;
            for(k in obj)
            {   
              var tempDesc = (''+obj[k].description[0]).split("src='");
              var tempDesc2 = (''+tempDesc[1]).split("'></A><BR>");
              var image = tempDesc2[0];
              var detail = (''+tempDesc2[1]).replace('</p>','');
              var transferObj = obj[k];
              transferObj.detail = detail;
              transferObj.image = image;                     
               arr.push(transferObj);
            }
            resolve(arr);
         });
      });
   }



  

}