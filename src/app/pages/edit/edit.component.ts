import { Component, OnInit } from '@angular/core';
import { FormBuilder,  Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CarroService } from 'src/app/core/services/carro.service';
import { Car } from 'src/app/shared/models/car';

export const defaultCar = {
  brand: "",
  year: "", 
  model: "",
  license: ""
}

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  showErrorMessage = false;
  carId!: string;

  itemForm = this.fb.group({
    model: ['', Validators.required],
    brand: ['', Validators.required],
    year: ['', Validators.required],
    license: ['', Validators.required]
  });

  constructor( 
    private fb: FormBuilder,
    private carroService: CarroService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getCar();
  }

  getCar() {
    this.activatedRoute.params.subscribe( params => {
      if ( "id" in params ) {
        this.carId = params.id;
        this.fetchCar();
      }
    });
  }

  fetchCar() {
    this.carroService.getCarsById(this.carId).subscribe(car => {
      this.itemForm.patchValue(car);
    }, error => console.log(error));
  }

  saveCar() {
    if ( this.itemForm.valid ) {
      this.showErrorMessage = false;
      const car = this.itemForm.value as Car;
      this.carroService.updateCar( this.carId, car ).subscribe( car => {
        this.itemForm.reset();
        alert("Carro atualizado com sucesso!");
      }, error => console.log(error));
    } else {
      this.showErrorMessage = true;
    }
  }

}
