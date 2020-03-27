import {Component, Input, OnInit} from '@angular/core';
import {Depense, Personne} from '../datas.model';
import {MessagesService} from '../messages.service';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {PersonnesService} from '../personnes.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-edit-depense',
  templateUrl: './edit-depense.component.html',
  styleUrls: ['./edit-depense.component.css']
})
export class EditDepenseComponent implements OnInit {
  loading: boolean;
  personne: Personne;
  depense: Depense;
  constructor(private route: ActivatedRoute, private router: Router, private service: PersonnesService) { }

  ngOnInit() {
    const idP = +this.route.snapshot.paramMap.get('id_p');
    const idD = +this.route.snapshot.paramMap.get('id_d');
    this.loading = true;
    this.service.getPersonne(idP).subscribe(personne => {
      this.personne = personne;
      this.depense = personne.getdepense(idD);
      this.loading = false;
      console.log('Dépense sélectionnee : ', this.depense);
    });
  }

  editDepense($event) {
    if (this.personne.updateDepense($event)) {
      this.loading = true;
      this.service.updatePersonne(this.personne).subscribe(personne => {
        this.loading = false;
      });
    }
    this.router.navigate(['/details', this.personne.ident]);
  }
}
