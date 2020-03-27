import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PersonnesService} from '../personnes.service';
import {Depense, Personne} from '../datas.model';
import {MatDialog} from '@angular/material';
import {DialogDepenseComponent} from '../dialog-depense/dialog-depense.component';

@Component({
  selector: 'app-details-personne',
  templateUrl: './details-personne.component.html',
  styleUrls: ['./details-personne.component.css']
})
export class DetailsPersonneComponent implements OnInit {
  loading: boolean = false;
  personne: Personne;


  constructor(private route: ActivatedRoute,
              private router: Router,
              private service: PersonnesService,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.loading = true;
    this.service.getPersonne(id).subscribe(rep => {
      console.log(rep);
      this.personne = rep;
      console.log(`Dépenses globales = ${this.personne.montantDepenses}`);
      this.loading = false;
    });
  }

  edit(depense: Depense) {
    console.log('Edit : ', depense);
    this.router.navigate(['/edit', this.personne.ident, depense.ident]);
  }

  suppression(depense: Depense) {
    console.log('Suppression : ', depense);
    this.openDialog(depense);
  }

  openDialog(depense: Depense): void {
    const dialogRef = this.dialog.open(DialogDepenseComponent, {
      width: '500px',
      data: {
        montant: depense.montant,
        libelle: depense.libelle,
        dd: depense.dd,
        nature: depense.nature,
        id: depense.ident
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('suppression validée');
        if (this.personne.supprimeDepense(depense.ident)) {
          this.loading = true;
          this.service.updatePersonne(this.personne).subscribe(personne => {
            this.loading = false;
          });
        }
        return;
      }
      console.log('suppression annulée');
      return;
    });
  }
}

export interface DialogData {
  montant: number;
  dd: Date;
  libelle: string;
  nature: string;
  id: number;
}
