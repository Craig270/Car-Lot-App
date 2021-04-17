"use strict";
//House
class CarLot {
  constructor(name) {
    this.name = name;
    this.car = [];
  }

  //addRoom   (name, area)
  addCar(name, year) {
    this.car.push(new Car(name, year));
  }
}
//Room
class Car {
  constructor(name, year) {
    this.name = name;
    this.year = year;
  }
}

class CarLotServices {
  static url = "https://ancient-taiga-31359.herokuapp.com/api/houses";

  //
  static getAllCarLots() {
    return $.get(this.url);
  }

  static getCarLot(id) {
    return $.get(this.url + `/${id}`);
  }
  static createCarLot(carLot) {
    return $.post(this.url, carLot);
  }

  //Works but I'm not sure why. Need to research more...
  static updateCarLot(car) {
    return $.ajax({
      url: this.url + `/${car._id}`,
      dataType: "json",
      data: JSON.stringify(car),
      contentType: "application/json",
      type: "PUT",
    });
  }

  static deleteCarLot(id) {
    return $.ajax({
      url: this.url + `/${id}`,
      type: "DELETE",
    });
  }
}

class DOMManager {
  static carLots;

  static getAllCarLots() {
    CarLotServices.getAllCarLots().then((carlots) => this.render(carlots));
  }

  static createCarLot(name) {
    CarLotServices.createCarLot(new CarLot(name))
      .then(() => {
        return CarLotServices.getAllCarLots();
      })
      .then((carlots) => this.render(carlots));
  }

  static deleteCarLot(id) {
    CarLotServices.deleteCarLot(id)
      .then(() => {
        return CarLotServices.getAllCarLots();
      })
      .then((carlots) => this.render(carlots));
  }

  static addCar(id) {
    for (let carLot of this.carLots) {
      if (carLot._id == id) {
        carLot.rooms.push(
          new Car(
            $(`#${carLot._id}-car-name`).val(),
            $(`#${carLot._id}-car-year`).val()
          )
        );
        CarLotServices.updateCarLot(name)
          .then(() => {
            return CarLotServices.getAllCarLots();
          })
          .then((carLots) => this.render(carLots));
      }
    }
  }

  static deleteCar(carLotId, carId) {
    for (let carLot of this.carLots) {
      if (carLot._id == carLotId) {
        for (let car of carLot.rooms) {
          if (car._id == carId) {
            carLot.rooms.splice(carLot.rooms.indexOf(car), 1);
            CarLotServices.updatecarLot(carLot)
              .then(() => {
                return CarLotServices.getAllCarLots();
              })
              .then((carLots) => this.render(carLots));
          }
        }
      }
    }
  }
  //change
  static render(carLots) {
    this.carLots = carLots;
    $("app").empty();
    for (let carLot of this.carLots) {
      $("#app").prepend(
        `<div id="${carLot._id}" class="card">
            <div class="card-header"> 
                <h2>${carLot.name}</h2>
                <button class="btn btn-danger" onclick="DOMManager.deleteCarLot('${carLot._id}')">Delete</button>
            </div>
            <div class="card-body">
                <div class="card">
                    <div class="row">
                        <div class="col-sm">
                            <input type="text" id="${carLot._id}-car-name" class="form-control" placeholder="Car Make And Model">
                        </div>
                        <div class="col-sm">
                            <input type="text" id="${carLot._id}-car-year" class="form-control" placeholder="Year">
                        </div>
                
                        </div>
                        <button id="${carLot._id}-new-car" onclick="DOMManager.addCar('${carLot._id}')" class="btn btn-primary form-control">Add</button>
                    </div>
            </div>
        </div><br>`
      );
      for (let car of carLot.rooms) {
        $(`#${carLot._id}`).find(".card-body").append(
          `<p>
                <span id="name-${car._id}"><strong>Name: </strong> ${car.name}</span>
                <span id="year-${car._id}"><strong>Year: </strong> ${car.area}</span>
                <button class="btn btn-danger" onclick="DOMManager.deleteCar('${carLot._id}', '${car._id}')">Mark As Sold</button> </p>`
        );
      }
    }
  }
}
$("#create-new-carLot").on("click", () => {
  DOMManager.createCarLot($("#new-carLot-name").val());
  $("#new-carLot-name").val("");
});

DOMManager.getAllCarLots();
